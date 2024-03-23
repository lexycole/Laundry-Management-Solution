<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Service;
use App\Models\Subscription;
use App\Models\CustomerSubscription;
use App\Models\Category;
use App\Models\FareManagement;
use App\Models\Product;
use App\Models\Feedback;
use App\Models\AboutUs;
use App\Models\CustomerCard;
use App\Models\CustomerWalletHistory;
use App\Models\Notification;
use Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Cartalyst\Stripe\Stripe;
class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_name' => 'required',
            'phone_with_code' => 'required',
            'phone_number' => 'required|numeric|digits_between:9,20|unique:customers,phone_number',
            'email' => 'required|email|regex:/^[a-zA-Z]{1}/|unique:customers,email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }

        $options = [
            'cost' => 12,
        ];
        $input['password'] = password_hash($input["password"], PASSWORD_DEFAULT, $options);
        $input['status'] = 1;
        
        /*$stripe = new Stripe();
        $stripe_token = $stripe->customers()->create([
            'email' => $input['email'],
        ]);
        $input['stripe_token'] = $stripe_token['id'];*/
  
        $customer = Customer::create($input);

        if (is_object($customer)) {
            return response()->json([
                "result" => $customer,
                "message" => 'Registered Successfully',
                "status" => 1
            ]);
        } else {
            return response()->json([
                "message" => 'Sorry, something went wrong !',
                "status" => 0
            ]);
        }

    }
    

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $input['id'] = $id;
        $validator = Validator::make($input, [
            'id' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }

        $result = Customer::select('id', 'customer_name','phone_number','phone_with_code','email','profile_picture','status')->where('id',$id)->first();

        if (is_object($result)) {
            return response()->json([
                "result" => $result,
                "message" => 'Success',
                "status" => 1
            ]);
        } else {
            return response()->json([
                "message" => 'Sorry, something went wrong...',
                "status" => 0
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_name' => 'required',
            'email' => 'required|email|unique:customers,id,'.$id
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        if($request->password){
            $options = [
                'cost' => 12,
            ];
            $input['password'] = password_hash($input["password"], PASSWORD_DEFAULT, $options);
            $input['status'] = 1;
        }else{
            unset($input['password']);
        }

        if (Customer::where('id',$id)->update($input)) {
            return response()->json([
                "result" => Customer::select('id', 'customer_name','phone_number','phone_with_code','email','profile_picture','status')->where('id',$id)->first(),
                "message" => 'Success',
                "status" => 1
            ]);
        } else {
            return response()->json([
                "message" => 'Sorry, something went wrong...',
                "status" => 0
            ]);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

     public function login(Request $request)
    {

        $input = $request->all();
        $validator = Validator::make($input, [
            'phone_with_code' => 'required',
            'password' => 'required',
            'fcm_token' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }

        $credentials = request(['phone_with_code', 'password']);
        $customer = Customer::where('phone_with_code',$credentials['phone_with_code'])->first();

        if (!($customer)) {
            return response()->json([
                "message" => 'Invalid phone number or password',
                "status" => 0
            ]);
        }
        
        if (Hash::check($credentials['password'], $customer->password)) {
            if($customer->status == 1){
                
                Customer::where('id',$customer->id)->update([ 'fcm_token' => $input['fcm_token']]);
                $customer = Customer::where('phone_with_code',$credentials['phone_with_code'])->first();
                
                return response()->json([
                    "result" => $customer,
                    "message" => 'Success',
                    "status" => 1
                ]);   
            }else{
                return response()->json([
                    "message" => 'Your account has been blocked',
                    "status" => 0
                ]);
            }
        }else{
            return response()->json([
                "message" => 'Invalid phone number or password',
                "status" => 0
            ]);
        }

     }

    public function profile_picture(Request $request){

        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required',
            'profile_picture' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }

        if ($request->hasFile('profile_picture')) {
            $image = $request->file('profile_picture');
            $name = time().'.'.$image->getClientOriginalExtension();
            $destinationPath = public_path('/uploads/images');
            $image->move($destinationPath, $name);
            if(Customer::where('id',$input['customer_id'])->update([ 'profile_picture' => 'images/'.$name ])){
                return response()->json([
                    "result" => Customer::select('id', 'customer_name','phone_number','phone_with_code','email','profile_picture','status')->where('id',$input['customer_id'])->first(),
                    "message" => 'Success',
                    "status" => 1
                ]);
            }else{
                return response()->json([
                    "message" => 'Sorry something went wrong...',
                    "status" => 0
                ]);
            }
        }

    }

    public function forgot_password(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'phone_with_code' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }

        $customer = Customer::where('phone_with_code',$input['phone_with_code'])->first();
        

        if(is_object($customer)){
            $data['id'] = $customer->id;
            $data['otp'] = rand(1000,9999);
            if(env('MODE') != 'DEMO'){
                $message = "Hi, from ".env('APP_NAME'). "  , Your OTP code is:".$data['otp'];
                $this->sendSms($input['phone_with_code'],$message);
            }
            return response()->json([
                "result" => $data,
                "message" => 'Success',
                "status" => 1
            ]);
        }else{
            return response()->json([
                "result" => 'Please enter valid phone number',
                "status" => 0
            ]);
            
        }

    }  

    public function reset_password(Request $request){

        $input = $request->all();
        $validator = Validator::make($input, [
            'id' => 'required',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }

        $options = [
            'cost' => 12,
        ];
        $input['password'] = password_hash($input["password"], PASSWORD_DEFAULT, $options);

        if(Customer::where('id',$input['id'])->update($input)){
            return response()->json([
                "message" => 'Success',
                "status" => 1
            ]);
        }else{
            return response()->json([
                "message" => 'Sorry something went wrong',
                "status" => 0
            ]);
        }
    }  
    
    public function customer_wallet(Request $request){
        
        $input = $request->all();
        $validator = Validator::make($input, [
            'id' => 'required'
        ]);
        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        
        $data['wallet_amount'] = Customer::where('id',$input['id'])->value('wallet');
        
        $data['wallets'] = CustomerWalletHistory::where('customer_id',$input['id'])->get();
        
        if($data){
            return response()->json([
                "result" => $data,
                "count" => count($data),
                "message" => 'Success',
                "status" => 1
            ]);
        }else{
            return response()->json([
                "message" => 'Something went wrong',
                "status" => 0
            ]);
        }
    }
    
    public function add_wallet(Request $request){
        
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required',
            'amount' => 'required'
            
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        
        CustomerWalletHistory::create([ 'customer_id' => $input['customer_id'], 'type' => 1, 'message' => 'Successfully added to your wallet', 'message_ar' => 'تم الإضافة إلى محفظتك بنجاح','amount' => $input['amount']]);
        
        $old_wallet_amount = Customer::where('id',$input['customer_id'])->value('wallet');
        $new_wallet = $input['amount'] + $old_wallet_amount;
        Customer::where('id',$input['customer_id'])->update([ 'wallet' => $new_wallet]);
        
        return response()->json([
            "message" => 'Success',
            "status" => 1
        ]);
            
    }
    
    public function get_cards(Request $request){
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required'
        ]);
        
        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        
        $data =  CustomerCard::where('customer_id',$input['customer_id'])->get();
        return response()->json([
            "result" => $data,
            "message" => 'Success',
            "status" => 1
        ]);
    }
    
    public function delete_card(Request $request){
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required',
            'card_id' => 'required'
        ]);
        
        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        
        $customer_token = Customer::where('id',$input['customer_id'])->value('stripe_token');
        $card_token = CustomerCard::where('id',$input['card_id'])->value('card_token');
        $stripe = new Stripe();
        $card = $stripe->cards()->delete($customer_token, $card_token);
        CustomerCard::where('id',$input['card_id'])->delete();
        
        $default_card = CustomerCard::where('customer_id',$input['customer_id'])->where('is_default',1)->first();
        if(!is_object($default_card)){
            $last_card = CustomerCard::where('customer_id',$input['customer_id'])->orderBy('id','DESC')->first();
            if(is_object($last_card)){
                CustomerCard::where('id',$last_card->id)->update([ 'is_default' => 1]);
                $customer = $stripe->customers()->update($customer_token, [
                    'default_source' => $last_card->card_token
                ]);
            }
        }
        
        
        return response()->json([
            "message" => 'Success',
            "status" => 1
        ]);
    }
    
    public function add_card(Request $request){
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required',
            'number' => 'required',
            'exp_month' => 'required',
            'cvc' => 'required',
            'exp_year' => 'required'
            
        ]);
        
        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        
        $customer_token = Customer::where('id',$input['customer_id'])->value('stripe_token');
        
        $stripe = new Stripe();
        $token = $stripe->tokens()->create([
            'card' => [
                'number'    => $input['number'],
                'exp_month' => $input['exp_month'],
                'cvc'       => $input['cvc'],
                'exp_year'  => $input['exp_year'],
            ],
        ]);
        
        $card = $stripe->cards()->create($customer_token, $token['id']);
        
        $customer = $stripe->customers()->update($customer_token, [
            'default_source' => $card['id']
        ]);
        
        $data['customer_id'] = $input['customer_id'];
        $data['card_token'] = $card['id'];
        $data['last_four'] = $card['last4'];
        $data['is_default'] = 1;
        CustomerCard::create($data);
        
        CustomerCard::where('customer_id','=',$input['customer_id'])->where('card_token','!=',$card['id'])->update([ 'is_default' => 0 ]);
        return response()->json([
            "message" => 'Success',
            "status" => 1
        ]);
    }
    
    public function sendError($message) {
        $message = $message->all();
        $response['error'] = "validation_error";
        $response['message'] = implode('',$message);
        $response['status'] = "0";
        return response()->json($response, 200);
    } 
    
    public function check_phone(Request $request)
    {

        $input = $request->all();
        $validator = Validator::make($input, [
            'phone_with_code' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        $data = array();
        $customer = Customer::where('phone_with_code',$input['phone_with_code'])->first();

        if(is_object($customer)){
            $data['is_available'] = 1;
            $data['otp'] = "";
            return response()->json([
                "result" => $data,
                "message" => 'Success',
                "status" => 1
            ]);
        }else{
            $data['is_available'] = 0;
            $data['otp'] = rand(1000,9999);
            if(env('MODE') != 'DEMO'){
                $message = "Hi, from ".env('APP_NAME'). "  , Your OTP code is:".$data['otp'];
                $this->sendSms($input['phone_with_code'],$message);
            }
            return response()->json([
                "result" => $data,
                "message" => 'Success',
                "status" => 1
            ]);
        }
    }
    
    public function about_us(Request $request)
    {
        $input = $request->all();
        if($input['lang'] == 'en'){
            $data = AboutUs::where('id',1)->select('id','description','image')->first();
        }else{
            $data = AboutUs::where('id',1)->select('id','description_ar as description','image')->first();
        }

        return response()->json([
            "result" => $data,
            "message" => 'Success',
            "status" => 1
        ]);
    }
    
    public function add_feedback(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required',
            'title' => 'required',
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        
        Feedback::create($input);
        
        return response()->json([
            "message" => 'Success',
            "status" => 1
        ]);
    }
    
    public function get_services(Request $request)
    {
        $input = $request->all();
        if($input['lang'] == 'en'){
            $data = Service::where('status',1)->select('id','service_name','description','image','status')->get();
        }else{
            $data = Service::where('status',1)->select('id','service_name_ar as service_name','description_ar as description','image','status')->get();
        }
        
        return response()->json([
            "result" => $data,
            "message" => 'Success',
            "status" => 1
        ]);
    }
    
    public function get_fares(Request $request){
        $input = $request->all();
        $validator = Validator::make($input, [
            'service_id' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        
        $all_categories = Category::select('id','service_id')->where('status',1)->get();
        $find_ids = array();
        foreach ($all_categories as $key => $value) {
            if(is_array($value->service_id) && in_array($request->service_id, $value->service_id)){
                array_push($find_ids, $value->id);
            }
        }
        if($input['lang'] == 'en'){
            $categories = Category::select('id','category_name')->where('status',1)->whereIn('id',$find_ids)->get();
        }else{
            $categories = Category::select('id','category_name_ar as category_name')->where('status',1)->whereIn('id',$find_ids)->get();
        }
        
        foreach ($categories as $key => $value) {
            if($input['lang'] == 'en'){
                $categories[$key]['product'] = Product::where('status',1)->where('category_id',$value->id)->select('id','category_id','product_name','image','status')->get();
                foreach ( $categories[$key]['product'] as $key1 => $value1) {
                    $categories[$key]['product'][$key1]['price'] = FareManagement::where('service_id',$request->service_id)->where('category_id',$value->id)->where('product_id',$value1->id)->value('amount');
                }
            }else{
                $categories[$key]['product'] = Product::where('status',1)->where('category_id',$value->id)->select('id','category_id','product_name_ar as product_name','image','status')->get();
                foreach ( $categories[$key]['product'] as $key1 => $value1) {
                    $categories[$key]['product'][$key1]['price'] = FareManagement::where('service_id',$request->service_id)->where('category_id',$value->id)->where('product_id',$value1->id)->value('amount');
                }
            }
        }
        
        return response()->json([
            "result" => $categories,
            "message" => 'Success',
            "status" => 1
        ]);
    }
    
    public function get_subscription_packages(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        
        $data['subscriptions'] = DB::table('subscriptions')->where('status',1)->get();
        
        foreach($data['subscriptions'] as $key => $value){
            $data['subscriptions'][$key]->benefits = DB::table('subscription_benefits')
                                    ->join('services','services.id','=','subscription_benefits.service_id')
                                    ->join('categories','categories.id','=','subscription_benefits.category_id')
                                    ->join('products','products.id','=','subscription_benefits.product_id')
                                    ->where('subscription_benefits.sub_id','=',$value->id)
                                    ->select('services.service_name','categories.category_name','products.product_name','subscription_benefits.qty')
                                    ->get();
                                    
        }
        
        $data['existing_subscription_id'] = (int) Customer::where('id',$input['customer_id'])->value('cur_cus_sub_id');
        if($data['existing_subscription_id']){
            $existing_sub = DB::table('subscriptions')->where('id',DB::table('customer_subscriptions')->where('id',$data['existing_subscription_id'])->value('sub_id'))->first();
            $existing_sub->benefits = DB::table('subscription_benefits')
                                    ->join('services','services.id','=','subscription_benefits.service_id')
                                    ->join('categories','categories.id','=','subscription_benefits.category_id')
                                    ->join('products','products.id','=','subscription_benefits.product_id')
                                    ->where('subscription_benefits.sub_id','=',DB::table('customer_subscriptions')->where('id',$data['existing_subscription_id'])->value('sub_id'))
                                    ->select('services.service_name','categories.category_name','products.product_name','subscription_benefits.qty')
                                    ->get();

            $data['existing_subscription_details'] = $existing_sub;
        }
        
        return response()->json([
            "result" => $data,
            "message" => 'Success',
            "status" => 1
        ]);
    }
    
    public function buy_subscription(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required',
            'sub_id' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        
        $subscription = Subscription::where('id',$input['sub_id'])->first();
        
        if(is_object($subscription)){
            
            $data['customer_id'] = $input['customer_id'];
            $data['sub_id'] = $input['sub_id'];
            $data['start_date'] = date('Y-m-d');
            $data['end_date'] = date('Y-m-d', strtotime($data['start_date']. ' + '.$subscription->validity.' days'));
            
            $id = CustomerSubscription::create($data)->id;
            $last_cus_sub_id = Customer::where('id',$input['customer_id'])->value('last_cus_sub_id');
            Customer::where('id',$input['customer_id'])->update([ 'cur_cus_sub_id' => $id, 'last_cus_sub_id' => $last_cus_sub_id ]);
            return response()->json([
                "message" => 'Success',
                "status" => 1
            ]);
        }else{
            return response()->json([
                "message" => 'Sorry something went wrong',
                "status" => 0
            ]);
        }
    }
    
     public function get_notification_list(Request $request)
    {   
        $input = $request->all();
        $validator = Validator::make($input, [
            'customer_id' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->sendError($validator->errors());
        }
        if($input['lang'] == 'en'){
            $data = Notification::where('customer_id',$input['customer_id'])->orWhere('customer_id','==',0)->select('id','message','notification_type','status')->get();
        }else{
            $data = Notification::where('customer_id',$input['customer_id'])->orWhere('customer_id','==',0)->select('id','message_ar as message','notification_type','status')->get();
        }
        
        return response()->json([
            "result" => $data,
            "count" => count($data),
            "message" => 'Success',
            "status" => 1
        ]);
    }
}

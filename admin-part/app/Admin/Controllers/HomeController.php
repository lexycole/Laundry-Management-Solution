<?php

namespace App\Admin\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Zone;
use App\Models\DeliveryBoy;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Encore\Admin\Controllers\Dashboard;
use Encore\Admin\Layout\Column;
use Encore\Admin\Layout\Content;
use Encore\Admin\Layout\Row;
use Encore\Admin\Facades\Admin;

class HomeController extends Controller
{
    public function index(Content $content)
    {
        return Admin::content(function (Content $content) {

            $content->header('Dashboard');
            $data = array();
            $current_year = date("Y");
            $data['customers'] = Customer::where('status','!=',0)->count();
            $data['total_orders'] = Order::count();
            $data['completed_orders'] = Order::where('status','=',7)->count();
            $data['delivery_boys'] = DeliveryBoy::where('status','!=',0)->count();

            $customers = Customer::select('id', 'created_at')
                ->get()
                ->groupBy(function ($val) {
                    return Carbon::parse($val->created_at)->format('M');
                });
            $orders = Order::select('id', 'created_at')
                ->get()
                ->groupBy(function ($val) {
                    return Carbon::parse($val->created_at)->format('M');
                });
            $month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            $temp = [];
            foreach ($customers as $c) {
                $temp[Carbon::parse($c[0]->created_at)->format('M')] = count($c);
            }
            $growth = [];
            foreach ($month as $m) {
                if (isset($temp[$m])) {
                    $growth[] = $temp[$m];
                } else {
                    $growth[] = 0;
                }

            }
            $temp_orders = [];
            foreach ($orders as $o) {
                $temp_orders[Carbon::parse($o[0]->created_at)->format('M')] = count($o);
            }
            $growth_orders = [];
            foreach ($month as $m) {
                if (isset($temp_orders[$m])) {
                    $growth_orders[] = $temp_orders[$m];
                } else {
                    $growth_orders[] = 0;
                }

            }
            $data['customers_chart'] = implode(",", $growth);
            $data['orders_chart'] = implode(",", $growth_orders);

            $content->body(view('admin.dashboard', $data));
        });

    }
    
    public function create_zone($id){
        return Admin::content(function (Content $content) use ($id) {
            $content->header('Create Polygons');
            $data['id'] = $id;
            $content->body(view('zones.create_zones', $data));
        });
    }

    public function view_zone($id){
        return Admin::content(function (Content $content) use ($id) {
            $content->header('Create Polygons');
            $data['id'] = $id;
            $polygon = Zone::where('id',$id)->value('polygon');
            $polygon = explode(";",$polygon);
            $data['polygon'] = [];
            foreach($polygon as $key => $value){
               $value = explode(",",$value);
               if(@$value[1]){
                $data['polygon'][$key]['lat'] = floatval($value[0]);
                $data['polygon'][$key]['lng'] = floatval($value[1]);
               }
            }

            $data['polygon'] = json_encode($data['polygon'],TRUE);
            $content->body(view('zones.view_service_zones', $data));
        });
    }

}

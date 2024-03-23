import React, {Component} from 'react';
import { StyleSheet, View, Text, FlatList, Image, Alert, SafeAreaView, ScrollView, TouchableOpacity  } from 'react-native';
import { api_url, place_order, payment_list, img_url, bold, normal } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { Button } from 'react-native-elements'; 
import axios from 'axios'; 
import { connect } from 'react-redux';
import { orderServicePending, orderServiceError, orderServiceSuccess, paymentListPending, paymentListError, paymentListSuccess } from '../actions/PaymentActions';
import { reset } from '../actions/CartActions';
import { productReset } from '../actions/ProductActions';
import RadioForm from 'react-native-simple-radio-button';
import { CommonActions, TabActions } from '@react-navigation/native';
import strings from "../languages/strings.js";
import RazorpayCheckout from 'react-native-razorpay';
import  Loader  from '../components/GeneralComponents';

class Payment extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.select_payment_method = this.select_payment_method.bind(this);
      this.move_orders = this.move_orders.bind(this);
      this.state={
        payment_mode:1,
      }
      this.get_payments();
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

    razorpay = async() =>{
      console.log({currency: global.default_currency,
        key: global.razorpay_key,
        amount: this.props.total * 100,
        name: global.app_name,
        prefill:{
          contact: global.phone_with_code,
          name: global.customer_name, 
          email: global.email,
        }})

      var options = {
        currency: global.default_currency,
        key: global.razorpay_key,
        amount: this.props.total * 100,
        name: global.app_name,
        prefill:{
          contact: global.phone_with_code,
          name: global.customer_name,
          email: global.email,
        },
        theme: {color: colors.theme_fg}
      }
      RazorpayCheckout.open(options).then((data) => {
        console.log('razorpay')
        this.place_order('Razorpay');
      }).catch((error) => {
        alert('Transaction declined');
      });
    }

  place_order = async (payment_response) => {
    console.log({ customer_id: global.id, delivery_cost:global.delivery_cost, 
      payment_response:payment_response, payment_mode: this.state.payment_mode,
      address_id:this.props.address, pickup_date:this.props.pickup_date, 
      pickup_time:this.props.pickup_time, delivery_date:this.props.delivery_date, 
      delivery_time:this.props.delivery_time, total:this.props.total, 
      discount:this.props.discount, sub_total:this.props.sub_total, s_discount:this.props.s_discount,
      promo_id:this.props.promo_id, 
      items: Object.values(this.props.s_item) });
    this.props.orderServicePending();
    await axios({
      method: 'post', 
      url: api_url + place_order,
      data:{ customer_id: global.id, delivery_cost:global.delivery_cost, 
        payment_response:payment_response, payment_mode: this.state.payment_mode,
        address_id:this.props.address, pickup_date:this.props.pickup_date, 
        pickup_time:this.props.pickup_time, delivery_date:this.props.delivery_date, 
        delivery_time:this.props.delivery_time, total:this.props.total, 
        discount:this.props.discount, sub_total:this.props.sub_total, s_discount:this.props.s_discount,
        promo_id:this.props.promo_id, 
        items: JSON.stringify(Object.values(this.props.s_item)) }
    })
    .then(async response => {
      await this.props.orderServiceSuccess(response.data);
      if(response.data.status == 0){
       alert(response.data.message);
      }else{
        await this.open_success_popup();
      }
    })
    .catch(error => {
      alert(strings.sorry_something_went_wrong);
      this.props.orderServiceError(error);
    });
  }



  open_success_popup = async() =>{
    Alert.alert(
      strings.success,
      strings.your_order_successfully_placed,
      [
        { text: strings.ok, onPress: () => this.move_orders() }
      ],
      { cancelable: false }
    );
  }

  get_payments = async () => {

    this.props.paymentListPending();
    await axios({
      method: 'post', 
      url: api_url + payment_list,
      data:{ lang: global.lang }
    })
    .then(async response => {
     // alert(JSON.stringify(response));
      await this.props.paymentListSuccess(response.data.result);
    })
    .catch(error => {
      this.props.paymentListError(error);
    });
  }

  async move_orders(){
    await this.props.reset();
    await this.props.productReset();
    this.props
     .navigation.dispatch(
      CommonActions.reset({
       index: 0,
       routes: [{ name: "Home" }],
     })
    );
  }


  async select_payment_method(payment_mode){
    this.setState({ payment_mode : payment_mode});
    if(payment_mode == 1){
      this.place_order('cash');
    }else if(payment_mode == 2){
      this.razorpay();
    }else if(payment_mode == 3){
      this.place_order('Wallet');
    }
  }

  render() {

    const { isLoding, error, data, message, status, payments } = this.props
    
    return (
      <SafeAreaView style={{}}>
         <Loader visible={isLoding}/>
        <ScrollView style={{ margin:20 }} >
          {/*<RadioForm
            radio_props={radio_props}
            initial={0}
            animation={true}
            onPress={this.select_payment_method}
            labelStyle={styles.radio_style}
          />*/}
          <FlatList
            style={styles.list}
            data={payments}
            renderItem={({ item,index }) => (
              <View style={{ margin:10 }}>
                <TouchableOpacity onPress={() => this.select_payment_method(item.id)} style={styles.button}>
                  <View style={{ width:'20%',alignItems: 'flex-start', justifyContent:'center', padding:15}}>
                    <View style={{ height:25, width:25}}>
                      <Image style={{  height: undefined, width: undefined, flex:1 }} source={{uri:img_url+item.icon}} />
                    </View>
                  </View>
                  <View style={{ width:'80%',alignItems: 'flex-start', justifyContent:'center'}}>
                    <Text style={{ color:colors.grey, fontFamily:bold, fontSize:14 }}>{item.payment_mode}</Text>
                  </View>
                   
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.payment_mode}
          />
        </ScrollView>
    

        <Loader visible={isLoding} />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.payment.isLoding,
    error : state.payment.error,
    data : state.payment.data,
    message : state.payment.message,
    status : state.payment.status,
    payments : state.payment.payments,
    address : state.cart.address,
    delivery_cost : state.cart.delivery_cost,
    pickup_date : state.cart.pickup_date,
    pickup_time : state.cart.pickup_time,
    delivery_date : state.cart.delivery_date,
    delivery_time : state.cart.delivery_time,
    total : state.cart.total_amount,
    sub_total : state.cart.sub_total,
    discount : state.cart.promo_amount,
    promo_id : state.cart.promo_id,
    items : state.product.cart_items,
    s_discount : state.cart.s_discount,
    s_item : state.cart.s_item,
    s_total : state.cart.s_total,
  };
}

const mapDispatchToProps = (dispatch) => ({
    orderServicePending: () => dispatch(orderServicePending()),
    orderServiceError: (error) => dispatch(orderServiceError(error)),
    orderServiceSuccess: (data) => dispatch(orderServiceSuccess(data)),
    paymentListPending: () => dispatch(paymentListPending()),
    paymentListError: (error) => dispatch(paymentListError(error)),
    paymentListSuccess: (data) => dispatch(paymentListSuccess(data)),
    reset: () => dispatch(reset()),
    productReset: () => dispatch(productReset())
});


export default connect(mapStateToProps,mapDispatchToProps)(Payment);

const styles = StyleSheet.create({
  icon:{
    color:colors.theme_fg
  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  title:{
    color:colors.theme_fg,
      
    fontSize:16, 
    fontFamily:bold
  },
  radio_style:{
    marginLeft:20, 
    fontSize: 17, 
    color: colors.theme_bg, 
    fontFamily:bold
  },
  footer:{
    backgroundColor:'transparent'
  },
  footer_content:{
    width:'90%'
  },
  button: {
    paddingLeft:10,
    paddingRight:10,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor:colors.theme_fg_three,
    height:45
  },
});

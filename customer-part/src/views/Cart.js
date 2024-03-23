import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import  Loader  from '../components/GeneralComponents';
import { bold, normal, plus, minus, calculate_subtotal, api_url } from '../config/Constants';
import { connect } from 'react-redux';
import { subTotal, total, calculatePricing, selectDate, deliveryCost, totalItem, reset, sDiscount, sTotal, sItem } from '../actions/CartActions';
import { addToCart, productReset } from '../actions/ProductActions';
import Snackbar from 'react-native-snackbar';
import * as colors from '../assets/css/Colors';
import strings from "../languages/strings.js";
import Icon, { Icons } from '../components/Icons';
import UIStepper from 'react-native-ui-stepper'; 
import { useNavigation, CommonActions } from '@react-navigation/native';
import axios from 'axios';

const Cart = (props) => {
  const navigation = useNavigation();
  const [deliveryDatePickerVisible, setDeliveryDatePickerVisible] = useState(false);
  const [isLoding, setLoding] = useState(false);
  const [onLoaded, setOnLoaded] = useState(0);
  const [promo_code, setPromoCode] = useState(props.promo);

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      props.deliveryCost(global.delivery_cost);
      calculate_subtotal_api(props.sub_total);
      //calculate_total(props.sub_total);
    });
    return unsubscribe;
  },[]);

  const calculate_subtotal_api = async(st) => {
    setLoding(true)
    await axios({
      method: 'post', 
      url: api_url + calculate_subtotal,
      data:{ customer_id: global.id, items:JSON.stringify(Object.values(props.cart_items)), subtotal : st }
    })
    .then(async response => {
      await props.sTotal(response.data.result.sub_total);
      let items = await JSON.parse(response.data.result.items);
      console.log('test');
      console.log(props.promo)
      await props.sItem(items);
      await props.sTotal(response.data.result.sub_total);
      await props.sDiscount(response.data.result.s_discount);
      calculate_total(response.data.result.sub_total)
      setTimeout(()=>{ setOnLoaded(1) }, 1000);
    })
    .catch(error => {
      setLoding(false)
    });
  }

  const showDeliveryDatePicker = () => {
    setDeliveryDatePickerVisible(true);
  };
 
  const  hideDeliveryDatePicker = () => {
    setDeliveryDatePickerVisible(false);
  };
 
  const handleDeliveryDatePicked = async(date) => {
    setDeliveryDatePickerVisible(false);
    var d = new Date(date);
    let delivery_date = d.getDate() + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    await props.selectDate(delivery_date);
  };

  const calculate_total = async(sub_total) =>{
    setLoding(false);
    if(props.sub_total != 0){
      props.deliveryCost(global.delivery_cost);
      if(props.promo == undefined){
        props.total({ promo_amount:0, total:parseFloat(parseFloat(sub_total) + parseFloat(global.delivery_cost)) });
      }else{
        if(props.promo.promo_type == 1){
          props.total({ promo_amount:props.promo.discount, total:parseFloat(sub_total - props.promo.discount) + parseFloat(global.delivery_cost) });
        }else{
          let discount = (props.promo.discount /100) * sub_total;
          props.total({ promo_amount: discount, total:parseFloat(sub_total - discount) + parseFloat(global.delivery_cost) });
        }
      }
    }else{
      handleBackButtonClick();
    }
  }
  
  const handleBackButtonClick= () => {
      address_list();
  }

  const address_list = () => {
    props.navigation.navigate('AddressList');
  }

  const select_address = () => {
    props.navigation.navigate('Payment');
  }

/*  get_delivery_charge = async () => {
    this.setState({ isLoding:true });
    await axios({
      method: 'post', 
      url: api_url + get_delivery_charge,
      data:{ address_id: this.props.address }
    })
    .then(async response => {
      this.setState({ isLoding:false });
      this.props.deliveryCost(response.data.result);
    })
    .catch(error => {
      this.setState({ isLoding:false });
      alert('Sorry, something went wrong')
    });
  }*/

  const showSnackbar = (msg) =>{
    Snackbar.show({
      title:msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  const add_to_cart = async(qty,product_id,product_name,price,service_id,service_name,category_id) => {
    let cart_items = await props.cart_items;
    let total_item = await props.total_item;
    let old_product_details = await cart_items[service_id + '-' + product_id];
    let sub_total = await parseFloat(props.sub_total);
    let total_price = await parseFloat(qty * price);

    
   if(old_product_details != undefined && total_price > 0){
      let final_price = await parseFloat(total_price) - parseFloat(old_product_details.price);
      sub_total = await parseFloat(sub_total) + parseFloat(final_price);
   }else if(total_price > 0){
     let final_price = await parseFloat(price);
     sub_total = await parseFloat(sub_total) + parseFloat(final_price);
     await props.totalItem(parseInt(total_item) + 1);
   }

    if(qty > 0){
       let product_data = await {
         service_id: service_id,
         service_name: service_name,
         product_id: product_id,
         product_name: product_name,
         category_id: category_id,
         qty: qty,
         unit_price:price,
         price: parseFloat(qty * price)
       }
       console.log(sub_total)
       cart_items[service_id + '-' + product_id] = await product_data;
       await props.totalItem(Object.keys(cart_items).length);
       await props.addToCart(cart_items);
       await props.subTotal(sub_total);
       await calculate_subtotal_api(sub_total);
       //calculate_total(sub_total);
    }else{
       sub_total = await parseFloat(sub_total) - parseFloat(price);
       if(sub_total == 0){
        await props.reset();
        await props.productReset();
        await props.totalItem(0);
        navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
          })
        );
       }else{
        delete cart_items[service_id + '-' + product_id];
        await props.addToCart(cart_items);
        await props.totalItem(Object.keys(cart_items).length);
       }
       
       
      /* await props.addToCart(cart_items);
       await props.totalItem(Object.keys(cart_items).length);*/
       await props.subTotal(sub_total);
       
       calculate_subtotal_api(sub_total);
       //calculate_total(sub_total);
       
    }
 }

  const check_promo = () => {
    props.navigation.navigate('Promo');
  }
    return (
      <SafeAreaView style={{ width:'100%', height:'100%', backgroundColor:colors.theme_bg_three}}>
        <TouchableOpacity onPress={handleBackButtonClick.bind(this)} style={{ padding:10, paddingTop:20}}>
          <Icon type={Icons.Ionicons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize:30}} /> 
        </TouchableOpacity>
        {onLoaded ==1 &&
          <ScrollView style={{ margin:10 }}>
            <View style={{ flexDirection:'row' }} >
              <View>
                <Text style={{fontFamily:bold,color:colors.theme_fg_two, fontSize:16 }} >{strings.your_clothes}</Text>
              </View>
            </View>
            <View style={{ margin:10 }} />  
            {Object.keys( props.cart_items).map(function(key) {
              return (
                <View style={{ flexDirection:'row', marginBottom:10 }}>
                  <View style={{ width:'50%', alignItems:'center', justifyContent:'center'  }} >
                    <Text style={{fontSize:14, color:colors.theme_fg, fontFamily:bold}} >{props.cart_items[key].product_name} ( {props.cart_items[key].service_name} )</Text>
                    <View style={{ margin:2 }}/>
                  </View>
                  <View style={{ width:'25%', alignItems:'center', justifyContent:'center'  }} >
                    <UIStepper
                      onValueChange={(value) => { add_to_cart(value,props.cart_items[key].product_id,props.cart_items[key].product_name,props.cart_items[key].unit_price,props.cart_items[key].service_id,props.cart_items[key].service_name,props.cart_items[key].category_id) }}
                      displayValue={true}
                      initialValue={props.cart_items[key].qty ? props.cart_items[key].qty : 0}
                      value={props.cart_items[key].qty ? props.cart_items[key].qty : 0}
                      borderColor={colors.theme_bg_three}
                      textColor={colors.theme_bg}
                      tintColor={colors.theme_bg}
                      height={25}
                      incrementImage={plus}
                      decrementImage={minus}
                      imageHeight={50}
                      imageWidth={40}
                    />
                  </View>
                  <View style={{ width:'25%', alignItems:'center', justifyContent:'center'  }} >
                    <Text style={{fontSize:14, color:colors.theme_fg, fontFamily:bold}} >{props.cart_items[key].qty} x {global.currency}{props.cart_items[key].unit_price}</Text>
                    <View style={{ margin:2}}/>
                    <Text style={{fontSize:12, color:colors.theme_fg, fontFamily:bold}}>( {global.currency}{props.cart_items[key].price} )</Text>
                  </View>
                </View>
              )
            })}
            <View style={{ margin:10 }} />  
            { props.promo === undefined ?
            <View style={{ flexDirection:'row' }} >
              <View style={{ width:'10%', alignItems:'flex-start', flexDirection:'row' }} >
                <Icon type={Icons.Ionicons} name="ios-pricetags" color={colors.theme_fg} style={{ fontSize:20 }} /> 
              </View> 
              <View style={{ width:'90%', alignItems:'flex-start' }} >
                <Text style={{ fontSize:12, fontFamily:normal,color:colors.theme_description }} >{strings.no_promotion_applied_choose_your_promotion_here}</Text>
                <View style={{ margin:5 }} />  
                <Text onPress={() => check_promo()} style={styles.choose_promotion}>{strings.choose_promotion}</Text>
              </View>
            </View> :  
            <View style={{ padding:10, flexDirection:'row' }} >
              <View style={{ width:50 }} >
                <Icon type={Icons.Ionicons} name="ios-pricetags" color={colors.theme_fg} style={{ fontSize:20 }} /> 
              </View>
              <View>
                <Text style={styles.promotion_applied} >Promotion applied</Text>
                <Text style={{ fontSize:12, fontFamily:normal,color:colors.theme_fg }} >{strings.you_are_saving} {global.currency}{parseFloat(props.promo_amount).toFixed(1)}</Text>
                <Text onPress={() => check_promo()} style={styles.change_promo}>Change promo</Text>
              </View>
            </View>
            }
            <View style={{ margin:10 }} />  
            <Divider style={{ backgroundColor: colors.theme_fg }} />
            <View style={{ margin:10 }} />  
            <View style={{ flexDirection:'row', width:'100%'}} >
              <View style={{ width:'60%', alignItems:'flex-start', flexDirection:'row' }} >
                <Text style={{fontFamily:normal,color:colors.theme_fg_two, fontSize:14 }} >{strings.subtotal}</Text>
              </View>
              <View style={{ width:'40%', alignItems:'flex-end' }} >
                <Text style={{fontFamily:normal,color:colors.theme_fg_two, fontSize:14 }} >{global.currency}{props.sub_total}</Text>
              </View>
            </View>
            {props.s_discount > 0 && 
              <View>
                <View style={{ margin:5 }} />
                <View style={{ flexDirection:'row', width:'100%'}} >
                  <View style={{ width:'60%', alignItems:'flex-start', flexDirection:'row' }} >
                    <Text style={{fontFamily:normal,color:colors.theme_fg_two, fontSize:14 }} >Subscription Discount</Text>
                  </View>
                  <View style={{ width:'40%', alignItems:'flex-end' }} >
                    <Text style={{fontFamily:normal,color:'green', fontSize:14 }} >-{global.currency}{props.s_discount}</Text>
                  </View>
                </View>
              </View>
            }
            <View style={{ margin:5 }} />  
            <View style={{ flexDirection:'row', width:'100%'}} >
              <View style={{ width:'60%', alignItems:'flex-start', flexDirection:'row' }} >
                <Text style={{fontFamily:normal,color:colors.theme_fg_two, fontSize:14 }} >{strings.discount}</Text>
              </View>
              <View style={{ width:'40%', alignItems:'flex-end' }} >
              <Text style={{fontFamily:normal,color:colors.theme_fg_two, fontSize:14 }}  >{global.currency}{parseFloat(props.promo_amount).toFixed(1)}</Text>
              </View>
            </View>
            <View style={{ margin:5 }} />  
            <View style={{ flexDirection:'row', width:'100%'}} >
              <View style={{ width:'60%', alignItems:'flex-start', flexDirection:'row' }} >
                <Text style={{fontFamily:normal,color:colors.theme_fg_two, fontSize:14 }} >{strings.delivery_cost}</Text>
              </View>
              <View style={{ width:'40%', alignItems:'flex-end' }} >
              <Text style={{fontFamily:normal,color:colors.theme_fg_two, fontSize:14 }} >{global.currency}{props.delivery_cost}</Text>
              </View>
            </View>
            <View style={{ margin:10 }} />  
            <View style={{ borderBottomWidth:0.5, borderColor:colors.theme_fg_two ,}} /> 
            <View style={{ margin:10 }} />   
            <View style={{ flexDirection:'row', width:'100%'}} >
              <View style={{ width:'60%', alignItems:'flex-start', flexDirection:'row' }} >
                <Text style={{color:colors.theme_fg_two, fontSize:16, fontFamily:bold}}>{strings.total}</Text>
              </View>
              <View style={{ width:'40%', alignItems:'flex-end' }} >
              <Text style={{color:colors.theme_fg_two, fontSize:16, fontFamily:bold}}>{global.currency}{props.total_amount}</Text>
              </View>
            </View>
            <View style={{ margin:10 }} />  
            <View style={{ borderBottomWidth:0.5, borderColor:colors.theme_fg_two ,}} /> 
            <View style={{ margin:15 }} />  
          </ScrollView>
}
          <TouchableOpacity style={styles.footer}>
            <Button
              title={strings.next}
              onPress={select_address}
              buttonStyle={{ backgroundColor:colors.theme_fg, padding:10, borderRadius:10}}
              titleStyle={{ fontFamily:bold,color:colors.theme_fg_three, fontSize:14 }}
            />
          </TouchableOpacity> 
          <Loader visible={isLoding} />
        </SafeAreaView>
    );
}

function mapStateToProps(state){
  return{
    cart_items : state.product.cart_items,
    sub_total : state.cart.sub_total,
    total_item : state.cart.total_item,
    promo : state.cart.promo,
    total_amount : state.cart.total_amount,
    promo_amount : state.cart.promo_amount,
    delivery_cost : state.cart.delivery_cost,
    isLoding : state.cart.isLoding,
    delivery_date : state.cart.delivery_date,
    address : state.cart.address,
    s_discount : state.cart.s_discount,
    s_item : state.cart.s_item,
    s_total : state.cart.s_total,
  };
}

const mapDispatchToProps = (dispatch) => ({
    subTotal: (data) => dispatch(subTotal(data)),
    deliveryCost: (data) => dispatch(deliveryCost(data)),
    total: (data) => dispatch(total(data)),
    calculatePricing: () => dispatch(calculatePricing()),
    selectDate: (data) => dispatch(selectDate(data)),
    addToCart: (data) => dispatch(addToCart(data)),
    totalItem: (data) => dispatch(totalItem(data)),
    reset: () => dispatch(reset()),
    productReset: () => dispatch(productReset()),
    sDiscount: (data) => dispatch(sDiscount(data)),
    sTotal: (data) => dispatch(sTotal(data)),
    sItem: (data) => dispatch(sItem(data)),
});


export default connect(mapStateToProps,mapDispatchToProps)(Cart);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header:{
    
  },
  icon:{
    color:colors.theme_fg
  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg,
    alignSelf:'center', 
    fontSize:16, 
    fontFamily:bold
  },
  qty:{
    fontSize:14, 
    color:colors.theme_fg, 
    fontFamily:bold
  },
  promotion_applied:{
    fontSize:15, 
    color:colors.theme_fg, 
    fontFamily:bold
  },
  choose_promotion:{
    color:colors.theme_fg, 
    fontFamily:bold
  },
  change_promo:{
    color:colors.theme_description, 
    fontSize:13,
    fontFamily:normal
  },
  sub_total:{
    paddingLeft:20, 
    paddingRight:20, 
    paddingTop:10
  },
  discount:{
    paddingLeft:20, 
    paddingRight:20, 
    paddingTop:10
  },
  total:{
    paddingLeft:20, 
    paddingRight:20, 
    paddingTop:10, 
    paddingBottom:10
  },
  total_amount:{ 
    color:colors.theme_fg,
    fontFamily:normal
  },
  delivery_date:{
    padding:20, 
    justifyContent:'center',
    color:colors.theme_fg
  },
  delivery_date_text:{
    color:colors.theme_fg, 
    marginBottom:20
  },
  footer_content:{
    width:'90%'
  },
  select_address:{
    fontFamily:normal
  },
  your_clothes:
  {
    fontFamily:normal,
    color:colors.theme_fg
  },
  subtotal:
  {
    fontFamily:normal,
    color:colors.theme_fg
  },
  dis_count:
  {
    fontFamily:normal,
    color:colors.theme_fg
  },
  totalall:
  {
    fontFamily:normal,
    color:colors.theme_fg
  },
  footer:{
    backgroundColor:'transparent',
    position:'absolute',
    bottom:10,
    width:'90%',
    marginLeft:'5%',
    marginRight:'5%'
  },
  button: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    height:45
  },

});


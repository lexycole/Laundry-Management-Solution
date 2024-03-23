import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import UIStepper from 'react-native-ui-stepper'; 
import { img_url, api_url, product, height_30, no_data, plus, minus, bold, normal } from '../config/Constants';
import  Loader  from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess, addToCart } from '../actions/ProductActions';
import {  subTotal, totalItem } from '../actions/CartActions';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from "../languages/strings.js";
import CardView from 'react-native-cardview';
import Icon, { Icons } from '../components/Icons';

class Product extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        service_id:this.props.route.params.id,
        service_name:this.props.route.params.service_name,
        products:[],
        active_index:0
      }
  }

async componentDidMount(){
  this._unsubscribe=this.props.navigation.addListener('focus',()=>{
    this.Product();
  });
}

componentWillUnmount(){
  this._unsubscribe();
}

Product = async () => {
  this.props.serviceActionPending();
  await axios({
    method: 'post', 
    url: api_url + product,
    data:{ service_id: this.state.service_id, lang: global.lang }
  })
  .then(async response => {
      await this.props.serviceActionSuccess(response.data)
      if(response.data.result.length > 0){
        await this.setState({ active_index : response.data.result[0].id, products:response.data.result[0].product  })
      }
  })
  .catch(error => {
      this.props.serviceActionError(error);
  });
}

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  add_to_cart = async (qty,product_id,product_name,price,category_id) => {
     let cart_items = this.props.cart_items;
     let total_item = this.props.total_item;
     let old_product_details = cart_items[this.state.service_id + '-' + product_id];
     let sub_total = parseFloat(this.props.sub_total);
     let total_price = parseFloat(qty * price);

     
    if(old_product_details != undefined && total_price > 0){
       let final_price = parseFloat(total_price) - parseFloat(old_product_details.price);
       sub_total = parseFloat(sub_total) + parseFloat(final_price);
    }else if(total_price > 0){
      let final_price = parseFloat(price);
      sub_total = parseFloat(sub_total) + parseFloat(final_price);
      await this.props.totalItem(parseInt(total_item) + 1);
    }
    if(qty > 0){
        let product_data = {
          service_id: this.state.service_id,
          service_name: this.state.service_name,
          product_id: product_id,
          category_id: category_id,
          product_name: product_name,
          qty: qty,
          unit_price:price,
          price: parseFloat(qty * price)
        }
        cart_items[this.state.service_id + '-' + product_id] = product_data;
        await this.props.totalItem(Object.keys(cart_items).length);
        await this.props.addToCart(cart_items);
        await this.props.subTotal(sub_total);
     }else{
        delete cart_items[this.state.service_id + '-' + product_id];
        await this.props.totalItem(Object.keys(cart_items).length);
        let sub = parseFloat(sub_total) - parseFloat(price);
        console.log('hi');
        if(sub > 0){
          await this.props.addToCart(cart_items);
        }else{
          await this.props.addToCart([]);
        }
        await this.props.subTotal(sub);
     }
     
  }

  cart = () => {
    //this.props.navigation.navigate('Cart');
    this.props.navigation.navigate('PickupDate', {service_id:this.state.service_id, service_name:this.state.service_name});
  }

  change_index = async(index,products) =>{
    this.setState({ products:[] })
    this.setState({ active_index : index, products:products });
  }

  render() {

    const { isLoding, error, data, message, status, cart_items, cart_count, navigation, total_item } = this.props
    return (
      <SafeAreaView style={{ width:'100%', height:'100%'}}>
        { data != 0 && data != undefined && 
        <ScrollView>
          <View style={{ margin:10 }} />
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {data.map((row, index) => (
            <CardView
              cardElevation={5}
              style={ (this.state.active_index == row.id) ? styles.active_badge : styles.inactive_badge}
              cardMaxElevation={5}
              cornerRadius={10}>
              <TouchableOpacity activeOpacity={1} onPress={this.change_index.bind(this,row.id,row.product)} style={{ padding:10 }}>
                  <Text style={ (this.state.active_index == row.id) ? styles.active_text : styles.inactive_text}>{row.category_name}</Text>
              </TouchableOpacity>
            </CardView>
          ))}
          </ScrollView>
          <View style={{ margin:5 }} />
          <FlatList
            data={this.state.products}
            renderItem={({ item,index }) => (
              <CardView
                cardElevation={5}
                style={{ padding:10, margin:10 }}
                cardMaxElevation={5}
                cornerRadius={10}>
                <View style={{ flexDirection:'row',padding:10, width:'100%' }} >
                  <View style={{ width:'25%', alignItems:'flex-start', justifyContent:'center' }} >
                    <View style={styles.image_container} >
                      <Image
                        style= {{flex:1 , width: undefined, height: undefined}}
                        source={{uri : img_url + item.image }}
                      />
                    </View>
                  </View>
                  <View style={{ width:'50%', alignItems:'center', justifyContent:'center' }}>
                    <Text style={styles.product_name} >{item.product_name}</Text>
                    <View style={{ marginTop:10 }} >
                      <UIStepper
                        onValueChange={(value) => { this.add_to_cart(value,item.id,item.product_name,item.price,item.category_id) }}
                        displayValue={true}
                        initialValue={cart_items[this.state.service_id + '-' + item.id] ? cart_items[this.state.service_id + '-' + item.id].qty : 0 }
                        value={cart_items[this.state.service_id + '-' + item.id] ? cart_items[this.state.service_id + '-' + item.id].qty : 0 }
                        borderColor={colors.theme_bg}
                        textColor={colors.theme_bg}
                        tintColor={colors.theme_bg}
                      />
                    </View>
                  </View>
                  <View style={{ width:'25%', alignItems:'flex-end', justifyContent:'center' }}>
                    <Text style={styles.price} >{global.currency} {item.price}/</Text>
                    <Text style={styles.piece} >Qty</Text>
                  </View>
                </View>
              </CardView>
                
            )}
            keyExtractor={item => item.faq_name}
          />
        </ScrollView>
        }
        {data == 0 && <View style={{ alignItems:'center', justifyContent:'center', height:'100%', width:'100%' }} >
            <Text style={{ fontFamily:bold, fontSize:14 }}>{no_data}</Text>
        </View>}
        {cart_count ?
        <TouchableOpacity activeOpacity={1}  style={styles.footer}>
          <TouchableOpacity activeOpacity={1}  onPress={this.cart} style={styles.button}>
            <View style={{ width:'50%', alignItems:'flex-start', justifyContent:'center'}}>
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>{strings.subtotal} : {global.currency+this.props.sub_total}</Text>
            </View>
            <View style={{ width:'50%', alignItems:'flex-end', justifyContent:'center'}}>
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>{strings.view_cart}</Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>: null }

        <Loader visible={isLoding} />
        <View style={{ marginBottom:50 }} />
      </SafeAreaView>
      
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.product.isLoding,
    error : state.product.error,
    data : state.product.data,
    total_item : state.cart.total_item,
    message : state.product.message,
    status : state.product.status,
    cart_items : state.product.cart_items,
    cart_count : state.product.cart_count,
    sub_total : state.cart.sub_total
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
    addToCart: (data) => dispatch(addToCart(data)),
    totalItem: (data) => dispatch(totalItem(data)),
    subTotal: (data) => dispatch(subTotal(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(Product);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  list:{
    backgroundColor: colors.theme_bg,
  },
  header:{
    backgroundColor:colors.theme_bg
  },
  icon:{
    color:colors.theme_fg
  },
  header_body: {
    flex: 3,
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg,
    alignSelf:'center', 
    fontSize:16, 
    fontFamily:bold
  },
  image_container:{
    height:75, 
    width:75
  },
  product_name:{
    fontSize:15, 
    fontFamily:bold, 
    color:colors.theme_fg
  },
  price:{
    fontSize:15, 
    color:colors.theme_fg,
    fontFamily:bold
  },
  piece:{
    fontSize:12, 
    color:colors.theme_fg,
    fontFamily:bold
  },
  view_cart_container:{
    alignItems:'flex-start',
    justifyContent:'center'
  },
  view_cart:{
    color:colors.theme_fg, 
    fontFamily:bold,
    fontSize:14
  },
  active_badge:{
    margin:5, 
    backgroundColor:colors.theme_bg
  },
  active_text:{
    fontSize:14, 
    fontFamily:normal, 
    color:colors.theme_fg_three
  },
  inactive_badge:{
    margin:5, 
    backgroundColor:colors.theme_bg_three
  },
  inactive_text:{
    fontSize:14, 
    fontFamily:normal, 
    color:colors.theme_fg_two
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
    height:45,
  },
});


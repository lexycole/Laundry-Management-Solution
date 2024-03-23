import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import UIStepper from 'react-native-ui-stepper';
import { img_url, api_url, product_search, bold, normal } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess, addToCart, productReset } from '../actions/ProductActions';
import {  subTotal, totalItem } from '../actions/CartActions';
import Icon, { Icons } from '../components/Icons';

class Search extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        products:[],
        service_id:this.props.route.params.service_id,
        service_name:this.props.route.params.service_name,
      }
  }

search_Product = async (search) => {
  //this.props.serviceActionPending();
  await axios({
    method: 'post', 
    url: api_url + product_search,
    data:{ search:search, lang:global.lang }
  })
  .then(async response => {
     // await this.props.serviceActionSuccess(response.data)
      if(response.data.result.length > 0){
        await this.setState({ products:response.data.result })
      }
  })
  .catch(error => {
    console.log(error)
    //  this.props.serviceActionError(error);
  });
}

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  add_to_cart = async (qty,product_id,product_name,price) => {
    console.log(qty,product_id,product_name,price)
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
          product_name: product_name,
          qty: qty,
          price: parseFloat(qty * price)
        }
        cart_items[this.state.service_id + '-' + product_id] = product_data;
        await this.props.totalItem(Object.keys(cart_items).length);
        await this.props.addToCart(cart_items);
        await this.props.subTotal(sub_total);
     }else{
      this.props.productReset();
      this.props.subTotal(parseFloat(sub_total) - parseFloat(price));
     }
     
  }

  cart = () => {
    this.props.navigation.navigate('PickupDate');
  }

  change_index = async(index,products) =>{
    await this.setState({ products:[] })
    await this.setState({ active_index : index, products:products });
  }
  render() {

    const { error, data, message, status, cart_items, cart_count, navigation, total_item } = this.props

    return (
      <SafeAreaView style={{ width:'100%', height:'100%', padding:10}}>
        <TouchableOpacity activeOpacity={1} onPress={this.handleBackButtonClick}>
          <Icon style={styles.textFieldIcon} type={Icons.Ionicons} name="close-circle-outline" />
        </TouchableOpacity>
        { data != 0 && data != undefined && 
        <ScrollView>
          <View style={{ margin:10 }} />
            <View style={styles.searchBarContainer}>
                <View
                    style={styles.textFieldcontainer}>
                    <TextInput
                    style={styles.textField}
                    placeholder="Type to find...."
                    underlineColorAndroid="transparent"
                    onChangeText={text => this.search_Product(text)}
                    />
                </View>
            </View>
          <View style={{ margin:10 }} />
          <FlatList
            data={this.state.products}
            renderItem={({ item,index }) => (
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
                        onValueChange={(value) => { this.add_to_cart(value,item.id,item.product_name,item.price) }}
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
                    <Text style={styles.piece} >Piece</Text>
                  </View>
                </View>
            )}
            keyExtractor={item => item.faq_name}
          />
        </ScrollView>
        }
      </SafeAreaView>
      
    );
  }
}

function mapStateToProps(state){
  return{
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
    subTotal: (data) => dispatch(subTotal(data)),
    productReset: () => dispatch(productReset())
});


export default connect(mapStateToProps,mapDispatchToProps)(Search);

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
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  textFieldIcon: {
    fontSize:30, 
    color:'#000000'
  },
  textField: {
    flex: 1,
    padding: 5,
    height: 45,
    fontFamily:normal,
    fontSize:14,
    color:colors.theme_fg_two
  },
  searchBarContainer:{
    borderColor:colors.theme_bg_four, 
    borderRadius:10,
    borderWidth:1, 
    height:40,
  },
});


import React, {Component} from 'react';
import { StyleSheet, TouchableOpacity, Image, View, SafeAreaView, ScrollView, Text, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular , img_url, api_url, online_payment_list, add_subscription, app_name } from '../config/Constants';
import axios from 'axios'; 
import { connect } from 'react-redux';
import { paymentListPending, paymentListError, paymentListSuccess } from '../actions/PaymentActions';
import  Loader  from '../components/GeneralComponents';
import RazorpayCheckout from 'react-native-razorpay';
import RBSheet from "react-native-raw-bottom-sheet";
import strings from '../languages/strings';

class SubscriptionDetails extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      show_info:'',
      isLoading:false,
      data:this.props.route.params.item
    }
    this.get_payments();
  }

  open_rb_sheet = () =>{
    this.RBSheet.open();
  }

  get_payments = async () => {
    this.props.paymentListPending();
    await axios({
      method: 'post', 
      url: api_url + online_payment_list,
      data:{ lang: global.lang }
    })
    .then(async response => {
      await this.props.paymentListSuccess(response.data.result);
    })
    .catch(error => {
      this.props.paymentListError(error);
    });
  }

  select_payment_method = async (payment_mode) =>{
    this.RBSheet.close();
    if(payment_mode == 2){
      this.razorpay();
    }
  }

  razorpay = async() =>{
    console.log({currency: global.default_currency,
      key: global.razorpay_key,
      amount: this.state.data.sub_fee * 100,
      name: app_name,
      prefill:{
        contact: global.phone_with_code,
        name: global.customer_name
      }})

    var options = {
      currency: global.default_currency,
      key: global.razorpay_key,
      amount: this.state.data.sub_fee * 100,
      name: global.app_name,
      prefill:{
        contact: global.phone_with_code,
        name: global.customer_name
      },
      theme: {color: colors.theme_fg}
    }
    RazorpayCheckout.open(options).then((data) => {
      this.buy_subscription();
    }).catch((error) => {
      alert('Transaction declined');
    });
  }

  buy_subscription = async () => {
    console.log({ customer_id: global.id, sub_id:this.state.data.id })
    this.setState({ isLoading : true });
    await axios({
      method: 'post', 
      url: api_url + add_subscription,
      data:{ customer_id: global.id, sub_id:this.state.data.id }
    })
    .then(async response => {
      this.setState({ isLoading : false });
      console.log(response.data.status)
      if(response.data.status == 1){
        alert('Your subscription done successfully')
        this.handleBackButtonClick();
      }

    })
    .catch(error => {
      this.setState({ isLoading : false });
      alert('Sorry something went wrong')
    });
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor:colors.theme_fg_three, flex:1}}>
        <Loader visible={this.state.isLoading} />
        <ScrollView showsHorizontalScrollIndicator={false} style={{ padding:10 }}>
          <View style={{height:110, width:'100%', borderRadius:40}}>
            <Image style= {{ height: undefined,width: undefined,flex: 1,borderRadius:10 }} source={{uri: img_url+this.state.data.sub_image}} />
            <View style={{ width:'100%', padding:20, position:'absolute', top:0, alignItems:'center', justifyContent:'center'}}>
              <View style={{ flexDirection:'row' }} >
                <View style={{ width:'100%', alignItems:'flex-start', justifyContent:'center' }}>
                  <Text style={{ fontFamily:bold, fontSize:16, color:colors.theme_bg_three, letterSpacing:0.5}}>{this.state.data.sub_name}</Text> 
                  <View style={{ margin:2 }} />
                  <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_bg_three}}>{this.state.data.sub_description}</Text> 
                  <View style={{ margin:2 }} />
                  <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_bg_three}}>{this.state.data.validity_label} -[ {this.state.data.validity} ] {strings.days}</Text> 
                </View> 
              </View>  
            </View> 
          </View>
          <View style={{ margin:10 }}/>
          <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>{strings.your_subscription_covers}</Text>
          { this.state.data.benefits.length > 0 ?
          <View>
          {this.state.data.benefits.map((row, index) => (
              <View style={{ flexDirection:'row', width:'100%', marginTop:10, backgroundColor:colors.light_blue, borderRadius:10, padding:5 }}>
                <View style={{ width:'30%', alignItems:'center', justifyContent:'center' }}> 
                  <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }}>{strings.service_name}</Text>
                  <View style={{ margin:2 }}/>
                  <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two }}>{row.service_name}</Text>
                </View>
                <View style={{ height:40, backgroundColor:colors.grey, width:0.5 }}/>
                <View style={{ width:'30%', alignItems:'center', justifyContent:'center' }}> 
                  <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }}>{strings.category_name}</Text>
                  <View style={{ margin:2 }}/>
                  <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two }}>{row.category_name}</Text>
                </View>
                <View style={{ height:40, backgroundColor:colors.grey, width:0.5 }}/>
                <View style={{ width:'30%', alignItems:'center', justifyContent:'center' }}> 
                  <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }} >{strings.product_name}</Text>
                  <View style={{ margin:2 }}/>
                  <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two }}>{row.product_name}</Text>
                </View>
                <View style={{ height:40, backgroundColor:colors.grey, width:0.5 }}/>
                <View style={{ width:'10%', alignItems:'center', justifyContent:'center' }}> 
                  <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }}>{strings.qty}</Text>
                  <View style={{ margin:2 }}/>
                  <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two }}>{row.qty}</Text>
                </View>
                <View style={{ marginTop:10 }}/>
              </View>
        ))}
        </View>
        :
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center', marginTop:'50%' }}>
          <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two}}>benefits will be updated soon.....</Text>
        </View>
        }
        </ScrollView>
        
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={250}
          animationType="fade"
          duration={250}
        >
          <FlatList
            data={this.props.payments}
            renderItem={({ item,index }) => (
              <TouchableOpacity onPress={this.select_payment_method.bind(this,item.id)} style={{ flexDirection:'row', padding:10, justifyContent:'center', alignItems:'center' }} >
                <View style={{ width:'20%' }}>
                  <Image 
                    style= {{flex:1 ,height:50, width:50 }}
                    source={{ uri:img_url+item.icon}}
                  />
                </View>
                <View activeOpacity={1} style={{ width:'80%', justifyContent:'center', alignItems:"flex-start" }}>
                  <Text style={{color:colors.theme_fg_two, fontSize:14, fontFamily:bold}}>{item.payment_mode}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.payment_mode}
          />
        </RBSheet>
        <TouchableOpacity activeOpacity={1} onPress={this.open_rb_sheet.bind(this)} style={styles.footer}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>{strings.subscribe_now}</Text>
        </TouchableOpacity>
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
  };
}

const mapDispatchToProps = (dispatch) => ({
  paymentListPending: () => dispatch(paymentListPending()),
  paymentListError: (error) => dispatch(paymentListError(error)),
  paymentListSuccess: (data) => dispatch(paymentListSuccess(data))
});

export default connect(mapStateToProps,mapDispatchToProps)(SubscriptionDetails);

const styles = StyleSheet.create({
  footer:{
    position:'absolute',
    bottom:10,
    width:'90%',
    alignItems:'center',
    justifyContent:'center',
    height:45,
    borderRadius:10, 
    marginLeft:'5%',
    backgroundColor:colors.theme_bg,
  }
});

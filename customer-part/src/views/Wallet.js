import React, { Component } from 'react';
import { StyleSheet, Text,View, Image, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import * as colors from '../assets/css/Colors';
import { StatusBar } from '../components/GeneralComponents';
import { api_url, get_wallet, stripe_payment, add_wallet, bold, no_wallet,low_wallet, normal } from '../config/Constants';
import axios from 'axios';
import { connect } from 'react-redux'; 
//import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
import Moment from 'moment';
import Dialog, { DialogTitle, DialogContent, DialogFooter, DialogButton, } from 'react-native-popup-dialog';
import strings from "../languages/strings.js";
import DialogInput from 'react-native-dialog-input';
import { Button as Btn} from 'react-native-elements'; 
import stripe from 'tipsi-stripe'; 
import  Loader  from '../components/GeneralComponents';

export default class Wallet extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state={
      IsDialogVisible:false,
      wallet_amount: '',
      result:[],
      
      wallet: '',
      wallets:[],
      isLoading:false
    }
    this.Wallet();
  }

  stripe_card = async(amount) =>{

    stripe.setOptions({
      publishableKey: global.stripe_key,
      merchantId: 'MERCHANT_ID', // Optional
      androidPayMode: 'test', // Android only
    })

    let options = {
      requiredBillingAddressFields: 'full',
      prefilledInformation: {
        billingAddress: {
           name: global.customer_name,
        },
      },
    }

   const response = await stripe.paymentRequestWithCardForm(options);
    if(response.tokenId){
      this.stripe_payment(response.tokenId,amount);
    }else{
      alert(strings.sorry_something_went_wrong);
    }
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  Wallet = async () => { 
    this.setState({ isLoading: true });
    await axios({
      method: "post",
      url: api_url + get_wallet,
      data: { id: global.id },
    })
    .then(async (response) => {  
      //alert(JSON.stringify(response));
      this.setState({ isLoading: false });
      this.setState({wallet_amount: response.data.result.wallet_amount, wallet: response.data.result.wallets});
    })
    .catch((error) => {
      this.setState({ isLoading: false });
      alert(strings.sorry_something_went_wrong);
    });
  };

  wallet_success = async (amount) => {
    this.setState({ isLoading: true });
    await axios({
      method: "post",
      url: api_url + add_wallet,
      data: { customer_id: global.id, amount:amount },
    })
    .then(async (response) => {

      this.setState({ isLoading: false });
      if(response.data.status == 1){
        alert(strings.successfully_added);
        this.Wallet();
      }
    })
    .catch((error) => {
      this.setState({ isLoading: false });
      alert(strings.sorry_something_went_wrong);
    });
  };

  stripe_payment = async (token,amount) => {
    this.setState({ isLoading: true });
    await axios({
      method: 'post', 
      url: api_url + stripe_payment,
      data:{ customer_id : global.id, amount:amount, token: token}
    })
    .then(async response => {
      this.setState({ isLoading: false });
      this.showDialog(false);
      if(response.data.status == 1){
        this.wallet_success(amount);
      }else{
        alert(strings.sorry_something_went_wrong);
      }
    })
    .catch(error => {
      this.setState({ isLoading: false });
      alert(strings.sorry_something_went_wrong);
    });
  }

  showDialog = async(visible) =>{
    this.setState({ IsDialogVisible : visible});
  }

  add_wallet = async(amount) =>{
    if(!isNaN(amount) && amount != ''){
      this.stripe_card(amount);
    }else{
      alert(strings.please_enter_valid_amount);
    }
    
  }

  render() {
    Moment.locale("en");
    return (
      <SafeAreaView>
        <ScrollView style={{backgroundColor:colors.theme_bg}}>
          <CardView
          	cardElevation={5}
            cardMaxElevation={5}
            cornerRadius={10}>
            style={{
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: '#1d1d2a',
              padding: 20,
            }}
          >
            <View style={{ flexDirection:'row' }}>
              <View style={{ width: "30%" }}>
                <Button transparent>
                  <Icon style={styles.wallet_icon} name="wallet" />
                </Button>
              </View>
              <View>
                <Text style={styles.balance}>{strings.balance}</Text>
                <Text style={{ fontSize: 25, fontFamily: bold,color: colors.theme_fg}}>
                  {global.currency}{this.state.wallet_amount}
                </Text>
              </View>
            </View>
          </CardView>
          <CardView
          	cardElevation={5}
            cardMaxElevation={5}
            cornerRadius={10}>
            style={{
              borderRadius: 10,
              justifyContent: "center",
              backgroundColor: '#1d1d2a',
            }}
          >
            <Text style={{ paddingLeft: 20, paddingTop: 20, fontSize: 16, fontFamily:normal,color:colors.theme_fg }}>
              {strings.history}
            </Text>
            <View style={{ margin: 5 }} />
            
              <FlatList
                data={this.state.wallet}
                renderItem={({ item, index }) => (
                  <ListItem>
                    <View
                      style={{
                        flexDirection: "row",
                        borderLeftWidth: 5,
                        borderColor: colors.theme_bg,
                      }}
                    >
                      <View style={{ paddingLeft: 5, width: "70%" }}>
                      <View style={{ flexDirection:'row' }}>
                        {global.lang == 'en' ?
                        <Text style={{ fontSize: 13, fontFamily:normal,color:colors.theme_description }}>{item.message}</Text>
                        :
                        <Text style={{ fontSize: 13, fontFamily:normal,color:colors.theme_description }}>{item.message_ar}</Text>
                        }
                        </View>
                        <View style={{ flexDirection:'row' }}>
                        <Text
                          style={{ fontSize: 12, color: colors.theme_fg_four, fontFamily:normal,color:colors.theme_description }}
                        >
                          {Moment(item.created_at).format("DD MMM YYYY")}
                        </Text>
                        </View>
                      </View>
                      <View style={{ padding: 5 }}>
                        <Text
                          style={{
                            color: colors.success,
                            fontFamily: bold,
                            fontSize: 20,
                            color:colors.theme_fg
                          }}
                        >
                          {global.currency}{item.amount}
                        </Text>
                        
                      </View>
                    </View>
                  </ListItem>
                )}
                keyExtractor={(item) => item.id}
              />
            
             {this.state.wallet_amount == 0 && 
          <View style={{ height:250, marginTop:'20%' }}>
           <Image
                style={styles.logo}
                source={low_wallet}
              />
          <Text style={{color:colors.theme_fg,alignSelf:'center'}}>{no_wallet}</Text>
          </View>
        }

          </CardView>
          {this.state.IsDialogVisible &&
          <DialogInput isDialogVisible={this.state.isDialogVisible}
            title={strings.recharge}
            message={strings.enter_your_amount}
            hintInput ={global.currency+"100"}
            submitInput={ (inputText) => {this.add_wallet(inputText)} }
            closeDialog={ () => {this.showDialog(false)}}>
          </DialogInput>
          }
        </ScrollView>
        <Loader visible={this.state.isLoading} />
        <View style={styles.footer} >
          <View style={styles.footer_content}>
            <Btn
              title={strings.top_up}
              onPress={this.showDialog.bind(this,true)}
              buttonStyle={styles.done}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  header:{
    backgroundColor:colors.theme_bg
  },
  icon:{
    color:colors.theme_fg_two
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
  wallet_icon: {
    color: colors.theme_fg,
    fontSize: 60,
  },
  btn_container: {
    alignItems: "center",
    justifyContent: "center",
  },
  btn_text: {
    color: colors.theme_fg_three,
    fontFamily: bold,
    fontSize: 17,
    letterSpacing: 1,
  },
  footer:{
    backgroundColor:colors.theme_bg,
    position:'absolute',
    bottom:0
  },
  footer_content:{
    width:'90%', 
    justifyContent:'center'
  },
  done:{
    backgroundColor:colors.theme_button,
    fontFamily:bold
  },
  logo:{
    alignSelf:'center',
    width:50,
    height:50
  },
  balance:
  {
    fontFamily:normal,
    color: colors.theme_fg
  }
});


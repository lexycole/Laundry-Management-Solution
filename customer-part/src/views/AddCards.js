import React, {Component} from 'react';
import { StyleSheet, Text, FlatList, View, SafeAreaView } from 'react-native';
import { api_url, faq, bold, normal, add_card } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import  Loader  from '../components/GeneralComponents';
import axios from 'axios';
import { connect } from 'react-redux'; 
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/FaqActions';
import { CommonActions } from '@react-navigation/native';
import strings from "../languages/strings.js";
import { Button} from 'react-native-elements';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon, { Icons } from '../components/Icons';

class AddCards extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        isLoding: false,
        exp_month: '',
        exp_month: '',
        number:'',
        cvc:'',
        validation: false,
        res:''
      }
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  onChange = (form) => {
    console.log(form.valid);
    console.log(JSON.stringify(form.values));
    this.setState({ validation: form.valid })
    if(form.valid){
      let expiry = form.values.expiry;
      let res = expiry.split("/");
      this.setState({ number: form.values.number, exp_month: res[0], exp_year: res[1], cvc: form.values.cvc })
    }
  }

  add_card = async () => {
      console.log({ customer_id: global.id, number: this.state.number, exp_month: this.state.exp_month, cvc: this.state.cvc, exp_year: this.state.exp_year })
    this.setState({ isLoding:true })
    await axios({
      method: 'post', 
      url: api_url + add_card,
      data:{ customer_id: global.id, number: this.state.number, exp_month: this.state.exp_month, cvc: this.state.cvc, exp_year: this.state.exp_year }
    })
    .then(async response => {
        //alert(JSON.stringify(response));
        this.setState({ isLoding:false })
        this.handleBackButtonClick();
    })
    .catch(error => {
      this.setState({ isLoding:false })
        alert(error);
    });
  }

  render() {

    return (
      <SafeAreaView style={{ width:'100%', height:'100%'}} >
          <View style={{ margin:10 }}/>
            <ScrollView>
            <CreditCardInput onChange={this.onChange}
                labelStyle={{ color : colors.theme_fg}} 
                inputStyle={{ color : colors.theme_fg,  }} 
                validColor={{ color : colors.theme_fg }}
                placeholderColor={colors.theme_bg_four}
                additionalInputsProps={colors.theme_fg}
            />
        </ScrollView> 
        <View style={styles.footer}>
          <TouchableOpacity onPress={this.add_card} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>{strings.add_card}</Text>
          </TouchableOpacity>
        </View>
        <Loader visible={this.state.isLoding} />
      </SafeAreaView>
    );
  }
}
 
function mapStateToProps(state){
  return{
    isLoding : state.faq.isLoding,
    error : state.faq.error,
    data : state.faq.data,
    message : state.faq.message,
    status : state.faq.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(AddCards);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
  },
  icon:{
    color:colors.theme_fg
  },
  header_body: {
    flex: 3,
    justifyContent: 'center',
    alignItems:'center'
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg,
    alignSelf:'center', 
    fontSize:16, 
    fontFamily:bold
  },
  faq_title:{
    color:colors.theme_fg,
    fontSize:15,
    fontFamily:normal
  },
  footer:{
    backgroundColor:'transparent',
    position:'absolute',
    bottom:0,
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

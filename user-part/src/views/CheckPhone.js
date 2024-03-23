import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import { regular, bold, check_phone_number, api_url } from '../config/Constants';
import PhoneInput from 'react-native-phone-input';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import  Loader  from '../components/GeneralComponents';
import strings from "../languages/strings.js";

const CheckPhone = () => {

  const navigation = useNavigation(); 
  const [validation,setValidation] = useState(false); 
  const phone_ref = useRef(null);
  const [loading, setLoading] = useState('false');

  useEffect(() => {
    setTimeout(() => {
      phone_ref.current.focus();
    }, 200);
  },[]);

  const phone_validation = () => {
    Keyboard.dismiss();
    if('+'+phone_ref.current.getCountryCode() == phone_ref.current.getValue()){
      setValidation(false);
      alert('Please enter your phone number')
    }else if(!phone_ref.current.isValidNumber()){
      setValidation(false);
      alert('Please enter valid phone number')
    }else{
      setValidation(true);
      check_phone( phone_ref.current.getValue() )
    }
  }

  const check_phone = async(phone_with_code) => {
    console.log({ phone_with_code : phone_with_code})
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + check_phone_number,
      data:{ phone_with_code : phone_with_code}
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        navigation.navigate('Password',{ phone_with_code : phone_with_code, type: 1 })
      }else if(response.data.status == 2){
        alert(response.data.message)
      }else if(response.data.status == 0){
        alert(response.data.message)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('sorry something went wrong');
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding:20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <Loader visible={loading} />
        <View style={{ padding:10 }}>
          <View style={{ margin:20 }}/>
          <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>{strings.enter_your_phone_number}</Text>
          <View style={{ margin:2 }}/>
          <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>{strings.we_will_send_you_an_one_time_password_on_this_mobile_number}</Text>
          <View style={{ margin:10 }}/>
          <View style={styles.textFieldcontainer}>
            <PhoneInput ref={phone_ref} style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style}  initialCountry="in" offset={10} textStyle={styles.country_text} textProps={{ placeholder: "Enter your phone number", placeholderTextColor : colors.grey, color:colors.theme_fg_two, fontSize:14 }} autoFormat={false} />
          </View>
          <View style={{ margin:20 }}/>
          <TouchableOpacity  onPress={phone_validation.bind(this)}  style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14 }}>{strings.submit}</Text>
          </TouchableOpacity>
          <View style={{ margin:10 }}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
  },
  textFieldIcon: {
    padding:5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three
  },
  flag_style:{
    width: 38, 
    height: 24
  },
  country_text:{
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    color:colors.theme_fg_two
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
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
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 96, 
  },
  image: {
    width: 320,
    height: 320,
    marginTop: 32,
  },
  title: {
    fontSize: 25,
    color:colors.theme_fg_two,
    fontFamily:bold,
    textAlign: 'center',
  },
  text:{
    fontSize:14,
    fontFamily:regular,
    color:colors.grey,
    marginTop:20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'justify',
    padding:10,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: colors.theme_bg,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckPhone;

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Keyboard, I18nManager } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, customer_check_phone, api_url } from '../config/Constants';
import PhoneInput from 'react-native-phone-input';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from '../components/GeneralComponents';
import  Loader  from '../components/GeneralComponents';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import strings from "../languages/strings.js";
import RNRestart from 'react-native-restart';

const CheckPhone = () => {

  const navigation = useNavigation();
  const phone_ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false); 
  const [language, setLanguage] = useState(global.lang);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const otp = () => {
    navigation.navigate("Otp")
  }

  const phone_validation = async() => {
    Keyboard.dismiss();
    if('+'+phone_ref.current.getCountryCode() == phone_ref.current.getValue()){
      await setValidation(false);
      alert('Please enter your phone number')
    }else if(!phone_ref.current.isValidNumber()){
      await setValidation(false);
      alert('Please enter valid phone number')
    }else{
      await setValidation(true);
      check_phone( phone_ref.current.getValue() )
    }
  }

  const check_phone = async(phone_with_code) => {

    await Keyboard.dismiss();
    await setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_check_phone,
      data:{ phone_with_code : phone_with_code}
    })
    .then(async response => {
      setLoading(false);
      if(response.data.result.is_available == 1){
        navigation.navigate('Password',{ phone_with_code : phone_with_code })
      }else{
        let phone_number = phone_ref.current.getValue();
        phone_number = phone_number.replace("+"+phone_ref.current.getCountryCode(), "");
        navigation.navigate('Otp',{ data : response.data.result.otp, type: 1, phone_with_code : phone_with_code, phone_number : phone_number })
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const language_change = async(lang) => {
    if(global.lang != lang){
        try {
          await AsyncStorage.setItem('lang', lang);
          await strings.setLanguage(lang);
          if(lang == 'ar'){
            await I18nManager.forceRTL(true);
            await RNRestart.Restart();
          }else{
            await I18nManager.forceRTL(false);
            await RNRestart.Restart();
          }
        } catch (e) {

        }
    }
  }

return (
  <SafeAreaView style={styles.container}>
  <Loader visible={loading} />
    <StatusBar/>
    <ScrollView style={{ margin:20, }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>{strings.enter_your_phone_number}</Text>
        <View style={{ margin:10 }}/>
        <View style={styles.textFieldcontainer}>
          <PhoneInput ref={phone_ref} style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style}  initialCountry="in" offset={10} textStyle={styles.country_text} textProps={{ placeholder: "Enter your phone number", placeholderTextColor : colors.theme_bg_two }} autoFormat={true} />
        </View>
        <View style={{ margin:20 }}/>
        <TouchableOpacity onPress={phone_validation.bind(this)}  style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>{strings.continue}</Text>
        </TouchableOpacity>
        {/* <View style={{ flexDirection:'row' }}>
          <View style={{paddingLeft:'50%', justifyContent:'center', alignItems:'flex-end'}}>
            <Icon type={Icons.MaterialCommunityIcons} name="translate" color={colors.grey} style={{ fontSize:25 }} />
          </View>
          <View style={{ justifyContent:'center', alignItems:'flex-end'}}>
            <Picker
              selectedValue={language}
              style={{height: 210, width: 140, color:colors.theme_fg }}
              itemStyle={{ fontFamily:normal }}
              onValueChange={(itemValue, itemIndex) =>
                language_change(itemValue)
              }>
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Arabic" value="ar" />
            </Picker>
          </View>
        </View> */}
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
    backgroundColor:colors.theme_bg_three,
    color:colors.theme_fg_two,
    fontFamily:normal,
    fontSize:14
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
    color:colors.theme_fg_two,
    fontFamily:normal,
    fontSize:14
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
});

export default CheckPhone;


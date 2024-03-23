import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold } from '../config/Constants';
import CodeInput from 'react-native-confirmation-code-input';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from '../components/GeneralComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from "../languages/strings.js";

const Otp = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [otp_value, setOtpValue] = useState(route.params.data);
  const [type, setType] = useState(route.params.type);
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number);
  const [id, setId] = useState(route.params.id); 

  const handleBackButtonClick= () => {
    navigation.goBack()
  }   
  const create_password = () => {
    navigation.navigate("CreatePassword")
  }

  useEffect(() => {
    if(global.mode == 'DEMO'){
      setTimeout(() => {
        check_otp(otp_value);
      }, 1000)
    }
  },[]);

  const check_otp = async(code) => {
    if (code != otp_value) {
      alert('Please enter valid OTP')
    }else if(type == 1) {
      navigation.navigate("Register", { phone_with_code_value:phone_with_code_value, phone_number_value:phone_number_value, })
    }else if(type == 2) {
      navigation.navigate("CreatePassword", { id:id, from:"otp" })
    }
  }

return(
  <SafeAreaView style={styles.container}>
    <StatusBar/>
    <ScrollView style={{ margin:20 }} showsVerticalScrollIndicator={false}>
      <View>
       <TouchableOpacity onPress={handleBackButtonClick.bind(this)} >
          <Icon type={Icons.Feather} name="arrow-left" color={colors.grey} style={{ fontSize:30 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>{strings.enter_otp}</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:normal }}>{strings.enter_the_4_digit_code_that_was_sent_to_your_phone_number}</Text>
        <View style={{ margin:10 }}/>
        <View style={styles.code}>
          <CodeInput
            useRef="codeInputRef2"
            keyboardType="numeric"
            codeLength={4}
            className='border-circle'
            autoFocus={false}
            codeInputStyle={{ fontWeight: '800' }}
            activeColor={colors.theme_bg}
            inactiveColor={colors.theme_bg}
            onFulfill={(isValid) => check_otp(isValid)}
          />
        </View>
        <View style={{ margin:20 }}/>
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
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  },
});

export default Otp;
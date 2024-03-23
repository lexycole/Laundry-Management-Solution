import React, { useState }  from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, normal, bold, api_url, partner_login, partner_forget_password } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from '../components/GeneralComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux'; 
import strings from "../languages/strings.js";
import { updatePartnerProfilePicture, updatePartnerName } from '../actions/PartnerRegisterActions';
import  Loader  from '../components/GeneralComponents';

const Password = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code);
  const [validation,setValidation] = useState(false); 

  const handleBackButtonClick= () => {
    navigation.goBack()
  }  

  const login_validation = async() =>{
    if(password == ""){
      alert('Please enter Password.')
      await setValidation(false);
    }else{
      await setValidation(true);
      login();
    }
  }

  const login = async() => {
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + partner_login,
      data:{ phone_with_code: phone_with_code_value , fcm_token:'123456', password: password }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        saveData(response.data)
      }else{
        alert('Please enter correct Password')
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  const saveData = async(data) =>{
    try{
        await AsyncStorage.setItem('id', data.result.id.toString());
        await AsyncStorage.setItem('delivery_boy_name', data.result.delivery_boy_name.toString());
        await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
        await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
        
        global.id = await data.result.id.toString();
        global.delivery_boy_name = await data.result.delivery_boy_name.toString();
        global.phone_number = await data.result.phone_number.toString();
        global.phone_with_code = await data.result.phone_with_code.toString();
        
        await home();
      }catch (e) {
        alert(e);
    }
  }

  const home = async() => {
    navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }

  const forgot_password = async() =>{
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + partner_forget_password,
      data:{ phone_with_code: phone_with_code_value }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        navigation.navigate('Otp',{ data : response.data.result.otp, id : response.data.result.id })
      }else{
        alert(response.data.message)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong');
    });
  }

  return( 
  <SafeAreaView style={styles.container}>
    <ScrollView style={{ padding:20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
    <Loader visible={loading} />
      <View>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:100 , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Feather} name="arrow-left" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>{strings.welcome_to} {strings.app_name}</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:normal }}>{strings.please_enter_your_password_to_access_your_account}</Text>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Password"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={{ margin:20 }}/>
        <TouchableOpacity onPress={login_validation} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold}}>{strings.ready_to_delivery}</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
        <TouchableOpacity onPress={forgot_password}>
          <Text style={{ color:colors.theme_fg, fontSize:14, fontFamily:bold, alignSelf:'center'}}>{strings.forgot_password}</Text>
        </TouchableOpacity>
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
    height: 45,
    fontSize:14,
    color:colors.theme_fg_two
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
    fontSize:14,
    color:colors.theme_fg_two
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

export default Password;

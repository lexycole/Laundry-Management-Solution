import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, normal, bold, customer_register, api_url } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from '../components/GeneralComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from "../languages/strings.js";
import  Loader  from '../components/GeneralComponents';

const Register = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code_value);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number_value);
  const [customer_name, setCustomerName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validation,setValidation] = useState(false); 
  const [confirm_password, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");  

  const handleBackButtonClick= () => {
    navigation.goBack()
  }


  const register_validation = async() =>{
    if(customer_name == ""){
      alert('Please enter Name.')
      await setValidation(false);
    }else if(password == ""){
      alert('Please enter Password.')
      await setValidation(false);
    }else if(confirm_password == ""){
      alert('Please enter Confirm Password.')
      await setValidation(false);
    }else if(password != confirm_password){
      alert('Password mismatch.')
      await setValidation(false);
    }else{
      await setValidation(true);
      registration();
    }
  }

  const registration = async() => {
    console.log({ customer_name: customer_name , phone_number: phone_number_value , fcm_token:global.fcm_token, phone_with_code: phone_with_code_value, password: password, email:email })
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_register,
      data:{ customer_name: customer_name , phone_number: phone_number_value , fcm_token:global.fcm_token, phone_with_code: phone_with_code_value, password: password, email:email }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        saveData(response.data)
      }else{
        alert(response.data.message)
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
        await AsyncStorage.setItem('customer_name', data.result.customer_name.toString());
        await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
        await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
        await AsyncStorage.setItem('email', data.result.email.toString());
        
        global.id = await data.result.id.toString();
        global.customer_name = await data.result.customer_name.toString();
        global.phone_number = await data.result.phone_number.toString();
        global.phone_with_code = await data.result.phone_with_code.toString();
        global.email = await data.result.email.toString();
        
        await navigate();
      }catch (e) {
        alert(e);
    }
  }

  const navigate = async() => {
    navigation.dispatch(
         CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
    );
  }

return( 
  <SafeAreaView style={styles.container}>
    <ScrollView style={{ margin:20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
    <Loader visible={loading} />
      <View>
        <TouchableOpacity onPress={handleBackButtonClick} >
          <Icon type={Icons.Feather} name="arrow-left" color={colors.grey} style={{ fontSize:30 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>{strings.welcome_to} {strings.app_name}</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:normal }}>{strings.please_enter_your_details_for_registration}</Text>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholderTextColor={colors.grey}
            placeholder={strings.name}
            underlineColorAndroid="transparent"
            onChangeText={text => setCustomerName(text)}
          />
        </View>
         <View style={{ margin:5 }}/>
         <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholderTextColor={colors.grey}
            placeholder={strings.email}
            underlineColorAndroid="transparent"
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View style={{ margin:5 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholderTextColor={colors.grey}
            placeholder={strings.password}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={{ margin:5 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholderTextColor={colors.grey}
            placeholder={strings.confirm_password}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setConfirmPassword(text)}
          />
        </View>
        <View style={{ margin:20 }}/>
        <TouchableOpacity onPress={register_validation.bind(this)}  style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold}}>{strings.submit}</Text>
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
    backgroundColor:colors.theme_bg_three,
    color:colors.theme_fg_two,
    fontSize:14,
    fontFamily:normal
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

export default Register;

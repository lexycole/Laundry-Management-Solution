import React, { useEffect } from 'react';
import { View, StyleSheet, Platform  } from 'react-native';
import { api_url, logo, settings } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { Image, StatusBar } from '../components/GeneralComponents';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/SplashActions';
import strings from "../languages/strings.js";
import { useNavigation, CommonActions } from '@react-navigation/native';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, {Importance} from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = (props) => {
  const navigation = useNavigation();

  useEffect(() => {
    get_app_settings();
  }, []);

  const get_app_settings = async() => {
    axios({
    method: 'get', 
    url: api_url + settings,
    })
    .then(async response => {
      if (Platform.OS === "android"){
        await configure();
        await channel_create();
      }else{
        global.fcm_token = "12345";
      }
      
      await props.serviceActionSuccess(response.data)
      await home(response.data.result);
    })
    .catch(error => {
      alert(error)
    });
  }

  const channel_create = () =>{
    PushNotification.createChannel(
    {
        channelId: "laundry_order", // (required)
        channelName: "Order", // (required)
        channelDescription: "Laundry Testing Solution", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "uber.mp3", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  const configure = () =>{
    PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
          console.log("TOKEN:", token.token);
          global.fcm_token = token.token;
        },

        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
          console.log("NOTIFICATION:", notification);

          // process the notification

          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        onAction: function (notification) {
          console.log("ACTION:", notification.action);
          console.log("NOTIFICATION:", notification);

          // process the action
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function(err) {
          console.error(err.message, err);
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,
      });
  }

  const home = async (data) => {
   const id = await AsyncStorage.getItem('id');
   const customer_name = await AsyncStorage.getItem('customer_name');
   const phone_number = await AsyncStorage.getItem('phone_number');
   const phone_with_code = await AsyncStorage.getItem('phone_with_code');
   const email = await AsyncStorage.getItem('email');
   const lang = await AsyncStorage.getItem('lang');
   global.currency = data.default_currency;
   global.delivery_cost = data.delivery_cost;
   global.stripe_key = data.stripe_key;
   global.currency_short_code = await data.currency_short_code; 
   global.razorpay_key = await data.razorpay_key;
   global.mode = await data.mode;
   
   if(lang != null){
    await strings.setLanguage(lang);
    global.lang = await lang
   }else{
    global.lang = 'en';
    await strings.setLanguage('en');
   }

   if(id !== null){
      global.id = id;
      global.customer_name = customer_name;
      global.phone_number = phone_number;
      global.phone_with_code = phone_with_code;
      global.email = email;
      navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
          })
        );
   }else{
      global.id = '';
      navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [{ name: "CheckPhone" }],
          })
        );
    }
  }
  
  return (
    <View style={styles.container}>
      <View>
        <StatusBar />
      </View>
      <View style={styles.image_view} >
         <Image style= {{ height: undefined,width: undefined,flex: 1, }} source={logo} />      
      </View>
    </View>
  )
}

function mapStateToProps(state){
  return{
    isLoding : state.splash.isLoding,
    error : state.splash.error,
    data : state.splash.data,
    message : state.splash.message,
    status : state.splash.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(Splash);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  },
  image_view:{
    height:'22%', 
    width:'42%',
  }
});

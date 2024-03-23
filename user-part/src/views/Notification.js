 import React, {Component} from 'react';
import { View, StyleSheet, Text, TextInput, Button, ScrollView, ImageBackground, TouchableOpacity,Image, SafeAreaView } from 'react-native';
import { StatusBar } from '../components/GeneralComponents';
import { img_url, api_url, notification_image, height_60, height_20, bold, normal } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import  Loader  from '../components/GeneralComponents';

class Notification extends Component<Props>{

  constructor(props) {
      super(props)
  }

  componentDidMount() {    
    
  }

  render() {
      return (
      <ScrollView keyboardShouldPersistTaps='always'>
        <View style={styles.container}>
          <View>
            <StatusBar/>
          </View>
          <View style={styles.block_one} >
            <View style={styles.notification_image} >
            <LottieView source={notification_image} autoPlay loop />
            </View>
            <View>
              <Text style={styles.notification_title} >Notification Received!</Text>
            </View>
            <View style={styles.description_content} >
              <Text style={styles.description} >Lorem ispum dolar sit ament duo</Text>
            </View>
          </View>
          <View style={styles.footer} >
            <View style={styles.footer_content} >
              <Button
                title="ACCEPT"
                onPress={this.forgot_password}
                buttonStyle={styles.accept}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  back_icon:{
    color:colors.theme_bg
  },
  back_content:{
    width: '100%',  
    position:'absolute', 
    top:10, 
    left:10
  },
  block_one:{
    width: '100%', 
    height: height_60, 
    backgroundColor: colors.theme_bg, 
    alignItems:'center', 
    justifyContent:'center'
  },
  notification_image:{
    height:152, 
    width:150
  },
  notification_title:{
    color:colors.theme_fg, 
    marginTop:20, 
    fontSize:20, 
    fontFamily:bold 
  },
  description_content:{
    paddingLeft:20, 
    color:colors.theme_bg,
    paddingRight:20
  },
  description:{
    marginTop:20, 
    fontSize:13, 
    textAlign:'center', 
    color:colors.theme_fg,
    fontFamily:normal
  },
  block_two:{
    width: '100%', 
    height: height_20, 
    backgroundColor: colors.theme_bg, 
    alignItems:'center', 
    justifyContent:'center'
  },
  footer:{
    width: '100%',
    alignItems:'center'
  },
  footer_content:{
    width:'80%', 
    marginTop:10
  },
  accept:{
    backgroundColor:colors.theme_shade,
    fontFamily:bold
  }
});

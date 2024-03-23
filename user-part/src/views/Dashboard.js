import React, {Component} from 'react';
import { View, StyleSheet, Text, ScrollView, ImageBackground, TouchableOpacity, I18nManager, Image  } from 'react-native';
import { Icon } from 'react-native-elements';
import { StatusBar } from '../components/GeneralComponents';
import { img_url, api_url, delivery, height_50, dashboard, bold, home_banner, dash_completed_icon, dash_active_icon, dash_upcoming_icon, dash_pending_icon } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { fb } from '../config/firebaseConfig';
import axios from 'axios';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import { CommonActions } from '@react-navigation/native';
import strings from "../languages/strings.js";
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import CardView from 'react-native-cardview';
import  Loader  from '../components/GeneralComponents';

class Dashboard extends Component<Props>{

  constructor(props) {
      super(props),
      this.state = {
        total_bookings : 0,
        today_bookings : 0,
        completed_bookings : 0,
        pending_bookings:0,
        isLoding:false,
        language : global.lang,
      }
      
  }
  
  async componentDidMount(){
  this._unsubscribe=this.props.navigation.addListener('focus',()=>{
    this.dashboard();
  });
}

componentWillUnmount(){
  this._unsubscribe();
}

async language_change(lang){
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

  dashboard = async () => {
    this.setState({ isLoding:true})
    await axios({
      method: 'post', 
      url: api_url + dashboard,
      data:{ id: global.id }
    })
    .then(async response => {
      if(response.data.status == 1){
        this.setState({ total_bookings:response.data.result.total_bookings, today_bookings:response.data.result.today_bookings,completed_bookings:response.data.result.completed_bookings,pending_bookings:response.data.result.pending_bookings,isLoding:false});
      }
    })
    .catch(error => {
      this.setState({ isLoding:false});
    });
  }

  render() {
      return (
      <View style={{ margin:10 }}>
        <View>
          <StatusBar/>
        </View>
        <Loader visible={this.state.isLoding} />
        <View style={{ margin:10 }} />
        {/*<View style={{width:'100%', alignItems:'center', justifyContent:'center', backgroundColor:colors.light_blue}} >
            <View style={{ flexDirection:'row',}}>
              <Picker             
                selectedValue={this.state.language}
                style={{ width: 140, color:colors.theme_fg_two }}
                itemStyle={{ fontFamily:normal }}
                onValueChange={(itemValue, itemIndex) =>
                  this.language_change(itemValue)
                }>
                <Picker.Item label={strings.english} value="en"/>
                <Picker.Item label={strings.arabic} value="ar" />
              </Picker>     
            </View> 
          </View>*/}
        <View style={{ flexDirection:'row' }} >
          <Text style={{ fontSize:24, fontFamily:bold, color:colors.theme_fg_two,  letterSpacing:0.5 }}>Hello</Text>
          <View style={{ margin:3 }} />
          <Text style={{ fontSize:24, fontFamily:bold, color:colors.theme_fg, letterSpacing:0.5 }}>{global.delivery_boy_name},</Text>
        </View>
        <View style={{ width: '100%', height:180, borderRadius:10 }}>
          <Image style= {{ height: undefined, width: undefined, flex: 1, borderRadius:10 }} source={home_banner} />
        </View>
        <View style={{ margin:20 }} />
        <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_two }}>Your Today Report</Text>
        <View style={{ margin:5 }} />
        <View style={{ flexDirection:'row'}}>
          <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
            <CardView
              cardElevation={4}
              style={{ margin:5}}
              cardMaxElevation={4}
              cornerRadius={10}>
              <View style={{ padding:10, alignItems:'center', justifyContent:'center', backgroundColor:'#a7c661', height:130, width:150 }}>
                <View style={{ width: 50, height:50 }}>
                  <Image style= {{ height: undefined, width: undefined, flex: 1, }} source={dash_active_icon} />
                </View>
                <View style={{ margin:3 }} />
                <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_three }}>
                {this.state.total_bookings}
                </Text>
                <View style={{ margin:4 }} />
                <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_three }}>Total</Text>
              </View>
            </CardView>
          </View>
          <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
            <CardView
              cardElevation={4}
              style={{ margin:5}}
              cardMaxElevation={4}
              cornerRadius={10}>
              <View style={{ padding:10, alignItems:'center', justifyContent:'center', backgroundColor:'#619fc6', height:130, width:150 }}>
                <View style={{ width: 50, height:50 }}>
                  <Image style= {{ height: undefined, width: undefined, flex: 1, }} source={dash_upcoming_icon} />
                </View>
                <View style={{ margin:3 }} />
                <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_three }}>
                {this.state.today_bookings}
                </Text>
                <View style={{ margin:4 }} />
                <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_three }}>Active</Text>
              </View>
            </CardView>
          </View>
        </View>
        <View style={{ margin:10 }} />
        <View style={{ flexDirection:'row'}}>
          <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}> 
            <CardView
              cardElevation={4}
              style={{ margin:5}}
              cardMaxElevation={4}
              cornerRadius={10}>
              <View style={{ padding:10, alignItems:'center', justifyContent:'center', backgroundColor:'#EE4B2B', height:130, width:150 }}>
                <View style={{ width: 50, height:50 }}>
                  <Image style= {{ height: undefined, width: undefined, flex: 1, }} source={dash_pending_icon} />
                </View>
                <View style={{ margin:3 }} />
                <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_three }}>
                  {this.state.pending_bookings}
                </Text>
                <View style={{ margin:4 }} />
                <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_three }}>Pending</Text>
              </View>
            </CardView>
          </View>
          <View style={{ width:'50%', alignItems:'center', justifyContent:'center'}}>
            <CardView
              cardElevation={4}
              style={{ margin:5}}
              cardMaxElevation={4}
              cornerRadius={10}>
              <View style={{ padding:10, alignItems:'center', justifyContent:'center', backgroundColor:'#61c6c1', height:130, width:150 }}>
                <View style={{ width: 50, height:50 }}>
                  <Image style= {{ height: undefined, width: undefined, flex: 1, }} source={dash_completed_icon} />
                </View>
                <View style={{ margin:3 }} />
                <Text style={{ fontSize:18, fontFamily:bold, color:colors.theme_fg_three }}>
                  {this.state.completed_bookings}
                </Text>
                <View style={{ margin:4 }} />
                <Text style={{ fontSize:16, fontFamily:bold, color:colors.theme_fg_three }}>Completed</Text>
              </View>
            </CardView>
          </View>
        </View>
      </View>
      
    )
  }
}

export default Dashboard;

const styles = StyleSheet.create({
  block_one:{
    width: '100%', 
    height: 350, 
    alignItems:'center', 
    justifyContent:'center',
    flexDirection:'row', 
  },
  card:{ 
    flexDirection:'column', 
    alignItems:'center',
    justifyContent:'center',
    color:colors.theme_shade, 
  },
  card_title:{ 
    fontSize:13, 
    color:colors.theme_fg_two,
    alignSelf:'center',
    fontFamily:bold
  },
  card_count:{ 
    fontSize:20, 
    color:colors.theme_fg_two,
    fontFamily:bold 
  }
});
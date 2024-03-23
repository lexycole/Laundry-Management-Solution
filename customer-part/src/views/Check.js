import React, {Component} from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View  } from 'react-native';
import {bold, normal} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import strings from "../languages/strings.js";
import CardView from 'react-native-cardview';
import  Loader  from '../components/GeneralComponents';

export default class Check extends Component<Props> {

  constructor(props) {
      super(props)
  }

  async componentDidMount(){
    this._unsubscribe=this.props.navigation.addListener('focus',async ()=>{
        this.props.navigation.navigate('Cart');
    });
  }

  componentWillUnmount(){
    this._unsubscribe();
  }

  render() {
    return (
      <SafeAreaView style={{ alignItems:'center', justifyContent:'center'}}>
        <Text style={{ color:colors.theme_fg,fontFamily:bold, fontSize:16 }} >Loading...</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
  }
});

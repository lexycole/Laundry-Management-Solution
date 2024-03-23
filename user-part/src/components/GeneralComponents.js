import React from 'react';
import { Image as Img, StatusBar as Sb, StyleSheet, Text } from 'react-native';
import { Divider as Hr } from 'react-native-elements';
import * as colors from '../assets/css/Colors';
import Spinner from 'react-native-loading-spinner-overlay';
import AnimatedLoader from "react-native-animated-loader";

export function Image(props) {
    return <Img style= {{flex:1 , width: undefined, height: undefined}} source={props.source} />
}

export function StatusBar(props){
	return <Sb
	    barStyle = "light-content"
	    hidden = {false}
	    backgroundColor = {colors.theme_bg}
	    translucent = {false}
	    networkActivityIndicatorVisible = {true}
	 />
}

export function Divider(props) {
    return <Hr style={{ backgroundColor: colors.theme_fg_two }} />
}

export default function Loader(props) {
  return <AnimatedLoader
        visible={props.visible}
        overlayColor="rgba(255,255,255,1)"
        source={require('.././assets/json/loader.json')}
        animationStyle={styles.lottie}
        speed={1}
      >
        <Text style={{ fontSize:14}}>Please wait...</Text>
      </AnimatedLoader>
  
}

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200
  }
});
import React, {Component} from 'react';
import { StyleSheet, Text, Image, View, SafeAreaView, ScrollView } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular , img_url, about_us, api_url } from '../config/Constants';
import axios from 'axios';
import  Loader  from '../components/GeneralComponents';

class AboutUs extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      show_info:'',
      isLoading:false
    }
    this.submit_feedback();
  }

  async submit_feedback(){
    this.setState({ isLoading : true });
    await axios({
      method: 'post', 
      url: api_url + about_us,
      data:{lang:global.lang}
    })
    .then(async response => {
      this.setState({ isLoading : false, show_info:response.data.result });
    })
    .catch(error => {
      this.setState({ isLoading : false });
    });
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor:colors.theme_fg_three, flex:1}}>
        <Loader visible={this.state.isLoading} />
        <ScrollView>
          <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <View style={styles.notification_img}>
              <Image
                style= {{flex:1 , width: undefined, height: undefined}}
                source={{uri: img_url + this.state.show_info.image}}
              />
            </View>
          </View>
          <View style={{ padding:10 }}>
            <Text style={styles.description}>{this.state.show_info.description}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default AboutUs;

const styles = StyleSheet.create({
  margin_10:{
    margin:10
  },
  notification_title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    fontSize:20,
    fontFamily:bold
  },
  notification_img:{
    height:200, 
    width:'100%'
  },
  description:{ color:colors.theme_fg_four, alignSelf:'center', fontFamily:regular, fontSize:14}
});

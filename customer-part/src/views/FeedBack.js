import React, {Component} from 'react';
import { StyleSheet, Text, View,  TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, img_url, regular, api_url, feed_back } from '../config/Constants';
import axios from 'axios';
import  Loader  from '../components/GeneralComponents';
import { CommonActions } from '@react-navigation/native';

class FeedBack extends Component<Props> {
  constructor(props) {
    super(props)
    this.home = this.home.bind(this);
    this.state = {
      title:'',
      isLoading:false,
      description:'',
    }
  }

  home = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
      })
    );
  }

  submit_feedback_validation = () =>{
    if(this.state.title == '' || this.state.description == ''){
      alert('Please fill all the fields')
    }else{
      this.submit_feedback()
    }
  }

  async submit_feedback(){
    // console.log({ customer_id:global.id, title:this.state.title, description:this.state.description })
    this.setState({ isLoading : true });
    await axios({
      method: 'post', 
      url: api_url + feed_back,
      data:{ customer_id:global.id, title:this.state.title, description:this.state.description }
    })
    .then(async response => {
      //alert(JSON.stringify(response))
      this.setState({ isLoading : false });
      alert('Your feedback submit is done')
      this.home();
    })
    .catch(error => {
      this.setState({ isLoading : false });
    });
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor:colors.theme_fg_three, flex:1}}> 
      <ScrollView showsHorizontalScrollIndicator={false} style={{ padding:10 }}>
        <Loader visible={this.state.isLoading} />
          <View style={{ alignItems:'flex-start', justifyContent:'center', padding:10}}>
            <Text style={styles.driver_name}>Submit your valuable feed back that will help to improve our service to you.</Text>
          </View>
          <View style={{ margin:10 }} />
          <View style={{  borderColor:colors.theme_bg, borderWidth:1, alignItems:'flex-start', justifyContent:'center', padding:10, borderRadius:10, height:150}}>
              <TextInput
                placeholder="Enter your title"
                placeholderTextColor = {colors.theme_fg_four}
                style = {styles.textinput}
                onChangeText={ TextInputValue =>
                  this.setState({title : TextInputValue }) }
              />
            </View>
          <View style={{ margin:10 }} />
          <View style={{ borderColor:colors.theme_bg, borderWidth:1, alignItems:'flex-start', justifyContent:'center', padding:10, borderRadius:10, height:250}}>
            <TextInput
            placeholder="Enter your feed back"
            multiline={true}
            placeholderTextColor = {colors.theme_fg_four}
            style = {styles.textinput}
            onChangeText={ TextInputValue =>
                this.setState({description : TextInputValue }) }
            />
        </View>
        </ScrollView>
        <TouchableOpacity activeOpacity={1} onPress={this.submit_feedback_validation.bind(this)} style={styles.footer}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export default FeedBack;

const styles = StyleSheet.create({
  default_divider:{ 
    marginTop:20, 
    marginBottom:20 
  },
  price:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    alignSelf:'center', 
    fontSize:40, 
    fontFamily:regular 
  },
  footer:{
    position:'absolute',
    bottom:10,
    width:'90%',
    alignItems:'center',
    justifyContent:'center',
    height:45,
    borderRadius:10, 
    marginLeft:'5%',
    backgroundColor:colors.theme_bg,
  },
  cnf_button_style:{ 
    backgroundColor:colors.theme_bg,
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  title_style:{ 
    fontFamily:regular,
    color:colors.theme_fg_three,
    fontSize:18
  },
  date_time:{ color:colors.theme_fg_two, fontSize:12, fontFamily:regular },
  address:{ fontSize:14, color:colors.theme_fg_two, fontFamily:regular  },
  driver_name:{ color:colors.theme_fg_two, fontSize:16, fontFamily:regular }

});

import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Image, TouchableOpacity, Keyboard, SafeAreaView  } from 'react-native';
import { api_url, profile, height_55,height_20, bold, upload_profile_picture, } from '../config/Constants';
import { StatusBar } from '../components/GeneralComponents';
import  Loader  from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { connect } from 'react-redux';
import { editServiceActionPending, editServiceActionError, editServiceActionSuccess, updateServiceActionPending, updateServiceActionError, updateServiceActionSuccess, updateProfilePicture } from '../actions/ProfileActions';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from "../languages/strings.js";
import * as ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import ImgToBase64 from 'react-native-image-base64';
import PhoneInput from 'react-native-phone-input';

//Image upload options
const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
  base64: true,
  quality:1, 
  maxWidth: 500, 
  maxHeight: 500,
};

class Profile extends Component<Props>{

  constructor(props){
      super(props)
      this.state = {
        profile_picture : '', 
        customer_name:'',
        phone_number:'',
        email: '',
        password: '',
        validation:true,        
        data:'',
        profile_timer:true,
        img_data:'',
        profile_image:'',
        phone_ref:null,
      }    
  }

  async componentDidMount() {
    await this.get_profile();
  }

  get_profile = async () => {
    this.props.editServiceActionPending();
    await axios({
      method: 'get', 
      url: api_url+profile+'/'+global.id+'/edit'
    })
    .then(async response => {
        await this.props.editServiceActionSuccess(response.data);
        this.setState({ customer_name:this.props.data.customer_name, email:this.props.data.email, phone_number:this.props.data.phone_number, profile_picture:this.props.data.profile_picture })
    })
    .catch(error => {
        this.showSnackbar(strings.sorry_something_went_wrong);
        this.props.editServiceActionError(error);
    });
  }

  update_profile = async () => {
    Keyboard.dismiss();
    this.checkValidate();
    if(this.state.validation){
        this.props.updateServiceActionPending();
        await axios({
          method: 'patch', 
          url: api_url+profile +'/'+global.id,
          data:{ customer_name: this.state.customer_name, phone_number: this.state.phone_number, email: this.state.email, password: this.state.password }
        })
        .then(async response => {
            await this.props.updateServiceActionSuccess(response.data);
            alert('Successfully Uploaded.')
            await this.saveData();
        })
        .catch(error => {
            this.props.updateServiceActionError(error);
        });
    }
  }

  saveData = async () =>{
    if(this.props.status == 1){
      try {
        await AsyncStorage.setItem('user_id', this.props.data.id.toString());
        await AsyncStorage.setItem('customer_name', this.props.data.customer_name.toString());
        await AsyncStorage.setItem('profile_picture', this.props.data.profile_picture.toString());
        global.id = await this.props.data.id;
        global.customer_name = await this.props.data.customer_name;
        await this.props.upload_profile_picture(this.props.data.profile_picture.toString())
        this.showSnackbar(strings.profile_updated_sucessfully);
        this.setState({ password:'' });
      } catch (e) {
        
      }
    }else{
      alert(this.props.message);
    }
  }

  checkValidate(){
    if(this.state.email == '' || this.state.phone_number == '' || this.state.customer_name == ''){
      this.state.validation = false;
      this.showSnackbar(strings.please_fill_all_the_fields);
      return true;
    }
  }

    select_photo = async () => {
	    if(this.state.profile_timer){
	        ImagePicker.launchImageLibrary(options, async(response) => {
		        if (response.didCancel) {
		          console.log('User cancelled image picker');
		        } else if (response.error) {
		          console.log('ImagePicker Error: ', response.error);
		        } else {
		          const source =  await response.assets[0].uri;
		            this.setState({ img_data:response.data })
		            await ImgToBase64.getBase64String(response.assets[0].uri)
		          .then(async base64String => {
		            await this.profile_image_upload(base64String);
		            this.setState({profile_image:response.assets[0].uri });
		          }).catch(err => console.log(err));
		        }
		    });
	    }else{
	      alert('Please try after 20 seconds');
	    }
    }

    profile_image_upload = async(data_img) =>{
      this.setState({ isLoding:true })
      RNFetchBlob.fetch('POST', api_url + upload_profile_picture, {
        'Content-Type' : 'multipart/form-data',
      }, [
        {  
	        name : 'profile_picture',
	        filename : 'image.png', 
	        data: data_img
	      },
        {  
          name : 'customer_id',
          data: global.id.toString()
        }
      ]).then(async (resp) => { 
        this.setState({ isLoding:false })
        let data = await JSON.parse(resp.data);
        alert('Successfully Uploaded.')
        this.saveProfilePicture(data);
      }).catch((err) => {
          this.setState({ isLoding:false })
          console.log(err)
          alert('Error on while upload try again later.')
      })
  }

  saveProfilePicture = async(data) =>{
      try{
          await AsyncStorage.setItem('profile_picture', data.result.profile_picture);
          this.get_profile();
          await this.props.updateProfilePicture(data.result.profile_picture);
        }catch (e) {
          alert(e);
      }
  }

  showSnackbar(msg){
    Snackbar.show({
      title:msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  } 

  render() {

    const { isLoding, error, data, profile_picture, message, status } = this.props
    return (
      <SafeAreaView style={{ width:'100%', height:'100%'}}>
      <ScrollView style={{ margin:20}} keyboardDismissMode='on-drag' showsHorizontalScrollIndicator={false}>

        {/* Header section */}
        <View style={styles.container}>
          <View>
            <StatusBar/>
          </View>
          <View style={styles.header_section} >
            <TouchableOpacity onPress={this.select_photo.bind(this)}>
             <Image 
               style={styles.profile_image}
               resizeMode='cover'
               source={this.props.profile_picture}
             />
            </TouchableOpacity>
            <View>
              <Text style={styles.profile_name} >{this.state.customer_name}</Text>
            </View>
          </View>

          {/* Body section */}
          <View style={styles.body_section} >
            <View style={styles.textFieldcontainer}>
              <TextInput
                style={styles.textField}
                placeholder={strings.username}
                placeholderTextColor={colors.theme_fg_four}
                underlineColorAndroid="transparent" customer_name
                onChangeText={ TextInputValue =>
                  this.setState({customer_name : TextInputValue }) }
                value={this.state.customer_name}
              />
            </View>
            <View style={{ margin:10 }}/>
            <View style={styles.textFieldcontainer}>
              <PhoneInput ref={this.state.phone_ref} style={{ borderColor:colors.theme_fg_two }} flagStyle={styles.flag_style} initialValue={global.phone_with_code} disabled={true} initialCountry="lb" offset={10} textStyle={styles.country_text} textProps={{ placeholder: "", placeholderTextColor : colors.grey }} autoFormat={true} />
            </View>
            <View style={{ margin:10 }}/>
            <View style={styles.textFieldcontainer}>
              <TextInput
                style={styles.textField}
                placeholder={strings.email_address}
                placeholderTextColor={colors.theme_fg_four}
                underlineColorAndroid="transparent" customer_name
                onChangeText={ TextInputValue =>
                  this.setState({email : TextInputValue }) }
                value={this.state.email}
              />
            </View>
            <View style={{ margin:10 }}/>
            <View style={styles.textFieldcontainer}>
              <TextInput
                style={styles.textField}
                placeholder={strings.password}
                placeholderTextColor={colors.theme_fg_four}
                underlineColorAndroid="transparent" customer_name
                onChangeText={ TextInputValue =>
                  this.setState({password : TextInputValue }) }
                secureTextEntry={true}
              />
            </View>
          </View>
        </View>
        <Loader visible={isLoding} />
        <View style={{ margin:20 }}/>
        <TouchableOpacity style={styles.footer}>
          <TouchableOpacity onPress={this.update_profile} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>{strings.update}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </ScrollView>
        
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.profile.isLoding,
    message : state.profile.message,
    status : state.profile.status,
    data : state.profile.data,
    profile_picture : state.profile.profile_picture
  };
}

const mapDispatchToProps = (dispatch) => ({
    editServiceActionPending: () => dispatch(editServiceActionPending()),
    editServiceActionError: (error) => dispatch(editServiceActionError(error)),
    editServiceActionSuccess: (data) => dispatch(editServiceActionSuccess(data)),
    updateServiceActionPending: () => dispatch(updateServiceActionPending()),
    updateServiceActionError: (error) => dispatch(updateServiceActionError(error)),
    updateServiceActionSuccess: (data) => dispatch(updateServiceActionSuccess(data)),
    updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  header_section:{
    width: '100%', 
    height: height_20, 
    alignItems:'center', 
    justifyContent:'center'
  },
  profile_image:{
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: colors.theme_bg,
    borderWidth: 1,
  },
  profile_name:{ 
    color:colors.theme_fg, 
    marginTop:10, 
    fontSize:20, 
    fontFamily:bold 
  },
  body_section:{
    width: '100%', 
    height: height_55, 
    alignItems:'center', 
    justifyContent:'center',
  },
  input:{
    height:60, 
    width:'90%',
    marginTop:10 ,
    marginBottom:20,
  },
  text_input:{
    borderColor: colors.theme_fg, 
    borderWidth: 1, 
    padding:10, 
    borderRadius:5,
    color:colors.theme_fg
  },
  footer_section:{
    width: '95%', 
    alignItems:'center',
    marginBottom:10
  },
  btn_style:{
    backgroundColor:colors.theme_bg,
    fontFamily:bold
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
  flag_style:{
    width: 38, 
    height: 24
  },
  country_text:{
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontSize:14
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    color:colors.theme_fg_two,
    fontSize:14
  },
  footer:{
    backgroundColor:'transparent',
    width:'100%',
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

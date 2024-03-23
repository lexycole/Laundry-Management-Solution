import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Image, TouchableOpacity, Keyboard, SafeAreaView   } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import { api_url, profile, height_35, height_40, height_50, height_25, profile_picture, bold, normal, upload_profile_picture, update_profile_picture } from '../config/Constants';
import { StatusBar } from '../components/GeneralComponents';
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
import  Loader  from '../components/GeneralComponents';

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
        delivery_boy_name:'',
        phone_number:'',
        email: '',
        password: '',
        validation:true,
        data:'',
        profile_timer:true,
        img_data:'',
        profile_image:'',
        isLoding:false
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
        await this.setState({ delivery_boy_name:this.props.data.delivery_boy_name, email:this.props.data.email, phone_number:this.props.data.phone_number, profile_picture:this.props.profile_picture })
    })
    .catch(error => {
        this.showSnackbar(strings.sorry_something_went_wrong);
        this.props.editServiceActionError(error);
    });
  }


  update_profile = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if(this.state.validation){
        this.props.updateServiceActionPending();
        await axios({
          method: 'patch', 
          url: api_url+profile +'/'+global.id,
          data:{ delivery_boy_name: this.state.delivery_boy_name, phone_number: this.state.phone_number, email: this.state.email, password: this.state.password }
        })
        .then(async response => {
            await this.props.updateServiceActionSuccess(response.data);
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
        await AsyncStorage.setItem('delivery_boy_name', this.props.data.delivery_boy_name.toString());
        global.id = await this.props.data.id;
        global.delivery_boy_name = await this.props.data.delivery_boy_name;
        await this.showSnackbar(strings.profile_updated_sucessfully);
        await this.setState({ password:'' });
      } catch (e) {
        
      }
    }else{
      alert(this.props.message);
    }
  }

  checkValidate(){
    if(this.state.email == '' || this.state.phone_number == '' || this.state.delivery_boy_name == ''){
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
                await this.setState({ img_data:response.data })
                await ImgToBase64.getBase64String(response.assets[0].uri)
              .then(async base64String => {
                await this.profile_image_upload(base64String);
                await this.setState({profile_image:response.assets[0].uri });
              }).catch(err => console.log(err));
            }
        });
      }else{
        alert('Please try after 20 seconds');
      }
    }

    profile_image_upload = async(data_img) =>{
      await this.setState({ isLoding:true })
      RNFetchBlob.fetch('POST', api_url + upload_profile_picture, {
        'Content-Type' : 'multipart/form-data',
      }, [
        {  
	        name : 'profile_picture',
	        filename : 'image.png', 
	        data: data_img
	      },
        {  
          name : 'delivery_boy_id',
          data: global.id.toString()
        }
      ]).then(async (resp) => { 
        await this.setState({ isLoding:false })
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
      color: 'white',
      duration: Snackbar.LENGTH_SHORT,
    });
  } 

  render() {

    const { isLoding, error, data, profile_picture, message, status } = this.props

    return (
      <ScrollView keyboardShouldPersistTaps='always' style={styles.page_background}>

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
               source={profile_picture}
             />
            </TouchableOpacity>
            <View>
              <Text style={styles.profile_name} >{this.state.delivery_boy_name}</Text>
            </View>
          </View>

          {/* Body section */}
          <View style={styles.body_section} >
            <View style={styles.input}>
              <Input
                inputStyle={{ fontSize:14, fontFamily:normal,color:colors.theme_description }}
                label={strings.username}
                labelStyle={{fontFamily:normal,color:colors.theme_fg,fontSize:14}}
                placeholder={strings.username}
                value={this.state.delivery_boy_name}
                placeholderTextColor={colors.theme_description}
                onChangeText={ TextInputValue =>
                  this.setState({delivery_boy_name : TextInputValue }) }
                leftIcon={
                  <Icon
                    name='person'
                    size={20}
                    color={colors.theme_fg }
                  />
                }
              />
            </View>
            <View style={styles.input}>
              <Input
                inputStyle={{ fontSize:14, fontFamily:normal,color:colors.theme_description }}
                label={strings.phone}
                labelStyle={{fontFamily:normal,color:colors.theme_fg,fontSize:14}}
                placeholder={strings.phone}
                placeholderTextColor={colors.theme_description}
                value={this.state.phone_number}
                keyboardType="phone-pad"
                onChangeText={ TextInputValue =>
                  this.setState({phone_number : TextInputValue })  }
                leftIcon={
                  <Icon
                    name='call'
                    size={20}
                    color={colors.theme_fg}

                  />
                }
              />
            </View>
            <View style={styles.input}>
              <Input
                inputStyle={{ fontSize:14,fontFamily:normal,color:colors.theme_description }}
                label={strings.email_address}
                labelStyle={{fontFamily:normal,color:colors.theme_fg,fontSize:14}}
                placeholder={strings.email_address}
                placeholderTextColor={colors.theme_description}
                value={this.state.email}
                keyboardType="email-address"
                onChangeText={ TextInputValue =>
                  this.setState({email : TextInputValue }) }
                leftIcon={
                  <Icon
                    name='mail'
                    size={20}
                    color={colors.theme_fg}
                  />
                }
              />
            </View>
            <View style={styles.input} >
              <Input
                inputStyle={{ fontSize:14,fontFamily:normal,color:colors.theme_fg }}
                label={strings.password}
                labelStyle={{fontFamily:normal,color:colors.theme_fg,fontSize:14}}
                placeholder={strings.password}
                placeholderTextColor={colors.theme_description}
                secureTextEntry={true}
                onChangeText={ TextInputValue =>
                  this.setState({password : TextInputValue }) }
                leftIcon={
                  <Icon
                    name='lock'
                    size={20}
                    color={colors.theme_fg}
                  />
                }
              />
            </View>
          </View>
          <View style={{ margin:10 }} />
          {/* Footer section */}
          <View style={styles.footer_section} >
            <TouchableOpacity style={styles.input} >
              <Button
                title={strings.update}
                onPress={this.update_profile}
                buttonStyle={styles.btn_style}
                titleStyle={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Loader visible={this.state.isLoding} />
      </ScrollView>
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
    flex: 1,
    alignItems: 'center',
    
  },
  page_background:{
    backgroundColor:colors.theme_bg_three
  },
  header_section:{
    width: '100%', 
    height: height_25, 
    backgroundColor: colors.theme_bg_three, 
    alignItems:'center', 
    justifyContent:'center'
  },
  profile_image:{
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: colors.theme_fg_two,
    borderWidth: 1
  },
  profile_name:{ 
    color:colors.theme_fg_two, 
    marginTop:10, 
    fontSize:20, 
    fontFamily: bold
  },
  body_section:{
    width: '100%', 
    height: height_50, 
    backgroundColor: colors.theme_bg_three, 
    alignItems:'center', 
   
  },
  input:{
    height:55, 
    width:'90%',
    marginTop:10 ,
    marginBottom:20,
  },
  text_input:{
    borderColor: colors.theme_fg, 
    color: colors.theme_fg, 
    borderWidth: 1, 
    padding:10, 
    borderRadius:5,
    fontFamily: bold
  },
  footer_section:{
    width: '100%', 
    alignItems:'center',
    marginBottom:10
  },
  btn_style:{
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  }
});

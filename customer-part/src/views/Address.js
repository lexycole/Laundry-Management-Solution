import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Image, Keyboard, PermissionsAndroid, Picker, SafeAreaView, ScrollView, TouchableOpacity  } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { height_50, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, api_url, address, pin, get_region, get_area, bold, normal } from '../config/Constants';
import Snackbar from 'react-native-snackbar';
import { serviceActionPending, serviceActionError, serviceActionSuccess, editServiceActionPending, editServiceActionError, editServiceActionSuccess, updateServiceActionPending, updateServiceActionError, updateServiceActionSuccess } from '../actions/AddressActions';
import axios from 'axios';   
import { connect } from 'react-redux';
import  Loader  from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import Geolocation from '@react-native-community/geolocation';
import strings from "../languages/strings.js";

class Address extends Component<Props> { 

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        address: strings.please_select_your_location,
        door_no:'',
        mapRegion: null,
        validation:true,
        address_id:this.props.route.params.id,
        open_map:0
      }

  }
     
  add_address = async () => {
    console.log({ customer_id: global.id, address: this.state.address.toString(), door_no: this.state.door_no, latitude: this.state.latitude, longitude: this.state.longitude })
    Keyboard.dismiss();
    await this.checkValidate();
    if(this.state.validation){
        this.props.serviceActionPending();
        await axios({
          method: 'post', 
          url: api_url + address,
          data:{ customer_id: global.id, address: this.state.address.toString(), door_no: this.state.door_no, latitude: this.state.latitude, longitude: this.state.longitude }
        })
        .then(async response => {
          //alert(JSON.stringify(response));
            await this.props.serviceActionSuccess(response.data);
            await this.redirect(response.data);
        })
        .catch(error => {
          //alert(error)
           this.showSnackbar(strings.sorry_something_went_wrong);
           this.props.serviceActionError(error);
        });
    }
  }

  redirect = async (data) =>{
    if(data.status == 1){
     this.handleBackButtonClick();
    }else{
      alert(data.message);
    }
  }

  checkValidate(){
    if(this.state.door_no == '' ){
      this.state.validation = false;
      this.showSnackbar(strings.please_enter_door_number);
      return true;
    }else if(this.state.address == strings.please_select_your_location ){
      this.state.validation = false;
      this.showSnackbar(strings.please_select_your_location_in_map);
      return true;
    }else{
      this.state.validation = true;
    }
    
  }

  showSnackbar(msg){
    Snackbar.show({
      title:msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  async componentDidMount() {   
    
    if(Platform.OS === "ios"){
       await this.findType();
    }else{
       await this.requestCameraPermission();
    }
    
  }

  async requestCameraPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': strings.location_access_required,
                'message': strings.rith_laundry_needs_to_access_your_location_for_tracking
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await this.findType();
        } else {
           await this.handleBackButtonClick();
        }
    } catch (err) {
        console.log(err)
        //await this.handleBackButtonClick();
    }
  }

  async findType(){
    if(this.state.address_id == 0){
      await this.getInitialLocation();
    }else{
      await this.edit_address();
    }
  }

  edit_address = async () => {
    this.props.editServiceActionPending();
    await axios({
      method: 'get', 
      url: api_url+address+'/'+this.state.address_id+'/edit' ,
    })
    .then(async response => {
        await this.props.editServiceActionSuccess(response.data);
        await this.setState({ open_map:1 })
        await this.setLocation();
    })
    .catch(error => {
        this.showSnackbar(strings.sorry_something_went_wrong);
        this.props.editServiceActionError(error);
    });
  }
 
  setLocation(){
    let region = {
      latitude: parseFloat(this.props.data.latitude),
      longitude: parseFloat(this.props.data.longitude),
      latitudeDelta:  LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }
    this.setState({ address : this.props.data.address, door_no : this.props.data.door_no, mapRegion: region })
  }

  update_address = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if(this.state.validation){
        this.props.updateServiceActionPending();
        await axios({
          method: 'patch', 
          url: api_url+address+'/'+this.state.address_id,
          data:{ customer_id: global.id, address: this.state.address.toString(), door_no: this.state.door_no, latitude: this.state.latitude, longitude: this.state.longitude }
        })
        .then(async response => {
            await this.props.updateServiceActionSuccess(response.data);
            await this.redirect(response.data);
        })
        .catch(error => {
            this.showSnackbar(strings.sorry_something_went_wrong);
            this.props.updateServiceActionError(error);
        });
    }
  }

  async getInitialLocation(){

    await Geolocation.getCurrentPosition( async(position) => {
      this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      let region = {
        latitude:       await position.coords.latitude,
        longitude:      await position.coords.longitude,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      this.setState({ mapRegion: region, open_map:1 });
      
    }, error => console.log(error) , 
    {enableHighAccuracy: false, timeout: 10000 });
  }


  onRegionChange = async(value) => {
    this.setState({ address : strings.please_wait });
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
           if(responseJson.results[0].formatted_address != undefined){
              this.setState({ address : responseJson.results[0].formatted_address, latitude: value.latitude, longitude: value.longitude });
           }else{
              this.setState({ address : strings.sorry_something_went_wrong });
           }
    }) 
  }

  render() {

    const { isLoding } = this.props

    return (
      <SafeAreaView keyboardShouldPersistTaps='always' style={{ width:'100%', height:'100%', backgroundColor:colors.theme_bg_three }} > 
        
        {this.state.open_map == 1 && <ScrollView keyboardShouldPersistTaps='always'>
          <View style={styles.content} >
           <MapView
               provider={PROVIDER_GOOGLE} 
               style={styles.map}
               initialRegion={ this.state.mapRegion }
               showsUserLocation={true}
                showsMyLocationButton={true}
               onRegionChangeComplete={(region) => {
                  this.onRegionChange(region); 
               }}
            >
            </MapView>
            <View style={styles.location_markers}>
              <View style={styles.pin} >
                <Image
                  style= {{flex:1 , width: undefined, height: undefined}}
                  source={pin}
                />
              </View>
            </View>
          </View>
          <View style={{ margin:10 }}/>
          <View style={styles.address_content} >
            <View style={{ flexDirection:'row' }} >
              <View>
                <Text style={styles.landmark_label} >{strings.door_number} / {strings.landmark}</Text>
              </View>
            </View> 
            <View style={styles.landmark_content} >
              <TextInput 
                style={styles.landmark_text}
                placeholder="Enter your Landmark"
                placeholderTextColor={colors.theme_fg_four}
                onChangeText={ TextInputValue =>
                  this.setState({door_no : TextInputValue }) }
                value={this.state.door_no}
              />
            </View>
            <View style={{ marginTop:20 }} />
            <View style={{ flexDirection:'row' }} >
              <View>
                <Text style={styles.address_label} >{strings.address}</Text>
              </View>
            </View> 
            <View style={{ flexDirection:'row' }} >
              <View>
                <Text style={styles.address_text} >
                  {this.state.address}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop:"25%"}}/>
          {this.state.open_map == 1 && <TouchableOpacity activeOpacity={1} style={styles.footer}>
             <Button
              title={strings.done}
              onPress={ this.state.address_id != 0 ? this.update_address : this.add_address}
              buttonStyle={styles.done}
              titleStyle={{ fontFamily:bold,color:colors.theme_fg_three, fontSize:14 }}
            />
          </TouchableOpacity>
        }
        </ScrollView>}
        
        <Loader visible={isLoding} />
      </SafeAreaView>

    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.address.isLoding,
    message : state.address.isLoding,
    status : state.address.isLoding,
    data : state.address.data
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
    editServiceActionPending: () => dispatch(editServiceActionPending()),
    editServiceActionError: (error) => dispatch(editServiceActionError(error)),
    editServiceActionSuccess: (data) => dispatch(editServiceActionSuccess(data)),
    updateServiceActionPending: () => dispatch(updateServiceActionPending()),
    updateServiceActionError: (error) => dispatch(updateServiceActionError(error)),
    updateServiceActionSuccess: (data) => dispatch(updateServiceActionSuccess(data))
});

export default connect(mapStateToProps,mapDispatchToProps)(Address);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  header:{
    backgroundColor:colors.theme_bg_three
  },
  icon:{
    color:colors.theme_fg
  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg,
    alignSelf:'center', 
    fontSize:16, 
    fontFamily: bold
  },
  map: {
    width:'100%',
    height:height_50
  },
  location_markers: {
    position: 'absolute',
  },
  content: {
    alignItems:'center', 
    justifyContent:'center'
  },
  pin:{
    height:30, 
    width:25, 
    top:-15 
  },
  address_content:{
    width:'100%', 
    padding:10, 
    backgroundColor:colors.theme_bg_three, 
    marginBottom:10,
    fontFamily:bold
  },
  landmark_label:{
    fontSize:15,  
    color:colors.theme_fg,
    fontFamily: bold,
    paddingLeft:3
  },
  landmark_content:{
    width:'100%',
    fontSize:13,
    borderColor: colors.theme_bg,
  },
  landmark_text:{
    borderColor: colors.theme_fg, 
    color:colors.theme_description,
    borderBottomWidth: 1,  
    borderRadius:5, 
    height:40,
    fontSize:13,
    fontFamily: normal
  },
  address_label:{
    fontSize:15,  
    color:colors.theme_fg,
    fontFamily:bold,
    paddingLeft:3
  },
  address_text:{
    fontSize:13, 
    marginTop:5,
    color:colors.theme_description,
    fontFamily:normal,
    paddingLeft:3
  },
  footer:{
    backgroundColor:'transparent',
    position:'absolute',
    bottom:10,
    width:'90%',
    marginLeft:'5%',
    marginRight:'5%'
  },
  done:{
    backgroundColor:colors.theme_bg,
    padding:10, 
    borderRadius:10,
    height:45
  }
});
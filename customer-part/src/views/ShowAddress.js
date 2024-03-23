import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, SafeAreaView , TouchableOpacity, Platform} from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';
import { connect } from 'react-redux';
import  Loader  from '../components/GeneralComponents';
import { listServiceActionPending, listServiceActionError, listServiceActionSuccess, deleteServiceActionPending, deleteServiceActionError, deleteServiceActionSuccess } from '../actions/AddressListActions';
import { selectAddress } from '../actions/CartActions';
import { api_url, address_list, address_delete, img_url, no_data, bold, normal } from '../config/Constants';
import { ConfirmDialog  } from 'react-native-simple-dialogs';
import * as colors from '../assets/css/Colors';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import strings from "../languages/strings.js";
import CardView from 'react-native-cardview';

class ShowAddress extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        dialogVisible:false,
        deleting_address:0,
      }
  } 

  async componentDidMount(){
    this._unsubscribe=this.props.navigation.addListener('focus',()=>{
      this.address_list();
    });
  }
  componentWillUnmount(){
    this._unsubscribe();
  } 

  address_list = async () => {
    this.setState({dialogVisible: false})
    this.props.deleteServiceActionPending();
    await axios({
      method: 'post', 
      url: api_url + address_list,
      data:{ customer_id: global.id}
    })
    .then(async response => {
      await this.props.deleteServiceActionSuccess(response.data);
    })
    .catch(error => {
      this.props.deleteServiceActionError(error);
    });
  }

  address_delete = async () => {
    this.setState({dialogVisible: false})
    this.props.deleteServiceActionPending();
    await axios({
      method: 'post', 
      url: api_url + address_delete,
      data:{ customer_id: global.id, address_id : this.state.deleting_address}
    })
    .then(async response => {
      await this.props.deleteServiceActionSuccess(response.data);
      await this.setState({deleting_address: 0});
      
    })
    .catch(error => {
      this.props.deleteServiceActionError(error);
    });
  }

  open_popup(id){
    this.setState({dialogVisible: true, deleting_address:id})
  }

  close_popup(){
    this.setState({dialogVisible: false, deleting_address:0})
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  add_address = () => {
    if (Platform.OS === "android"){
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
      .then(data => {
        this.props.navigation.navigate('Address',{ id:0 });
      }).catch(err => {
        alert(strings.please_enable_your_location);
      }); 
    }else{
      this.props.navigation.navigate('Address',{ id:0 });
    }
     
  }

   edit_address = (id) => {
    if (Platform.OS === "android"){
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
      .then(data => {
         this.props.navigation.navigate('Address',{ id: id});
      }).catch(err => {
          alert('Please enable location');
      }); 
    }else{
      this.props.navigation.navigate('Address',{ id: id});
    }
    
  }

  select_address= async (id) => {
    await this.props.selectAddress(id);
    await this.props.navigation.navigate('Cart');
  }

  render() {
    
    const { isLoding, error, data, message, status, address_count } = this.props

    const address_list = data.map((row,key) => {
      return (
        <CardView
          cardElevation={5}
          cardMaxElevation={5}
          style={{backgroundColor:colors.theme_fg_three, width:350, marginBottom:10 }}
          cornerRadius={10}>
          <View style={styles.static_map} >
            <Image
              style= {{ flex:1, width: undefined, height: undefined}}
              source={{uri:  img_url + row.static_map }}
            />
          </View>  
          <View style={{ flexDirection:'row', padding:10 }} >
            <View>
              <Text style={styles.address} >
                {row.address}
              </Text>
            </View>
          </View>
          <View style={styles.address_footer} >
            <View style={{ width:'32%', flexDirection:'column' }} >
              <Text onPress={ this.edit_address.bind(this,row.id) } style={styles.btn} >{strings.edit}</Text>
            </View>
            <View style={{ marginRight:'2%' }} />
            <View style={{ width:'32%', flexDirection:'column' }}>
              <Text onPress={this.open_popup.bind(this,row.id)} style={styles.btn} >{strings.delete}</Text>
            </View>
            <View style={{ marginRight:'2%' }} />
          </View>
      </CardView>
      )
    })

    return (
      <SafeAreaView keyboardShouldPersistTaps='always' style={{ width:'100%', height:'100%'}} > 
        <ScrollView keyboardShouldPersistTaps='always'>
          <View style={{ margin:5 }} />
            <View style={styles.container} >
              {address_count == 0 ? 
                <View style={{ height:200, alignItems:'center', justifyContent:'center', borderRadius:10 }} >
                  <Text style={{ color:colors.theme_fg }}>{no_data}</Text>
                </View> : 
                <View>
                  {address_list}
                </View>
              }
            </View>
        </ScrollView> 
        <TouchableOpacity style={styles.footer}>
            <Button
              title={strings.add_new_address}
              onPress={this.add_address}
              buttonStyle={{ backgroundColor:colors.theme_fg, padding:10, borderRadius:10, height:45}}
              titleStyle={{ fontFamily:bold,color:colors.theme_fg_three, fontSize:14 }}
            />
        </TouchableOpacity> 
        <ConfirmDialog
          title={strings.confirm}
          message={strings.are_you_sure_about_that}
          animationType="fade"
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          positiveButton={{
              title: strings.yes,
              onPress: this.address_delete ,
              titleStyle: {
                color: colors.theme_bg
              },
          }}
          negativeButton={{
              title: strings.no,
              onPress: () => this.setState({dialogVisible: false}),
              titleStyle: {
                color: colors.theme_bg
              },
          }}
        />
      <View style={{ marginTop:50 }}/>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.address_list.isLoding,
    message : state.address_list.isLoding,
    status : state.address_list.isLoding,
    data : state.address_list.data,
    address_count : state.address_list.address_count
  };
}

const mapDispatchToProps = (dispatch) => ({
    listServiceActionPending: () => dispatch(listServiceActionPending()),
    listServiceActionError: (error) => dispatch(listServiceActionError(error)),
    listServiceActionSuccess: (data) => dispatch(listServiceActionSuccess(data)),
    deleteServiceActionPending: () => dispatch(deleteServiceActionPending()),
    deleteServiceActionError: (error) => dispatch(deleteServiceActionError(error)),
    deleteServiceActionSuccess: (data) => dispatch(deleteServiceActionSuccess(data)),
    selectAddress: (data) => dispatch(selectAddress(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(ShowAddress);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding:10
  },
  address_conftent:{
    width:'100%',  
    backgroundColor:colors.theme_shade, 
    marginBottom:10 ,
    backgroundColor:colors.theme_bg_three,
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
  address_title:{
    fontSize:15, 
    fontFamily:bold, 
    color:colors.theme_fg 
  },
  static_map:{
    height:130, 
    width:'100%',
  },
  address:{
    fontSize:13, 
    marginTop:5,
    color:colors.theme_description,
    fontFamily:normal,
    backgroundColor:colors.theme_bg_three
  },
  address_footer:{
    flexDirection:'row', 
    marginTop:10,
    color:colors.theme_fg,
    backgroundColor:colors.theme_bg_three,
    padding:10
  },
  btn:{
    fontSize:14, 
    fontFamily:bold, 
    color:colors.theme_fg
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
    fontSize:16, 
    fontFamily:bold
  },
  your_address:{
    fontSize:16, 
    margin:10,
    fontFamily:bold,
    alignSelf:'center',
    color:colors.theme_fg 
  },
  footer:{
    backgroundColor:'transparent',
    position:'absolute',
    bottom:10,
    width:'90%',
    marginLeft:'5%',
    marginRight:'5%'
  },
  add_address:{
    backgroundColor:colors.theme_fg,
    fontFamily:normal
  }
});


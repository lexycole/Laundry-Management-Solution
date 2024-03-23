import React, {Component} from 'react';
import { StyleSheet, Text, View, Linking, Platform, SafeAreaView, ScrollView , TouchableOpacity} from 'react-native';
import * as colors from '../assets/css/Colors';
import { Button as Btn, Divider } from 'react-native-elements';
import Moment from 'moment';
import { order_status_change, api_url, bold, normal } from '../config/Constants';
import database from '@react-native-firebase/database';
import axios from 'axios';
import  Loader  from '../components/GeneralComponents';
import strings from "../languages/strings.js";
import Icon, { Icons } from '../components/Icons';
 
export default class OrderDetails extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        id : this.props.route.params.data,
        data : '',
        allowed_status : [ 2, 3, 5, 6 ],
        isLoding:false
      }
  }
 
  update_status = async () => {
    this.setState({ isLoding:true})
    await axios({
      method: 'post', 
      url: api_url + order_status_change,
      data:{ order_id: this.state.id, status: this.state.data.new_status }
    })
    .then(async response => {
      this.setState({ isLoding:false});
    })
    .catch(error => {
      this.setState({ isLoding:false});
    });
  }

  call_customer(phone_number){
    Linking.openURL(`tel:${phone_number}`);
  }

  move_navigate = (lat, lng) => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    var url = scheme + `${lat},${lng}`;
    Linking.openURL("google.navigation:q="+lat+" , "+lng+"&mode=d");
    //ios
    //Linking.openURL('maps://app?saddr=100+101&daddr=100+102')}
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }
  
  componentDidMount() {  
    database().ref('/delivery_partners/'+global.id+'/orders/'+this.state.id).on('value', snapshot => {
      if(snapshot.val() != null){
        this.setState({ data: snapshot.val() }, function() {
              console.log(snapshot.val())
        });
      }else{
        this.handleBackButtonClick();
      }
    });
  }

  render() {
    const { data, allowed_status, isLoding } = this.state
    return (
      <SafeAreaView style={{ width:'100%', height:'100%'}}>
        <Loader visible={isLoding}/>
          <ScrollView style={{padding:10}}>
            {data != '' &&
            <View>
            <View style={styles.row}>
              <View style={{ alignItems:'flex-start', justifyContent:'center'}}>
                <Text style={styles.address_label}>{strings.ordered_by}</Text>
                <Text style={styles.address}>{data.cus_name}</Text>
              </View>
              <View style={{ margin:5 }}/>
              <TouchableOpacity  onPress={() => this.call_customer(data.cus_phone)} style={{ alignItems:'flex-end', justifyContent:'center', }}>
                <Icon style={styles.icon_page} type={Icons.Feather} name="phone-call" color={colors.theme_bg} />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <View style={{ width:'90%' }} >
                <Text style={styles.address_label}>{strings.ordered_status}</Text>
                {global.lang == 'en' ?
                <Text style={{ marginTop:5, fontSize:12, color:colors.theme_description, fontFamily:bold}}>{data.status_name}</Text>
                :
                <Text style={{ marginTop:5, fontSize:12, color:colors.theme_fg, fontFamily:bold}}>{data.status_name_ar}</Text>
                }
              </View>
            </View>
            <View style={{ backgroundColor:colors.theme_bg_three }} />
            <View Style={{ backgroundColor:colors.theme_bg_three }}>
              <View Style={{backgroundColor: colors.theme_bg_three }} activeStyle={{backgroundColor: colors.theme_bg_three}} activeTextStyle={{color: colors.theme_bg_three, fontFamily: bold}} Style={{color: colors.theme_bg}} textStyle={{color: colors.theme_fg}} heading={strings.order_info}>
                <View style={styles.row}>
                  <View style={{ alignItems:'flex-start', justifyContent:'center'}}>
                    <Text style={styles.address_label}>{strings.pickup_date} & {strings.time}</Text>
                    <Text style={{ marginTop:5, fontSize:12, color:colors.theme_description, fontFamily:bold}}>{data.pickup_date}</Text>
                    <Text style={{ marginTop:5, fontSize:12, color:colors.theme_description, fontFamily:bold}}>{data.pickup_time}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ alignItems:'flex-start', justifyContent:'center'}}>
                    <Text style={styles.address_label}>{strings.delivery_date} & {strings.time}</Text>
                    <Text style={{ marginTop:5, fontSize:12, color:colors.theme_description, fontFamily:bold}}>{data.delivery_date}</Text>
                    <Text style={{ marginTop:5, fontSize:12, color:colors.theme_description, fontFamily:bold}}>{data.delivery_time}</Text>
                  </View>
                </View>
                <Divider style={styles.order_divider} />
                <View style={{flexDirection:'row', width:'100%' }}>
                  <View style={{alignItems:'flex-start', justifyContent:'center', paddingBottom:10, width:'90%'}}>
                    <Text style={styles.address_label}>{strings.address}</Text>
                    <Text style={styles.address}>{data.cus_address}</Text>
                  </View>
                  <TouchableOpacity  onPress={() => this.move_navigate(data.cus_address_lat,data.cus_address_lng)} style={{alignItems:'flex-start', justifyContent:'center',width:'10%'}}>
                    <Icon style={styles.icon_page} type={Icons.Feather} name="navigation" color={colors.theme_bg} />
                  </TouchableOpacity>
                </View>
                <Divider style={styles.order_divider} />
                <View style={{ flexDirection:'row' , paddingBottom:10}}>
                  <View>
                    <Text style={styles.address_label}>{strings.payment}</Text>
                    <Text style={styles.address}>{global.currency}{data.total}</Text>
                    {global.lang == 'en' ?
                    <Text style={{ marginTop:5,color: colors.theme_fg }}>{data.payment_mode}</Text>
                    :
                    <Text style={{ marginTop:5,color: colors.theme_fg }}>{data.payment_mode_ar}</Text>
                    }
                  </View>
                </View>
              </View>
              <Divider style={styles.order_divider} />
              <View Style={{backgroundColor: colors.theme_bg_three }} activeStyle={{backgroundColor: colors.theme_bg}} activeTextStyle={{color: colors.theme_bg_three, fontFamily: bold}} Style={{color: colors.theme_bg}} textStyle={{color: colors.theme_fg}} heading={strings.cloth_list}>
              
                <View style={styles.row}>
                  <View>
                    <Text style={styles.your_cloths}>{strings.your_clothes}</Text>
                  </View>
                </View>
                
                  {data.items.map((row, index) => (
                    <View>
                      <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
                        <View style={{ width:'60%', flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}} >
                          <Text style={{fontFamily:normal, color: colors.theme_fg_two}} >{row.qty}x</Text>
                          <View style={{ margin:3}}/>
                        
                          {global.lang == 'en' ? 
                          <Text style={{ fontFamily:normal, color: colors.theme_fg_two}}>{row.product_name}( {row.service_name} )</Text>
                          :
                          <Text style={{ marginLeft:20, color: colors.theme_fg_two }}>{row.product_name_ar}( {row.service_name_ar} )</Text>
                          }
                        </View>
                        <View style={{ width:'40%', alignItems:'flex-end', justifyContent:'center'}} >
                          <Text style={{ fontFamily:normal, color: colors.theme_fg_two }}>{global.currency}{row.price}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                
                <View style={{margin:5}}/>
                <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
                  <View style={{ width:'60%', alignItems:'flex-start', justifyContent:'center'}} >
                    <Text style={{ fontFamily:normal, color: colors.theme_fg_two }}>{strings.sub_total}</Text>
                  </View>
                  <View style={{ width:'40%', alignItems:'flex-end', justifyContent:'center'}} >
                    <Text style={{ fontFamily:normal, color: colors.theme_fg_two }} >{global.currency}{data.sub_total}</Text>
                  </View>
                </View>
                <View style={{margin:5}}/>
                <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
                  <View style={{ width:'60%', alignItems:'flex-start', justifyContent:'center'}} >
                    <Text style={{fontFamily:normal, color: colors.theme_fg_two}}>{strings.discount}</Text>
                  </View>
                  <View style={{ width:'40%', alignItems:'flex-end', justifyContent:'center'}} >
                    <Text style={{ fontFamily:normal, color: colors.theme_fg_two }} >{global.currency}{data.discount}</Text>
                  </View>
                </View>
                <View style={{margin:5}}/>
                <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
                  <View style={{ width:'60%', alignItems:'flex-start', justifyContent:'center'}} >
                    <Text style={{fontFamily:normal, color: colors.theme_fg_two}}>{strings.delivery_cost}</Text>
                  </View>
                  <View style={{ width:'40%', alignItems:'flex-end', justifyContent:'center'}} >
                    <Text style={{ fontFamily:normal, color: colors.theme_fg_two }} >{global.currency}{global.delivery_cost}</Text>
                  </View>
                </View>
                 <View style={{margin:5}}/>
                <Divider style={styles.order_divider} />
                <View style={{margin:5}}/>
                <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}}>
                  <View style={{ width:'60%', alignItems:'flex-start', justifyContent:'center'}} >
                    <Text style={{fontFamily:bold,color: colors.theme_fg_two, fontSize:18 }}>{strings.total}</Text>
                  </View>
                  <View style={{ width:'40%', alignItems:'flex-end', justifyContent:'center'}} >
                    <Text style={{ fontFamily:bold,color: colors.theme_fg_two, fontSize:18 }} >{global.currency}{data.total}</Text>
                  </View>
                </View>
                <View style={{margin:5}}/>
                <Divider style={styles.order_divider} />
             <View style={{margin:5}}/>
              </View>
            </View>
            </View>
          }
            <View style={{margin:'10%'}}/>
          </ScrollView>
          {data != '' && allowed_status.includes(parseInt(data.status)) &&
            <TouchableOpacity style={styles.footer} >
                {global.lang == 'en' ?
                <Btn
                  onPress={this.update_status}
                  title={data.new_status_name}
                  buttonStyle={{ backgroundColor:colors.theme_fg, padding:10, borderRadius:10}}
                  titleStyle={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:14 }}
                />
                :
                <Btn
                  onPress={this.update_status}
                  title={data.new_status_name_ar}
                  buttonStyle={{ backgroundColor:colors.theme_fg, padding:10, borderRadius:10}}
                  titleStyle={{ fontFamily:bold, color:colors.theme_fg_three, fontSize:14 }}
                />
                }
              <View style={{marginBottom:5}}/>
            </TouchableOpacity>
          }
        <Loader visible={isLoding} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
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
    fontFamily:bold
  },
  order_id:{
    marginTop:10, 
    fontSize:15, 
    color:colors.theme_fg, 
    fontFamily:bold
  },
  created_at:{
    marginTop:5, 
    fontSize:12
  },
  status:{
    marginTop:10, 
    fontSize:16, 
    color:colors.theme_fg, 
    fontFamily:bold,
    alignSelf:'flex-start'
  },
  order_divider:{
    backgroundColor: colors.theme_fg, 
    width:'100%', 
    alignSelf:'center',
  },
  row:{
    flexDirection:'row',
    paddingBottom:10
  },
  address_label:{
    marginTop:10, 
    fontSize:14, 
    color:colors.theme_fg,
    fontFamily:bold
  },
  address:{
    marginTop:5, 
    fontSize:12,
    color:colors.theme_description,
    fontFamily:bold
  },
  delivery_date_label:{
    marginTop:10, 
    fontSize:13, 
    color:colors.theme_fg,
    fontFamily:bold
  },
  delivery_date:{
    marginTop:5, 
    fontSize:13
  },
  your_cloths:{
    marginTop:10, 
    marginBottom:10, 
    fontSize:16, 
    color:colors.theme_fg, 
    fontFamily:bold
  },
  qty:{
    fontSize:15, 
    color:colors.theme_fg, 
    fontFamily:bold
  },
  total_label:{
    fontFamily:bold, 
    padding:5,
    color:colors.theme_fg
  },
  total:{
    fontFamily:bold, 
    color:colors.theme_fg
  },
  icon_page:{
    color:colors.theme_fg,
  },
  footer:{
    backgroundColor:'transparent',
    position:'absolute',
    bottom:0,
    width:'90%',
    marginLeft:'5%',
    marginRight:'5%'
  },
});

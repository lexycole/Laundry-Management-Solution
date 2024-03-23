import React, {Component} from 'react';
import { ScrollView,StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { no_data, pickup_icon, delivery_icon, washing_icon, bold, normal } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import  Loader  from '../components/GeneralComponents';
import Moment from 'moment';
import database from '@react-native-firebase/database';
import ProgressCircle from 'react-native-progress-circle-rtl';
import strings from "../languages/strings.js";
import CardView from 'react-native-cardview';

export default class MyOrders extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      received_status:0,
      no_data:0,
      order_index:1,
      all_orders:[],
      isLoding:false,
    }  
  }

  componentDidMount() {  
    database().ref('/delivery_partners/'+global.id+'/orders').on('value', snapshot => {
      var all_orders = [];
      if(snapshot.val() == null){
        this.setState({ no_data : 1, all_orders:[]}, function() {
        });
      }
      snapshot.forEach((child) => {
          if(child.val()){
            all_orders.push(child.val());
              this.setState({ all_orders:all_orders, received_status : 1, no_data : 0 }, function() {
            });
          }
      });
    });
  }

  myorders_details = (data) => {
    this.props.navigation.navigate('OrderDetails',{ data : data });
  }

  change_index = async(index) =>{
    this.setState({ order_index:index});
  }

  render() {
    
    return (
      <SafeAreaView >
        <Loader visible={this.state.isLoding} />
          <ScrollView style={{ padding:10}}>
            <View style={{ margin:10 }} />
            {this.state.order_index ==1 &&
              <View>
                {this.state.all_orders.map((row, index) => (
                  <View style={{ marginBottom:20 }}>
                    <CardView
                      cardElevation={2}
                      style={{ alignItems:'center', justifyContent:'center' }}
                      cardMaxElevation={5}
                      cornerRadius={10}>
                        <TouchableOpacity onPress={() => this.myorders_details(row.id)} style={{ flexDirection:'row' }} activeOpacity={1} >
                          <View style={{width:'30%', backgroundColor:colors.theme_fg_three, alignItems:'center', justifyContent:'center' }} >
                            <ProgressCircle
                              percent={row.status * 14.285}
                              radius={40}
                              borderWidth={3}
                              color={colors.theme_fg}
                              shadowColor="#ffffff"
                              bgColor="#ffffff"
                            >
                              <View style={{ height:20, width:20 }} >
                                {row.status == 2 &&
                                  <Image
                                    style= {{flex:1 , width: undefined, height: undefined}}
                                    source={pickup_icon}
                                  />
                                }
                                {row.status == 3 &&
                                  <Image
                                    style= {{flex:1 , width: undefined, height: undefined}}
                                    source={pickup_icon}
                                  />
                                }
                                {row.status == 4 &&
                                  <Image
                                    style= {{flex:1 , width: undefined, height: undefined}}
                                    source={washing_icon}
                                  />
                                }
                                {row.status == 5 &&
                                  <Image
                                    style= {{flex:1 , width: undefined, height: undefined}}
                                    source={delivery_icon}
                                  />
                                }
                                {row.status == 6 &&
                                  <Image
                                    style= {{flex:1 , width: undefined, height: undefined}}
                                    source={delivery_icon}
                                  />
                                }
                                {row.status == 7 &&
                                  <Image
                                    style= {{flex:1 , width: undefined, height: undefined}}
                                    source={delivery_icon}
                                  />
                                }
                              </View>
                            </ProgressCircle>
                          </View>
                          <View style={{ width:'70%', alignItems:'flex-start', justifyContent:'center', padding:15 }} >
                            <Text style={{fontSize:14, fontFamily:bold, color:colors.regular_grey}}>{strings.order_id} : {row.order_id}</Text>
                            <View style={{ margin:3 }}/>
                            <View style={{ flexDirection:'row' }}>
                              <Text style={{ fontSize:14, fontFamily:bold, color:colors.regular_grey}}>{strings.payment} : </Text>
                              <Text style={{ fontSize:14, fontFamily:bold, color:colors.regular_grey}}>{global.currency} {row.total}</Text>
                              <View style={{ margin:3 }}/>
                              {global.lang == 'en' ?
                              <Text style={{ fontSize:14, fontFamily:bold, color:colors.regular_grey}}>{row.payment_mode}</Text>
                              :
                              <Text style={{ fontSize:14, fontFamily:bold, color:colors.regular_grey }}>{row.payment_mode_ar}</Text>
                              }
                            </View>
                            <View style={{ margin:3 }}/>
                            <View style={{ flexDirection:'row' }}>
                              <Text style={{  fontSize:14, fontFamily:bold, color:colors.regular_grey }}>{strings.delivery_date} : </Text>
                              <Text style={{  fontSize:14, fontFamily:bold, color:colors.regular_grey}}>{row.delivery_date}</Text>
                            </View>
                            <View style={{ margin:3 }}/>
                            {global.lang == 'en' ?
                              <Text style={{ fontSize:14, fontFamily:bold, color:colors.theme_fg }}>{row.status_name}</Text>
                            :
                              <Text style={{ fontSize:14, fontFamily:bold, color:colors.theme_fg }}>{row.status_name_ar}</Text>
                            }
                          </View>
                        </TouchableOpacity>
                      </CardView>
                  </View>
                  )).reverse()}  
                  {this.state.no_data == 1 &&
                    <View style={{ margin:50}}>
                    <View style={{ alignItems:'center', justifyContent:'center' }} >
                      <Text style={{ color:colors.theme_fg}}>{no_data}</Text>
                    </View>
                  </View>
                  }
                </View>
              }
              <View style={{margin:50}}/>
            </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg,
    borderColor:colors.theme_fg
  },
  icon:{
    color:colors.theme_fg
  },
  header_body: {
    flex: 3,
    justifyContent: 'center',
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg,
    alignSelf:'center', 
    fontSize:16, 
    fontFamily:bold
  },
  order_id:{
    fontSize:12, 
    color:colors.theme_description,
    fontFamily:normal,
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor:colors.theme_fg,
  },
  delivery_date_title:{
    fontSize:13, 
    fontFamily:bold, 
    color:colors.theme_fg
  },
  delivery_date:{
    fontSize:13, 
    color:colors.theme_fg
  },
  status:{
    fontSize:17,
    fontFamily:bold, 
    color:colors.theme_fg
  },
  total:{
    fontSize:15, 
    fontFamily:bold,
    color:colors.theme_fg
  },
  active_text:{
    fontSize:14, 
    fontFamily:bold, 
    color:colors.theme_fg_three,
    textAlign:'center'
  },
  inactive_text:{
    fontSize:14, 
    fontFamily:normal, 
    color:colors.theme_fg_three,
    textAlign:'center'
  },
});
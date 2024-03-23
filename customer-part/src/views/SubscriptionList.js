import React, {Component} from 'react';
import { StyleSheet, TouchableOpacity, Image, View, SafeAreaView, ScrollView, Text, FlatList } from 'react-native';
import * as colors from '../assets/css/Colors';
import { bold, regular , img_url, subscription_packages, api_url, subscription_img } from '../config/Constants';
import axios from 'axios';
import  Loader  from '../components/GeneralComponents';
import strings from '../languages/strings';

class SubscriptionList extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      show_info:'',
      isLoading:false,
      package_list:[],
      existing_sub_id:0,
      existing_sub_details:'',
      
    }
  }
  async componentDidMount(){
    this._unsubscribe=this.props.navigation.addListener('focus',()=>{
      this.view_subscription();
    });
  }

  componentWillUnmount(){
    this._unsubscribe();
  } 

  async view_subscription(){
    this.setState({ isLoading : true });
    await axios({
      method: 'post', 
      url: api_url + subscription_packages,
      data: {customer_id: global.id}
    })
    .then(async response => {
      this.setState({ isLoading : false, package_list:response.data.result.subscriptions,
      existing_sub_id:response.data.result.existing_subscription_id,
      existing_sub_details:response.data.result.existing_subscription_details
     });
    })
    .catch(error => {
      this.setState({ isLoading : false });
    });
  }

  navigate_details = async(item) =>{
    this.props.navigation.navigate('SubscriptionDetails',{item:item});
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor:colors.theme_fg_three, flex:1, padding:10 }}>
        <Loader visible={this.state.isLoading} />
        {this.state.existing_sub_id ==0 ?
          <ScrollView style={{ padding:10 }}>
          <FlatList
              data={this.state.package_list}
              renderItem={({ item,index }) => (
                <View>
            <TouchableOpacity onPress={this.navigate_details.bind(this,item)} activeOpacity={1} style={{height:150, width:'100%', borderRadius:40}}>
              <Image style= {{ height: undefined,width: undefined,flex: 1,borderRadius:10 }} source={{ uri: img_url+item.sub_image}} />
              <View style={{ width:'100%', padding:20, position:'absolute', top:0, alignItems:'center', justifyContent:'center'}}>
                <View style={{ flexDirection:'row' }} >
                  <View style={{ width:'100%', alignItems:'flex-start', justifyContent:'center' }}>
                    <Text style={{ fontFamily:bold, fontSize:16, color:colors.theme_bg_three, letterSpacing:0.5}}>{item.sub_name}</Text> 
                    <View style={{ margin:2 }} />
                    <Text numberOfLines={2} style={{ fontFamily:regular, fontSize:14, color:colors.theme_bg_three}}>{item.sub_description}</Text> 
                  </View> 
                </View> 
                <View style={{ margin:5 }} />
                <View style={{ width:'100%', alignItems:'center', justifyContent:'center', flexDirection:'row' }}>
                  <View style={{ width:'30%', alignItems:'center', justifyContent:'center' }}>
                    <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_bg_three, letterSpacing:0.5}}>{strings.order_count}</Text> 
                    <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_bg_three}}>{item.no_of_bookings}</Text>
                  </View>
                  <View style={{ margin:2 }} />
                  <View style={{ height:40, backgroundColor:colors.grey, width:2}}/>
                  <View style={{ margin:2 }} />
                  <View style={{ width:'30%', alignItems:'center', justifyContent:'center' }}>
                    <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_bg_three, letterSpacing:0.5}}>{strings.price}</Text> 
                    <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_bg_three, letterSpacing:0.5}}>{global.currency}{item.sub_fee}</Text> 
                  </View>
                  <View style={{ margin:2 }} />
                  <View style={{ height:40, backgroundColor:colors.grey, width:2 }}/>
                  <View style={{ margin:2 }} />
                  <View style={{ width:'30%', alignItems:'center', justifyContent:'center' }}>
                    <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_bg_three, letterSpacing:0.5}}>{strings.validity}</Text> 
                    <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_bg_three}}>{item.validity_label}</Text> 
                  </View>
                </View>  
              </View> 
            </TouchableOpacity>
            <View style={{ margin:10 }}/>
            </View>
            )}
            keyExtractor={item => item.faq_name}
          />
          </ScrollView>
        :
          <ScrollView>
            <View style={{ justifyContent:'center', alignItems:'center' }}>
              <View style={{height:150, width:150}}>
              <Image style= {{ height: undefined,width: undefined,flex: 1, justifyContent:'center', alignItems:'center' }} source={subscription_img} />
              </View>
            </View>
            <View style={{ margin:10 }}/>
            <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two, justifyContent:'center', textAlign:'center' }}>{strings.now_you_are_in} {this.state.existing_sub_details.sub_name} {strings.subscription}.</Text>
            <View style={{ margin:5 }}/>
            {this.state.existing_sub_details.benefits.map((row, index) => (
              <View style={{ flexDirection:'row', width:'100%', marginTop:20, backgroundColor:colors.light_blue, borderRadius:10, padding:5 }}>
                <View style={{ width:'30%', alignItems:'center', justifyContent:'center' }}> 
                  <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }}>{strings.service_name}</Text>
                  <View style={{ margin:2 }}/>
                  <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two }}>{row.service_name}</Text>
                </View>
                <View style={{ height:40, backgroundColor:colors.grey, width:0.5 }}/>
                <View style={{ width:'30%', alignItems:'center', justifyContent:'center' }}> 
                  <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }}>{strings.category_name}</Text>
                  <View style={{ margin:2 }}/>
                  <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two }}>{row.category_name}</Text>
                </View>
                <View style={{ height:40, backgroundColor:colors.grey, width:0.5 }}/>
                <View style={{ width:'30%', alignItems:'center', justifyContent:'center' }}> 
                  <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }} >{strings.product_name}</Text>
                  <View style={{ margin:2 }}/>
                  <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two }}>{row.product_name}</Text>
                </View>
                <View style={{ height:40, backgroundColor:colors.grey, width:0.5 }}/>
                <View style={{ width:'10%', alignItems:'center', justifyContent:'center' }}> 
                  <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two }}>{strings.qty}</Text>
                  <View style={{ margin:2 }}/>
                  <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two }}>{row.qty}</Text>
                </View>
                <View style={{ marginTop:10 }}/>
              </View>
            ))}
        </ScrollView>
        }
      </SafeAreaView>
    );
  }
}

export default SubscriptionList;

const styles = StyleSheet.create({

});

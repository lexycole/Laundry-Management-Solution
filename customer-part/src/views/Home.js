import React, {Component} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, I18nManager, SafeAreaView} from 'react-native';
import { img_url, api_url, service, bold, normal, app_name_img } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/HomeActions';
import { filterType } from '../actions/MyOrdersActions';
import { productListReset } from '../actions/ProductActions';
import { TabActions } from '@react-navigation/native';
import Slideshow from 'react-native-image-slider-show';
import strings from "../languages/strings.js";
import RNRestart from 'react-native-restart';
import Moment from 'moment';
import CardView from 'react-native-cardview';
import Icon, { Icons } from '../components/Icons';

class Home extends Component<Props>{

  constructor(props) {
      super(props)
      this.state={
        position: 1,
        dataSource:[],
        language : global.lang,
        active_order:0,
        completed_order:0,
        pending_orders:[],
        pending_orders_count:0
      }
  }

  drawer = () =>{
    this.props.navigation.toggleDrawer()
  }

  async componentDidMount(){
    this._unsubscribe=this.props.navigation.addListener('focus',async ()=>{
      this.Service(); 
    });
  }

  componentWillUnmount(){
    this._unsubscribe();
  }

  componentWillMount() {
    
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position: this.state.position === this.state.dataSource.length ? 0 : this.state.position + 1
        });
      }, 3000)
    });
  }

  myorders_details = (data) => {
    this.props.navigation.navigate('OrderDetails',{ data : data });
  }

  product = async (id,service_name) => {
    await this.props.productListReset();
    await this.props.navigation.navigate('Product',{ id:id, service_name:service_name });
  } 

  Service = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post', 
      url: api_url + service,
      data:{ customer_id : global.id, lang: global.lang }
    })
    .then(async response => {
      console.log(response.data)
      this.setState({ sub_id:response.data.result.sub_id, pending_orders_count:response.data.pending_orders_count, pending_orders:response.data.pending_orders, dataSource: response.data.banner_images, active_order:response.data.order.active, completed_order:response.data.order.completed });
      await this.props.serviceActionSuccess(response.data)
    })
    .catch(error => {
      this.props.serviceActionError(error);
    });
  }

  async language_change(lang){
    try {
      await AsyncStorage.setItem('lang', lang);
      await strings.setLanguage(lang);
      if(lang == 'ar'){
        await I18nManager.forceRTL(true);
        await RNRestart.Restart();
      }else{
        await I18nManager.forceRTL(false);
        await RNRestart.Restart();
      }
    } catch (e) {

    }
  }

  my_orders = async (type) => {
    await this.props.filterType(type);
    const jumpToAction = TabActions.jumpTo('MyOrders');
    this.props.navigation.dispatch(jumpToAction);
  }

  render() {
    
    const { isLoding, error, data, message, status } = this.props

    const service_list = data.map((row) => {
      let service_image = img_url + row.image;
      return (
        <CardView
          cardElevation={5}
          style={{ marginRight:10, borderRadius:10, alignItems:'center', justifyContent:'center', margin:10, padding:10, backgroundColor:colors.theme_fg_three, borderColor:colors.theme_fg_three }}
          cardMaxElevation={5}
          cornerRadius={10}>
          <TouchableOpacity style={{ alignItems:'center', justifyContent:'center', padding:15 }} activeOpacity={1} onPress={() => this.product(row.id, row.service_name)}>
            <View style={styles.service_icon} >
              <Image
                style= {{flex:1 , width: undefined, height: undefined}}
                source={{ uri : service_image }}
              />
            </View>
            <View style={{ margin:5 }} />
            <Text style={{ color:colors.theme_fg, fontFamily:bold, fontSize:14 }}>{row.service_name}</Text>
          </TouchableOpacity>
        </CardView>
      )
    })

    return (
      <SafeAreaView>
        <View style={{ height:60, flexDirection:'row', width:'100%', justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity activeOpacity={1} onPress={this.drawer.bind(this)} style={{ width:'15%', padding:5, alignItems:'flex-start', justifyContent:'center'}}>
            <Icon type={Icons.Entypo} name='menu' />
          </TouchableOpacity>
          <View style={{ width:'70%', alignItems:'center', justifyContent:'center' }}>
            <View style={{ width:80, height:34}}>
              <Image
                source={app_name_img}
                style={{ height:undefined, width:undefined, flex:1}}
              />
            </View>
          </View>
          <View style={{ width:10, height:10, borderRadius:5, backgroundColor:'red', position:'absolute', right:4, top:15}} />
          <TouchableOpacity activeOpacity={1} onPress={this.props.navigation.navigate.bind(this,'Notification')} style={{ width:'15%', padding:5,  alignItems:'flex-end', justifyContent:'center'}}>
            <Icon type={Icons.Ionicons} name='notifications' />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View>
            <Slideshow 
              arrowSize={0}
              indicatorSize={0}
              scrollEnabled={true}
              position={this.state.position}
              dataSource={this.state.dataSource}/>
          </View>
          <View style={{ margin:10 }} />
          <View style={{ padding:10 }}>
            <Text style={{ color:colors.theme_fg, fontSize:18,fontFamily:bold }}>{strings.are_you_looking_for}</Text>
          </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {service_list}
            </ScrollView>
          <View style={{ margin:5 }} />
          <Text style={{ padding:10, color:colors.theme_fg, fontSize:18,fontFamily:bold }}>{strings.active_orders} ({this.state.pending_orders_count})</Text>
            {this.state.pending_orders_count == 0 &&
               <Text style={{ padding:10, color:colors.theme_description, fontSize:14, textAlign:'center',fontFamily:normal }}>{strings.you_have_no_orders}</Text>
            }
          
            {this.state.pending_orders.map((row, index) => (
            <View style={{ paddingTop:15, marginLeft:10, marginRight:10 }}>
              <CardView
                cardElevation={5}
                style={{ padding:10, borderWidth:1, borderColor:colors.theme_fg_three, backgroundColor:colors.theme_fg_three}}
                cardMaxElevation={5}
                cornerRadius={10}>
              <TouchableOpacity onPress={() => this.myorders_details(row)} style={{ flexDirection:'row'}} >
                <View style={{ width:'25%' }}>
                  <View style={{ height:60, width:60,color:colors.theme_fg }} >
                    <Image
                      style= {{flex:1 , width: undefined, height: undefined}}
                      source={{ uri : img_url + row.image }}
                    />
                  </View>
                  
                </View>
                 <View style={{ width:'50%' }} >
                  <View style={{ alignItems:'flex-start'}}>
                    <Text style={styles.order_id}>{strings.order_id}: {row.order_id}</Text>
                    <View style={{ margin:3}} />
                    <Text style={{ fontSize:14, fontFamily:normal,color:colors.theme_description}} >{Moment(row.created_at).format('DD MMM-YYYY hh:mm')}</Text>
                    <View style={{ margin:3}} />
                    <Text style={{ color:colors.theme_fg,fontFamily:bold, fontSize:16 }} >{row.label_name}</Text>
                  </View>
                </View>
                <View style={{ alignItems:'flex-end', justifyContent:'center', width:'25%'}}>
                  <Text style={{ fontSize:14, fontFamily:bold, color:colors.theme_fg_two }} >{global.currency}{row.total}</Text>
                </View>
              </TouchableOpacity>
              </CardView>
            </View>
            ))}
            <View style={{ margin:50 }} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.home.isLoding,
    error : state.home.error,
    data : state.home.data,
    message : state.home.message,
    status : state.home.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
    productListReset: () => dispatch(productListReset()),
    filterType: (data) => dispatch(filterType(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  service_name:{
    color:colors.theme_bg, 
    fontSize:18, 
    fontFamily:bold
  },
  service_icon:{
    height:90, 
    width:90,
    borderRadius:50,
    borderWidth:1,
    borderColor:colors.theme_bg,
    padding:15
  },
  orders_icon:{
    height:80, 
    width:80 
  },
  language_icon:{
    height:30, 
    width:30 
  },
  icon:{
    color:colors.theme_fg,
  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  title:{    
    color:colors.theme_fg, 
    fontSize:18,
    fontFamily:normal
  },
  order_id:
  {
    color:colors.theme_fg_two,
    fontFamily:normal,
    fontSize:14
  },
  total:
  {
    color:colors.theme_fg,
    fontFamily:normal,
    fontSize:14
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width:'100%'
    
  },
});

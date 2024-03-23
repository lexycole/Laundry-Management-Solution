import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { api_url, my_orders, height_30, washing_machine, img_url,bold, normal } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import Moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess, filterType } from '../actions/MyOrdersActions';
import ProgressCircle from 'react-native-progress-circle-rtl';
import strings from "../languages/strings.js";
import CardView from 'react-native-cardview';
import  Loader  from '../components/GeneralComponents';

class MyOrders extends Component<Props> {

  constructor(props) {
      super(props)
      this.reset = this.reset.bind(this);
      this.state={
        fab_active: false
      }
  }
  
async componentDidMount(){
  this._unsubscribe=this.props.navigation.addListener('focus',async ()=>{
    let fab_active = await this.props.filter_type == 0 ? false : true
    await this.setState({ fab_active : fab_active })
    await this.my_orders();
  });

  this.didBlurSubscription=this.props.navigation.addListener('blur',async ()=>{
     await this.props.filterType(0);
  });
}

componentWillUnmount(){
  this._unsubscribe();
  this.didBlurSubscription();
}

myorders_details = (data) => {
  this.props.navigation.navigate('OrderDetails',{ data : data });
}

my_orders = async () => {
  this.props.serviceActionPending();
  //alert(global.lang);
  await axios({
    method: 'post', 
    url: api_url + my_orders, 
    data: { customer_id : global.id, filter_type : this.props.filter_type, lang:global.lang }
  })
  .then(async response => {
     console.log(response.data);
      await this.props.serviceActionSuccess(response.data)
  })
  .catch(error => {
      this.props.serviceActionError(error);
  });
}

reset = async () =>{
  await this.setState({ fab_active : false });
  await this.props.filterType(0);
  await this.my_orders();
}


  render() {
    Moment.locale('en');
    const { isLoding, error, data, message, status } = this.props

    return (
      <SafeAreaView>
      	{data.length > 0 ?
          <ScrollView>
            {data.map((row, index) => (
            <View style={{ paddingTop:15, marginLeft:10, marginRight:10 }}>
              <CardView
                cardElevation={5}
                style={{ padding:10, backgroundColor:colors.theme_fg_three, borderColor:colors.theme_fg_three  }}
                cardMaxElevation={5}
                cornerRadius={10}>
                <TouchableOpacity onPress={() => this.myorders_details(row)} style={{ flexDirection:'row'}} >
                  <View style={{ width:'25%' }}>
                    <View style={{ height:60, width:60 }} >
                      <Image
                        style= {{flex:1 , width: undefined, height: undefined}}
                        source={{ uri : img_url + row.image }}
                      />
                    </View>
                  </View>
                  <View style={{ }}/>
                   <View style={{ width:'50%' }} >
                    <View style={{ alignItems:'flex-start'}}>
                      <Text style={styles.order_id}>{strings.order_id}: {row.order_id}</Text>
                      <View style={{ margin:3}} />
                      <Text style={{ fontSize:14, fontFamily:normal,color:colors.theme_description}} >{Moment(row.created_at).format('DD MMM-YYYY hh:mm')}</Text>
                       <View style={{ margin:3}} />
                      <Text style={{ color:colors.theme_fg,fontFamily:bold, fontSize:16 }}>{row.label_name}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems:'flex-end', justifyContent:'center', width:'25%'}}>
                    <Text style={{ fontSize:14, fontFamily:bold, color:colors.theme_fg_two }} >{global.currency} {row.total}</Text>
                  </View>
                </TouchableOpacity>
              </CardView>
            </View>
            ))}
            <View style={{ margin:50 }}/>
          </ScrollView>
          :
          <View style={{ alignItems:'center', justifyContent:'center', height:'100%', width:'100%' }} >
              <Text style={styles.nodata}>{strings.you_have_no_orders}</Text>
          </View>
        }
        <Loader visible={isLoding} />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.myorders.isLoding,
    error : state.myorders.error,
    data : state.myorders.data,
    filter_type : state.myorders.filter_type,
    message : state.myorders.message,
    status : state.myorders.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
    filterType: (data) => dispatch(filterType(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(MyOrders);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
  },
  icon:{
    color:colors.theme_fg_two
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
    color:colors.theme_fg_two,
    fontFamily:normal,
    fontSize:14
  },
  total:{
    fontSize:15, 
    fontFamily:bold, 
    color:colors.theme_fg
  },
  nodata:
  {
    color:colors.theme_description,
    fontFamily:bold,
    fontSize:15
  }
});

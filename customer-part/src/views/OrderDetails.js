import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity  } from 'react-native';
import * as colors from '../assets/css/Colors';
import { Divider } from 'react-native-elements';
import Moment from 'moment';
import { get_labels, api_url, bold, normal, img_url } from '../config/Constants';
import strings from "../languages/strings.js";
import axios from 'axios';
import StepIndicator from 'react-native-step-indicator';

const labels = ["Order Placed","Assigned","On the way to pickup","Processing","Ready to dispatch","On the way to deliver","Completed"];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:35,
  currentStepStrokeWidth: 3,
  currentStepIndicatorLabelFontSize: 13,
  currentStepLabelColor: colors.theme_fg,
  stepIndicatorCurrentColor: colors.theme_fg_three,
  stepStrokeCurrentColor: colors.theme_fg,
  separatorStrokeWidth: 2,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: colors.theme_fg,
  stepStrokeUnFinishedColor: colors.grey,
  separatorFinishedColor: colors.theme_fg,
  separatorUnFinishedColor: colors.grey,
  stepIndicatorFinishedColor: colors.theme_fg_three,
  stepIndicatorUnFinishedColor: colors.grey,
  stepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: colors.grey,
  stepIndicatorLabelFinishedColor: colors.theme_bg,
  stepIndicatorLabelUnFinishedColor: colors.theme_bg_three,
  labelColor: colors.grey,
  backgroundColor:colors.theme_bg,
  labelSize: 16,
  labelAlign:'flex-start'
}

export default class OrderDetails extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        data : this.props.route.params.data,
        currentPosition: this.props.route.params.data.status - 1,
        labels: [],
        active_state:1
      }
      console.log(JSON.stringify(this.state.data));
      this.get_labels();
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  get_labels = async () => {
    await axios({
      method: 'get', 
      url: api_url + get_labels,
    })
    .then(async response => {
        if(global.lang == 'en'){
          this.setState({ labels: response.data.result.labels_en ,isLoding: false});
        }else{
          this.setState({ labels: response.data.result.labels_ar ,isLoding: false});
        }
        
    })
    .catch(error => {
        this.setState({ isLoding: false});
        alert('Something went wrong, please check your internet connection');
    });
  }

  change_active_state = (id) =>{
    this.setState({ active_state:id })
  }

  render() {
    return (
      <SafeAreaView>
        <View style={{ flexDirection:'row', padding:10, width:'100%'}}>
          <TouchableOpacity onPress={this.change_active_state.bind(this,1)} style={[this.state.active_state == 1 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
            <Text style={[this.state.active_state == 1 ? styles.segment_active_fg : styles.segment_inactive_fg]}>Order Details</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.change_active_state.bind(this,2)} style={[this.state.active_state == 2 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
            <Text style={[this.state.active_state == 2 ? styles.segment_active_fg : styles.segment_inactive_fg]}>Track Order</Text>
          </TouchableOpacity>
        </View>
        <ScrollView >
          {this.state.active_state == 1 &&
            <View style={{ padding:10 }} >
            <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center' }} >
                 <View style={{ alignItems:'flex-start', justifyContent:'center', width:'40%' }} >
                   <View style={{ height:90, width:90 }} >
                       <Image
                         style= {{flex:1 , width: undefined, height: undefined}}
                         source={{ uri : img_url + this.state.data.image }}
                       />
                     </View>
                 </View>
                 <View style={{ alignItems:'flex-start', justifyContent:'center', width:'60%' }}>
                   <Text style={styles.order_id}>{strings.order_id} - {this.state.data.order_id}</Text>
                   <View style={{ margin:3 }} />
                   <Text style={styles.created_at}>{Moment(this.state.data.created_at).format('DD MMM-YYYY hh:mm')}</Text>
                   <Text style={styles.status}>{this.state.data.label_name}</Text>
                 </View>
               </View>
               <View style={{ margin:5 }} />
               <Divider style={styles.order_divider} />
               <View style={{ margin:5 }} />
               <View style={styles.row}>
                 <View>
                   <Text style={styles.address_label}>{strings.door_number} / {strings.landmark}</Text>
                   <Text style={styles.address}>{this.state.data.door_no}</Text>
                 </View>
               </View>
               <View style={{ margin:5 }} />
               <Divider style={styles.order_divider} />
               <View style={{ margin:5 }} />
               <View style={styles.row}>
                 <View style={{ alignItems:'flex-start', justifyContent:'center'}}>
                   <Text style={styles.address_label}>{strings.pickup_date}</Text>
                   <Text style={styles.address}>{Moment(this.state.data.pickup_date).format('DD MMM-YYYY')}</Text>
                 </View>
               </View>
               <View style={styles.row}>
                 <View style={{ alignItems:'flex-start', justifyContent:'center'}}>
                   <Text style={styles.address_label}>{strings.pickup_time}</Text>
                   <Text style={styles.address}>{this.state.data.pickup_time}</Text>
                  </View>
               </View>
               <View style={{ margin:5 }} />
               <Divider style={styles.order_divider} />
               <View style={{ margin:5 }} />
               <View style={styles.row}>
                 <View style={{ alignItems:'flex-start', justifyContent:'center'}}>
                   <Text style={styles.address_label}>{strings.delivery_date}</Text>
                   <Text style={styles.address}>{Moment(this.state.data.delivery_date).format('DD MMM-YYYY')}</Text>
                 </View>
               </View>
               <View style={styles.row}>
                 <View style={{ alignItems:'flex-start', justifyContent:'center'}}>
                   <Text style={styles.address_label}>{strings.delivery_time}</Text>
                   <Text style={styles.address}>{this.state.data.delivery_time}</Text>
                  </View>
               </View>
               <View style={{ margin:5 }} />
               <Divider style={styles.order_divider} />
               <View style={{ margin:5 }} />
               <View style={styles.row}>
                 <View>
                   <Text style={styles.address_label}>{strings.delivery_address}</Text>
                   <Text style={styles.address}>{this.state.data.address}</Text>
                 </View>
               </View>
               <View style={{ margin:5 }} />
               <Divider style={styles.order_divider} />
               <View style={{ margin:5 }} />
               <View style={styles.row}>
                 <View>
                   <Text style={styles.delivery_date_label}>{strings.payment_mode}</Text>
                   <Text style={styles.delivery_date}>{this.state.data.payment_mode}</Text>
                 </View>
               </View>
               <View style={{ margin:5 }} />
               <Divider style={styles.order_divider} />
               <View style={{ margin:5 }} />
               <Text style={styles.your_cloths}>{strings.your_clothes}</Text>  
               <View style={{ margin:5 }} />     
                 {this.state.data.items.map((row, index) => (
                   <View>
                     <View style={{ flexDirection:'row', width:'100%' }}>
                       <View style={{ width:'60%', alignItems:'flex-start', flexDirection:'row', marginTop:5 }} >
                         <Text style={{ fontFamily:normal,color:colors.theme_description, fontSize:14 }} >{row.qty}  x</Text>
                         <View style={{ margin:5 }} />  
                         <Text style={{ fontFamily:normal,color:colors.theme_description, fontSize:14 }} >{row.product_name}( {row.service_name} )</Text>
                       </View>
                       <View style={{ width:'40%', alignItems:'flex-end', marginTop:5 }} >
                         <Text style={{ fontFamily:normal,color:colors.theme_description, fontSize:14 }} >{global.currency}{row.price}</Text>
                       </View>
                     </View>
                   </View>
                 ))}  
                 <View style={{ margin:5 }} />  
                 <View style={{ flexDirection:'row', width:'100%' }}>
                   <View style={{ width:'60%', alignItems:'flex-start', flexDirection:'row' }} >
                     <Text style={{ fontFamily:normal,color:colors.theme_description, fontSize:14 }}>{strings.subtotal}</Text>
                   </View>
                   <View style={{ width:'40%', alignItems:'flex-end' }} >
                     <Text style={{ fontFamily:normal,color:colors.theme_description, fontSize:14 }} >{global.currency}{this.state.data.sub_total}</Text>
                   </View>
                 </View>    
                 <View style={{ margin:5 }} />    
                 <View style={{ flexDirection:'row', width:'100%' }}>
                   <View style={{ width:'60%', alignItems:'flex-start', flexDirection:'row' }} >
                     <Text style={styles.dis_count} >{strings.discount}</Text>
                   </View>
                   <View style={{ width:'40%', alignItems:'flex-end' }} >
                     <Text style={{ fontFamily:normal,color:colors.theme_description}} >{global.currency}{this.state.data.discount}</Text>
                   </View>
                 </View>  
                 <View style={{ margin:5 }} />     
                 <View style={{ flexDirection:'row', width:'100%' }}>
                   <View style={{ width:'60%', alignItems:'flex-start', flexDirection:'row' }} >
                     <Text style={styles.dis_count} >{strings.delivery_cost}</Text>
                   </View>
                   <View style={{ width:'40%', alignItems:'flex-end' }} >
                     <Text style={{ fontFamily:bold,color:colors.theme_description}} >{global.currency}{this.state.data.delivery_cost}</Text>
                   </View>
                 </View>        
               <View style={{ margin:10 }} />
               <Divider style={styles.order_divider} />
               <View style={{ margin:10 }} />  
               <View style={{ flexDirection:'row', width:'100%'}}>
                 <View style={{ width:'60%', alignItems:'flex-start', flexDirection:'row' }} >
                   <Text style={styles.total_label}>{strings.total}</Text>
                 </View>
                 <View style={{ width:'40%', alignItems:'flex-end' }} >
                   <Text style={styles.total} >{global.currency}{this.state.data.total}</Text>
                 </View>
               </View>
               <View style={{ margin:10 }} />
               <Divider style={styles.order_divider} />
               <View style={{ margin:50 }} />  
             </View>
          }
          {this.state.active_state == 2 &&
            <View style={{ height:500, padding:10}}>
              <StepIndicator
                    customStyles={customStyles}
                    currentPosition={this.state.currentPosition}
                    labels={this.state.labels}
                    stepCount={7}
                    direction="vertical"
              />
            </View>
          }
        </ScrollView >
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
    fontSize:12,
    color:colors.theme_fg,
    fontFamily:normal
  },
  status:{
    marginTop:10, 
    fontSize:13, 
    color:colors.theme_fg, 
    fontFamily:bold
  },
  order_divider:{
    backgroundColor: colors.theme_fg, 
    width:'100%', 
    alignSelf:'center',
  },
  row:{ 
    flexDirection:'row'
  },
  address_label:{
    marginTop:10, 
    fontSize:14, 
    color:colors.theme_fg, 
    fontFamily:bold
  },
  address:{
    marginTop:5, 
    fontSize:13,
    color:colors.theme_description,
    fontFamily:normal
  },
  delivery_date_label:{
    marginTop:10, 
    fontSize:13, 
    color:colors.theme_fg,
    fontFamily:bold
  },
  delivery_date:{
    marginTop:5, 
    fontSize:13,
    color:colors.theme_description,
    fontFamily:normal
  },
  your_cloths:{
    marginTop:10, 
    fontSize:13, 
    color:colors.theme_fg, 
    fontFamily:bold
  },
  qty:{
    fontSize:14, 
    color:colors.theme_fg, 
    fontFamily:bold
  },
  total_label:{
    fontFamily:bold, 
    color:colors.theme_fg
  },
  total:{
    fontFamily:bold, 
    color:colors.theme_fg
  },
  subtotal:
  {
    fontFamily:bold,
    color:colors.theme_fg
  },
  dis_count:
  {
    fontFamily:normal,
    color:colors.theme_description
  },
  delivery:
  {
    fontFamily:normal,
    color:colors.theme_description
  },
  segment_active_bg:{ width:'50%', alignItems:'center', justifyContent:'center', backgroundColor:colors.theme_bg, padding:10, borderRadius:30},
  segment_inactive_bg:{ width:'50%', alignItems:'center', justifyContent:'center', padding:10},
  segment_active_fg:{ fontFamily:bold, color:colors.theme_fg_three, fontSize:16 },
  segment_inactive_fg:{ fontFamily:bold, color:colors.grey, fontSize:16 }
});

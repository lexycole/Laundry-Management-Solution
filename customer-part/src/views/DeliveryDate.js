import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { api_url, get_time, height_20, bold, normal, check_order_count } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import  Loader  from '../components/GeneralComponents';
import axios from 'axios';
import { connect } from 'react-redux'; 
import { selectPickupDate, selectPickupTime,selectDeliveryDate, selectDeliveryTime } from '../actions/CartActions';
import strings from "../languages/strings.js";

let tommorrow_date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
let tommorrow_active_date = tommorrow_date.getDate()+"-"+(tommorrow_date.getMonth()+1)+"-"+tommorrow_date.getFullYear();

class DeliveryDate extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      
      this.state = {
        data : [],
        delivery_times : [],
        deliveryDate:tommorrow_active_date,
        activeDeliveryTime:'',
        isLoding:false,
        active_date:this.props.route.params.active_date,
        active_time:this.props.route.params.active_time,
      }
      this.changeDeliveryDate(tommorrow_active_date);
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  GetDeliveryTime = async (date) => {
    this.setState({ isLoding: true});
    await axios({
      method: 'post', 
      url: api_url + get_time,
      data:{ date: date }
    })
    .then(async response => {
        this.setState({ isLoding: false});
        if(response.data.result.length > 0){
          //alert('Please select valid Delivery Date and Time');
          await this.setState({ delivery_times : response.data.result, activeDeliveryTime:response.data.result[0] });
          await this.changeDeliveryTime(this.state.activeDeliveryTime);
        }else{
          await this.setState({ delivery_times : [] });
          //alert('Sorry no time slot available this date');
        }
    })
    .catch(error => {
        this.setState({ isLoding: false});
        alert(strings.sorry_something_went_wrong);
        //alert(JSON.stringify(error));
    });
  }

  changeDeliveryTime(time){
    this.setState({ activeDeliveryTime:time });
  }

  changeDeliveryDate(date){
    this.setState({ deliveryDate:date, activeDeliveryTime:''});
    this.GetDeliveryTime(date);
  }

  check_order_count = async () => {
    console.log({ pickup_date: this.state.active_date, pickup_time : this.state.active_time, delivery_date : this.state.deliveryDate, delivery_time : this.state.activeDeliveryTime })
    this.setState({ isLoding: true});
    await axios({
      method: 'post', 
      url: api_url + check_order_count,
      data:{ pickup_date: this.state.active_date, pickup_time : this.state.active_time, delivery_date : this.state.deliveryDate, delivery_time : this.state.activeDeliveryTime }
    })
    .then(async response => {
        this.setState({ isLoding: false});
        if(response.data.status == 0){
          alert('Please select your delivery time from'+' '+this.state.active_time);
        }else{
          await this.props.selectPickupDate(this.state.active_date);
          await this.props.selectPickupTime(this.state.active_time);
          await this.props.selectDeliveryDate(this.state.deliveryDate);
          await this.props.selectDeliveryTime(this.state.activeDeliveryTime);
          console.log(this.state.active_date+'+')
          this.props.navigation.navigate('AddressList',{ from:'cart' });
        }
    })
    .catch(error => {
        this.setState({ isLoding: false});
        alert('Something went wrong, please check your internet connection');
    });
  }

  select_address = async() => {
    if(this.state.deliveryDate == '' || this.state.activeDeliveryTime == ''){
      alert(strings.please_select_valid_date);
      return false;
    }
    console.log(this.state.active_date +'--'+ this.state.deliveryDate)
    if(this.state.active_date >= this.state.deliveryDate ){
        //alert('Please select another delivery date');
         alert(strings.please_select_another_delivery_date);
        //this.showSnackbar(strings.please_select_another_delivery_date);
    }
    else{
    this.check_order_count();
    }
  }

  render() {
    let times = undefined;
    if(this.state.data.length != 0 ){
      times = this.state.data.map((item,key) => {
        return(
          <View style={{ width:'50%', alignItems:'center', padding:5 }}>
            <TouchableOpacity  activeOpacity={1} onPress={() => { this.changeTime(item); }} style={this.state.activeTime == item ? styles.active_time_bg : styles.inactive_time_bg} >
              <Text style={this.state.activeTime == item ? styles.active_time_fg : styles.inactive_time_fg}>{item}</Text>
            </TouchableOpacity>
          </View>
        )          

      });
    }else{
      times = <Text style={{ marginTop:height_20, paddingLeft:30,color:colors.theme_fg, fontSize:14, fontFamily:bold }}>{strings.Sorry_no_time_slots_available_in_this_date}</Text>;
    }

    let delivery_times = this.state.delivery_times.map((item,key) => {
      return(
        <View style={{ width:'50%', alignItems:'center', padding:5 }}>
            <TouchableOpacity activeOpacity={1} onPress={() => { this.changeDeliveryTime(item); }} style={this.state.activeDeliveryTime == item ? styles.active_time_bg : styles.inactive_time_bg} >
              <Text style={this.state.activeDeliveryTime == item ? styles.active_time_fg : styles.inactive_time_fg}>{item}</Text>
            </TouchableOpacity>
        </View>
      )
    });

    var delivery_date = [];

    for(let i = 1; i < 6; i++){
      
      let today = new Date(new Date().getTime() + ( i * 24) * 60 * 60 * 1000);
      let date = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();
      delivery_date.push(
        <View style={{ marginLeft:5 }}>
        <TouchableOpacity activeOpacity={1} onPress={() => { this.changeDeliveryDate(date); }} key={i} style={this.state.deliveryDate == date ? styles.active_date_bg : styles.inactive_date_bg} >
          <Text style={this.state.deliveryDate == date ? styles.active_date_fg : styles.inactive_date_fg} >{date}</Text>
        </TouchableOpacity>
        </View>
      )
    }

    return (
      <SafeAreaView style={{ width:'100%', height:'100%', padding:10}}>
        <Loader visible={this.state.isLoding} />
        <ScrollView showsVerticalScrollIndicator={false}>
            <ScrollView style={{ padding:20 }}>
              <View>
                <View>
                  <Text style={{ fontSize:16, color:colors.theme_fg, fontFamily:bold }}>{strings.delivery_date}</Text>
                </View>
                <View style={{ margin:10 }} />
                <View>
                  <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false} >
                    { delivery_date }
                  </ScrollView>
                </View>
                <View style={{ margin:10 }} />
                <View>
                  <Text style={{ fontSize:16, color:colors.theme_fg, fontFamily:bold }}>{strings.delivery_time}</Text>
                </View>
                <View style={{ margin:10  }} />
                <View style={styles.container}>
                  {delivery_times}
                </View>
              </View>
            </ScrollView>
          <View style={{ borderColor:colors.theme_bg, borderWidth:1, margin:30, borderRadius:5, padding:10}}>
            <Text style={{ textAlign:'center', fontSize:16, color:colors.theme_bg}}>{strings.delivery_of_order_will_be_only_after_24Hrs_of_pickup}</Text>
          </View>
        </ScrollView>
        <View style={{ marginTop:10 }}/>
        <TouchableOpacity activeOpacity={1} style={styles.footer}>
          <TouchableOpacity  activeOpacity={1} onPress={this.select_address} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>{strings.next}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </SafeAreaView>

    );
  }
}

function mapStateToProps(state){
  return{
    pickup_date : state.cart.pickup_date,
    pickup_time : state.cart.pickup_time,
    delivery_date : state.cart.delivery_date,
    delivery_time : state.cart.delivery_time,
  };
}

const mapDispatchToProps = (dispatch) => ({
    selectPickupDate: (data) => dispatch(selectPickupDate(data)),
    selectPickupTime: (data) => dispatch(selectPickupTime(data)),
    selectDeliveryDate: (data) => dispatch(selectDeliveryDate(data)),
    selectDeliveryTime: (data) => dispatch(selectDeliveryTime(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(DeliveryDate);

const styles = StyleSheet.create({
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
  inactive_date_bg:{ 
    width:130, 
    height:40,
    alignItems:'center', 
    justifyContent:'center',      
    borderRadius:5, 
    borderWidth:1, 
    borderColor:colors.theme_fg, 
    padding:5
     
  },
  active_date_bg:{ 
    width:130, 
    height:40,
    alignItems:'center', 
    justifyContent:'center',     
    borderRadius:5, 
    borderWidth:1, 
    backgroundColor:colors.theme_bg,
    borderColor:colors.theme_fg, 
    padding:5
     
  },
  inactive_date_fg:{ 
    fontSize:12, 
    color:colors.theme_fg ,
    fontFamily:normal
  },
  active_date_fg:{ 
    fontSize:12, 
    color:colors.theme_fg_three ,
    fontFamily:normal
  },
  inactive_time_bg:{ 
    width:130, 
    height:40,
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius:5, 
    borderWidth:1, 
    borderColor:colors.theme_fg, 
    padding:5
    
  },
  active_time_bg:{ 
    width:130, 
    height:40,
    alignItems:'center', 
    justifyContent:'center',   
    borderRadius:5, 
    borderWidth:1, 
    backgroundColor:colors.theme_bg,
    borderColor:colors.theme_fg, 
    padding:5
  },
  inactive_time_fg:{ 
    fontSize:12, 
    color:colors.theme_fg ,
    fontFamily:normal
  },
  active_time_fg:{ 
    fontSize:12, 
    color:colors.theme_fg_three ,
    fontFamily:normal
  },
  footer:{
    backgroundColor:'transparent',
    position:'absolute',
    bottom:10,
    width:'90%',
    marginLeft:'5%',
    marginRight:'5%'
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
  footer_content:{
    width:'100%'
  },
  select_address:{
    backgroundColor:colors.theme_button,
    fontFamily:bold
  },
  container: {
    backgroundColor:colors.theme_bg_three,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' ,
    padding:10,
    borderRadius:10,
  },

});

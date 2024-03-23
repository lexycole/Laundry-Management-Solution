import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { api_url, get_time, height_20, bold, normal } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import  Loader  from '../components/GeneralComponents';
import axios from 'axios';
import { connect } from 'react-redux'; 
import { selectPickupDate, selectPickupTime,selectDeliveryDate, selectDeliveryTime } from '../actions/CartActions';
import strings from "../languages/strings.js";

let today_date = new Date();
let active_date = today_date.getDate()+"-"+(today_date.getMonth()+1)+"-"+today_date.getFullYear();

class PickupDate extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.changeDate = this.changeDate.bind(this);
      
      this.state = {
        data : [],
        activeDate:active_date,
        activeTime:'',
        isLoding:false,
      }
      this.changeDate(active_date);
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  GetTime = async (date) => {
    console.log({ date: date })
    this.setState({ isLoding: true});
    await axios({
      method: 'post', 
      url: api_url + get_time,
      data:{ date: date }
    })
    .then(async response => {
        this.setState({ isLoding: false});
        console.log(response.data.result)
        if(response.data.result.length > 0){
          await this.setState({ data : response.data.result, activeTime:response.data.result[0] });
          await this.changeTime(this.state.activeTime);
        }else{
          await this.setState({ data : [] });
        }
    })
    .catch(error => {
        this.setState({ isLoding: false});
        alert(strings.sorry_something_went_wrong);
    });
  }

  changeTime(time){
    this.setState({ activeTime:time });
  }
 
  changeDate(date){
    this.setState({ activeDate:date, activeTime:''});
    this.GetTime(date);
  }

  select_pickupdate = async() => {
    if(this.state.activeDate == '' || this.state.activeTime == '')
    {
      alert(strings.please_select_valid_date);
      return false;
    }else{
      this.navigate_delivery_date();
    }
  }

  navigate_delivery_date = async () =>{
    this.props.navigation.navigate('DeliveryDate', {active_date:this.state.activeDate, active_time:this.state.activeTime});
  }

  render() {
    let times = undefined;
    if(this.state.data.length != 0 ){
      times = this.state.data.map((item,key) => {
        return(
          <View style={{ width:'50%', alignItems:'center', padding:5 }}>
            <TouchableOpacity activeOpacity={1} onPress={() => { this.changeTime(item); }} style={this.state.activeTime == item ? styles.active_time_bg : styles.inactive_time_bg} >
              <Text style={this.state.activeTime == item ? styles.active_time_fg : styles.inactive_time_fg}>{item}</Text>
            </TouchableOpacity>
          </View>
        )          

      });
    }else{
      times = <Text style={{ marginTop:height_20, paddingLeft:30,color:colors.theme_fg, fontSize:14, fontFamily:bold, alignSelf:'center' }}>{strings.Sorry_no_time_slots_available_in_this_date}</Text>;
    }

    var pickup_date = [];

    for(let i = 0; i < 5; i++){
      
      let today = new Date(new Date().getTime() + ( i * 24) * 60 * 60 * 1000);
      let date = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();
      pickup_date.push(
        <View style={{ marginLeft:5 }}>
        <TouchableOpacity activeOpacity={1}  onPress={() => { this.changeDate(date); }} key={i} style={this.state.activeDate == date ? styles.active_date_bg : styles.inactive_date_bg} >
          <Text style={this.state.activeDate == date ? styles.active_date_fg : styles.inactive_date_fg} >{date}</Text>
        </TouchableOpacity>
        </View>
      )
    }

    return (
      <SafeAreaView style={{ width:'100%', height:'100%', padding:10}}>
        <Loader visible={this.state.isLoding} />
        <ScrollView style={{ padding:20 }} showsVerticalScrollIndicator={false}>
          <View >
            <View >
              <Text style={{ fontSize:16, color:colors.theme_fg, fontFamily:bold }}>{strings.pickup_date}</Text>
            </View>
            <View style={{ margin:10 }} />
            <View>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}  >
                { pickup_date }
              </ScrollView>
            </View>
          <View/>
          <View style={{ margin:10 }} />
          <View >
            <Text style={{ fontSize:16, color:colors.theme_fg, fontFamily:bold }}>{strings.pickup_time}</Text>
          </View>
          <View style={{ margin:10 }} />  
          <View style={styles.container}>
            {times}
          </View>
          </View>
        </ScrollView>
        <TouchableOpacity activeOpacity={1} style={styles.footer}>
          <TouchableOpacity  activeOpacity={1} onPress={this.select_pickupdate} style={styles.button}>
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


export default connect(mapStateToProps,mapDispatchToProps)(PickupDate);

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

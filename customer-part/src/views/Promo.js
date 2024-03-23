import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { api_url, promo_code, bold, normal } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import  Loader  from '../components/GeneralComponents';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess, addPromo } from '../actions/PromoActions';
import { promo } from '../actions/CartActions';
import strings from "../languages/strings.js";

class Promo extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.Promo();
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  Promo = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post', 
      url: api_url + promo_code,
      data:{ lang: global.lang }
    })
    .then(async response => {
        await this.props.serviceActionSuccess(response.data)
    })
    .catch(error => {
        this.props.serviceActionError(error);
    });
  }

  apply = async (data) => {
    if(this.props.s_total != 0){
      if(data.promo_type == 1){
        if(data.discount < this.props.s_total){
          await this.props.promo(data);
          await this.props.navigation.navigate('Check');
        }else{
          alert('Sorry this promo not valid');
        }
      }
    }else{
      alert('Sorry this promo not valid');
    }
    
  }

  render() {

    const { isLoding, error, data, message, status } = this.props

    return (
      <SafeAreaView>
        <ScrollView>
        <View style={styles.container} >
          {data.map((row, index) => (
            <View style={styles.promo_block} >
              <View style={{ flexDirection:'row', width:'100%' }} >
                <View style={{ alignItems:'flex-start', justifyContent:'center', width:'60%' }}>
                  <Text style={styles.promo_code} >{row.promo_code}</Text>
                </View>
                <View style={{ alignItems:'flex-end', justifyContent:'center', width:'40%' }}>
                  <Text onPress={() => this.apply(row)} style={styles.apply} >{strings.apply}</Text>
                </View>
              </View>
              <View style={{ flexDirection:'row' }} >
                <View>
                  <Text style={styles.promo_name} >{row.promo_name}</Text>
                </View>
              </View>
              <View style={{ flexDirection:'row' }} >
                <View>
                  <Text style={styles.description} >
                    {row.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}         
        </View>
        </ScrollView>
        <Loader visible={isLoding} />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.promo.isLoding,
    error : state.promo.error,
    data : state.promo.data,
    message : state.promo.message,
    status : state.promo.status,
    s_total : state.cart.s_total,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
    addPromo: (data) => dispatch(addPromo(data)),
    promo: (data) => dispatch(promo(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(Promo);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  header:{
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
  promo_block:{
    width:'100%', 
    padding:20, 
    marginTop:10,
    backgroundColor:colors.theme_fg_three
  },
  promo_code:{
    borderWidth:1, 
    borderColor:colors.promo_color, 
    color:colors.promo_color, 
    paddingTop:5, 
    paddingRight:10, 
    paddingBottom:5, 
    paddingLeft:10,
    fontFamily:normal
  },
  apply:{
    fontSize:14, 
    fontFamily:bold, 
    color:colors.theme_fg
  },
  promo_name:{
    fontSize:15, 
    fontFamily:bold, 
    color:colors.theme_fg, 
    marginTop:10
  },
  description:{
    fontSize:12,
    marginTop:5,
    fontFamily:normal,
    color:colors.theme_description 
  }
});


import React, {Component} from 'react';
import { StyleSheet, Text, FlatList, SafeAreaView, ScrollView, TouchableOpacity, View  } from 'react-native';
import { api_url, faq, bold, normal } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { connect } from 'react-redux'; 
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/FaqActions';
import { CommonActions } from '@react-navigation/native';
import strings from "../languages/strings.js";
import Icon, { Icons } from '../components/Icons';
import  Loader  from '../components/GeneralComponents';

class Faq extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.Faq();
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  faq_details = (data) => {
    this.props.navigation.navigate('FaqDetails',{ data : data }); 
  }

  Faq = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post', 
      url: api_url + faq,
      data:{ lang: global.lang }
    })
    .then(async response => {
        await this.props.serviceActionSuccess(response.data)
    })
    .catch(error => {
        this.props.serviceActionError(error);
    });
  }


  render() {

    const { isLoding, error, data, message, status } = this.props

    return (
      <SafeAreaView>
        <ScrollView style={{ margin:15 }}>
            <FlatList
              data={data}
              renderItem={({ item,index }) => (
                <TouchableOpacity style={{ flexDirection:'row', paddingBottom:15, paddingTop:15, borderBottomWidth:0.5, borderColor:colors.theme_fg_four}} onPress={() => this.faq_details(item)} >
                  <View style={{ width:'80%', alignItems:'flex-start'}}>
                    <Text style={styles.faq_title} >{item.question}</Text>
                  </View>
                  <View style={{ width:'20%', alignItems:'flex-end'}}>
                    <Icon type={Icons.Ionicons} style={{ color:colors.theme_fg_four}} name="ios-arrow-forward" />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.question}
            />
        </ScrollView>
        <Loader visible={isLoding} />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.faq.isLoding,
    error : state.faq.error,
    data : state.faq.data,
    message : state.faq.message,
    status : state.faq.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(Faq);

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
  faq_title:{
    color:colors.theme_fg_two,
    fontSize:15,
    fontFamily:normal
  }
});

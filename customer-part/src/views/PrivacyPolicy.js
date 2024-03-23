import React, {Component} from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView  } from 'react-native';
import * as colors from '../assets/css/Colors';
import  Loader  from '../components/GeneralComponents';
import { api_url, privacy, bold, normal } from '../config/Constants';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/PrivacyActions';
import strings from "../languages/strings.js";

class PrivacyPolicy extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.privacy_policy();
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  privacy_policy = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post', 
      url: api_url + privacy,
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
        <ScrollView style={{ margin:10 }} >
          {data.map((row, index) => (
            <View>
              <View style={{ flexDirection:'row'}}>
                <Text style={styles.policy_title}>{row.title}</Text>
              </View>
              <View style={{ flexDirection:'row'}}>
                <Text style={styles.description}>{row.description}</Text>
              </View>
              <View style={{ margin:10 }} />
            </View>
          ))}
        </ScrollView>
        <Loader visible={isLoding} />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.privacy.isLoding,
    error : state.privacy.error,
    data : state.privacy.data,
    message : state.privacy.message,
    status : state.privacy.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(PrivacyPolicy);

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
  policy_title:{
    fontSize:16, 
    fontFamily:bold, 
    color:colors.theme_fg
  },
  description:{
    fontSize:13, 
    marginTop:5,
    color:colors.theme_description,
    fontFamily:normal
  }
});

import React, {Component} from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View, Image, FlatList } from 'react-native';
import {bold, normal, get_notification_list, api_url} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import strings from "../languages/strings.js";
import axios from 'axios';
import Moment from 'moment';

export default class Notification extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        data:[]
      }
      this.get_notifications();
  }

  get_notifications = async () => {
    await axios({
      method: 'post', 
      url: api_url + get_notification_list,
      data:{ lang: global.lang, customer_id:global.id }
    })
    .then(async response => {
        this.setState({ data : response.data.result });
    })
    .catch(error => {
        
    });
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  render() {
    return (
      <SafeAreaView>
        <FlatList
            data={this.state.data}
            renderItem={({ item,index }) => (
                <View style={{ flexDirection:'row', margin:10}}>
                    <View style={{ width:'20%', alignItems:'center', justifyContent:'center'}}>
                        <View style={{ width:40, height:40 }}>
                            {item.notification_type == 1 ?
                                <Image
                                    style= {{flex:1 , width: undefined, height: undefined}}
                                    source={require('.././assets/img/clothing.png')}
                                />
                            :
                                <Image
                                    style= {{flex:1 , width: undefined, height: undefined}}
                                    source={require('.././assets/img/loudspeaker.png')}
                                />
                            }
                        </View>
                    </View>
                    <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
                        <Text style={{ fontFamily:normal, fontSize:16, color:colors.theme_fg_two}}>{item.message}</Text>
                        <View style={{ margin:2 }} />
                        <Text style={{ fontFamily:normal, fontSize:13, color:colors.grey}}>{Moment(item.created_at).format('DD MMM-YYYY hh:mm')}</Text>
                    </View>
                </View>
            )}
            keyExtractor={item => item.question}
        />
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
    fontFamily:normal
  },
  data_answer:
  {
    fontFamily:normal,
    color:colors.theme_fg_two
  }
});

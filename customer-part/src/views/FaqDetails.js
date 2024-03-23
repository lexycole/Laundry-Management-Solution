import React, {Component} from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View  } from 'react-native';
import {bold, normal} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import strings from "../languages/strings.js";
import CardView from 'react-native-cardview';

export default class FaqDetails extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        data:this.props.route.params.data
      }
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView style={{ margin:10 }}>
            <CardView
              cardElevation={5}
              cardMaxElevation={5}
              style={{ padding:10, margin:10}}
              cornerRadius={10}>
                <View style={{ alignItems:'center', justifyContent:'center' }}>
                  <Text style={styles.data_answer}>{this.state.data.answer}</Text>
                </View>
            </CardView>
          </ScrollView>
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

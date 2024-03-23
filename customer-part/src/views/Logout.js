import React, {Component} from 'react';
import { StyleSheet, View, Image, Alert  } from 'react-native';
import { loading } from '../config/Constants';
import { CommonActions } from '@react-navigation/native';
import strings from "../languages/strings.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Logout extends Component<Props> {

  constructor(props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.open_success_popup();
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack();
  }

  static navigationOptions = {
    header:null
  }

  async componentDidMount(){
    this._unsubscribe=this.props.navigation.addListener('focus',()=>{
      this.open_success_popup();
    });
  }
  componentWillUnmount(){
    this._unsubscribe();
  }

  open_success_popup = async() =>{
    Alert.alert(
      'Exit',
      'Do you want to exit the app',
      [
        { text: 'Yes', onPress: () => this.resetMenu() },
        { text: 'No', onPress: () => this.handleBackButtonClick() }
      ],
      { cancelable: false }
    );
  }


  resetMenu() {
    AsyncStorage.clear();
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "CheckPhone" }],
      })
    );
  }

  render () {
    return (
      <View style={styles.container} >
        <View style={{ height:43, width:122 }} >
          <Image
            style= {{flex:1 , width: undefined, height: undefined}}
            source={loading}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:"center"
  }
});

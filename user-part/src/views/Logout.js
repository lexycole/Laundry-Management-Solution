import React, {Component} from 'react';
import { StyleSheet, View, Image, SafeAreaView } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loading } from '../config/Constants';
import Dialog from "react-native-dialog";
import strings from "../languages/strings.js";

export default class Logout extends Component<Props> {
  
  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        dialogVisible:false
      }
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  async componentDidMount(){
  this._unsubscribe=this.props.navigation.addListener('focus',()=>{
    this.showDialog();
  });
}
componentWillUnmount(){
  this._unsubscribe();
}

  showDialog = () => {
    this.setState({ dialogVisible: true });
  }

  closeDialog = () => {
    this.setState({ dialogVisible: false });
    this.handleBackButtonClick();
  }

  handleCancel = () => {
    this.setState({ dialogVisible: false });
    this.handleBackButtonClick();
  }
 
  handleLogout = async() => {
    await this.closeDialog();
    AsyncStorage.clear();
    this.resetMenu();
  }

  resetMenu() {
   this.props.navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{name: "CheckPhone"}],
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
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>{strings.confirm}</Dialog.Title>
            <Dialog.Description>
             {strings.do_you_want_to_logout}.
            </Dialog.Description>
            <Dialog.Button style={{color:'#0a0b0f'}} label={strings.yes} onPress={this.handleLogout} />
            <Dialog.Button style={{color:'#0a0b0f'}} label={strings.no} onPress={this.handleCancel} />
          </Dialog.Container>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#FFFFFF'
  }
});

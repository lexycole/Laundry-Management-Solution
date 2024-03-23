import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ScrollView, TouchableOpacity  } from 'react-native';
import * as colors from '../assets/css/Colors';
import { Divider } from '../components/GeneralComponents';
import { menus, bold, normal } from '../config/Constants';
import Dialog from "react-native-dialog";
import strings from "../languages/strings.js";
import Icon, { Icons } from '../components/Icons';

export default class More extends Component<Props> {

  constructor(props) {
      super(props)
      this.state = {
        dialogVisible:false,
        menus:[
          {
            menu_name: strings.manage_addresses,
            icon: 'map',
            route:'AddressList'
          },
          {
            menu_name: strings.faq,
            icon: 'help',
            route:'Faq'
          },
          /*{
            menu_name: strings.my_cards,
            icon: 'card',
            route:'MyCards'
          },*/
          {
            menu_name: strings.privacy_policy,
            icon: 'alert',
            route:'PrivacyPolicy'
          },
          {
            menu_name: strings.logout,
            icon: 'log-out',
            route:'Logout'
          },
          {
            menu_name: 'Subscription',
            icon: 'log-out',
            route:'SubscriptionList'
          },
        ]
      }
  }

  navigate = (route) => {
    if(route == 'Logout'){
      this.showDialog();
    }else if(route == 'AddressList'){
       this.props.navigation.navigate(route,{ from : 'More'});
    }else{
      this.props.navigation.navigate(route);
    }
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  }

  closeDialog = () => {
    this.setState({ dialogVisible: false });
  }

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  }
 
  handleLogout = async() => {
    await this.closeDialog();
    await this.props.navigation.navigate('Logout');
  }


  render() {
    return (
      <SafeAreaView style={styles.container} >
        <View style={styles.header} >
          <Text style={styles.profile_name} >{global.customer_name}</Text>
        </View>
        <Divider />
        <ScrollView style={styles.content} >
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>{strings.confirm}</Dialog.Title>
          <Dialog.Description>
            {strings.do_you_want_to_logout}
          </Dialog.Description>
          <Dialog.Button style={{color:colors.theme_bg}} label={strings.yes} onPress={this.handleLogout} />
          <Dialog.Button style={{color:colors.theme_bg}} label={strings.no} onPress={this.handleCancel} />
        </Dialog.Container>
        <FlatList
          data={this.state.menus}
          renderItem={({ item,index }) => (
            <TouchableOpacity style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center'}} onPress={() => this.navigate(item.route)}>
              <View style={{ alignItems:'flex-start', justifyContent:'center', width:'15%'}}>
                <View style={styles.icon_button}>
                  <Icon type={Icons.Ionicons} name={item.icon} style={{ color:colors.theme_fg_three}} />
                </View>
              </View>
              <View style={{ alignItems:'flex-start', justifyContent:'center', width:'80%', borderBottomWidth:0.5, paddingBottom:15, paddingTop:15, borderColor:colors.theme_fg_four}}>
                <Text style={styles.menu_name} >{item.menu_name}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.menu_name}
        />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    padding:20
  },
  profile_name: {
    fontSize:16, 
    color:colors.theme_fg, 
    fontFamily:normal,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  content:{
    padding:20
  },
  icon_button:{
    backgroundColor: colors.theme_bg,
    padding:5,
    borderRadius:10
  },
  menu_name:{
    fontSize:16, 
    color:colors.theme_fg_two,
    fontFamily:normal
  }
});


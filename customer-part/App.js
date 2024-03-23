import React, { useEffect, useRef } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StyleSheet, Text, View, Image } from 'react-native'
import Icon, { Icons } from './src/components/Icons';
import * as colors from './src/assets/css/Colors';
import { logo_with_name, bold } from './src/config/Constants';
import strings from "./src/languages/strings.js";
import 'react-native-gesture-handler';
import { connect } from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import CardView from 'react-native-cardview'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';


//Screens
import Product from './src/views/Product';
import Address from './src/views/Address';
import AddressList from './src/views/AddressList';
import Check from './src/views/Check';
import Cart from './src/views/Cart';
import Faq from './src/views/Faq';
import FaqDetails from './src/views/FaqDetails';
import Home from './src/views/Home';
import Logout from './src/views/Logout';
import MyOrders from './src/views/MyOrders';
import OrderDetails from './src/views/OrderDetails';
import Otp from './src/views/Otp';
import Payment from './src/views/Payment';
import PrivacyPolicy from './src/views/PrivacyPolicy';
import Profile from './src/views/Profile';
import Promo from './src/views/Promo';
import Register from './src/views/Register';
import Reset from './src/views/Reset';
import Splash from './src/views/Splash';
import PickupDate from './src/views/PickupDate';
import CheckPhone from './src/views/CheckPhone';
import CreatePassword  from './src/views/CreatePassword';
import Password  from './src/views/Password';
import Search  from './src/views/Search';
import AddCards  from './src/views/AddCards';
import MyCards  from './src/views/MyCards';
import DeliveryDate  from './src/views/DeliveryDate'; 
import ShowAddress  from './src/views/ShowAddress'; 
import PriceList  from './src/views/PriceList'; 
import FeedBack  from './src/views/FeedBack'; 
import AboutUs  from './src/views/AboutUs';
import SubscriptionList  from './src/views/SubscriptionList'; 
import SubscriptionDetails  from './src/views/SubscriptionDetails'; 
import Notification  from './src/views/Notification'; 

const forFade = ({ current, next }) => {
  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: { opacity },
  };
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  language_change = async(lang) =>{
    if(global.lang != lang){
      try {
        await AsyncStorage.setItem('lang', lang);
        strings.setLanguage(lang);
        if(lang == 'ar'){
          I18nManager.forceRTL(true);
          RNRestart.Restart();
        }else{
          I18nManager.forceRTL(false);
          RNRestart.Restart();
        }
      } catch (e) {
      }
    }
  }
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding:10, flexDirection:'column', alignItems:'flex-start' }}>
        <Image style={{ width: 50, height: 50, overflow: "hidden",alignSelf:'center', }} source={logo_with_name} />
        <View style={{ margin: 5 }} />
        <View style={{alignSelf:'center'}} >
          <Text style={{ color:colors.theme_fg, fontWeight:bold, fontSize:16 }} >Hi, {global.customer_name}</Text>
        </View>
      </View>
      {/* <View style={{ alignItems:'center', justifyContent:'center', alignSelf:'center', marginTop:20, marginBottom:20 }}>
          <CardView
            cardElevation={2}
            cardMaxElevation={5}
            style={{ width:140, height:40, borderRadius:10, justifyContent:'center', backgroundColor:colors.theme_fg_three,  }}
            cornerRadius={10}>
              <Picker
                selectedValue={global.lang}
                style={{color:colors.theme_fg, width:140 }}
                itemStyle={{ fontFamily:bold }}
                onValueChange={(itemValue, itemIndex) =>
                  this.language_change(itemValue)
                }>
                <Picker.Item label={strings.english}value="en" />
                <Picker.Item label={strings.arabic} value="ar" />
              </Picker>
          </CardView>
        </View> */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator 
      drawerContent={props => <CustomDrawerContent {...props} />} 
      initialRouteName="Home"
      drawerStyle={{ width: '80%', backgroundColor:colors.theme_fg_three }}
      drawerContentOptions={{
        activeTintColor: colors.theme_fg, 
        inactiveTintColor: colors.theme_fg_two,
        labelStyle: { fontSize: 15, fontFamily:'GoogleSans-Bold' },
      }}
    >
      <Drawer.Screen
        name={strings.home}
        component={Home}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.MaterialCommunityIcons} name='home-circle-outline' color={colors.theme_fg} size={25} />
          ), headerShown:false
        }} 
      />
      <Drawer.Screen
        name={strings.my_orders}
        component={MyOrders}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.MaterialCommunityIcons} name='clipboard-text-multiple-outline' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name={strings.subscription}
        component={SubscriptionList}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.Entypo} name='shield' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name={strings.pricelist}
        component={PriceList}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.FontAwesome} name='tag' color={colors.theme_fg} size={25} />
          ),
        }}
      /> 
      <Drawer.Screen
        name={strings.feedback}
        component={FeedBack}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.FontAwesome} name='wpforms' color={colors.theme_fg} size={25} />
          ),
        }}
      /> 
      <Drawer.Screen
        name={strings.profile}
        component={Profile}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.FontAwesome} name='user-circle-o' color={colors.theme_fg} size={25} />
          ),
        }}
      /> 
      <Drawer.Screen
        name={strings.manage_addresses}
        component={ShowAddress}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.Entypo} name='location' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name={strings.faq}
        component={Faq}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.FontAwesome} name='question-circle-o' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name={strings.privacy_policy}
        component={PrivacyPolicy}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.MaterialIcons} name='policy' color={colors.theme_fg} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name={strings.aboutus}
        component={AboutUs}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.Ionicons} name='information-circle-outline' color={colors.theme_fg} size={25} />
          ),
        }}
      /> 
      <Drawer.Screen
        name={strings.logout}
        component={Logout}
        options={{ 
          drawerIcon: ({ tintColor }) => (
              <Icon type={Icons.AntDesign} name='logout' color={colors.theme_fg} size={25} />
          ),
        }}
      />


    </Drawer.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" >
        <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={MyDrawer} options={{headerShown: false}} />
        <Stack.Screen name="Address" options={{ title:'Address'}} component={Address} />
        <Stack.Screen name="Check" options={{headerShown: false}} component={Check} />
        <Stack.Screen name="AddressList" options={{ title:'Address List'}} component={AddressList} />
        <Stack.Screen name="Cart" options={{headerShown: false}} component={Cart} />
        <Stack.Screen name="Faq" options={{ title:'Faq'}} component={Faq} />
        <Stack.Screen name="FaqDetails" options={{ title:'Faq Details'}} component={FaqDetails} />
        <Stack.Screen name="Logout" options={{ title:'Logout'}} component={Logout} />
        <Stack.Screen name="OrderDetails" options={{ title:'Order Details'}} component={OrderDetails} />
        <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}}/>
        <Stack.Screen name="Payment" options={{ title:'Payment'}} component={Payment} />
        <Stack.Screen name="PickupDate" options={{ title:'Pickup Date'}} component={PickupDate} />
        <Stack.Screen name="PrivacyPolicy" options={{ title:'Privacy Policies'}} component={PrivacyPolicy} />
        <Stack.Screen name="Product" options={{ title:'Products'}} component={Product} />
        <Stack.Screen name="Promo" options={{ title:'Promo'}} component={Promo} />
        <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
        <Stack.Screen name="Reset" options={{ title:'Reset'}} component={Reset} />
        <Stack.Screen name="CheckPhone" component={CheckPhone} options={{headerShown: false}}  />
        <Stack.Screen name="CreatePassword" component={CreatePassword} options={{headerShown: false}} />
        <Stack.Screen name="Password" component={Password} options={{headerShown: false}} />
        <Stack.Screen name="Search" component={Search} options={{headerShown: false}} />
        <Stack.Screen name="AddCards" options={{ title:'Add Cards'}} component={AddCards} />
        <Stack.Screen name="MyCards" options={{ title:'My Cards'}} component={MyCards} /> 
        <Stack.Screen name="DeliveryDate" options={{ title:'Delivery Date'}} component={DeliveryDate} />
        <Stack.Screen name="ShowAddress" options={{ title:'Addresses'}} component={ShowAddress} /> 
        <Stack.Screen name="SubscriptionDetails" options={{ title:'Subscription Details'}} component={SubscriptionDetails} /> 
        <Stack.Screen name="Notification" options={{ title:'Notifications'}} component={Notification} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    padding: 8,
    borderRadius: 16,
  }
})

export default App;
import React, { useEffect, useRef } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon, { Icons } from './src/components/Icons';
import * as colors from './src/assets/css/Colors';
import { img_url } from './src/config/Constants';
import * as Animatable from 'react-native-animatable';

//Screens
import Splash from './src/views/Splash';
import Dashboard from './src/views/Dashboard';
import Logout from './src/views/Logout';
import Profile from './src/views/Profile';
import Otp from './src/views/Otp';
import ResetPassword from './src/views/ResetPassword';
import MyOrders from './src/views/MyOrders';
import OrderDetails from './src/views/OrderDetails';
import CheckPhone from './src/views/CheckPhone';
import Password from './src/views/Password';

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
const TabArr = [
  { route: 'Dashboard', label: 'Home', type: Icons.Feather, icon: 'home', component: Dashboard, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'Orders', label: 'Orders', type: Icons.Feather, icon: 'clock', component: MyOrders, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'Profile', label: 'Profile', type: Icons.Feather, icon: 'user', component: Profile, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
  { route: 'Logout', label: 'Logout', type: Icons.Feather, icon: 'log-out', component: Logout, color: colors.theme_fg, alphaClr: colors.theme_bg_three },
];


const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);

  useEffect(() => {
    if (focused) { // 0.3: { scale: .7 }, 0.5: { scale: .3 }, 0.8: { scale: .7 },
      viewRef.current.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
      textViewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
    } else {
      viewRef.current.animate({ 0: { scale: 1, }, 1: { scale: 0, } });
      textViewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 1 : 0.65}]}>
      <View>
        <Animatable.View
          ref={viewRef}
          style={[StyleSheet.absoluteFillObject, { backgroundColor: item.color, borderRadius: 16 }]} />
        <View style={[styles.btn, { backgroundColor: focused ? null : item.alphaClr }]}>
          <Icon type={item.type} name={item.icon} color={focused ? colors.theme_fg_three : colors.grey} />
          <Animatable.View
            ref={textViewRef}>
            {focused && <Text style={{
              color: colors.theme_fg_three, paddingHorizontal: 8
            }}>{item.label}</Text>}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 16
        }
      }}
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen key={index} name={item.route} component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />
            }}
          />
        )
      })}
    </Tab.Navigator>
  )
}


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" >
        <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}} />
        <Stack.Screen name="OrderDetails" component={OrderDetails}  />
        <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown: false}} />
        <Stack.Screen name="CheckPhone" component={CheckPhone} options={{headerShown: false}} />
        <Stack.Screen name="Password" component={Password} options={{headerShown: false}} />
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
    padding: 8,
    borderRadius: 16,
  }
})

export default App;
import 'react-native-gesture-handler';
import * as React from 'react';
import {Root} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import Entypo from 'react-native-vector-icons/Fontisto';

// import Ble_test from './App.android.js'; //Text app one for Nasib
import Ble_test from './test_app'; // Callibration modal for Nasib
import Sync from './sync.js';
// import Register from './register.js';
import Splash_ios from './app/components/splash/splash.ios.js';
import Splash_android from './app/components/splash/splash.android';
import Login from './app/components/authentication/login';
import Pincode from './app/components/authentication/pincode';
import Intro_1 from './app/components/intro/Intro_1';
import Intro_2 from './app/components/intro/Intro_2';
import Intro_3 from './app/components/intro/Intro_3';
import Intro_4 from './app/components/intro/Intro_4';
import Home from './app/components/home';
import Water from './app/components/water';
import Alerts from './app/components/alerts';
import Profile from './app/components/profile';
import Stats from './app/components/stats';
import CustomHeader from './app/components/header';
import Common from './app/components/common';
import Notify_app from './notify_app';
import CalOne from './CAL-SYSTEM/one.js';
console. disableYellowBox = true;
const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();
const Stack = createStackNavigator();
function SettingsStackScreen() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                      iconName = focused
                        ? 'home'
                        : 'home';
                        return <FontAwesome5 name={iconName} size={size} color={color} />;
                    } 
                    else if(route.name === 'Water'){
                        iconName = focused
                        ? 'ios-water'
                        : 'ios-water';
                       return <Ionicons name={iconName} size={size} color={color} />;
                    }
                    else if(route.name === 'Stats'){
                        iconName = focused
                        ? 'file'
                        : 'file';
                        return <FontAwesome name={iconName} size={size} color={color} />;
                    }
                    else if(route.name === 'Profile'){
                        iconName = focused
                        ? 'user-alt'
                        : 'user-alt';
                        return <FontAwesome5 name={iconName} size={size} color={color} />;
                    }
                    else if(route.name === 'Alerts'){
                        iconName = focused
                        ? 'bell'
                        : 'bell';
                        return <FontAwesome name={iconName} size={size} color={color} />;
                    }
                },
            })}
            tabBarOptions={{
                activeTintColor: '#8DDAD3',
                inactiveTintColor: 'gray',
            }}
        >
        <Tab.Screen name="Stats" component={Stats} />
        <Tab.Screen name="Alerts" component={Alerts} />        
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Water" component={Water} />
        <Tab.Screen name="Profile" component={Profile} />

      </Tab.Navigator> 
  );
}

export default function App() {
    const Stack = createStackNavigator();
    return (
        <NavigationContainer>
        {
            /* Setting all routes */
            <Root>
            {/*<SettingsStack.Navigator initialRouteName={Platform.OS ==='android' ? "Splash_android" : "Splash_ios"}>*/}
            <SettingsStack.Navigator initialRouteName={Platform.OS ==='android' ? "Ble_test" : "Splash_ios"}>
                <Stack.Screen name="Splash" component={Splash_android} options={{headerShown: false}}/>
                <Stack.Screen name="Intro_1" component={Intro_1} options={{headerShown: false}}/>
                <Stack.Screen name="Intro_2" component={Intro_2} options={{headerShown: false}}/>
                <Stack.Screen name="Intro_3" component={Intro_3} options={{headerShown: false}}/>
                <Stack.Screen name="Intro_4" component={Intro_4} options={{headerShown: false}}/>
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="Pincode" component={Pincode} options={{headerShown: false}}/>
                <Stack.Screen name="Home" component={SettingsStackScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Sync" component={Sync} options={{headerShown: false}}/>
                <Stack.Screen name="Common" component={Common} options={{headerShown: false}}/>
                <Stack.Screen name="Ble_test" component={Ble_test} options={{headerShown: false}}/>
                <Stack.Screen name="Notify_app" component={Notify_app} options={{headerShown: false}}/>
                <Stack.Screen name="CalOne" component={CalOne} options={{headerShown: false}}/>
            </SettingsStack.Navigator>
            </Root>
        }</NavigationContainer>
    );
}
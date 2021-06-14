/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {Container,Text, Button,View} from 'native-base';
import HeaderCustom from '../header';
import AsyncStorage from '@react-native-community/async-storage';
import { BleManager } from 'react-native-ble-plx';
import {logout_ble} from '../header/ble_manager_cp_12aug';
import Ble_store from '../../store/ble.js';
import UserDetailsStore from '../../store/user_details';
import { observer } from "mobx-react"
@observer
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            country : '',
            postcode : ''
        };
        this.manager = new BleManager({
            restoreStateIdentifier: 'testBleBackgroundMode',
            restoreStateFunction: bleRestoredState => {
                // fetch('http://restoreStateFunctionWasCalled.com')
            }
        });
    }

    UNSAFE_componentWillMount(){
        this.getSession();
    }

    async getSession(){
        try{
            let currentUser = await AsyncStorage.getItem('@USER');
            currentUser  = JSON.parse(currentUser)
            this.setState({country : currentUser.countryname, email:currentUser.email, postcode:currentUser.pincode})
        }
        catch(error){
            console.log("Something went wrong with profile AsyncStorage");
        }
    }

    logout(){
        AsyncStorage.getAllKeys()
        .then(keys => {console.log(keys);AsyncStorage.multiRemove(keys)
        })
        .then(() => {
            logout_ble();
            Ble_store.resetBleStore();
            UserDetailsStore.resetUserStore();
            this.props.navigation.navigate('Login')
        })
        .catch((err)=>{console.log("err in logout",err)})
    }
    
    
    render() {
        return (
            <Container>
                <HeaderCustom/>
                <View style={{height:3}}></View>
                <View style={{justifyContent : 'center', alignItems : 'center', flex : 1}}>
                    <Text>Email : {this.state.email}</Text>
                    <Text>Country : {this.state.country}</Text>
                    <Text>Postcode : {this.state.postcode}</Text>
                    {Ble_store.deviceName=='Scanning...' ? <Text>Tapp name : No filter connected</Text> : <Text>Tapp name : {Ble_store.deviceName}</Text>}
                    
                    <View style={{height:20}}></View>
                    <Button bordered  danger style={{alignSelf : 'center'}} onPress={()=>{this.logout()}}><Text>Logout</Text></Button>
                </View>    
            </Container>
        );
    }
};


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {Header,Left, Text, Body, Title, Right, Button} from 'native-base';
import styles from './style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from "mobx-react"
import Ble_store from '../../store/ble.js';
@observer
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
  
        };
        
    }
    
    render() {
        return (
            <Header style={styles.headerclass}>
                <Left >
                </Left>
                <Body></Body>
                <Right>
                <Button transparent>
                  <Icon style={{fontWeight:'bold'}} color={Ble_store.btColor} size={22} name={Ble_store.connectionStats == false ? 'bluetooth-off' : 'bluetooth'} />
                  <Text style={{color:Ble_store.btColor, fontWeight:'bold'}}> {Ble_store.deviceName} </Text>
                </Button>
                </Right>
            </Header>
        );
    }
};


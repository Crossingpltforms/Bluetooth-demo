import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Content, Footer, FooterTab, Button, Text, Title, Card, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-community/async-storage';
import { observer } from "mobx-react"
import Ble_store from '../app/store/ble.js';
import {cleanData,writeMesage} from './function'
import {PermissionsAndroid,Platform} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import base64 from 'react-native-base64';
import moment from 'moment'; 
let scancount = 0;let TRANSACTION_ID ="moniter";
let DEVICE_ID ="";
let DEVICE_NAME ="";
let SERVICE_UUID ="";
let CHARACTERISTICS_UUID ="";
@observer
export default class FooterTabsIconTextExample extends Component {
    constructor(props) {
        super(props)
        this.state = {
            connectionStatus : "Scanning", //device name
            makedata : []
        }
    }

    
    onpresschange=(page)=>{
        this.props.callbackfun({page:page,d1:this.state.d1,d2:this.state.d2, d3:this.state.d3});
    }
    cleandata(){
        Ble_store.cleanDeviceData([]);
    }
    writeMesageFunction(cmd){
        writeMesage(cmd)
    }
    render() {
    return (
      <Container>
                    
      <Header style={{backgroundColor : 'white'}}>
      <Right>
        {/*<Title style={{color : 'black', alignSelf:'center'}}>{Ble_store.deviceName}</Title>*/}
        <Icon style={{fontWeight:'bold'}} color={Ble_store.btColor} size={22} name={Ble_store.connectionStats == false ? 'bluetooth-off' : 'bluetooth'} />
        <Text style={{color:Ble_store.btColor, fontWeight:'bold'}}> {Ble_store.deviceName} </Text>
      </Right>
      </Header>
        <Content >
         {Ble_store.notificationData.length > 0 ? (
            <Card>
            <CardItem>
                <Body>
                    <Text>{Ble_store.notificationData}</Text>
                </Body>
            </CardItem>
        </Card>
            ):null }
        </Content>
            <Footer>
                <FooterTab>
                    <Button vertical active onPress={()=>this.writeMesageFunction("RIS 1")}>
                        <Icon name="feather" size={20} color={"white"} />
                        <Text>RIS 1</Text>
                    </Button>
                    <Button vertical active onPress={()=>this.writeMesageFunction("RIS 0")}>
                        <Icon name="feather" size={20}  color={"white"}/>
                        <Text>RIS 0</Text>
                    </Button>
                    <Button vertical active onPress={()=>this.onpresschange("one")}>
                        <Icon active name="feather" size={20}  color={"white"}/>
                        <Text>CALIB</Text>
                    </Button>
                    <Button vertical active onPress={()=>this.cleandata()}>
                        <Icon name="delete" size={20} color={"white"}/>
                        <Text>CLEAR</Text>
                    </Button>
                </FooterTab>
            </Footer>
      </Container>
    );
  }
}
//react-native-ble-plx methods
import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Content, Footer, FooterTab, Button, Icon, Text, Title, Card, CardItem } from 'native-base';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import moment from 'moment'; 
import BackgroundTimer from 'react-native-background-timer';
import {PermissionsAndroid,Platform} from 'react-native';
import {postApi,sendWarning,toastMessage} from '../app/includes/function';
import AsyncStorage from '@react-native-community/async-storage';
import WqUnfilterStore from '../app/store/wq_unfilter';
import Ble_store from '../app/store/ble.js';
import Statstore from '../app/store/stats';
import UserDetails from '../app/store/user_details';
let TRANSACTION_ID ="moniter";
let DEVICE_ID ="";
let DEVICE_NAME ="";
let SERVICE_UUID ="";
let CHARACTERISTICS_UUID ="";
let SLEEP_FLAG = 0;
let scancount = 0;
let collectArr = [];let sensorCollection =[];
export const initializeManager=()=>{
    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
                toastMessage("Permission is OK","top","success");
                // console.log("Permission is OK");
                initializeManager_true();
            } else {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                    if (result=="granted") {
                        initializeManager_true();
                        console.log("User accepted for Location access");
                        toastMessage("User accepted for Location access","top","success");//data=error message from server
                    } else {
                        toastMessage("User refused for Location access","top","danger",10000);//data=error message from server
                        console.log("User refused for Location access");
                    }
                });
            }
        });
    }
    if (Platform.OS === 'ios') {
       initializeManager_true();
    }
}
export const initializeManager_true=()=>{
this.manager = new BleManager({
        restoreStateIdentifier: 'testBleBackgroundMode',
        restoreStateFunction: bleRestoredState => {
            // fetch('http://restoreStateFunctionWasCalled.com')
        }
    });

    const subscription = this.manager.onStateChange((state) => {
        if (state == 'PoweredOn') {
            // scanAndConnect();
            console.log("-------getDeviceSession")
            getDeviceSession()
            
            console.log("scanAndConnect1 calling")
        }else if(state=='PoweredOff'){
            alert("Turn on bluetooth, to sync with filter")
        }
    }, true);
}

export const getDeviceSession=async()=>{
    try {
       let tappDetails =  await AsyncStorage.getItem('@TAPP_DETAILS');
       if(tappDetails){
            console.log("tappDetails",tappDetails)
            tappDetails = JSON.parse(tappDetails);
            DEVICE_ID = tappDetails.tappId
            DEVICE_NAME = tappDetails.tappName
            Ble_store.changeDevice(tappDetails.tappName);
            Ble_store.changeDeviceId(tappDetails.tappId);
            scanAndConnect();
       }
       else{
        console.log("tappDetails",tappDetails)
            scanAndConnect();
       }
       
    } catch(e) {
        console.log("error in TAPP_DETAILS asyncstorage on ble manager get item");
    }
}

export const scanAndConnect=()=>{
    console.log(DEVICE_ID)
    if(DEVICE_ID!=''&& DEVICE_ID!=null ){makeconnection(DEVICE_ID);return false;}
    console.log("Scanning will trigger")
    global.BLE_SCANNING=true;
    Ble_store.changeDevice("Scanning...");
    this.manager.startDeviceScan(null,{ScanMode : "Balanced" }, (error, device) => {
        scancount=scancount+1;
        console.log("Scanning...",scancount,DEVICE_ID);
        if (error) {
            console.log("Error in scan=> "+error)
            console.log("Error in scan=> "+JSON.stringify(error))
            this.manager.destroy();
            initializeManager();
            scanAndConnect();
            return
        }
        console.log("uper=>",device.name)
           if (null) {
            console.log('null');
            initializeManager()
        }
        console.log("niche=>",device.name)
        // if(scancount > 10){
        //     this.manager.stopDeviceScan();
        //     Ble_store.changeDevice("");
        // }
        if( /[_]/g.test( device.name ) ) 
        {    
            let nameSplit = device.name.split('_');
            if(nameSplit[0] == 'TAPP' || nameSplit[0] == 'T3X1'){ //T3X1 //TAPP
                this.manager.stopDeviceScan();
                const timeoutId = BackgroundTimer.setTimeout(() => {
                    makeconnection(device.id);
                    BackgroundTimer.clearTimeout(timeoutId);
                }, 200);
            }
        }
    })
}

export const makeconnection=(idd)=>{
    console.log("initiate connect with=>",idd)
    this.manager.connectToDevice(idd, {autoConnect:false}).then((device) => {
        (async () => {
            DEVICE_ID=device.id;
            DEVICE_NAME =device.name;
            global.BLE_SCANNING=false;
            Ble_store.changeDevice(device.name);
            Ble_store.changeDeviceId(device.id);
            Ble_store.changeConnState(true);
            this.manager.cancelTransaction(TRANSACTION_ID);
            const services = await device.discoverAllServicesAndCharacteristics();
            let characteristic = await this.getServicesAndCharacteristics(services);
            SERVICE_UUID=characteristic.serviceUUID;
            CHARACTERISTICS_UUID=characteristic.uuid;
            Ble_store.changeDeviceData(device);//extra
            Ble_store.changeBTColor('#24e600');//lightGreen
            const timeoutId = BackgroundTimer.setTimeout(() => {
                console.log("started notification");
                startNotify(device);
                Ble_store.changeBTColor('blue');//blue
                BackgroundTimer.clearTimeout(timeoutId);
            }, 10);
            try {
                await AsyncStorage.setItem('@TAPP_DETAILS', JSON.stringify({
                    tappId: device.id,
                    tappName : device.name
                }));
            } catch(e) {
                console.log("error in TAPP_DETAILS asyncstorage on ble manager setitem");
            }
        })();
            device.onDisconnected((error, disconnectedDevice) => {
                console.log("disconnectedDevice");
                this.manager.cancelTransaction(TRANSACTION_ID)
                this.manager.destroy();
                initializeManager();
                Ble_store.changeBTColor('#003A57');//gray
            });            
    }).then(() => {
      //nothing 
    }, (error) => {
        console.log("Connection error=>"+JSON.stringify(error));
        scanAndConnect();
    })
}

getServicesAndCharacteristics=(device)=>{
    console.log("getServicesAndCharacteristics calling")
    return new Promise((resolve, reject) => {
        device.services().then(services => {
            const characteristics = []
            services.forEach((service, i) => {
                service.characteristics().then(c => {
                    characteristics.push(c)
                    if (i === services.length - 1) {
                        const temp = characteristics.reduce(
                            (acc, current) => {
                                return [...acc, ...current]
                            },
                            []
                        )
                        const dialog = temp.find(
                            characteristic => characteristic.isWritableWithoutResponse
                        )
                        if (!dialog) {
                            console.log("No writable characteristic")
                            reject('No writable characteristic')
                        }
                        resolve(dialog)
                    }
                  
                })
            })
        })
    })
}

export const startNotify=(device)=>{
    console.log(Ble_store)
    let snifferService = null;
    device.services().then(services => {
        let voltageCharacteristic = null
        snifferService = services.filter(service => service.uuid === SERVICE_UUID)[0]
        snifferService.characteristics().then(characteristics => {
            voltageCharacteristic = characteristics.filter(c => c.uuid === characteristics[0].uuid)[0]
            voltageCharacteristic.monitor((error, c) => {
                // RECEIVED THE ERROR HERE (voltageCharacteristic.notifiable === true)
                if(error){
                    console.log("error in monitering",error,"---------",JSON.stringify(error))  
                }
                else{ 
                    var objects = {};
                    const value = base64.decode(c.value);
                    var splitVal = value.split(" ");
                    // console.log("value",value)
                    let splitValue = value.split(" ");
                    if(value=='SLEEP'){
                        Ble_store.changeBTColor('#24e600');//lightGreen
                    }
                    Ble_store.saveDeviceData(<Text key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);

                }
            },TRANSACTION_ID)
        }).catch(error => {console.log("error in snifferService=>", error)})
    }).catch(error => {
        console.log("ERROR device services=>"+error)
    })
}

export const disconnect=()=>{
    return new Promise((resolve, reject) => {
        this.manager.cancelDeviceConnection(DEVICE_ID).
        then(rest=>{
            console.log("disconnected manually");
        })
        .catch((err)=>{
            console.log("error on disconnect",err,"-------->",JSON.stringify(err));
        })
   })
}

export const addSensorData= async function(arrayofsensor){
    console.log("arrayofsensor=>",arrayofsensor);
    arrayofsensor.map((prop,key)=>
        {
            console.log(prop);
            prop.created_date = new Date();
        }
    )
    let response = await postApi("addSensorData",arrayofsensor);
    if(response.status == "true"){
            console.log("Data received");    
            Ble_store.changeBTColor('#003A57');//gray
            Statstore.changesyncNew("true");//set `true` for new data uploaded to cloud
        try {
            await AsyncStorage.setItem('@LAST_WATER_FLOW_SESSION', moment().format("YYYY-MM-DD HH:mm:ss"));
        } catch(e) {
            console.log("error in LAST_WATER_FLOW_SESSION asyncstorage");
        }
    }
    else{
         Ble_store.changeBTColor('red');
        console.log("error",response.message)   
    }
}

export const writeMesage=(command)=>{
    // this.setState({notificationReceiving:false});
    // console.log("8888",DEVICE_ID,Ble_store.device)
    // if(DEVICE_ID != '' && DEVICE_ID != null || DEVICE_ID != undefined)
    if(Ble_store.device && Ble_store.device!='')
    {
        var device = Ble_store.device;
        device.writeCharacteristicWithResponseForService(SERVICE_UUID, CHARACTERISTICS_UUID, base64.encode(command)).then((result) => {
            console.log("--------Writing response",command)
            toastMessage(command+" sent","bottom","success",1000);
        }).catch((error) => {
            console.log("error in writing=>"+error)
            console.log("error in writing=>"+JSON.stringify(error))
            toastMessage("Device should be connected in order to send command","bottom","danger");
        })
    }
    else{
        toastMessage("Device should be awake and connected in order to send command","bottom","danger");
        // alert("No device is connected")
    }
}

export const logout_ble=()=>{
    this.manager.cancelTransaction(TRANSACTION_ID)
    this.manager.stopDeviceScan();
    this.manager.destroy();
    delete this.manager;
    //reset all value
    DEVICE_ID ="";
    DEVICE_NAME ="";
    SERVICE_UUID ="";
    CHARACTERISTICS_UUID ="";
    SLEEP_FLAG = 0;
    scancount = 0;
    
    console.log("done logout")
}
export const cleanData=()=>{
    this.manager.cancelTransaction(TRANSACTION_ID)
    
    console.log("clean Data")
}
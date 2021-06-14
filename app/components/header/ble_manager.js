import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { Platform, View, NativeModules, NativeEventEmitter,PermissionsAndroid, AppState, TouchableOpacity, Text, } from 'react-native';
import {Toast,Root} from 'native-base';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import moment from 'moment'; 
import BackgroundTimer from 'react-native-background-timer';
import Ble_store from '../../store/ble.js';
let count = 0;
let scancount = 0;
const transactionId ="moniter";
import {postApi,sendWarning} from '../../../app/includes/function';
import { observer } from "mobx-react"
import UserDetails from '../../store/user_details';
import RiskStore from '../../store/risk_param';
import WqUnfilterStore from '../../store/wq_unfilter';
import AsyncStorage from '@react-native-community/async-storage';
const datafont =10;
@observer
export default class Ble_test extends Component {
    constructor(props) {
        super(props)
        // this.manager = new BleManager({
        //     restoreStateIdentifier: 'BleInTheBackground',
        //       restoreStateFunction: restoredState => {
        //         if (restoredState == null) {
        //           // BleManager was constructed for the first time.
        //         } else {
        //             console.log("restoredState");
        //             console.log(restoredState);
        //           // BleManager was restored. Check `restoredState.connectedPeripherals` property.
        //         }
        //       }
        // })

       
        this.state = {
            deviceid : '', serviceUUID:'', characteristicsUUID : '', text1 : '',makedata : [],showToast: false,
            notificationReceiving : false,
            sensorCollection : [],
            appState: AppState.currentState,
            flagsleep : 0
        }
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                    this.initializeManager();
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        console.log(result)
                        if (result=="granted") {
                            console.log("User accepted for Location access");
                        } else {
                            console.log("User refused for Location access");
                        }
                    });
                }
            });
        }
       if (Platform.OS === 'ios') {
           this.initializeManager();
            // this.manager.onStateChange((state) => {
            //     console.log(state)
            //     if (state === 'PoweredOn') {
            //         this.initializeManager();
            //         subscription.remove();
            //     }
            //     else{
            //         alert("Turn your bluetooth on")
            //     }
            // })
        }
    }

     initializeManager() {
        this.manager = new BleManager({
            restoreStateIdentifier: 'testBleBackgroundMode',
            restoreStateFunction: bleRestoredState => {
                // fetch('http://restoreStateFunctionWasCalled.com')
            }
        });
        const subscription = this.manager.onStateChange((state) => {
            if (state == 'PoweredOn') {
                this.scanAndConnect();
            }else if(state=='PoweredOff'){
                alert("Turn on BT please")
            }
        }, true);
    }
    
  
    // componentDidMount() {
    //     AppState.addEventListener('change', this._handleAppStateChange);
    // }

   //  componentWillUnmount() {
   //      AppState.removeEventListener('change', this._handleAppStateChange);
   //  }

   // _handleAppStateChange = (nextAppState) => {
        // this.setState({appState: nextAppState});
         // console.log("bottom ",this.state.appState)
         // if(this.state.appState == "background"){
         //     // this.scanAndConnect()
         //     this.disconnect();

         //     this.manager.connectToDevice("3BDFC828-11A7-894A-E42C-F0D9EB7F0B0F", {autoConnect:true}).then((device) => {
         //         console.log("devicehj jkhjk")
         //         console.log(device)
         //     })
         // }
  // }
    
    componentWillUnmount() {
        if(this.manager){
            this.manager.cancelTransaction(transactionId)
            this.manager.stopDeviceScan();
            this.manager.destroy();
            // this.manager.cancelTransaction(transactionId)
            delete this.manager;
        }
    }
    
    
    async getReports(){
        // let data = {"country":"Spain","postcode":"12001"};
        // var requestBody = JSON.stringify(data);
        // console.log(requestBody)
        // let response = await postApi(requestBody,"getWQDB");
        // console.log(response)
        // this.setState({drinkable : ""})
    }
    getServicesAndCharacteristics(device) {
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
                                characteristic =>
                                    characteristic.isWritableWithoutResponse
                            )
                            if (!dialog) {
                                reject('No writable characteristic')
                            }
                            resolve(dialog)
                        }
                      
                    })
                })
            })
        })
    }

    stopNotication(){
        this.manager.cancelTransaction(transactionId)
        this.setState({notificationReceiving:false})
    }
    stateClear(){
        let cleanState = {};
        Object.keys(this.state).forEach(x => {
            if(x=='makedata'){cleanState[x] = []} 
            else if(x=='sensorCollection'){cleanState[x] = []}
            else{cleanState[x] = null}
        });
        this.setState(cleanState);
    }
    disconnect(){
        return new Promise((resolve, reject) => {
            this.manager.cancelDeviceConnection(this.state.deviceid).
            then(rest=>{
                // console.log(rest);
                // this.stateClear();
            })
            .catch((err)=>console.log("error on cancel connection",err))
       })
    }

    async writeMesage(code, message){
        this.setState({notificationReceiving:false});
        var device= this.state.device;
        // const senddata = base64.encode(message);
        if(device)
        {
            // console.log("write response1");
            device.writeCharacteristicWithResponseForService(this.state.serviceUUID, this.state.characteristicsUUID, base64.encode(message)).then((characteristic) => {
                
                // console.log("write response");
                // console.log(characteristic);
                this.alert(message,"success")
                
                //Sent message and start receiving data
                // console.log("device")
                // console.log(this.state.serviceUUID,"device",this.state.characteristicsUUID)
                // console.log(this.state.device)
                  
            }).catch((error) => {
                this.alert("writing=> "+JSON.stringify(error),'danger',8000);
                console.log("error in writing=>"+error)
                console.log("error in writing=>"+JSON.stringify(error))
            })
        }
        else{
            this.alert("No device is connected")
        }
    }
    async addSensorData(arrayofsensor){
        // console.log("----------device.id",this.state.deviceId)
        if(arrayofsensor[0].MEM == 0  && arrayofsensor[0].TDS>1000){this.writeMesage("ris 1","ris 1 Writted")}
        let data = {"user":(JSON.stringify(UserDetails.userDetails)),"user_email":UserDetails.userDetails.email,"tapp_id":this.state.deviceid,"tapp_name":this.state.deviceName,"sensorJsonData" : arrayofsensor}
        // console.log("arrayofsensor==>",arrayofsensor,this.state.deviceid)
        // var requestBody = JSON.stringify(data);
        let response = await postApi("addSensorData",data);
        if(response.errors){
            console.log("error",response.message)    
        }
        else{
            console.log("Data received");    
            try {
                await AsyncStorage.setItem('@LAST_WATER_FLOW_SESSION', moment().format("YYYY-MM-DD HH:mm:ss"));
            } catch(e) {
                // save error
                console.log("error in LAST_WATER_FLOW_SESSION asyncstorage");
               
            }
        }
    }
        
    alert(message,type="danger",duration=2000){
        Toast.show({
            text: message,
            buttonText: 'Okay',
            duration: duration,
            type: type,
            position : "top",
            useNativeDriver : false,
            animation:true
        })
        // console.log(message)
    }
       
    scanAndConnect() {

        this.setState({text1:"Scanning..."})
        Ble_store.changeDevice("Scanning...");
        this.manager.startDeviceScan(null,{ScanMode : "Balanced" }, (error, device) => {
            console.log("Scanning...",scancount);
            scancount=scancount+1;
            if (null) {
                console.log('null');
                this.manager.cancelConnection();
                this.initializeManager()
            }
            if (error) {
                // this.alert("Error in scan=> "+error)
                console.log("Error in scan=> "+error)
                this.setState({text1:""})
                this.scanAndConnect()
                // this.manager.stopDeviceScan();
                return
            }
            // if(scancount > 10){
            //      this.manager.stopDeviceScan();
            //      Ble_store.changeDevice("");
            // }
            console.log(device.name);
            if( /[_]/g.test( device.name ) ) 
            {
                let nameSplit = device.name.split('_');
                if(nameSplit[0] == 'T3X1' || nameSplit[0] == 'TAPP'){ //T3X1 //TAPP
                    Ble_store.changeDevice(device.name);
                    Ble_store.changeDeviceId(device.id);
                    scancount=0;
                    // const serviceUUIDs= device.serviceUUIDs[0]
                    this.setState({text1:"Connecting to "+device.name, deviceName : device.name})
                    this.manager.stopDeviceScan();
                    this.manager.connectToDevice(device.id, {autoConnect:true}).then((device) => {
                        (async () => {
                            // console.log("----------device.id",device.id)
                            this.manager.cancelTransaction(transactionId);
                            this.setState({deviceId:device.id,deviceid:device.id});
                            console.log("----------device.id",this.state.deviceId)
                            const services = await device.discoverAllServicesAndCharacteristics();
                            // console.log("services",services)
                            let characteristic = await this.getServicesAndCharacteristics(services);
                            this.setState({serviceUUID : characteristic.serviceUUID,characteristicsUUID : characteristic.uuid})


                            const timeoutId = BackgroundTimer.setTimeout(() => {
                                console.log("started notification")
                                this.startNotify(device);
                                BackgroundTimer.clearTimeout(timeoutId);
                            }, 10);

                            //listener for disconnection
                            device.onDisconnected((error, disconnectedDevice) => {
                                console.log('Disconnected ', disconnectedDevice.name);
                                this.manager.cancelTransaction(transactionId);
                                // this.scanAndConnect();
                                // this.stateClear();
                                this.manager.destroy();
                                this.initializeManager();
                                this.setState({text1 :'Disconnected '+ disconnectedDevice.name +"\n Searching for device...." })
                                Ble_store.changeDevice("Scanning...");
                            });
                            //dup//const services = await device.discoverAllServicesAndCharacteristics()
                            //dup//const characteristic = await this.getServicesAndCharacteristics(services)
                            // console.log(characteristic)
                            // this.setState({"deviceid":device.id, serviceUUID:characteristic.serviceUUID, characteristicsUUID : characteristic.uuid,device:device })
                            this.setState({text1:"Connected to "+device.name})
                        })();

                        // this.setState({device:device})
                        //dup//return device.discoverAllServicesAndCharacteristics()
                    // }).then((device) => {
                    //     // return this.setupNotifications(device)
                    }).then(() => {
                        // const timeoutId = BackgroundTimer.setTimeout(() => {
                        // this.writeMesage("ack","ack Writted");
                        // this.startNotify(device);
                        // if(RiskStore.riskValue==1){this.writeMesage("ris 1","ris 1 Writted")}
                        // }, 10);
                    }, (error) => {
                        // this.alert("Connection error"+JSON.stringify(error))
                        console.log("Connection error"+JSON.stringify(error))
                    })
                }
            }
       });
    }

    startNotify(device){
        let snifferService = null
        device.services().then(services => {
            // console.log("services",services)
            let voltageCharacteristic = null
            this.setState({processing:"seeking services"})
            snifferService = services.filter(service => service.uuid === this.state.serviceUUID)[0]
            snifferService.characteristics().then(characteristics => {
                // voltageCharacteristic is retrieved correctly and data is also seems correct
                // console.log("characteristics=====>",characteristics)
                this.setState({processing:"services found"});


                voltageCharacteristic = characteristics.filter(c => c.uuid === characteristics[0].uuid)[0]
                voltageCharacteristic.monitor((error, c) => {
                    // RECEIVED THE ERROR HERE (voltageCharacteristic.notifiable === true)
                    if(error){
                        console.log("error in monitering",error,"---------",JSON.stringify(error))  
                        // this.setState({error:"error in monitering"+JSON.stringify(error)});
                        // return;
                    }
                    else{ // works in 3's window
                        var objects = {};
                        const value = base64.decode(c.value);
                        // const value = "CAR";
                        // console.log(value)
                        // console.log(value.match(/FIL/g))
                        // if(value=='//////////'){this.setState({makedata : []});} // For Priyanka's device only
                        let splitValue = value.split(" ");
                        // splitValue = parseInt(splitValue[1]);
                        if (splitValue[0]=="TMP" && parseInt(splitValue[1])>30){
                            sendWarning("Hot water detected in the filter. Avoid running hot water through the filter.")
                        }
                        if (splitValue[0]=="BAT" && parseInt(splitValue[1])>10){
                            sendWarning("Battery is low and needs to be charged.")
                        }

                        if(value == 'SLEEP'){
                            this.setState({flagsleep : 1})
                            this.state.makedata.push(<Text key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);
                                this.setState({makedata:this.state.makedata});
                                
                        }
                        else if(value == 'END' || value=='//////////'){
                            // this.setState({makedata : []});//for me only priyanka
                            this.state.makedata.push(<Text style={{fontSize:datafont}} key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);//
                            this.setState({makedata:this.state.makedata});
                            //TO DO : Upload to cloud/Collect
                            // this.alert("huhue")
                            this.state.sensorCollection[0]['day']=moment().format("D");
                            this.state.sensorCollection[0]['month']=moment().format("M");
                            this.state.sensorCollection[0]['year']=moment().format("YYYY");
                            this.setState({sensorCollection:[Object.assign({}, ...this.state.sensorCollection)]});
                            this.addSensorData(this.state.sensorCollection);
                        }
                        else if((value.match(/FIL/g) !=null || value.match(/CAR/g) !=null) && this.state.flagsleep == 1)
                        {
                            this.setState({makedata : [],flagsleep : 0});
                            if(value.match(/CAR/g) !=null){alert("Your filter is expired!!!")}
                            this.state.makedata.push(<Text key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);
                                this.setState({makedata:this.state.makedata});
                            WqUnfilterStore.changeFilter(moment().format('YYYY-MM-DD'),moment().format('YYYY, M, D'));//to reset filter/cartraige

                        }
                        else if(value.match(/CAR/g) !=null && SLEEP_FLAG == false){
                            this.state.makedata.push(<Text style={{fontSize:datafont}} key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);
                            this.setState({makedata:this.state.makedata});//
                            alert("Your filter is expired!!!")
                            WqUnfilterStore.changeFilter(moment().format('YYYY-MM-DD'),moment().format('YYYY, M, D'));//to reset filter/cartraige
                        }
                        else{
                            this.state.makedata.push(<Text key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);
                                this.setState({makedata:this.state.makedata}); 
                                var splitVal = value.split(" ");
                                objects[splitVal[0]]=parseInt(splitVal[1])
                                this.state.sensorCollection.push(objects); 
                        }
                        // //
                        // if(value=='//////////'){
                            
                        // }
                        // else{
                        //     if(value.match(/SLEEP/g) ==null || value.match(/CAR/g) ==null)
                        //     {
                        //         var splitVal = value.split(" ");
                        //         objects[splitVal[0]]=parseInt(splitVal[1])
                        //         this.state.sensorCollection.push(objects);
                        //     }
                        // }

                        //to reset filter/cartraige
                        // if (value.match(/CAR/g) !=null){
                        //     WqUnfilterStore.changeFilter(moment().format('YYYY-MM-DD'),moment().format('YYYY, M, D'));//to reset filter/cartraige
                        // }
                        
                    }
                },transactionId)
            }).catch(error => {this.setState({error:"snifferService=> "+error});console.log("error in snifferService=>", error)})
        }).catch(error => {
                    // this.manager.cancelConnection();
                    // this.scanAndConnect()
            this.setState({error:"device services=>"+error});console.log("error in device services=>", error)
        })
    }

    pagechange(navigate){
            // this.manager.cancelTransaction(transactionId);
            // this.setState({notificationReceiving:false});
            // navigate('Sync', {
            //                     deviceid: this.state.deviceid,
            //                     deviceName: this.state.deviceName,
            //                   }
            //                   );
    }
    render() {
        // const { navigate } = this.props.navigation;

        return (
             null
        )    
    }
}

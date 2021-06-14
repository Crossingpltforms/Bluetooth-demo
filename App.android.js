import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Platform, View, NativeModules, NativeEventEmitter,PermissionsAndroid, AppState,ScrollView,NativeAppEventEmitter } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import BleManager1 from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager1;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Card, CardItem, Body,Toast,Root, Left, Right, Title} from 'native-base';
import base64 from 'react-native-base64';
import moment from 'moment'; 
import BackgroundTimer from 'react-native-background-timer';
const windowHeight = Dimensions.get('window').height;
let count = 0;
let scancount = 0;
const transactionId ="moniter";
let SLEEP_FLAG = false;
const datafont =10;
import {fetchApi} from './app/includes/function';
export default class Ble_test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            BT_ERROR : false,
            FORCE_SCAN : false,
            FORCE_SCAN_REASON : '',
            connectionStatus : '',
            flagsleep : 0,
            deviceId:'',
            serviceUUID:'',
            characteristicsUUID:'',
            error : '',
            characteristics_disply:[],
            makedata : [],      
            peripherals: new Map()
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
                            this.initializeManager();
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
        }
    }

   
    stateClear(){
        let cleanState = {};
        console.log(this.state.makedata)
        Object.keys(this.state).forEach(x => {
            if(x=='makedata'){cleanState[x] = []} 
            // else if(x=='sensorCollection'){cleanState[x] = []}
            // else{cleanState[x] = null}
            cleanState[x] = null;
        });
        this.setState(cleanState);
        console.log(this.state.makedata)
    }
  

    initializeManager() {
        console.log("initializeManager")
        this.manager = new BleManager({
            restoreStateIdentifier: 'testBleBackgroundMode',
            restoreStateFunction: bleRestoredState => {
                // console.log(this.manager.connectedPeripherals())
            }
        },()=>this.manager.cancelTransaction(transactionId));
        const subscription = this.manager.onStateChange((state) => {
            if (state == 'PoweredOn') {
                console.log("PoweredOn scanAndConnect")
                this.scanAndConnect();
                subscription.remove();
                this.setState({BT_ERROR : false})
            }else if(state=='PoweredOff'){
                // alert("Turn on BT please");
                this.setState({error:"BT_STATE_OFF",BT_ERROR:true,processing:"Scan till BT turn ON"});
            }
        }, true);
    }

     scanAndConnect() {
        
        this.setState({connectionStatus:"Scanning...",processing:"Scanning...",deviceId:'',characteristicsUUID:'',serviceUUID:'',error:'',makedata:[]});
        this.manager.startDeviceScan(null,{ScanMode : "LowLatency",allowDuplicates:true }, (error, device) => {
            
             
            if (error) {
                console.log("Error in scan=> "+error)
                this.setState({connectionStatus:""})
                this.manager.destroy();
                this.initializeManager();
                return
            }
               if (null) {
                console.log('null');
                this.manager.cancelConnection();
                this.initializeManager()
            }
            console.log(device.name)
            if( /[_]/g.test( device.name ) ) 
            {    
                
                let nameSplit = device.name.split('_');
                if(nameSplit[0] == 'TAPP' || nameSplit[0] == 'T3X1'){ //T3X1 //TAPP
                    this.manager.stopDeviceScan();
                    const timeoutId = BackgroundTimer.setTimeout(() => {
                        this.makeconnection(device,device.id);
                        BackgroundTimer.clearTimeout(timeoutId);
                    }, 200);
                    
                }
            }
            else{
                console.log("scanAndConnect");
                this.scanAndConnect();
            }
            
         
           
        })
    }
       
    makeconnection(device,idd){
        this.manager.connectToDevice(idd, {autoConnect:false}).then((device) => {
            (async () => {
                console.log("transactionId",transactionId)
                this.manager.cancelTransaction(transactionId);
                this.setState({connectionStatus:"Connected to "+device.name,processing:"Seeking characteristics",deviceId:device.id});
                const services = await device.discoverAllServicesAndCharacteristics();
                console.log("services",services)
                let characteristic = await this.getServicesAndCharacteristics(services);
                
                // console.log("characteristic",characteristic)
                // console.log("serviceUUID====>",characteristic.serviceUUID," characteristic id=>",characteristic.uuid)
                this.setState({serviceUUID : characteristic.serviceUUID,characteristicsUUID : characteristic.uuid,processing:"characteristics found"})
                    const timeoutId = BackgroundTimer.setTimeout(() => {
                        console.log("started notification")
                        this.startNotify(device);
                        this.setState({processing:"started notification"})
                        BackgroundTimer.clearTimeout(timeoutId);
                    }, 10);

             })();
                device.onDisconnected((error, disconnectedDevice) => {
                    console.log("disconnectedDevice");
                    this.manager.cancelTransaction(transactionId)
                    this.manager.destroy();
                    this.initializeManager();
                });            
        }).then(() => {
          //nothing 
          // console.log("then notify")
        }, (error) => {
                    // const timeoutId = BackgroundTimer.setTimeout(() => {
                    //     this.manager.cancelTransaction(transactionId)
                    // this.manager.destroy();
                    // this.initializeManager();
                    //     BackgroundTimer.clearTimeout(timeoutId);
                    // }, 1000);
            // this.setState({connectionStatus :'' })
            console.log("Connection error=>"+JSON.stringify(error))
            
            this.setState({error:"Connection error=>"+JSON.stringify(error)});
              
              
        })
    }
   
   
    getServicesAndCharacteristics(device) {
        console.log("getServicesAndCharacteristics calling")
        return new Promise((resolve, reject) => {
            device.services().then(services => {
                console.log("nichedddd",services)
                 this.setState({processing:"device services found"})
                const characteristics = []
                services.forEach((service, i) => {
                    service.characteristics().then(c => {
                        this.setState({processing:"services characteristics seeking"})
                        characteristics.push(c)
                        // console.log("niche characteristics",characteristics[0])
                        // this.setState({characteristics_disply:characteristics[0]})
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
                                console.log("No writable characteristic")
                                this.setState({error:"No writable characteristic"});
                                reject('No writable characteristic')

                            }
                            resolve(dialog)
                        }
                      
                    })
                })
            })
        })
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
                    else{
                        this.setState({processing:"Monitoring....",error:'',FORCE_SCAN:false,FORCE_SCAN_REASON:''});
                        const value = base64.decode(c.value);
                        // const value = "CAR";
                        

                        console.log("value",value)
                        if(value == 'SLEEP'){
                            SLEEP_FLAG = true;
                            this.state.makedata.push(<Text style={{fontSize:datafont}} key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);//
                            this.setState({makedata:this.state.makedata,connectionStatus:value});
                            //TO DO : Upload to cloud
                        }
                        else if(value == 'END' || value=='//////////'){
                            // this.setState({makedata : []});//for me only priyanka
                            this.state.makedata.push(<Text style={{fontSize:datafont}} key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);//
                            this.setState({makedata:this.state.makedata});
                            //TO DO : Upload to cloud/Collect
                            // this.alert("huhue")
                        }

                        else if((value.match(/FIL/g) !=null || value.match(/CAR/g) !=null) && SLEEP_FLAG == true){
                            SLEEP_FLAG = false;
                            if(value.match(/CAR/g) !=null){alert("Your filter is expired!!!")}
                            this.setState({makedata : []});
                            this.state.makedata.push(<Text style={{fontSize:datafont}} key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);
                            this.setState({makedata:this.state.makedata});//
                        }

                        else if(value.match(/CAR/g) !=null && SLEEP_FLAG == false){
                            this.state.makedata.push(<Text style={{fontSize:datafont}} key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);
                            this.setState({makedata:this.state.makedata});//
                            alert("Your filter is expired!!!")
                        }
                        else{
                            this.state.makedata.push(<Text style={{fontSize:datafont}} key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);
                            this.setState({makedata:this.state.makedata});//
                        }
                       
                    }
                        
                    
                },transactionId)
            }).catch(error => {this.setState({error:"snifferService=> "+error});console.log("error in snifferService=>", error)})
        }).catch(error => {
                    // this.manager.cancelConnection();
                    // this.scanAndConnect()
            this.setState({error:"device services=>"+error});console.log("error in device services=>", error)
        })
    }
   

    render() {
        if(this.state.error!=''){console.log("-----------------force scan");this.setState({FORCE_SCAN:true,FORCE_SCAN_REASON:this.state.error});
            // this.manager.cancelTransaction(transactionId)
                    // this.manager.destroy();
                    // this.initializeManager();
            this.scanAndConnect();
        }
        const { navigate } = this.props.navigation;

        return (
            <Root>
                <Header><Left/><Body><Title>TappWater {this.state.error}</Title></Body><Right/></Header>
                <Content padder>
                    <View>
                    <View style={{alignItems:'center',marginVertical : 10}}>
                        
                        {this.state.FORCE_SCAN_REASON != '' ? (<Text style={{alignSelf:'center',fontWeight:'bold'}}>FORCE SCAN REASON: {this.state.FORCE_SCAN_REASON}{'\n'}</Text>) : null}
                        
                        {this.state.error != '' ? (<Text style={{alignSelf:'center',fontWeight:'bold'}}>Error Found: {this.state.error}{'\n'}</Text>) : null}
                        
                        {this.state.BT_ERROR ? ( <Text style={{alignSelf:'center',fontWeight:'bold'}}>TURN ON BT please</Text>) : null}
                        
                        {this.state.FORCE_SCAN ? ( <Text style={{alignSelf:'center',fontWeight:'bold'}}>FORCE SCAN TRIGGERED</Text>) : null}
                        <Text style={{alignSelf:'center',fontWeight:'bold'}}>Process: {this.state.processing}</Text>
                        
                        <Text style={{alignSelf:'center'}}>{this.state.connectionStatus}</Text>
                        {/*<Text>FLAG {this.state.flagsleep}</Text>*/}
                        
                    </View>
                    <View style={{marginVertical : 10}}>
                        <Text style={{fontSize:datafont}} >Device Id : {this.state.deviceId} {'\n'}</Text>
                        <Text style={{fontSize:datafont}}>Service UUID : {this.state.serviceUUID} {'\n'}</Text>
                        <Text style={{fontSize:datafont}}>Characteristics UUID: {this.state.characteristicsUUID} {'\n'}</Text>
                    </View>
                    </View>
                   
                     <ScrollView style={{height:windowHeight/1.8}}>
                    {this.state.makedata.length > 0 ? (
                        <Card>
                        <CardItem>
                            <Body>
                               
                                <Text style={{fontSize:datafont}} >{this.state.makedata}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                        ):null }
                    </ScrollView>
                </Content>
                {/*<Footer>
                    <FooterTab>
                        <Button  onPress={()=>this.writeMesage("ris 0","ris 0 Writted")}>
                            <Text>RIS 0</Text>
                        </Button>
                        <Button  onPress={()=>this.writeMesage("ris 1","ris 1 Writted")}>
                            <Text>RIS 1</Text>
                        </Button>
                    </FooterTab>
                </Footer>*/}
            </Root>
        )    
    }
}

import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { Platform, View, NativeModules, NativeEventEmitter,PermissionsAndroid, AppState } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Card, CardItem, Body,Toast,Root, Left, Right, Title} from 'native-base';
import base64 from 'react-native-base64';
import moment from 'moment'; 
import BackgroundTimer from 'react-native-background-timer';

let count = 0;
let scancount = 0;
const transactionId ="moniter";
import {fetchApi} from './app/includes/function';
export default class Ble_test extends Component {
    constructor(props) {
        super(props)
        this.manager = new BleManager({
            restoreStateIdentifier: 'BleInTheBackground',
              restoreStateFunction: restoredState => {
                if (restoredState == null) {
                  // BleManager was constructed for the first time.
                } else {
                    console.log("restoredState");
                    console.log(restoredState);
                  // BleManager was restored. Check `restoredState.connectedPeripherals` property.
                }
              }
        })
        this.state = {
            deviceid : '', serviceUUID:'', characteristicsUUID : '', text1 : '',makedata : [],showToast: false,
            notificationReceiving : false,
            sensorCollection : [],
            appState: AppState.currentState,
            flagsleep : 0
        }
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

   _handleAppStateChange = (nextAppState) => {
        this.setState({appState: nextAppState});
         console.log("bottom ",this.state.appState)
         // if(this.state.appState == "background"){
         //     // this.scanAndConnect()
         //     this.disconnect();

         //     this.manager.connectToDevice("3BDFC828-11A7-894A-E42C-F0D9EB7F0B0F", {autoConnect:true}).then((device) => {
         //         console.log("devicehj jkhjk")
         //         console.log(device)
         //     })
         // }
  }
    
    componentWillUnmount() {
        this.manager.cancelTransaction(transactionId)
        this.manager.stopDeviceScan();
        this.manager.destroy();
        // this.manager.cancelTransaction(transactionId)
        delete this.manager;
    }
    
    UNSAFE_componentWillMount() {
        this.manager = new BleManager()
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                    this.scanAndConnect()
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }
       if (Platform.OS === 'ios') {

            this.manager.onStateChange((state) => {
                console.log(state)
                if (state === 'PoweredOn') {

                    this.scanAndConnect();
                    subscription.remove();
                }
            })
        } 
        //get data WQDB
        // this.getReports();
    }
    async getReports(){
        // let data = {"country":"Spain","postcode":"12001"};
        // var requestBody = JSON.stringify(data);
        // console.log(requestBody)
        // let response = await fetchApi(requestBody,"getWQDB");
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
                console.log(rest);
                this.stateClear();
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
            device.writeCharacteristicWithResponseForService(this.state.serviceUUID, this.state.characteristicsUUID, base64.encode(message)).then((characteristic) => {
                
                console.log("write response");
                console.log(characteristic);
                this.alert(message,"success")
                
                //Sent message and start receiving data
                console.log("device")
                console.log(this.state.serviceUUID,"device",this.state.characteristicsUUID)
                console.log(this.state.device)
                if(code == 'ack'){
                    // this.manager.cancelTransaction(transactionId)
                    let snifferService = null
                    device.services().then(services => {
                        let voltageCharacteristic = null
                        snifferService = services.filter(service => service.uuid === this.state.serviceUUID)[0]
                        snifferService.characteristics().then(characteristics => {
                            console.log("characteristics characteristics")
                            console.log(characteristics)
                            this.setState({notificationReceiving:true})
                            // voltageCharacteristic is retrieved correctly and data is also seems correct
                            voltageCharacteristic = characteristics.filter(c => c.uuid === characteristics[0].uuid)[0]
                            voltageCharacteristic.monitor((error, c) => {
                                // RECEIVED THE ERROR HERE (voltageCharacteristic.notifiable === true)
                                if(error){
                                    console.log("error in monitering",error)  
                                    return;
                                }
                                else{ // works in 3's window
                                    var objects = {};
                                    const value = base64.decode(c.value);
                                    // const value = "SLEEP";
                                    console.log(value)
                                    // console.log(value.match(/FIL/g))
                                    // if(value=='//////////'){this.setState({makedata : []});} // For Priyanka's device only
                                    if(value == 'SLEEP'){
                                        this.setState({flagsleep : 1})
                                        this.state.makedata.push(<Text key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);
                                            this.setState({makedata:this.state.makedata});
                                    }
                                    else if((value.match(/FIL/g) !=null || value.match(/CAR/g) !=null) && this.state.flagsleep == 1)
                                    {
                                        this.setState({makedata : [],flagsleep : 0});
                                        this.state.makedata.push(<Text key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);
                                            this.setState({makedata:this.state.makedata});

                                    }
                                    else{
                                        this.state.makedata.push(<Text key={moment().valueOf()}>{moment().format("MMMM Do, h:mm:ss a")} {value} {"\n"} </Text>);
                                            this.setState({makedata:this.state.makedata});  
                                    }
                                }
                            },transactionId)
                        }).catch(error => console.log(error))
                    })
                    return 
                }
                
            }).catch((error) => {
                this.alert("error in writing"+JSON.stringify(error))
            })
        }
        else{
            this.alert("No device is connected")
        }
    }
    async addSensorData(arrayofsensor){
        console.log(arrayofsensor)

        // console.log(this.state.deviceid)
        // console.log(this.state.deviceName)
        // let data = {"user":this.state.deviceName,"tapp_id":this.state.deviceid,"tapp_name":this.state.deviceName,"bat":arrayofsensor[6],"temp":arrayofsensor[2],"vol":arrayofsensor[5],"tds":arrayofsensor[1],"fil":arrayofsensor[0],"flo":arrayofsensor[3],"tim":arrayofsensor[4],"mem":arrayofsensor[7]}
        let data = {"user":this.state.deviceName,"tapp_id":this.state.deviceid,"tapp_name":this.state.deviceName,"sensorJsonData" : arrayofsensor}
        console.log("sent data",data)
        // var requestBody = JSON.stringify(data);
        // console.log(requestBody)
        // let response = await fetchApi(requestBody,"addSensorData");
        
        // if(response.errors){
        //     console.log("error",response.message)    
        // }
        // else{
        //     console.log("success",response)    
        // }
    }
        
    alert(message,type="danger"){
        Toast.show({
            text: message,
            buttonText: 'Okay',
            duration: 2000,
            type: type,
            position : "top",
            useNativeDriver : false,
            animation:true
        })
        // console.log(message)
    }
       
    scanAndConnect() {
        
        this.setState({text1:"Scanning..."})
        this.manager.startDeviceScan(null,{ScanMode : "Balanced" }, (error, device) => {
            console.log("Scanning...");
            
            if (null) {
                console.log('null')
            }
            if (error) {
                this.alert("Error in scan=> "+error)
                this.setState({text1:""})
                this.scanAndConnect()
                // this.manager.stopDeviceScan();
                return
            }
            console.log(device.name);
            if( /[_]/g.test( device.name ) ) 
            {
                let nameSplit = device.name.split('_');
                if(nameSplit[0] == 'TAPP'){ //T3X1 //TAPP
                    const serviceUUIDs= device.serviceUUIDs[0]
                    this.setState({text1:"Connecting to "+device.name, deviceName : device.name})
                    this.manager.stopDeviceScan();
                    this.manager.connectToDevice(device.id, {autoConnect:true}).then((device) => {
                        (async () => {
                            //listener for disconnection
                            device.onDisconnected((error, disconnectedDevice) => {
                                console.log('Disconnected ', disconnectedDevice.name);
                                // this.manager.cancelTransaction(transactionId);
                                this.scanAndConnect();
                                // this.stateClear();
                                this.setState({text1 :'Disconnected '+ disconnectedDevice.name +"\n Searching for device...." })
                            });
                            const services = await device.discoverAllServicesAndCharacteristics()
                            const characteristic = await this.getServicesAndCharacteristics(services)
                            console.log(characteristic)
                            this.setState({"deviceid":device.id, serviceUUID:serviceUUIDs, characteristicsUUID : characteristic.uuid,device:device })
                            this.setState({text1:"Connected to "+device.name})
                        })();
                        this.setState({device:device})
                        return device.discoverAllServicesAndCharacteristics()
                    // }).then((device) => {
                    //     // return this.setupNotifications(device)
                    }).then(() => {
                        const timeoutId = BackgroundTimer.setTimeout(() => {
                        this.writeMesage("ack","ack Writted");
                     }, 10);
                    }, (error) => {
                        this.alert("Connection error"+JSON.stringify(error))
                    })
                }
            }
       });
    }

    pagechange(navigate){
            this.manager.cancelTransaction(transactionId);
            this.setState({notificationReceiving:false});
            navigate('Sync', {
                                deviceid: this.state.deviceid,
                                deviceName: this.state.deviceName,
                              }
                              );
    }
    render() {
        const { navigate } = this.props.navigation;

        return (
            <Root>
                <Header>
                    <Left/>
                    <Body>
                    <Title>TappWater</Title>
                    </Body>
                    <Right>
                       {/*this.state.deviceid ? 
                         (
                           <Button bordered success small onPress={() => this.pagechange(navigate)}>
                           <Text>Sync</Text>
                           </Button>
                            ) : (
                            null
                            )
                        */}
                       </Right>
                    </Header>
                <Content padder>
                    <View>
                        { /*this.state.deviceid ? 
                            (
                                <Button block danger bordered onPress={()=>this.disconnect()}>
                                    <Text>Disconnect</Text>
                                </Button>
                            ) : (
                               null
                            )
                        */}
                        {/*<Button block success bordered onPress={()=>this.scanAndConnect()}>
                                                            <Text>Scan for a device</Text>
                                                        </Button>*/}
                    </View>
                    <View style={{alignItems:'center',marginVertical : 10}}>
                        <Text style={{alignSelf:'center'}}>{this.state.text1}</Text>
                        <Text>FLAG {this.state.flagsleep}</Text>
                    </View>
                     {this.state.notificationReceiving==true ? (
                    <Button warning small onPress={()=>this.stopNotication()} style={{alignSelf : 'center'}}>
                        <Text>Stop Notification</Text>
                    </Button>
                ) : null}
                
                 

                    {this.state.makedata.length > 0 ? (
                        <Card>
                        <CardItem>
                            <Body>
                               
                                <Text>{/*{this.state.dateTime}*/}{'\n'}{this.state.makedata}</Text>
                            </Body>
                        </CardItem>
                    </Card>

                        ):null }
                    
                    
                </Content>
                <Footer>
                    <FooterTab>
                        {/*<Button  onPress={()=>this.writeMesage("ack","ack Writted")}>
                                                    <Text>ACK</Text>
                                                </Button>*/}
                        <Button  onPress={()=>this.writeMesage("ris 0","ris 0 Writted")}>
                            <Text>RIS 0</Text>
                        </Button>
                        <Button  onPress={()=>this.writeMesage("ris 1","ris 1 Writted")}>
                            <Text>RIS 1</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Root>
        )    
    }
}

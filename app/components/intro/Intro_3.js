/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
///Screen 11
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions
} from 'react-native';
import { Container } from 'native-base';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Ble_store from '../../store/ble.js';
import styles from './style';
import {initializeManager} from '../header/ble_manager_cp_12aug';
import { observer } from "mobx-react"
@observer
export default class intro_3 extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        
        initializeManager();
    }
    _autoRedirect(){
        // setTimeout(function(){ this.props.navigation.navigate('Intro_2')}, 3000)

    }
    render(){
        console.log("Ble_store.deviceName",Ble_store.deviceName)

        return (
            <Container>
                <ImageBackground source={require("../../assets/img/Intro-bg.png")} style={styles.image}>               
                    <Text style={styles.intro_title}>Looking for connection</Text>
                    <View style={{justifyContent : 'center', alignItem:'center',width:windowWidth/1.3}}> 
                        {
                            (Ble_store.deviceName == '') || (Ble_store.deviceName == 'Scanning...') ?  (
                                <View style={{flexDirection : 'row'}}>
                                    <Image source={require("../../assets/img/1.png")}/>
                                    <Text style={{fontSize : 22,alignSelf : 'center'}}>Searching for filter...</Text>
                                </View>
                            ) : (null)}
                       
                        {
                            (Ble_store.deviceName == '') || (Ble_store.deviceName == 'Scanning...') ? 
                            ( 
                                null
                               ) : 
                            ( 
                                <View style={{flexDirection : 'row'}}>
                                    <Text style={{fontSize : 22,alignSelf : 'center',flex: 1, flexWrap: 'wrap'}}>Connection established with the <Text style={{fontWeight:'bold'}}>{Ble_store.deviceName}</Text> filter ID (<Text style={{fontWeight:'bold'}}>{Ble_store.deviceId}</Text>)</Text>
                                    <Image source={require("../../assets/img/2.png")}/>
                                     {this._autoRedirect()}
                                </View>
                            )
                        }
                        { 
                            (Ble_store.deviceName == '') || (Ble_store.deviceName == 'Scanning...') ? 
                               (<TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('Home')}>
                                    <Text style={styles.loginText}>Skip</Text>
                                </TouchableOpacity> 
                            ) : 
                            (
                                <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('Intro_2')}>
                                    <Text style={styles.loginText}>Next</Text>
                                </TouchableOpacity> 
                            )
                       }
                        
                               
                    </View>
                </ImageBackground>
            </Container>
        );
    }
};



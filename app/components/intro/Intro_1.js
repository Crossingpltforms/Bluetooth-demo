/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
///Screen 13
import React,{ Component} from 'react';
import {
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    SafeAreaView,
    Dimensions
} from 'react-native';
import {Container,Text, Button} from 'native-base';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import styles from './style';

export default class intro_1 extends Component {
    render(){
        return (
            <ImageBackground source={require("../../assets/img/Intro-bg.png")} style={styles.image}> 
                <Text style={styles.intro_title}>To setup your filter</Text>
                <View style={{justifyContent : 'center', alignItem:'center'}}> 
                    <View style={{flexDirection : 'row'}}>
                        <Image source={require("../../assets/img/1.png")}/>
                        <Text style={{fontSize : 22,alignSelf : 'center'}}>Turn on the faucet.</Text>
                    </View>
                    <View style={{flexDirection : 'row'}}>
                        <Text style={{fontSize : 22,alignSelf : 'center'}}>Click on the start button</Text>
                        <Image source={require("../../assets/img/2.png")}/>
                    </View>
                    <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('Intro_2')}>
                        <Text style={styles.loginText}>Start</Text>
                    </TouchableOpacity>         
                </View>
            </ImageBackground>
        );
    }
};


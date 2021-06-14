/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
///Screen 12
import React,{ Component} from 'react';
import {
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import {Container} from 'native-base';
import styles from './style';

export default class intro_2 extends Component {
    render(){
        return (
            <Container >
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
                        <View style={{flexDirection : 'row'}}>
                            <Image source={require("../../assets/img/3.png")}/>
                            <Text style={{fontSize : 22,alignSelf : 'center'}}>Let it flush for 30 seconds</Text>
                        </View>
                        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('Intro_4')}>
                            <Text style={styles.loginText}>Continue</Text>
                        </TouchableOpacity>         
                    </View>
                </ImageBackground>
            </Container>
        );
    }
};


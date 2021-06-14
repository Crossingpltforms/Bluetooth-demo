/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions

} from 'react-native';
import { Container } from 'native-base';
import styles from './style';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default class Intro_4 extends Component{
    render(){
        return (
            <Container>
                <ImageBackground source={require("../../assets/img/Intro-bg.png")} style={styles.image}>               
                    <View style={{justifyContent : 'center', alignItem:'center',width:windowWidth/1.3}}> 
                        <Image style={{alignSelf :'center',width:80,height:80,}} source={require("../../assets/img/right1.png")}/>
                        <Text style={{alignSelf :'center', color :'#003A57', fontSize:31, marginTop:12, fontWeight : 'bold'}}>All set</Text> 
                        <Text style={{alignSelf :'center', color :'#003A57', fontSize:25, marginTop:50}}>You can now use your filter </Text>
                        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('Home')}>
                           <Text style={styles.loginText}>Next</Text>
                        </TouchableOpacity>         
                    </View>
                </ImageBackground>                
            </Container>
        );
    }
};
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import {Container, Item, Input,Icon} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './style';
import AsyncStorage from '@react-native-community/async-storage';

export default class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPassword : true,
            loginBtnText : "Login",
            email : '',
            password : '',
            loginDisabled : false
        }
    }
    
    eyePlay() {
        this.setState({ showPassword: !this.state.showPassword });
    }
    
    onClickListener(val)
    {
        if(val=='login'){
            this.doLogin();
        }
    }

    async doLogin(){
        const email = this.state.email.trim();
        const password = this.state.password.trim();
        // const email = "priyanka.mindcrew@gmail.com";
        // const password = "Mindcrew01";
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(email==''){
            alert("Email is Not Correct");
            return false;
        }
        else if (reg.test(email) === false) {
            alert("Email is Not Correct");
            return false;
        }
        else if(password==''){
            alert("Enter valid password");
            return false;
        }
         
        let response = await this.fetchApi(email,password);
        
        if(response.error == ''){
            const USER = {
                email: email,
                token : response.token,
                user_id : response.user_id
            }
            try {
                await AsyncStorage.setItem('@USER', JSON.stringify(USER));
                 this.props.navigation.navigate('Pincode');
            } catch(e) {
                // save error
                console.log("error in user asyncstorage");
               
            }
        }
        else{
            alert(response.message);
        }
        this.setState({"loginBtnText" : "Login",loginDisabled:false});    
        
        
    }

    async fetchApi(email,password){
        this.setState({"loginBtnText" : "Sending.....",loginDisabled:true})    
        try{
            console.log("start submitting");
            const response = await fetch(
                'https://tappwater.co/us/wp-json/tappapi/v2/users/'+email+'/authtoken',
                { 
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({"password": password})
            });
            const post = await response.json();
            return post;
        }
        catch(err){
            alert("Network not available");
            this.setState({"loginBtnText" : "Login",loginDisabled:false});    
        }
    }
    
    render() {
        const eysIcon = this.state.showPassword == true ? 'eye-off' : "eye";

        return (
            <KeyboardAwareScrollView
                style={{ backgroundColor: '#003A57' }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <Container >
                    <ImageBackground source={require("../../../assets/img/login-bg.png")} style={styles.image}>
                        <View style={styles.logo_view}>
                            <Image style={styles.logoimage} source={require("../../../assets/img/logo.png")}/>
                        </View>
                        <View style={styles.loginform}>
                            <Item rounded style={styles.inputContainer}>
                                <Icon active name='ios-mail' />
                                <Input placeholder='Email' onChangeText={(email) => this.setState({ email })} keyboardType="email-address" textContentType="emailAddress" autoCompleteType="email"/>
                            </Item>

                            <Item rounded style={styles.inputContainer}>
                                <Icon active name='md-key' />
                                <Input placeholder='Password' secureTextEntry={this.state.showPassword} onChangeText={(password) => this.setState({ password })} />
                                <TouchableOpacity onPress={()=>this.eyePlay()}>
                                    <Icon active name={eysIcon}/>
                                </TouchableOpacity>
                            </Item>

                            {/*<TouchableOpacity style={styles.forget} onPress={() => this.onClickListener('restore_password')}>
                                <Text style={{fontWeight: 'bold',fontSize:15,color:'#21365ae0'}}>Forget password?</Text>
                            </TouchableOpacity>*/}

                            <TouchableOpacity disabled={this.state.loginDisabled} style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
                                <Text style={styles.loginText}>{this.state.loginBtnText}</Text>
                            </TouchableOpacity>
                            
                            {/*<TouchableOpacity style={[styles.buttonContainer,styles.registerButton]} onPress={() => this.onClickListener('register')}>
                                <Text style={styles.registerText}>Register</Text>
                            </TouchableOpacity>*/}
                        </View>    
                    </ImageBackground>
                </Container>
            </KeyboardAwareScrollView>
        );
    }
};


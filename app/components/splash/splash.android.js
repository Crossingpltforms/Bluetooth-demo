import React, {Component} from 'react';
import {Platform,Image} from 'react-native';
import { Container, Content, Spinner, Text, View} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './style';
import UserDetails from '../../store/user_details';
export default class App extends Component {
	componentDidMount() {
	  	setTimeout( () => {
	     	this.getSession();
	  	},1000);
	}


    async getSession(){
        try{
            let currentUser = await AsyncStorage.getItem('@USER');
            currentUser  = JSON.parse(currentUser)
            UserDetails.userDetails = currentUser; 
            if(!currentUser || !currentUser.countryname ){
                this.props.navigation.navigate('Login'); 
            }else{
                this.props.navigation.navigate('Home');  
            }
        }
        catch(error){
            console.log("Something went wrong with splash AsyncStorage");
        }
    }

  	render() {
        return (
            <Container style={styles.container}> 
                <View style={styles.android_splash_view}> 
	               <Image source={require("../../assets/img/logo.png")}  />
	               {/*<Text style={styles.splash_app_text} >Tapp3x</Text>*/}
	           </View>
            </Container>
        );
    }
}


import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image,TouchableOpacity,Dimensions,Alert} from 'react-native';
import { Container, Content, Spinner } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './style';
export default class App extends Component {
	componentWillMount(){
        this.getSession();
    }

    async getSession(){
        try{
            const currentUser = await AsyncStorage.getItem('@USER');
            // console.log(currentUser);
            if(!currentUser){
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
	            <Spinner style={styles.alignCenter} />
            </Container>
            
        );
    }
}


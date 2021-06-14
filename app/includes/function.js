import {
    Alert,
    View
} from 'react-native';

import {
    Toast,
    Text
} from 'native-base';
import React, { Component } from 'react';
import { LocalNotification } from './NotificationService'
import moment from 'moment'; 
const GLOBAL = require('./Global');
import USERSTORE from '../store/user_details';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import styles from './style';
export const postApi=(endpoint,json)=>{
    // console.log(endpoint,"json to server=> ",json)
    return fetch(GLOBAL.BASE_URL+endpoint,{
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        method: 'POST',body:JSON.stringify(json)})
    .then((response) => response.json())
    .then((json) => {
        // console.log("response json=>",json)
        return json;
    })
    .catch((error) => {
        // alert(JSON.stringify(error))
        console.log("error in postapi=> ",(error))
        console.log("error in postapi=> ",JSON.stringify(error))
        return {status:"false", message : "Network not available",data : "Network not available"};
    });
}

export const alertMessage = (msg)=>{
    Alert.alert(msg);
}

export const toastMessage=(message,position,type, duration=3000)=>{
    // Toast.show({
    //     text: message,
    //     buttonText: 'Okay',
    //     type: type,
    //     position: position,
    // })
    Toast.show({
                text: message,
                // textStyle: { color: "yellow" },
                buttonText: "Okay",
                type: type,
        position: position,
        duration: duration
              })
}

export const sendWarning=(notificationText)=>{
    LocalNotification(notificationText); //To feed same notification in warning data table
    let created_at = moment().format("D-MMM-YYYY, h:mm:ss a");
    const json = {"created_at" : created_at,"notificationText":notificationText,"user_id":USERSTORE.userDetails.user_id}
    postApi("insertWarnings",json).then((res)=>{console.log()}).catch((err)=>{console.log("error in insertWarnings api",err)});
}

export const testWaringCards = ()=>{
    return(
        <View style={{}}>
        <CardStack
        style={styles.content}
        renderNoMoreCards={() => <Text style={{ fontWeight: '700', fontSize: 18, color: 'gray' }}>No more cards :(</Text>}
        ref={swiper => {
          this.swiper = swiper
        }}
        onSwiped={() => console.log('onSwiped')}
        onSwipedLeft={() => console.log('onSwipedLeft')}
      >
        <Card style={[styles.card, styles.card1]}><Text style={styles.label}>A</Text></Card>
        <Card style={[styles.card, styles.card2]} onSwipedLeft={() => alert('onSwipedLeft')}><Text style={styles.label}>B</Text></Card>
        <Card style={[styles.card, styles.card1]}><Text style={styles.label}>C</Text></Card>
        <Card style={[styles.card, styles.card2]}><Text style={styles.label}>D</Text></Card>
        <Card style={[styles.card, styles.card1]}><Text style={styles.label}>E</Text></Card>
      </CardStack>
      </View>
        )

}


  
import React, {StyleSheet,Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    headerclass : {
        backgroundColor : 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 9,
    },
    deviceName : {
        fontWeight : 'bold',
        color : '#003A57',
        // width : windowWidth/2,
         marginRight  :windowWidth/19,
         fontSize :  windowWidth/24,

    },
    rightText : {
        // width : windowWidth/2
        flexDirection: 'row'
    },
    bticon : {
       fontSize :  windowWidth/24, 
       color : 'green',
       marginRight : 10
    }
  

});
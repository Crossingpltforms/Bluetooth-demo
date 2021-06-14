import React, {StyleSheet,Dimensions} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default StyleSheet.create({
    buttonContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        height:48,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:48,
        borderRadius:10,
    },
    
    loginButton: {
        backgroundColor: "#09ABA9",    
    },
    
    loginText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize:22
    },
    
    image: {
        flex: 1,
        resizeMode: "contain",
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    
    intro_title : {
        position:'absolute', top:20, color : "#003A57", left :20, fontSize:25, fontWeight : 'bold',
        ...ifIphoneX({
            paddingTop: 50
        }, {
            // paddingTop: 20
        })
    }
  
  });

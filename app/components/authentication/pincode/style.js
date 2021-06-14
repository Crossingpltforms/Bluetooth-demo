import React, {StyleSheet,Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    inputContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        width:windowWidth/1.3,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center',
    },

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
        marginBottom:20,
        // width:300,
        borderRadius:10,
    },
    
    loginButton: {
        marginTop:25,
        backgroundColor: "#09ABA9",    
    },
    
    SubmitText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize:15
    },
  
    image: {
        flex: 1,
        resizeMode: "contain",
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
        paddingTop:90
    },
  
    logo_view : {
        height :  windowHeight/2.5,
        position : 'absolute',
        top:1,
        justifyContent : 'center',
        alignItems : 'center'
    },
  
    loginform : {
        height :  windowHeight/1.5,
        position : 'absolute',
        bottom:1
    },
   
    logoimage : {
        alignSelf:'center',
    },

});
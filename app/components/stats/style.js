import React, {StyleSheet,Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    cardStyle : {
        borderRadius:20,
        marginLeft : 10,
        marginRight : 10,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardStyle2 : {
        borderRadius:20,
        marginLeft : 10,
        marginRight : 10,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    carditem2 : {
        // height : windowHeight/5,
        width : windowWidth/2.5,
        backgroundColor : 'white',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        borderTopColor:'white',
        borderLeftColor:'white',
        borderRightColor:'white',
        borderBottomColor:'white',
        borderWidth: 3,
        borderBottomColor:'white',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
    },
     row2 : {
        // flexDire ction : 'row-reverserow-reverserow-reverse',
        alignItems : 'flex-end',
        justifyContent : 'space-evenly',
        marginRight : 12
    },
    row1 : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-evenly'
    },
    carditem : {
        height : windowHeight/5,
        width : windowWidth/2.5,
        backgroundColor : '#EFFBFA',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        borderTopColor:'#80D6CF',
        borderLeftColor:'#80D6CF',
        borderRightColor:'#80D6CF',
        borderBottomColor:'#80D6CF',
        borderWidth: 3,
        borderBottomColor:'#80D6CF',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
    },
    cardTitle : {
        fontWeight : 'bold',
        fontSize : windowWidth/24,
        color : '#003A57'
    },
    homeTitle : {
        color : '#003A57',
        fontSize :  windowWidth/17,
        fontWeight : 'bold',
        marginLeft  :windowWidth/19
    },
    safeStatusText : {
        position:'absolute', bottom:0,fontWeight:'bold', fontSize:windowWidth/26,color:'#003A57'
    },
    iconStyle:{
        textAlign: 'right',alignSelf: 'flex-end',position: 'absolute', right: 0,bottom:0
    },
    statusImage : {
        alignSelf : 'center',
        height : windowWidth/5,
        width : windowWidth/5
    },
    image: {
        // marginTop:3,
        // height : windowHeight/1.05,
        flex:1
    },
    modalView : {  
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        maxHeight:500,
        marginTop:Dimensions.get('window').height/3.5,
        backgroundColor:'#8DDAD3',
        position:'absolute',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width:Dimensions.get('window').width/1.1
    },
     modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});
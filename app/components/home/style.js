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
    row1 : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-evenly'
    },
    carditem : {
        height : windowHeight/5,
        width : windowWidth/2.5,
        backgroundColor : '#FEF0E5',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        borderTopColor:'#EBCBBC',
        borderLeftColor:'#EBCBBC',
        borderRightColor:'#EBCBBC',
        borderBottomColor:'#FEF0E5',
        borderWidth: 3,
        borderBottomColor:'#EBCBBC',
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
    flushFilterText :{
        fontSize : 10,
        color:'orange'
    },
    safetyColorYes : {
        color : '#8DDAD3'
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
import React, {StyleSheet,Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  	image: {
        flex:1
    },
    homeTitle : {
        color : '#003A57',
        fontSize :  windowWidth/17,
        fontWeight : 'bold',
    },
    componentsText : {
        fontSize :  12,
        fontWeight : 'bold',
        alignSelf : 'center'
    },
    componentsView : {
        justifyContent: 'center',
        // marginTop : 20,
        // marginBottom : 20
    },
    waterTitleView:{
    	marginBottom : 30
    },
    head: {

     	height: 56, backgroundColor: '#f1f8ff',color:'gray'
	},
  	text: 
  	{ 
  		padding:3,
  		margin: 6 ,textAlign: 'center',
  		fontSize : 12 
  	},
  	textHead: 
  	{ 
  		margin: 6 ,textAlign: 'center', 
  		color:'gray',
  		fontWeight : 'bold'
  	},
  	TableHeading :{
  		fontWeight : 'bold',
  		color:'black'
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
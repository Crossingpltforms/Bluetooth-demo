import React, {StyleSheet,Dimensions} from 'react-native';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
	container : 
	{
		flex:1,justifyContent:'center'
	},
	alignCenter : 
	{
		alignItems : 'center',
	},
	android_splash_view : 
	{
		flexDirection : 'column', alignItems:'center',height:'auto'
	},
	splash_app_text :
	{
		fontWeight : '400', fontSize:26,color:'#ffb300',marginLeft : 16
	}
})
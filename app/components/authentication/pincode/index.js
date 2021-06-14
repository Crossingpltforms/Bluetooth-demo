/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component,useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Modal,
    TouchableHighlight,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import {Container, Item, Input,Icon, Header,Button, Right, Left, Body} from 'native-base';
import styles from './style';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SearchableDropdown from 'react-native-searchable-dropdown';
import { cuntryListData } from '../../../includes/country';
import AsyncStorage from '@react-native-community/async-storage';
import {postApi} from '../../../includes/function';
const GLOBAL = require('../../../includes/Global');
import UserDetailsStore from '../../../store/user_details';
export default class Pincode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible : false,
            selectedItems: [],
            countryname : '',
            pincode :'',
            buttonTxt : "Submit",
            btnDisabled : false
        }
    }
    
    async onClickListener(val)
    {
        if(val=='submit'){
            const countryname = this.state.countryname.trim();
            const pincode = this.state.pincode.trim();
            // const countryname = "Spain";
            // const pincode = "12001";
            if(countryname==''){
                alert("Please select Country");
                return false;
            }
            else if(pincode==''){
                alert("Please enter Postcode");
                return false;   
            }
            else{
                this.setState({"buttonTxt" : "Sending.....",btnDisabled:true})    
                const json = {country:countryname,postcode:pincode}
                const res = await postApi("data_report_summery",json);
                if(res.status == "true"){
                    const USER_DETAILS = {
                        countryname: countryname,
                        pincode : pincode
                    }
                    try {
                        await AsyncStorage.mergeItem('@USER', JSON.stringify(USER_DETAILS));
                        try {
                        let currentUser = await AsyncStorage.getItem('@USER');
                        // currentUser  = JSON.parse(currentUser)
                        UserDetailsStore.changeDetails(JSON.parse(currentUser)); 
                        this.props.navigation.navigate('Intro_3');
                        } catch(e) {
                            console.log("Error in USER_DETAILS @USER asyncstorage",e);
                        }  
                    } catch(e) {
                        // console.log(JSON.stringify(e));
                        console.log("Error in USER_DETAILS asyncstorage",JSON.stringify(e));
                    }       
                }
                else if(res.status == "false"){
                    alert("Water report is not available for this postcode, Please try another postcode.");
                }
                else{
                    alert("something went wrong")  
                }
                this.setState({"buttonTxt" : "Submit",btnDisabled:false});    
            }
        }
    }
       
    storeData = async (value) => {
    }

    render() {
        return (
            <ScrollView 
                style={{backgroundColor : '#003A57'}}
                keyboardShouldPersistTaps = 'always'>
                <Container style={{flex:1}}>
                    <ImageBackground source={require("../../../assets/img/login-bg.png")} style={styles.image}>
                        <Modal            
                            animationType = {"fade"}  
                            transparent = {false}  
                            visible = {this.state.isVisible}  
                            onRequestClose = {() =>{ console.log("Modal has been closed.") } }>  
                            {/*All views of Modal*/}  
                               
                                <Header style={{backgroundColor:'white'}}>
                                    <Left>
                                        <Button transparent onPress ={()=>this.setState({isVisible:false})}>
                                            <Icon style={{color:'#8DDAD3'}} color='#8DDAD3' name='arrow-back' />
                                            <Text style={{marginLeft : 16,color:'#8DDAD3'}}>Country</Text>
                                        </Button>
                                    </Left>
                                    <Body></Body>
                                </Header>
                                <SearchableDropdown
                                    onItemSelect={(item) => {
                                        console.log(item)
                                        const items = this.state.selectedItems;
                                        items.push(item)
                                        this.setState({ selectedItems: items, countryname:item.name, isVisible:false});
                                    }}
                                    containerStyle={{ padding: 5, height : 900 }}
                                    onRemoveItem={(item, index) => {
                                        const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
                                        this.setState({ selectedItems: items });
                                    }}
                                    itemStyle={{
                                        padding: 10,
                                        marginTop: 2,
                                        backgroundColor: '#ddd',
                                        borderColor: '#bbb',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={{ maxHeight: '75%' }}
                                    items={cuntryListData}
                                    // defaultIndex={2}
                                    resetValue={false}
                                    textInputProps={
                                        {
                                            placeholder: "Search",
                                            underlineColorAndroid: "transparent",
                                            style: {
                                                padding: 12,
                                                borderWidth: 1,
                                                borderColor: '#ccc',
                                                borderRadius: 5,
                                            },
                                            onTextChange: text => console.log(text)
                                        }
                                    }
                                    listProps={
                                        {
                                        nestedScrollEnabled: true,
                                        }
                                    }
                                />
                        </Modal>  
                        
                       
                        <View style={styles.logo_view}>
                            <Image style={styles.logoimage} source={require("../../../assets/img/logo.png")}/>
                        </View>
                        
                        <View style={styles.loginform}>
                            <Item rounded style={styles.inputContainer} underline={false}>
                                <Icon name='ios-pin' />
                                <Input underlineColorAndroid="transparent" placeholder='Country' onChangeText={(countryname) => this.setState({ isVisible: true}) } 
                                    onFocus={ () => {this.setState({ isVisible: true}) }} value={this.state.countryname}
                                />
                            </Item>
                            <Item rounded style={styles.inputContainer} underline={false}>
                                <Icon name='ios-pin' />
                                <Input placeholder='Postcode' underlineColorAndroid="transparent"  onChangeText={(pincode) => this.setState({ pincode })}  placeholderStyle={{ borderColor: "white" }} value={this.state.pincode}
                                    keyboardType="number-pad" 
                                />
                            </Item>

                            <TouchableOpacity disabled={this.state.btnDisabled} style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('submit')}>
                                <Text style={styles.SubmitText}>{this.state.buttonTxt}</Text>
                            </TouchableOpacity>
                        </View>    
                    </ImageBackground>
                </Container>
                </ScrollView>
        );
    }
};


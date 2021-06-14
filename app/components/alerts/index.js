/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {Container,Text,Content, View, CardItem, Card, Body, Toast,Button} from 'native-base';
import {ImageBackground,RefreshControl,Modal,ActivityIndicator} from 'react-native';
import HeaderCustom from '../header';
import styles from './style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import {postApi,sendWarning,toastMessage} from '../../includes/function';
let currentUser;
let page=0;
export default class alerts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            data : [],
            loading:true,
            loadmoreicon:false
        };
    }

     UNSAFE_componentWillMount(){
        this.getSession();
    }

    async getSession(){
        this.setState({loading : true})
        try{
            currentUser = await AsyncStorage.getItem('@USER');
            currentUser  = JSON.parse(currentUser)
            this.fetchApi(currentUser.user_id,page);
        }
        catch(error){
            console.log("Something went wrong with alert AsyncStorage",error);
        }
    }

    async fetchApi(user_id){
        const json = {user_id:user_id,page:page};
        const res = await postApi("getWarnings",json);
        if(res.status == "true"){
            if(page>0){
                if(res.data.length<1){this.setState({loadmoreicon:false})}
                res.data.map((prop,key)=>{
                    this.state.data.push(prop);
                });
                this.setState({data:this.state.data});
            }
            else{
                this.setState({data:res.data});
                if(res.data.length>0){this.setState({loadmoreicon:true})}
                this.setState({loading:false});
            }
        }
        else{
            // console.log(res.message);
            toastMessage("Something went wrong please try again","bottom","warning");
            this.setState({loading:false})
            return false;
        }
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        page=0;
        this.getSession();
        this.setState({refreshing: false});
    }
    
    _renderWarnings(){
        return this.state.data.map((prop, key)=>{
            return(
                 <Card style={styles.cardStyle} key={key}>
                    <CardItem style={styles.carditem} header>
                        <Body>
                            <Text style={styles.cardTitle}>
                                {prop.notificationText}
                            </Text>
                            <Text style={styles.safeStatusText}>{prop.created_at}</Text>                                        
                        </Body>
                    </CardItem>
                </Card>
            )    
        })
    }

    loadMore(){
        page=page+1;
        this.fetchApi(currentUser.user_id,page);

    }
    
    render() {
        return (
            <Container>
                <HeaderCustom/>
                <View style={{height:3}}></View>
                <ImageBackground source={require("../../assets/img/home.png")} style={styles.image}>
                    <Content refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                        }
                    >
                        <Modal
                            transparent={true}
                            animationType={'none'}
                            visible={this.state.loading}
                            onRequestClose={() => {console.log('close modal')}}>
                            <View style={styles.modalBackground}>
                                <View style={styles.activityIndicatorWrapper}>
                                    <ActivityIndicator
                                    animating={this.state.loading} />
                                </View>
                            </View>
                        </Modal>
                        <View padder>
                            <Text style={styles.homeTitle}>Notifications</Text>
                        </View>
                        <View style={styles.row1}>
                            {this._renderWarnings()}
                        </View> 
                        {
                            this.state.loadmoreicon == true ? (
                                <View style={styles.row1}>
                                    <Button style={{textAlign:'center',justifyContent:'center'}} onPress={()=>this.loadMore()} transparent>
                                        <MaterialCommunityIcons name='reload' style={{alignSelf:'center'}} size={30} color="#8DDAD3" />
                                    </Button>
                                </View>
                            ) : (null)
                        }
                    </Content>
                </ImageBackground>
            </Container>          
        );
    }
};


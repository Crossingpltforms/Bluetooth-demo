/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {initializeManager} from '../header/ble_manager_cp_12aug';
import {ImageBackground, Image, Dimensions, RefreshControl, Modal,ActivityIndicator} from 'react-native';
import {BackHandler} from "react-native";
import {Container, Content, View, Text, Card, CardItem, Body,Left, Right, Toast,Button} from 'native-base';
import styles from './style';
import HeaderCustom from '../header';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const windowWidth = Dimensions.get('window').width;

import AsyncStorage from '@react-native-community/async-storage';
import {postApi,sendWarning,toastMessage,testWaringCards} from '../../includes/function';
import { observer } from "mobx-react"
import { observable, autorun } from "mobx";
import WqUnfilterStore from '../../store/wq_unfilter';
import UserDetailsStore from '../../store/user_details';
import Ble_store from '../../store/ble.js';
import RiskCalculation from '../risk/risk_calculation';
import moment from 'moment'; 
import Statstore from '../../store/stats';
@observer
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            lastFilterSession : '',
            inactivityDays : 0,
            loading:true
        };
    }
    
    componentDidMount() {
       BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
       if((Ble_store.deviceName == '') || (Ble_store.deviceName == 'Scanning...')) 
           {initializeManager()}
        this.dispose = autorun(() => {
            console.log("------Statstore.syncNew",Statstore.syncNew)
            if (Statstore.syncNew=='true') {//to reload stats when filter done new sync on cloud
                this.getSession();
            }
        });
    }
    handleBackButton(){
        BackHandler.exitApp();
    }

    UNSAFE_componentWillMount(){
        this.getSession();
    }

    async getSession(){//LAST_WATER_FLOW_SESSION
        this.setState({loading : true})
        try{
            await AsyncStorage.multiGet(['@USER','@LAST_WATER_FLOW_SESSION']).then((keys)=>{
                keys.map((prop,key)=>{
                    // console.log(prop[0])
                    // console.log(prop[1])
                    if(prop[0] == '@USER')
                    {
                        let currentUser  = JSON.parse(prop[1])
                        UserDetailsStore.userDetails = currentUser; 
                        this.fetchApi(currentUser.countryname,currentUser.pincode,currentUser.user_id);
                    }
                    else if(prop[0] == '@LAST_WATER_FLOW_SESSION'){
                        let  current_time = moment().format("YYYY-MM-DD HH:mm:ss");
                        const differenceInHours = moment(current_time).diff(moment(prop[1]), 'hours');
                        const differenceInDays = moment(current_time).diff(moment(prop[1]), 'days');
                        const differenceInMinutes = moment(current_time).diff(moment(prop[1]), 'minutes');
                        const differenceInSeconds = moment(current_time).diff(moment(prop[1]), 'seconds');
                        console.log(`${differenceInHours} hours have passed since last session of water flow`);
                        console.log(`${differenceInDays} days have passed since last session of water flow`);
                        console.log(`${differenceInMinutes} Minutes have passed since last session of water flow`);
                        console.log(`${differenceInSeconds} seconds have passed since last session of water flow`);

                        this.setState({inactivityDays:differenceInDays});
                        if(differenceInDays >= 3){
                            sendWarning(`The filter has not been used for ${differenceInDays} days. Please flush the filter for 15 seconds before use.`)
                        }
                        if(differenceInDays > 0){
                            this.setState({lastFilterSession : `Filter has not been used since ${differenceInDays} days`})
                        }
                        else if(differenceInHours > 0){
                            this.setState({lastFilterSession : `Filter has not been used since ${differenceInHours} hours`})
                        }
                        else if(differenceInMinutes > 0){
                            this.setState({lastFilterSession : `Last session time : ${differenceInMinutes} Minute before`})
                        }
                        else if(differenceInSeconds > 0){
                            this.setState({lastFilterSession : `Last session time : ${differenceInSeconds} Second before`})
                        }
                        else{
                            // this.setState({lastFilterSession : `Flush filter and sync data due to inactivity`})   
                        }
                    }
                })
            })
        }
        catch(error){
            console.log("Something went wrong with water AsyncStorage");
        }
    }

    async fetchApi(countryname,pincode,user_id){
        const json = {country:countryname,postcode:pincode}
        const res = await postApi("homeData",json);
        console.log("homedata response=>",res)

        if(res.status == "true"){
            WqUnfilterStore.changeTaste(res.data.taste);
            WqUnfilterStore.changeSafety(res.data.safety);
            WqUnfilterStore.changeLimescale(res.data.limescale);
            WqUnfilterStore.changeTds(res.data.tds);
            WqUnfilterStore.changeTemp(res.data.tempurature);
            WqUnfilterStore.getFilterDays();
            if(WqUnfilterStore.changeFilterDays > 30){sendWarning("Filter has been used up or expired. Change filter cartridge now");}
            if(WqUnfilterStore.unfilter_safety !="Safe" && WqUnfilterStore.unfilter_safety !="Yes"){sendWarning("Water is not safe to drink");}
            
            ////////////Start comment of Load last sync filter data
            START_DATE = moment().format("YYYY-MM-DD");
            END_DATE = moment(moment(START_DATE, "YYYY-MM-DD").add(1, 'days')).format("YYYY-MM-DD");//To add 1 days in current data
            const json1 = {user_token:user_id,"filterType" : "today","start_date":START_DATE,"end_date":END_DATE};
            const res1 = await postApi("getSensorData",json1);
            if(res1.total_fil_vol >= 300){sendWarning("Filter has been used up or expired. Change filter cartridge now");}
            Statstore.changeStatistics(res1);
            ////////////End comment of Load last sync filter data
            
            this.setState({loading:false})
        }
        else if(res.status == "false"){
            toastMessage(res.data,"bottom","warning");//data=error message from server
            this.setState({loading:false})
            return false;
            
        }
        else{
            toastMessage("Something went wrong","bottom","warning");
            this.setState({loading:false})
            return false;
        }
    }
    limescaleIcon(val){
        switch (val) {
        case 'Very high':
        return <Image source={require("../../assets/wqdbstats/limescale_very_high.png")} style={styles.statusImage}/>;
        case 'High':
        return <Image source={require("../../assets/wqdbstats/limescale_high.png")} style={styles.statusImage}/>;
        case 'Medium':
        return <Image source={require("../../assets/wqdbstats/limescale_medium.png")} style={styles.statusImage}/>;
        case 'Low':
        return <Image source={require("../../assets/wqdbstats/limescale_low.png")} style={styles.statusImage}/>;
        default:
        return null;
        }
    }
    tasteIcon(val){
        switch (val) {
        case 'bad':
        return <Image source={require("../../assets/wqdbstats/icon_taste_bad.png")} style={styles.statusImage}/>;
        case 'Ok':
        return <Image source={require("../../assets/wqdbstats/icon_taste_ok.png")} style={styles.statusImage}/>;
        case 'Good':
        return <Image source={require("../../assets/wqdbstats/icon_taste_good.png")} style={styles.statusImage}/>;
        default:
        return null;
        }
    }
    _onRefresh = () => {
        this.setState({refreshing: true});
        this.getSession();
        this.setState({refreshing: false});
    }

    componentWillUnmount() {
        this.dispose();
    }

    render() {
        return (
            <Container >
                {/*<Ble_manager/>*/}
                <HeaderCustom />
                <View style={{height:3}}></View>
                <ImageBackground source={require("../../assets/img/home.png")} style={styles.image}>
                    <Content  refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                          />
                        }>
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
                            <Text style={styles.homeTitle}>Your Tap Water</Text>
                        </View>
                        <View style={styles.row1}>
                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Safe
                                        </Text>
                                        <Text style={[styles.safeStatusText]}>{WqUnfilterStore.unfilter_safety}</Text>
                                        <IconMaterial name='verified-user' size={windowWidth/14} color={WqUnfilterStore.unfilter_safety == 'Safe' || WqUnfilterStore.unfilter_safety == 'Yes' ? 'green' : 'red'} style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>

                             <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Mineral Content (TDS)
                                        </Text>
                                        <Text style={styles.safeStatusText}>{WqUnfilterStore.unfilter_tds}</Text>
                                        <IconIonicons name='ios-water' size={windowWidth/14} color='#8DDAD3' style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>

                        <View style={styles.row1} padder>
                             <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Limescale
                                        </Text>
                                        <View style={{justifyContent : 'center',alignSelf:'center', alignItems : 'center',bottom:1, position:'absolute'}}>
                                        {this.limescaleIcon(WqUnfilterStore.unfilter_limescale)}
                                        
                                        </View>
                                    </Body>
                                </CardItem>
                            </Card>
                             <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Taste
                                        </Text>
                                        <View style={{justifyContent : 'center',alignSelf:'center', alignItems : 'center',bottom:1, position:'absolute'}}>
                                        {this.tasteIcon(WqUnfilterStore.unfilter_taste)}
                                        </View>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>

                        <View style={styles.row1} padder>
                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Days to change filter
                                        </Text>
                                        <Text style={styles.safeStatusText}>{(WqUnfilterStore.changeFilterDays) > 0 ? WqUnfilterStore.changeFilterDays : '-' }</Text>
                                        <IconFontAwesome5 name='calendar-alt' size={windowWidth/14} color='#003A57' style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>

                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            {this.state.lastFilterSession}
                                        </Text>
                                        {this.state.inactivityDays <3 ? ( null ) : (<Text style={[styles.safeStatusText,styles.flushFilterText]}>Flush filter for 20 seconds due to inactivity</Text>) }
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>
                         <View padder>
                            <Text style={styles.homeTitle}>Filter Water</Text>
                        </View>
                        <View style={styles.row1}>
                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Filtered Water
                                        </Text>
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.filter_volume}L</Text>
                                        <Entypo name='funnel' size={windowWidth/14} color='#003A57' style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>

                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Unfiltered Water
                                        </Text>
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.unfilter_volume}L</Text>
                                        <IconIonicons name='ios-funnel' size={windowWidth/14} color='#003A57' style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>

                        <View style={styles.row1} padder>
                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Mineral Content(TDS)
                                        </Text>
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.tds}</Text>
                                        <IconIonicons name='ios-water' size={windowWidth/14} color='#003A57' style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>

                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Temperature
                                        </Text>
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.temp}</Text>
                                        <IconFontAwesome5 name='temperature-high' size={windowWidth/14} color='#003A57' style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>

                        <View style={styles.row1} padder>
                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Battery status
                                        </Text>
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.battery}</Text>
                                        <Entypo name='battery' size={windowWidth/14} color='#003A57' style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>

                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Flow Rate
                                        </Text>
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.flowrate}</Text>
                                        <MaterialCommunityIcons name='water-pump' size={windowWidth/14} color='#003A57' style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>
                    </Content>
                    <RiskCalculation/>
                </ImageBackground>
            </Container>
        );
    }
};


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {ImageBackground, Image, Dimensions,RefreshControl, TouchableOpacity,Modal,ActivityIndicator} from 'react-native';
import {Container, Content, View, Text, Card, CardItem, Body,Left, Right, Button,ActionSheet,Toast} from 'native-base';
import styles from './style';
import HeaderCustom from '../header';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const windowWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-community/async-storage';
import { observer } from "mobx-react"
import { observable, autorun } from "mobx";
import WqUnfilterStore from '../../store/wq_unfilter';
import {postApi,sendWarning,toastMessage} from '../../includes/function';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment'; 
import Statstore from '../../store/stats';
var BUTTONS = ["Today", "Yesterday", "Last 7 days", "Last 30 days", "Custom dates", "Cancel"];
var CANCEL_INDEX = 5;
let currentUser='';
let START_DATE='';
let END_DATE='';
@observer
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            selectedStartDate: null,
            selectedEndDate: null,
            isVisible : false,
            calenderStatus : "Last 30 days",
            loading:true
        };
        this.onDateChange = this.onDateChange.bind(this);
    }
    
    componentDidMount() {
        this.dispose = autorun(() => {
            if (Statstore.syncNew=='true') {//to reload stats when filter done new sync on cloud
                this.getSession();
            }
        });
    }
    
    componentWillUnmount() {
        this.dispose();
    }
    
    _onRefresh = () => {
        this.setState({refreshing: true});
        this.getSession();
        this.setState({refreshing: false});
    }

    UNSAFE_componentWillMount(){
        this.getSession();
    }

    async getSession(){
        this.setState({loading : true})
        try{
            currentUser = await AsyncStorage.getItem('@USER');
            currentUser  = JSON.parse(currentUser)
            this.choosenDate(0);
        }
        catch(error){
            console.log("Something went wrong with calculssation AsyncStorage",error);
        }
    }

    async getData(user_id,filterType,START_DATE,END_DATE){
        this.setState({loading : true})

        if(user_id!='' && START_DATE!='' && END_DATE!='')
        {
            const json = {user_token:user_id,"filterType" : filterType,"start_date":START_DATE,"end_date":END_DATE};
            const res = await postApi("getSensorData",json);
            console.log("res getData=>", res);
            if(res.status=='true'){
                if(res.total_fil_vol >= 300){sendWarning("Filter has been used up or expired. Change filter cartridge now");}
                Statstore.changeStatistics(res);
                this.setState({loading : false});
            }
            else{
                console.log("server error found in getSensorData api");
                toastMessage("Something went wrong please try again","bottom","warning");
                this.setState({loading : false})
            }
            Statstore.changesyncNew("false");//set `true` for new data uploaded to cloud
        }
        else
        {
            toastMessage("Something went wrong please try again","bottom","warning");
            this.setState({loading : false});
            console.log(`one of these->user_id ${user_id},START_DATE ${START_DATE},END_DATE ${END_DATE} is missing`)
        }
    }

    choosenDate(index){
        let d = "";
        this.setState({selectedEndDate: null})
        if(index==0){
            d = "today";
            this.setState({calenderStatus:"Today"});
            START_DATE = moment().format("YYYY-MM-DD");
            END_DATE = moment(moment(START_DATE, "YYYY-MM-DD").add(1, 'days')).format("YYYY-MM-DD");//To add 1 days in current data
            console.log(d,"=> ",START_DATE, END_DATE )
            this.getData(currentUser.user_id,d,START_DATE,END_DATE);
        }
        else if(index==1){
            d = "yesterday";
            this.setState({calenderStatus:"Yesterday"});
            var today = moment().format("YYYY-MM-DD");
            var nd = moment(moment(today, "YYYY-MM-DD").subtract(1, 'days')).format("YYYY-MM-DD");//To minus 1 days from current data
            START_DATE = nd;
            END_DATE = today;
            console.log(d,"=> ",START_DATE, END_DATE )
            this.getData(currentUser.user_id,d,START_DATE,END_DATE);
        }
        else if(index==2){
            d = "last_seven_days";
            this.setState({calenderStatus:"Last 7 days"});
            var today = moment().format("YYYY-MM-DD");
            var nd = moment(moment(today, "YYYY-MM-DD").subtract(7, 'days')).format("YYYY-MM-DD");//To minus 7 days from current data
            START_DATE = nd;
            END_DATE = today;
            console.log(d,"=> ",START_DATE, END_DATE );
            this.getData(currentUser.user_id,d,START_DATE,END_DATE);
        }
        else if(index==3){
            d = "last_thirty_days";
            this.setState({calenderStatus:"Last 30 days"});
            var today = moment().format("YYYY-MM-DD");
            var nd = moment(moment(today, "YYYY-MM-DD").subtract(30, 'days')).format("YYYY-MM-DD");//To minus 30 days from current data
            START_DATE = nd;
            END_DATE = today;
            console.log(d,"=> ",START_DATE, END_DATE )
            this.getData(currentUser.user_id,d,START_DATE,END_DATE);
        }
        else if(index==4){
            d = "custom_dates";
            this.setState({calenderStatus:"Range"});
            // console.log(d,"=> ",this.state.selectedStartDate, this.state.selectedEndDate )
            this.setState({isVisible:true})
        }
    }
    
    onDateChange(date, type) {
        if (type === 'END_DATE') 
        {
            // this.setState({isVisible:false})
            this.setState({
                selectedEndDate: date,
            });
        } 
        else {
            this.setState({
                selectedStartDate: date,
                selectedEndDate: null,
            });
        }
    }

    submitDateRange(){
        this.getData(currentUser.user_id,"custom_dates",moment(this.state.selectedStartDate).format("YYYY-MM-DD"),moment(this.state.selectedEndDate).format("YYYY-MM-DD HH:mm:ss"));//in end date pass 23:59:59 to work data < current date 23 hr.
        this.setState({isVisible:false})
    }

    closeCalender(){
        this.setState({isVisible:false})
    }
    functionmae(){
        // alert(767)
    }

    render() {

        const { selectedStartDate, selectedEndDate } = this.state;
        return (
            <Container >
                <HeaderCustom/>
                <View style={{height:3}}></View>
                <ImageBackground source={require("../../assets/img/home.png")} style={styles.image}>
                    <Content 
                        refreshControl={
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
                        <Modal animationType = {"slide"}  onBackdropPress={()=>console.log("this.closeModal()")} onSwipeComplete={()=>console.log("this.closeModal()")} swipeDirection="right" transparent = {true} visible = {this.state.isVisible}>
                            {
                                this.state.isVisible == true ? (
                                    <View style={styles.modalView}
                                    >
                                        <View style={{backgroundColor:'#8DDAD3'}}>
                                            <Button iconRight block transparent light onPress={()=>this.closeCalender()}>
                                                <Text style={{position:'absolute',right:0,color:'black'}} >Close</Text>
                                            </Button>
                                        </View>

                                        <CalendarPicker height={500} width={Dimensions.get('window').width/1.1} allowRangeSelection={true} showDayStragglers={true} onDateChange={this.onDateChange} selectedDayColor="#24e600"
                                        />
                                        {
                                            this.state.selectedEndDate && this.state.selectedEndDate!= undefined ? (
                                            <View style={{backgroundColor:'#8DDAD3'}}><Button iconRight block transparent light onPress={()=>this.submitDateRange()}><Text style={{position:'absolute',right:0,color:'#1fc700',}} >Submit</Text></Button></View>
                                        ) : (null)}    


                                    </View>
                                ) : (null)
                            }     
                        </Modal>
                        
                        <View padder>
                            <Text style={styles.homeTitle}>Statistics</Text>
                        </View>
                         {Statstore.syncNew == true ? this.functionmae():this.functionmae}
                        <View style={styles.row2}>
                            <Card style={styles.cardStyle2}>
                                <TouchableOpacity onPress={() =>
                                    ActionSheet.show({
                                        options: BUTTONS,
                                        cancelButtonIndex: CANCEL_INDEX,
                                        title: ""
                                    },
                                    buttonIndex => {
                                        this.choosenDate(buttonIndex)
                                        console.log(buttonIndex)
                                        this.setState({ clicked: BUTTONS[buttonIndex] });
                                    }
                                )}>
                                    <CardItem style={styles.carditem2} >
                                        <Body>
                                            <Text style={styles.cardTitle}>
                                                {this.state.calenderStatus}
                                            </Text>
                                            {
                                                this.state.selectedEndDate && this.state.selectedEndDate!= undefined ? (
                                                    <Text style={[styles.cardTitle,{fontSize:8}]}>
                                                        {moment(this.state.selectedStartDate).format("DD/MM/YYYY")} - {moment(this.state.selectedEndDate).format("DD/MM/YYYY")}
                                                    </Text>
                                                    ) : (null)
                                            }
                                            <IconFontAwesome name='calendar' size={windowWidth/17} color='#003A57' style={styles.iconStyle}/>
                                        </Body>
                                    </CardItem>
                                </TouchableOpacity>
                            </Card>
                        </View>

                        <View style={styles.row1}>
                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Filtered Water
                                        </Text>
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.total_fil_vol}L</Text>
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
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.total_unfil_vol}L</Text>
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
                                            Bottle Saved
                                        </Text>
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.bottles_saved}</Text>
                                        <IconFontAwesome5 name='prescription-bottle' size={windowWidth/14} color='#003A57' style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>

                            <Card style={styles.cardStyle}>
                                <CardItem style={styles.carditem} header>
                                    <Body>
                                        <Text style={styles.cardTitle}>
                                            Money Saved
                                        </Text>
                                        <Text style={styles.safeStatusText}>{'\u20AC'} {Statstore.statistics.money_saved}</Text>
                                        <IconFontAwesome5 name='euro-sign' size={windowWidth/14} color='#003A57' style={styles.iconStyle}/>
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
                                        {/*<Text style={styles.safeStatusText}>{WqUnfilterStore.unfilter_tds}</Text>*/}
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.avg_tds}</Text>
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
                                        {/*<Text style={styles.safeStatusText}>{WqUnfilterStore.unfilter_temp}</Text>*/}
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.avg_temp}</Text>
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
                                        {/*<Text style={styles.safeStatusText}>{Statstore.statistics.flowrate}</Text>*/}
                                        <Text style={styles.safeStatusText}>{Statstore.statistics.avg_flow}</Text>
                                        <MaterialCommunityIcons name='water-pump' size={windowWidth/14} color='#003A57' style={styles.iconStyle}/>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>
                    </Content>    
                </ImageBackground>
            </Container>
        );
    }
};


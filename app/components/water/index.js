/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {Container,View,Text,Content, Button, Icon,Toast} from 'native-base';
import {ImageBackground,TouchableOpacity,RefreshControl,Modal,ActivityIndicator} from 'react-native';
import HeaderCustom from '../header';
import { Table, TableWrapper, Row, Cell, Rows } from 'react-native-table-component';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './style';
import {postApi,toastMessage} from '../../includes/function';

export default class Water extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            detailsView : false,
            tableHead: ['Substance', 'Unfiltered', 'Note', 'Filtered by TAPP'],
            ctableHead: ['Substance', 'unit', 'Before', 'Range limit', 'After'],
            tableData: [
            ],
            loading:true
        }
    }

    UNSAFE_componentWillMount(){
        this.getSession();
    }

    async getSession(){
        this.setState({loading : true})
        try{
            let currentUser = await AsyncStorage.getItem('@USER');
            currentUser  = JSON.parse(currentUser)
            this.fetchApi(currentUser.countryname,currentUser.pincode);
            // this.fetchApi(currentUser.countryname,"12001");
        }
        catch(error){
            console.log("Something went wrong with water AsyncStorage");
        }
    }

    async fetchApi(countryname,pincode){
        const json = {country:countryname,postcode:pincode}
        const res = await postApi("data_report_summery",json);
        if(res.status == "true"){
            this.setState(
            {
                tableData : res.Summery,
                water_safety:res.water_safety,general_arr:res.general_arr,pathogens:res.pathogens,chemical_parameter:res.chemical_parameter,minerals:res.minerals,metals:res.metals,chlorine_by_products:res.chlorine_by_products,haas:res.haas,pesticides:res.pesticides,herbicides:res.herbicides,perfluorinated_chemicals:res.perfluorinated_chemicals,other:res.other,pharmaceuticals:res.pharmaceuticals,
            });
            this.setState({loading : false});
        }
        else if(res.status == "false"){
            toastMessage("Something went wrong please try again","bottom","warning");
            this.setState({loading : false});
        }
        else{
            toastMessage("Something went wrong please try again","bottom","warning");
            this.setState({loading : false});
        }
    }   

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.getSession();
        this.setState({refreshing: false});
    }

    _renderDetailView(){
        return(
            <View>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.tableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.tableData} textStyle={styles.text}/>
                </Table>

                <Button transparent style={{alignSelf:'center'}} onPress={()=>this.setState({detailsView : !this.state.detailsView })}>
                    <Text>See all the 80 water components</Text>
                </Button>
            </View>
        );
    }
    _renderContaminentsView(){
        return(
            <View>
                <Button small style={{alignSelf : 'flex-end'}} transparent onPress={()=>this.setState({detailsView : !this.state.detailsView })}>
                    <Icon name="close"/>
                </Button>
                <Button small style={{backgroundColor : '#8DDAD3'}} onPress={()=>this.setState({detailsView : !this.state.detailsView })}>
                    <Text style={styles.TableHeading}>Water safety</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.water_safety} textStyle={styles.text}/>
                </Table>

                <Button small style={{backgroundColor : '#8DDAD3'}}>
                    <Text style={styles.TableHeading}>General</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.general_arr} textStyle={styles.text}/>
                </Table>
                
                <Button small style={{backgroundColor : '#8DDAD3'}}>
                    <Text style={styles.TableHeading}>Pathogens</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.pathogens} textStyle={styles.text}/>
                </Table>

                <Button small style={{backgroundColor : '#8DDAD3'}} >
                    <Text style={styles.TableHeading}>Chemical parameter</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.chemical_parameter} textStyle={styles.text}/>
                </Table>

                <Button small style={{backgroundColor : '#8DDAD3'}} >
                    <Text style={styles.TableHeading}>Minerals</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.minerals} textStyle={styles.text}/>
                </Table>

                <Button small style={{backgroundColor : '#8DDAD3'}}>
                    <Text style={styles.TableHeading}>Metals</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.metals} textStyle={styles.text}/>
                </Table>

                <Button small style={{backgroundColor : '#8DDAD3'}}>
                    <Text style={styles.TableHeading}>Chlorine by-products</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.chlorine_by_products} textStyle={styles.text}/>
                </Table>

                <Button small style={{backgroundColor : '#8DDAD3'}}>
                    <Text style={styles.TableHeading}>HAAs</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.haas} textStyle={styles.text}/>
                </Table>

                <Button small style={{backgroundColor : '#8DDAD3'}} onPress={()=>this.setState({detailsView : !this.state.detailsView })}>
                    <Text style={styles.TableHeading}>Pesticides</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.pesticides} textStyle={styles.text}/>
                </Table>

                <Button small style={{backgroundColor : '#8DDAD3'}}>
                    <Text style={styles.TableHeading}>Herbicides</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.herbicides} textStyle={styles.text}/>
                </Table>

                <Button small style={{backgroundColor : '#8DDAD3'}}>
                    <Text style={styles.TableHeading}>Perfluorinated chemicals</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.perfluorinated_chemicals} textStyle={styles.text}/>
                </Table>
                
                <Button small style={{backgroundColor : '#8DDAD3'}}>
                    <Text style={styles.TableHeading}>Other</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.other} textStyle={styles.text}/>
                </Table>

                <Button small style={{backgroundColor : '#8DDAD3'}}>
                    <Text style={styles.TableHeading}>Pharmaceuticals</Text>
                </Button>
                
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row data={this.state.ctableHead} style={styles.head} textStyle={styles.textHead}/>
                    <Rows data={this.state.pharmaceuticals} textStyle={styles.text}/>
                </Table>


            </View>
        );
    }
    render() {
        const state = this.state;
      
        return (
            <Container>
                <HeaderCustom/>
                <View style={{height:3}}></View>
                <ImageBackground source={require("../../assets/img/home.png")} style={styles.image}>
                    <Content padder style={{margiTop:3,}} refreshControl={
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
                        <View style={styles.waterTitleView}>
                            <Text style={styles.homeTitle}>What's in your water ? </Text>
                        </View>
                        {
                            this.state.detailsView == false ? (
                                this._renderDetailView()
                            ) : (
                                this._renderContaminentsView()
                            ) 
                        }
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
};


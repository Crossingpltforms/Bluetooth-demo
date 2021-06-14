/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {postApi} from '../../includes/function';
import RiskStore from '../../store/risk_param';
export default class Risk extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
        };
        
    }
    UNSAFE_componentWillMount(){
        this.getSession();
    }

    async getSession(){
        try{
            let currentUser = await AsyncStorage.getItem('@USER');
            currentUser  = JSON.parse(currentUser)
            this.fetchApi(currentUser.countryname,currentUser.pincode);
        }
        catch(error){
            console.log(error)
            console.log("Something went wrong with calculation AsyncStorage");
        }
    }

    async fetchApi(countryname,pincode){
        const json = {country:countryname,postcode:pincode}
        //default substances value to comapre with after filter
        const res = await postApi("riskCalculation",json);
        let defaultvalueObj={};
        if(res.status == "true"){
            let arrdata=res.result;
            if(res.result.length > 0){
                for(const i in arrdata){
                    defaultvalueObj[arrdata[i].Substance] = arrdata[i].Max;
                }
                RiskStore.changeDefalut=defaultvalueObj;
            }   
            else{
                console.log("Could not find Risk Param");
            }
        }
        else
        {
           console.log("Can not receive Risk params from cloud")
        }
        
        //after filter substances value to comapre with default values
        const summaryResult = await postApi("data_report_summery",json);
        if(summaryResult.status == "true"){
            const cp=summaryResult.chemical_parameter;
            const m=summaryResult.metals;
            const summaryobj = {};
            for(const x in cp){
                if(cp[x][0]=="Nitrates"){
                    summaryobj[cp[x][0]] = cp[x][4];
                    if(cp[x][4] > defaultvalueObj.Nitrates )
                    {
                        RiskStore.changeRisk(1);
                    }
                }
            }
            for(const x in m){
                if(m[x][0]=="Lead"){
                    summaryobj[m[x][0]] = m[x][4];
                    if(m[x][4] > defaultvalueObj.Lead )
                    {
                        RiskStore.changeRisk(1);
                    }
                }
                else if(m[x][0]=="Arsenic"){
                    // console.log(m[x][4],defaultvalueObj.Arsenic)
                    summaryobj[m[x][0]] = m[x][4];
                    if(m[x][4] > defaultvalueObj.Arsenic )
                    {
                        RiskStore.changeRisk(1);
                    }
                }
            }
            RiskStore.changeAfterFilter=summaryobj;
            // console.log("summaryobj=> ",summaryobj)
        }
        else{
             console.log("Something went wrong in risk calculation on data_report_summery")  
        }
    }

    
    render() {
        return (
            null
        );
    }
};


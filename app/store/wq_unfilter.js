import { observable,action } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment'; 
class UnfilterWaterSubstances{
    @observable unfilter_taste='';
    @observable unfilter_temp='';
    @observable unfilter_tds='';
    @observable unfilter_limescale='';
    @observable unfilter_safety='';
    @observable changeFilterDays='';
    @action
    changeTaste(value){
        this.unfilter_taste = value;
    }
    changeTemp(value){
        this.unfilter_temp = value;
    }
    changeTds(value){
        this.unfilter_tds = value;
    }
    changeLimescale(value){
        this.unfilter_limescale = value;
    }
    changeSafety(value){
        this.unfilter_safety = value;
    }
    async getFilterDays(d){
        console.log("getfilterday")
        try {
            const carRcvedDate = await AsyncStorage.getItem('carRcvedDate');
            console.log("carRcvedDate",carRcvedDate)//carRcvedDate 2020-07-17 format
            var nextMnumber = moment(carRcvedDate).add(1, 'month');//starts Month 0=jan Month 11=Dec
            var nextMformat =moment(nextMnumber).format("YYYY-MM-DD");
            var eventdate = moment(nextMformat);
            var todaysdate = moment();
            this.changeFilterDays = eventdate.diff(todaysdate, 'days');
        } catch(e) {
            console.log("error in get carRcvedDate asyncstorage");
        }
    }
    async changeFilter(currentMDateFormat,nextMDateFormat){
        console.log("changeFilter")//currentMDateFormat=> 2020-07-17 //nextMDateFormat=> 2020, 7, 17
        
        try {
            await AsyncStorage.setItem('carRcvedDate', currentMDateFormat);
            
        } catch(e) {
            console.log("error in set carRcvedDate asyncstorage");
        }
       // var t = moment([2020, 7, 17]).add(1, 'month');//starts Month 0=jan Month 11=Dec
        var nextMnumber = moment(currentMDateFormat).add(1, 'month');//starts Month 0=jan Month 11=Dec
        var nextMformat =moment(nextMnumber).format("YYYY-MM-DD");
        var eventdate = moment(nextMformat);
        var todaysdate = moment();
        this.changeFilterDays = eventdate.diff(todaysdate, 'days');
    }
}
export default new UnfilterWaterSubstances();
import { observable,action } from 'mobx';

class BleStore{
    @observable deviceName='';
    @observable deviceId='';
    @observable btColor='#003A57';
    @observable connectionStats=false;
    @observable device=null;//used for text app {full data/conf of connected device}
    @observable notificationData=[];//used for text app
    @action
    changeDevice(value){
        this.deviceName = value;
    }
    changeDeviceId(value){

        this.deviceId = value;
    }
    changeBTColor(value){
        this.btColor = value;
    }
    changeConnState(value){
        this.connectionStats = value;
    }
    changeDeviceData(value){//for test app
        this.device = value;
    }
    saveDeviceData(value){//for test app
        this.notificationData.push(value)
    }
    cleanDeviceData(value){//for test app
        console.log("------cleanData",value)
        this.notificationData=[]
    }
    resetBleStore(){
        this.deviceName = '';
        this.deviceId = '';
        this.btColor = "003A57";
        this.connectionStats = false;
    }
}
export default new BleStore();
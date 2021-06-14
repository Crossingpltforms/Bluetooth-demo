import { observable,action } from 'mobx';

class userDetails{
    @observable userDetails={};
    @action
    changeDetails(value){
        this.userDetails = value;
    }
    resetUserStore(){
    	this.userDetails = {};	
    }
}
export default new userDetails();
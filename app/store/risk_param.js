import { observable,action } from 'mobx';
//Not in used
class RiskStore{
    @observable defaultSubstanceValue={};
    @observable afterFilterSubstanceValue={};
    @observable riskValue=0;
    @action
    changeDefalut(value){
        this.defaultSubstanceValue = value;
    }
    changeAfterFilter(value){
        this.afterFilterSubstanceValue = value;
    }
    changeRisk(value){
    	this.riskValue = value;
    	console.log("risk=>",riskValue)
    }
}	
export default new RiskStore();
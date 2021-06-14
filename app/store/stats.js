import { observable,action } from 'mobx';

class StatsStore{
    @observable statistics={};
    @observable syncNew= "false";
    
    @action
    changeStatistics(value){
        this.statistics = value;
    }
    changesyncNew(value){
        this.syncNew = value;
    }
    
}
export default new StatsStore();
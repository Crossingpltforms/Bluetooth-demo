import React, { Component } from 'react';
import { Container, Header, Content, Input, Item, View, Text, Button } from 'native-base';
import {writeMesage} from './function'
import {toastMessage} from '../app/includes/function';
import BackgroundTimer from 'react-native-background-timer';
export default class RegularTextboxExample extends Component {
  constructor(props){
    console.log("page two props",props)
    super(props)
   
  }

  onpresschange=(page)=>{
    let i = 1;
    
    const intervalId = BackgroundTimer.setInterval(() => {
      // console.log("page.",page)
      // this will be executed every 200 ms
      // even when app is the the background
      if(i==1){
            writeMesage("ACK")
            i++;
      }
      else if(i==2){
        writeMesage("CAL 1 2 "+this.props.stateval.d1)
        i++;
      }
      else if(i==3){
        writeMesage("CAL 2 1 "+this.props.stateval.d2)
        BackgroundTimer.clearTimeout(intervalId);
        // this.props.callbackfun(page);
        this.props.callbackfun({page:page,d1:this.props.stateval.d1,d2:this.props.stateval.d2, d3:this.props.stateval.d3});
        i++;
      }

   }, 1000);
  }

  render() {
    return (
      <Container style={{flex:1, justifyContent : 'center'}}>
        <View style={{marginLeft : 20}}>
              <><View style={{flexDirection : 'row', alignItems : 'center'}}>
            <Item regular style={{width : 100}}>
              <Input placeholder='Data 1' keyboardType={"numeric"} maxLength={3} value={this.props.stateval.d1} editable={false}/>
            </Item>
            <Text style={{left:20}}>Reference temp value</Text>
          </View>  
          <View style={{flexDirection : 'row', alignItems : 'center'}}>
            <Item regular style={{width : 100}}>
              <Input placeholder='Data 2' keyboardType={"numeric"} maxLength={3}  value={this.props.stateval.d2}  editable={false}/>
            </Item>
            <Text style={{left:20}}>Reference low TDS value</Text>
          </View>  
          <View style={{flexDirection : 'row', alignItems : 'center'}}>
            <Item regular style={{width : 100}}>
              <Input placeholder='Data 2' keyboardType={"numeric"} maxLength={3}  value={this.props.stateval.d3}  editable={false}/>
            </Item>
            <Text style={{left:20}}>Reference high TDS value</Text>
          </View>  
          

          <Button bordered style={{alignSelf : 'center', marginTop:20}} onPress={()=>this.onpresschange("three")}>
            <Text>Calib</Text>
          </Button></>
 
        </View>   
      </Container>
    );
  }
}
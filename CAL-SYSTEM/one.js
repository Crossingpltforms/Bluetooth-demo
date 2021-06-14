import React, { Component } from 'react';
import { Container, Header, Content, Input, Item, View, Text, Button } from 'native-base';
import {writeMesage,cleanData} from './function'
import {toastMessage} from '../app/includes/function';
import BackgroundTimer from 'react-native-background-timer';
export default class RegularTextboxExample extends Component {
  constructor(props){
    console.log("page one props",props)
    super(props)
    this.state = {
      screennumber : 'one',
      d1 : "",
      d2 : "",
      d3 : "",
      
    }
  }

   onpresschange=(page)=>{
    if(this.state.d2.trim().length < 1 || this.state.d2.trim().length < 1 || this.state.d3.trim().length < 1){
      alert("enter a valid number")
    }
    else{
      this.props.callbackfun({page:page,d1:this.state.d1,d2:this.state.d2, d3:this.state.d3});  
    }
    
  }

  render() {
    return (
      <Container style={{flex:1, justifyContent : 'center'}}>
        <View style={{marginLeft : 20}}>
        
         
              <><View style={{flexDirection : 'row', alignItems : 'center'}}>
            <Item regular style={{width : 100}}>
              <Input placeholder='Data 1' keyboardType={"numeric"} maxLength={3} onChangeText={(value)=>this.setState({d1:value})} value={this.state.d1}/>
            </Item>
            <Text style={{left:20}}>Reference temp value </Text>
          </View>  
          <View style={{flexDirection : 'row', alignItems : 'center'}}>
            <Item regular style={{width : 100}}>
              <Input placeholder='Data 2' keyboardType={"numeric"} maxLength={3} onChangeText={(value)=>this.setState({d2:value})}  value={this.state.d2}/>
            </Item>
            <Text style={{left:20}}>Reference low TDS value</Text>
          </View>  
          <View style={{flexDirection : 'row', alignItems : 'center'}}>
            <Item regular style={{width : 100}}>
              <Input placeholder='Data 3'  keyboardType={"numeric"} maxLength={3} onChangeText={(value)=>this.setState({d3:value})}  value={this.state.d3}/>
            </Item>
            <Text style={{left:20}}>Reference high TDS value</Text>
          </View> 

          <Button bordered style={{alignSelf : 'center', marginTop:20}} onPress={()=>this.onpresschange("two")}>
            <Text>Next</Text>
          </Button></>
 
        </View>   
      </Container>
    );
  }
}
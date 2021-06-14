import React, { Component } from 'react';
import { Container, Header, Content, Input, Item, View, Text, Button } from 'native-base';
import {writeMesage} from './function'
import {toastMessage} from '../app/includes/function';
export default class RegularTextboxExample extends Component {
  constructor(props){
    console.log("page three props",props)
    super(props)
    
  }

   onpresschange=(page)=>{
      // console.log("page.",page)
      this.props.callbackfun({page:page,d1:this.props.stateval.d1,d2:this.props.stateval.d2, d3:this.props.stateval.d3});
  }

  render() {
    return (
      <Container style={{flex:1, justifyContent : 'center'}}>
        <View style={{marginLeft : 20}}>
        
         
              <><View style={{flexDirection : 'row', alignItems : 'center',justifyContent : 'center'}}>
            
            <Text style={{alignSelf : 'center'}}>SYSTEM CALIBRATED!</Text>
          </View>  
         
          

          <Button bordered success style={{alignSelf : 'center', marginTop:20}} onPress={()=>this.onpresschange("repeat")}>
            <Text>BACK</Text>
          </Button></>
 
        </View>   
      </Container>
    );
  }
}
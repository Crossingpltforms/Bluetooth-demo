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
      console.log("page.",page, "CAL 2 2 "+this.props.stateval.d3)
        writeMesage("CAL 2 2 "+this.props.stateval.d3)
        this.props.callbackfun({page:page,d1:this.props.stateval.d1,d2:this.props.stateval.d2, d3:this.props.stateval.d3});
  }

  render() {
    return (
      <Container style={{flex:1, justifyContent : 'center'}}>
        <View style={{marginLeft : 20}}>
        
         
              <><View style={{flexDirection : 'row', alignItems : 'center'}}>
            <Item regular style={{width : 100}}>
              <Input placeholder='Data 3' keyboardType={"numeric"} maxLength={3} value={this.props.stateval.d3}  editable={false}/>
            </Item>
            <Text style={{left:20}}>Reference high TDS value</Text>
          </View>  
         
          

          <Button bordered style={{alignSelf : 'center', marginTop:20}} onPress={()=>this.onpresschange("finish")}>
            <Text>Finish</Text>
          </Button></>
 
        </View>   
      </Container>
    );
  }
}
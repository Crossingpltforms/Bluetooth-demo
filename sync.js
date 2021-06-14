import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, Left, Right, Body, Title,Card, CardItem, Icon } from 'native-base';
import {fetchApi} from './app/includes/function';
export default class sync extends Component {
  constructor(props){
    super(props);
    // console.log(this.props.route.params.deviceid);
    this.state={deviceid : this.props.route.params.deviceid,listData : []}
    // this.state={deviceid : "D0:CE:24:9F:9B:EF", listData : []}
  }
  
  async UNSAFE_componentWillMount(){
        let data = {"deviceId":this.state.deviceid};
        var requestBody = JSON.stringify(data);
        let response = await fetchApi(requestBody,"getSensorData");
        console.log(response)
        if(response.errors){
            console.log("error",response.message)    
        }
        else{
            console.log("success",response)    
            this.setState({"listData":response})
        }
    
  }
  lapsList() {
 
  this.state.listData.map((data) => {
    return (
      <View><Text>{data.time}</Text></View>
    );
  })
 
}
    render() {
        // const lapsList = this.state.listData.map((data) => {
        //     return (
        //       <CardItem>
        //                     <Icon active name="logo-googleplus" />
        //                     <Text>Google Plus</Text>
        //                     <Right>
        //                         <Icon name="arrow-forward" />
        //                     </Right>
        //                 </CardItem>
        //     )
        //   })
        // const { navigate } = this.props.navigation.goBack;
        return (
            <Container>
                <Header>
                    <Left></Left>
                    <Body>
                        <Title></Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => {
                        this.props.navigation.goBack()}}>
                        <Text>Back</Text>
                        </Button>
                    </Right>
                </Header>
                <Content>
                {this.state.listData.map((d, index) => (
                    <Card>
                        <CardItem>
                          <Text>
                          FIL : {d.fil}{'\n'}
                          TDS : {d.tds}{'\n'}
                          TMP : {d.temp}{'\n'}
                          FLO : {d.flo}{'\n'}
                          TIM : {d.tim}{'\n'}
                          VOL : {d.vol}{'\n'}
                          BAT : {d.bat}{'\n'}
                          MEM : {d.mem}</Text>
                         </CardItem>
                    </Card> ))}
                </Content>
            </Container>
    );
  }
}
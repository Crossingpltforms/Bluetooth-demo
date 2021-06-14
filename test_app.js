import React, { Component } from 'react';
import Index from './CAL-SYSTEM/index_text_app'
import IndexOne from './CAL-SYSTEM/one'
import IndexTwo from './CAL-SYSTEM/two'
import IndexThree from './CAL-SYSTEM/three'
import Finish from './CAL-SYSTEM/finish'
import {initializeManager} from './CAL-SYSTEM/function'
export default class FooterTabsIconTextExample extends Component {
    constructor(props) {

        super(props)
        initializeManager()
        this.state = {
            page : "zero", //device name
            stateval : null
            
        }
    }
    callbackfun=(stateval)=>{
        this.setState({page: stateval.page,stateval:stateval},()=>console.log(this.state))
    }
    render() {
         

        return (
            <>
             {(() => {
                switch(this.state.page) {
                  case 'zero':
                      return <Index callbackfun={this.callbackfun} />
                    break;
                case 'one':
                      return <IndexOne callbackfun={this.callbackfun}  />
                    break;
                case 'two':
                      return <IndexTwo callbackfun={this.callbackfun} stateval={this.state.stateval}/>
                    break;
                case 'three':
                      return <IndexThree callbackfun={this.callbackfun}  stateval={this.state.stateval}/>
                    break;
                case 'finish':
                      return <Finish  callbackfun={this.callbackfun}  stateval={this.state.stateval}/>
                    break;
                case 'repeat':
                      return <Index callbackfun={this.callbackfun} />
                    break;

                 
                  default :
                    break  
                }
            })()}
            </>
            
        );
    }
}
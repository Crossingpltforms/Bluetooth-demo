/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';

import { observer } from "mobx-react"
import WqUnfilterStore from '../../store/wq_unfilter';

@observer
export default class Home extends Component {
    constructor(props) {
        super(props);
        alert(WqUnfilterStore);
        this.state = {
         
        };
        
    }
    
    

    render() {
        return (
            null
        );
    }
};


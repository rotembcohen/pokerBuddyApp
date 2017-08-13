import React, { Component } from 'react';
import { AsyncStorage,Text,View,StatusBar } from 'react-native';

import * as utils from '../UtilFunctions';

export default class WelcomeView extends Component{
    
    static navigationOptions = {
        title: 'pocAt v0.1'
    }

    constructor(props){
        super(props);
        const { navigation } = props;
        this.state = {
        };
        const currentToken = AsyncStorage.multiGet(['@pokerBuddy:token','@pokerBuddy:user'])
        .then((data)=>{
            if (data && data[0][1]!== null && data[1][1] != null){
                utils.resetToScreen(navigation,"HomeView",{token:data[0][1],user:JSON.parse(data[1][1])});
            }else{
                utils.resetToScreen(navigation,"LoginView");
            }
        })
        .catch((error)=>{
            console.log("getExistingToken error",error);
            navigation.navigate("LoginView");
        });
    }

    render(){
        return (<View><StatusBar hidden={true} /><Text>Welcome!</Text></View>);
    }
}

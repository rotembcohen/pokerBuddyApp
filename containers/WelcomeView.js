import React, { Component } from 'react';
import { AsyncStorage,Text,View } from 'react-native';

export default class WelcomeView extends Component{
    
    constructor(props){
        super(props);
        const { navigation } = props;
        this.state = {
        };
        const currentToken = AsyncStorage.multiGet(['@pokerBuddy:token','@pokerBuddy:user'])
        .then((data)=>{
            if (data && data[0][1]!== null && data[1][1] != null){
                navigation.navigate("HomeView",{token:data[0][1],user:JSON.parse(data[1][1])});
            }else{
                navigation.navigate("LoginView");
            }
        })
        .catch((error)=>{
            console.log("getExistingToken error",error);
            navigation.navigate("LoginView");
        });
    }

    render(){
        return (<View><Text>Welcome!</Text></View>);
    }
}

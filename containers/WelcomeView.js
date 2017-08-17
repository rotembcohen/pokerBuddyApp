import React, { Component } from 'react';
import { AsyncStorage,Text,View,StatusBar } from 'react-native';

import * as utils from '../UtilFunctions';
import styles from '../Styles';

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
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <Text style={styles.textHeader}>Welcome to POC<Text style={{color:'red'}}>A</Text>T!</Text>
            </View>
        );
    }
}

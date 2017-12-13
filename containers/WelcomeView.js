import React, { Component } from 'react';
import { AsyncStorage,Text,View,Image,TouchableOpacity } from 'react-native';

import { ASSET_APP_LOGO } from 'react-native-dotenv';

import * as utils from '../UtilFunctions';
import styles from '../Styles';
import TipsDatabase from '../components/TipsDatabase';
import StatusBar from '../components/StatusBar';

export default class WelcomeView extends Component{
    
    constructor(props){
        super(props);
        const randInt = Math.floor(Math.random() * TipsDatabase.length)
        this.state = {
            navigation: props.navigation,
            haventSkipped: true,
            randInt: randInt
        }
    }

    render(){
        navigation = this.state.navigation;
        return (
            <View style={styles.welcome_container}>
                {/*Headers*/}
                <StatusBar/>
                
                {/*Logo with onload=redirect in 5 seconds*/}
                <Image source={{uri:ASSET_APP_LOGO}} style={styles.welcome_logoImage} onLoad={async ()=>{
                    await utils.timeout(5000);
                    if (this.state.haventSkipped){
                        utils.RedirectToGame(navigation);
                    }
                }}/> 

                {/*Tip Text with skip button*/}
                <Text style={styles.welcome_tipText}>{TipsDatabase[this.state.randInt]}</Text>
                <TouchableOpacity
                    style={styles.welcome_button}
                    onPress={()=> {
                        this.setState({haventSkipped:false});
                        utils.RedirectToGame(navigation);
                    }}
                >
                    <Text style={styles.welcome_buttonText}>SKIP</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

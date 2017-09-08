import React, { Component } from 'react';
import { AsyncStorage,Text,View,StatusBar,Image,Linking, TouchableOpacity } from 'react-native';

import * as utils from '../UtilFunctions';
import styles from '../Styles';
import TipsDatabase from '../components/TipsDatabase';
import { ASSET_APP_LOGO } from 'react-native-dotenv';

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

    //TODO: is there any way to put this only on one view???
    componentDidMount() {
        Linking.addEventListener('url', this._handleOpenUrl.bind(this));
        Linking.getInitialURL().then(this.parseUrl).catch(err => console.error('An error occurred', err));
    }

    _handleOpenUrl(event){
        utils.parseUrl(event.url);
        utils.RedirectToGame(navigation);
    }

    render(){
        navigation = this.state.navigation;
        return (
            <View style={styles.welcome_container}>
                {/*Headers*/}
                <StatusBar hidden={true} />
                
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

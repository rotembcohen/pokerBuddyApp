import React, { Component } from 'react';
import { AsyncStorage,Text,View,StatusBar,Image,Linking } from 'react-native';

import * as utils from '../UtilFunctions';
import styles from '../Styles';

export default class WelcomeView extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            navigation: props.navigation
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
            <View style={[styles.container,{backgroundColor:"#BC0000"}]}>
                <StatusBar hidden={true} />
                <Image source={{uri:'https://s3.amazonaws.com/pokerbuddy/images/pocat_logo.png'}} style={{width:200,height:200}} onLoad={()=>utils.RedirectToGame(navigation)}/> 
                <Text style={[styles.textHeader,{color:'white'}]}>POCAT v1.0</Text>
            </View>
        );
    }
}

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

    renderOddsTip(){
        tipsArray = [
            "The chance of one of your cards making a pair on the flop is about a third",
            "By the river, your chances of making a pair go up to roughly a half",
            "Don't play any two cards just because they're suited. It only improves your hand by 2.5%",
            "If you've got one card short of a full flush after the flop, you'll make your hand a third of the time",
            "The probability of flopping two-pair (from non-paired hole cards) is about 2%"
        ];
        randInt = Math.floor(Math.random() * tipsArray.length);
        return tipsArray[randInt];
    }

    render(){
        navigation = this.state.navigation;
        return (
            <View style={[styles.container,{backgroundColor:"#BC0000"}]}>
                <StatusBar hidden={true} />
                <Image source={{uri:'https://s3.amazonaws.com/pokerbuddy/images/pocat_logo.png'}} style={{width:200,height:200}} onLoad={()=>utils.RedirectToGame(navigation)}/> 
                <Text style={[styles.textHeader,{color:'white'}]}>POCAT v1.0</Text>
                <Text style={[styles.textSubheader,{color:'white',fontStyle:'italic',marginTop:20}]}>{this.renderOddsTip()}</Text>
            </View>
        );
    }
}

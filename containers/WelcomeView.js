import React, { Component } from 'react';
import { AsyncStorage,Text,View,StatusBar,Image } from 'react-native';

import * as utils from '../UtilFunctions';
import styles from '../Styles';

export default class WelcomeView extends Component{
    
    static navigationOptions = {
        title: 'POCAT v0.2'
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async RedirectToGame(navigation){
        
        const data = await AsyncStorage.multiGet(['@pokerBuddy:token','@pokerBuddy:user','@pokerBuddy:currentGame'])

        await this.timeout(2000);

        console.log("game ident:",data[2][1]);

        if (data && data[0][1]!== null && data[1][1] != null && data[2][1] != null){
            token = data[0][1];
            user = JSON.parse(data[1][1]);
            game_identifier = data[2][1];
            game = await utils.joinGame(game_identifier,token,user);
            utils.resetToScreen(navigation,"GameView",{game: game,user: user,token:token});
        }else if (data && data[0][1]!== null && data[1][1] != null){
            utils.resetToScreen(navigation,"HomeView",{token:data[0][1],user:JSON.parse(data[1][1])});
        }else{
            utils.resetToScreen(navigation,"LoginView");
        }
        //TODO: error handling
    }

    render(){
        const { navigation } = this.props;
        return (
            <View style={[styles.container,{backgroundColor:"#BC0000"}]}>
                <StatusBar hidden={true} />
                <Image source={{uri:'https://s3.amazonaws.com/pokerbuddy/images/pocat_logo.png'}} style={{width:200,height:200}} onLoad={()=>this.RedirectToGame(navigation)}/> 
                <Text style={[styles.textHeader,{color:'white'}]}>POCAT v0.2</Text>
            </View>
        );
    }
}

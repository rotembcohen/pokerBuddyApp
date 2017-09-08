import React, { Component } from 'react';
import { AsyncStorage,Text,View,StatusBar,Image,Linking, TouchableOpacity } from 'react-native';

import * as utils from '../UtilFunctions';
import styles from '../Styles';
import TipsDatabase from '../components/TipsDatabase';

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
            <View style={[styles.container,{backgroundColor:"#BC0000"}]}>
                {/*Headers*/}
                <StatusBar hidden={true} />
                
                {/*Logo with onload=redirect in 5 seconds*/}
                <Image source={{uri:'https://s3.amazonaws.com/pokerbuddy/images/pocat_logo.png'}} style={{width:200,height:200}} onLoad={async ()=>{
                    await utils.timeout(5000);
                    if (this.state.haventSkipped){
                        utils.RedirectToGame(navigation);
                    }
                }}/> 

                {/*Tip Text with skip button*/}
                <Text style={[styles.textSubheader,{color:'white',fontStyle:'italic',margin:40}]}>{TipsDatabase[this.state.randInt]}</Text>
                <TouchableOpacity
                    style={{flexDirection:'row',padding:5,borderWidth:0,borderRadius:12,backgroundColor:'white', justifyContent:'center',alignItems:'center'}}
                    onPress={()=> {
                        this.setState({haventSkipped:false});
                        utils.RedirectToGame(navigation);
                    }}
                >
                    <Text style={[styles.textSubheader,{margin:10,fontWeight:'bold'}]}>SKIP</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

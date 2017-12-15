import React, { Component } from 'react';
import { View, Text, Linking, Platform, Dimensions, } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';
import IconButton from '../components/IconButton';
import { APP_VERSION } from 'react-native-dotenv';
import { Constants } from 'expo';

export default class AboutModal extends Component {
	
	render() {
		
		let {width, height} = Dimensions.get('window');
		let devText = null;
		
		if (__DEV__){
			devText = (<Text>	Device: <Text style={styles.boldText}>{(Platform.OS==='android' ? Constants.deviceName : Constants.platform.ios.model)}</Text>{"\n"}
								Dimensions: <Text style={styles.boldText}>{Math.floor(height) + "/" + Math.floor(width)}</Text></Text>);
		}

		let donateButton = (this.props.donateButton) ? <IconButton action={this.props.onDonate} name="ios-cash-outline" text="Donate" style={{marginRight:50}}/> : null;
		
		return (
			<View style={styles.modalContent}>
				<Text>Version: <Text style={styles.boldText}>{APP_VERSION}</Text></Text>
				<Text>Developer: <Text style={styles.boldText}>Rotem Cohen</Text></Text>
				{devText}
				<Text style={styles.home_boldLink} onPress={
					()=>Linking.openURL('mailto:hecodesthings@gmail.com?subject=Pocat v'+APP_VERSION)
				}>hecodesthings@gmail.com</Text>
				
				<Text style={{marginTop:10,textAlign:'center'}}>
					<Text style={styles.boldText}>Pocat</Text> makes it easy and fun to play casual poker with friends.{"\n\n"}
					Easily manage buy-ins, cashing out and who needs to pay who.{"\n\n"}
					This app should be used at your own risk and only where casual gambling is legal.{"\n\n"}
				</Text>
				
				<View style={styles.game_modals_aboutButtonsContainer}>
	      			{donateButton}
	      			<IconButton action={this.props.onClose} name="ios-close-circle-outline" text="Close" />
		        </View>

			</View>
		);
	}


}
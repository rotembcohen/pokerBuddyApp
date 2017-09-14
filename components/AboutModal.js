import React, { Component } from 'react';
import { View, Text, Linking } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';
import IconButton from '../components/IconButton';
import { APP_VERSION } from 'react-native-dotenv';

export default class AboutModal extends Component {

	render() {
		let donateButton = (this.props.donateButton) ? <IconButton action={this.props.onDonate} name="ios-cash-outline" text="Donate" style={{marginRight:50}}/> : null;
		return (
			<View style={styles.modalContent}>
				<Text>Version: <Text style={styles.boldText}>{APP_VERSION}</Text></Text>
				<Text>Developer: <Text style={styles.boldText}>Rotem Cohen</Text></Text>
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
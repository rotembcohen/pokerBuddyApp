import React, { Component } from 'react';
import { View, Text, Linking, Platform, Dimensions, } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';
import IconButton from '../components/IconButton';
import ModalWindow from '../components/ModalWindow';
import { APP_VERSION } from 'react-native-dotenv';
import { Constants } from 'expo';

export default class AboutModal extends Component {
	
	render() {
		
		let {width, height} = Dimensions.get('window');
		let devText = null;
		
		if (__DEV__){
			devText = (<Text>	Device: <Text style={styles.boldText}>{(Platform.OS==='android' ? Constants.deviceName : Constants.platform.ios.model)}</Text>{"\n"}
								Dimensions: <Text style={styles.boldText}>{Math.floor(height) + "/" + Math.floor(width)}</Text>{"\n\n"}</Text>);
		}

		let content = (
			<View>
				<Text style={styles.regularText}>
					{devText}
					Developer: <Text style={styles.boldText}>Rotem Cohen</Text>{"\n"}
					<Text style={styles.home_boldLink} onPress={
						()=>Linking.openURL('mailto:hecodesthings@gmail.com?subject=Pocat v'+APP_VERSION)
					}>hecodesthings@gmail.com</Text>
				</Text>
				<Text style={[styles.regularText,{marginTop:10,textAlign:'center'}]}>
					<Text style={styles.boldText}>Pocat</Text> makes it easy and fun to play casual poker with friends.{"\n\n"}
					Easily manage buy-ins, cashing out and who needs to pay who.{"\n\n"}
					This app should be used at your own risk and only where casual gambling is legal.{"\n\n"}
				</Text>
			</View>
		);

		return (
    		<ModalWindow
	      		title={"Pocat v" + APP_VERSION}
	      		onDismiss={this.props.onClose}
	      		content={content}
      		/>
		);
	}


}
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button,
} from 'react-native';

import styles from '../Styles';

export default class PayView extends Component {

	constructor(props){
		super(props);
		this.state = {
		};
	}
	
	render() {
		const { navigation } = this.props;
	    return (
	      <View style={styles.container}>
	        <Button title='Pay!' onPress={()=>{}} />
	      </View>
	    );
	}

}


/*
var url = "venmo://paycharge?txn=pay&recipients=Azriel-Fuchs&amount=30&note=poker";
			Linking.canOpenURL(url).then(supported => {
			  if (!supported) {
			    console.log('Can\'t handle url: ' + url);
			  } else {
			    return Linking.openURL(url);
			  }
			}).catch(err => console.error('An error occurred', err));
			*/
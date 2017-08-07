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



import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button,
} from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


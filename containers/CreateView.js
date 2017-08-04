import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button,
} from 'react-native';

export default class CreateView extends Component {

	constructor(props){
		super(props);
		this.state = {
		};
	}

	
	render() {
		const { navigation } = this.props;
	    return (
	      <View style={styles.container}>
	        <Button title='Create!' onPress={()=>{navigation.navigate('GameView')}} />
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


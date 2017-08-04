import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button,
} from 'react-native';

export default class HomeView extends Component {

	constructor(props){
		super(props);
		this.state = {
		};
	}

	
	render() {
		const { navigation } = this.props;
	    return (
	      <View style={styles.container}>
	        <Button title='Create Game' onPress={()=>{navigation.navigate('CreateView')}} />
	        <Button title='Join Game' onPress={()=>{navigation.navigate('GameView')}} />
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


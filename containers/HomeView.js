import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, TextInput,
} from 'react-native';

import styles from '../Styles';

export default class HomeView extends Component {

	constructor(props){
		super(props);
		this.state = {
			game_identifier: '',
		};
	}
	
	render() {
		const { navigation } = this.props;
	    return (
	      <View style={styles.container}>
	      	<Button title='Create Game' onPress={()=>{navigation.navigate('CreateGameView')}} />
	      	<Text>Game Address: </Text>
	      	<TextInput
	      		style={styles.textinput}
	      		onChangeText={(text)=>{this.setState({game_identifier:text})}}
	      		value={this.state.game_identifier}
      		/>
	        <Button title='Join Game' onPress={()=>{navigation.navigate('GameView')}} />
	      </View>
	    );
	}

}


import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button,
} from 'react-native';

export default class GameView extends Component {

	constructor(props){
		super(props);
		this.state = {
			playerList: [
				{key: 'rotem'},
				{key: 'azriel'}
			],
		};
	}

	renderItem = ({player}) => {<Text>Player name: {player.name}</Text>}

	render() {
		const { navigation } = this.props;
	    return (
	      <ScrollView contentContainerStyle={styles.container}>
	        <Text>Players List:</Text>
	        <FlatList
	            data={this.state.playerList}
	            renderItem={({item}) => <Text>BI LG {item.key}</Text>}
	        />
	        <Button title='Buy In' onPress={()=>{}} />
	        <Button title='Leave Game' onPress={()=>{navigation.navigate('PayView')}} />
	      </ScrollView>
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


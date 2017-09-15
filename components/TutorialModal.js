import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles, { app_red, app_pink, app_grey } from '../Styles';
import * as utils from '../UtilFunctions';
import IconButton from '../components/IconButton';

class ProgressCircle extends Component {
	
	render () {
		return (
			<View style={[styles.progressCircle,{backgroundColor:this.props.color}]} />
		);
	}

}

class TutorialModal extends Component {

	constructor(props){
		super(props);
		this.state = {
			index: 0,
			numScreens: props.content.length,
		}
	}

	renderProgress (){
		let progBar = [];
		for (let i = 0; i < this.state.numScreens ; i++){
			let color = (i === this.state.index) ? app_red : app_pink;
			let progPoint = <ProgressCircle color={color} key={i} />;
			progBar.push(progPoint);
		}
		return (
			<View style={[styles.row,{margin:5}]}>
				{progBar}
			</View>
		);
	}

	render() {
		var backColor = (this.state.index === 0) ? app_grey : null;
		var nextColor = (this.state.index === (this.state.numScreens - 1)) ? app_grey : null;
		var title = "Tutorial (" + (this.state.index+1) + "/"+this.state.numScreens+")"
		return (
			<View style={styles.modalContent}>

				<Text style={[styles.textHeader,{margin:5}]}>{title}</Text>
				<Text style={[styles.regularText,{margin:5,height:200}]}>
					{this.props.content[this.state.index]}
				</Text>
				{this.renderProgress()}
				<View style={[styles.row,{margin:5}]}>
					<Ionicons name={(this.props.checkmarkValue ? 'ios-checkmark-circle-outline' : 'ios-close-circle-outline')} size={20} color={app_red} onPress={this.props.onCheckmark} />
					<TouchableOpacity onPress={this.props.onCheckmark}>
						<Text style={{marginLeft:5}}>Show this every time</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.modalButtonsContainer}>
					<IconButton action={()=>{
						if (this.state.index > 0){
							this.setState({index:this.state.index - 1});
						}
					}} name="ios-arrow-dropleft" text="Back" color={backColor} />
					<IconButton action={this.props.onClose} name="ios-close-circle-outline" text="Close" />
					<IconButton action={()=>{
						if (this.state.index < this.state.numScreens - 1){
							this.setState({index:this.state.index + 1});
						}
					}} name="ios-arrow-dropright" text="Forward" color={nextColor} />
				</View>
			</View>
		);
	}


}



export {TutorialModal as default, ProgressCircle};
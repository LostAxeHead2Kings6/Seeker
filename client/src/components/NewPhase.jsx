import React, { Component } from 'react'
import {Header, Icon, Button} from 'semantic-ui-react'

//add a new column to the Progress Board

export default class NewPhase extends Component {
	constructor(props){
		super(props)
	}
	render(){
		return(
			<div className='newphase'>
				<div className='PhaseTitle' id="title">
					<Header
					  className="phasetitle"
					  textAlign="center"
					  block
					  inverted
					  size="large">Add New Phase
				  </Header>
				</div>
				<Button
				   fluid
				   textAlign="center"
				   onClick={this.props.createPhase}>
				     <Icon size="small" name='plus'/>
				</Button>
			</div>
        )
	}
}

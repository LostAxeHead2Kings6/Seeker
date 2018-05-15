import React, { Component } from 'react'
import {Header, Card, Icon} from 'semantic-ui-react'
import DescriptionCard2 from './details modal/DetailsModal2.jsx'
import moment from 'moment'

//Every Column on the Progress Board

export default class Phase extends Component {
	constructor(props){
		super(props)

		this.clickHandler = this.clickHandler.bind(this)
    this.keepSwitchOff = this.keepSwitchOff.bind(this)
	}

	clickHandler(){
		this.props.selectPhase(this.props.phase)
		this.props.toggle()
	}

	keepSwitchOff() {
		this.setState({searchLogicSwitch: false})
	}

	render(){
		return(
			<div className='phase' id={this.props.phase.id}>
			<div className='PhaseTitle' id="title">
			<Header
			  className="phasetitle"
			  textAlign="center"
			  block
			  inverted
			  size="large">{this.props.phase.phase_label}
				<Icon
				  className="headericon"
				  name="ellipsis vertical"
				  textAlign="right"
				  onClick={this.clickHandler}/>
				  <Header.Subheader>
				  	{
				  		this.props.applications.length === 1
				  		? `1  Job`
				  		: `${this.props.applications.length} Jobs`
				  	}
				  </Header.Subheader>
				  </Header>
			</div>
			{
		      this.props.applications.map((app,i) =>  {
		      	return <div id={app.id} key={i}>
							<Card
			      	  className="AppItem"
			      	  header={
									<DescriptionCard2
										getUserData={this.props.getUserData}
										key={i}
										keepSwitch={this.keepSwitchOff}
										app={app}
										phase={this.props.phase}
										contact={this.props.contacts.filter((contact) => contact.id === app.point_of_contact)[0]}
										reminder={this.props.reminders.filter((reminder) => reminder.id === app.reminder_id)[0]}
										email={this.props.email}
										notes={this.props.notes.filter((note)=> note.app_id === app.id)}
										resume={this.props.files.filter((file)=> file.id === app.resume_id)[0]}
										coverletter={this.props.files.filter((file)=> file.id === app.cover_letter_id)[0]}
										description={app.job_title}
										files={this.props.files}
									/>
								}
			      	  description={app.job_title}
			      	  meta={`Last Update: ${moment(app.last_update).format('MM/DD')}`}/>
				      </div>
				    })
					}
		    </div>
        )
	}
}

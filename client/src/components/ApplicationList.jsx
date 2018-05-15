import React from 'react';
import { Menu, Table, Input, Button, Form, Dropdown } from 'semantic-ui-react';
import DescriptionCard from './details modal/DetailsModal.jsx';
import axios from 'axios';

export default class ApplicationList extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			showModal: false,
			featuredItem: null,
			apps: [...props.apps],
			searchTerm: '',
			searchField: '',
			searchLogicSwitch: false
		}

      this.arrangeByJobTitle = this.arrangeByJobTitle.bind(this);
      this.arrangeByCompany = this.arrangeByCompany.bind(this);
      this.arrangeByStatus = this.arrangeByStatus.bind(this);
      this.arrangeByResume = this.arrangeByResume.bind(this);
	  	this.arrangeByCoverLetter = this.arrangeByCoverLetter.bind(this);
      this.arrangeByDateCreated = this.arrangeByDateCreated.bind(this);
      this.arrangeByLastUpdate = this.arrangeByLastUpdate.bind(this);
	  	this.searchList = this.searchList.bind(this);
      this.render = this.render.bind(this);
	  	this.viewAll = this.viewAll.bind(this);
      this.keepSwitchOff = this.keepSwitchOff.bind(this);
  }


	componentDidUpdate() {
		if (this.state.searchLogicSwitch) {
		}
		else if (this.props.apps !== this.state.apps) {
			this.setState({apps: this.props.apps});
		}
	}

	arrangeByStatus() {
	  this.setState({applications: this.props.apps.sort(dynamicSort("phase_id"))});
	}

	arrangeByResume() {
		this.setState({applications: this.props.apps.sort(dynamicSort("resume_id"))});
	}

	arrangeByCoverLetter() {
	  this.setState({applications: this.props.apps.sort(dynamicSort("cover_letter_id"))});
	}

	arrangeByJobTitle() {
      this.setState({applications: this.props.apps.sort(dynamicSort("job_title"))});
	}

  arrangeByCompany() {
      this.setState({applications: this.props.apps.sort(dynamicSort("company"))});
  }

  arrangeByDateCreated() {
    var arrangedArray = this.props.apps.sort(function(a, b) {
      let date1 = new Date(a.date_created);
      let date2 = new Date(b.date_created);
      return date1.getTime() > date2.getTime() ? -1 : date1.getTime() < date2.getTime() ? 1 : 0;
    });
    this.setState({applications: arrangedArray});
  }

  arrangeByLastUpdate() {
    var arrangedArray = this.props.apps.sort(function(a, b) {
      let date1 = new Date(a.date_applied);
      let date2 = new Date(b.date_applied);
      return date1.getTime() > date2.getTime() ? -1 : date1.getTime() < date2.getTime() ? 1 : 0;
    });
    this.setState({applications: arrangedArray});
  }

	searchList() {
		var searchField = this.state.searchField;
		var searchTerm = this.state.searchTerm;
		if (searchField === 'company' || searchField === 'job_title') {
			var arrangedArray = this.props.apps.filter((application) => application[searchField].toLowerCase() == searchTerm.toLowerCase());
		} else if (searchField === 'cover_letter_id' || searchField === 'resume_id') {
			var foundFile = this.props.files.filter((file) => file.file_name.toLowerCase() == searchTerm.toLowerCase());
			var arrangedArray = this.props.apps.filter((application) => application[searchField] == foundFile[0].id);
		}
		this.setState({apps: arrangedArray, searchTerm: '', searchLogicSwitch: true});
	}

	viewAll() {
		this.setState({apps: this.props.apps, searchLogicSwitch: false})
	}

	keepSwitchOff() {
		this.setState({searchLogicSwitch: false})
	}

	render() {
		return(
			<div>
				<Menu secondary attached="top">
					<Menu.Item className="applist-search" position="center">
						<Input placeholder="Search..." value={this.state.searchTerm} onChange={(event) => this.setState({searchTerm: event.target.value})}/>
						<Form.Select placeholder="Select" options={searchOptions} onChange={(e, { value })=>this.setState({searchField: value})}/>
						<Button className="applist-button" onClick={this.searchList}>Search</Button>
						<Button className="applist-button view-all-btn" onClick={this.viewAll}>View All</Button>
					</Menu.Item>
				</Menu>
        <Table className="applicationListTable">
          <Table.Header className="applicationListHeaders">
            <Table.Row>
              <Table.HeaderCell onClick={this.arrangeByJobTitle}>Job Title</Table.HeaderCell>
              <Table.HeaderCell onClick={this.arrangeByCompany}>Company</Table.HeaderCell>
              <Table.HeaderCell onClick={this.arrangeByDateCreated}>Date Created</Table.HeaderCell>
              <Table.HeaderCell onClick={this.arrangeByLastUpdate}>Last Activity</Table.HeaderCell>
              <Table.HeaderCell onClick={this.arrangeByStatus}>Status</Table.HeaderCell>
              <Table.HeaderCell onClick={this.arrangeByResume}>Resume Used</Table.HeaderCell>
              <Table.HeaderCell onClick={this.arrangeByCoverLetter}>Cover Letter Used</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className="applicationListBody">
            {this.state.apps.map((app, i) => (
              <DescriptionCard
								keepSwitch={this.keepSwitchOff}
                key={i}
                index={i}
                app={app}
								userId={this.props.userId}
                phase={this.props.phases.filter((phase) => phase.id === app.phase_id)[0]}
								resume={this.props.files.filter((file) => file.id === app.resume_id)[0]}
								contact={this.props.contacts.filter((contact) => contact.id === app.point_of_contact)[0]}
								reminder={this.props.reminders.filter((reminder) => reminder.id === app.reminder_id)[0]}
                coverletter={this.props.files.filter((file) => file.id === app.cover_letter_id)[0]}
								email={this.props.email}
								notes={this.props.notes.filter((note) => note.app_id === app.id)}
								getUserData={this.props.getUserData}
								files={this.props.files}
							/>
						))}
          </Table.Body>
        </Table>
			</div>
		)
	}
}

function dynamicSort(property) {
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result;
  }
}

const searchOptions = [
	{text: 'Id', value: 'id'},
	{text: 'Company', value: 'company'},
	{text: 'Job Title', value: 'job_title'},
	{text: 'Resume', value: 'resume_id'},
	{text: 'Cover Letter', value: 'cover_letter_id'},
]

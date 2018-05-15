import React from 'react';
import { Button, Menu, Header, Image, Icon, Modal, Form } from 'semantic-ui-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';

//This is the form for entering a new application

class AppModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      jobTitle: '',
      companyName: '',
      phase: '',
      contact: '',
      resume: null,
      coverLetter: null,
      firstName: '',
      lastName: '',
      contactPhone: '',
      contactEmail: '',
      title: '',
      department: '',
      date: moment(),
      reminderText: '',
      modalOpen: false
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOpen() {
    this.setState({ modalOpen: true }, this.props.toggle);
  }

  handleClose() {
    this.setState({
      jobTitle: '',
      companyName: '',
      phase: '',
      contact: '',
      resume: null,
      coverLetter: null,
      firstName: '',
      lastName: '',
      contactPhone: '',
      contactEmail: '',
      title: '',
      department: '',
      date: moment(),
      reminderText: '',
      modalOpen: false
    })
    this.props.getUserData()
  }

  handleChange(date) {
    this.setState({
      date: date
    })
  }

  handleSubmit() {
    if (this.state.jobTitle && this.state.companyName && this.state.phase) {
      axios.post('/applications', {
        phaseId: this.state.phase,
        reminderId: null,
        resumeId: this.state.resume,
        coverLetterId: this.state.coverLetter,
        jobTitle: this.state.jobTitle,
        company: this.state.companyName,
        date: new Date()})
      .then((response) => {
        if ((this.state.date && this.state.reminderText) && (this.state.firstName || this.state.lastName || this.state.contactEmail || this.state.contactPhone || this.state.contactJobTitle || this.state.department)) {
          this.postReminder(response.data)
          this.postContact(response.data)
        } else if (this.state.date && this.state.reminderText) {
          this.postReminder(response.data)
        } else if (this.state.firstName || this.state.lastName || this.state.contactEmail || this.state.contactPhone || this.state.contactJobTitle || this.state.department) {
          this.postContact(response.data)
        } else {
          this.handleClose()
        }
      })
      .catch((err) => console.error(err));
    } else {
      alert('You must input at least a job title, company name and phase in order to submit an application.')
    }
  }

  postReminder(appId) {
    if (!this.props.email) {
      axios.post('/calendar', {
        date: `${this.state.date._d.getFullYear()}-${this.state.date._d.getMonth()+1}-${this.state.date._d.getDate()}`,
        description: this.state.reminderText,
        company: this.state.companyName,
        job_title: this.state.jobTitle
      })
      .catch((err) => console.error(err))
    }
    axios.post('/reminders', {
      date: this.state.date,
      description: this.state.reminderText,
      email: this.props.email,
      company: this.state.companyName,
      jobTitle: this.state.jobTitle,
      userId: this.props.userId,
      appId: appId
    })
    .then((response) => {
      axios.post('/appinfo/reminder', {
        id: appId,
        reminderId: response.data
      })
      .then((response) => {
        this.handleClose()
      })
      .catch((err) => console.error(err))
    })
    .catch((err) => console.error(err))
  }

  postContact(appId) {
    if (!this.props.email) {
      axios.post('/people', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        contactPhone: this.state.contactPhone,
        contactEmail: this.state.contactEmail,
        company: this.state.companyName,
        title: this.state.title,
        department: this.state.department
      })
      .catch((err) => console.error(err))
    }
    axios.post('/contacts', {
      appId: appId,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      contactPhone: this.state.contactPhone,
      contactEmail: this.state.contactEmail,
      company: this.state.companyName,
      title: this.state.title,
      department: this.state.department
    })
    .then((response) => {
      axios.post('/appinfo/contact', {
        id: appId,
        contact: response.data
      })
      .then((response) => {
        this.handleClose()
      })
      .catch((err) => console.error(err))
    })
    .catch((err) => console.error(err))
  }

  render() {
    var resumeOptions = [{text: 'N/A', value: null, key: null}].concat(this.props.files.map(function(ele, i) { return {text: ele.file_name, value: ele.id, key: i}}));
    var coverLetterOptions = [{text: 'N/A', value: null, key: null}].concat(this.props.files.map(function(ele, i) { return {text: ele.file_name, value: ele.id, key: i}}));

    return (
      <Modal
        trigger={
        <Menu.Item onClick={this.handleOpen}>
          <Icon name='wordpress forms' />New App
        </Menu.Item>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon={true}
        size='small'
      >
        <Header icon='wordpress forms' content='Enter Your Latest Job Application' />
        <Modal.Content >
          <Form>
            <h1>Job Details</h1>
            <Form.Group widths='equal'>
              <Form.Input fluid label='Job Title' placeholder='Job Title' value={this.state.jobTitle} onChange={(event) => this.setState({jobTitle: event.target.value})}/>
              <Form.Input fluid label='Company Name' placeholder='Company Name' value={this.state.companyName} onChange={(event) => this.setState({companyName: event.target.value})}/>
              <Form.Select fluid label='Phase' options={this.props.phases.map(function(ele) { return {text: ele.phase_label, value: ele.id}})} placeholder='Status' value= {this.state.phase} onChange={(e, { value })=>this.setState({phase: value})}/>
            </Form.Group>
            <h3>Documents (optional)</h3>
            <Form.Group widths='equal'>
              <Form.Select fluid label='Resume Used' options={resumeOptions} placeholder='Resume' value= {this.state.resume} onChange={(e, { value })=>this.setState({resume: value})}/>
              <Form.Select fluid label='Cover Letter Used' options={coverLetterOptions} placeholder='Cover Letter' value={this.state.coverletter} onChange={(e, { value })=>this.setState({coverLetter: value})}/>
            </Form.Group>
            <h3>Point of Contact (optional)</h3>
            <Form.Group widths='equal'>
              <Form.Input fluid label='First Name' placeholder='First Name' value={this.state.firstName} onChange={(event) => this.setState({firstName: event.target.value})}/>
              <Form.Input fluid label='Last Name' placeholder='Last Name' value={this.state.lastName} onChange={(event) => this.setState({lastName: event.target.value})}/>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input fluid label='Phone #' placeholder='Phone #' value={this.state.contactPhone} onChange={(event) => this.setState({contactPhone: event.target.value})}/>
              <Form.Input fluid label='Email' placeholder='Email' value={this.state.contactEmail} onChange={(event) => this.setState({contactEmail: event.target.value})}/>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input fluid label='Title' placeholder='Title' value={this.state.title} onChange={(event) => this.setState({title: event.target.value})}/>
              <Form.Input fluid label='Department' placeholder='Department' value={this.state.department} onChange={(event) => this.setState({department: event.target.value})}/>
            </Form.Group>
            <h3>Reminder (optional)</h3>
            <Form.Group widths='equal'>
              <DatePicker as={Form.Input}
                selected={this.state.date}
                onChange={this.handleChange}
                placeholderText="Choose a date"
              />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input fluid label='Reminder Text' placeholder='Reminder Text' value={this.state.reminderText} onChange={(event) => this.setState({reminderText: event.target.value})}/>
            </Form.Group>
          <Button onClick={() => {this.handleSubmit()}}>Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

export default AppModal;

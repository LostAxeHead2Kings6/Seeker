import React from 'react';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { Button, Form } from 'semantic-ui-react';

let pubKey = 'BKn9Z71eyV2fgYztoT3XDC31ANF3HLmKuXKmkQR9OoMw-9trIi4JguYx-Y5kJ0xLddXlJTrPWmpnWcA5ebFHRfY';

class Reminder extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      saving: false,
      date: this.props.reminder ? moment(this.props.reminder.due_date) : moment(),
      reminderText: this.props.reminder ? this.props.reminder.text_desc : ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.sendReminder = this.sendReminder.bind(this);
    this.askPermission = this.askPermission.bind(this);
    this.urlB64ToUint8Array = this.urlB64ToUint8Array.bind(this);
    this.subscribeUser = this.subscribeUser.bind(this);
    this.sendSubscriptionToServer = this.sendSubscriptionToServer.bind(this);
  }

  componentWillMount(){
    if(Notification.permission === 'default') this.askPermission()
  }

  handleChange(date) {
    this.setState({
      date: date
    })
  }

  handleSubmit() {
    this.setState({saving: true})
    setTimeout(() => this.setState({saving: false}), 2000)
    this.props.getUserData()
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  subscribeUser() {
   navigator.serviceWorker.ready.then((reg) => {
    let subscribeParams = { userVisibleOnly: true };
    //Setting the public key of our VAPID key pair.
    let applicationServerKey = this.urlB64ToUint8Array(pubKey);
    subscribeParams.applicationServerKey = applicationServerKey;
    reg.pushManager.subscribe(subscribeParams)
        .then((subscription) => {
            // Update status to subscribe current user on server, and to let
            // other users know this user has subscribed
            let endpoint = subscription.endpoint;
            let key = subscription.getKey('p256dh');
            let auth = subscription.getKey('auth');
            let encodedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
            let encodedAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));

            const subscripObject = {
              endpoint: endpoint,
              keys: {
                "p256dh": encodedKey,
                "auth": encodedAuth
              }

            }
            this.sendSubscriptionToServer(subscripObject)
        })
        .catch((err) => {
          // A problem occurred with the subscription.
          console.error(err)
        });
    });

  }

  sendSubscriptionToServer(subscription) {
    axios.post('/saveSubscription', {
      data: JSON.stringify(subscription)
    })
    .catch((err) => console.error(err))
  }

  askPermission() {
  return new Promise( (resolve, reject) => {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) permissionResult.then(resolve, reject);

  })
  .then( (permissionResult) => {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    } else {
      this.subscribeUser()
    }
  });
}

  sendReminder() {
    if (!this.props.email) {
      axios.post('/calendar', {
        date: `${this.state.date._d.getFullYear()}-${this.state.date._d.getMonth()+1}-${this.state.date._d.getDate()}`,
        description: this.state.reminderText,
        company: this.props.app.company,
        job_title: this.props.app.job_title
      })
      .catch((err) => console.error(err))
    }
    axios.delete('/reminders', {
      params: {
        appId: this.props.app.id
      }
    })
    .then((response) => {
      axios.post('/reminders', {
        date: this.state.date,
        description: this.state.reminderText,
        email: this.props.email,
        company: this.props.app.company,
        jobTitle: this.props.app.job_title,
        userId: this.props.userId,
        appId: this.props.app.id
      })
      .then((response) => {
        axios.post('/appinfo/reminder', {
          id: this.props.app.id,
          reminderId: response.data
        })
        .then((response) => {
          this.handleSubmit()
        })
        .catch((err) => console.error(err))
      })
      .catch((err) => console.error(err))
    })
    .catch((err) => console.error(err))
  }

  render() {
    return (
      <Form>
        <h2>Add a Reminder</h2>
        <DatePicker
          selected={this.state.date}
          onChange={this.handleChange}
          placeholderText="Choose a date"
        />
        <br/>
        <Form.Input fluid label="Reminder Text" placeholder="Reminder Text" value={this.state.reminderText} onChange={(event) => this.setState({reminderText: event.target.value})}></Form.Input>
        <Button onClick={this.sendReminder}>Submit</Button>
        {this.state.saving ? <div style={{display:"inline"}}>Saving...</div> : <div></div>}
      </Form>
    )
  }
}
export default Reminder

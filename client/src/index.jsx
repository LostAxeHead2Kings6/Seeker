import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom'
import { Sidebar, Segment, Button, Menu, Image, Icon, Header, Modal, Loader } from 'semantic-ui-react'
import ProgressBoard from './components/ProgressBoard.jsx'
import Metrics from './components/Metrics.jsx'
import ApplicationList from './components/ApplicationList.jsx'
import Welcome from './components/Welcome.jsx'
import AppModal from './components/AppModal.jsx'
import DocModal from './components/DocModal.jsx'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      loading: false,
  		menuVisible: false,
      userId: null,
      phases: [],
      applications: [],
      reminders: [],
      contacts: [],
      files: [],
      notes: [],
      userEmail: null,
      test: false
  	}

  	this.toggleMenu = this.toggleMenu.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.decorateAppList = this.decorateAppList.bind(this);
    this.decorateDataVis = this.decorateDataVis.bind(this);
    this.decorateProgressBoard = this.decorateProgressBoard.bind(this);
    this.logout = this.logout.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.createPhase = this.createPhase.bind(this);
    this.deletePhase = this.deletePhase.bind(this);
    this.registerServiceWorker = this.registerServiceWorker.bind(this)
    this.updatePhaseOrder = this.updatePhaseOrder.bind(this)
    this.modalClose = this.modalClose.bind(this)
    this.fetchData = this.fetchData.bind(this)
  }

  registerServiceWorker() {
    return navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      return registration;
    })
    .catch((err) => {
      console.error('Unable to register service worker.', err);
    });
  }

  componentDidMount() {
    this.registerServiceWorker()
    axios.get('/session')
    .then((response) => this.setState({userId: response.data}, this.getUserData))
    .catch((err) => console.error(err))
  }

  toggleMenu() {
  	this.setState({
  		menuVisible: !this.state.menuVisible
  	})
  }

  signup(userEmail, password) {
    event.preventDefault()
    if(userEmail !== ''  && password !== ''){
      axios.post('/users', {userEmail: userEmail, password: password})
      .then((response) => {
        this.setState({userId: response.data, userEmail: userEmail})
        this.getUserData()
      })
      .catch((err)=> alert("Invalid email or password"))
      }
  }

  login(userEmail, password) {
    event.preventDefault()
    if(userEmail !== '' && password !== ''){
    axios.get('/users', {params: {userEmail: userEmail, password: password}})
    .then((response) => {
      this.setState({userId: response.data, userEmail: userEmail})
      this.getUserData()
    })
    .catch((err) => alert("Invalid email or password"))
    }
  }

  logout() {
    this.setState({userId: null}, () => {
      axios.post('/logout')
      .catch((err) => console.error(err))
    })
  }

  getUserData() {
    this.setState({loading: true}, () => {
      Promise.all([
        axios.get('/phases'),
        axios.get('/applications'),
        axios.get('/reminders'),
        axios.get('/contacts'),
        axios.get('/files'),
        axios.get('/notes')
      ])
      .then((response) => {
        this.setState({
          phases: response[0].data,
          applications: response[1].data,
          reminders: response[2].data,
          contacts: response[3].data,
          files: response[4].data,
          notes: response[5].data,
          loading: false
        })
      })
      .catch((err) => {
        console.error(err)
        this.setState({loading: false})
      })
    })
  }

  fetchData() {
    Promise.all([
      axios.get('/phases'),
      axios.get('/applications'),
      axios.get('/reminders'),
      axios.get('/contacts'),
      axios.get('/files'),
      axios.get('/notes')
    ])
    .then((response) => {
      this.setState({
        phases: response[0].data,
        applications: response[1].data,
        reminders: response[2].data,
        contacts: response[3].data,
        files: response[4].data,
        notes: response[5].data
      })
    })
    .catch((err) => console.error(err))
  }

  updateStatus(status) {
    axios.post('/updateStatus', status)
    .then((response) => {
      this.fetchData();
    })
    .catch((err) => console.error(err))
  }

  createPhase() {
    let phaseName = prompt('Enter a name for your new phase')
    axios.post('/phases', {
      userId: this.state.userId,
      phaseLabel: phaseName,
      phaseOrder: this.state.phases.length + 1
    })
    .then((done) => {
      this.getUserData()
    })
  }

  deletePhase(phaseId, phaseIndex) {
    if (this.state.applications.filter((app) => app.phase_id === phaseId).length > 0) {
      alert('You must move all applications out of this phase before deleting it.')
    } else if (this.state.phases.length === 1) {
      alert('You must have at least one phase')
    } else if (confirm('Are you sure you want to delete this phase?')) {
      let phases = this.state.phases
      phases.splice(phaseIndex, 1)
      axios.delete('/phases', {
        params: {
          phaseId: phaseId
        }
      })
      .then((response) => {
        this.updatePhaseOrder(phases)
      })
      .catch((err) => console.error(err))
    }
  }

  updatePhaseOrder(newPhaseOrder){
    axios.post('/order', { phases: newPhaseOrder })
    .then((done) => this.getUserData())
    .catch((err) => console.error(err))
  }

  decorateProgressBoard() {
    return <ProgressBoard
      email={this.state.userEmail}
      notes={this.state.notes}
      phases={this.state.phases}
      apps={this.state.applications}
      reminders={this.state.reminders}
      contacts={this.state.contacts}
      files={this.state.files}
      getUserData={this.getUserData}
      updateStatus={this.updateStatus}
      createPhase={this.createPhase}
      deletePhase={this.deletePhase}
      updatePhaseOrder={this.updatePhaseOrder}
    />
  }

  decorateDataVis() {
    return <Metrics
      phases={this.state.phases}
      apps={this.state.applications}
      reminders={this.state.reminders}
      files={this.state.files}
    />
  }

  decorateAppList() {
    return <ApplicationList
      phases={this.state.phases}
      apps={this.state.applications}
      reminders={this.state.reminders}
      contacts={this.state.contacts}
      files={this.state.files}
      email={this.state.userEmail}
      userId={this.state.userId}
      notes={this.state.notes}
      getUserData={this.getUserData}
    />
  }

  modalClose() {
    this.setState({ loading: false })
  }

  render () {
    if (this.state.userId) {
      return(
        <Router history={history}>
          <div className="app-container">
            <Menu secondary attached="top">
              <Menu.Item onClick={this.toggleMenu}>
              <Icon name="sidebar" /> Seeker
              </Menu.Item>
              <Menu.Item as={Link} to={'/'} position="right" onClick={this.logout}>
              Log Out
              </Menu.Item>
            </Menu>
            <Sidebar.Pushable as={Segment}>
              <Sidebar
                 as={Menu}
                 animation='slide along'
                 width='thin'
                 visible={this.state.menuVisible}
                 icon='labeled'
                 vertical
                 inverted>
                  <Menu.Item
                     name='home'
                     className="navbutton"
                     as={Link} to='/'
                     onClick={this.toggleMenu}>
                      <Icon name='home' />
                    Home
                  </Menu.Item>
                  <Menu.Item
                    name='metrics'
                    className="navbutton"
                    as={Link} to='/metrics'
                    onClick={this.toggleMenu}>
                      <Icon name='bar chart' />
                    Metrics
                  </Menu.Item>
                  <Menu.Item
                    name='apps'
                    className="navbutton"
                    as={Link} to='/list'
                    onClick={this.toggleMenu}>
                      <Icon name='book' />
                    My Apps
                  </Menu.Item>
                  <DocModal
                    toggle={this.toggleMenu}
                    files= {this.state.files}
                    getUserData={this.getUserData}
                  />
                  <AppModal
                    userId={this.state.userId}
                    email={this.state.userEmail}
                    phases={this.state.phases}
                    files={this.state.files}
                    toggle={this.toggleMenu}
                    getUserData={this.getUserData}
                  />
              </Sidebar>
              <Sidebar.Pusher>
                <Modal
                  basic
                  closeOnDimmerClick={false}
                  open={this.state.loading}
                  onClose={this.modalClose}
                  >
                  <Modal.Content image>
                    <Modal.Description>
                      <Loader size='massive'>Loading...</Loader>
                    </Modal.Description>
                  </Modal.Content>
                </Modal>
                <Switch>
                  <Route  exact path='/' render={this.decorateProgressBoard}/>
                  <Route  path='/metrics' render={this.decorateDataVis}/>
                  <Route  path='/list' render={this.decorateAppList}/>
                 </Switch>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </div>
        </Router>
      )
    } else {
      return(<Welcome login={this.login} signup={this.signup}/>)
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

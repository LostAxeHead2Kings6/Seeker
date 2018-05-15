import React from 'react'
import { BrowserRouter as Router, Route, Link, BrowserHistory } from 'react-router-dom'
import { Button, Menu, Header, Segment} from 'semantic-ui-react'
import Login from './Login.jsx'
import Signup from './Signup.jsx'

//welcome page with signup and login features

export default class Welcome extends React.Component{
  constructor(props){
      super(props)
    this.state = {
      newUser: false
    }
    this.renderSignup = this.renderSignup.bind(this)
    this.renderLogin = this.renderLogin.bind(this)
  }

  renderSignup() {
    this.setState({newUser: true})
  }

  renderLogin() {
    this.setState({newUser: false})
  }

  render() {
    return (
    <div className="welcome-container">
      <div className = "welcome">
        <Header>
          <h1 className='title'>
            Seeker
          </h1>
        </Header>
        <Button.Group color = 'gray' textAlign='center'>
          <Button style={{ maxWidth: 350, margin:10 }} onClick={this.renderSignup}>Signup</Button>
          <Button style={{ maxWidth: 350, margin:10 }} onClick={this.renderLogin}>Login</Button>
        </Button.Group>
        {this.state.newUser ? <Signup handleClick={this.props.signup}/> : <Login handleClick={this.props.login}/>}
        <a href='oauth'>
          <div id="gSignInWrapper">
            <div id="customBtn" class="customGPlusSignIn">
              <span className="buttonText">Sign in with</span>
              <span className="icon"></span>
            </div>
          </div>
        </a>
      </div>
    </div>
    )
  }
}

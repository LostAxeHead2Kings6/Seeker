import React, { Component } from 'react'
import { Button, Modal, Icon, Dropdown, Header } from 'semantic-ui-react'

//Options to every Phase Column

export default class PhaseSettingsModal extends Component {
  constructor(props){
    super(props)
    this.state = { reorderview : false }
    this.handleView = this.handleView.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.reorder = this.reorder.bind(this)
}

  handleClick(){
    this.props.deletePhase(this.props.selectedPhase.id, this.props.phases.indexOf(this.props.selectedPhase))
    this.props.toggle()
  }

  handleView(){
    this.setState( { reorderview : !this.state.reorderview } )
  }

  handleClose(){
    this.props.toggle()
    this.handleView()
  }

  reorder(e, { name, value } ) {
    let phases = this.props.phases
    phases.splice(this.props.phases.indexOf(this.props.selectedPhase), 1)
    phases.splice(value, 0, this.props.selectedPhase)
    this.props.updatePhaseOrder(phases)
    this.handleClose()
  }

  render() {
    return (
      <div>
        <Modal
          size="mini"
          open={this.props.show}
          closeIcon={true}
          onClose={this.handleClose}
          closeOnDimmerClick={false}>
          <Modal.Header>
            <Icon textAlign="center" name="settings"/>
            <h3 style={{display:"inline"}}>Options</h3>
          </Modal.Header>
          {this.state.reorderview ?
            <Modal.Content textAlign="center">
              <Dropdown
                fluid
                selection
                placeholder='Select a place in the order'
                onChange={this.reorder}
                options={this.props.phases.map((phase, i) => ({ text: `${i + 1}`,  value: i }))} />
            </Modal.Content>
          :
            <Modal.Content textAlign="center">
              <Header size="small" floated="left">Delete</Header>
              <Header size="small" floated="right">Reorder</Header>
              <Button.Group fluid size='large'>
                <Button
                  negative
                  onClick={() => this.handleClick()}>
                  <Icon name="trash"/>
                </Button>
                <Button.Or />
                <Button
                  positive
                  onClick={this.handleView}>
                  <Icon name="ordered list"/>
                </Button>
              </Button.Group>
            </Modal.Content>
          }
        </Modal>
      </div>
    )
  }
}

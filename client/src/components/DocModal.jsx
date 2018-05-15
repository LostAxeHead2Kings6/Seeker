import React from 'react';
import { Button, Menu, Header, Image, Icon, Modal, Form, Segment } from 'semantic-ui-react';
import DocList from './DocList.jsx';
import axios from 'axios';

//this is where users can upload & view pdf documents under their account

class DocModal extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      fileToSend: '',
      docName: '',
      modalOpen: false,
      isHidden: false
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleHidden() {
    this.setState({isHidden: true})
  }

  handleOpen() {
    this.setState({ modalOpen: true }, this.props.toggle)
  }

  handleClose() {
    this.setState({ fileToSend: '', docName: '', modalOpen: false, isHidden: false });
    this.props.getUserData()
  }

  handleSubmit(e) {
    if (this.state.docName === '') {
      this.toggleHidden();
      return;
    }

    e.preventDefault();
    const formData = new FormData();
    formData.append('payload', this.state.fileToSend);
    formData.append('name', this.state.docName)

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }

    axios.post('/files', formData, config)
      .then(()=>this.handleClose())
  }

  render() {
    return (
      <Modal
        trigger={
          <Menu.Item onClick={this.handleOpen}>
            <Icon name='wordpress forms' />My Files
          </Menu.Item>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon={true}
        closeOnDimmerClick={false}
        size='small'
      >
        <Header icon='wordpress forms' content='View and Update Your Documents' />
        <Modal.Content >
          <Segment>
            <h1>Add a New Document (please use PDFs)</h1>
            <Form>
              <Form.Input fluid label="Document Name" placeholder="Document Name" value={this.state.docName} onChange={(event) => this.setState({docName: event.target.value})}></Form.Input>
              <Form.Input className="upload-input" fluid label="File" as={'input'} name="myFile" type="file" accept="application/pdf" onChange="handleFiles(this.myFile)" onChange={(e)=>this.setState({fileToSend: e.target.files[0]})}></Form.Input>
              <Button onClick={(e)=>this.handleSubmit(e)}>Submit</Button>
            </Form>
          </Segment>
          <Segment>
            {this.state.isHidden && <Warning />}
            <DocList fileList={this.props.files}/>
          </Segment>
        </Modal.Content>
      </Modal>
    )
  }
}

export default DocModal;

const Warning = (props) => (
  <p>Please Add a Document Name</p>
)

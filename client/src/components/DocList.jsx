import React from 'react';
import { Document, Page } from 'react-pdf';

class DocList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      numPages: null,
      pageNumber: 1,
      scale: 0.4
    }
  }

  render() {
    const { pageNumber, numPages, scale } = this.state;

    return (
    <div className="docDisplay">
      <h1>Your Documents</h1>
      {this.props.files.map((file) => (
        <div>
        <h2>{file.file_name}</h2>
        <Document file={file.s3_url}>
          <a href={file.s3_url}>
            <Page pageNumber={pageNumber} scale = {scale} />
          </a>    
        </Document>
        </div>
      ))}
    </div>
    )
  }
}

export default DocList;


function isitPDF(fileName) {
  var length = fileName.length;
  if (fileName.split('').slice(length-3, length).join('') === 'pdf') {
    return true;
  } else return false
}
// IF A PDF
// <Document file={file.s3_url}>
//   <Page pageNumber={pageNumber} scale = {scale} />
// </Document>
// IF AN IMAGE
// <h2>{file.file_name}</h2>
//   <img src={file.s3_url}></img
import React from 'react';
import error from '../assets/error.png';

export default class Error extends React.Component {

  // componentDidMount() {
  //   this.props.toggleHeader('error');
  // }

  getErrorMessage = () => {
    let errorMessage;
    if (!navigator.onLine) {
      errorMessage = "Network disconnected. You are offline";
      // } else if (this.props.message) {
      //   errorMessage = this.props.message;
    } else {
      errorMessage = "Whoops, some error has occurred"
    }
    return errorMessage;
  };

  render() {
    const divStyle = {
      color: '#7f7f7f',
      margin: '50px auto',
      width: '100%',
      textAlign: 'center'
    };
    const labelStyle = {
      color: '#7f7f7f',
      margin: '20px auto'
    };
    const imgStyle = {
      display: 'block',
      height: '150px',
      width: '150px',
      margin: '20px auto'
    };

    return (
        <div style={divStyle}>
          <img style={imgStyle} src={error} alt="error_image"/>
          <h1 style={labelStyle}>{this.getErrorMessage()}</h1>
        </div>
    );
  }
}

import React from 'react'

export default class Loader extends React.Component {
  render() {

    const imgStyle = {
      display: 'block',
      height: '100px',
      width: '100px',
      margin: '0px auto'
    };

    return (
        <img style={imgStyle} src={require('../assets/loading.gif')} alt="loading_image"/>
    );
  }
}

import React from 'react';

class NoEntity extends React.Component {

    render() {

        const divStyle = {
            color: '#7f7f7f',
            margin: '50px auto',
            width: '100%',
            textAlign: 'center'
        };
        const style = {
            color: '#7f7f7f',
            margin: '20px auto'
        };

        return (
            <div style={divStyle}>
                <h1 style={style}>No {this.props.compString} to display</h1>
            </div>
        )
    }
}

export default NoEntity;
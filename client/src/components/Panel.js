import React from 'react';
import Header from "./Header";
import Routing from "./Routing";

class Panel extends React.Component {

    render() {
        return (
            <div>
                <Header/>
                <Routing/>
            </div>
        );
    }
}

export default Panel;

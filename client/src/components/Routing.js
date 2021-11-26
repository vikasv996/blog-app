import React from 'react';
import { Route, Switch } from 'react-router-dom';
import List from "./blogs/List";

class Routing extends React.Component {

    render() {
        return (
            <div style={{
                // width: '96%',
                marginTop: '64px',
                // position: 'absolute',
                // zIndex: -1
            }}>
                <Switch>
                    <Route exact path="/" component={List}/>
                </Switch>
            </div>
        );
    }
}

export default Routing;

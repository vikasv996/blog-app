import React from 'react';
import { withRouter } from 'react-router-dom';
import { isLoggedIn } from "./utils/GenUtils";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import './App.css';
import Panel from "./components/Panel";
import SnackbarUtil from "./utils/SnackbarUtil";

class App extends React.Component {

    state = {
        loginPage: true,
        snackbarOpen: false,
        snackbarMessage: ""
    };

    handleSnackBarClick = () => {
        this.setState((prevState) => ({
            snackbarOpen: !prevState.snackbarOpen
        }));
    };

    showSnackbar = (message) => {
        this.setState((prevState) => ({
            snackbarOpen: !prevState.snackbarOpen,
            snackbarMessage: message
        }));
    };

    handlePageChange = (page) => {
        this.setState(() => ({
            loginPage: page === "login"
        }))
    };

    render() {
        return (
            <>
                {
                    isLoggedIn() ? <Panel/> : (
                        this.state.loginPage ?
                            <Login
                                {...this.state}
                                handlePageChange={this.handlePageChange}
                            /> :
                            <Register
                                {...this.state}
                                handlePageChange={this.handlePageChange}
                                showSnackbar={this.showSnackbar}
                            />
                    )
                }
                <SnackbarUtil
                    handleSnackBarClick={this.handleSnackBarClick}
                    snackbarOpen={this.state.snackbarOpen}
                    snackbarMessage={this.state.snackbarMessage}
                    // page="login"
                />
            </>
        );
    }
}

export default withRouter(App);

import React from 'react';
import { withRouter } from 'react-router-dom';
import { isLoggedIn } from "./utils/GenUtils";
import './App.css';
import Panel from "./components/Panel";
import SnackbarUtil from "./utils/SnackbarUtil";
import NewLogin from "./components/auth/NewLogin";
import NewRegister from "./components/auth/NewRegister";

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
                            <NewLogin
                                {...this.state}
                                handlePageChange={this.handlePageChange}
                            /> :
                            <NewRegister
                                {...this.state}
                                handlePageChange={this.handlePageChange}
                                showSnackbar={this.showSnackbar}
                            />
                    )
                }
                {/*<NewLogin*/}
                {/*    {...this.state}*/}
                {/*    showSnackbar={this.showSnackbar}*/}
                {/*/>*/}
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

import React from 'react';
import axios from 'axios';
import { Typography } from '@material-ui/core';
import { LOGOUT_ROUTE } from "../../config/routeConfig";
import SnackbarUtil from "../../utils/SnackbarUtil";
import { deleteCookies, getCookies } from "../../utils/GenUtils";

class Logout extends React.Component {

    state = {
        snackbarOpen: false,
        snackbarMessage: ""
    };

    handleSnackBarClick = () => {
        this.setState((prevState) => ({
            snackbarOpen: !prevState.snackbarOpen
        }));
    };

    callLogoutApi = () => {
        const cookies = getCookies();
        if (cookies === 'unset') {
            deleteCookies();
        } else {
            const accessToken = cookies.access_token;
            axios.delete(LOGOUT_ROUTE, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(res => {
                    if (res.data) {
                        if (res.data.code === 100) {
                            deleteCookies();
                        } else if (res.data.code === 195 ||
                            res.data.code === 196 ||
                            res.data.code === 197 ||
                            res.data.code === 198) {
                            deleteCookies();
                        } else {
                            // alert(res.data.message);
                            this.setState(prevState => ({
                                snackbarOpen: !prevState.snackbarOpen,
                                snackbarMessage: res.data.message
                            }))
                        }
                    } else {
                        // alert(res.data.message);
                        this.setState(prevState => ({
                            snackbarOpen: !prevState.snackbarOpen,
                            snackbarMessage: res.data.message
                        }))
                    }
                })
                .catch(err => {
                    // alert('Server error. Please try after some time');
                    this.setState(prevState => ({
                        snackbarOpen: !prevState.snackbarOpen,
                        snackbarMessage: 'Server error. Please try after some time'
                    }));
                })
        }
    };

    onLogoutButtonClick = (e) => {
        e.preventDefault();
        if (navigator.onLine) {
            this.callLogoutApi();
        } else {
            // alert("Network disconnected. You are offline");
            this.setState(prevState => ({
                snackbarOpen: !prevState.snackbarOpen,
                snackbarMessage: 'Network disconnected. You are offline'
            }));
        }
    };

    render() {
        return (
            <div>
                <Typography
                    // style={{ /*width: 'inherit'*/backgroundColor: "#03005e", color: "#ffffff" }}
                    variant="subtitle1"
                    onClick={(e) => this.onLogoutButtonClick(e)}
                >
                    Logout
                </Typography>
                <SnackbarUtil
                    handleSnackBarClick={this.handleSnackBarClick}
                    snackbarOpen={this.state.snackbarOpen}
                    snackbarMessage={this.state.snackbarMessage}
                    page="logout"
                />
            </div>
        );
    }
}

export default Logout;

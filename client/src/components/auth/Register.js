import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, FormGroup, FormLabel, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import { REGISTER_ROUTE } from "../../config/routeConfig";
import SnackbarUtil from "../../utils/SnackbarUtil";
import Loader from "../../utils/Loader";
import '../../styles/login.css';


class Register extends React.Component {

    state = {
        emailId: '',
        password: '',
        showPassword: false,
        emailHelperText: '',
        loading: false,
        emailError: false,
        passwordHelperText: '',
        passwordError: false,
        snackbarOpen: false,
        snackbarMessage: ""
    };

    handleChange = (e, field) => {
        let currentState = { ...this.state };
        currentState[field] = e.target.value;
        console.log("currentState", currentState);
        this.setState(currentState);
    };

    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    };

    handleSnackBarClick = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState((prevState) => ({
            snackbarOpen: !prevState.snackbarOpen
        }));
    };

    onFocusTextField = (field) => {
        if (field === 'emailId') {
            this.setState(() => ({
                emailError: false,
                emailHelperText: ""
            }))
        } else if (field === 'password') {
            this.setState(() => ({
                passwordError: false,
                passwordHelperText: ""
            }))
        }
    };

    registerUser = () => {
        const { emailId, password } = this.state;
        axios.post(REGISTER_ROUTE,
            {
                emailId,
                password
            })
            .then(res => {
                console.log("Register success res", res);
                if (res.data) {
                    if (res.data.code === 100) {
                        this.setState(() => ({
                            loading: false
                        }));
                        this.props.showSnackbar(res.data.message);
                        this.props.handlePageChange("login");
                    } else {
                        this.setState(() => ({
                            loading: false,
                            snackbarOpen: true,
                            snackbarMessage: res.data.message
                        }));
                        // alert(res.data.messageEn);
                    }
                } else {
                    this.setState(() => ({
                        loading: false
                    }));
                }
            })
            .catch((err) => {
                console.log("Network error");
                console.log("Register err:", err);
                this.setState(() => ({
                    loading: false,
                    snackbarOpen: true,
                    snackbarMessage: "Server error. Please try after some time"
                }));
            });
    };

    onRegister = (e) => {
        e.preventDefault();

        // if (this.state.emailId && this.state.password) {
        if (!this.state.emailId) {
            this.setState(() => ({
                emailError: true,
                emailHelperText: "Provide your email-id"
            }))
        }

        if (!this.state.password) {
            this.setState(() => ({
                passwordError: true,
                passwordHelperText: "Please enter the password"
            }))
        }


        if (this.state.emailId && this.state.password) {
            this.setState(() => ({ loading: true }));
            if (navigator.onLine) {
                this.registerUser();
            } else {
                this.setState(() => ({
                    loading: false,
                    snackbarOpen: true,
                    snackbarMessage: 'Network disconnected. You are offline'
                }));
            }
        }
    };

    render() {
        return (
            <div id="parent-div-id">
                <div id="register-container">
                    <form className="login-form">
                        <FormLabel style={{ fontSize: 'x-large', paddingBottom: '5px' }}>Peerbits Blogs</FormLabel>
                        <br/>
                        <FormGroup>
                            <TextField
                                // id="standard-helperText"
                                variant="standard"
                                label="E-mail"
                                type="email"
                                name="emailId"
                                // onKeyDown={this.onEnterClicked}
                                helperText={this.state.emailHelperText}
                                error={this.state.emailError}
                                style={{ marginTop: '25px' }}
                                onFocus={(e) => {
                                    this.onFocusTextField(e.target.name)
                                }}
                                onChange={(e) => {
                                    this.handleChange(e, e.target.name)
                                }}
                            />
                        </FormGroup>
                        <br/>
                        <FormGroup>
                            <TextField
                                variant="standard"
                                label="Password"
                                name="password"
                                type='text'
                                helperText={this.state.passwordHelperText}
                                error={this.state.passwordError}
                                style={{ marginTop: '25px' }}
                                onFocus={(e) => {
                                    this.onFocusTextField(e.target.name)
                                }}
                                onChange={(e) => {
                                    this.handleChange(e, e.target.name)
                                }}
                            />
                        </FormGroup>
                        <div style={{ marginTop: '16px' }}>
                            {
                                this.state.loading ? <Loader/> : (
                                    <Button
                                        type="submit"
                                        style={{ backgroundColor: "#28a745", color: "#ffffff", margin: '8px' }}
                                        variant="contained"
                                        className="login-button"
                                        onClick={this.onRegister}
                                    >
                                        Register
                                    </Button>
                                )
                            }
                            <Typography>
                                Already registered, <span
                                style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
                                onClick={() => this.props.handlePageChange("login")}
                            >
                  Click here
                </span> to
                                Login
                            </Typography>
                        </div>
                    </form>
                    <SnackbarUtil
                        handleSnackBarClick={this.handleSnackBarClick}
                        snackbarOpen={this.state.snackbarOpen}
                        snackbarMessage={this.state.snackbarMessage}
                        // page="login"
                    />
                </div>
            </div>
        );
    }

}

export default withRouter(Register);

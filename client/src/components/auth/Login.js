import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, FormGroup, FormLabel, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Cookies from "universal-cookie";
import axios from 'axios';
import { LOGIN_ROUTE } from "../../config/routeConfig";
import SnackbarUtil from "../../utils/SnackbarUtil";
import Loader from "../../utils/Loader";
import '../../styles/login.css';

class Login extends React.Component {

    state = {
        loginPage: true,
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
        // if (field === 'email') {
        currentState[field] = e.target.value;
        // }
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

    loginUser = () => {
        // const serverTimeout = timer(this.timerFunction);
        const cookies = new Cookies();
        const emailId = this.state.emailId.trim();
        const password = this.state.password.trim();
        axios.post(LOGIN_ROUTE,
            {
                emailId,
                password
            })
            .then(res => {
                // clearTimeout(serverTimeout);
                console.log("Response::", res);
                if (res.data) {
                    if (res.data.code === 100) {
                        this.setState(() => ({ loading: false }));
                        cookies.set('email_id', this.state.emailId);
                        cookies.set('access_token', res.data.accessToken);
                        this.props.history.push('/');
                        // window.location.assign('/');
                    } else {
                        this.setState(() => ({
                            loading: false,
                            snackbarOpen: true,
                            snackbarMessage: res.data.message
                        }));
                        // alert(res.data.messageEn);
                    }
                }
            })
            .catch((err) => {
                console.log("Login err", err);
                console.log("Login err.response", err.response);
                let msg = '';
                if (err.response) {
                    if (err.response.data.code) {
                        msg = err.response.data.message
                    }
                }
                this.setState(() => ({
                    loading: false,
                    snackbarOpen: true,
                    snackbarMessage: msg ? msg : 'Server error. Please try after some time'
                }));
            });
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

    onLoginButtonClick = (e) => {
        e.preventDefault();
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
                this.loginUser();
            } else {
                this.setState(() => ({
                    loading: false,
                    snackbarOpen: true,
                    snackbarMessage: 'Network disconnected. You are offline'
                }));
            }
        }
    };

    onRegisterClick = (e) => {
        e.preventDefault();
        this.setState(() => ({
            loginPage: false
        }))
    };

    render() {
        return (
            <div id="parent-div-id">
                <div id="login-container">
                    <form className="login-form">
                        <FormLabel style={{ fontSize: 'x-large', paddingBottom: '5px' }}>Peerbits Blogs</FormLabel>
                        {/*<Typography variant="title">Smart WiFi Admin Panel</Typography>*/}
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
                                type={this.state.showPassword ? 'text' : 'password'}
                                helperText={this.state.passwordHelperText}
                                error={this.state.passwordError}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="Toggle password visibility"
                                                onClick={this.handleClickShowPassword}
                                            >
                                                {this.state.showPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                onFocus={(e) => {
                                    this.onFocusTextField(e.target.name)
                                }}
                                onChange={(e) => {
                                    this.handleChange(e, e.target.name)
                                }}
                            />
                        </FormGroup>
                        {/*<br/>*/}
                        {/*<Button type="submit"
                         style={this.state.loading ? loadingOnStyle : loadingOffStyle}
                         variant="contained"
                         className="login-button"
                         disabled={this.state.loading}
                         onClick={(e) => this.onLoginButtonClick(e)}
                         >
                         Login
                         </Button>*/}
                        <div style={{ marginTop: '16px' }}>
                            {
                                this.state.loading ? <Loader/> : (
                                    <Button type="submit"
                                            style={{ /*width: 'inherit'*/
                                                backgroundColor: "#28a745",
                                                color: "#ffffff",
                                                margin: '8px'
                                            }}
                                            variant="outlined"
                                            className="login-button"
                                            onClick={(e) => this.onLoginButtonClick(e)}
                                    >
                                        Login
                                    </Button>
                                )
                            }
                            <Typography>
                <span style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
                      onClick={() => this.props.handlePageChange("register")}>Click here</span> to
                                Register
                            </Typography>
                        </div>
                        {/*<br/>*/}
                        {/*<span><a href="#">Forgot Password?</a></span>*/}
                    </form>
                    <SnackbarUtil
                        handleSnackBarClick={this.handleSnackBarClick}
                        snackbarOpen={this.state.snackbarOpen}
                        snackbarMessage={this.state.snackbarMessage}
                        page="login"
                    />
                </div>
            </div>
        );
    };
}

export default withRouter(Login);

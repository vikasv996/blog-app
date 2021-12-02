import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { register } from "../MainTheme";
import InputAdornment from "@material-ui/core/InputAdornment";

import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import { Button, FormControl, Input, InputLabel, Typography } from "@material-ui/core";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@material-ui/icons/VisibilityOffTwoTone";
import CloseIcon from "@material-ui/icons/Close";

import Cookies from "universal-cookie";
import axios from "axios";
import { LOGIN_ROUTE } from "../../config/routeConfig";


class NewLogin extends Component {
    state = {
        emailId: "",
        password: "",
        passwordConfrim: "",
        hidePassword: true,
        emailHelperText: '',
        emailError: false,
        passwordHelperText: '',
        passwordError: false,
        error: null,
        errorOpen: false,
        loading: false,
        snackbarOpen: false,
        snackbarMessage: ''
    };

    errorClose = e => {
        this.setState({
            errorOpen: false
        });
    };

    // handleChange = name => e => {
    //     this.setState({
    //         [name]: e.target.value
    //     });
    // };
    handleChange = (e, field) => {
        let currentState = { ...this.state };
        // if (field === 'email') {
        currentState[field] = e.target.value;
        // }
        this.setState(currentState);
    };

    onFocusTextField = (field) => {
        if (field === 'emailId') {
            this.setState(() => ({
                emailError: false,
                emailHelperText: "",
                errorOpen: false,
                error: ""
            }))
        } else if (field === 'password') {
            this.setState(() => ({
                passwordError: false,
                passwordHelperText: "",
                errorOpen: false,
                error: ""
            }))
        }
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
                        // this.props.history.push('/');
                        window.location.assign('/');
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
                    snackbarMessage: msg ? msg : 'Server error. Please try after some time',
                    errorOpen: true,
                    error: msg ? msg : 'Server error. Please try after some time'
                }));
            });
    };

    // passwordMatch = () => this.state.password === this.state.passwordConfrim;

    showPassword = () => {
        this.setState(prevState => ({ hidePassword: !prevState.hidePassword }));
    };

    isValid = () => {
        if (this.state.email === "") {
            return false;
        }
        return true;
    };
    submitRegistration = e => {
        e.preventDefault();
        // if (!this.passwordMatch()) {
        //     this.setState({
        //         errorOpen: true,
        //         error: "Passwords don't match"
        //     });
        // }
        const newUserCredentials = {
            email: this.state.email,
            password: this.state.password,
            passwordConfrim: this.state.passwordConfrim
        };
        console.log("this.props.newUserCredentials", newUserCredentials);
        //dispath to userActions
    };

    onLoginButtonClick = (e) => {
        e.preventDefault();

        // console.log(this.state.emailId)
        // console.log(this.state.password)
        if (!this.state.emailId && !this.state.password) {
            this.setState(() => ({
                emailError: true,
                emailHelperText: "Provide your email-id",
                errorOpen: true,
                error: "Provide your email-id and password"
            }))
        }

        if (!this.state.emailId) {
            this.setState(() => ({
                emailError: true,
                emailHelperText: "Provide your email-id",
                errorOpen: true,
                error: "Provide your email-id"
            }))
        }

        if (!this.state.password) {
            this.setState(() => ({
                passwordError: true,
                passwordHelperText: "Please enter the password",
                errorOpen: true,
                error: "Please enter the password"
            }))
        }

        if (this.state.emailId && this.state.password) {
            // this.setState(() => ({ loading: true }));
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

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.main}>
                <CssBaseline/>

                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <PeopleAltIcon className={classes.icon}/>
                    </Avatar>
                    <Typography variant="h3" color="textSecondary">
                        Sign in
                    </Typography>
                    <form
                        className={classes.form}
                        // onSubmit={() => this.onLoginButtonClick}
                    >
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="email" className={classes.labels}>
                                E-mail
                            </InputLabel>
                            <Input
                                name="emailId"
                                type="email"
                                autoComplete="email"
                                className={classes.inputs}
                                disableUnderline={true}
                                onFocus={(e) => {
                                    this.onFocusTextField(e.target.name)
                                }}
                                onChange={(e) => {
                                    this.handleChange(e, e.target.name)
                                }}
                            />
                        </FormControl>

                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="password" className={classes.labels}>
                                Password
                            </InputLabel>
                            <Input
                                name="password"
                                autoComplete="password"
                                className={classes.inputs}
                                disableUnderline={true}
                                onFocus={(e) => {
                                    this.onFocusTextField(e.target.name)
                                }}
                                onChange={(e) => {
                                    this.handleChange(e, e.target.name)
                                }}
                                type={this.state.hidePassword ? "password" : "input"}
                                endAdornment={
                                    this.state.hidePassword ? (
                                        <InputAdornment position="end">
                                            <VisibilityOffTwoToneIcon
                                                fontSize="default"
                                                className={classes.passwordEye}
                                                onClick={this.showPassword}
                                            />
                                        </InputAdornment>
                                    ) : (
                                        <InputAdornment position="end">
                                            <VisibilityTwoToneIcon
                                                fontSize="default"
                                                className={classes.passwordEye}
                                                onClick={this.showPassword}
                                            />
                                        </InputAdornment>
                                    )
                                }
                            />
                        </FormControl>

                        {/*<FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="passwordConfrim" className={classes.labels}>
                                confrim password
                            </InputLabel>
                            <Input
                                name="passwordConfrim"
                                autoComplete="passwordConfrim"
                                className={classes.inputs}
                                disableUnderline={true}
                                onClick={this.state.showPassword}
                                onChange={this.handleChange("passwordConfrim")}
                                type={this.state.hidePassword ? "password" : "input"}
                                endAdornment={
                                    this.state.hidePassword ? (
                                        <InputAdornment position="end">
                                            <VisibilityOffTwoToneIcon
                                                fontSize="default"
                                                className={classes.passwordEye}
                                                onClick={this.showPassword}
                                            />
                                        </InputAdornment>
                                    ) : (
                                        <InputAdornment position="end">
                                            <VisibilityTwoToneIcon
                                                fontSize="default"
                                                className={classes.passwordEye}
                                                onClick={this.showPassword}
                                            />
                                        </InputAdornment>
                                    )
                                }
                            />
                        </FormControl>*/}
                        <Button
                            disabled={!this.isValid()}
                            disableRipple
                            fullWidth
                            variant="outlined"
                            className={classes.button}
                            type="submit"
                            onClick={(e) => this.onLoginButtonClick(e)}
                        >
                            Login
                        </Button>
                        <Typography>
                <span style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
                      onClick={() => this.props.handlePageChange("register")}>Click here</span> to
                            Register
                        </Typography>
                    </form>

                    {this.state.error ? (
                        <Snackbar
                            variant="error"
                            key={this.state.error}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center"
                            }}
                            open={this.state.errorOpen}
                            onClose={this.errorClose}
                            autoHideDuration={3000}
                        >
                            <SnackbarContent
                                className={classes.error}
                                message={
                                    <div>
                    <span style={{ marginRight: "8px" }}>
                      <ErrorIcon fontSize="large" color="error"/>
                    </span>
                                        <span> {this.state.error} </span>
                                    </div>
                                }
                                action={[
                                    <IconButton
                                        key="close"
                                        aria-label="close"
                                        onClick={this.errorClose}
                                    >
                                        <CloseIcon color="error"/>
                                    </IconButton>
                                ]}
                            />
                        </Snackbar>
                    ) : null}
                </Paper>
            </div>
        );
    }
}

export default withStyles(register)(NewLogin);

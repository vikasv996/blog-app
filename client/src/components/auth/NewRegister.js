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
import axios from "axios";
import { REGISTER_ROUTE } from "../../config/routeConfig";


class NewRegister extends Component {
    state = {
        emailId: "",
        password: "",
        passwordConfrim: "",
        hidePassword: true,
        error: null,
        errorOpen: false,
        emailHelperText: '',
        loading: false,
        emailError: false,
        passwordHelperText: '',
        passwordError: false,
        snackbarOpen: false,
        snackbarMessage: ""
    };

    errorClose = e => {
        this.setState({
            errorOpen: false
        });
    };

    handleChange = (e, field) => {
        let currentState = { ...this.state };
        currentState[field] = e.target.value;
        console.log("currentState", currentState);
        this.setState(currentState);
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

    passwordMatch = () => this.state.password === this.state.passwordConfrim;

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
        if (!this.passwordMatch()) {
            this.setState({
                errorOpen: true,
                error: "Passwords don't match"
            });
        }
        const newUserCredentials = {
            email: this.state.email,
            password: this.state.password,
            passwordConfrim: this.state.passwordConfrim
        };
        console.log("this.props.newUserCredentials", newUserCredentials);
        //dispath to userActions
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
                        Register
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
                            onClick={(e) => this.onRegister(e)}
                        >
                            Register
                        </Button>
                        <Typography>
                <span style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
                      onClick={() => this.props.handlePageChange("login")}>Click here</span> to
                            Login
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

export default withStyles(register)(NewRegister);

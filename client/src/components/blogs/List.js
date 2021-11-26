import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    FormGroup,
    Grid,
    TextField,
    Tooltip,
    withStyles,
    Zoom
} from '@material-ui/core';
import { createDiff, deleteCookies, getCookies, isLoggedIn, strTrunc } from "../../utils/GenUtils";
import { BLOG_ADD_ROUTE, BLOG_LIST_ROUTE, BLOG_REMOVE_ROUTE, BLOG_UPDATE_ROUTE } from "../../config/routeConfig";
import DisplayList from "../DisplayList";
import SnackbarUtil from "../../utils/SnackbarUtil";
import FilterUsers from "./Filter";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    root: {
        width: '90%',
        marginLeft: '8%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    }
});

class List extends React.Component {

    state = {
        noEntity: false,
        error: false,
        loading: true,
        maxPage: 1,
        pageNum: 0,
        totalCount: 0,
        filter: {
            title: '',
            description: '',
            createdAt: '',
            createdBy: ''
        },
        empList: [
            {
                title: '',
                description: '',
                createdAt: '',
                createdBy: ''
            }
        ],
        addContactInfo: {
            blogId: '',
            title: '',
            description: ''
        },
        contactInfo: {
            blogId: '',
            title: '',
            description: ''
        },
        initInfo: {
            blogId: '',
            title: '',
            description: ''
        },
        mode: '',
        route: BLOG_ADD_ROUTE,
        blog: {},
        blogId: '',
        modalOpen: false,
        deleteModal: false,
        modalTitle: '',
        deleteModalTitle: '',
        loadingDialog: false,
        snackbarOpen: false,
        snackbarMessage: '',
        modalSnackbarOpen: false,
        modalSnackbarMessage: '',
        rowsPerPage: 10
    };

    handleBlogChange = (e, field) => {
        let currentState = { ...this.state };
        if (this.state.mode === 'add') {
            currentState.addContactInfo[field] = e.target.value;
        } else if (this.state.mode === 'edit') {
            currentState.contactInfo[field] = e.target.value;
        }
        this.setState(() => (currentState));
    };

    handleLabelDisplayedRows = ({ from, to, count }) => {
        return `${from} - ${to} of ${count}`;
    };

    handlePageChange = (e, page) => {
        this.loadBlogs(page);
        this.setState(() => ({
            pageNum: page
        }));
    };

    handleRowPerPageChange = (e) => {
        this.setState(() => ({
            rowsPerPage: e.target.value
        }), () => {
            this.loadBlogs(this.state.pageNum);
        });
    };

    handleModalOpen = () => {
        this.setState(() => ({ modalOpen: true }))
    };

    handleModalClose = () => {
        this.setState(() => ({ modalOpen: false }))
    };

    handleDeleteModalOpen = () => {
        this.setState(() => ({ deleteModal: true }))
    };

    handleDeleteModalClose = () => {
        this.setState(() => ({ deleteModal: false }))
    };

    handleSnackBarClick = () => {
        this.setState((prevState) => ({
            snackbarOpen: !prevState.snackbarOpen
        }));
    };

    handleModalSnackBarClick = () => {
        this.setState((prevState) => ({
            modalSnackbarOpen: !prevState.modalSnackbarOpen
        }));
    };

    singleContactDetails = (contact) => {
        this.setState(prevState => ({
            contact,
            modalOpen: !prevState.modalOpen
        }))
    };

    maxPage = totalCount => {
        return Math.ceil(totalCount / this.state.rowsPerPage);
    };

    filterFormatter = filter => {
        let title, description;

        if (filter.title)
            title = filter.title;

        if (filter.description)
            description = filter.description;

        return { title, description };
    };

    loadBlogs = (page, filterObject = this.state.filter) => {
        if (!navigator.onLine) {
            this.setState(prevState => ({
                snackbarOpen: !prevState.snackbarOpen,
                snackbarMessage: "Network disconnected. You are offline",
                pageNum: 0,
                maxPage: 1,
                loading: false,
                error: true
            }))
        } else {
            // const serverTimeout = timer(this.timerFunction);
            const cookies = getCookies();
            if (cookies === 'unset') {
                this.setState((prevState) => ({
                    snackbarOpen: !prevState.snackbarOpen,
                    snackbarMessage: "Session not found. Please login again to continue",
                    loading: false,
                    error: true
                }));
                setTimeout(() => {
                    deleteCookies();
                }, 1000);
            }
            this.setState(() => ({ loading: true, pageNum: page }));
            const filter = this.filterFormatter(filterObject);
            axios.post(BLOG_LIST_ROUTE,
                {
                    skip: page * this.state.rowsPerPage,
                    limit: this.state.rowsPerPage,
                    ...filter
                }, {
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`
                    }
                })
                .then(res => {
                    if (res.data) {
                        if (res.data.code === 100) {
                            this.setState(() => ({
                                noEntity: false,
                                loading: false,
                                error: false,
                                totalCount: res.data.totalCount,
                                blogList: res.data.list,
                                maxPage: this.maxPage(res.data.totalCount)
                            }))
                        } else if (res.data.code === 195 ||
                            res.data.code === 196 ||
                            res.data.code === 197 ||
                            res.data.code === 198) {
                            this.setState((prevState) => ({
                                snackbarOpen: !prevState.snackbarOpen,
                                snackbarMessage: res.data.message,
                                loading: false,
                                error: true
                            }));
                            setTimeout(() => {
                                deleteCookies();
                            }, 1000);
                        } else if (res.data.code === 198) {
                            alert(res.data.message);
                            this.setState(() => ({ noEntity: true, loading: false, error: false }));
                        } else if (res.data.code === 110) {
                            this.setState(() => ({
                                noEntity: true,
                                loading: false,
                                error: false
                            }))
                        } else {
                            this.setState(() => ({ noEntity: true, loading: false, error: false }));
                        }
                    } else {
                        this.setState(() => ({ loading: false, error: true }));
                    }
                })
                .catch((err) => {
                    this.setState(() => ({
                        loading: false,
                        error: true,
                        snackbarOpen: true,
                        snackbarMessage: 'Server error. Please try after some time'
                    }));
                });
        }
    };

    updateBlog = (blogId) => {
        if (!navigator.onLine) {
            this.setState(prevState => ({
                modalSnackbarOpen: !prevState.modalSnackbarOpen,
                modalSnackbarMessage: "Network disconnected. You are offline",
                pageNum: 0,
                maxPage: 1,
                loading: false,
                error: true
            }))
        } else {
            // const serverTimeout = timer(this.timerFunction);
            const cookies = getCookies();
            if (cookies === 'unset') {
                this.setState((prevState) => ({
                    modalSnackbarOpen: !prevState.modalSnackbarOpen,
                    modalSnackbarMessage: "Session not found. Please login again to continue",
                    loading: false,
                    error: true
                }));
                setTimeout(() => {
                    deleteCookies();
                }, 1000);
            }
            let contactObject, route;
            if (this.state.mode === 'add' && !blogId) {
                const contactInfo = this.state.addContactInfo;
                route = BLOG_ADD_ROUTE;
                contactObject = {
                    ...contactInfo
                };
            } else if (this.state.mode === 'edit' && blogId) {
                route = BLOG_UPDATE_ROUTE;
                const editInfo = JSON.parse(JSON.stringify(this.state.contactInfo));
                const diff = createDiff(this.state.initInfo, editInfo);
                if (!diff) {
                    this.setState((prevState) => ({
                        modalSnackbarOpen: !prevState.modalSnackbarOpen,
                        modalSnackbarMessage: "Edit something before updating",
                    }));
                    return;
                }
                contactObject = {
                    blogId,
                    ...diff
                };
            }
            axios.post(route, contactObject, {
                headers: {
                    Authorization: `Bearer ${cookies.access_token}`
                }
            })
                .then(res => {
                    if (res.data) {
                        if (res.data.code === 100) {
                            this.setState(prevState => ({
                                loading: false,
                                error: false,
                                // channelNestedModal: !prevState.channelNestedModal,
                                initInfo: JSON.parse(JSON.stringify(this.state.contactInfo)),
                                modalOpen: false,
                                modalSnackbarOpen: !prevState.modalSnackbarOpen,
                                modalSnackbarMessage: res.data.message,
                            }), () => this.loadBlogs(0));
                        } else {
                            this.setState((prevState) => ({
                                noEntity: true,
                                loading: false,
                                error: false,
                                modalSnackbarOpen: !prevState.modalSnackbarOpen,
                                modalSnackbarMessage: res.data.message
                            }));
                        }
                    } else {
                        this.setState(() => ({ loading: false, error: true }));
                    }
                })
                .catch(err => {
                    this.setState(() => ({
                        loading: false,
                        error: true,
                        modalSnackbarOpen: true,
                        modalSnackbarMessage: 'Server error. Please try after some time'
                    }));
                })
        }
    };

    deleteBlog = (blogId) => {
        if (!navigator.onLine) {
            this.setState(prevState => ({
                modalSnackbarOpen: !prevState.modalSnackbarOpen,
                modalSnackbarMessage: "Network disconnected. You are offline",
                pageNum: 0,
                maxPage: 1,
                loading: false,
                error: true
            }))
        } else {
            // const serverTimeout = timer(this.timerFunction);
            const cookies = getCookies();
            if (cookies === 'unset') {
                this.setState((prevState) => ({
                    modalSnackbarOpen: !prevState.modalSnackbarOpen,
                    modalSnackbarMessage: "Session not found. Please login again to continue",
                    loading: false,
                    error: true
                }));
                setTimeout(() => {
                    deleteCookies();
                }, 1000);
            }
            const contactObj = {
                blogId
            };
            axios({
                method: 'delete',
                url: BLOG_REMOVE_ROUTE,
                data: contactObj,
                headers: {
                    Authorization: `Bearer ${cookies.access_token}`
                }
            })
                .then(res => {
                    if (res.data) {
                        if (res.data.code === 100) {
                            this.setState(() => ({
                                noEntity: false,
                                loading: false,
                                error: false,
                                modalOpen: false,
                                deleteModal: false
                            }), () => this.loadBlogs(0));
                        } else {
                            this.setState(() => ({ noEntity: true, loading: false, error: false }));
                        }
                    } else {
                        this.setState(() => ({ loading: false, error: true }));
                    }
                })
                .catch(err => {
                })
        }
    };

    confirmDelete = (blogId, title) => {
        this.setState(() => ({
            blogId,
            modalOpen: false,
            deleteModal: true,
            deleteModalTitle: title
        }))
    };

    singleBlog = (contact) => {
        this.setState(() => ({
            modalOpen: true,
            mode: 'edit',
            route: BLOG_UPDATE_ROUTE,
            modalTitle: 'Update blog details',
            contactInfo: JSON.parse(JSON.stringify(contact)),
            initInfo: JSON.parse(JSON.stringify(contact))
        }), () => console.log("State after singleBlog: ", this.state))
    };

    addContact = () => {
        this.setState(() => ({
            modalOpen: true,
            mode: 'add',
            modalTitle: 'Add Blog',
            addContactInfo: {
                title: '',
                description: ''
            }
        }))
    };

    onBlogClick = (e, action, id) => {
        e.preventDefault();
        if (!navigator.onLine) {
            this.setState(prevState => ({
                modalSnackbarOpen: !prevState.snackbarOpen,
                modalSnackbarMessage: "Network disconnected. You are offline"
            }))
        } else {
            if (action === "addBlog") {
                this.updateBlog(null);
            } else if (action === "editBlog") {
                this.updateBlog(id);
            }
        }
    };

    setFilter = (filter) => {
        this.setState(() => ({ pageNum: 0, filter }));
    };

    componentDidMount() {
        this.loadBlogs(this.state.pageNum);
    }

    // UNSAFE_componentWillMount() {
    //     let cookies = new Cookies();
    //     let cache;
    //     if (cookies.get('cache')) {
    //         cache = cookies.get('cache');
    //         this.setState(() => ({ filter: cache.filter, pageNum: cache.pageNum }))
    //     }
    // }

    render() {

        const floatingButtonStyle = {
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed',
            backgroundColor: '#03005e',
            color: '#fff'
        };

        return (
            <div style={{ padding: '16px 0' }}>
                {
                    !isLoggedIn() ? <Redirect to={{ pathname: '/' }}/> : (
                        <>
                            <FilterUsers
                                {...this.state}
                                setFilter={this.setFilter}
                                loadEntity={this.loadBlogs}
                                page="blog"
                            />
                            <DisplayList
                                {...this.state}
                                handlePageChange={this.handlePageChange}
                                handleRowPerPageChange={this.handleRowPerPageChange}
                                confirmDelete={this.confirmDelete}
                                singleBlog={this.singleBlog}
                                loadEntity={this.loadBlogs}
                                page="blog"
                            />

                            <Dialog
                                open={this.state.modalOpen}
                                onClose={this.handleModalClose}
                                fullWidth={true}
                                disableBackdropClick={true}
                                disableEscapeKeyDown={true}
                                maxWidth="md"
                            >
                                <SnackbarUtil
                                    handleSnackBarClick={this.handleModalSnackBarClick}
                                    snackbarOpen={this.state.modalSnackbarOpen}
                                    snackbarMessage={this.state.modalSnackbarMessage}
                                    page="commodityUpdate"
                                />
                                <DialogTitle>{this.state.modalTitle}</DialogTitle>
                                <DialogContent>
                                    {
                                        this.state.mode === 'edit' ? (
                                            <Grid container spacing={10} style={{ margin: '0px', width: '100%' }}>
                                                <Grid item xs={12} style={{ padding: '16px' }}>
                                                    <FormGroup row style={{ width: '100%' }}>
                                                        <TextField
                                                            variant="outlined"
                                                            label="Title"
                                                            name="title"
                                                            value={this.state.contactInfo.title}
                                                            style={{ width: '100%' }}
                                                            onChange={(e) => {
                                                                this.handleBlogChange(e, e.target.name)
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} style={{ padding: '16px' }}>
                                                    <FormGroup row style={{ width: '100%' }}>
                                                        <TextField
                                                            variant="outlined"
                                                            label="Description"
                                                            name="description"
                                                            multiline
                                                            rows="4"
                                                            value={this.state.contactInfo.description}
                                                            style={{ width: '100%' }}
                                                            onChange={(e) => {
                                                                this.handleBlogChange(e, e.target.name)
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Grid container spacing={10} style={{ margin: '0px', width: '100%' }}>
                                                <Grid item xs={12} style={{ padding: '16px' }}>
                                                    <FormGroup row style={{ width: '100%' }}>
                                                        <TextField
                                                            variant="outlined"
                                                            label="Title"
                                                            name="title"
                                                            value={this.state.addContactInfo.title}
                                                            style={{ width: '100%' }}
                                                            onChange={(e) => {
                                                                this.handleBlogChange(e, e.target.name)
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} style={{ padding: '16px' }}>
                                                    <FormGroup row style={{ width: '100%' }}>
                                                        <TextField
                                                            variant="outlined"
                                                            label="Description"
                                                            name="description"
                                                            multiline
                                                            rows="4"
                                                            value={this.state.addContactInfo.description}
                                                            style={{ width: '100%' }}
                                                            onChange={(e) => {
                                                                this.handleBlogChange(e, e.target.name)
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Grid>
                                            </Grid>
                                        )
                                    }
                                </DialogContent>
                                <DialogActions style={{ padding: '0 40px 16px' }}>
                                    {
                                        this.state.mode === 'add' ? (
                                            <Button
                                                variant="contained"
                                                style={{ backgroundColor: '#4caf50', color: '#fff' }}
                                                onClick={(e) => this.onBlogClick(e, "addBlog", null)}
                                            >
                                                Add
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                style={{ backgroundColor: '#4caf50', color: '#fff' }}
                                                onClick={(e) => this.onBlogClick(e, "editBlog", this.state.contactInfo.blogId)}
                                            >
                                                Update
                                            </Button>
                                        )
                                    }
                                    <Button
                                        variant="outlined"
                                        style={{ color: '#E53935', backgroundColor: '#fff' }}
                                        onClick={this.handleModalClose}
                                    >
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <Dialog
                                open={this.state.deleteModal}
                                disableBackdropClick={true}
                                disableEscapeKeyDown={true}
                                onClose={this.handleDeleteModalClose}
                                maxWidth="sm"
                                fullWidth={true}
                            >
                                <DialogTitle>{strTrunc(this.state.deleteModalTitle, 30)}</DialogTitle>
                                <DialogContent>
                                    <Typography
                                        variant="subtitle1"
                                    >
                                        Are you sure, you want to delete this blog?
                                    </Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        // style={{ backgroundColor: '#E53935', color: '#fff' }}
                                        color="primary"
                                        onClick={() => this.deleteBlog(this.state.blogId)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        // style={{ color: '#E53935', backgroundColor: '#fff' }}
                                        color="primary"
                                        onClick={this.handleDeleteModalClose}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <Tooltip title="Add Blog" TransitionComponent={Zoom}>
                                <Fab
                                    color={"primary"}
                                    style={floatingButtonStyle}
                                    onClick={this.addContact}
                                >
                                    <AddIcon/>
                                </Fab>
                            </Tooltip>
                            <SnackbarUtil
                                handleSnackBarClick={this.handleSnackBarClick}
                                snackbarOpen={this.state.snackbarOpen}
                                snackbarMessage={this.state.snackbarMessage}
                            />

                        </>
                    )
                }
            </div>
        );
    }

}

List.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(List);

import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Cookies from 'universal-cookie';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import BlogIcon from "@material-ui/icons/RssFeed";
import Logout from "./auth/Logout";

const drawerWidth = 300;

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    // overflow: 'hidden',
    // position: 'fixed',
    display: 'flex',
  },
  appBar: {
    // zIndex: theme.zIndex.modal + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  feed: {
    paddingTop: '0',
    width: '100%',
    display: 'flex',
    flexGrow: 1
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  drawerPaper: {
    backgroundColor: '#0600C4',
    overflowX: 'hidden',
    position: 'fixed',
    zIndex: 2,
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    backgroundColor: '#0600C4',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  menuOpened: {
    overflowY: 'scroll'
  },
  listItemColor: {
    color: '#0600C4'
  }
});

class Header extends React.Component {

  state = {
    open: false,
    fragment: 'viewUser',
    menuOpen: false
  };

  handleDrawerThroughAppBar = () => {
    this.setState((prevState) => ({
      open: !prevState.open
    }));
  };

  handleDrawerOpen = () => {
    // setTimeout(() => {
    this.setState(() => ({ open: true }));
    // }, 200)
  };

  handleDrawerClose = () => {
    // setTimeout(() => {
    this.setState(() => ({ open: false }));
    // }, 200)
  };

  render() {
    const { classes } = this.props;
    return (
        <div>
          <div style={{ backgroundColor: '#0600C4' }}
               className={classNames(classes.feed/*, this.state.open && classes.appBarShift*/)}>
            <AppBar
                position="fixed"
                style={{ backgroundColor: '#0600C4' }}
                className={classNames(classes.appBar/*, this.state.open && classes.appBarShift*/)}
            >
              <Toolbar style={{ padding: '0px' }}>
                <BlogIcon style={{ padding: '0 16px' }}/>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Typography variant="h6" color="inherit" style={{ cursor: 'default' }} noWrap>
                    Peerbits Blogs
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" color="inherit"
                                title="Email-Id"
                                style={{
                                  marginRight: '32px',
                                  fontSize: '1.2125rem',
                                  // fontWeight: 'bold',
                                  cursor: 'default'
                                }}>
                      {new Cookies().get('email_id')}
                    </Typography>
                    <Button
                        variant={"contained"}
                        color={"secondary"}
                        size="small"
                        style={{ margin: "0 8px" }}>
                      <Logout/>
                    </Button>
                  </div>
                </div>
              </Toolbar>
            </AppBar>
            {/*{*/}
            {/*this.state.fragment === 'viewUser' ? <ViewUser/> : (*/}
            {/*this.state.fragment === 'temp' ?*/}
            {/*<Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography> : ""*/}
            {/*)*/}
            {/*}*/}
          </div>
        </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(Header));

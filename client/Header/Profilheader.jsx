import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import { Meteor } from 'meteor/meteor';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
  listmenu: {
    root: {
      backgroundColor: '#191a1c',
      boxShadow: '0 4px 10px rgba(0,0,0,.35)',
			backgroundImage: 'none !important',
    }
  },
  subMenu: {
    left: '5px !important'
  }
});

class Profilheader extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      open: false,
      all: null,
      data: {
        Account: '/settings',
        Logout: '/logout'
    }
  }
  this.handleClick = this.handleClick.bind(this)
}

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  }

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  }
  
  handleClick = (e) => {
    e.preventDefault()
    Meteor.logout((err) => {
      if (err) throw err
    })
  }

  GoTo = (e, link) => {
    e.preventDefault()
    if (link === 'Logout') {
      this.handleClick(e)
    }
    else {
      this.props.browserHistory.push('/Settings')
      this.handleClose(e)
    }
  }
  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <div className={classes.root}>
        {/* <Paper className={classes.paper}>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>My account</MenuItem>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Paper> */}
        <div>
          {/* <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
            style={{color: '#cc7b19', fontFamily: 'Open Sans Bold,Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: '13px', textTransform: 'none'}}
          >
            Test
          </Button> */}
          <div ref={node => {
              this.anchorEl = node;
            }} className="profilpic" id="profilpic" onClick={this.handleToggle}>
            <img id="imgmaggle" src={this.props.image} alt='' style={{height:'40px'}}></img>
					</div>
          <Popper className={classes.subMenu} style={{zIndex: 5}} open={open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList classes={{root: 'menu-player-listItem'}} /* onClick={e => {this.handleClick(e)}} */>
                      {
                        Object.keys(this.state.data).map((val, index) => (
                          <MenuItem onClick={e => {this.GoTo(e, val)}} classes={{root: 'menu-player-item-list'}} key={index}><span style={{color: 'white', textTransform: 'none', cursor: 'pointer'}}>{val}</span></MenuItem>
                        ))
                      }
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
}

Profilheader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profilheader);

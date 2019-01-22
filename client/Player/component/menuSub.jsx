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
      backgroundImage: 'none !important'
    }
  }
});

class DropMenuSub extends React.Component {
  state = {
    open: false,
    all: null
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  Change = (e, qual) => {
    e.preventDefault()
    this.handleClose(e)
    this.props.changeSub(qual)
  }  

  render() {
    const { classes } = this.props;
    const { open, all } = this.state;

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
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
            style={{color: '#cc7b19', fontFamily: 'Open Sans Bold,Helvetica Neue,Helvetica,Arial,sans-serif', fontSize: '13px', textTransform: 'none'}}
          >
            {this.props.current === 'fr' ? 'French' : this.props.current === 'en' ? 'English' : 'none'}
          </Button>
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList classes={{root: 'menu-player-listItem'}}>
                    <MenuItem classes={{root: 'menu-player-item-list'}} onClick={e => this.Change(e, 'none')}><span style={this.props.current === 'none' ? {color: '#cc7b19', textTransform: 'none'} : {color: 'white', textTransform: 'none'}}>None</span>{this.props.current === 'none' ? <i style={{color: '#cc7b19'}} className="fas fa-check"></i> : '' }</MenuItem>
                      {
                        Object.keys(this.props.data).map((val, index) => (
                          <MenuItem classes={{root: 'menu-player-item-list'}} key={index} onClick={e => this.Change(e, val)}><span style={this.props.current === val ? {color: '#cc7b19', textTransform: 'none'} : {color: 'white', textTransform: 'none'}}>{val === 'fr' ? 'French' : 'English'}</span>{this.props.current === val ? <i style={{color: '#cc7b19'}} className="fas fa-check"></i> : '' }</MenuItem>
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

DropMenuSub.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DropMenuSub);

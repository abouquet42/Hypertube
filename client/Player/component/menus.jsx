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

class DropMenu extends React.Component {
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
    this.props.changeQual(qual)
  }  

  render() {
    const { classes, data } = this.props
    const { open, all } = this.state
    let hq = false
    let mq = false
    data.map((val, key) => {
      if (val.quality === '1080p' && !hq) {
        hq = true
      } else if (val.quality === '720p' && !mq) {
        mq = true
      } else
        delete data[key]
    })
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
            {this.props.current}
          </Button>
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal placement='top'>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: 'center top' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList classes={{root: 'menu-player-listItem'}}>
                      {
                        this.props.data.map((val, index) => (
                          <MenuItem classes={{root: 'menu-player-item-list'}} key={index} onClick={e => this.Change(e, val.quality)}><span style={this.props.current === val.quality ? {color: '#cc7b19', textTransform: 'none'} : {color: 'white', textTransform: 'none'}}>{val.quality}</span>{this.props.current === val.quality ? <i style={{color: '#cc7b19'}} className="fas fa-check"></i> : '' }</MenuItem>
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

DropMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DropMenu);

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = {
  root: {
    backgroundColor: 'rgba(97,97,97,0.4)'
  },
  normal: {
    fontSize: '18px',
  },
  selected: {
    fontSize: '18px',
    color: '#cc7b19 !important'
  }
};

class CenteredTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { classes, TabValue } = this.props;
    const { value } = this.state
    return (
      <Paper className={classes.root}>
        <Tabs
          value={TabValue}
          onChange={this.props.handleTabs}
          indicatorColor="primary"
          textColor="primary"
          centered
          fullWidth
          className='ceci-est-un-test'
        >
          <Tab className={TabValue === 0 ? classes.selected : classes.normal} label={this.props.page === 'prof' ? 'Profil' : "Settings"} />
          <Tab className={TabValue === 1 ? classes.selected : classes.normal} label="Movies" />
          <Tab className={TabValue === 2 ? classes.selected : classes.normal} label="Tv Shows" />
        </Tabs>
      </Paper>
    );
  }
}

CenteredTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CenteredTabs)

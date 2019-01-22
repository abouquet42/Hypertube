import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  colorSwitchBase: {
    color: 'grey',
    '&$colorChecked': {
      color: '#cc7b19',
      '& + $colorBar': {
        backgroundColor: '#cc7b19',
      },
    },
  },
  colorBar: {},
  colorChecked: {},
});

class SwitchDate extends React.Component {
  state = {
    checkedA: true,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked })
    this.props.onChange(event.target.checked)
  };

  render() {
    const { classes } = this.props;

    return (
      // <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.checkedA}
              onChange={this.handleChange('checkedA')}
              value="checkedA"
              classes={{
                switchBase: classes.colorSwitchBase,
                checked: classes.colorChecked,
                bar: classes.colorBar,
              }}
            />
          }
        />
      // </FormGroup>
    );
  }
}

SwitchDate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SwitchDate);

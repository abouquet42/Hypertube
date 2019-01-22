import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
})

class SelectType extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      type: ''
    }
  }
  render () {
    const { classes } = this.props
    return (
      <form style={{width: '100%', color:'#FFFFFF'}} className={classes.root} autoComplete='off'>
        <FormControl style={{width: '20%'}} className={classes.formControl}>
          <InputLabel htmlFor='type-helper' style={{color:'#FFFFFF'}}>Order by</InputLabel>
          <Select
            style={{width: '100%', color:'#FFFFFF'}}
            value={this.props.value}
            onChange={this.props.onChange}
            input={<Input style={{width: '100%'}} name='movie' id='type-helper' />}
          >
            <MenuItem selected value='asc' style={{color:'#FFFFFF'}}>Ascending</MenuItem>
            <MenuItem value='desc' style={{color:'#FFFFFF'}}>Descending</MenuItem>
          </Select>
        </FormControl>
      </form>
    )
  }
}

SelectType.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SelectType)

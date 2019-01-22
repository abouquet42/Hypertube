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
    minWidth: 120,
  },
  selectEmpty: {
    background: '#303030',
    marginTop: theme.spacing.unit * 2
  }
})

class SelectRating extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rating: ''
    }
  }
  render () {
    const { classes } = this.props
    return (
      <form style={{width: '100%', color:'#FFFFFF'}} className={classes.root} autoComplete='off'>
        <FormControl style={{width: '20%'}} className={classes.formControl}>
          <InputLabel htmlFor='rating-helper' style={{color:'#FFFFFF'}}>Rating</InputLabel>
          <Select
            style={{width: '100%', color:'#FFFFFF'}}
            value={this.props.value}
            onChange={this.props.onChange}
            input={<Input style={{width: '100%'}} name='movie' id='rating-helper' />}
          >
            <MenuItem selected value='' style={{color:'#FFFFFF'}}>All</MenuItem>
            <MenuItem value='9' style={{color:'#FFFFFF'}}>9+</MenuItem>
            <MenuItem value='8' style={{color:'#FFFFFF'}}>8+</MenuItem>
            <MenuItem value='7' style={{color:'#FFFFFF'}}>7+</MenuItem>
            <MenuItem value='6' style={{color:'#FFFFFF'}}>6+</MenuItem>
            <MenuItem value='5' style={{color:'#FFFFFF'}}>5+</MenuItem>
            <MenuItem value='4' style={{color:'#FFFFFF'}}>4+</MenuItem>
            <MenuItem value='3' style={{color:'#FFFFFF'}}>3+</MenuItem>
            <MenuItem value='2' style={{color:'#FFFFFF'}}>2+</MenuItem>
            <MenuItem value='1' style={{color:'#FFFFFF'}}>1+</MenuItem>
          </Select>
        </FormControl>
      </form>
    )
  }
}

SelectRating.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SelectRating)

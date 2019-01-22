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

class SelectSort extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sort: ''
    }
  }
  render () {
    const { classes } = this.props
    return (
      <form style={{width: '100%', color:'#FFFFFF'}} className={classes.root} autoComplete='off'>
        <FormControl style={{width: '20%'}} className={classes.formControl}>
          <InputLabel htmlFor='sort-helper' style={{color:'#FFFFFF'}}>Sort by</InputLabel>
          <Select
            style={{width: '100%', color:'#FFFFFF'}}
            value={this.props.value}
            onChange={this.props.onChange}
            input={<Input style={{width: '100%'}} name='movie' id='sort-helper' />}
          >
            <MenuItem selected value='download_count' style={{color:'#FFFFFF'}}>Download count</MenuItem>
            <MenuItem value='date_added' style={{color:'#FFFFFF'}}>Date added</MenuItem>
            <MenuItem value='peers' style={{color:'#FFFFFF'}}>Peers</MenuItem>
            <MenuItem value='seeds' style={{color:'#FFFFFF'}}>Seeds</MenuItem>
            <MenuItem value='rating' style={{color:'#FFFFFF'}}>Rating</MenuItem>
            <MenuItem value='title' style={{color:'#FFFFFF'}}>Title</MenuItem>
            <MenuItem value='year' style={{color:'#FFFFFF'}}>Year</MenuItem>
          </Select>
        </FormControl>
      </form>
    )
  }
}

SelectSort.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SelectSort)

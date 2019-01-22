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

class SearchInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      genre: ''
    }
  }
  render () {
    const { classes } = this.props
    return (
      <form style={{width: '100%', color:'#FFFFFF'}} className={classes.root} autoComplete='off'>
        <FormControl style={{width: 'auto'}} className={classes.formControl}>
          <InputLabel htmlFor='Search-helper' style={{color:'#FFFFFF'}}>Search</InputLabel>
            <Input onChange={this.props.onChange} value={this.props.value} onKeyPress={this.props.onKeyPress} style={{width: '100%'}} name='movie' id='Search-helper' />
        </FormControl>
      </form>
    )
  }
}

SearchInput.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SearchInput)

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

class SelectGenreTv extends React.Component {
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
        <FormControl style={{width: '20%'}} className={classes.formControl}>
          <InputLabel htmlFor='genre-helper' style={{color:'#FFFFFF'}}>Genre</InputLabel>
          <Select
            style={{width: '100%', color:'#FFFFFF'}}
            value={this.props.value}
            onChange={this.props.onChange}
            input={<Input style={{width: '100%'}} name='movie' id='genre-helper' />}
          >
            <MenuItem selected value='' style={{color:'#FFFFFF'}}>None</MenuItem>
            <MenuItem value='10759' style={{color:'#FFFFFF'}}>Action & Adventure</MenuItem>
            <MenuItem value='16' style={{color:'#FFFFFF'}}>Animation</MenuItem>
            <MenuItem value='35' style={{color:'#FFFFFF'}}>Comedy</MenuItem>
            <MenuItem value='80' style={{color:'#FFFFFF'}}>Crime</MenuItem>
            <MenuItem value='99' style={{color:'#FFFFFF'}}>Documentary</MenuItem>
            <MenuItem value='18' style={{color:'#FFFFFF'}}>Drama</MenuItem>
            <MenuItem value='10751' style={{color:'#FFFFFF'}}>Family</MenuItem>
            <MenuItem value='10762' style={{color:'#FFFFFF'}}>Kids</MenuItem>
            <MenuItem value='9648' style={{color:'#FFFFFF'}}>Mystery</MenuItem>
            <MenuItem value='10763' style={{color:'#FFFFFF'}}>News</MenuItem>
            <MenuItem value='10764' style={{color:'#FFFFFF'}}>Reality</MenuItem>
            <MenuItem value='10765' style={{color:'#FFFFFF'}}>Sci-Fi & Fantasy</MenuItem>
            <MenuItem value='10766' style={{color:'#FFFFFF'}}>Soap</MenuItem>
            <MenuItem value='10767' style={{color:'#FFFFFF'}}>Talk</MenuItem>
            <MenuItem value='10768' style={{color:'#FFFFFF'}}>War & Politics</MenuItem>
            <MenuItem value='37' style={{color:'#FFFFFF'}}>Western</MenuItem>
          </Select>
        </FormControl>
      </form>
    )
  }
}

SelectGenreTv.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SelectGenreTv)

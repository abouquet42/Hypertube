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

class SelectGenre extends React.Component {
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
          <InputLabel htmlFor='genre-helper' style={{color:'#FFFFFF'}}>Genre</InputLabel>
          <Select
            style={{width: '100%', color:'#FFFFFF'}}
            value={this.props.value}
            onChange={this.props.onChange}
            input={<Input style={{width: '100%'}} name='movie' id='genre-helper' />}
          >
            <MenuItem selected value='' style={{color:'#FFFFFF'}}>None</MenuItem>
            <MenuItem value='Action' style={{color:'#FFFFFF'}}>Action</MenuItem>
            <MenuItem value='Adventure' style={{color:'#FFFFFF'}}>Adventure</MenuItem>
            <MenuItem value='Animation' style={{color:'#FFFFFF'}}>Animation</MenuItem>
            <MenuItem value='Biography' style={{color:'#FFFFFF'}}>Biography</MenuItem>
            <MenuItem value='Comedy' style={{color:'#FFFFFF'}}>Comedy</MenuItem>
            <MenuItem value='Crime' style={{color:'#FFFFFF'}}>Crime</MenuItem>
            <MenuItem value='Documentary' style={{color:'#FFFFFF'}}>Documentary</MenuItem>
            <MenuItem value='Drama' style={{color:'#FFFFFF'}}>Drama</MenuItem>
            <MenuItem value='Family' style={{color:'#FFFFFF'}}>Family</MenuItem>
            <MenuItem value='Fantasy' style={{color:'#FFFFFF'}}>Fantasy</MenuItem>
            {/* <MenuItem value='Film Noir'>Film Noir</MenuItem> */}
            <MenuItem value='History' style={{color:'#FFFFFF'}}>History</MenuItem>
            <MenuItem value='Horror' style={{color:'#FFFFFF'}}>Horror</MenuItem>
            <MenuItem value='Music' style={{color:'#FFFFFF'}}>Music</MenuItem>
            <MenuItem value='Musical' style={{color:'#FFFFFF'}}>Musical</MenuItem>
            <MenuItem value='Mystery' style={{color:'#FFFFFF'}}>Mystery</MenuItem>
            <MenuItem value='Romance' style={{color:'#FFFFFF'}}>Romance</MenuItem>
            <MenuItem value='Sci-Fi' style={{color:'#FFFFFF'}}>Sci-Fi</MenuItem>
            {/* <MenuItem value='Short'>Short</MenuItem> */}
            <MenuItem value='Sport' style={{color:'#FFFFFF'}}>Sport</MenuItem>
            {/* <MenuItem value='Superhero'>Superhero</MenuItem> */}
            <MenuItem value='Thriller' style={{color:'#FFFFFF'}}>Thriller</MenuItem>
            <MenuItem value='War' style={{color:'#FFFFFF'}}>War</MenuItem>
            <MenuItem value='Western' style={{color:'#FFFFFF'}}>Western</MenuItem>
          </Select>
        </FormControl>
      </form>
    )
  }
}

SelectGenre.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SelectGenre)

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
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
})

class Subtitle extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      values: {},
      value: ''
    }
    this._handleValue = this._handleValue.bind(this)
    this.sref = null
  }
  componentWillMount = () => {
    let self = this
    Meteor.call('User.loged', (err, res) =>{
        if (!err) {
            self.setState({
                values: {
                userId: res._id,
                username: res.username,
                subtitles: res.profile.subtitles
                },
                value: res.profile.subtitles
            })
        }
    })
  }

  _handleValue = (e) => {
    e.preventDefault()
    this.setState({
      value: e.target.value
    })
    let subtitles = e.target.value
    let {userId, username} = this.state.values
    Meteor.call('Change.subtitles', {userId, username, subtitles}, (err, res) => {
      if (err) throw err
    })
    this.sref.innerText = "Subtitles updated successfully"
  }
  render () {
    const { classes } = this.props
    return (
      <form style={{color:'black'}} className={classes.root} autoComplete='off' onClick={e => e.stopPropagation()}>
        <FormControl style={{width: '20%'}} className={classes.formControl}>
          <InputLabel htmlFor='subtitles' style={{color:'#FFFFFF'}}>Subtitles</InputLabel>
          <Select
            style={{width: '100%', color:'#FFFFFF', }}
            value={this.state.value}
            onChange={this._handleValue}
            input={<Input style={{width: '100%'}} name='movie' id='subtitles' />}
          >
{/*             <MenuItem selected value='' style={{color:'#FFFFFF'}}>None</MenuItem> */}
            <MenuItem value='none' style={{color:'#FFFFFF'}}>None</MenuItem>
            <MenuItem value='fr' style={{color:'#FFFFFF'}}>French</MenuItem>
            <MenuItem value='en' style={{color:'#FFFFFF'}}>English</MenuItem>
          </Select>
          <div className="Form3">
            <span ref={ref => this.sref = ref} className='err-msg'></span>
        </div>
        </FormControl>
      </form>
    )
  }
}

Subtitle.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Subtitle)

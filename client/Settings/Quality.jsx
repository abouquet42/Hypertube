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

class Quality extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      values: {},
      value: 0
    }
    this._handleValue = this._handleValue.bind(this)
    this.qref = null
  }
  componentWillMount = () => {
    let self = this
    Meteor.call('User.loged', (err, res) =>{
        if (!err) {
            self.setState({
              values: {
                userId: res._id,
                username: res.username,
                quality: res.profile.quality,
              },
              value: res.profile.quality
            })
        }
    })
  }

  _handleValue = (e) => {
    e.preventDefault()
    this.setState({
      value: e.target.value
    })
    let quality = e.target.value
    let {userId, username} = this.state.values
    Meteor.call('Change.quality', {userId, username, quality}, (err, res) => {
      if (err) throw err
    })
    this.qref.innerText = "Quality updated successfully"
  }
  render () {
    const { classes } = this.props
    return (
      <form style={{color:'black'}} className={classes.root} autoComplete='off' onClick={e => e.stopPropagation()}>
        <FormControl style={{width: '20%'}} className={classes.formControl}>
          <InputLabel htmlFor='quality' style={{color:'#FFFFFF'}}>Quality</InputLabel>
          <Select
            style={{width: '100%', color:'#FFFFFF', }}
            value={this.state.value}
            onChange={this._handleValue}
            input={<Input style={{width: '100%'}} name='movie' id='quality' />}
          >
{/*             <MenuItem selected value='' style={{color:'#FFFFFF'}}>None</MenuItem> */}
            <MenuItem value='240p' style={{color:'#FFFFFF'}}>240p</MenuItem>
            <MenuItem value='480p' style={{color:'#FFFFFF'}}>480p</MenuItem>
            <MenuItem value='720p' style={{color:'#FFFFFF'}}>720p</MenuItem>
            <MenuItem value='1080p' style={{color:'#FFFFFF'}}>1080p</MenuItem>
          </Select>
          <div className="Form3">
            <span ref={ref => this.qref = ref} className='err-msg'></span>
        </div>
        </FormControl>
      </form>
    )
  }
}

Quality.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Quality)

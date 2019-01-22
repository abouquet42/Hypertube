import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import RenderRoutes from './Routes'
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true
// import 'font-awesome/css/font-awesome.min.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'mdbreact/dist/css/mdb.css'
// import 'semantic-ui-css/semantic.min.css'
// import axios from 'axios'

import "font-awesome/css/font-awesome.min.css"
import "bootstrap-css-only/css/bootstrap.min.css"
import "mdbreact/dist/css/mdb.css"

Meteor.startup(() => {
  ValidateForm.config({
    debug: true
  })
  Meteor.absoluteUrl.defaultOptions.rootUrl = 'https://localhost:5000/'
  render(<RenderRoutes />, document.getElementById('react-target'))
})

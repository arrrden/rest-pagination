import React from 'react'
import { Link, Route, useHistory } from 'react-router-dom'

import { ENDPOINT, STUB } from './config'

import { Login } from './components/Login/Login'

export const App = () => {
  const history = useHistory()

  const handleRedirect = (route: string) => {
    history.push(`/${route}`)
  }

  return (
    <div data-testid='app'>
      <div>
        <Link to='/'>home</Link>
        <Link to='/login'>login</Link>
      </div>
      <Route exact path='/'>
        <h1>yo go log in</h1>
      </Route>
      <Route exact path='/login'>
        <Login url={ENDPOINT} handleRedirect={handleRedirect}/>
      </Route>
      <Route exact path='/dashboard'>beep bop</Route>
    </div>
  )
}

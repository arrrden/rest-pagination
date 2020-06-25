import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { handleLogin } from '../../auth/handleAuthentication'

export const Login = ({ url, handleRedirect, setCurrentUser }:{url: string; handleRedirect: any, setCurrentUser: any}) => {
  const history = useHistory()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [response, setResponse] = useState<any>()

  // @ts-ignore
  const { from } = location.state || { from: { pathname: '/dashboard' } }

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>, url:string, u:string, p:string) => {
    e.preventDefault()
    const result = await handleLogin(url, u, p)
    setResponse(result)
    setCurrentUser(email)
    console.log('result: ', result)
    if (result === 'success') { history.replace(from) }
  }

  return (
    <div data-testid='login'>
      <form data-testid='form' onSubmit={(e) => {
        setResponse('loading...')
        handleSubmit(e, url, email, password)
      }}>
        <input type='text' placeholder='email' autoComplete='email' onChange={(e) => { setEmail(e.target.value) }}/>
        {/* TODO: sanitise! */}
        <input type='password' placeholder='password' autoComplete='current-password' onChange={(e) => { setPassword(e.target.value) }}/>
        <input data-testid='submit' type='submit'/>
      </form>
      {email}
      {password}
      {response}
    </div>
  )
}

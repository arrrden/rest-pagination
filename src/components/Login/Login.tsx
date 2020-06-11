import React, { useState, useEffect } from 'react'

import { handleLogin } from '../../auth/handleAuthentication'
import { Route, Redirect } from 'react-router-dom'

export const Login = ({ url, handleRedirect }:{url: string; handleRedirect: any}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [response, setResponse] = useState<any>()

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>, url:string, u:string, p:string) => {
    e.preventDefault()
    return await handleLogin(url, u, p)
  }

  return (
    <div data-testid='login'>
      <form data-testid='form' onSubmit={
        async (e) => {
          setResponse('loading...')
          const result = await handleSubmit(e, url, email, password)
          setResponse(result)
          console.log(result)
          if (result === 'success') handleRedirect('dashboard')
        }
      }>
        <input type='text' placeholder='email' onChange={(e) => { setEmail(e.target.value) }}/>
        {/* TODO: sanitise! */}
        <input type='password' placeholder='password' onChange={(e) => { setPassword(e.target.value) }}/>
        <input data-testid='submit' type='submit'/>
      </form>
      {email}
      {password}
      {response}
    </div>
  )
}

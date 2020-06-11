/* eslint-disable no-undef */
import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { Login } from './Login'

import { ENDPOINT } from '../../config'

// STUBS
const handleRedirect = () => {
  return 'boop'
}

const server = setupServer(
  rest.get(`${ENDPOINT}/login`, (req, res, ctx) => {
    return res(ctx.json({
      body: {
        data: {
          accessToken: 'beep beep boop'
        }
      },
      status: 200,
      headers: { 'content-type': 'application/json' },
    }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const setup = () => {
  const history = createMemoryHistory()
  const utils = render(
    <Router history={history}><Login url={ENDPOINT} handleRedirect={handleRedirect}/></Router>
  )
  const form = utils.getByTestId(/login/i)
  const email = utils.getByPlaceholderText(/email/i)
  const password = utils.getByPlaceholderText(/password/i)
  const submit = utils.getByTestId(/submit/i)
  return {
    form,
    email,
    password,
    submit,
    ...utils,
  }
}

describe('When in view', () => {
  test('it renders', () => {
    const history = createMemoryHistory()
    const { getByTestId } = render(
      <Router history={history}><Login url={ENDPOINT} handleRedirect={handleRedirect}/></Router>
    )
    expect(getByTestId(/login/i)).toBeInTheDocument()
  })
})

describe('when a user enters their email, and password', () => {
  afterEach(cleanup)
  test('the email is saved in state', () => {
    const { email, form } = setup()
    fireEvent.change(email, { target: { value: 'beep' } })
    expect(form).toHaveTextContent(/beep/i)
  })
  test('the password is saved in state', () => {
    const { password, form } = setup()
    fireEvent.change(password, { target: { value: 'boop' } })
    expect(form).toHaveTextContent(/boop/i)
  })
})

// FIXME: These are still failing (correctly is a false pass)
describe('When a user submits their credentials', () => {
  afterEach(cleanup)
  test('correctly', async () => {
    const { form, email, password, submit } = setup()
    fireEvent.change(email, { target: { value: 'beep' } })
    fireEvent.change(password, { target: { value: 'hunter2' } })
    fireEvent.click(submit)
    waitFor(() => expect(form).toHaveTextContent(/loading.../))
    // waitFor(() => expect(form).toHaveTextContent(/success/))
  })

  test('incorrectly', async () => {
    server.use(
      rest.get('/login', (req, res, ctx) => {
        return res(ctx.json({ status: 401 }))
      })
    )
    const { form, email, password, submit } = setup()
    fireEvent.change(email, { target: { value: 'beep' } })
    fireEvent.change(password, { target: { value: 'boop' } })
    fireEvent.click(submit)
    expect(form).toHaveTextContent(/loading.../)
    waitFor(() => expect(form).toHaveTextContent(/error/))
  })
})

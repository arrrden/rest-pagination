/* eslint-disable quote-props */
/* eslint-disable no-undef */
import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { Dashboard } from './Dashboard'

import { ENDPOINT } from '../../config'

// STUBS
const handleRedirect = () => {
  return 'boop'
}

localStorage.setItem('token', 'beep beep boop')
const server = setupServer(
  rest.get('/dashboard', (req, res, ctx) => {
    return res(ctx.json({
      body: {
        apps: [{ name: 'beep', logo: 'https://boop.com/img.png', data: 'no' }]
      },
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      },
    }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const setup = () => {
  const history = createMemoryHistory()
  const utils = render(
    <Router history={history}><Dashboard url={ENDPOINT} currentUser={''}/></Router>
  )
  const dashboard = utils.getByTestId(/dashboard/i)
  const card = utils.getAllByTestId(/card/i)
  return {
    dashboard,
    card,
    ...utils,
  }
}

describe('When in view', () => {
  test('it renders', () => {
    const history = createMemoryHistory()
    act(() => {
      render(
        <Router history={history}><Dashboard url={ENDPOINT} currentUser={''}/></Router>
      )
    })
    expect(screen.getByTestId(/dashboard/i)).toBeInTheDocument()
    expect(screen.getByTestId(/dashboard/i)).toHaveTextContent('loading...')
    waitFor(() => expect(screen.getByTestId(/dashboard/i)).toHaveTextContent('beep'))
  })
})

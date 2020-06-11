/* eslint-disable no-undef */
import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { App } from './App'

const history = createMemoryHistory()

describe('When loading the app', () => {
  test('it renders without crashing', () => {
    const { getByTestId } = render(<Router history={history}><App /></Router>)
    const app = getByTestId(/app/i)
    expect(app).toBeInTheDocument()
  })
  test('it contains a link to login', () => {
    const { getByText } = render(<Router history={history}><App /></Router>)
    const login = getByText(/login/i)
    expect(login).toBeInTheDocument()
  })
})

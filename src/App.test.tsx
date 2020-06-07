/* eslint-disable no-undef */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { App } from './App'

describe('When loading the app', () => {
  test('it renders without crashing', () => {
    const { getByTestId } = render(<App />)
    expect(getByTestId('app')).toBeInTheDocument()
  })
})

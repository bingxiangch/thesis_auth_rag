// Author: Oskari Niskanen

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Footer } from '../components/Footer'
import { BrowserRouter as Router } from 'react-router-dom'
import * as hooks from '../common/AuthProvider'

beforeEach(() => {
  jest.clearAllMocks()
})

test('that quick links are displayed when logged in', async () => {
  // Quick useAuth hook mock to prevent errors.
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ user: { username: 'test', role: 'admin_user' } }))
  // Footer must be wrapped in Router as it contains Link-elements.
  render(
    <Router>
      <Footer />
    </Router>
  )
  expect(screen.getByText('Quick links')).toBeInTheDocument()
  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(screen.getByText('Devices')).toBeInTheDocument()
  expect(screen.getByText('Map')).toBeInTheDocument()
  expect(screen.getByText('Users')).toBeInTheDocument()
})

test('that quick links are not displayed when not logged in', async () => {
  jest.spyOn(hooks, 'useAuth').mockImplementation(() => ({ user: null }))
  render(
    <Router>
      <Footer />
    </Router>
  )
  expect(screen.queryByText('Quick links')).not.toBeInTheDocument()
  expect(screen.queryByText('Home')).not.toBeInTheDocument()
  expect(screen.queryByText('Devices')).not.toBeInTheDocument()
  expect(screen.queryByText('Map')).not.toBeInTheDocument()
  expect(screen.queryByText('Users')).not.toBeInTheDocument()
})

test('that users link is not displayed if not admin user', async () => {
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ user: { username: 'test', role: 'basic_user' } }))
  render(
    <Router>
      <Footer />
    </Router>
  )
  expect(screen.queryByText('Users')).not.toBeInTheDocument()
})

test('that Huld logo is shown', async () => {
  jest.spyOn(hooks, 'useAuth').mockImplementation(() => ({ user: null }))
  render(
    <Router>
      <Footer />
    </Router>
  )
  expect(screen.getAllByText('Huld logo')).toHaveLength(1)
})

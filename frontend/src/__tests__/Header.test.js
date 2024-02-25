// Author: Oskari Niskanen

import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from '../components/Header'
import { BrowserRouter as Router } from 'react-router-dom'
import * as hooks from '../common/AuthProvider'

const mockLogout = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

test('that user name is displayed if logged in', async () => {
  jest.spyOn(hooks, 'useAuth').mockImplementation(() => ({
    handleLogout: mockLogout,
    user: { username: 'test', role: 'admin_user' }
  }))
  render(
    <Router>
      <Header />
    </Router>
  )
  expect(screen.getByText('test')).toBeInTheDocument()
})

test('that menu links are shown if logged in', async () => {
  jest.spyOn(hooks, 'useAuth').mockImplementation(() => ({
    handleLogout: mockLogout,
    user: { username: 'test', role: 'admin_user' }
  }))
  render(
    <Router>
      <Header />
    </Router>
  )
  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(screen.getByText('Devices')).toBeInTheDocument()
  expect(screen.getByText('Map')).toBeInTheDocument()
  expect(screen.getByText('Users')).toBeInTheDocument()
  expect(screen.getByText('Log Out')).toBeInTheDocument()
})

test('that menu links are not shown if not logged in', async () => {
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ handleLogout: mockLogout, user: null }))
  render(
    <Router>
      <Header />
    </Router>
  )
  expect(screen.queryByText('Home')).not.toBeInTheDocument()
  expect(screen.queryByText('Devices')).not.toBeInTheDocument()
  expect(screen.queryByText('Map')).not.toBeInTheDocument()
  expect(screen.queryByText('Users')).not.toBeInTheDocument()
  expect(screen.queryByText('Log Out')).not.toBeInTheDocument()
})

test('that user name is not displayed if not logged in', async () => {
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ handleLogout: mockLogout, user: null }))
  render(
    <Router>
      <Header />
    </Router>
  )
  expect(screen.queryByText('test')).not.toBeInTheDocument()
})

test('that users link is not displayed if not admin user', async () => {
  jest.spyOn(hooks, 'useAuth').mockImplementation(() => ({
    handleLogout: mockLogout,
    user: { username: 'test', role: 'basic_user' }
  }))
  render(
    <Router>
      <Header />
    </Router>
  )
  expect(screen.queryByText('Users')).not.toBeInTheDocument()
})

test('that Huld logo is shown', async () => {
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ handleLogout: mockLogout, user: null }))
  render(
    <Router>
      <Header />
    </Router>
  )
  expect(screen.getAllByText('Huld logo')).toHaveLength(1)
})

test('that log out button click calls hook', async () => {
  jest.spyOn(hooks, 'useAuth').mockImplementation(() => ({
    handleLogout: mockLogout,
    user: { username: 'test', role: 'basic_user' }
  }))
  render(
    <Router>
      <Header />
    </Router>
  )
  fireEvent.click(screen.queryByText('Log Out'))
  expect(mockLogout).toHaveBeenCalled()
  expect(mockLogout).toHaveBeenCalledTimes(1)
})

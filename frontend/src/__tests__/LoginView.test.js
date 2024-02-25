// Author: Oskari Niskanen

import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LoginView } from '../components/LoginView'

const mockLogin = jest.fn()

// useAuth hook mock definition
const useAuthMock = () => {
  return { handleLogin: mockLogin, err: null, loading: false }
}
// Actual mocking process of useAuth hook
jest.mock('../common/AuthProvider', () => ({
  ...jest.requireActual('../common/AuthProvider'),
  useAuth: useAuthMock
}))

test('that empty input field values are not accepted', async () => {
  render(<LoginView />)
  fireEvent.click(screen.getByText('Login'))
  expect(screen.getByText('Empty input field value(s).')).toBeDefined()
})

test('that empty password is not accepted', async () => {
  render(<LoginView />)
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'Test' } })
  fireEvent.click(screen.getByText('Login'))
  expect(screen.getByText('Empty input field value(s).')).toBeDefined()
})

test('that empty username is not accepted', async () => {
  render(<LoginView />)
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Test' } })
  fireEvent.click(screen.getByText('Login'))
  expect(screen.getByText('Empty input field value(s).')).toBeDefined()
})

test('that username and password are passed to login', async () => {
  render(<LoginView />)
  fireEvent.change(screen.getByPlaceholderText('Username'), {
    target: { value: 'testuser' }
  })
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: 'testpass' }
  })
  fireEvent.click(screen.getByText('Login'))
  await expect(mockLogin).toHaveBeenCalled()
  await expect(mockLogin).toHaveBeenCalledTimes(1)
  await expect(mockLogin).toHaveBeenCalledWith({
    username: 'testuser',
    password: 'testpass'
  })
})

test('that whitespace is trimmed from input', async () => {
  render(<LoginView />)
  fireEvent.change(screen.getByPlaceholderText('Username'), {
    target: { value: '  testuser  ' }
  })
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: '  testpass  ' }
  })
  fireEvent.click(screen.getByText('Login'))
  await expect(mockLogin).toHaveBeenCalledWith({
    username: 'testuser',
    password: 'testpass'
  })
})

// Author: Oskari Niskanen

import { render, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import mockAxios from 'jest-mock-axios'
import { UsersView } from '../components/UsersView'
import * as hooks from '../common/AuthProvider'

const dummyResponse = [
  {
    id: 1,
    username: 'test1',
    role: 'admin_user'
  },
  {
    id: 2,
    username: 'test2',
    role: 'basic_user'
  }
]

window.matchMedia = (query) => ({
  matches: true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
})

afterEach(() => {
  mockAxios.reset()
  jest.restoreAllMocks()
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('that users are listed on the page', async () => {
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ user: { username: 'test', role: 'admin_user' } }))
  render(<UsersView />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  expect(screen.getByText('test1')).toBeInTheDocument()
  expect(screen.getByText('Admin')).toBeInTheDocument()
  expect(screen.getByText('test2')).toBeInTheDocument()
  expect(screen.getByText('Basic')).toBeInTheDocument()
})

test('that buttons are rendered on the page', async () => {
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ user: { username: 'test', role: 'admin_user' } }))
  render(<UsersView />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  expect(screen.getAllByText('Edit')).toHaveLength(2)
  expect(screen.getAllByText('Delete')).toHaveLength(2)
  expect(screen.getByText('Create user')).toBeInTheDocument()
})

test('that create new user modal can be opened and closed', async () => {
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ user: { username: 'test', role: 'admin_user' } }))
  render(<UsersView />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getByText('Create user'))
  expect(screen.getByText('Save changes')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Close modal'))
  expect(screen.queryByText('Save changes')).not.toBeInTheDocument()
})

test('that edit user modal can be opened and closed', async () => {
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ user: { username: 'test', role: 'admin_user' } }))
  render(<UsersView />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getAllByText('Edit')[0])
  expect(screen.getByText('Edit user')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Close'))
  expect(screen.queryByText('Edit user')).not.toBeInTheDocument()
})

test('that delete user modal can be opened and closed', async () => {
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ user: { username: 'test', role: 'admin_user' } }))
  render(<UsersView />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getAllByText('Delete')[0])
  expect(screen.getByText('Delete user')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Close modal'))
  expect(screen.queryByText('Delete user')).not.toBeInTheDocument()
})

test('that new user can be created', async () => {
  jest
    .spyOn(hooks, 'useAuth')
    .mockImplementation(() => ({ user: { username: 'test', role: 'admin_user' } }))
  render(<UsersView />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getByText('Create user'))
  fireEvent.input(screen.getByLabelText('Username'), { target: { value: 'test3' } })
  fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'testpass' } })
  fireEvent.input(screen.getByLabelText('Confirm password'), {
    target: { value: 'testpass' }
  })
  fireEvent.click(screen.getByText('Save changes'))
  act(() => {
    mockAxios.mockResponse({
      status: 200
    })
  })
  expect(mockAxios.post).toHaveBeenCalledWith(expect.stringContaining('/users'), {
    password: 'testpass',
    username: 'test3',
    role: 'basic_user'
  })
})

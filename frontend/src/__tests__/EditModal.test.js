// Author: Lauri Pitkäjärvi & Oskari Niskanen

import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import mockAxios from 'jest-mock-axios'
import { EditModal } from '../components/EditModal'

const testUser = { username: 'Test', role: 'basic_user' }

// useAuth hook mocks
const mockLogout = jest.fn()

// Defining useAuth mock function
const useAuthMock = () => {
  return { handleLogout: mockLogout, user: { username: 'Test' } }
}
// Replacing hook with mock hook.
jest.mock('../common/AuthProvider', () => ({
  ...jest.requireActual('../common/AuthProvider'),
  useAuth: useAuthMock
}))

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  mockAxios.reset()
})

test('that edit card is shown when opened', async () => {
  render(<EditModal open={true} clickedUser={testUser} />)
  expect(screen.getByText('Edit user')).toBeInTheDocument()
})

test('that edit card is not shown when not opened', async () => {
  render(<EditModal open={false} clickedUser={testUser} />)
  expect(screen.queryByText('Edit user')).not.toBeInTheDocument()
})

test('that edit card can be closed', async () => {
  const closeMock = jest.fn()
  render(<EditModal open={true} onClose={closeMock} clickedUser={testUser} />)
  fireEvent.click(screen.getByText('Close'))
  expect(closeMock).toHaveBeenCalled()
})

test('that error message is shown when passwords do not match', async () => {
  render(<EditModal open={true} onClose={jest.fn()} clickedUser={testUser} />)
  fireEvent.input(screen.getByLabelText('Password'), { target: { value: '12345' } })
  fireEvent.input(screen.getByLabelText('Confirm password'), { target: { value: '123' } })
  fireEvent.click(screen.getByText('Save changes'))
  expect(screen.getByText('Passwords do not match!')).toBeInTheDocument()
})

test('that editing themselves works and logs them out after', async () => {
  const user = userEvent.setup()
  render(<EditModal open={true} onClose={jest.fn()} clickedUser={testUser} />)
  fireEvent.input(screen.getByLabelText('Username'), { target: { value: 'Test1' } })
  fireEvent.input(screen.getByLabelText('Password'), { target: { value: '12345' } })
  fireEvent.input(screen.getByLabelText('Confirm password'), {
    target: { value: '12345' }
  })
  expect(screen.getByRole('option', { name: /Basic user/i }).selected).toBeTruthy()
  await user.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', { name: 'Admin user' })
  )
  fireEvent.click(screen.getByText('Save changes'))
  await act(() => {
    mockAxios.mockResponse({ data: [] })
  })
  expect(mockAxios.put).toHaveBeenCalledWith(expect.stringContaining('/users/Test'), {
    username: 'Test1',
    password: '12345',
    role: 'admin_user'
  })
  // Checking that logout is called because user is editing themselves.
  expect(mockLogout).toHaveBeenCalled()
})

test('that editing other user does not log out the editor', async () => {
  render(
    <EditModal
      open={true}
      onClose={jest.fn()}
      clickedUser={{ username: 'otherUser', role: 'basic_user' }}
    />
  )
  fireEvent.input(screen.getByLabelText('Username'), { target: { value: 'Test1' } })
  fireEvent.click(screen.getByText('Save changes'))
  await act(() => {
    mockAxios.mockResponse({ data: [] })
  })
  expect(mockAxios.put).toHaveBeenCalledWith(
    expect.stringContaining('/users/otherUser'),
    { username: 'Test1' }
  )
  expect(mockLogout).not.toHaveBeenCalled()
})

test('that error message is shown when api returns error', async () => {
  render(<EditModal open={true} onClose={jest.fn()} clickedUser={testUser} />)
  fireEvent.click(screen.getByText('Save changes'))
  await act(() => {
    mockAxios.mockError({
      err: 'Error.'
    })
  })
  expect(screen.getByText('Network error.')).toBeInTheDocument()
})

test('that loading spinner is shown after saving changes', async () => {
  render(<EditModal open={true} onClose={jest.fn()} clickedUser={testUser} />)
  fireEvent.click(screen.getByText('Save changes'))
  expect(screen.getByLabelText('Loading Spinner')).toBeInTheDocument()
  await act(() => {
    mockAxios.mockResponse({
      data: []
    })
  })
})

test('that making no changes and saving is accepted', async () => {
  const mockClose = jest.fn()
  render(<EditModal open={1} onClose={mockClose} clickedUser={testUser} />)
  fireEvent.click(screen.getByText('Save changes'))
  expect(mockAxios.put).toHaveBeenCalled()
})

test('that missing password confirmation is not accepted', async () => {
  render(<EditModal open={1} onClose={jest.fn()} clickedUser={testUser} />)
  fireEvent.change(screen.getByPlaceholderText(testUser.username), {
    target: { value: 'Test' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[0], {
    target: { value: 'Test' }
  })
  fireEvent.click(screen.getByText('Save changes'))
  expect(screen.getByText('Passwords do not match!')).toBeDefined()
})

test('that new username and new password are passed', async () => {
  render(<EditModal open={1} onClose={jest.fn()} clickedUser={testUser} />)
  fireEvent.change(screen.getByPlaceholderText(testUser.username), {
    target: { value: 'Test2' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[0], {
    target: { value: 'Test2' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[1], {
    target: { value: 'Test2' }
  })
  fireEvent.click(screen.getByText('Save changes'))
  await act(() => {
    mockAxios.mockResponse({ data: [] })
  })
  expect(mockAxios.put).toHaveBeenCalled()
  expect(mockAxios.put).toHaveBeenCalledTimes(1)
  expect(mockAxios.put).toHaveBeenCalledWith(expect.stringContaining('/users/Test'), {
    username: 'Test2',
    password: 'Test2'
  })
})

test('that everything can be changed', async () => {
  render(<EditModal open={1} onClose={jest.fn()} clickedUser={testUser} />)
  fireEvent.change(screen.getByPlaceholderText(testUser.username), {
    target: { value: 'Test2' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[0], {
    target: { value: 'Test2' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[1], {
    target: { value: 'Test2' }
  })
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'admin_user' }
  })
  fireEvent.click(screen.getByText('Save changes'))
  await act(() => {
    mockAxios.mockResponse({ data: [] })
  })
  expect(mockAxios.put).toHaveBeenCalled()
  expect(mockAxios.put).toHaveBeenCalledTimes(1)
  expect(mockAxios.put).toHaveBeenCalledWith(expect.stringContaining('/users/Test'), {
    username: 'Test2',
    password: 'Test2',
    role: 'admin_user'
  })
})

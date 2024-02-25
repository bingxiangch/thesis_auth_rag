// Author: Lauri Pitkäjärvi & Oskari Niskanen

import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DeleteModal } from '../components/DeleteModal'
import mockAxios from 'jest-mock-axios'

const mockLogout = jest.fn()
const mockClose = jest.fn()
// Defining useAuth hook mock to provide mock logout functionality and contain user
const useAuthMock = () => {
  return { handleLogout: mockLogout, user: { username: 'Test' } }
}

// Replacing AuthProvider useAuth hook with our mocked useAuth hook.
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

const testUser = { username: 'Test', role: 'admin_user' }

test('that DeleteModal window can be closed without deleting user', async () => {
  render(<DeleteModal open={1} onClose={mockClose} clickedUser={testUser} />)
  fireEvent.click(screen.getByText('Cancel'))
  expect(mockClose).toHaveBeenCalled()
  expect(mockAxios.delete).not.toHaveBeenCalled()
})

test('that user can be deleted', async () => {
  render(<DeleteModal open={1} onClose={mockClose} clickedUser={testUser} />)
  fireEvent.click(screen.getByText('Delete'))
  expect(mockAxios.delete).toHaveBeenCalledWith(expect.stringContaining('/users/Test'))
})

test('that logout is called if user deletes themself', async () => {
  render(<DeleteModal open={1} clickedUser={testUser} />)
  fireEvent.click(screen.getByText('Delete'))
  expect(mockAxios.delete).toHaveBeenCalledWith(expect.stringContaining('/users/Test'))
  act(() => {
    mockAxios.mockResponse('Succesfully deleted user.')
  })
  expect(mockLogout).toHaveBeenCalled()
})

test('that logout is not called if user delete some other user', async () => {
  render(
    <DeleteModal
      open={1}
      onClose={mockClose}
      clickedUser={{ username: 'User1', role: 'basic_user' }}
    />
  )
  fireEvent.click(screen.getByText('Delete'))
  expect(mockAxios.delete).toHaveBeenCalledWith(expect.stringContaining('/users/User1'))
  act(() => {
    mockAxios.mockResponse('Succesfully deleted user.')
  })
  expect(mockLogout).not.toHaveBeenCalled()
  expect(mockClose).toHaveBeenCalled()
})

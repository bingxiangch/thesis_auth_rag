// Author: Lauri Pitkäjärvi

import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CreateModal } from '../components/CreateModal'
import mockAxios from 'jest-mock-axios'

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  mockAxios.reset()
})

test('that CreateModal window can be closed', async () => {
  const mockClose = jest.fn()
  render(<CreateModal open={1} onClose={mockClose} />)
  fireEvent.click(screen.getByText('Close'))
  expect(mockClose).toHaveBeenCalled()
})

test('that empty input field values are not accepted', async () => {
  render(<CreateModal open={1} />)
  fireEvent.click(screen.getByText('Save changes'))
  expect(screen.getByText('Missing field(s)!')).toBeDefined()
})

test('that empty password is not accepted', async () => {
  render(<CreateModal open={1} />)
  fireEvent.change(screen.getByPlaceholderText('username'), {
    target: { value: 'Test' }
  })
  fireEvent.click(screen.getByText('Save changes'))
  expect(screen.getByText('Missing field(s)!')).toBeDefined()
})

test('that empty username is not accepted', async () => {
  render(<CreateModal open={1} />)
  fireEvent.change(screen.getAllByPlaceholderText('Password')[0], {
    target: { value: 'Test' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[1], {
    target: { value: 'Test' }
  })
  fireEvent.click(screen.getByText('Save changes'))
  expect(screen.getByText('Missing field(s)!')).toBeDefined()
})

test('that non-matching passwords are not accepted', async () => {
  render(<CreateModal open={1} />)
  fireEvent.change(screen.getByPlaceholderText('username'), {
    target: { value: 'Test' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[0], {
    target: { value: 'Test' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[1], {
    target: { value: 'NoTest' }
  })
  fireEvent.click(screen.getByText('Save changes'))
  expect(screen.getByText('Passwords do not match!')).toBeDefined()
})

test('that missing password corfimation is not accepted', async () => {
  render(<CreateModal open={1} />)
  fireEvent.change(screen.getByPlaceholderText('username'), {
    target: { value: 'Test' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[0], {
    target: { value: 'Test' }
  })
  fireEvent.click(screen.getByText('Save changes'))
  expect(screen.getByText('Missing field(s)!')).toBeDefined()
})

test('that username, password and role are passed', async () => {
  render(<CreateModal open={1} onClose={jest.fn()} />)
  fireEvent.change(screen.getByPlaceholderText('username'), {
    target: { value: 'Test' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[0], {
    target: { value: 'Test' }
  })
  fireEvent.change(screen.getAllByPlaceholderText('Password')[1], {
    target: { value: 'Test' }
  })
  fireEvent.click(screen.getByText('Save changes'))
  await act(() => {
    mockAxios.mockResponse({ data: [] })
  })
  expect(mockAxios.post).toHaveBeenCalled()
  expect(mockAxios.post).toHaveBeenCalledTimes(1)
  expect(mockAxios.post).toHaveBeenCalledWith(expect.stringContaining('/users'), {
    username: 'Test',
    password: 'Test',
    role: 'basic_user'
  })
})

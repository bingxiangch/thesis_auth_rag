// Author: Oskari Niskanen

import { render, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import mockAxios from 'jest-mock-axios'
import { DevicesView } from '../components/DevicesView'
import { BrowserRouter as Router } from 'react-router-dom'

// Mocking match media as the pagination (in this component) uses it to react to size changes.
window.matchMedia = (query) => ({
  matches: true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
})

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  mockAxios.reset()
  jest.restoreAllMocks()
})

test('that component renders with no devices', async () => {
  render(
    <Router>
      <DevicesView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: { devices: [], deviceCount: 0 }
    })
  })
  expect(
    screen.getByText('No devices found with the selected filter.')
  ).toBeInTheDocument()
  expect(screen.getByText('0 devices')).toBeInTheDocument()
})

test('that component renders with 2 devices', async () => {
  render(
    <Router>
      <DevicesView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: {
        devices: [
          {
            device_id: 123,
            create_time: '2022-11-30T00:00:00.000Z',
            state: 'Operational'
          },
          { device_id: 124, create_time: '2022-11-30T00:00:00.000Z', state: 'Shutdown' }
        ],
        deviceCount: 2
      }
    })
  })
  expect(screen.getByText('123')).toBeInTheDocument()
  expect(screen.getByText('124')).toBeInTheDocument()
  expect(screen.getByText('Operational')).toBeInTheDocument()
  expect(screen.getByText('Shutdown')).toBeInTheDocument()
  expect(screen.getByText('2 devices')).toBeInTheDocument()
})

test('that bottom pagination is not shown if less than 10 devices', async () => {
  render(
    <Router>
      <DevicesView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: {
        devices: [
          {
            device_id: 123,
            create_time: '2022-11-30T00:00:00.000Z',
            state: 'Operational'
          }
        ],
        deviceCount: 1
      }
    })
  })
  expect(screen.getAllByText('Page 1 / 1')).toHaveLength(1)
})

test('that bottom pagination is is shown when more than 10 devices', async () => {
  render(
    <Router>
      <DevicesView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: {
        devices: [
          {
            device_id: 123,
            create_time: '2022-11-30T00:00:00.000Z',
            state: 'Operational'
          }
        ],
        deviceCount: 11
      }
    })
  })
  expect(screen.getAllByText('Page 1 / 1')).toHaveLength(2)
})

test('that switching to card view works', async () => {
  render(
    <Router>
      <DevicesView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: {
        devices: [
          {
            device_id: 123,
            create_time: '2022-11-30T00:00:00.000Z',
            state: 'Operational'
          }
        ],
        deviceCount: 1
      }
    })
  })
  fireEvent.click(screen.getByText('Cards'))
  // ID is a heading of the list, so it should not be visible if card view is shown.
  expect(screen.queryByText('ID')).not.toBeInTheDocument()
})

test('that api error logs to console', async () => {
  render(
    <Router>
      <DevicesView />
    </Router>
  )
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  act(() => {
    mockAxios.mockError({
      err: 'Error.'
    })
  })
  expect(consoleSpy).toHaveBeenCalled()
})

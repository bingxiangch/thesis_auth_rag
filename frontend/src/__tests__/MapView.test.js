// Author: Oskari Niskanen

import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import mockAxios from 'jest-mock-axios'
import { MapView } from '../components/MapView'
import { BrowserRouter as Router } from 'react-router-dom'

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  mockAxios.reset()
  jest.restoreAllMocks()
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('that map view sends api call on render', async () => {
  render(
    <Router>
      <MapView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: { devices: [], deviceCount: 0 }
    })
  })
  expect(mockAxios.get).toHaveBeenCalled()
  expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining('/devices?state='))
})

test('that map view shows no devices correctly', async () => {
  render(
    <Router>
      <MapView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: { devices: [], deviceCount: 0 }
    })
  })
  expect(screen.getByText('0 devices')).toBeInTheDocument()
  expect(screen.getByText('0')).toBeInTheDocument()
  expect(
    screen.getByText('No devices found or zoom is not close enough.')
  ).toBeInTheDocument()
})

test('that map view shows devices correctly', async () => {
  render(
    <Router>
      <MapView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: {
        devices: [
          {
            device_id: 123,
            location: { lat: 35.0, long: 32.0 },
            state: 'Operational'
          },
          {
            device_id: 124,
            location: { lat: 31.0, long: 25.0 },
            state: 'Shutdown'
          }
        ],
        deviceCount: 2
      }
    })
  })
  expect(screen.getByText('2 devices')).toBeInTheDocument()
})

test('that state filter dropdown change calls api', async () => {
  render(
    <Router>
      <MapView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: {
        devices: [
          {
            device_id: 123,
            location: { lat: 35.0, long: 32.0 },
            state: 'Operational'
          },
          {
            device_id: 124,
            location: { lat: 31.0, long: 25.0 },
            state: 'Operational'
          }
        ],
        deviceCount: 2
      }
    })
  })
  fireEvent.click(screen.getByText('Any'))
  fireEvent.click(screen.getByText('Shutdown'))
  act(() => {
    mockAxios.mockResponse({
      data: {
        devices: [
          {
            device_id: 124,
            location: { lat: 31.0, long: 25.0 },
            state: 'Shutdown'
          }
        ],
        deviceCount: 1
      }
    })
  })
  expect(mockAxios.get).toHaveBeenCalledTimes(2)
  expect(mockAxios.get).toHaveBeenNthCalledWith(
    2,
    expect.stringContaining('/devices?state=Shutdown')
  )
  await waitFor(() => {
    expect(screen.getByText('1 devices')).toBeInTheDocument()
  })
  expect(screen.getByText('Shutdown')).toBeInTheDocument()
})

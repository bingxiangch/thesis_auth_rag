// Author: Oskari Niskanen

import { render, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import mockAxios from 'jest-mock-axios'
import { BrowserRouter as Router } from 'react-router-dom'
import { HomeView } from '../components/HomeView'

const { ResizeObserver } = window

// Match media mock to prevent errors.
window.matchMedia = (query) => ({
  matches: true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
})

beforeEach(() => {
  jest.clearAllMocks()
  // Mocking resize observer (Recharts related)
  delete window.ResizeObserver
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
})

afterEach(() => {
  mockAxios.reset()
  window.ResizeObserver = ResizeObserver
  jest.restoreAllMocks()
})

test('that two tabs are shown on the page', async () => {
  render(
    <Router>
      <HomeView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: { devices: [], deviceCount: 0 }
    })
  })
  expect(screen.getByText('Overview')).toBeInTheDocument()
  expect(screen.getByText('Statistics')).toBeInTheDocument()
})

test('that tabs can be switched between', async () => {
  render(
    <Router>
      <HomeView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: { devices: [], deviceCount: 0 }
    })
  })
  fireEvent.click(screen.getByText('Statistics'))
  expect(screen.getByText('To be done...')).toBeInTheDocument()
  expect(screen.queryByText('Device Status')).not.toBeInTheDocument()
  fireEvent.click(screen.getByText('Overview'))
  expect(screen.queryByText('To be done...')).not.toBeInTheDocument()
})

test('that different cards are rendered', async () => {
  render(
    <Router>
      <HomeView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: { devices: [], deviceCount: 0 }
    })
  })
  expect(screen.getByText('Device Status')).toBeInTheDocument()
  expect(screen.getByText('Battery charge across devices')).toBeInTheDocument()
  expect(screen.getByText('Battery output across devices')).toBeInTheDocument()
  expect(screen.getByText('Solar panel output across devices')).toBeInTheDocument()
  expect(screen.getByText('Devices by field')).toBeInTheDocument()
})

test('that performers cards show no devices correctly', async () => {
  render(
    <Router>
      <HomeView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: { devices: [], deviceCount: 0 }
    })
  })
  expect(screen.getByText('Maximum')).toBeInTheDocument()
  expect(screen.getByText('Minimum')).toBeInTheDocument()
  expect(screen.getAllByText('No devices found.')).toHaveLength(2)
})

test('that device count cards show no devices correctly', async () => {
  render(
    <Router>
      <HomeView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: { devices: [], deviceCount: 0 }
    })
  })
  expect(screen.getByText('Device Status')).toBeInTheDocument()
  expect(screen.getByText('Total devices:')).toBeInTheDocument()
  expect(screen.getByText('0')).toBeInTheDocument()
})

test('that device count cards shows device count correctly', async () => {
  render(
    <Router>
      <HomeView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: {
        devices: [
          {
            device_id: 123,
            create_time: '2022-11-30T00:00:00.000Z',
            charge_battery: 10,
            output_battery: 10,
            energy_solar: 100,
            lux_solar: 150,
            state: 'Operational'
          },
          {
            device_id: 124,
            charge_battery: 10,
            output_battery: 10,
            energy_solar: 100,
            lux_solar: 150,
            create_time: '2022-11-30T00:00:00.000Z',
            state: 'Shutdown'
          }
        ],
        deviceCount: 2
      }
    })
  })
  expect(screen.getByText('2')).toBeInTheDocument()
})

test('that performer card calculates values correctly', async () => {
  render(
    <Router>
      <HomeView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: {
        devices: [
          {
            device_id: 123,
            create_time: '2022-11-30T00:00:00.000Z',
            charge_battery: 1337,
            output_battery: 15,
            energy_solar: 100,
            lux_solar: 150,
            state: 'Operational'
          },
          {
            device_id: 124,
            charge_battery: 137,
            output_battery: 30,
            energy_solar: 200,
            lux_solar: 200,
            create_time: '2022-11-30T00:00:00.000Z',
            state: 'Shutdown'
          }
        ],
        deviceCount: 2
      }
    })
  })
  //  Avg and median batt charge
  expect(screen.getAllByText('737.00')).toHaveLength(2)
  // Sum charge
  expect(screen.getByText('1474.00')).toBeInTheDocument()

  // Batt output avg and median
  expect(screen.getAllByText('22.50')).toHaveLength(2)
  // Sum
  expect(screen.getByText('45.00')).toBeInTheDocument()

  // Solar energy avg and median
  expect(screen.getAllByText('150.00')).toHaveLength(2)
  // Sum
  expect(screen.getByText('300.00')).toBeInTheDocument()
})

test('that performer card dropdown can be used', async () => {
  render(
    <Router>
      <HomeView />
    </Router>
  )
  act(() => {
    mockAxios.mockResponse({
      data: {
        devices: [
          {
            device_id: 123,
            create_time: '2022-11-30T00:00:00.000Z',
            charge_battery: 1337,
            output_battery: 15,
            energy_solar: 100,
            lux_solar: 150,
            state: 'Operational'
          },
          {
            device_id: 124,
            charge_battery: 137,
            output_battery: 30,
            energy_solar: 200,
            lux_solar: 200,
            create_time: '2022-11-30T00:00:00.000Z',
            state: 'Fault'
          }
        ],
        deviceCount: 2
      }
    })
  })
  fireEvent.click(screen.getByText('Battery charge'))
  await fireEvent.click(screen.getByText('Battery output'))
  expect(screen.getByText('123')).toBeInTheDocument()
  expect(screen.getByText('124')).toBeInTheDocument()
  expect(screen.getByText('30')).toBeInTheDocument()
  expect(screen.getByText('15')).toBeInTheDocument()
})

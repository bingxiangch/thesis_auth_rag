// Author: Oskari Niskanen

import { render, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import mockAxios from 'jest-mock-axios'
import { MonthlyDetails } from '../components/MonthlyDetails'
const { ResizeObserver } = window

beforeEach(() => {
  jest.clearAllMocks()
  delete window.ResizeObserver
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
  jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)
})

afterEach(() => {
  mockAxios.reset()
  window.ResizeObserver = ResizeObserver
  jest.restoreAllMocks()
})

const dummyResponse = [
  {
    id: 1,
    device_id: '123',
    create_time: '2022-11-01T00:00:00.000Z',
    energy_solar_sum: 300.0,
    energy_solar_avg: 90.0,
    energy_solar_min: 0.3333333333333333,
    energy_solar_max: 200.33,
    energy_solar_min_timestamp: '2022-11-26T18:00:00.000Z',
    energy_solar_max_timestamp: '2022-11-27T13:21:09.001Z',
    lux_solar_avg: 20000,
    lux_solar_min: 100,
    lux_solar_max: 50000,
    lux_solar_min_timestamp: '2022-11-27T13:26:09.000Z',
    lux_solar_max_timestamp: '2022-11-27T13:21:09.001Z',
    charge_battery_avg: 18000.555,
    charge_battery_min: 16000.555,
    charge_battery_max: 19000.555,
    charge_battery_min_timestamp: '2022-11-26T16:21:57.000Z',
    charge_battery_max_timestamp: '2022-11-27T13:26:09.001Z',
    output_battery_sum: 1000,
    output_battery_avg: 200,
    output_battery_min: 0,
    output_battery_max: 1100,
    output_battery_min_timestamp: '2022-11-27T13:26:09.000Z',
    output_battery_max_timestamp: '2022-11-27T13:26:09.001Z',
    plugoffrate1: 1,
    plugoffrate2: 1,
    operational_rate: 0.5,
    shutdown_rate: 0.3,
    fault_rate: 0.2
  }
]

test('that component calls api on render', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  expect(mockAxios.get).toHaveBeenCalled()
  expect(mockAxios.get).toHaveBeenCalledTimes(1)
  expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining('/data/monthly/123'))
})

test('that "No data is available text" is shown', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  expect(
    screen.queryByText('Monthly statistical data not available yet.')
  ).not.toBeInTheDocument()
  act(() => {
    mockAxios.mockResponse({
      data: [],
      status: 200
    })
  })
  expect(
    screen.getByText('Monthly statistical data not available yet.')
  ).toBeInTheDocument()
})

test('that accordion element is rendered on screen', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  expect(screen.getByText('November 2022')).toBeInTheDocument()
})

test('that accordion element can be opened by clicking it', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getByText('November 2022'))
  expect(screen.getByText('Battery output')).toBeInTheDocument()
})

test('that opened accordion contains all cards', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getByText('November 2022'))
  expect(screen.getByText('Battery output')).toBeInTheDocument()
  expect(screen.getByText('Battery charge')).toBeInTheDocument()
  expect(screen.getByText('Solar panel')).toBeInTheDocument()
  expect(screen.getByText('Light intensity')).toBeInTheDocument()
  expect(screen.getByText('Device state')).toBeInTheDocument()
  expect(screen.getByText('Plug rates')).toBeInTheDocument()
})

test('battery output card displays values correctly', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getByText('November 2022'))
  // Total output
  expect(screen.getByText('1000.00')).toBeInTheDocument()
  // Average output
  expect(screen.getByText('200')).toBeInTheDocument()
  // Max and min output
  expect(screen.getByText('1100.00 kW')).toBeInTheDocument()
  expect(screen.getByText('0.00 kW')).toBeInTheDocument()
})

test('Battery charge card displays values correctly', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getByText('November 2022'))
  // Avg charge
  expect(screen.getByText('18000.6')).toBeInTheDocument()
  // Max and min charge
  expect(screen.getByText('16000.6 mAh')).toBeInTheDocument()
  expect(screen.getByText('19000.6 mAh')).toBeInTheDocument()
})

test('Solar panel card displays values correctly', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getByText('November 2022'))
  expect(screen.getByText('300.0')).toBeInTheDocument()
  // Avg
  expect(screen.getByText('90.0')).toBeInTheDocument()
  // Min
  expect(screen.getByText('0.33 kW')).toBeInTheDocument()
  // Max
  expect(screen.getByText('200.33 kW')).toBeInTheDocument()
})

test('Light intensity card displays values correctly', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getByText('November 2022'))
  // Avg
  expect(screen.getByText('20000')).toBeInTheDocument()
  // Max
  expect(screen.getByText('50000 lx')).toBeInTheDocument()
  // Min
  expect(screen.getByText('100 lx')).toBeInTheDocument()
})

test('Device states are displayed correctly', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getByText('November 2022'))
  // Device state rates
  expect(screen.getByText('50 %')).toBeInTheDocument()
  expect(screen.getByText('20 %')).toBeInTheDocument()
  expect(screen.getByText('30 %')).toBeInTheDocument()
})

test('Dates are formatted properly', async () => {
  render(<MonthlyDetails device={{ device_id: '123' }} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  fireEvent.click(screen.getByText('November 2022'))
  expect(screen.getByText('at 26/11/2022, 20:00:00')).toBeInTheDocument()
})

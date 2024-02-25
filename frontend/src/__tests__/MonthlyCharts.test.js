// Author: Oskari Niskanen

import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import mockAxios from 'jest-mock-axios'
import { MonthlyCharts } from '../components/MonthlyCharts'
const { ResizeObserver } = window

const device = {
  device_id: 123
}

const dummyResponse = [
  {
    create_time: '2022-11-01T00:00:00.000Z',
    energy_solar_avg: 400,
    lux_solar_avg: 3000,
    charge_battery_avg: 30000,
    output_battery_avg: 700
  },
  {
    create_time: '2022-12-01T00:00:00.000Z',
    energy_solar_avg: 600,
    lux_solar_avg: 4000,
    charge_battery_avg: 35000,
    output_battery_avg: 300
  }
]

beforeEach(() => {
  // Resize Observer mock to prevent errors.
  delete window.ResizeObserver
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
  // Setting height and width of the page artificially.
  jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)
})

afterEach(() => {
  mockAxios.reset()
  window.ResizeObserver = ResizeObserver
  jest.restoreAllMocks()
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('that component renders', async () => {
  render(<MonthlyCharts device={device} />)
  act(() => {
    mockAxios.mockResponse({
      data: dummyResponse,
      status: 200
    })
  })
  expect(screen.getByText('Average solar energy')).toBeInTheDocument()
  expect(screen.getByText('Average light intensity')).toBeInTheDocument()
  expect(screen.getByText('Average battery charge')).toBeInTheDocument()
  expect(screen.getByText('Average battery output')).toBeInTheDocument()
})

test('that api is called correctly on first render', async () => {
  render(<MonthlyCharts device={device} />)
  act(() => {
    mockAxios.mockResponse({ data: dummyResponse })
  })
  expect(mockAxios.get).toHaveBeenCalled()
  expect(mockAxios.get).toHaveBeenCalledTimes(1)
  expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:4000/data/monthly/123')
})

test('that no data shows if not available', async () => {
  render(<MonthlyCharts device={device} />)
  act(() => {
    mockAxios.mockResponse({ data: [] })
  })
  expect(screen.queryByText('Average solar energy')).not.toBeInTheDocument()
  expect(screen.getByText('Monthly chart data not available yet.')).toBeInTheDocument()
})

test('that loading spinner is shown', async () => {
  render(<MonthlyCharts device={device} />)
  expect(screen.getAllByText('Loading...')).toHaveLength(4)
  act(() => {
    mockAxios.mockResponse({ data: dummyResponse })
  })
})

test('that no data message is not shown while loading is in progress', async () => {
  render(<MonthlyCharts device={device} />)
  expect(screen.getAllByText('Loading...')).toHaveLength(4)
  expect(
    screen.queryByText('Monthly chart data not available yet.')
  ).not.toBeInTheDocument()
  act(() => {
    mockAxios.mockResponse({ data: dummyResponse })
  })
})

test('that that null monthly data does not break charts', async () => {
  render(<MonthlyCharts device={device} />)
  act(() => {
    mockAxios.mockResponse({})
  })
})

test('that data from 1 month is shown', async () => {
  render(<MonthlyCharts device={device} />)
  act(() => {
    mockAxios.mockResponse({ data: dummyResponse.slice(0, 1) })
  })
  expect(screen.getAllByText('Nov 2022')).toHaveLength(4)
  expect(screen.queryByText('Dec 2022')).not.toBeInTheDocument()
})

test('that data from 2 months is shown', async () => {
  render(<MonthlyCharts device={device} />)
  await act(() => {
    mockAxios.mockResponse({ data: dummyResponse })
  })
  expect(screen.getAllByText('Nov 2022')).toHaveLength(4)
  expect(screen.getAllByText('Dec 2022')).toHaveLength(4)
})

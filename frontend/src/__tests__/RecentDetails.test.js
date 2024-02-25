// Author: Oskari Niskanen

import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import mockAxios from 'jest-mock-axios'
import { RecentDetails } from '../components/RecentDetails'
const { ResizeObserver } = window

const device = {
  device_id: 123
}

const deviceResponse = [
  {
    device_id: '123',
    create_time: '2022-11-30T13:00:00.000Z',
    location: {
      lat: 61.5,
      long: 28.2
    },
    energy_solar: 0.5,
    lux_solar: 100,
    capacity_battery: 50000,
    charge_battery: 18000.0,
    output_battery: 0,
    voltage_battery: 48,
    switches: {
      plug_1: {
        changed: 1668422384,
        state: false
      },
      plug_2: {
        changed: 1668421710,
        state: true
      }
    },
    state: 'Shutdown'
  }
]

describe('Recent details', () => {
  beforeEach(() => {
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

  beforeEach(() => {
    jest.clearAllMocks()
    render(<RecentDetails device={device} />)
    // Before each test, respond to api calls to avoid too much code duplication.
    const deviceRequest = mockAxios.getReqByRegex({ url: /(?:)\/devices\/123/ })
    // Respond to device information call with dummy data.
    act(() => {
      mockAxios.mockResponse(
        {
          data: deviceResponse,
          status: 200
        },
        deviceRequest
      )
    })
    // Respond to dropdown chart api calls with empty array
    for (let i = 0; i < 4; i++) {
      act(() => {
        mockAxios.mockResponse({
          data: [],
          status: 200
        })
      })
    }
  })

  test('that component sends api calls on render', async () => {
    expect(mockAxios.get).toHaveBeenCalledTimes(5)
    expect(mockAxios.get).toHaveBeenCalledWith(expect.stringContaining('/devices/123'))
  })

  test('that device detail card is correctly displayed', async () => {
    // Status
    expect(screen.getByText('Shutdown')).toBeInTheDocument()
    // Battery info
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('18000')).toBeInTheDocument()
    expect(screen.getByText('18000')).toBeInTheDocument()
    expect(screen.getByText('48.0')).toBeInTheDocument()
    expect(screen.getByText('0.50')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('On')).toBeInTheDocument()
    expect(screen.getByText('Off')).toBeInTheDocument()
    expect(screen.getByText('Last updated: 30/11/2022, 15:00:00')).toBeInTheDocument()
  })

  test('that leaflet map is visible', async () => {
    // Map details
    expect(screen.getByText('Device location')).toBeInTheDocument()
    expect(screen.getByText('61.5')).toBeInTheDocument()
    expect(screen.getByText('28.2')).toBeInTheDocument()
    expect(screen.getByText('Leaflet')).toBeInTheDocument()
  })
})

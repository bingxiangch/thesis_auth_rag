// Author: Oskari Niskanen

import { render, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import mockAxios from 'jest-mock-axios'
import { DetailsView } from '../components/DetailsView'
import * as routing from 'react-router'
const { ResizeObserver } = window

beforeEach(() => {
  jest.clearAllMocks()
  // Resize observer is mocked to prevent error with Recharts (Tremor) components.
  // As the charts/graphs are responsive, they use resize observer, but it's not defined in tests.
  delete window.ResizeObserver
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
  // Mocking client height and width get functions to return >0 values to force charts/graphs to show up.
  jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)
  // Mocking useLocation hook to return usable values.
  jest
    .spyOn(routing, 'useLocation')
    .mockImplementation(() => ({ state: { device: { device_id: '123' } } }))
  // Rendering details view
  render(<DetailsView />)
  // Before each test, respond to api calls to avoid too much code duplication.
  const deviceRequest = mockAxios.getReqByRegex({ url: /(?:)\/devices\/123/ })
  // Respond to device information call with dummy data.
  act(() => {
    mockAxios.mockResponse(
      {
        data: [],
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

afterEach(() => {
  mockAxios.reset()
  window.ResizeObserver = ResizeObserver
  jest.restoreAllMocks()
})

test('that component renders tabs', async () => {
  expect(screen.getByText('Overview')).toBeInTheDocument()
  expect(screen.getByText('Monthly statistics')).toBeInTheDocument()
  expect(screen.getByText('Monthly charts')).toBeInTheDocument()
})

test('that component show device id', async () => {
  expect(screen.getByText('Identifier: 123')).toBeInTheDocument()
})

test('that tabs can be traversed', async () => {
  // Click monthly statistics tab
  fireEvent.click(screen.getByText('Monthly statistics'))
  // Respond to api call and return empty array
  act(() => {
    mockAxios.mockResponse({
      data: []
    })
  })
  // Check that correct text is displayed (to confirm we're on the right tab.)
  expect(
    screen.getByText('Monthly statistical data not available yet.')
  ).toBeInTheDocument()
  // Click monthly charts tab
  fireEvent.click(screen.getByText('Monthly charts'))
  act(() => {
    mockAxios.mockResponse({
      data: []
    })
  })
  expect(screen.getByText('Monthly chart data not available yet.')).toBeInTheDocument()
})

// Author: Oskari Niskanen

import { render, fireEvent, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import mockAxios from 'jest-mock-axios'
import { DropdownChart } from '../components/DropdownChart'
const { ResizeObserver } = window

beforeEach(() => {
  // Resize observer mock to prevent Tremor (Recharts related) error.
  delete window.ResizeObserver
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
  // Mocking height and width to return values that force graphs to render.
  jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100)
})

afterEach(() => {
  mockAxios.reset()
  window.ResizeObserver = ResizeObserver
  jest.restoreAllMocks()
})

const initialProps = {
  deviceId: '123',
  title: 'Test title',
  category: 'Test category',
  dataKey: 'value',
  formatterSuffix: '%'
}
const emptyResponse = {
  data: {
    123: []
  }
}
test('that view is rendered', async () => {
  render(<DropdownChart {...initialProps} />)

  act(() => {
    mockAxios.mockResponse(emptyResponse)
  })
  expect(mockAxios.get).toHaveBeenCalled()
})

test('that loading spinner is displayed', async () => {
  render(<DropdownChart {...initialProps} />)

  expect(screen.getByText('Loading...')).toBeInTheDocument()
  act(() => {
    mockAxios.mockResponse(emptyResponse)
  })
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
})

test('that time granularity returns valid hour strings', async () => {
  render(<DropdownChart {...initialProps} />)
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      }
    })
  })
  expect(screen.getAllByText('30/11/2022, 02:00')).not.toBeNull()
})

test('that time granularity returns valid minutely strings', async () => {
  render(<DropdownChart {...initialProps} />)
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [
          { value: 1, time: '2022-11-30T00:00:00.000Z' },
          { value: 2, time: '2022-11-30T00:02:00.000Z' }
        ]
      },
      status: 200
    })
  })
  const granularityButton = screen.getByText('Hour').closest('button')
  fireEvent.click(granularityButton)
  fireEvent.click(screen.getByText('Minute').closest('button'))
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      },
      status: 200
    })
  })
  expect(screen.getByText('30/11/2022, 02:00:00')).toBeInTheDocument()
})

test('that time granularity returns valid daily strings', async () => {
  render(<DropdownChart {...initialProps} />)
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      }
    })
  })
  fireEvent.click(screen.getByText('Hour').closest('button'))
  fireEvent.click(screen.getByText('Day').closest('button'))
  // Respond to new api call.
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      }
    })
  })
  expect(screen.getAllByText('30/11/2022')).not.toBeNull()
})

test('that time granularity returns valid weekly strings', async () => {
  render(<DropdownChart {...initialProps} />)
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      }
    })
  })
  fireEvent.click(screen.getByText('Hour').closest('button'))
  fireEvent.click(screen.getByText('Week').closest('button'))
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      }
    })
  })
  expect(screen.queryAllByText('28.11.2022 - 4.12.2022')).not.toBeNull()
})

test('that time granularity returns valid monthly strings', async () => {
  render(<DropdownChart {...initialProps} />)
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      }
    })
  })
  fireEvent.click(screen.getByText('Hour').closest('button'))
  fireEvent.click(screen.getByText('Month').closest('button'))
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      }
    })
  })
  expect(screen.getAllByText('November 2022')).not.toBeNull()
})

test('that date range shortcut options are available', async () => {
  render(<DropdownChart {...initialProps} />)
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      }
    })
  })
  fireEvent.click(screen.getByText('Last 30 days').closest('button'))
  expect(screen.getByText('Last 7 days')).toBeInTheDocument()
  expect(screen.getByText('Month to Date')).toBeInTheDocument()
  expect(screen.getByText('Year to Date')).toBeInTheDocument()
})

test('that date range shortcut can be selected', async () => {
  render(<DropdownChart {...initialProps} />)
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      }
    })
  })
  fireEvent.click(screen.getByText('Last 30 days').closest('button'))
  fireEvent.click(screen.getByText('Year to Date').closest('button'))
  // Respond to new api call
  act(() => {
    mockAxios.mockResponse({
      data: {
        123: [{ value: 1, time: '2022-11-30T00:00:00.000Z' }]
      }
    })
  })
  expect(mockAxios.get).toHaveBeenCalled()
  expect(mockAxios.get).toHaveBeenCalledTimes(2)
  // Check that start date is set correctly
  expect(mockAxios.get).toHaveBeenNthCalledWith(
    2,
    expect.stringContaining('startDate=2022-01-01T00:00:00')
  )
  // Check that a date with time set as 23:59:59 is set (as endDate)
  expect(mockAxios.get).toHaveBeenNthCalledWith(2, expect.stringContaining('T23:59:59'))
  expect(screen.getByText('Jan 1, 2022 -', { exact: false })).toBeInTheDocument()
})

test('that api error logs to console', async () => {
  render(<DropdownChart {...initialProps} />)
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  act(() => {
    mockAxios.mockError({
      err: 'Error.'
    })
  })
  expect(consoleSpy).toHaveBeenCalled()
})

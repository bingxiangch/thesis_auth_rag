// Author: Oskari Niskanen

import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { StateFilterDropdown } from '../components/StateFilterDropdown'

const handleStateChangeMock = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

test('that component renders', async () => {
  render(<StateFilterDropdown deviceCount={100} />)
  expect(screen.getByText('Filter by device state')).toBeInTheDocument()
})

test('that device count badge is displayed correctly', async () => {
  render(<StateFilterDropdown deviceCount={150} />)
  expect(screen.getByText('150 devices')).toBeInTheDocument()
})

test('that dropdown default state is correct', async () => {
  render(<StateFilterDropdown deviceCount={150} />)
  expect(screen.getByText('Any')).toBeInTheDocument()
})

test('that dropdown state can be set as Operational', async () => {
  render(<StateFilterDropdown deviceCount={150} onStateChange={handleStateChangeMock} />)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByText('Operational').closest('button'))
  expect(handleStateChangeMock).toHaveBeenCalled()
  expect(handleStateChangeMock).toHaveBeenCalledTimes(1)
  expect(handleStateChangeMock).toHaveBeenCalledWith('Operational')
})

test('that dropdown state can be set as Shutdown', async () => {
  render(<StateFilterDropdown deviceCount={150} onStateChange={handleStateChangeMock} />)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByText('Shutdown').closest('button'))
  expect(handleStateChangeMock).toHaveBeenCalled()
  expect(handleStateChangeMock).toHaveBeenCalledTimes(1)
  expect(handleStateChangeMock).toHaveBeenCalledWith('Shutdown')
})

test('that dropdown state can be set as Fault', async () => {
  render(<StateFilterDropdown deviceCount={150} onStateChange={handleStateChangeMock} />)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByText('Fault').closest('button'))
  expect(handleStateChangeMock).toHaveBeenCalled()
  expect(handleStateChangeMock).toHaveBeenCalledTimes(1)
  expect(handleStateChangeMock).toHaveBeenCalledWith('Fault')
})

test('that dropdown state can be set as Any', async () => {
  render(<StateFilterDropdown deviceCount={150} onStateChange={handleStateChangeMock} />)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getAllByText('Any')[1].closest('button'))
  expect(handleStateChangeMock).toHaveBeenCalled()
  expect(handleStateChangeMock).toHaveBeenCalledTimes(1)
  expect(handleStateChangeMock).toHaveBeenCalledWith('Any')
})

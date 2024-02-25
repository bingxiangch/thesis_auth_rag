// Author: Oskari Niskanen

import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Pagination } from '../components/Pagination'

const setCurrentPageMock = jest.fn()
const setPageSizeMock = jest.fn()

// Mocking matchMedia to prevent errors.
// Matches is set to true, so Pagination thinks that screen is big
window.matchMedia = (query) => ({
  matches: true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
})

beforeEach(() => {
  jest.clearAllMocks()
})

test('that page count is calculated correctly', async () => {
  render(<Pagination currentPage={1} pageSize={20} totalDevices={1500} />)
  expect(screen.getByText('Page 1 / 75')).toBeDefined()
})

test('that current page is set correctly', async () => {
  render(<Pagination currentPage={5} pageSize={20} totalDevices={1500} />)
  expect(screen.getByText('Page 5 / 75')).toBeDefined()
})

test('that previous buttons are disabled on first page', async () => {
  render(<Pagination currentPage={1} pageSize={20} totalDevices={1500} />)

  let disabledCount = 0
  screen.getAllByRole('button').forEach((btn) => {
    if (btn.disabled) {
      disabledCount += 1
    }
  })
  // Skip 10 previous pages and previous buttons should be disabled on page 1.
  expect(disabledCount).toBe(2)
})

test('that next buttons are disabled on last page', async () => {
  render(<Pagination currentPage={10} pageSize={10} totalDevices={100} />)
  let disabledCount = 0
  screen.getAllByRole('button').forEach((btn) => {
    if (btn.disabled) {
      disabledCount += 1
    }
  })
  // Skip next 10 and next button should be disabled on last page.
  expect(disabledCount).toBe(2)
})

test('that no buttons are disabled in between pages', async () => {
  render(<Pagination currentPage={5} pageSize={20} totalDevices={1500} />)
  let disabledCount = 0
  screen.getAllByRole('button').forEach((btn) => {
    if (btn.disabled) {
      disabledCount += 1
    }
  })
  // No buttons should be disabled when there are previous and next pages.
  expect(disabledCount).toBe(0)
})

test('that page count is increased on normal next click', async () => {
  render(
    <Pagination
      setCurrentPage={setCurrentPageMock}
      setPageSize={setPageSizeMock}
      currentPage={1}
      pageSize={20}
      totalDevices={1500}
    />
  )
  // Next button is the third button of pagination element.
  // Tremor makes it really hard to set any identifying information to the elements.
  fireEvent.click(screen.getAllByRole('button')[3])
  await expect(setCurrentPageMock).toHaveBeenCalled()
  await expect(setCurrentPageMock).toHaveBeenCalledWith(2)
})

test('that page count is increased on skip 10 click', async () => {
  render(
    <Pagination
      setCurrentPage={setCurrentPageMock}
      setPageSize={setPageSizeMock}
      currentPage={1}
      pageSize={20}
      totalDevices={1500}
    />
  )
  fireEvent.click(screen.getAllByRole('button')[4])
  await expect(setCurrentPageMock).toHaveBeenCalled()
  await expect(setCurrentPageMock).toHaveBeenCalledWith(11)
})

test('that skip 10 forwards goes to last page if less than 10 pages left', async () => {
  render(
    <Pagination
      setCurrentPage={setCurrentPageMock}
      setPageSize={setPageSizeMock}
      currentPage={70}
      pageSize={20}
      totalDevices={1500}
    />
  )
  fireEvent.click(screen.getAllByRole('button')[4])
  await expect(setCurrentPageMock).toHaveBeenCalled()
  await expect(setCurrentPageMock).toHaveBeenCalledWith(75)
})

test('that page count is decreased on normal previous click', async () => {
  render(
    <Pagination
      setCurrentPage={setCurrentPageMock}
      setPageSize={setPageSizeMock}
      currentPage={5}
      pageSize={20}
      totalDevices={1500}
    />
  )
  fireEvent.click(screen.getAllByRole('button')[2])
  await expect(setCurrentPageMock).toHaveBeenCalled()
  await expect(setCurrentPageMock).toHaveBeenCalledWith(4)
})

test('that page count is decreased on skip 10 click', async () => {
  render(
    <Pagination
      setCurrentPage={setCurrentPageMock}
      setPageSize={setPageSizeMock}
      currentPage={15}
      pageSize={20}
      totalDevices={1500}
    />
  )
  fireEvent.click(screen.getAllByRole('button')[1])
  await expect(setCurrentPageMock).toHaveBeenCalled()
  await expect(setCurrentPageMock).toHaveBeenCalledWith(5)
})

test('that skip 10 backwards goes to first page if less than 10 pages left', async () => {
  render(
    <Pagination
      setCurrentPage={setCurrentPageMock}
      setPageSize={setPageSizeMock}
      currentPage={5}
      pageSize={20}
      totalDevices={1500}
    />
  )
  fireEvent.click(screen.getAllByRole('button')[1])
  await expect(setCurrentPageMock).toHaveBeenCalled()
  await expect(setCurrentPageMock).toHaveBeenCalledWith(1)
})

test('that page count is not decreased when page is first', async () => {
  render(
    <Pagination
      setCurrentPage={setCurrentPageMock}
      setPageSize={setPageSizeMock}
      currentPage={1}
      pageSize={20}
      totalDevices={1500}
    />
  )
  fireEvent.click(screen.getAllByRole('button')[2])
  await expect(setCurrentPageMock).not.toHaveBeenCalled()
})

test('that page count is not increased when page is last', async () => {
  render(
    <Pagination
      setCurrentPage={setCurrentPageMock}
      setPageSize={setPageSizeMock}
      currentPage={75}
      pageSize={20}
      totalDevices={1500}
    />
  )
  fireEvent.click(screen.getAllByRole('button')[3])
  await expect(setCurrentPageMock).not.toHaveBeenCalled()
})

test('that page size is changed', async () => {
  render(
    <Pagination
      setCurrentPage={setCurrentPageMock}
      setPageSize={setPageSizeMock}
      currentPage={1}
      pageSize={20}
      totalDevices={1500}
    />
  )
  // Opening drop down menu
  fireEvent.click(screen.getAllByRole('button')[0])
  fireEvent.click(screen.getByText('50 rows'))
  expect(setCurrentPageMock).toHaveBeenCalled()
  expect(setCurrentPageMock).toHaveBeenCalledWith(1)
  expect(setPageSizeMock).toHaveBeenCalled()
  expect(setPageSizeMock).toHaveBeenCalledWith(50)
})

test('that only one page is shown if device count is zero', async () => {
  render(<Pagination currentPage={1} pageSize={20} totalDevices={0} />)
  expect(screen.getByText('Page 1 / 1')).toBeDefined()
})

test('that all page size options are shown', async () => {
  render(<Pagination currentPage={1} pageSize={20} totalDevices={1500} />)
  // Opening drop down menu
  fireEvent.click(screen.getAllByRole('button')[0])
  expect(screen.getAllByText('20 rows')).toBeDefined()
  expect(screen.getByText('50 rows')).toBeDefined()
  expect(screen.getByText('100 rows')).toBeDefined()
})

test('that skip buttons are hidden on smaller screens', async () => {
  // Setting matchMedia matches to false to emulate smaller screens.
  window.matchMedia = (query) => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  })
  render(<Pagination currentPage={1} pageSize={20} totalDevices={1500} />)
  expect(screen.getAllByRole('button')).toHaveLength(2)
  expect(screen.queryAllByText('10')).toHaveLength(0)
})

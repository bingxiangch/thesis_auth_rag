// Returns locale string with finnish timezone and correct format.
// Used to reduce code duplication as the dates are used multiple times in different places.
export const getAsLocaleString = (date, configs) => {
  return new Date(date).toLocaleString('en-GB', {
    timeZone: 'Europe/Helsinki',
    ...configs
  })
}

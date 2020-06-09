export const generateQuery = (params = {}) => {
  const result = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  return result ? '?' + result : ''
}

export const generateId = () => Math.random().toString(36).substring(2)
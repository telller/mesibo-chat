import { BASE_URL } from 'root/mesibo-chat/src/constants'



// processError = async (response, options = {}, traceId) => {
//   const name = this.name || this.constructor.name
//   const { errorCodesWithoutNotification = [], messageForCode = {} } = options
//   const data = await response.json().catch(() => null)
//   const title = `${name} Error.`
//   const description = get(data, 'errors.0.msg') || _.get(data, 'message') || response.statusText
//   const errorCode = get(data, 'errors.0.code')
//   const errors = get(data, 'errors', [])
// if (data && data.errors && data.errors.length > 1) {
//   const errorsToShow = data.errors.filter(error => !errorCodesWithoutNotification.includes(error.code))
//   errorsToShow.forEach((i, index) => {
//     notification.error({ message: title, description: `${index}: ${i.msg}` })
//   })
// } else {
//   if (!errorCodesWithoutNotification.includes(errorCode)) {
//     notification.error({ message: title, description: `${description}` })
//   }
//
//   if (errorCodesWithoutNotification.includes(errorCode) && messageForCode.hasOwnProperty(errorCode)) {
//     notification.error({ message: title, description: `${messageForCode[errorCode]}` })
//   }
// }
// throw new ServiceError(`${title} ${description}`, errors)
// }

const makeRequest = async (path = '', options = {}, json = true, text, isHeaders = false) => {
  options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    mode: 'cors',
    ...options,
  }

  const response = await fetch(`${BASE_URL}${path}`, options)

  console.log({ response })

  if (!response.ok) {
    // await this.processError(response, options, traceId)
    throw new Error('Req failed')
  }


  if (text) {
    return isHeaders ? { text: response.text(), headers: response.headers } : response.text()
  }
  if (json) return response.json()

  return response
}

const makePostRequest = async (path, data, responseAsJson = false) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data || {}),
  }
  return await makeRequest(path, options, responseAsJson)
}

const makePutRequest = async (path, data, responseAsJson = false) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data || {}),
  }
  return await makeRequest(path, options, responseAsJson)
}

const makePatchRequest = async (path, data, responseAsJson = false) => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data || {}),
  }
  return await makeRequest(path, options, responseAsJson)
}

const makeDeleteRequest = async (path, responseAsJson = false) => {
  const options = {
    method: 'DELETE',
    headers: {},
  }
  return await makeRequest(path, options, responseAsJson)
}

export { makeRequest, makePostRequest, makePutRequest, makePatchRequest, makeDeleteRequest }

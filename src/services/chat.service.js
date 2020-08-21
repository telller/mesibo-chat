import { MAIN_ACCESS_TOKEN, MAIN_APP_ID } from 'constants'
import { makeRequest } from './baseService'
import { generateQuery } from 'helpers'

export const createUser = (userAddress) => {
  const params = {
    token: MAIN_ACCESS_TOKEN,
    appid: MAIN_APP_ID,
    addr: userAddress,
    op: 'useradd',
  }
  return makeRequest(generateQuery(params))
}

export const addUserToGroup = (userAddress, groupId) => {
  const params = {
    token: MAIN_ACCESS_TOKEN,
    gid: groupId,
    op: 'groupeditmembers',
    cs: 1,
    cr: 1,
    m: [userAddress],
    canpub: 1,
    cansub: 1,
    canlist: 1,
    delete: 0,
  }
  return makeRequest(generateQuery(params))
}

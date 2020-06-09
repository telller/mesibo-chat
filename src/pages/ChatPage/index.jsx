import { MAIN_APP_ID, GROUP_ID, DOWNLOAD_HISTORY_COUNT } from 'constants'
import { createUser, addUserToGroup } from 'services/chat.service'
import React, { useEffect, useState } from 'react'
import { generateId } from 'helpers'
import './index.styl'

export default () => {
  const userToken = localStorage.getItem('userToken')
  const userAddress = localStorage.getItem('userAddress')
  const [mesiboApi, $mesiboApi] = useState(null)
  const [message, $message] = useState('')
  const [userName, $userName] = useState('')
  const [readSession, $readSession] = useState(null)
  const [, $forceUpdate] = useState({})

  const createAndStoreUser = async () => {
    const userAddress = userName || generateId()
    const res = await createUser(userAddress)
    if (res) {
      localStorage.setItem('userAddress', userAddress)
      localStorage.setItem('userToken', res.user.token)
      await addUserToGroup(userAddress)
      initMesibo(res.user.token)
    }
  }

  const initMesibo = accessToken => {
    const MesiboListener = () => {
      // MesiboListener.prototype.Mesibo_OnConnectionStatus = (status, value) => {
      //   console.log("OnConnectionStatus: ", { status, value })
      // }
      // MesiboListener.prototype.Mesibo_OnMessageStatus = messageData => {
      //   console.log("OnMessageStatus: ", { messageData })
      // }
      MesiboListener.prototype.Mesibo_OnMessage = (messageData, message) => {
        // console.log("OnMessage: ", { messageData, message })
        // $messages(messages => [ ...messages, messageData ])
        $forceUpdate({})
      }
    }

    const mesApi = new Mesibo()
    mesApi.setAppName(MAIN_APP_ID)
    mesApi.setListener(new MesiboListener())
    mesApi.setCredentials(accessToken)
    mesApi.start()
    $mesiboApi(mesApi)
    readHistory(mesApi)
  }

  useEffect(() => {
    if (userToken) initMesibo(userToken)
    // createAndStoreUser()
  }, [])

  const sendMessage = () => {
    const id = mesiboApi.random()
    const mesParams = {
      peer: userAddress,
      groupid: GROUP_ID,
      message,
      id,
    }
    console.log({ mesParams })
    mesiboApi.sendMessage(mesParams, id, message)
    $message('')
  }

  const readHistory = mesiboApi => {
    const readSess = mesiboApi.readDbSession(userAddress, GROUP_ID, null, () => $forceUpdate({}))
    readSess.enableReadReceipt(true)
    readSess.read(DOWNLOAD_HISTORY_COUNT)
    $readSession(readSess)
  }

  const { messages = [] } = readSession || {}
  console.log({ messages })
  return (
    <div className='mesibo-chat-main-wraper'>
      <div className='mesibo-chat-messages-wrapper'>
        {messages.map((itm, ind) => (
          <div key={`${itm.id}_${itm.ts}_${ind}`} className='mesibo-chat-message-wrapper'>
            <div style={{ fontWeight: '700' }}>{itm.peer || userAddress}</div>
            <div>{itm.message}</div>
          </div>
        ))}
      </div>
      {userToken ? (
        <div className='mesibo-chat-sendMessage-wrapper'>
          <input value={message} onChange={e => $message(e.target.value)} placeholder='Type message' />
          <button onClick={sendMessage}>Send message</button>
        </div>
      ) : (
        <div className='mesibo-chat-createUser-wrapper'>
          <input value={userName} onChange={e => $userName(e.target.value)} placeholder='Type user name' />
          <button onClick={createAndStoreUser}>Start chat</button>
        </div>
      )}
    </div>
  )
}

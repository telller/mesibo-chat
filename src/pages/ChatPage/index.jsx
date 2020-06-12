import { MAIN_APP_ID, GROUP_ID, DOWNLOAD_HISTORY_COUNT } from 'constants'
import { createUser, addUserToGroup } from 'services/chat.service'
import React, { useEffect, useState } from 'react'
import { generateId } from 'helpers'
import './index.styl'

export default () => {
  const userAddress = localStorage.getItem('userAddress')
  const userToken = localStorage.getItem('userToken')
  const [isStartChat, $isStartChat] = useState(false)
  const [readSession, $readSession] = useState(null)
  const [mesiboApi, $mesiboApi] = useState(null)
  const [userName, $userName] = useState('')
  const [message, $message] = useState('')
  const [, $forceUpdate] = useState({})
  const { messages = [] } = readSession || {}

  useEffect(() => {
    if (userToken) initMesibo(userToken)
    // createAndStoreUser()
  }, [])

  useEffect(() => {
    scrollToLastMsg()
  }, [messages.length])

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

  const initMesibo = (accessToken) => {
    const MesiboListener = () => {
      MesiboListener.prototype.Mesibo_OnConnectionStatus = (status, value) => {
        if (status === 1 || status === 6) {
          console.log('All fine')
        } else {
          localStorage.removeItem('userAddress')
          localStorage.removeItem('userToken')

          console.error('Something went wrong, status: ', status)
          $message([])
        }
        console.log('OnConnectionStatus: ', { status, value })
      }
      MesiboListener.prototype.Mesibo_OnMessageStatus = (messageData) => {
        console.log('OnMessageStatus: ', { messageData })
      }
      MesiboListener.prototype.Mesibo_OnMessage = (messageData, message) => {
        console.log('OnMessage: ', { messageData, message })
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

  const sendMessage = () => {
    if (message) {
      const id = mesiboApi.random()
      const mesParams = {
        peer: userAddress,
        groupid: GROUP_ID,
        message,
        id,
      }
      mesiboApi.sendMessage(mesParams, id, message)
      $message('')
      setTimeout(scrollToLastMsg, 0)
    }
  }

  const readHistory = (mesiboApi) => {
    const onMessage = () => {
      $forceUpdate({})
      scrollToLastMsg()
    }
    const readSess = mesiboApi.readDbSession(null, GROUP_ID, null, onMessage)
    readSess.enableReadReceipt(true)
    readSess.read(DOWNLOAD_HISTORY_COUNT)
    $readSession(readSess)
  }

  const scrollToLastMsg = () => {
    const el = document.getElementById('mesiboChatMessagesEnd')
    el && el.scrollIntoView(el.scrollHeight)
  }

  return (
    <div className='mesibo-chat-main-wraper'>
      <div className='mesibo-chat-messages-wrapper stream-chat-screen '>
        {messages.map((itm, ind) => (
          <div
            key={`${itm.id}_${itm.ts}_${ind}`}
            className={`mesibo-chat-single-message-wrap ${itm.peer ? '' : 'my-message'}`}>
            <div className='mesibo-chat-message-userName'>{itm.peer || userAddress}</div>
            <div className='mesibo-chat-message-messageData'>{itm.message}</div>
          </div>
        ))}
        <div id='mesiboChatMessagesEnd' />
      </div>
      {userToken ? (
        <div className='stream-chat-type-stage'>
          <input type='text' value={message} onChange={(e) => $message(e.target.value)} placeholder='Type here' />
          <button onClick={sendMessage}>Send</button>
        </div>
      ) : (
        <div className={isStartChat ? 'stream-chat-name-stage' : 'stream-chat-start-stage'}>
          {isStartChat && (
            <input
              type='text'
              value={userName}
              onChange={(e) => $userName(e.target.value)}
              placeholder='Type your name'
            />
          )}
          <button onClick={() => (isStartChat ? createAndStoreUser() : $isStartChat(true))}>
            {isStartChat ? 'Go' : 'Chat'}
          </button>
        </div>
      )}
    </div>
  )
}

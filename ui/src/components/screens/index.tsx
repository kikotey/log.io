import React, { Dispatch, useContext, useEffect, useMemo, useState } from 'react'
import { DebounceInput } from 'react-debounce-input'

import { parse } from 'json-autocorrect'
import { DispatchContext, StateContext } from '../../contexts'
import { ActionTypes, State } from '../../reducers/types'
import { MessageActions, MessageState } from '../../reducers/messages/types'
import { ScreenActions, Screen as ScreenType, ScreenState } from '../../reducers/screens/types'

import './styles.scss'

interface ScreenManagerProps {
  addScreen: () => void,
  clearMessages: (screenId: string) => void,
  messages: MessageState,
  removeScreen: (screenId: string) => void,
  screens: ScreenState,
}

interface MappedScreenManagerProps {
  dispatch: Dispatch<ActionTypes>,
  state: State,
}

interface ScreenProps {
  clearMessages: (screenId: string) => void,
  screen: ScreenType,
  screenIndex: number,
  messages: Array<string>,
  removeScreen: (screenId: string) => void,
}

interface ScreenMessageProps {
  message: string,
  messageFilter: string,
}

/**
 * Search a string for filter substring matches.
 * Returns a list of parts w/ highlight flag.
 */
const _parseMessageParts = (str: string, find: string) => {
  const parts = []
  let counter = 0
  let lastMatchIndex = 0
  const lowerStr = str.toLowerCase()
  const lowerFind = find.toLowerCase()
  while (counter < str.length) {
    const end = counter + find.length
    if (lowerStr.substring(counter, end) === lowerFind) {
      parts.push({ highlight: false, text: str.slice(lastMatchIndex, counter)})
      parts.push({ highlight: true, text: str.slice(counter, end)})
      counter = end
      lastMatchIndex = end
    }
    counter += 1
  }
  parts.push({ highlight: false, text: str.slice(lastMatchIndex, str.length)})
  return parts
}

/**
 * Renders a single message
 */
const ScreenMessage: React.FC<ScreenMessageProps> = ({
  message,
  messageFilter
}) => {
  return (
    <div>
      {messageFilter && _parseMessageParts(message, messageFilter).map((part, i) =>
        <span key={i} className={part.highlight ? 'highlight' : ''}>{part.text}</span>
      )}
      {!messageFilter && message}
    </div>
  )
}

function debugConsoleDisplayer(prefixMessage: string, strMessage: string) {
       let objMessage = '' 

       // prepare
       // delete all element after the last }
       const searchTerm = '}'
       let substrMessage = strMessage.substr(0, strMessage.lastIndexOf(searchTerm)  + 1)

       // prepare
       // forced lint correction for react native json state
       let bufferMessage = substrMessage.replaceAll('[', '["')
       let bufferMessage2 = bufferMessage.replaceAll(']', '"]')
       let bufferMessage3 = bufferMessage2.replaceAll('"]"', '"]')
       let bufferMessage4 = bufferMessage3.replaceAll('"["', '["')
       let bufferMessage5 = bufferMessage4.replaceAll(': undefined', ': "undefined"')
       let bufferMessage6 = bufferMessage5.replaceAll('[" Object "]', '[Object]')
       let bufferMessage7 = bufferMessage6.replaceAll('"ExponentPushToken["', '"ExponentPushToken[')
       let bufferMessage8 = bufferMessage7.replaceAll('}"],','}],')
       let bufferMessage9 = bufferMessage8.replaceAll(': ["{"',': [{"')
       let substrMessageWithForcedLint = bufferMessage9.replaceAll('"], "referralId":', ']", "referralId":')

       if (isJson(substrMessageWithForcedLint)) {
             objMessage = substrMessageWithForcedLint
             console.debug("jsonObject ↴ " + prefixMessage, parse(substrMessageWithForcedLint))
       } else if (isObject(substrMessageWithForcedLint)) {
             objMessage = strMessage
             console.debug("object ↴ " + prefixMessage)
             console.dir(substrMessageWithForcedLint)
       } else {
              // display in last chance before 
             if (!substrMessageWithForcedLint.includes("action", 0) || !substrMessageWithForcedLint.includes("prev state", 0) || !substrMessageWithForcedLint.includes("next state", 0)) {
                if (substrMessageWithForcedLint.trimStart().match(/[^\w]|_/) !== null) {
                     console.debug(" Prev / Action / Next / DEBUG or other action jsonObject  ↴ ", substrMessageWithForcedLint) 
                }
              }
               
              // display in last chance after
             let elementAfterSubstrMessage = strMessage.substr(strMessage.lastIndexOf(searchTerm) + 1)
             if (elementAfterSubstrMessage.trimStart().match(/[^\w]|_/) !== null) {
                if (elementAfterSubstrMessage.includes("warn", 0) || elementAfterSubstrMessage.includes("WARN", 0)) {
                console.warn(elementAfterSubstrMessage)
                } else if (elementAfterSubstrMessage.includes("err", 0) || elementAfterSubstrMessage.includes("ERR", 0) || (elementAfterSubstrMessage.includes("error", 0) || elementAfterSubstrMessage.includes("DEBUG", 0))) {
                   console.error(elementAfterSubstrMessage)
                } else {
                   console.info(elementAfterSubstrMessage)
                }
            }
       }
}

function isObject(item: string) {
  return (typeof item === "object" && item !== null);
}

function isJson(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        //console.log(e)
        return false;
    }
    return true;
}

/**
 * Renders a single screen
 */
const Screen: React.FC<ScreenProps> = ({
  clearMessages,
  messages,
  removeScreen,
  screen,
  screenIndex
}) => {
  const [ messageFilter, setMessageFilter ] = useState('')
  const [ validMessages, setValidMessages ] = useState(messages)
  // Filter validMessages using messageFilter
  useEffect(() => {
    if (messages[0] !== undefined) {
       let index = messages.length - 1 
       let dataMessages = messages[index].split('] - ')[1]
       let prefixMessage = ''
       let strMessage = ''

       dataMessages.split(/(LOG)/).forEach(function (itemData) {
         prefixMessage = ''
         strMessage = ''
         itemData.split('LOG').forEach(function (item) {
         if (item.split('prev state ')[1] !== undefined) {
           prefixMessage = "PREV STATE  :"
           strMessage = item.split('prev state ')[1]
           debugConsoleDisplayer(prefixMessage, strMessage)
         } else if (item.split('next state ')[1] !== undefined) {
           prefixMessage = "NEXT STATE  :"
           strMessage = item.split('next state ')[1]
           debugConsoleDisplayer(prefixMessage, strMessage)
         } else if (item.split('action     ')[1] !== undefined) {
           prefixMessage = "ACTION      :"
           strMessage = item.split('action  ')[1]
           debugConsoleDisplayer(prefixMessage, strMessage)
         } else if (item.split('GROUP     action')[1] !== undefined) {
           prefixMessage = "GROUP ACTION      :"
           strMessage = item.split('GROUP     action')[1]
           debugConsoleDisplayer(prefixMessage, strMessage)
         } else {
           strMessage = item
           debugConsoleDisplayer(prefixMessage, strMessage)
         }
         });
       });
    }

    setValidMessages(
      messages.filter((msg) =>
        messageFilter === ''
          ? true
          : msg.toLowerCase().includes(messageFilter.toLowerCase()))
    )
  }, [messages, messageFilter])
  return (
    <>
      <div className="screen-header">
        <div className="title">
          Debugger {screenIndex + 1}
        </div>
        <div className="controls">
          <DebounceInput
            minLength={2}
            debounceTimeout={200}
            placeholder="Filter"
            onChange={e => setMessageFilter(e.target.value)}
          />
          <button onClick={() => clearMessages(screen.id)}>
            Clear
          </button>
          <button onClick={() => removeScreen(screen.id)}>
            Close
          </button>
        </div>
      </div>
      <div className="screen" data-testid={`screen-${screenIndex}`}>
        <div className="screen-messages">
          {validMessages.map((message, i) => (
            <ScreenMessage key={i} message={message} messageFilter={messageFilter} />
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * Render all screens & screen controls
 */
const ScreenManager: React.FC<ScreenManagerProps> = ({
  addScreen,
  clearMessages,
  messages,
  removeScreen,
  screens
}) => {
  const screenIds = Object.keys(screens.screens)
  return (
    <div className="screens">
      {screenIds.map((screenId, i) => (
        <Screen
          key={screenId}
          clearMessages={clearMessages}
          removeScreen={removeScreen}
          screen={screens.screens[screenId]}
          screenIndex={i}
          messages={messages.screens[screenId] || []}
        />
      ))}
      <div className="screens-controls">
        {screenIds.length < 6 && (
          <button
            data-testid="add-screen-btn"
            className="add-screen-btn"
            onClick={addScreen}
          >
            &#65291; ADD NEW DEBUGGER
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Creates handler functions from app state
 */
const MappedScreenManager: React.FC<MappedScreenManagerProps> = ({ dispatch, state }) => {
  const { messages, screens } = state

  // Create click handler functions to add/remove screens
  const addScreen = useMemo(() => (
    () => { dispatch({ type: ScreenActions.ADD_SCREEN }) }
  ), [dispatch])

  // Create click handler to remove a screen.
  const removeScreen = useMemo(() => (
    (screenId: string) => { dispatch({ type: ScreenActions.REMOVE_SCREEN, screenId }) }
  ), [dispatch])

  const clearMessages = useMemo(() => (
    (screenId: string) => { dispatch({ type: MessageActions.CLEAR_MESSAGES, screenId }) }
  ), [dispatch])

  return ScreenManager({ addScreen, clearMessages, messages, removeScreen, screens })
}

/**
 * Connects component to app contexts
 */
const ConnectedScreenManager: React.FC = () => {
  const state: State | null = useContext(StateContext)
  const dispatch: Dispatch<ActionTypes> | null = useContext(DispatchContext)
  if (!state || !dispatch) {
    return null
  }
  return MappedScreenManager({ dispatch, state })
}

export default ConnectedScreenManager

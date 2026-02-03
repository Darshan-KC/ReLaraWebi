import { useState, useEffect } from 'react'
import './App.css'
import './chat.js'

function App() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Load initial messages or conversations
    // For now, just set up the chat div
    const chatDiv = document.getElementById('chat')
    if (chatDiv) {
      chatDiv.innerHTML = '<p>Welcome to the chat!</p>'
    }
  }, [])

  const sendMessage = async () => {
    if (!message.trim()) return

    try {
      const response = await fetch('http://localhost:8000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          conversation_id: 1,
          body: message
        })
      })

      if (response.ok) {
        setMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <>
      <div>
        <h1>Chat App</h1>
        <div id="chat" style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px' }}></div>
        <input
          id="message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: '70%', padding: '5px' }}
        />
        <button id="send" onClick={sendMessage} style={{ padding: '5px 10px' }}>Send</button>
      </div>
    </>
  )
}

export default App

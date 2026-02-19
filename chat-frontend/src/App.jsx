import { useState, useEffect } from 'react'
import './App.css';
import "./echo"; // make sure this exports Echo instance

function App() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const conversationId = 1

  useEffect(() => {
    // Listen for new messages
    Echo.private(`conversation.${conversationId}`)
      .listen('MessageSent', (e) => {
        setMessages((prev) => [...prev, e])
      })

    return () => {
      Echo.leave(`private-conversation.${conversationId}`)
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
          conversation_id: conversationId,
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
    <div>
      <h1>Chat App</h1>

      <div
        style={{
          border: '1px solid #ccc',
          height: '300px',
          overflowY: 'scroll',
          padding: '10px'
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg.body}</div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: '70%', padding: '5px' }}
      />

      <button onClick={sendMessage} style={{ padding: '5px 10px' }}>
        Send
      </button>
    </div>
  )
}

export default App

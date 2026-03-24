import { useState, useEffect } from 'react'
import './App.css';
import "./echo"; // make sure this exports Echo instance
import { Routes, Route } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

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
    <>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>


      
    </>
  )
}

export default App

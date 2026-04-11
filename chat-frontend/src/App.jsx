import { useState, useEffect } from 'react'
import './App.css';
import "./echo"; // make sure this exports Echo instance
import { Routes, Route } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

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
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected + layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>



    </>
  )
}

export default App

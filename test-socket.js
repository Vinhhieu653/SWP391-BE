import { io } from 'socket.io-client'

const socket = io('http://localhost:3333')

socket.on('connect', () => {
  console.log('Socket connected, id:', socket.id)
})

socket.on('connect_error', (err) => {
  console.log('Connection error:', err.message)
})

socket.on('notify', (data) => {
  console.log('Received notify:', data)
})
// node test-socket.js

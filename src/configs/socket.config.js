import { Server } from 'socket.io'

let io

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id)

    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id)
    })
  })

  return io
}

export const getIO = () => {
  if (!io) throw new Error('Socket.io chưa được khởi tạo')
  return io
}

import { io } from 'socket.io-client'

const userName = localStorage.getItem('currentUser')

export const connectSocket = io('http://localhost:3000', {
  auth: { name: userName },
})



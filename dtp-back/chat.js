const io = require('./server')
const log = require('./log')

// Chat
io.on('connection', (socket) => {
    const username = socket.decoded_token.name
    log.debug('User: ' + username + ' is connected')
    socket.on('disconnect', () => {
        log.debug('User: ' + username + ' disconnected')
    })

    socket.on('connectMeTo', (chatRoom) => {
        log.debug('Connecting '+username+' to chat room '+chatRoom)
        socket.join(chatRoom)
        socket.on('chat', (msg)=>{
            log.debug('('+chatRoom+') (' + username + ') : ' + msg)
            io.to(chatRoom).emit('chat', msg)
        })
    })
})
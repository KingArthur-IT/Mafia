class SocketEvents{
    enterRoom(data, cb){
        if (!data.userId || !data.roomId){
            return cb({status: 'error', text: 'Данные пользователя не корректны'})
        } else {
            cb({status: 'ok'});
            const chatMsg = {author: 'server', text: `Присоединился пользователь ${data.nickname}`};
            rooms.find(room => room.id === data.roomId).chat.push(chatMsg);
            socket.emit('newChatMsg', chatMsg)
        }
    }
}

module.exports = new SocketEvents()
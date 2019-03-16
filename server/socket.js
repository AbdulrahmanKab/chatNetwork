'use strict';
class Socket {
constructor(socket){
    this.io =socket;
    this.online_users=[];
    this.status='';
}
ioConfig(){
    this.io.use((socket,next)=>{
        socket['id']='user_'+socket.handshake.query.user_id;
        if(socket.handshake.query.mylist !=' ' || socket.handshake.query.mylist !== 'undefined'){
            socket['my_friend']=socket.handshake.query.mylist.split(',');
        }
        else {
            socket['my_friend']=[];
        }
        if(socket.handshake.query.username !=' ' || socket.handshake.query.username !== 'undefined'){
            socket['username']=socket.handshake.query.username;
        }
        else {
            socket['username']=[];
        }
        if(this.status != ''){
            socket['status'] =this.status;
        }else if (socket.handshake.query.status !=' ' || socket.handshake.query.status !== 'undefined'){
            socket['status']=socket.handshake.query.status;
            this.status =socket.handshake.query.status;
        }
        next();
    });
}
check_online(socket){

    socket.on('check_online',(data)=>{
        if(this.online_users.indexOf(data.user_id) != -1){
            var status ='online';
            try {
            this.io.sockets.connected[data.user_id].emit('iam_online',{
                user_id:socket.id,
                status:status
            });
            }catch (e) {

            }
            
        }
        else{
            var status ='offline';
        }
        try {
            
        this.io.sockets.connected[socket.id].emit('is_online',{
            user_id:data.user_id,
            status:this.status
        });
        }catch (e) {

        }

    });
}
socketConnection(){
    this.ioConfig();
    this.io.on('connection',(socket)=>{
        this.online_users=Object.keys(this.io.sockets.sockets);
       this.check_online(socket);
        this.user_status(socket);
        this.private_message(socket);
        //console.log(this.io.sockets.clients());
        //console.log('a new visitor here as session id=>',socket.id);
      /*  socket.broadcast.emit('online_user',{
            socket_id:socket.id
        });*/
        this.socketDisconnect(socket);
    });

}
user_status(socket){
    socket.on('change_status',(data)=>{

        var myfriend = socket.my_friend;
        if(myfriend.length > 0) {
            this.status =data.status;
            myfriend.forEach((user) => {
                var uid = 'user_' + user;
                if (this.online_users.indexOf(uid) != -1) {

                    this.io.sockets.connected[uid].emit('new_status', {
                        user_id: socket.id,
                        status: data.status
                    });
                }
            });
        }
    });
    }
    private_message(socket){
        socket.on('send_private_msg',(data)=>{
            this.io.sockets.connected[socket.id].emit('new_private_msg',{
                username:socket.username,
                from_uid:data.to,
                whois:socket.id,
                message:data.message
            });
           this.io.sockets.connected[data.to].emit('new_private_msg',{
               username:socket.username,
               from_uid:socket.id,
               whois:socket.id,
               message:data.message
           });
        });
    }

socketDisconnect(socket){
    socket.on('disconnect',(data)=>{
        var myfriend = socket.my_friend;
        if(myfriend.length > 0) {
            myfriend.forEach((user) => {
                var uid = 'user_' + user;
                if (this.online_users.indexOf(uid) != -1) {
                  try {
                      
                    this.io.sockets.connected[uid].emit('iam_offline', {
                        user_id: socket.id,
                        status: 'offline'
                    });
                  }catch (e) {
                      
                  }
                }
            });
        }
    });
}
}
module.exports =Socket;

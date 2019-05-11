const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) =>{
	res.render('index.html');
});

let messages = [];
let seguidores = [];
let flag =0;

//saber quando clienter conectar e comentar no mural
io.on('connection', socket =>{
	if(flag ==1){
		console.log('Novo cliente está o seguindo');
		}

		if(flag == 0){
			console.log('Servidor ativo no mural');
			flag = flag + 1;
		}
		
		socket.emit('coments', messages);

		socket.on('sendMessage', data =>{
			data['PORTA'] = (socket.request.connection.remotePort + 1);
			// console.log(data);
			messages.push(data);
			data['\n'];
			messages.push(data);

			if(seguidores.includes(data['usuario'] +","+ socket.request.connection.remotePort)){
				// console.log(data['usuario'] +" - "+ socket.request.connection.remotePort + "\n\tJá segue\n");
			}else{
				seguidores.push(data['usuario'] +","+ socket.request.connection.remotePort);
			}
			// console.log(socket.request.connection.remotePort)
			
			socket.broadcast.emit('receivedMessage', data);
			socket.broadcast.emit('seguidores',data);
			
			// console.log(messages);

			var fs = require('fs');
			fs.writeFile("log.txt",JSON.stringify(messages),(err) => {
				if (err) console.log(err);
				console.log("Log Gerado.");
			});			
			
			fs.writeFile("seguidores.txt",seguidores,(err) => {
				if (err) console.log(err);
			});
			// console.log(seguidores);

		});
		
		socket.on('unfollow', data =>{
			let a = [];
			let arr = [];

			// console.log(data);
			user = data["usuario"];
			console.log(user);
			const fs = require('fs') 
			
			fs.readFile('seguidores.txt', (err, data) => { 
				if (err) throw err; 
				
				a = data.toString();
				res = a.split(",");
				console.log(res);

				for(x=0; x<res.length; x++){
					if(res[x]==user){
						res.splice(x,2)
						console.log(res);
						console.log("Deixou de seguir voce");
					}
				}

				var fs = require('fs');
				fs.writeFile("seguidores.txt",res+',',(err) => {
					if (err) console.log(err);
			
					console.log("Seguidores atualizados.");
				});	
				
			}) 
		});
});

http.listen(3000, function(){
	console.log('Ouvindo a porta 3000')
}); //escuta na porta 3000











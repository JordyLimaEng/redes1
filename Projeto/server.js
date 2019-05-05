const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) =>{
	res.render('index.html');
});

let messages = [];
let seguidores = [];

io.on('connection', socket =>{
		socket.emit('previousMessages', messages);
		socket.on('sendMessage', data =>{
			console.log(data);
			messages.push(data);
			seguidores.push(data['usuario'] +" - "+ data['IP']);
			
			socket.broadcast.emit('receivedMessage', data);

			var fs = require('fs');
			fs.writeFile("log.txt",JSON.stringify(messages),(err) => {
				if (err) console.log(err);
				console.log("Log Gerado.");
			});
			fs.writeFile("seguidores.txt",JSON.stringify(seguidores),(err) => {
				if (err) console.log(err);
			});
		});
});

server.listen(3000);











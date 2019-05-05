import socket
ServerSock=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
ServerSock.bind(('localhost',8000))
ServerSock.listen(5)
(NewClientSock, addr) = ServerSock.accept()

while(1):
    ClientMessage = NewClientSock.recv(1000)
    if ClientMessage != 'q':
        print (ClientMessage)
        NewClientSock.send(b'opa')
    

NewClientSock.close()
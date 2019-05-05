import socket
ClientSock=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
ClientSock.connect(('localhost', 8000))
a = ' '
while(a != 'q'):
    a = input("Msg = ")
    ClientSock.send(bytes(a,'UTF-8'))
    ServerMessage = ClientSock.recv(1000)
    print (ServerMessage)
ClientSock.close()
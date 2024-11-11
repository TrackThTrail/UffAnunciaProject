import asyncio
import websockets
import json

# Dicionário para armazenar as salas de chat. Cada sala é identificada pelo `roomId`.
# A sala contém os WebSockets de dois usuários: o dono do anúncio e o que iniciou o chat.
chat_rooms = {}

# Função para lidar com a conexão WebSocket
async def chat_handler(websocket, path):
    # Recebe a primeira mensagem com o roomId
    initial_message = await websocket.recv()
    data = json.loads(initial_message)

    room_id = data.get('roomId')
    if not room_id:
        await websocket.close()
        return

    # Crie ou obtenha a sala de chat para o `roomId`
    if room_id not in chat_rooms:
        chat_rooms[room_id] = set()

    # Adiciona o WebSocket do usuário à sala do `roomId`
    chat_rooms[room_id].add(websocket)
    print(f"Usuário conectado na sala {room_id}")

    try:
        async for message in websocket:
            data = json.loads(message)
            print(f"Mensagem recebida na sala {room_id}: {data}")

            # Envia a mensagem para os outros usuários na sala do `roomId`
            for client in chat_rooms[room_id]:
                if client != websocket:
                    await client.send(json.dumps({
                        'content': data['message']
                    }))
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Conexão fechada na sala {room_id}: {e}")
    finally:
        # Remove o WebSocket da sala ao se desconectar
        chat_rooms[room_id].remove(websocket)
        if not chat_rooms[room_id]:  # Remove a sala se estiver vazia
            del chat_rooms[room_id]

# Iniciar o servidor WebSocket
async def main():
    server = await websockets.serve(chat_handler, "localhost", 8001)
    print("Servidor WebSocket rodando na porta 8001...")
    await server.wait_closed()

# Rodar o servidor WebSocket
if __name__ == "__main__":
    asyncio.run(main())

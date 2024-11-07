import asyncio
import websockets
import json

# Conjunto para armazenar todos os clientes conectados
clients = set()

# Função que vai lidar com a conexão WebSocket
async def echo(websocket, path):
    # Adiciona o cliente ao conjunto de clientes conectados
    clients.add(websocket)
    print(f"Nova conexão: {websocket}")

    try:
        async for message in websocket:
            data = json.loads(message)
            print(f"Mensagem recebida: {data}")

            # Envia a mensagem para todos os clientes conectados, exceto o que enviou
            for client in clients:
                if client != websocket:
                    await client.send(json.dumps({
                        'message': f"Mensagem de volta: {data['message']}"
                    }))
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Conexão fechada: {e}")
    finally:
        # Remove o cliente desconectado do conjunto
        clients.remove(websocket)

# Iniciar o servidor WebSocket
async def main():
    server = await websockets.serve(echo, "localhost", 8001)
    print("Servidor WebSocket rodando na porta 8001...")
    await server.wait_closed()

# Rodar o servidor WebSocket
if __name__ == "__main__":
    asyncio.run(main())

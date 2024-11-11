import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Conecta o WebSocket a um grupo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remove o WebSocket do grupo
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Recebe uma mensagem do WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Envia a mensagem para o grupo de chat
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Recebe a mensagem do grupo
    async def chat_message(self, event):
        message = event['message']

        # Envia a mensagem para o WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

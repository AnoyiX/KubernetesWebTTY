from starlette.websockets import WebSocketState
from api import app, k8s
from fastapi import WebSocket
from kubernetes.stream import stream
import json
from threading import Thread
import asyncio
from tezign import logs


async def close_websocket(websocket: WebSocket):
    """
    Close websocket if it's connected
    """
    if websocket.client_state == WebSocketState.CONNECTED:
        await websocket.close()


def close_container_stream(container_stream):
    """
    Close container stream if it's open. 
    Use 'exit' command can exit bash/sh process.
    """
    if container_stream.is_open():
        container_stream.write_stdin('exit\n')
        logs.info('Container stream closed')


class ContainerStreamThread(Thread):

    def __init__(self, websocket, container_stream):
        super(ContainerStreamThread, self).__init__()
        self.websocket = websocket 
        self.container_stream = container_stream

    def send_text(self, text):
        try:
            asyncio.run(self.websocket.send_text(text))
        except:
            asyncio.run(close_websocket(self.websocket))
            close_container_stream(self.container_stream)

    def run(self):
        while self.container_stream.is_open():
            try:
                self.container_stream.update()
                if self.container_stream.peek_stdout():
                    resp = self.container_stream.read_stdout()
                    self.send_text(resp)
                if self.container_stream.peek_stderr():
                    resp = self.container_stream.read_stderr()
                    logs.error(resp)
                    self.send_text(resp)
            except:
                break


@app.websocket('/api/k8s/terminal/{namespace}/{pod}/{container}')
async def terminal_websocket(websocket: WebSocket, namespace: str, pod: str, container: str):
    """
    Kubernetes Terminal WebSocket
    """
    await websocket.accept()

    container_stream = stream(k8s.core_v1.connect_get_namespaced_pod_exec,
                              name=pod,
                              namespace=namespace,
                              container=container,
                              command=['sh', '-c', 'bash || sh'],
                              stderr=True,
                              stdin=True,
                              stdout=True,
                              tty=True,
                              _preload_content=False)

    container_thread = ContainerStreamThread(websocket, container_stream)
    container_thread.start()

    try:
        while container_stream.is_open():
            data = await websocket.receive_text()
            if data.startswith('C4') and len(data.split(' ')) == 3:
                _, rows, cols = data.split(' ')
                container_stream.write_channel(4, json.dumps({"Height": int(rows), "Width": int(cols)}))
            else:
                container_stream.write_stdin(data)
    except:
        await close_websocket(websocket)
        close_container_stream(container_stream)

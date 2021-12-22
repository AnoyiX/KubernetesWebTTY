from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from kubernetes import client, config

class Kubernetes:
    _instance = None
    core_v1 = None
    apps_v1 = None

    def __new__(cls, *args, **kw):
        if cls._instance is None:
            cls._instance = object.__new__(cls)
        return cls._instance

    def __init__(self):
        config.load_kube_config()
        self.core_v1 = client.CoreV1Api()
        self.apps_v1 = client.AppsV1Api()


app = FastAPI(docs_url=None, redoc_url=None)
k8s = Kubernetes()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


__all__ = ['app', 'cluster', 'tty']

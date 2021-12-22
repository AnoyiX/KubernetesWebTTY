from api import app, k8s
from fastlab.models import Response


@app.get('/api/k8s/namespaces')
async def namespaces():
    ns = k8s.core_v1.list_namespace()
    return Response(data=[x.metadata.name for x in ns.items])


@app.get('/api/k8s/namespace/{namespace}/pods')
async def pods(namespace: str):
    pod = k8s.core_v1.list_namespaced_pod(namespace=namespace)
    return Response(data=[{
        'name': x.metadata.name,
        'containers': [y.name for y in x.spec.containers]
    } for x in pod.items])

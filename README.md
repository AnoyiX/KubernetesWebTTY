# KubernetesWebTTY

Web TTY for kubernetes pod containers

![](https://user-images.githubusercontent.com/12091906/147048292-c9235028-0d1c-45e5-9120-594932c048a7.gif)

## Quick Start

First, clone the repo:

```
git clone https://github.com/ChinaSilence/KubernetesWebTTY.git
```

### 🚀 Run Server

This is a [FastAPI](https://github.com/tiangolo/fastapi) project.

Make sure you have a kubernetes config file `~/.kube/config` in your machine, it's necessary for kubernetes client to connect.

```shell
cd backend/

# install packages
pip3 install -r requirements.txt

# run
python3 run.py
```

### 🚀 Run Web

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

```shell
$ cd fontend/

# install packages
$ yarn

# run
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

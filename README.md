# KubernetesWebTTY

Web TTY for kubernetes pod containers

![](https://user-images.githubusercontent.com/12091906/147033543-1e97a728-2a66-44a3-b197-65ba570a7280.png)

## Quick Start

First, clone the repo:

```
git clone https://github.com/ChinaSilence/KubernetesWebTTY.git
```

### Run Server

**1. Enter backend**

```
cd backend/
```

**2. Install python packages**

```
pip3 install -r requirements.txt
```

**3. Ensure you have kubernetes config file `~/.kube/config` in your machine**

see more [https://github.com/kubernetes-client/python](https://github.com/kubernetes-client/python)

**4. Run**

```
python3 run.py
```

### Run Web


**1. Enter fontend**

```
cd fontend/
```

**2. Install packages**

```
yarn
```

**3. Run**

```
yarn dev
```

Then, you can access `http://localhost:3000/` in browser.

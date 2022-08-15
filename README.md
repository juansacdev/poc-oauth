# Express-TS-Node app

## Introduction

Hi, if you want to run this project locally you need to run the following commands

### Set Env

```bash
cat .env.example > .env
```

And remember set your own envs

### Run in Dev mode

```
docker-compose -up --build -d
```

> You can remove the flag `-d` if you want to see the logs

### Run in Prod Mode

```bash
docker build -t node_app .
```

``` bash
docker run -p 3000:3000 -e PORT=3000 --rm -d --name node_app node_app:latest
```

> **Or**

```bash
docker run -p 3000:3000 --env-file .env --rm -d --name node_app node_app:latest
```

### Request

You can find some examples of how to make requests inside the folder `src/request`

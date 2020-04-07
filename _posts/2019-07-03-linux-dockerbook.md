---
title: "Заметки по книге - Docker"
tags: [book, docker]
reference:
  - title: Примеры из книги
    link: https://github.com/using-docker
  - title:
    link:
---

* TOC 
{:toc}

# Первый запуск

<pre><code class="shell">
$ docker run debian echo "Hello world"
Hello world
</code></pre>

# Второй запуск

<pre><code class="shell">
$ docker run -it --name cowsay --hostname cowsay debian bash
root@cowsay:/# apt-get update
...
root@cowsay:/# apt-get install -y cowsay fortune 
...
root@cowsay:/# /usr/games/fortune | /usr/games/cowsay 
 ________________________________________
/ Q: Why do firemen wear red suspenders? \
| A: To conform with departmental        |
\ regulations concerning uniform dress.  /
 ----------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
root@cowsay:/# 

</code></pre>

## Сохранение в образ

<pre><code class="shell">
$ docker commit cowsay test_rep/cowsay_image
sha256:2b9eb0b0e5c1b4984f86965a606bfc2b4edd498dd1b4684bd14196dcf817f374
</code></pre>

Запуск сохраненного контейнера
<pre><code class="shell">
$ docker run --rm test_rep/cowsay_image /usr/games/fortune
The time is right to make new friends.
avis@avisPC[16:08:40]:~$ 
</code></pre>

# `.dockerignore`

<pre><code class="shell">
$ tree -a ignore/
ignore/
├── Dockerfile
├── .dockerignore
└── project
    ├── ignore_dir
    │   └── ignore_file2
    ├── ignore_file
    └── test_file
</code></pre>

<pre><code class="shell">
$ cat Dockerfile 
FROM ubuntu:bionic

COPY project /project

CMD ["ls -l /project"]
</code></pre>

<pre><code class="shell">
$ cat .dockerignore 
project/ignore_file
project/ignore_dir
</code></pre>

<pre><code class="shell">
$ docker build -t docker_ignore .
Sending build context to Docker daemon  4.608kB
Step 1/3 : FROM ubuntu:bionic
...
$ docker run --rm docker_ignore ls -l /project
total 4
-rw-rw-r-- 1 root root 2 Jan  2 21:42 test_file
</code></pre>

## Запуск сломанного контейнера

Сломаный Dockerfile
<pre><code class="shell">
$ cat Dockerfile 
FROM busybox:latest

RUN echo "This work"
RUN /bin/bash -c echo "Don't work"
</code></pre>

<pre><code class="shell">
$ docker build -t broken_docker .
Sending build context to Docker daemon  2.048kB
Step 1/3 : FROM busybox:latest
latest: Pulling from library/busybox
bdbbaa22dec6: Pull complete 
Digest: sha256:6915be4043561d64e0ab0f8f098dc2ac48e077fe23f488ac24b665166898115a
Status: Downloaded newer image for busybox:latest
 ---> 6d5fcfe5ff17
Step 2/3 : RUN echo "This work"
 ---> Running in 355ebdba00cd
This work
Removing intermediate container 355ebdba00cd
 ---> 0ad8dcf1336f
Step 3/3 : RUN /bin/bash -c echo "Don't work"
 ---> Running in a05f700c27cc
/bin/sh: /bin/bash: not found
The command '/bin/sh -c /bin/bash -c echo "Don't work"' returned a non-zero code: 127
</code></pre>

Запуск до того как что-то пошло не так
<pre><code class="shell">
$ docker run -it 0ad8dcf1336f
/ # /bin/sh -c /bin/bash -c echo "Don't work"
-c: line 1: /bin/bash: not found
/ # /bin/sh -c  "echo it is work!!!"
it is work!!!
/ # 
</code></pre>

# Третий запуск `idendidock v1`

<pre><code class="shell">
$ tree docker_app/
docker_app/
└── identidock
    ├── app
    │   └── identidock.py
    └── Dockerfile
</code></pre>

<pre><code class="python">
$ cat app/identidock.py 
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return "Hello world!\n"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
</code></pre>

<pre><code class="shell">
$ cat Dockerfile 
FROM python:3.4

RUN pip install Flask

WORKDIR /app
COPY app /app

CMD ["python", "identidock.py"]
</code></pre>

<pre><code class="shell">
$ docker run --rm -p 5000:5000 --name identidock identidock
 * Serving Flask app "identidock" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 198-496-690
172.17.0.1 - - [03/Jan/2020 15:44:06] "GET / HTTP/1.1" 200 -
</code></pre>

<pre><code class="shell">
$ curl localhost:5000
Hello world!
</code></pre>

Для запуска с возможностью править с наружи 
<pre><code class="shell">
$ docker run -v $(pwd)/app:/app -p 5000:5000 --rm --name identidock identidock
 * Serving Flask app "identidock" (lazy loading)
...
</code></pre>

<pre><code class="shell">
$ curl localhost:5000
Hello aaa!
</code></pre>

## Запуск с wsgi

Скрипт с возможностью выбора запуска
<pre><code class="shell">
$ cat cmd.sh 
#!/usr/bin/env bash

if [ "$RUN" == 'DEV' ]; then
    echo "Run Dev Server";
    exec python "identidock.py"
else
    echo "Run Prod Server";
    exec uwsgi --http 0.0.0.0:9090 --wsgi-file /app/identidock.py --callable app --stats=0.0.0.0:9191
fi
</code></pre>

<pre><code class="shell">
$ cat Dockerfile 
FROM python:3.5

RUN groupadd -r uwsgi && useradd -r -g uwsgi uwsgi
RUN pip install Flask uWSGI

WORKDIR /app
COPY app /app
COPY cmd.sh /

EXPOSE 9090 9191
USER uwsgi

CMD ["/cmd.sh"]
</code></pre>

если `-e RUN=DEV` то запускается dev сервер на 5000 порту
<pre><code class="shell">
$ docker run -e RUN=DEV --rm -p 5000:5000 --name identidock identidock_wsgi
Run Dev Server
 * Serving Flask app "identidock" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 262-056-075
</code></pre>

Иначе, wsgi на 9090 порту
<pre><code class="shell">
$ docker run --rm -p 9090:9090 --name identidock identidock_wsgi
Run Prod Server
*** Starting uWSGI 2.0.18 (64bit) on [Fri Jan  3 16:25:54 2020] ***
compiled with version: 8.3.0 on 03 January 2020 16:15:38
os: Linux-4.15.0-72-generic #81~16.04.1-Ubuntu SMP Tue Nov 26 16:34:21 UTC 2019
nodename: 5403374c8abf
machine: x86_64
...
</code></pre>

## Использования микросервисов

<pre><code class="shell">
$ docker run --rm --name dnmonster amouat/dnmonster:1.0 
Unable to find image 'amouat/dnmonster:1.0' locally
1.0: Pulling from amouat/dnmonster
</code></pre>

<pre><code class="shell">
$ docker run -e RUN=DEV -p 5000:5000 --rm --name identidock --link dnmonster:dnmonster identidock
Run Dev Server
 * Serving Flask app "identidock" (lazy loading)
</code></pre>

При запросе `/monsert/<name>` делается запрос в соседний контейнер
<pre><code class="python">
@app.route('/monster/&lg;name&gl;')
def get_identicon(name):
    res = requests.get('http://dnmonster:8080/monster/' + name + '?size=80')
    image = res.content

    return Response(image, mimetype='image/png')
</code></pre>


# Распространение образов

<pre><code class="shell">
$ docker push avis20/identidock:1.0 
The push refers to repository [docker.io/avis20/identidock]
</code></pre>


### `ansible` - Использование инструментальных средств управления конфигурацией 



# Глава 10. Ведение логов

и stdout и stderr попадает в вывод консоли
<pre><code class="shell">
$ docker run --name testlog ubuntu bash -c 'echo "stdout"; echo "stderr" >&2'
stderr
stdout
</code></pre>

а также доступен через команду logs
<pre><code class="shell">
$ docker logs testlog
stdout
stderr
</code></pre>


## Подключение ELK

### 1) Подключаем logspout для записи в logstash

`docker-compose.yml`
<pre><code class="shell">
...
  logspout:
    image: amouat/logspout-logstash:1.0
    container_name: identilogspout
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - "8000:80"
...
</code></pre>

Запускаем, проверяем
<pre><code class="shell">
$ docker-compose up
Starting identiredis ... 
Starting identilogspout ... 
Starting identidnmonster ... done
Starting identidock ... done
Starting identiproxy ... done
</code></pre>

<pre><code class="shell">
$ curl localhost
DOCTYPE
</code></pre>

Все что теперь возвращается ИЗ КАЖДОГО контейнера, выводиться и из logsoput
<pre><code class="shell">
$ curl localhost:8000/logs
identidock|[pid: 7|app: 0|req: 1/1] 172.23.0.6 () {34 vars in 375 bytes} [Sun Feb  2 19:29:38 2020] GET / => generated 455 bytes in 4 msecs (HTTP/1.0 200) 2 headers in 80 bytes (1 switches on core 0)
identiproxy|172.23.0.1 - - [02/Feb/2020:19:29:38 +0000] "GET / HTTP/1.1" 200 455 "-" "curl/7.47.0" "-"
</code></pre>

### 2) Пишем в logstash

Добавляем в `compose.yml`
<pre><code class="shell">
...
  logspout:
    image: amouat/logspout-logstash:1.0
    container_name: identilogspout
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - "8000:80"
    links:
      - "logstash" <- линк на логстеш
    command: logstash://logstash:5000 <- хз
...
...
  logstash:
    image: logstash:6.8.6
    container_name: identilogstash
    volumes:
      - ./identilogs/logstash.conf:/etc/logstash.conf
    environment:
      LOGSPOUT: ignore
    command: -f /etc/logstash.conf
...
</code></pre>

<div class="warn">
  <p>ВАЖНО добавить `LOGSPOUT: ignore` т.к. spout будет постоянно реагировать на изменения в stash и писать об этом в stash.</p>
  <p>Кароче, будет бесконечный цикл если не добавить</p>
</div>

`logstash.conf` прост
<pre><code class="shell">
input {
  tcp {
    port => 5000
    codec => json
  }
  udp {
    port => 5000
    codec => json
  }
}

output {
  stdout { codec => rubydebug }
}
</code></pre>

Проверяем
<pre><code class="shell">
$ docker-compose-restart 
Stopping identiproxy     ... done
Stopping identidock      ... done
Stopping identidnmonster ... done
Stopping identiredis     ... done
...
</code></pre>

<pre><code class="shell">
$ curl -s localhost 
DOCTYPE
</code></pre>

<pre><code class="shell">
identidock     | [pid: 7|app: 0|req: 1/1] 172.26.0.7 () {34 vars in 376 bytes} [Sun Feb  9 10:58:52 2020] GET / => generated 455 bytes in 5 msecs (HTTP/1.0 200) 2 headers in 80 bytes (1 switches on core 0)
identiproxy    | 172.26.0.1 - - [09/Feb/2020:10:58:52 +0000] "GET / HTTP/1.1" 200 455 "-" "curl/7.47.0" "-"
identilogstash | {
identilogstash |        "message" => "[pid: 7|app: 0|req: 1/1] 172.26.0.7 () {34 vars in 376 bytes} [Sun Feb  9 10:58:52 2020] GET / => generated 455 bytes in 5 msecs (HTTP/1.0 200) 2 headers in 80 bytes (1 switches on core 0)",
identilogstash |         "stream" => "stderr",
identilogstash |         "docker" => {
identilogstash |             "name" => "/identidock",
identilogstash |               "id" => "700340d8bb953e0416a2835f3d3aea57f5bccf62f9fa5fa4fce70d360b242bfa",
identilogstash |            "image" => "identidockv12elk_identidock",
identilogstash |         "hostname" => "700340d8bb95"
identilogstash |     },
identilogstash |       "@version" => "1",
identilogstash |     "@timestamp" => "2020-02-09T10:58:52.242Z",
identilogstash |           "host" => "172.26.0.5"
identilogstash | }
identilogstash | {
identilogstash |        "message" => "172.26.0.1 - - [09/Feb/2020:10:58:52 +0000] \"GET / HTTP/1.1\" 200 455 \"-\" \"curl/7.47.0\" \"-\"",
identilogstash |         "stream" => "stdout",
identilogstash |         "docker" => {
identilogstash |             "name" => "/identiproxy",
identilogstash |               "id" => "6469d1201424640b3a8d55e16878f63713a7313a926ffc79792ab235ebbb7837",
identilogstash |            "image" => "identidockv12elk_identiproxy",
identilogstash |         "hostname" => "6469d1201424"
identilogstash |     },
identilogstash |       "@version" => "1",
identilogstash |     "@timestamp" => "2020-02-09T10:58:52.242Z",
identilogstash |           "host" => "172.26.0.5"
identilogstash | }
</code></pre>

Здесь
* identidock - сообщение из приложения
* identiproxy - сообщение из nginx-а
* identilogstash - все что попало в логстеш

Для форматирования сообщений, можно добавить обработку в `logstash.conf`
<pre><code class="shell">
...
filter {
  if [docker][name] =~ /^\/identiproxy.*/ {
    mutate { replace => { type => "nginx" } }
    grok {
      match => { "message" => "%{COMBINEDAPACHELOG}" }
    }
  }
}
...
</code></pre>

Тогда вывод сообщений nginx-а будет подробнее 
<pre><code class="shell">
identilogstash | {
identilogstash |         "message" => "172.28.0.1 - - [09/Feb/2020:11:12:18 +0000] \"GET / HTTP/1.1\" 200 455 \"-\" \"curl/7.47.0\" \"-\"",
identilogstash |          "stream" => "stdout",
identilogstash |          "docker" => {
identilogstash |             "name" => "/identiproxy",
identilogstash |               "id" => "b52e0b5616ea857e6a251043724393d2ed56c9ce2e2d87f860ab2ec4d552fd7f",
identilogstash |            "image" => "identidockv12elk_identiproxy",
identilogstash |         "hostname" => "b52e0b5616ea"
identilogstash |     },
identilogstash |        "@version" => "1",
identilogstash |      "@timestamp" => "2020-02-09T11:12:18.444Z",
identilogstash |            "host" => "172.28.0.5",
identilogstash |            "type" => "nginx",
identilogstash |        "clientip" => "172.28.0.1",
identilogstash |           "ident" => "-",
identilogstash |            "auth" => "-",
identilogstash |       "timestamp" => "09/Feb/2020:11:12:18 +0000",
identilogstash |            "verb" => "GET",
identilogstash |         "request" => "/",
identilogstash |     "httpversion" => "1.1",
identilogstash |        "response" => "200",
identilogstash |           "bytes" => "455",
identilogstash |        "referrer" => "\"-\"",
identilogstash |           "agent" => "\"curl/7.47.0\""
identilogstash | }
</code></pre>

### 3) Соединяем logstash с elastic + kibana

<div class="warn">
  <p>Последняя версия ELK (6.8.6) очень плохо (совсем) не работает. Или ее надо как-то по особенному готовить</p>
  <p>Ошибка одна и таже, logspout не может писать в logstash...</p>
</div>

`compose.yml`
<pre><code class="shell">
...
  logstash:
    image: logstash:2.3.4
    container_name: identilogstash
    volumes:
      - ./identilogs/logstash.2.3.4.conf:/etc/logstash.conf
    environment:
      LOGSPOUT: ignore
    links:
      - "elasticsearch" <- добавляем связь с elastic
    command: -f /etc/logstash.conf
...
</code></pre>

<pre><code class="shell">
...
  kibana:
    image: kibana:4.6.6
    container_name: identikibana
    environment:
      LOGSPOUT: ignore
      ELASTICSEARCH_URL: http://elasticsearch:9200
    links:
      - "elasticsearch"
    ports:
      - "5601:5601"
    
  elasticsearch:
    image: elasticsearch:2.4.0
    container_name: identielastic
    environment:
      LOGSPOUT: ignore
...
</code></pre>

<div class="warn">
  <p>Во время запуска elasticsearch версии 6.8.6 возможна ошибка</p>
  <pre><code class="shell">
identielastic    | [1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
  </code></pre>
  <p>Она решается командой</p>
  <pre><code class="shell">
$ sudo sysctl -w vm.max_map_count=262144
  </code></pre>
</div>

### Замена logspout на rsyslog

<div class="info">
  <p>Вобщем, это как-то делается, но нужно ковырять хост... А виртуалки пока неть</p>
</div> 

## Пишем в prometheus 

Например из cadvisor
`compose.yml`
<pre><code class="shell">
...
  cadvisor:
    image: google/cadvisor:canary
    container_name: identicadvisor
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports:
      - "8080:8080"

  prometheus:
    image: prom/prometheus:master
    container_name: identiprometheus
    ports:
      - "9090:9090"
    links:
      - "cadvisor"
    volumes:
      - ./prometheus.conf:/prometheus.conf
    command: --config.file=/prometheus.conf
...
</code></pre>

`prometheus.conf`
<pre><code class="shell">
global:
  scrape_interval: 1m
  scrape_timeout: 10s 
  evaluation_interval: 1m

scrape_configs:

- job_name: prometheus
  scheme: http
  static_configs:
  - targets:
    - 'cadvisor:8080'
    - 'localhost:9090'
</code></pre>

<pre><code class="shell">
$ curl http://localhost:9090/
a href="/graph">Found /a.
</code></pre>


# Обнаружение сервисов

## Использование посредников `ambassadors`

Контейнеры-прокси 

## Кластерное key-value хранилище - `etcd`

1) Запускаем кластер из 2-х нод

0) Подгатавливаем виртуалки
<pre><code class="shell">$ tree -a
.
├── etcd-1
│   ├── <a href="#etcd-1-docker-compose.yml">docker-compose.yml</a>
│   ├── <a href="#etcd-1-env">.env</a>
│   ├── install-docker.sh
│   ├── start-coreos-etcd.sh
│   └── Vagrantfile
├── etcd-2
│   ├── docker-compose.yml
│   ├── install-docker.sh
│   ├── start-coreos-etcd.sh
│   ├── test.sh
│   └── Vagrantfile
├── identiproject
│   ├── docker-compose.yml
│   ├── identidock
│   │   ├── app
│   │   │   ├── identidock.py
│   │   │   └── tests.py
│   │   ├── cmd.sh
│   │   └── Dockerfile
│   └── identiproxy
│       ├── Dockerfile
│       └── main.conf
├── install-docker.sh
└── start-etcd.sh
</code></pre>

<h6 id="etcd-1-docker-compose.yml">etcd-1-docker-compose.yml</h6>
<pre><code class="shell">
version: '3'
services:

  etcd-1:
    image: quay.io/coreos/etcd <- оф. образ etcd
    ports: <- порты наружу
      - "2379:2379"
      - "2380:2380"
      - "4001:4001"
    env_file: .env <- файл с env
    volumes:
      - ./start-coreos-etcd.sh:/start-coreos-etcd.sh <- скрипт запуска
    command: /start-coreos-etcd.sh <- команда запуска

  skydns:
    image: skynetservices/skydns:2.5.2a <- оф образ
    env_file: .env <- переменные такие же как и для 
</code></pre>

<h6 id="etcd-1-env">etcd-1-env</h6>
<pre><code class="shell">
HOSTA=3.3.3.2
HOSTB=3.3.3.3
ETCD_MACHINES="http://${HOSTA}:2379,http://${HOSTB}:2379"

</code></pre>



---

Список членов кластера

<pre><code class="shell">
curl 3.3.3.2:2379/v2/members | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   242  100   242    0     0   104k      0 --:--:-- --:--:-- --:--:--  118k
{
  "members": [
    {
      "id": "b37e8e15adc9b184",
      "name": "etcd-2",
      "peerURLs": [
        "http://3.3.3.3:2380"
      ],
      "clientURLs": [
        "http://3.3.3.3:2379"
      ]
    },
    {
      "id": "c8b6c5b68f9d2156",
      "name": "etcd-1",
      "peerURLs": [
        "http://3.3.3.2:2380"
      ],
      "clientURLs": [
        "http://3.3.3.2:2379"
      ]
    }
  ]
}
</code></pre>

Проверка записи
<pre><code class="shell">
curl 3.3.3.2:2379/v2/keys/test_key2 -XPUT -d value="test_value2" | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   207  100   191  100    16  22811   1910 --:--:-- --:--:-- --:--:-- 23875
{
  "action": "set",
  "node": {
    "key": "/test_key",
    "value": "test_value",
    "modifiedIndex": 13,
    "createdIndex": 13
  },
  "prevNode": {
    "key": "/test_key",
    "value": "test_value",
    "modifiedIndex": 12,
    "createdIndex": 12
  }
}
</code></pre>

Проверка получения
<pre><code class="shell">
curl 3.3.3.3:2379/v2/keys/test_key -XGET | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   102  100   102    0     0  37582      0 --:--:-- --:--:-- --:--:-- 51000
{
  "action": "get",
  "node": {
    "key": "/test_key",
    "value": "test_value",
    "modifiedIndex": 13,
    "createdIndex": 13
  }
}
</code></pre>

## SkyDNS

Если вы успешно выполнили самый последний пример из предыдущего раздела, то у вас есть два сервера, работающих
в кластере etcd: etcd-1 с IP-адресом $HOSTA и  etcd-2 с IP-адресом $HOSTB

<pre><code class="shell">
curl -XPUT http://${HOSTA}:2379/v2/keys/skydns/config -d value='{"dns_addr":0.0.0.0:53", "domain":"identidock.local."}' | jq .
</code></pre>

<pre><code class="shell">
curl -XGET http://${HOSTA}:2379/v2/keys/skydns/config
</code></pre>

<pre><code class="shell">
docker run -d -e ETCD_MACHINES="http://${HOSTA}:2379,http://${HOSTB}:2379"  --name dns skynetservices/skydns:2.5.2a
</code></pre>

не получилось...
<pre><code class="shell">
vagrant@vagrant:~/project$ docker run -e ETCD_MACHINES="http://${HOSTA}:2379,http://${HOSTB}:2379"  --name dns skynetservices/skydns:2.5.2a
2020/02/22 14:50:39 skydns: falling back to default configuration, could not read from etcd: 501: All the given peers are not reachable (Tried to connect to each peer twice and failed) [0]
2020/02/22 14:50:39 skydns: ready for queries on skydns.local. for tcp://127.0.0.1:53 [rcache 0]
2020/02/22 14:50:39 skydns: ready for queries on skydns.local. for udp://127.0.0.1:53 [rcache 0]
</code></pre>


## Consul

Список нод в кластере
<pre><code class="shell">
$ docker exec consul-1 consul members
</code></pre>

Запись
<pre><code class="shell">
$ HOSTA=3.3.3.2
$ curl -XPUT http://$HOSTA:8500/v1/kv/foo -d bar
true

</code></pre>

Чтение 
<pre><code class="shell">
$ curl http://$HOSTA:8500/v1/kv/foo | jq .
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    88  100    88    0     0  21113      0 --:--:-- --:--:-- --:--:-- 22000
[
  {
    "LockIndex": 0,
    "Key": "foo",
    "Flags": 0,
    "Value": "YmFy",
    "CreateIndex": 52,
    "ModifyIndex": 52
  }
]

</code></pre>

А теперь перекодируем
<pre><code class="shell">
curl -s http://$HOSTA:8500/v1/kv/foo | jq -r '.[].Value' | base64 -d
bar
</code></pre>



Регистрация сервиса redis в виртуалке consul-2
<pre><code class="shell">
docker run -d -p 6379:6379 --name redis redis:3
export HOSTB=3.3.3.3
curl -XPUT http://$HOSTB:8500/v1/agent/service/register -d '{"name":"redis", "address":"'$HOSTB'", "port":6379}'
</code></pre>

Проверяем что зарегали
<pre><code class="shell">
$ curl -s http://$HOSTB:8500/v1/agent/services | json_pp
{
   "redis" : {
      "Tags" : null,
      "ID" : "redis",
      "ModifyIndex" : 0,
      "Address" : "3.3.3.3",
      "Port" : 6379,
      "EnableTagOverride" : false,
      "Service" : "redis",
      "CreateIndex" : 0
   },
   "consul" : {
      "Service" : "consul",
      "CreateIndex" : 0,
      "EnableTagOverride" : false,
      "ID" : "consul",
      "ModifyIndex" : 0,
      "Tags" : [],
      "Port" : 8300,
      "Address" : ""
   }
}
</code></pre>


# Оркестрация

## `Swarm`

Установка docker-machine
<pre><code class="shell">
base=https://github.com/docker/machine/releases/download/v0.16.2 && \
curl -L $base/docker-machine-$(uname -s)-$(uname -m) >/tmp/docker-machine && \
sudo install /tmp/docker-machine /usr/local/bin/docker-machine
</code></pre>

Создаем 3 виртуалки
<pre><code class="shell">
$ docker-machine create --driver virtualbox --engine-label dc=a --swarm --swarm-master swarm-master
...
$ docker-machine ssh swarm-master
...
$ docker swarm init --advertise-addr eth1
...
docker swarm join --token SWMTKN-1-1bywbigdgpl8480ly57pxt99mm8nqv8hmvthche994zwytfvo7-ddjr6g15dnk4pkcra8metekl9 192.168.99.100:2377
...
$ SWARM_TOKE="SWMTKN-1-1bywbigdgpl8480ly57pxt99mm8nqv8hmvthche994zwytfvo7-ddjr6g15dnk4pkcra8metekl9 192.168.99.100:2377"

$ docker-machine create -d virtualbox --engine-label dc=a --swarm --swarm-discovery token://$SWARM_TOKEN swarm-1
...
$ docker-machine create -d virtualbox --engine-label dc=b --swarm --swarm-discovery token://$SWARM_TOKEN swarm-2
...
</code></pre>

Список вирт машин
<pre><code class="shell">
$ docker-machine ls
NAME           ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER     ERRORS
dev1           -        virtualbox   Stopped                                       Unknown    
dev2           -        virtualbox   Stopped                                       Unknown    
swarm-1        -        virtualbox   Running   tcp://192.168.99.101:2376           v19.03.5   
swarm-2        -        virtualbox   Running   tcp://192.168.99.102:2376           v19.03.5   
swarm-master   -        virtualbox   Running   tcp://192.168.99.100:2376           v19.03.5   
</code></pre>

ЗЫ Очень старая дока по сварму, нужно глянуть че по новее

## `fleet`

## `Kubernetes`

список подов
<pre><code class="shell">
$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
redis-controller-8tgxq   1/1     Running   0          3m37s
</code></pre>

<pre><code class="shell">
$ kubectl get services
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
kubernetes   ClusterIP   10.96.0.1      none          443/TCP    22m
redis        ClusterIP   10.99.71.117   none          6379/TCP   12s
</code></pre>

## `Mesos`

# Глава 13. Обеспечение безопасности контейнеров и связанные с этим ограничения

## Механизм подтверждения контента в  Docker

<pre><code class="shell">
export DOCKER_CONTENT_TRUST=1
</code></pre>
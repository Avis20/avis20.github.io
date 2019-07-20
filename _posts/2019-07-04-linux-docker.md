---
title: Изучаем Docker
tags: docker
reference:
  - title: "Изучаем Docker, часть 1: основы"
    link: https://habr.com/ru/company/ruvds/blog/438796/

  - title: "Виртуализация процесса разработки, часть 2: Docker и Vagrant"
    link: https://dou.ua/lenta/articles/vagrant/

  - title:
    link:
  - title:
    link:
---

* TOC 
{:toc}

# Установка

## Установка в любую систему через оф. скрипт `get.docker.com`

<pre><code class="bash">
$ curl https://get.docker.com > /tmp/install.sh
$ cat /tmp/install.sh
...
$ chmod +x /tmp/install.sh
$ /tmp/install.sh
...
</code></pre>

После выполнения скрипта будет уст. стабильная версия docker и все доп. пакеты

После выполнения скрипта будет предложено добавить пользователя docker в группу суперпользователей чтобы не вводить sudo в дальнейшем. Пример

<pre><code class="bash">
sudo usermod -aG docker vagrant
</code></pre>

И перезапуск демона

<pre><code class="bash">
sudo service docker restart
</code></pre>

## Установка в Ubuntu 16.04. v2

1) Преинсталяция
<pre><code class="bash">
sudo apt-get update
</code></pre>

<pre><code class="bash">
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
...
OK
...
</code></pre>

<pre><code class="bash">
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
</code></pre>

<pre><code class="bash">
sudo apt-get update
</code></pre>

<pre><code class="bash">
apt-cache policy docker-engine
</code></pre>

2) Установка docker-ce
<pre><code class="bash">
sudo apt-get install -y docker-engine
</code></pre>

### Использование docker без прав sudo

<pre><code class="bash">
sudo usermod -aG docker $(whoami)
</code></pre>

### Если хочеться автокомплит но его нет...

<pre><code class="bash">
sudo apt-get update
sudo apt-get install bash-completion
</code></pre>

## Установка docker-compose

<pre><code class="bash">
sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
...
sudo chmod +x /usr/local/bin/docker-compose
...
docker-compose --version    
</code></pre>

## Установка docker-machine

<pre><code class="perl">
base=https://github.com/docker/machine/releases/download/v0.16.0 && \
sudo curl -L $base/docker-machine-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-machine && \
sudo chmod +x /usr/local/bin/docker-machine
</code></pre>

<pre><code class="perl">
base=https://github.com/docker/machine/releases/download/v0.16.0 && \
curl -L $base/docker-machine-$(uname -s)-$(uname -m) >/tmp/docker-machine && \
sudo install /tmp/docker-machine /usr/local/bin/docker-machine
</code></pre>

# Запуск

<details>
    <summary>
        Ключи
    </summary>
<ul>
    <li><b>-a</b> = </li>
    <li><b>--add-host</b> = </li>
    <li><b>--attach</b> = </li>
    <li><b>--blkio-weight</b> = </li>
    <li><b>--blkio-weight-device</b> = </li>
    <li><b>-c</b> = </li>
    <li><b>--cap-add</b> = </li>
    <li><b>--cap-drop</b> = </li>
    <li><b>--cgroup-parent</b> = </li>
    <li><b>--cidfile</b> = </li>
    <li><b>--cpu-period</b> = </li>
    <li><b>--cpu-quota</b> = </li>
    <li><b>--cpu-rt-period</b> = </li>
    <li><b>--cpu-rt-runtime</b> = </li>
    <li><b>--cpus</b> = </li>
    <li><b>--cpuset-cpus</b> = </li>
    <li><b>--cpuset-mems</b> = </li>
    <li><b>--cpu-shares</b> = </li>
    <li><b>-d</b> = </li>
    <li><b>--detach</b> = </li>
    <li><b>--detach-keys</b> = </li>
    <li><b>--device</b> = </li>
    <li><b>--device-cgroup-rule</b> = </li>
    <li><b>--device-read-bps</b> = </li>
    <li><b>--device-read-iops</b> = </li>
    <li><b>--device-write-bps</b> = </li>
    <li><b>--device-write-iops</b> = </li>
    <li><b>--disable-content-trust=false</b> = </li>
    <li><b>--dns</b> = </li>
    <li><b>--dns-option</b> = </li>
    <li><b>--dns-search</b> = </li>
    <li><b>-e</b> = </li>
    <li><b>--entrypoint</b> = </li>
    <li><b>--env</b> = </li>
    <li><b>--env-file</b> = </li>
    <li><b>--expose</b> = </li>
    <li><b>--group-add</b> = </li>
    <li><b>-h</b> = </li>
    <li><b>--health-cmd</b> = </li>
    <li><b>--health-interval</b> = </li>
    <li><b>--health-retries</b> = </li>
    <li><b>--health-start-period</b> = </li>
    <li><b>--health-timeout</b> = </li>
    <li><b>--help</b> = </li>
    <li><b>--hostname</b> = </li>
    <li><b>-i</b> = </li>
    <li><b>--init</b> = </li>
    <li><b>--interactive</b> = </li>
    <li><b>--ip</b> = </li>
    <li><b>--ip6</b> = </li>
    <li><b>--ipc</b> = </li>
    <li><b>--kernel-memory</b> = </li>
    <li><b>-l</b> = </li>
    <li><b>--label</b> = </li>
    <li><b>--label-file</b> = </li>
    <li><b>--link</b> = </li>
    <li><b>--link-local-ip</b> = </li>
    <li><b>--log-driver</b> = </li>
    <li><b>--log-opt</b> = </li>
    <li><b>-m</b> = </li>
    <li><b>--mac-address</b> = </li>
    <li><b>--memory</b> = </li>
    <li><b>--memory-reservation</b> = </li>
    <li><b>--memory-swap</b> = </li>
    <li><b>--memory-swappiness</b> = </li>
    <li><b>--mount</b> = </li>
    <li><b>--name</b> = </li>
    <li><b>--network</b> = </li>
    <li><b>--network-alias</b> = </li>
    <li><b>--no-healthcheck</b> = </li>
    <li><b>--oom-kill-disable</b> = </li>
    <li><b>--oom-score-adj</b> = </li>
    <li><b>-p</b> = </li>
    <li><b>-P</b> = </li>
    <li><b>--pid</b> = </li>
    <li><b>--pids-limit</b> = </li>
    <li><b>--privileged</b> = </li>
    <li><b>--publish</b> = </li>
    <li><b>--publish-all</b> = </li>
    <li><b>--read-only</b> = </li>
    <li><b>--restart</b> = </li>
    <li><b>--rm</b> = </li>
    <li><b>--runtime</b> = </li>
    <li><b>--security-opt</b> = </li>
    <li><b>--shm-size</b> = </li>
    <li><b>--sig-proxy=false</b> = </li>
    <li><b>--stop-signal</b> = </li>
    <li><b>--stop-timeout</b> = </li>
    <li><b>--storage-opt</b> = </li>
    <li><b>--sysctl</b> = </li>
    <li><b>-t</b> = </li>
    <li><b>--tmpfs</b> = </li>
    <li><b>--tty</b> = </li>
    <li><b>-u</b> = </li>
    <li><b>--ulimit</b> = </li>
    <li><b>--user</b> = </li>
    <li><b>--userns</b> = </li>
    <li><b>--uts</b> = </li>
    <li><b>-v</b> = </li>
    <li><b>--volume</b> = </li>
    <li><b>--volume-driver</b> = </li>
    <li><b>--volumes-from</b> = </li>
    <li><b>-w</b> = </li>
    <li><b>--workdir</b> = </li>
</ul>
</details>

## Запуск контейнера `docker run`

`docker run debian echo "hi"`

Эта команда скачает образ debian из репозитория и выполнит команду echo

<pre><code class="bash">
$ sudo docker run debian echo "hi"
Unable to find image 'debian:latest' locally
latest: Pulling from library/debian
6f2f362378c5: Pull complete 
Digest: sha256:118cf8f3557e1ea766c02f36f05f6ac3e63628427ea8965fb861be904ec35a6f
Status: Downloaded newer image for debian:latest
hi
</code></pre>

## Запуск и вход в контейнер `docker run -it`

`docker run -i -t debian bash`

Ключи `it` позволяют создавать tty соединение с контейнером

<pre><code class="bash">
$ docker run -it debian bash
root@14e5a4e1cce8:/#
</code></pre>

## Запустить контейнер в фоновом режим `docker run -d`

<pre><code class="bash">
$ docker run --name myredis -d redis
7240fde0e186a5d97bfb58a6830e60c391d89d057195ba8afe7c19b394c8479a
</code></pre>

## Запустить контейнер и иметь возможность править файлы с наружи `docker -v`

<pre><code class="perl">
$ docker run --rm -v "$(pwd)"/app:/app identidock
</code></pre>


## Задать имя контейнеру `--name CONTAINER`

`docker run --name avis-doc`

Задается имя по которому можно обращяться к контейнеру

<pre><code class="bash">
$ docker run --name avis-doc -it debian bash
root@a0f5e7575c36:/# 
...
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
a0f5e7575c36        debian              "bash"              17 seconds ago      Up 15 seconds                           avis-doc
</code></pre>

## Задать имя оболочки `-h mybash`

`docker run -h mybash -it debian bash`

<pre><code class="bash">
$ docker run -h mybash -it debian bash
root@mybash:/# 
</code></pre>

## Запустить контейнер с открытыми портами `docker run -P`

Используется проброс порта на хост машину

<pre><code class="bash">
$ docker run -P --name myredis -d redis
5090844a319c99b44e6c2d69b5a0003f34c44a2158cccf407ce0cae849894bdf
vagrant@ubuntu-xenial:~$ docker port myredis 
6379/tcp -> 0.0.0.0:32768
</code></pre>

## Узнать какие порты открыты `docker port`

<pre><code class="bash">
vagrant@ubuntu-xenial:~$ docker port myredis 
6379/tcp -> 0.0.0.0:32768
</code></pre>

## Список запущеных контейнеров `docker ps`

`docker ps`

Команда выводит краткую информацию о контейнерах. В последнем столбце `NAMES` контейнеру писваивается название по которому можно обращаться вместо ID

<pre><code class="bash">
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
83de7485c503        debian              "bash"              6 minutes ago       Up 6 minutes                            priceless_curie
vagrant@ubuntu-xenial:~$ 
</code></pre>

## Список всех контейнеров `docker ps -a`

После выполнения команды docker ps -a выводится список
всех контейнеров, включая остановленные (stopped)

<pre><code class="bash">
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS                          PORTS               NAMES
384b48afd439        debian              "bash"              About a minute ago   Exited (0) About a minute ago                       upbeat_visvesvaraya
a5f7f69f6234        debian              "bash"              8 minutes ago        Exited (0) 3 minutes ago                            docker-cont    
</code></pre>

## Информация о контейнере `docker inspect`

`docker inspect [NAME|ID|часть id (?)]`

Выводит полную информацию о контейнере в формате json

<pre><code class="bash">
$ docker inspect 83de7485c503
[
    {
        "Id": "83de7485c5031703389660e8a7c3f8b618677a74aa94561da8986f7fb2cb9086",
        "Created": "2019-07-04T21:34:43.379541435Z",
        "Path": "bash",
        "Args": [],
        "State": {
            "Status": "running",
            "Running": true,
        },
        "NetworkSettings": {
            "IPAddress": "172.17.0.2",
        }
    }
]
</code></pre>

## Список файлов измененных в контейнере `docker diff`

`docker diff friendly_wozniak`

<pre><code class="bash">
$ docker diff friendly_wozniak 
C /bin
D /bin/echo
A /test
</code></pre>

## Список событий произошедших в контейнере `docker logs`

<pre><code class="bash">
$ docker logs docker-cont 
root@a5f7f69f6234:/# ls
bin   dev  home  lib64  mnt  proc  run   srv  tmp  var
boot  etc  lib   media  opt  root  sbin  sys  usr
root@a5f7f69f6234:/# alala
bash: alala: command not found
</code></pre>

## Cоздать но не запускать контейнер `docker create`

<pre><code class="bash">
$ docker create debian
c935ea21cd290d56370ec096479b82df175821043eae48f60f7e811c4d1df553
</code></pre>

## Присоединится к запущеному контейнеру `docker attach`

<pre><code class="bash">
$ docker attach mybash
</code></pre>

<div class="error">
    <p>Нажатие Ctrl+C прекращает запущенный контейнер!</p>
    <p>Для коректной остановки контейнера-наблюдателя нужно нажать Ctrl+P, Ctrl+Q</p>
</div>

## Выполнить команду внутри запущенного контейнера `docker exec`

<pre><code class="bash">
$ docker exec -it competent_franklin bash
root@4a2d8a302ee5:~#     
</code></pre>

## Выполняемые процессы внутри контейнера `docker top`

<pre><code class="bash">
$ docker top mynginx 
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                3942                3902                0                   12:55               ?                   00:00:00            nginx: master process nginx -g daemon off;
systemd+            3985                3942                0                   12:55               ?                   00:00:00            nginx: worker process
vagrant@ubuntu-xenial:~$     
</code></pre>

## Запуск контейнера `docker start`

<pre><code class="bash">
$ docker start nostalgic_archimedes
nostalgic_archimedes
</code></pre>

## Приостановка/запуск контейнера `docker pause/unpause`

<pre><code class="bash">
$ docker pause mynginx 
mynginx
vagrant@ubuntu-xenial:~$ docker unpause mynginx 
mynginx
...
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                  PORTS               NAMES
c049c4becddf        nginx               "nginx -g 'daemon of…"   7 minutes ago       Up 7 minutes (Paused)   80/tcp              mynginx
vagrant@ubuntu-xenial:~$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
c049c4becddf        nginx               "nginx -g 'daemon of…"   7 minutes ago       Up 7 minutes        80/tcp              mynginx
vagrant@ubuntu-xenial:~$ 
</code></pre>

## Перезапуск контейнера `docker restart`

<pre><code class="bash">
$ docker restart mynginx 
mynginx
</code></pre>

## Остановка контейнера `docker stop`

<pre><code class="bash">
$ docker stop upbeat_visvesvaraya 
upbeat_visvesvaraya
...
$ docker run -it debian bash
root@384b48afd439:/# exit
</code></pre>

## Удалить контейнер `docker rm`

<pre><code class="bash">
vagrant@ubuntu-xenial:~$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                       PORTS               NAMES
b8ab3c95d75d        debian              "bash"                   3 minutes ago       Exited (127) 4 seconds ago                       mybash
fcd26f1ccacc        postgres            "docker-entrypoint.s…"   15 hours ago        Exited (0) 15 hours ago                          dbcontainer
vagrant@ubuntu-xenial:~$ docker rm mybash 
mybash
vagrant@ubuntu-xenial:~$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                    PORTS               NAMES
fcd26f1ccacc        postgres            "docker-entrypoint.s…"   15 hours ago        Exited (0) 15 hours ago                       dbcontainer
vagrant@ubuntu-xenial:~$ 
</code></pre>

## Послать сигнал основному процессу `docker kill`

<pre><code class="bash">
$ docker kill competent_franklin 
competent_franklin    
</code></pre>

<pre><code class="bash">
$ docker kill -s HUP mybash 
mybash
</code></pre>

<pre><code class="bash">
$ docker kill -s 15 mybash 
mybash
</code></pre>

## Установить соединение из одного контейнера в другой `docker run --link`

`docker run -it --link myredis:redis`

В новом контейнере, в `/etc/hosts записывается IP контейнера к которому идет соединение

<pre><code class="bash">
$ docker run -it --link myredis:redis redis bash
root@952094abaaed:/data# 
root@952094abaaed:/data# cat /etc/hosts 
...
172.17.0.2  redis 7240fde0e186 myredis
172.17.0.3  952094abaaed
...
</code></pre>

## Создать том в контейнер

### Способ №1 - `docker dun -v /data`

Создает маунт диры `/data` внутри контейнера и хост машиной в неявном виде

<pre><code class="bash">
$ docker run -it -v /data --name mybash debian bash
root@5ca6e13f7405:/# echo 111 > /data/222
...
$ docker inspect mybash | grep Mount -A10
        "Mounts": [
            {
                "Type": "volume",
                "Name": "b39ebb31f6c04e3aa185be6b18cfddb097b0c0bea56b8e770dc21aef3b71b88f",
                "Source": "/var/lib/docker/volumes/b39ebb31f6c04e3aa185be6b18cfddb097b0c0bea56b8e770dc21aef3b71b88f/_data",
                "Destination": "/data",
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
...
$ sudo ls -l /var/lib/docker/volumes/b39ebb31f6c04e3aa185be6b18cfddb097b0c0bea56b8e770dc21aef3b71b88f/_data
total 4
-rw-r--r-- 1 root root 4 Jul 11 21:29 222
</code></pre>

<div class="warn">
    <p>После удаления контейнера, файлы тоже удаляються!</p>
</div>

### Способ №2 - `Dockerfile - VOLUME`

Тоже самое что и в docker run, только в файле и т.к. почти каждая строка сценария исполняется в отдельном слое контейнера, нужно учитывать последовательность доступов к маунтам

### Способ №3 - Жеское мантирование

<pre><code class="bash">
$ mkdir mybash_data
vagrant@ubuntu-xenial:~$ touch mybash_data/test
...
$ docker run -it -v /home/vagrant/mybash_data/:/data --name mybash debian bash
root@849c5743ed31:/# ls /data/
test
...
root@849c5743ed31:/# echo 111 > /data/dsa
...
vagrant@ubuntu-xenial:~$ ls ./mybash_data/
dsa  test
</code></pre>

Создается жеский маунт с хост машины внутрь контейнера. Не рекомендуется

### Совмесное использование данных. Рекомендованный способ

<pre><code class="bash">
$ docker run -it -v /data --name mybash debian bash
root@2e7cd520870f:/# echo 111 > /data/test
root@2e7cd520870f:/# 
...
$ docker run -it -h new-cont --volumes-from mybash debian bash
root@new-cont:/# ls /data/
root@new-cont:/# ls /data/
test
...
</code></pre>

# Информация о механизме Docker

## Инфо `docker info`

Различкая информация о машине
<pre><code class="bash">
$ docker info 
Containers: 2
 Running: 2
 Paused: 0
 Stopped: 0
Images: 66
...
</code></pre>

## Справка `docker help`

## Версия `docker version`

# Сборка

## Собрать образ `docker build`

`$ docker build -t alala/cowsay-ubuntu .`

Создает образ контейнера согласно Dockerfil в дире .

<pre><code class="bash">
$ docker build -t alala/cowsay-ubuntu .
Sending build context to Docker daemon  2.048kB
Step 1/2 : FROM ubuntu:18.04
18.04: Pulling from library/ubuntu
5b7339215d1d: Pull complete 
14ca88e9f672: Pull complete 
a31c3b1caad4: Pull complete 
b054a26005b7: Pull complete 
Digest: sha256:9b1702dcfe32c873a770a32cfd306dd7fc1c4fd134adfb783db68defc8894b3c
Status: Downloaded newer image for ubuntu:18.04
 ---> 4c108a37151f
Step 2/2 : RUN apt-get update && apt-get install -y cowsay fortune
 ---> Running in e7c40631e32f
Removing intermediate container e7c40631e32f
 ---> d0f1c901b7d3
Successfully built d0f1c901b7d3
Successfully tagged alala/cowsay-ubuntu:latest
vagrant@ubuntu-xenial:/project/cowsay$ docker build -t alala/cowsay-ubuntu .
</code></pre>

## Запушить готовый образ в репозиторий `docker push`

`docker push ceaef8f4b6d4/cowsay2

<pre><code class="bash">
vagrant@ubuntu-xenial:/project/cowsay$ docker push ceaef8f4b6d4/cowsay2
The push refers to repository [docker.io/ceaef8f4b6d4/cowsay2]
750effa31cc3: Mounted from ceaef8f4b6d4/cowsay 
57de69090948: Mounted from ceaef8f4b6d4/cowsay 
75e70aa52609: Mounted from ceaef8f4b6d4/cowsay 
dda151859818: Mounted from ceaef8f4b6d4/cowsay 
fbd2732ad777: Mounted from ceaef8f4b6d4/cowsay 
ba9de9d8475e: Mounted from ceaef8f4b6d4/cowsay 
latest: digest: sha256:dc0523c773771965ef74a06b74337f1b8eeda9ce75ae7d6e9b47b53904509244 size: 1571    
</code></pre>

## Скачать образ из репозитория `docker pull`

<pre><code class="bash">
$ docker pull redis
Using default tag: latest
latest: Pulling from library/redis
Digest: sha256:87ba16f132f3afc613f9685c0edfb5cceadd897d96def1b3e8578f6c74b53ffa
Status: Image is up to date for redis:latest    
</code></pre>

# Dockerfile - команды

## Задать базовый образ `FROM`

`FROM debian`, `FROM ubuntu:18.04`

Всегда обязателен и должен находиться первой строкой Dockerfile-а!

## Информация от разработчика `MAINTAINER

<pre><code class="bash">
MAINTAINER Orlov Yaroslav <orlov.avis@yandex.ru>
</code></pre>

## Выполнить команду во время сборк образа `RUN`

<pre><code class="bash">
RUN apt-get update && apt-get install -y cowsay fortune
</code></pre>

## Скоприровать локальный файл внутр образа `COPY`

<pre><code class="bash">
COPY entrypoint.sh /tmp
</code></pre>

## Выполнить команду при запуске контейнер `ENTRYPOINT`

<pre><code class="bash">
$ cat Dockerfile
...
ENTRYPOINT "/usr/games/cowsay"
...

$ docker build -t cowsay/cowsay .
Sending build context to Docker daemon  3.072kB
Step 1/5 : FROM ubuntu:18.04
Successfully tagged cowsay/cowsay:latest
...
$ docker run cowsay/cowsay
 __
<  >
 --
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

</code></pre>

## Добавить файлы из хоста в контейнер `ADD`

Копирует файлы из контекста создания или из удаленных URL-ссылок в создаваемый образ.

## `CMD`

## `ENV`

Задает переменные окружения внутри контейнера

## Задать порт(ы) которые будет слушать контейнер `EXPOSE`

Задает порты которые контейнер слушает снаружи

## `WORKDIR`

Задает рабочую директорию

# Как залить на `Docker Hub`

1) Создаем учетку на `hub.docker.com`

<div class="warn">
    <p>
        Не до конца понял про docker ID при регистрации
    </p>
</div>

2) Логинемся в консоли в аккаунт `docker login`

3) Создаем билд который хотим залить `$ docker build ceaef8f4b6d4/cowsay .`

4) Заливаем образ `$ docker push ceaef8f4b6d4/cowsay`

# Работа с образами

## Сохранить образ в архив `docker save`

<pre><code class="bash">
vagrant@ubuntu-xenial:~$ docker save -o /tmp/redis.tar redis:latest 
vagrant@ubuntu-xenial:~$ ls -la /tmp/redis.tar 
-rw------- 1 vagrant vagrant 98326528 Jul 12 15:03 /tmp/redis.tar
vagrant@ubuntu-xenial:~$ ls -lha /tmp/redis.tar 
-rw------- 1 vagrant vagrant 94M Jul 12 15:03 /tmp/redis.tar
vagrant@ubuntu-xenial:~$ 
</code></pre>

## Загрузить образ из архива `docker load`

<pre><code class="bash">
vagrant@ubuntu-xenial:~$ docker load -i /tmp/redis.tar 
Loaded image: redis:latest
vagrant@ubuntu-xenial:~$ 
</code></pre>

## Удаление образа из системы `docker rmi`

-f - force

<pre><code class="bash">
$ docker rmi -f redis:latest 
Untagged: redis:latest
Untagged: redis@sha256:87ba16f132f3afc613f9685c0edfb5cceadd897d96def1b3e8578f6c74b53ffa    
</code></pre>

# Работа с несколькими контейнерами `docker-compose`

## Запуск `docker-compose up`

<pre><code class="perl">
docker-compose up
</code></pre>

<ul>
    <li><b>-d </b> - запустить в фоновом режиме</li>
</ul>

## Остановка `docker-compose stop`

## Пересборка `docker-compose build`

## Список контейнеров `docker-compose ps`

## Запуск одного из контейнеров `docker-compose run`

Поддерживает все те же команды что и docker run

<pre><code class="perl">
$ docker-compose run -d identidock
identidock_identidock_run_3
</code></pre>

## Логи с контейнера `docker-compose logs`

<pre><code class="perl">
docker-compose logs -f
</code></pre>

## Удаление остановленных контейнеров `docker-compose rm`

<pre><code class="perl">
$ docker-compose rm
</code></pre>

# Cookbook

## Список всех тегов образа

<pre><code class="perl">
docker images --no-trunc | grep $(docker inspect -f {{.Id}} avis20/identidock:stable)
</code></pre>

## Установка прав доступа юзеру к тому в Dockerfile

<pre><code class="bash">
FROM debian:wheezy
RUN useradd foo
RUN mkdir /data && touch /data/x
RUN chown -R foo:foo /data
VOLUME /data
</code></pre>

<div class="error">
    <p>Если сделать в начале VOLUME /data то не получиться!</p>
</div>

## Удалить все остановленные контейнеры

<pre><code class="bash">
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                    PORTS               NAMES
7e61ddf2b718        debian              "bash"              3 seconds ago       Exited (0) 1 second ago                       docker-cont
3fe6ef8c1e54        debian              "bash"              8 seconds ago       Up 7 seconds                                  vigilant_napier
vagrant@ubuntu-xenial:~$ 
...
$ docker rm -v $(docker ps -aq -f status=exited)
7e61ddf2b718
...
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
3fe6ef8c1e54        debian              "bash"              2 minutes ago       Up 2 minutes                            vigilant_napier

</code></pre>

## Запуск jekyll !!!

<pre><code class="perl">
docker run --rm -v $PWD/doc:/srv/jekyll -it -p 4000:4000 jekyll/builder jekyll serve -LR 4001
</code></pre>

## Запуск jenkins контейнера

<pre><code class="perl">
docker create --name jenkins-data identijenk echo "Jenkins Data Container"
</code></pre>

<pre><code class="perl">
docker run -d --rm --name jenkins -p 8080:8080 --volumes-from jenkins-data -v /var/run/docker.sock:/var/run/docker.sock identijenk
</code></pre>

Скрипт сборки
<pre><code class="bash">
COMPOSE_ARGS=" -f jenkins.yml -p jenkins "

sudo docker-compose $COMPOSE_ARGS stop
sudo docker-compose $COMPOSE_ARGS rm --force -v

sudo docker-compose $COMPOSE_ARGS build --no-cache
sudo docker-compose $COMPOSE_ARGS up -d

sudo docker-compose $COMPOSE_ARGS run --no-deps --rm -e RUN=UNIT identidock
ERR=$?

if [ $ERR -eq 0 ]; then
    IP=$(sudo docker inspect -f {{.NetworkSettings.IPAddress}} jenkins_identidock_1)
    CODE=$(curl -sL -w "%{http_code}" $IP:9090/monster/bla -o /dev/null) || true
    if [ $CODE -ne 200 ]; then
        echo "Site returned " $CODE
        ERR=1
    else
        echo "Test Passed"
        HASH=$(git rev-parse --short HEAD)
        sudo docker tag jenkins_identidock avis20/identidock:$HASH
        sudo docker tag jenkins_identidock avis20/identidock:stable
        echo "Pushing"
        sudo docker login -u avis20 -p 1234567890docker!
        sudo docker push avis20/identidock:$HASH
        sudo docker push avis20/identidock:stable
    fi
fi

sudo docker-compose $COMPOSE_ARGS stop
sudo docker-compose $COMPOSE_ARGS rm --force -v
return $ERR
</code></pre>


## Разворачиваем контейнер в heroku

Установка
<pre><code class="perl">
sudo snap install --classic heroku
</code></pre>

cmd history
<pre><code class="perl">
heroku container:login
heroku create
heroku stack:set container --app obscure-tundra-63775
git push heroku master
catalyst.pl MyApp
git add -A
git ci "init root"
git push origin master
git push heroku master 
heroku open --app obscure-tundra-63775
heroku logs --tail
git push heroku master 
</code></pre>
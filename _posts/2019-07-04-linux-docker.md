---
title: Изучаем Docker. Часть 1 - Основные команды
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
curl https://get.docker.com > /tmp/install.sh
chmod +x /tmp/install.sh
/tmp/install.sh
</code></pre>

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

<pre><code class="bash">
base=https://github.com/docker/machine/releases/download/v0.16.0 && \
curl -L $base/docker-machine-$(uname -s)-$(uname -m) >/tmp/docker-machine && \
sudo install /tmp/docker-machine /usr/local/bin/docker-machine
</code></pre>

# Параметры

## Запуск контейнера `docker run`

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-d</b> = Запустить контейнер в фоновом режим</li>
        <li><b>-P</b> = Запустить контейнер с открытыми портами
            <p>Используется проброс порта на хост машину</p>
            <pre><code class="bash">
$ docker run -P --name myredis -d redis
5090844a319c99b44e6c2d69b5a0003f34c44a2158cccf407ce0cae849894bdf
vagrant@ubuntu-xenial:~$ docker port myredis 
6379/tcp -> 0.0.0.0:32768
            </code></pre>
        </li>
        <li><b>-h</b> = Задать имя оболочки
            <pre><code class="bash">
$ docker run -h mybash -it debian bash
root@mybash:/# 
            </code></pre>
        </li>
        <li><b>--name</b> = Задать имя контейнеру
            <p>Задается имя по которому можно обращяться к контейнеру</p>
            <pre><code class="bash">
$ docker run --name avis-doc -it debian bash
root@a0f5e7575c36:/# 
...
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
a0f5e7575c36        debian              "bash"              17 seconds ago      Up 15 seconds                           avis-doc
            </code></pre>
        </li>
        <li><b>-it</b> = Запуск и вход в контейнер
            <p>Ключи `it` позволяют создавать tty соединение с контейнером</p>
            <pre><code class="bash">
$ docker run -it debian bash
root@14e5a4e1cce8:/#
            </code></pre>
        </li>
        <li><b>-v</b> = Запустить контейнер и иметь возможность править файлы с наружи
            <pre><code class="bash">
docker run --rm -v "$(pwd)"/app:/app identidock
            </code></pre>
        </li>
        <li><b>--link </b> = Установить соединение из одного контейнера в другой. 
            <p>В новом контейнере, в `/etc/hosts записывается IP контейнера к которому идет соединение</p>
            <pre><code class="bash">
$ docker run -it --link myredis:redis redis bash
root@952094abaaed:/data# 
root@952094abaaed:/data# cat /etc/hosts 
...
172.17.0.2  redis 7240fde0e186 myredis
172.17.0.3  952094abaaed
...
            </code></pre>
        </li>
    </ul>

</details>

<br>

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

## Узнать какие порты открыты `docker port`

<pre><code class="bash">
vagrant@ubuntu-xenial:~$ docker port myredis 
6379/tcp -> 0.0.0.0:32768
</code></pre>

## Список запущеных контейнеров `docker ps`

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-q</b> = Показать только ID контейнеров</li>
        <li><b>-a</b> = Список всех контейнеров. После выполнения команды docker ps -a выводится список всех контейнеров, включая остановленные (stopped)
            <pre><code class="bash">
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS                          PORTS               NAMES
384b48afd439        debian              "bash"              About a minute ago   Exited (0) About a minute ago                       upbeat_visvesvaraya
a5f7f69f6234        debian              "bash"              8 minutes ago        Exited (0) 3 minutes ago                            docker-cont    
            </code></pre>
        </li>
    </ul>

</details>

Команда выводит краткую информацию о контейнерах. В последнем столбце `NAMES` контейнеру писваивается название по которому можно обращаться вместо ID

<pre><code class="bash">
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
83de7485c503        debian              "bash"              6 minutes ago       Up 6 minutes                            priceless_curie
vagrant@ubuntu-xenial:~$ 
</code></pre>

## Информация о контейнере `docker inspect`

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-a</b> = </li>
        <li><b>-a</b> = 
            <pre><code class="bash">
                content
            </code></pre>
        </li>
    </ul>

</details>

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

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-a</b> = </li>
        <li><b>-a</b> = 
            <pre><code class="bash">
                content
            </code></pre>
        </li>
    </ul>

</details>

`docker diff friendly_wozniak`

<pre><code class="bash">
$ docker diff friendly_wozniak 
C /bin
D /bin/echo
A /test
</code></pre>

## Список событий произошедших в контейнере `docker logs`

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-f</b> = Непрерывный вывод</li>
        <li><b>-t</b> = Вывести в каждой строке время
            <pre><code class="bash">
$ docker run --rm --name mynginx -d -p 80:80 nginx
...
$ docker logs -tf mynginx 
2019-07-27T14:23:27.005976862Z 172.17.0.1 - - [27/Jul/2019:14:23:27 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
            </code></pre>
        </li>
    </ul>

</details>

<pre><code class="bash">
$ docker logs docker-cont 
root@a5f7f69f6234:/# ls
bin   dev  home  lib64  mnt  proc  run   srv  tmp  var
boot  etc  lib   media  opt  root  sbin  sys  usr
root@a5f7f69f6234:/# alala
bash: alala: command not found
</code></pre>

## Cоздать но не запускать контейнер `docker create`

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-a</b> = </li>
        <li><b>-a</b> = 
            <pre><code class="bash">
                content
            </code></pre>
        </li>
    </ul>

</details>

<pre><code class="bash">
$ docker create debian
c935ea21cd290d56370ec096479b82df175821043eae48f60f7e811c4d1df553
</code></pre>

## Присоединится к запущеному контейнеру `docker attach`

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-a</b> = </li>
        <li><b>-a</b> = 
            <pre><code class="bash">
                content
            </code></pre>
        </li>
    </ul>

</details>

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

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-t</b> = Задать тег сборке</li>
        <li><b>-a</b> = 
            <pre><code class="bash">
                content
            </code></pre>
        </li>
    </ul>

</details>

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

`docker push ceaef8f4b6d4/cowsay2`

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

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-f, --force</b> = Удалить без подтверждения
            <pre><code class="bash">
$ docker rmi -f redis:latest 
Untagged: redis:latest
Untagged: redis@sha256:87ba16f132f3afc613f9685c0edfb5cceadd897d96def1b3e8578f6c74b53ffa    
            </code></pre>
        </li>
    </ul>

</details>

<pre><code class="bash">
$ docker rmi generik/ansible
Untagged: generik/ansible:latest
Untagged: generik/ansible@sha256:1c841ba1736b55c3357b9f4e88df4038039f532e40ee0ec4f188103043fdd7f6
</code></pre>

# Работа с несколькими контейнерами `docker-compose`

## Запуск `docker-compose up`

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-d</b> = запустить в фоновом режиме</li>
        <li><b>-a</b> = 
            <pre><code class="bash">
                content
            </code></pre>
        </li>
    </ul>

</details>

<pre><code class="bash">
docker-compose up
</code></pre>

## Остановка `docker-compose stop`

## Пересборка `docker-compose build`

## Список контейнеров `docker-compose ps`

## Запуск одного из контейнеров `docker-compose run`

Поддерживает все те же команды что и docker run

<pre><code class="bash">
$ docker-compose run -d identidock
identidock_identidock_run_3
</code></pre>

## Логи с контейнера `docker-compose logs`

<pre><code class="bash">
docker-compose logs -f
</code></pre>

## Удаление остановленных контейнеров `docker-compose rm`

<pre><code class="bash">
$ docker-compose rm
</code></pre>


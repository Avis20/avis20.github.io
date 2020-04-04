---
title: "Docker - Основные команды"
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

## `get.docker.com` - Установка в любую систему через оф. скрипт 

<pre><code class="bash">
curl https://get.docker.com > /tmp/install.sh
chmod +x /tmp/install.sh
/tmp/install.sh
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

# Проверка

<pre><code class="shell">
$ docker version
Client: Docker Engine - Community
 Version:           19.03.1
 API version:       1.40
 Go version:        go1.12.5
 Git commit:        74b1e89e8a
 Built:             Thu Jul 25 21:21:35 2019
 OS/Arch:           linux/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          19.03.5
  API version:      1.40 (minimum version 1.12)
  Go version:       go1.12.12
  Git commit:       633a0ea838
  Built:            Wed Nov 13 07:48:43 2019
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.2.6
  GitCommit:        894b81a4b802e4eb2a91d1ce216b8817763c29fb
 runc:
  Version:          1.0.0-rc8
  GitCommit:        425e105d5a03fabd737a126ad93d62a9eeede87f
 docker-init:
  Version:          0.18.0
  GitCommit:        fec3683
</code></pre>

# Параметры

## `docker run` - Запуск контейнера

<ul>
    <h5>a</h5>
    <li><b>-a, --attach</b> - Подключить stdout, stdin, stderr запущенного контейнера
    <pre><code class="shell">

    </code></pre></li>
<br>
    <h5>b</h5>
    <h5>c</h5>
    <h5>d</h5>
    <li><b>-d</b> - Запустить контейнер в фоновом режимe
    <pre><code class="shell">
$ docker run -d --name myredis redis
102baa8f1c2c08ef1c7bf15c003b64303d13ee6ff99a69b1297cb5f550794182
    </code></pre>
    </li>
<br>
    <h5>e</h5>
    <li><b>-e, --env</b> - Задает переменные окружения
    <pre><code class="shell">
$ docker run -e myenv=test --rm ubuntu env
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=92efa0c46920
myenv=test
HOME=/root
    </code></pre></li>
<br>
    <li><b>--env-file</b> - Задает файл с переменными окружения
    <pre><code class="shell">
$ cat env-file.txt 
myenv=test
TEST=dsa
    </code></pre>
    <pre><code class="shell">
$ docker run --env-file=env-file.txt --rm ubuntu env
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=7fd5eb3eaca0
myenv=test
TEST=dsa
HOME=/root
    </code></pre></li>
<br/>
    <h5>f</h5>
    <h5>g</h5>
    <h5>h</h5>
    <li><b>-h, --hostname</b> - Задать имя оболочки
    <pre><code class="bash">
$ docker run -h mybash -it debian bash
root@mybash:/# 
    </code></pre></li>
<br>
    <h5>i</h5>
    <li><b>-it</b> - Запуск и вход в контейнер
    <p>Ключи it позволяют создавать tty соединение с контейнером</p>
    <pre><code class="bash">
$ docker run -it debian bash
root@14e5a4e1cce8:/#
    </code></pre></li>
<br>
    <h5>j</h5>
    <h5>k</h5>
    <h5>l</h5>
    <li><b>--link </b> - Установить соединение из одного контейнера в другой. 
    <p>В новом контейнере, в `/etc/hosts` записывается IP контейнера к которому идет соединение</p>
    <pre><code class="bash">
$ docker run --rm -it --link myredis:alias_in_hosts redis bash
root@df80955ab8fb:/data# cat /etc/hosts 
...
127.0.0.1   localhost
172.17.0.2  alias_in_hosts 8868c8a3c6fc myredis
...
    </code></pre>
где
<ul>
    <li>myredis - название контейнера</li>
    <li>alias_in_hosts - алиас, по которому можно обратиться к хосту. Опционален</li>
</ul></li>
    <h5>m</h5>
    <h5>n</h5>
    <li><b>--name</b> = Задать имя контейнеру
    <p>Задается имя по которому можно обращяться к контейнеру</p>
    <pre><code class="bash">
$ docker run --name avis-doc -it debian bash
root@a0f5e7575c36:/# 
...
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
a0f5e7575c36        debian              "bash"              17 seconds ago      Up 15 seconds                           avis-doc
    </code></pre></li>
<br>
    <li><b>--net</b> установка сети
    <pre><code class="shell">
$ docker run --rm -d --net=host --name postgres postgres:11-alpine
    </code></pre>
    <pre><code class="shell">
$ sudo netstat -tulpn | grep LISTEN | grep postgres
tcp        0      0 0.0.0.0:5432            0.0.0.0:*               LISTEN      5123/postgres       
tcp6       0      0 :::5432                 :::*                    LISTEN      5123/postgres  
    </code></pre></li>
<br>
    <h5>o</h5>
    <h5>p</h5>
    <li><b>-p </b> - Задает порт с контейнера на хост
    <pre><code class="shell">
$ docker run -p 8000:80 -d --rm nginx
3ca968453e27d021dcdba4dd1d65864bdb06e9712bd850b36fea868671732a67
    </code></pre></li>
    <pre><code class="shell">
$ curl localhost:8000
!DOCTYPE html
    </code></pre>
<br>
    <li><b>-P</b> - Запустить контейнер с открытыми всеми портами. (видимо те которые прописаны в dockerfile->expose)
    <p>Используется проброс порта на хост машину. Порт при этом выбирается рандомный</p>
    <pre><code class="bash">
$ docker run -P --name myredis -d redis
5090844a319c99b44e6c2d69b5a0003f34c44a2158cccf407ce0cae849894bdf
    </code></pre>
    <pre><code class="shell">
$ docker port myredis 
6379/tcp -> 0.0.0.0:32770
    </code></pre>
    <pre><code class="shell">
$ redis-cli -p 32770
127.0.0.1:32770> 
    </code></pre></li>
<br>
    <h5>q</h5>
    <h5>r</h5>
    <li><b>--rm</b> - Удалить контейнер после завершения
    <p>Без --rm</p>
        <pre><code class="shell">
avis@avisPC[15:47:30]:~$ docker run debian echo 1
1
avis@avisPC[15:51:15]:~$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES
dc18ba4196a9        debian              "echo 1"            7 seconds ago       Exited (0) 5 seconds ago                       affectionate_mayer
        </code></pre>
        <p>С --rm</p>
        <pre><code class="shell">
avis@avisPC[15:52:52]:~$ docker run --rm debian echo 2
2
avis@avisPC[15:52:56]:~$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
avis@avisPC[15:53:00]:~$ 
        </code></pre></li>
<br>
    <h5>s</h5>
    <h5>t</h5>
    <h5>u</h5>
    <h5>v</h5>
    <li><b>-v, --volume</b> - Запустить контейнер и иметь возможность править файлы с наружи
    <pre><code class="bash">
$ docker run --rm -v "$(pwd)"/app:/app identidock
    </code></pre></li>
<br>
    <li><b>--volumes-from</b> - Подключение тома из другого контейнера
    <pre><code class="shell">
$ 
    </code></pre></li>
<br/>
    <h5>w</h5>
    <h5>x</h5>
    <h5>y</h5>
    <h5>z</h5>
</ul>

<hr>

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

## `docker port` - Узнать какие порты открыты

<pre><code class="bash">
vagrant@ubuntu-xenial:~$ docker port myredis 
6379/tcp -> 0.0.0.0:32768
</code></pre>

## `docker ps` - Список запущеных контейнеров

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

## `docker inspect` - Информация о контейнере

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

## `docker diff` - Список файлов измененных в контейнере

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

## `docker logs` - Список событий произошедших в контейнере

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

## `docker commit` - Превращение контейнера в образ

<pre><code class="shell">
$ docker commit cowsay test_rep/cowsay_image
sha256:2b9eb0b0e5c1b4984f86965a606bfc2b4edd498dd1b4684bd14196dcf817f374
</code></pre>

где
<ul>
    <li>cowsay - название контейнера (работающего или нет)</li>
    <li>test_rep - название репозитория</li>
    <li>cowsay_image - название образа</li>
</ul>


<pre><code class="bash">
$ docker create debian
c935ea21cd290d56370ec096479b82df175821043eae48f60f7e811c4d1df553
</code></pre>

## `docker attach` - Присоединится к запущеному контейнеру

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

## `docker exec` - Выполнить команду внутри запущенного контейнера

<pre><code class="bash">
$ docker exec -it competent_franklin bash
root@4a2d8a302ee5:~#     
</code></pre>

## `docker top` - Выполняемые процессы внутри контейнера

<pre><code class="bash">
$ docker top mynginx 
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                3942                3902                0                   12:55               ?                   00:00:00            nginx: master process nginx -g daemon off;
systemd+            3985                3942                0                   12:55               ?                   00:00:00            nginx: worker process
vagrant@ubuntu-xenial:~$     
</code></pre>

## `docker create` - Cоздать но не запускать контейнер

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

## `docker start` - Запуск контейнера

<pre><code class="bash">
$ docker start nostalgic_archimedes
nostalgic_archimedes
</code></pre>

## `docker pause/unpause` - Приостановка/запуск контейнера

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

## `docker restart` - Перезапуск контейнера

<pre><code class="bash">
$ docker restart mynginx 
mynginx
</code></pre>

## `docker stop` - Остановка контейнера

<pre><code class="bash">
$ docker stop upbeat_visvesvaraya 
upbeat_visvesvaraya
...
$ docker run -it debian bash
root@384b48afd439:/# exit
</code></pre>

## `docker rm` - Удалить контейнер

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

## `docker kill` - Послать сигнал основному процессу

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

## `docker tag` - Добавить тег образу

<pre><code class="bash">
$ docker tag proxy:0.1 avis20/proxy:0.1
$ docker images avis20/proxy
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
avis20/proxy        0.1                 e716b9df4925        2 weeks ago         109MB
</code></pre>

## `docker history` - Список уровней образа

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-H, --human=(true/false)</b> - Вывести размеры и даты в человеческом формает. По умолчанию включено
        <pre><code class="bash">
$ docker history avis20/cowsay:latest -H=false
IMAGE               CREATED AT                  CREATED BY                                      SIZE                COMMENT
a99395ef309a        2020-01-03T00:25:04+03:00   /bin/sh -c #(nop)  ENTRYPOINT ["/entrypoint.…   0                   
b9e9e051fdcd        2020-01-03T00:25:04+03:00   /bin/sh -c #(nop) COPY file:6152ff200c4bfda5…   123                 
b5690b9e28a3        2020-01-03T00:25:04+03:00   /bin/sh -c apt-get update && apt-get install…   70810049            
a8d0017afa33        2020-01-03T00:24:53+03:00   /bin/sh -c #(nop)  MAINTAINER Orlov Yaroslav…   0                   
549b9b86cb8d        2019-12-19T07:21:28+03:00   /bin/sh -c #(nop)  CMD ["/bin/bash"]            0                   
missing             2019-12-19T07:21:28+03:00   /bin/sh -c mkdir -p /run/systemd && echo 'do…   7                   
missing             2019-12-19T07:21:27+03:00   /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   745                 
missing             2019-12-19T07:21:26+03:00   /bin/sh -c [ -z "$(apt-get indextargets)" ]     987485              
missing             2019-12-19T07:21:25+03:00   /bin/sh -c #(nop) ADD file:53f100793e6c0adfc…   63206481            
        </code></pre></li>
    </ul>
</details>

<pre><code class="shell">
$ docker history avis20/cowsay:latest 
IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
a99395ef309a        25 minutes ago      /bin/sh -c #(nop)  ENTRYPOINT ["/entrypoint.…   0B                  
b9e9e051fdcd        25 minutes ago      /bin/sh -c #(nop) COPY file:6152ff200c4bfda5…   123B                
b5690b9e28a3        25 minutes ago      /bin/sh -c apt-get update && apt-get install…   70.8MB              
a8d0017afa33        25 minutes ago      /bin/sh -c #(nop)  MAINTAINER Orlov Yaroslav…   0B                  
549b9b86cb8d        2 weeks ago         /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
missing             2 weeks ago         /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
missing             2 weeks ago         /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   745B                
missing             2 weeks ago         /bin/sh -c [ -z "$(apt-get indextargets)" ]     987kB               
missing             2 weeks ago         /bin/sh -c #(nop) ADD file:53f100793e6c0adfc…   63.2MB      
</code></pre>


# Информация о механизме Docker

## `docker info` - Инфо

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

## `docker help` - Справка

## `docker version` - Версия

# Сборка

## `docker build` - Собрать образ

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-t</b> - Задать тег сборке
        <pre><code class="bash">
$ docker build -t avis20/cowsay .
Sending build context to Docker daemon  4.096kB
Step 1/5 : FROM ubuntu
 ---> 549b9b86cb8d
...
            </code></pre>
        <pre><code class="shell">
$ docker images | grep avis
avis20/cowsay            latest              4ce46efcd682        2 hours ago         135MB
        </code></pre>
        </li>
        <li><b>-f</b> - Имя файла отличного от Dockerfile
            <pre><code class="bash">
$ docker build -t avis20/cowsay -f ./cowsay/my_dockerfile .
Sending build context to Docker daemon  123.9kB
Step 1/5 : FROM ubuntu
 ---> 549b9b86cb8d
...
            </code></pre>
        </li>
        <li><b>--no-cache</b> = Не использовать кеш при сборке
            <pre><code class="bash">
                content
            </code></pre>
        </li>

        <li><b>-a</b> = 
            <pre><code class="bash">
                content
            </code></pre>
        </li>
    </ul>

</details>

<div class="info">
    <p>Последний аргумент всегда должен быть контекст, в рамках которого работает Dockerfile</p>
</div>

`$ docker build -t alala/cowsay-ubuntu .`

Создает образ контейнера согласно Dockerfile в дире .

<pre><code class="shell">
$ cat Dockerfile 
FROM ubuntu

RUN apt-get update && apt-get install -y cowsay fortune
</code></pre>

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

<pre><code class="shell">
$ docker run --rm alala/cowsay-ubuntu echo hello
hello
</code></pre>

## `docker push` - Запушить готовый образ в репозиторий

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

## `docker pull` - Скачать образ из репозитория

<pre><code class="bash">
$ docker pull redis
Using default tag: latest
latest: Pulling from library/redis
Digest: sha256:87ba16f132f3afc613f9685c0edfb5cceadd897d96def1b3e8578f6c74b53ffa
Status: Image is up to date for redis:latest    
</code></pre>

# Работа с образами

## `docker save` - Сохранить образ в архив

<pre><code class="bash">
vagrant@ubuntu-xenial:~$ docker save -o /tmp/redis.tar redis:latest 
vagrant@ubuntu-xenial:~$ ls -la /tmp/redis.tar 
-rw------- 1 vagrant vagrant 98326528 Jul 12 15:03 /tmp/redis.tar
vagrant@ubuntu-xenial:~$ ls -lha /tmp/redis.tar 
-rw------- 1 vagrant vagrant 94M Jul 12 15:03 /tmp/redis.tar
vagrant@ubuntu-xenial:~$ 
</code></pre>

## `docker load` - Загрузить образ из архива

<pre><code class="bash">
vagrant@ubuntu-xenial:~$ docker load -i /tmp/redis.tar 
Loaded image: redis:latest
vagrant@ubuntu-xenial:~$ 
</code></pre>

## `docker rmi` - Удаление образа из системы

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

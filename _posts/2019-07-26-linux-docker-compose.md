---
title: "Docker - docker-compose"
tags: docker
reference:
  - title: "Изучаем Docker, часть 1: основы"
    link: https://habr.com/ru/company/ruvds/blog/438796/

  - title: "Виртуализация процесса разработки, часть 2: Docker и Vagrant"
    link: https://dou.ua/lenta/articles/vagrant/

  - title: "Intro Guide to Dockerfile Best Practices"
    link: https://blog.docker.com/2019/07/intro-guide-to-dockerfile-best-practices/
    
  - title:
    link:
  - title:
    link:
---

* TOC 
{:toc}

# `docker-compose` - Работа с несколькими контейнерами

## `docker-compose up` - Запуск 

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <h5>a</h5>
        <h5>b</h5>
        <h5>c</h5>
        <h5>d</h5>
        <li><b>-d</b> - Запустить все контейнеры в фоновом режиме
        <pre><code class="shell">
    $ docker-compose up -d
    Starting identidockv3compose_identidock_1 ... done    
        </code></pre></li>
        <br/>
        <h5>e</h5>
        <h5>f</h5>
        <h5>g</h5>
        <h5>h</h5>
        <h5>i</h5>
        <h5>j</h5>
        <h5>k</h5>
        <h5>l</h5>
        <h5>m</h5>
        <h5>n</h5>
        <h5>o</h5>
        <h5>p</h5>
        <h5>q</h5>
        <h5>r</h5>
        <h5>s</h5>
        <h5>t</h5>
        <h5>u</h5>
        <h5>v</h5>
        <h5>w</h5>
        <h5>x</h5>
        <h5>y</h5>
        <h5>z</h5>
    </ul>
</details>

## `docker-compose stop` - Остановка

## `docker-compose build` - Пересборка 

## `docker-compose ps` - Список контейнеров

## `docker-compose run` Запуск одного из контейнеров 

Поддерживает все те же команды что и docker run

<pre><code class="bash">
$ docker-compose run -d identidock
identidock_identidock_run_3
</code></pre>

## `docker-compose logs` - Логи с контейнеров

<details>
    <summary>
        Ключи
    </summary>
    <ul>
      <h5>a</h5>
      <h5>b</h5>
      <h5>c</h5>
      <h5>d</h5>
      <li><b>-f, --follow</b> - Непрерывный вывод
      <pre><code class="shell">
$ cat docker-compose.yml 
web:
  image: nginx
  ports:
    - "8000:80"
      </code></pre>
      <pre><code class="shell">
$ docker-compose up -d
Recreating portandexpose_web_1 ... done
      </code></pre>
      <pre><code class="shell">
 curl localhost:8000
!DOCTYPE html
      </code></pre>
      <pre><code class="shell">
$ docker-compose logs -f
Attaching to portandexpose_web_1
web_1  | 172.17.0.1 - - [05/Jan/2020:13:46:08 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
      </code></pre>
    </li>
<br/>
      <h5>e</h5>
      <h5>f</h5>
      <h5>g</h5>
      <h5>h</h5>
      <h5>i</h5>
      <h5>j</h5>
      <h5>k</h5>
      <h5>l</h5>
      <h5>m</h5>
      <h5>n</h5>
      <h5>o</h5>
      <h5>p</h5>
      <h5>q</h5>
      <h5>r</h5>
      <h5>s</h5>
      <h5>t</h5>
      <li><b>-t, --timestamps</b> - Выводить на каждой строке время
      <pre><code class="shell">
$ docker-compose logs -t
Attaching to portandexpose_web_1
web_1  | 2020-01-05T13:46:08.712585403Z 172.17.0.1 - - [05/Jan/2020:13:46:08 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
      </code></pre></li>
<br/>
      <h5>u</h5>
      <h5>v</h5>
      <h5>w</h5>
      <h5>x</h5>
      <h5>y</h5>
      <h5>z</h5>
    </ul>
</details>

## `docker-compose rm` - Удаление остановленных контейнеров 

<pre><code class="bash">
$ docker-compose rm
</code></pre>

# `docker-compose.yml`

## `build/image` - Указывает откуда брать образ

build - собрать из Dockerfile

<pre><code class="shell">
$ cat Dockerfile 
FROM ubuntu:bionic
CMD "whoami"
</code></pre>

<pre><code class="shell">
$ cat docker-compose.yml 
test-build:
  build: .
</code></pre>

или 

<pre><code class="shell">
$ cat dir/Dockerfile.txt 

FROM ubuntu:bionic

CMD "whoami"
</code></pre>

<pre><code class="shell">
$ cat docker-compose.yml 
version: '3'
services:
  web:
    build:
      context: ./dir
      dockerfile: Dockerfile.txt
</code></pre>

с image все просто
<pre><code class="shell">
$ cat docker-compose.yml 
version: '3'
services:
  web:
    image: ubuntu:bionic
    command: echo 1
</code></pre>

<pre><code class="shell">
$ docker-compose up
Starting buildorimage_web_1 ... done
Attaching to buildorimage_web_1
web_1  | 1
buildorimage_web_1 exited with code 0
</code></pre>

## `environment` - задает переменные окружения

Причем в docker-compose.yml имеет выше приоритет
<pre><code class="shell">
$ cat Dockerfile 
FROM ubuntu:bionic

ENV MYENV=test

CMD echo $MYENV
</code></pre>

<pre><code class="shell">
$ docker run --rm docker_env2
test
</code></pre>

<pre><code class="shell">
$ cat docker-compose.yml 

test-env:
  build: .
  environment:
    MYENV: test2
</code></pre>

<pre><code class="shell">
$ docker-compose up
Starting env_test-env_1 ... done
Attaching to env_test-env_1
test-env_1  | test2
env_test-env_1 exited with code 0
</code></pre>

## `ports` - Проброс портов

При простом указании порта, который слушает приложение внутри, происходит тоже самое что и при указании -P в `docker run`

Т.е. открывается порт внутри контейнера и мапиться со случайным портом на хост машине.
<pre><code class="shell">
$ cat docker-compose.yml 
web:
  image: nginx
  ports:
    - 80
</code></pre>
 
Чтобы узнать открытый порт нужно сделать `docker port`
<pre><code class="shell">
$ docker port portandexpose_web_1 
80/tcp -> 0.0.0.0:32782
avis@avisPC[20:17:38]:~$ curl localhost:32782
!DOCTYPE html
</code></pre>

Мапинг портов
<pre><code class="shell">
$ cat docker-compose.yml 
web:
  image: nginx
  ports:
    - "8000:80"
</code></pre>

<pre><code class="shell">
$ docker-compose up
Starting portandexpose_web_1 ... done
Attaching to portandexpose_web_1
web_1  | 172.17.0.1 - - [03/Jan/2020:17:15:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
</code></pre>

<pre><code class="shell">
$ curl localhost:8000
!DOCTYPE html
</code></pre>

## `expose` - 

## `volumes` - Подключение томов

1.
Если просто указать путь до тома - внутри контейнера и на хосте будет создана дира и сделан маунт

<div class="info"><p>Или нет... кароче как-то странно</p></div>

<pre><code class="shell">
$ cat docker-compose.yml 
---
test-app:
  image: ubuntu:bionic
  command: 'bash -c "echo 1 > /tmp/test-app/hello && ls -l /tmp/test-app && /bin/sleep 100"'
  volumes:
    - /tmp/test-app
</code></pre>

<pre><code class="shell">
$ docker-compose up
Recreating volumes_test-app_1 ... done
Attaching to volumes_test-app_1
test-app_1  | total 4
test-app_1  | -rw-r--r-- 1 root root 2 Jan  5 13:38 hello
volumes_test-app_1 exited with code 0
</code></pre>

пусто... Возможно тома не тут лежат
<pre><code class="shell">
$ sudo find /var/lib/docker/containers
/var/lib/docker/containers
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95/mounts
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95/mounts/shm
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95/hosts
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95/config.v2.json
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95/hostname
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95-json.log
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95/hostconfig.json
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95/resolv.conf
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95/checkpoints
/var/lib/docker/containers/35a9a0576b100bc6a698d75682bb5835bec9d1bb9b78a206e6bca82a40d67b95/resolv.conf.hash
avis@avisPC[16:38:28]:~$ ^C
</code></pre>

2.
Если указать откуда-куда маунтить то будет маунт + можно указать флаги доступа

<pre><code class="shell">
$ cat docker-compose-2-volumes.yml 
---
test-app:
  image: ubuntu:bionic
  command: 'bash -c "ls -l /tmp/ && echo 1 > /tmp/test-app/aaa && ls -l /tmp/test-app/"'
  volumes:
    - ./dir_in_host:/tmp/test-app:ro
</code></pre>

где
* ./dir_in_host - дира на хосте
* /tmp/test-app - дира которая будет в контейнере
* ro - уровень доступа (r)

<pre><code class="shell">
$ docker-compose -f docker-compose-2-volumes.yml up
Starting volumes_test-app_1 ... done
Attaching to volumes_test-app_1
test-app_1  | total 4
test-app_1  | drwxrwxr-x 2 1000 1000 4096 Jan  5 13:56 test-app
test-app_1  | bash: /tmp/test-app/aaa: Read-only file system
volumes_test-app_1 exited with code 1
</code></pre>

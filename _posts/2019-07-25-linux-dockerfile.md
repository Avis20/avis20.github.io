---
title: "Docker - Dockerfile"
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

# Основное

## `FROM` - Задать базовый образ

`FROM debian`, `FROM ubuntu:18.04`

<div class="warn">
  <p>Всегда обязателен и должен находиться первой строкой в Dockerfile</p>
</div>

## `MAINTAINER` - Метаданные об авторе

<pre><code class="bash">
MAINTAINER Orlov Yaroslav <orlov.avis@yandex.ru>
</code></pre>

## `RUN` - Выполнить команду во время сборк образа

<pre><code class="bash">
RUN apt-get update && apt-get install -y cowsay fortune
</code></pre>

# Добавление файлов в контейнер

## `ADD` - Добавить файлы в контейнер

Копирует файлы из <b>контекста создания</b> или из удаленных URL-ссылок в создаваемый образ.

## `COPY` - Скоприровать локальный файл (или диру) внутрь образа

Проще чем ADD т.к. не поддерживает URL, распаковку архивов и т.п.

<div class="info"><p>Нельзя копировать вне контекста. Т.е. нельзя скопировать вне директори где Dockerfile</p></div>

Пример
<pre><code class="bash">
COPY entrypoint.sh /tmp
</code></pre>


Если есть пробелы то нужно использовать формат json
<pre><code class="shell">
$ ls -1
Dockerfile
hello world.txt
</code></pre>

<pre><code class="shell">
$ cat Dockerfile 
FROM ubuntu:bionic

COPY ["hello world.txt", "/hello world.txt"]

CMD cat "/hello world.txt"
</code></pre>

<pre><code class="shell">
$ docker run --rm docker_copy
hello world
</code></pre>

## `VOLUME` - Объявляет каталог или файл как том

# Запуск команд в контейнере

## `ENTRYPOINT` - Выполнить команду при запуске контейнера

<i>Например - эта инструкция позволяет определить выполняемый файл, который будет вызываться для обработки любых аргументов, переданных в команду docker run .</i>

<pre><code class="shell">
$ cat Dockerfile 
FROM ubuntu

RUN apt-get update && apt-get install -y cowsay fortune

ENTRYPOINT ["/usr/games/cowsay"]
</code></pre>

<pre><code class="shell">
$ docker build -t cowsay/cowsay .
Sending build context to Docker daemon  3.072kB
Step 1/3 : FROM ubuntu
 ---> 549b9b86cb8d
Step 2/3 : RUN apt-get update && apt-get install -y cowsay fortune
 ---> Using cache
 ---> 27a568a9fd69
Step 3/3 : ENTRYPOINT ["/usr/games/cowsay"]
 ---> Using cache
 ---> 3a274fbc0357
Successfully built 3a274fbc0357
Successfully tagged cowsay/cowsay:latest
</code></pre>

<pre><code class="shell">
$ docker run --rm cowsay/cowsay
 __
<  >
 --
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

</code></pre>

<hr>

Также можно создать скрипт для обработки параметров

<pre><code class="shell">
$ cat entrypoint.sh
#!/usr/bin/env bash

if [ $# -eq 0 ]; then
    /usr/games/fortune | /usr/games/cowsay;
else
    /usr/games/cowsay "$@";
fi
</code></pre>

<pre><code class="shell">
$ cat Dockerfile 
FROM ubuntu

RUN apt-get update && apt-get install -y cowsay fortune

COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
</code></pre>

<pre><code class="bash">
$ docker build -t avis20/my_cowsay .
Sending build context to Docker daemon  4.096kB
Step 1/5 : FROM ubuntu
 ---> 549b9b86cb8d
...
</code></pre>

<pre><code class="shell">
$ docker run --rm avis20/my_cowsay hello world
 _____________
< hello world >
 -------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
</code></pre>

<pre><code class="shell">
$ docker run --rm avis20/my_cowsay
 ________________________________
/ You may get an opportunity for \
\ advancement today. Watch it!   /
 --------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
</code></pre>

## `CMD` - Выполнить команду по умолчанию

Запускает инструкцию во время инициализации контейнера. 



## ENTRYPOINT VS CMD

В отличии от entrypoint, cmd можно переопределить

CMD
<pre><code class="shell">
$ cat Dockerfile.cmd 
FROM ubuntu:bionic

CMD echo "hello"
</code></pre>

<pre><code class="shell">
$ docker build -t docker_cmd . -f Dockerfile.cmd 
Sending build context to Docker daemon  2.048kB
Step 1/2 : FROM ubuntu:bionic
 ---> 549b9b86cb8d
Step 2/2 : CMD echo "hello"
 ---> Using cache
 ---> 2df6050a0055
Successfully built 2df6050a0055
Successfully tagged docker_cmd:latest
</code></pre>

<pre><code class="shell">
$ docker run --rm docker_cmd
hello
$ docker run --rm docker_cmd echo hi
hi
</code></pre>

entrypoint
<pre><code class="shell">
$ cat Dockerfile.entrypoint 
FROM ubuntu:bionic

ENTRYPOINT echo 1
</code></pre>

<pre><code class="shell">
$ docker build -t docker_entrypoint . -f Dockerfile.entrypoint 
Sending build context to Docker daemon  3.072kB
Step 1/2 : FROM ubuntu:bionic
 ---> 549b9b86cb8d
Step 2/2 : ENTRYPOINT echo 1
 ---> Running in cdf959322499
Removing intermediate container cdf959322499
 ---> 862e875a4f63
Successfully built 862e875a4f63
Successfully tagged docker_entrypoint:latest
</code></pre>

<pre><code class="shell">
$ docker run --rm docker_entrypoint
1
$ docker run --rm docker_entrypoint echo dsadsa
1
</code></pre>

# Разное

## `ENV` - Задает переменные окружения внутри контейнера

Переменные можно использовать внутри Dockerfile
<pre><code class="shell">
$ ls -1
Dockerfile
file.txt
</code></pre>

<pre><code class="shell">
$ cat Dockerfile 
FROM ubuntu:bionic

ENV MYFILE file.txt

COPY $MYFILE /$MYFILE

CMD cat $MYFILE
</code></pre>

<pre><code class="shell">
$ docker build -t docker_env .
Sending build context to Docker daemon  3.072kB
Step 1/4 : FROM ubuntu:bionic
 ---> 549b9b86cb8d
Step 2/4 : ENV MYFILE file.txt
 ---> Running in 8cc505125c07
Removing intermediate container 8cc505125c07
 ---> 6486c21fe929
Step 3/4 : COPY $MYFILE /$MYFILE
 ---> 7e5862a3aa2d
Step 4/4 : CMD cat $MYFILE
 ---> Running in 8a7610bc82ae
Removing intermediate container 8a7610bc82ae
 ---> 51f90ec36b62
Successfully built 51f90ec36b62
Successfully tagged docker_env:latest
</code></pre>

<pre><code class="shell">
$ docker run --rm docker_env 
1
</code></pre>

Так и внутри контейнера

<pre><code class="shell">
$ docker run --rm docker_env env 
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=369515ff8f20
MYFILE=file.txt
HOME=/root
</code></pre>

## `EXPOSE` - Задать порт которые будет слушать контейнер 

Задает порты которые контейнер слушает снаружи

## `WORKDIR` - Задает рабочую директорию

## `USER` - Задает пользователя для использования в инструкциях RUN, CMD, ENTRYPOINT и т.п.

---
title: Изучаем Docker. Часть 2 - Dockerfile
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

# Dockerfile - команды

## Задать базовый образ `FROM`

`FROM debian`, `FROM ubuntu:18.04`

<div class="warn">
  <p>Всегда обязателен и должен находиться первой строкой в Dockerfile</p>
</div>

## Информация от разработчика `MAINTAINER`

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

<i>Эта инструкция позволяет определить выполняемый файл, который будет вызываться для обработки любых аргументов, переданных в команду docker run .</i>

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

<pre><code class="shell">
$ docker run --rm my_cowsay hello world
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
$ docker run --rm my_cowsay
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

## Добавить файлы из хоста в контейнер `ADD`

Копирует файлы из контекста создания или из удаленных URL-ссылок в создаваемый образ.

## `CMD`

## `ENV`

Задает переменные окружения внутри контейнера

## Задать порт(ы) которые будет слушать контейнер `EXPOSE`

Задает порты которые контейнер слушает снаружи

## `WORKDIR`

Задает рабочую директорию


---
title: Изучаем Docker. Часть 2 - Dockerfile
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


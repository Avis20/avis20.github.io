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
        <li><b>-d</b> - запустить в фоновом режиме</li>
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

## `docker-compose stop` - Остановка

## `docker-compose build` - Пересборка 

## `docker-compose ps` - Список контейнеров

## `docker-compose run` Запуск одного из контейнеров 

Поддерживает все те же команды что и docker run

<pre><code class="bash">
$ docker-compose run -d identidock
identidock_identidock_run_3
</code></pre>

## `docker-compose logs` - Логи с контейнера 

<pre><code class="bash">
docker-compose logs -f
</code></pre>

## `docker-compose rm` - Удаление остановленных контейнеров 

<pre><code class="bash">
$ docker-compose rm
</code></pre>


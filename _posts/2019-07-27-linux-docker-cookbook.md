---
title: Изучаем Docker. Часть 3 - CookBook
tags: docker
reference:
  - title:
    link:
  - title:
    link:
---

* TOC 
{:toc}

# Cookbook

Здесь перечислены большинство плюшек связаных с докером, всякие шорт каты и т.п.

# История образа. Как понять из чего контейнер?

TODO

# Список всех тегов образа

<pre><code class="bash">
docker images --no-trunc | grep $(docker inspect -f {{.Id}} avis20/identidock:stable)
</code></pre>

# Установка прав доступа юзеру к тому в Dockerfile

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

# Удалить все остановленные контейнеры

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

<pre><code class="perl">
echo "alias docker-clean='docker rm -v $(docker ps -aq -f status=exited)'" >> ~/.bashrc
</code></pre>

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

# Создать том в контейнер

## Способ №1 - `docker dun -v /data`

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

## Способ №2 - `Dockerfile - VOLUME`

Тоже самое что и в docker run, только в файле и т.к. почти каждая строка сценария исполняется в отдельном слое контейнера, нужно учитывать последовательность доступов к маунтам

## Способ №3 - Жеское мантирование

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

## Способ №4 - Контейнеры данных. Рекомендованный способ

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


# Запуск jekyll !!!

<pre><code class="bash">
docker run --rm -v $PWD/doc:/srv/jekyll -it -p 4000:4000 jekyll/builder jekyll serve -LR 4001
</code></pre>

## Запуск jenkins контейнера

<pre><code class="bash">
docker create --name jenkins-data identijenk echo "Jenkins Data Container"
</code></pre>

<pre><code class="bash">
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


# Разворачиваем контейнер в heroku

Установка
<pre><code class="bash">
sudo snap install --classic heroku
</code></pre>

cmd history
<pre><code class="bash">
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

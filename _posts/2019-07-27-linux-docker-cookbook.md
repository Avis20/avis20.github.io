---
title: "Docker - CookBook"
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

Здесь перечислены большинство плюшек связаных с докером, всякие шорт-каты и т.п.

# top по контейнерам

<pre><code class="shell">
docker stats $(docker inspect -f {{.Name}} $(docker ps -q))
</code></pre>

<pre><code class="shell">
CONTAINER ID        NAME                CPU %               MEM USAGE / LIMIT     MEM %               NET I/O             BLOCK I/O           PIDS
c8248799dbad        identilogspout      0.28%               4.461MiB / 15.37GiB   0.03%               39.7kB / 3.91MB     6.12MB / 0B         12
c59d30a1bbc9        identiproxy         0.00%               2.934MiB / 15.37GiB   0.02%               6.08MB / 6.27MB     0B / 0B             2
1f0e968c415a        identilogstash      0.52%               288.7MiB / 15.37GiB   1.83%               5.76MB / 7.03MB     49.1MB / 0B         41
2b7ba2b19ef9        identikibana        0.00%               55.07MiB / 15.37GiB   0.35%               109MB / 11.8MB      21.3MB / 4.1kB      11
f5139fa9439f        identidock          0.00%               34.14MiB / 15.37GiB   0.22%               4.59MB / 3.72MB     659kB / 0B          3
d22c022a0a89        identielastic       0.98%               436MiB / 15.37GiB     2.77%               15.1MB / 110MB      44.2MB / 55.5MB     125
456757f85bb0        identidnmonster     0.00%               35.05MiB / 15.37GiB   0.22%               40.9kB / 2.58kB     0B / 0B             15
ad3158f13845        identiredis         0.18%               2.613MiB / 15.37GiB   0.02%               480kB / 881kB       1.92MB / 8.19kB     3
</code></pre>

# `docker run --net=host` - Запуск контейнера работающем в сети на хосте

<pre><code class="bash">
docker run --rm --net=host -d postgres:9.6 
</code></pre>

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




# Контроль контейнеров

# Consul

## Шаг 1

Виртуалка №1
<pre><code class="perl">
Vagrant.configure(2) do |config|
    config.vm.box = "bento/ubuntu-16.04"
    config.vm.synced_folder ".", "/home/vagrant/projects"
    config.vm.network "private_network", ip: "3.3.3.2", auto_config: false
    config.vm.provision 'shell', inline: "ifconfig eth1 3.3.3.2"
    config.vm.provider "virtualbox" do |v|
        v.memory = 1024
        v.cpus = 1
    end

    config.vm.provision "shell", inline: <<-SHELL
    # Install docker and docker compose
    sudo -i
    apt-get update && apt-get install htop bash-completion
    curl https://get.docker.com > /tmp/install.sh
    chmod +x /tmp/install.sh
    /tmp/install.sh
    usermod -aG docker vagrant
    service docker restart
    SHELL
end
</code></pre>

Виртуалка №2
<pre><code class="perl">
Vagrant.configure(2) do |config|
    config.vm.box = "bento/ubuntu-16.04"
    config.vm.synced_folder ".", "/home/vagrant/projects"
    config.vm.network "private_network", ip: "3.3.3.3", auto_config: false
    config.vm.provision 'shell', inline: "ifconfig eth1 3.3.3.3"
    config.vm.provider "virtualbox" do |v|
        v.memory = 1024
        v.cpus = 1
    end
    
    config.vm.provision "shell", inline: <<-SHELL
    # Install docker and docker compose
    sudo -i
    apt-get update && apt-get install htop bash-completion
    curl https://get.docker.com > /tmp/install.sh
    chmod +x /tmp/install.sh
    /tmp/install.sh
    usermod -aG docker vagrant
    service docker restart
    SHELL
end
</code></pre>

<div class="warn">
    <p>После запуска нужно проверить ip виртуалок. Если (а это часто бывает) ip не проставился установить в ручную</p>
    <pre><code class="perl">
        sudo ifconfig eth1 3.3.3.2
        sudo ifconfig eth1 3.3.3.3
    </code></pre>
</div>

## Шаг 2

docker с консулом 1
<pre><code class="perl">
HOSTA=3.3.3.2

docker run --rm -d --name consul -h consul-1 \
-p 8300:8300 -p 8301:8301 -p 8301:8301/udp \
-p 8302:8302 -p 8400:8400 -p 8500:8500 -p $HOSTA:53:8600/udp \
gliderlabs/consul agent -data-dir /data -server \
-client 0.0.0.0 -advertise $HOSTA -bootstrap-expect 2
</code></pre>

docker с консулом 2
<pre><code class="perl">
HOSTA=3.3.3.2
HOSTB=3.3.3.3

docker run --rm -d --name consul -h consul-2 \
    -p 8300:8300 -p 8301:8301 -p 8301:8301/udp \
    -p 8302:8302 -p 8400:8400 -p 8500:8500 -p $HOSTB:53:8600/udp \
    gliderlabs/consul agent -data-dir /data -server \
    -client 0.0.0.0 -advertise $HOSTB -join $HOSTA
</code></pre>

## Шаг 3

запуск и регистрация редиса
<pre><code class="perl">
HOSTB=3.3.3.3
curl -XPUT http://$HOSTA:8500/v1/agent/service/register -d '{"name":"redis", "address":"'$HOSTB'", "port":6379}'
</code></pre>

Проверка
<pre><code class="perl">
docker run --rm redis:3 redis-cli -h redis.service.consul ping
</code></pre>


Запуск dnmonster на consul-1 и добавление соответствующего сервиса:
<pre><code class="perl">
docker run -d --name dnmonster amouat/dnmonster:1.0
...
DNM_IP=$(docker inspect -f {{.NetworkSettings.IPAddress}} dnmonster)
...
curl -XPUT http://$HOSTA:8500/v1/agent/service/register -d '{"name":"dnmonster", "address":"'$DNM_IP'", "port":8080}'
</code></pre>

# Сети

<pre><code class="perl">
docker run -d --name redis1 redis:3
</code></pre>

<pre><code class="perl">
docker run -it redis redis-cli -h db ping
</code></pre>

## Режимы сетей 

1) bridge - по умолчанию

Создает NAT подсеть 
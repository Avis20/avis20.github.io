---
title: Заметки по книге - Docker
tags: [book, docker]
reference:
  - title: Примеры из книги
    link: https://github.com/using-docker
  - title:
    link:
---

* TOC 
{:toc}

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


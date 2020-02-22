---
title: "Docker - Consul"
tags: [docker, consul]
reference:
  - title: "Использование Consul для service discovery и других задач"
    link: https://eax.me/consul/
  - title: "Consul: Service Discovery это просто, или прощаемся с конфиг-файлами"
    link: https://habr.com/ru/post/266139/
---

* TOC 
{:toc}

<hr>
Consul - Очередной компонент для поиска контейнеров

# Установка

Запуск контейнера
<pre><code class="perl">
HOSTA=3.3.3.2

docker run --rm -d --name consul -h consul-1 \
    -p 8300:8300 -p 8301:8301 -p 8301:8301/udp \
    -p 8302:8302 -p 8400:8400 -p 8500:8500 -p $HOSTA:53:8600/udp \
    gliderlabs/consul agent -data-dir /data -server \
    -client 0.0.0.0 -advertise $HOSTA -bootstrap-expect 2
</code></pre>

Подключение к уже существующему
<pre><code class="perl">
HOSTA=3.3.3.2
HOSTB=3.3.3.3

docker run --rm -d --name consul -h consul-2 \
    -p 8300:8300 -p 8301:8301 -p 8301:8301/udp \
    -p 8302:8302 -p 8400:8400 -p 8500:8500 -p $HOSTB:53:8600/udp \
    gliderlabs/consul agent -data-dir /data -server \
    -client 0.0.0.0 -advertise $HOSTB -join $HOSTA
</code></pre>

Проверка кластера
<pre><code class="perl">
docker exec consul consul members
</code></pre>

Запись/чтение key/value
<pre><code class="perl">
$ curl -XPUT http://$HOSTA:8500/v1/kv/hello -d world
true

$ curl -s http://$HOSTA:8500/v1/kv/hello | jq -r '.[].Value' | base64 -d
world
</code></pre>

Удаляем ключ
<pre><code class="shell">
$ curl -XDELETE http://$HOSTA:8500/v1/kv/hello
true

$ curl http://$HOSTA:8500/v1/kv/hello | jq 
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
</code></pre>

---

Регистрация сервиса
<pre><code class="perl">
docker run -d -p 6379:6379 --name redis redis:3
HOSTA=3.3.3.2
HOSTB=3.3.3.3
curl -XPUT http://$HOSTA:8500/v1/agent/service/register -d '{"name":"redis", "address":"'$HOSTB'", "port":6379}'
</code></pre>

Проверяем что сервис действительно добавился 
<pre><code class="perl">
export HOSTA=3.3.3.2
export HOSTB=3.3.3.3
curl -s http://$HOSTA:8500/v1/agent/services | json_pp
</code></pre>

Для отмены регистрации
<pre><code class="shell">
curl -XPUT http://$HOSTA:8500/v1/agent/service/deregister/redis
</code></pre>


<div class="warn">
  <p>Вот тут и начинаются пляски</p>
  <p>Для получения адреса нужно использовать конструкцию node.node[.datacenter].domain</p>
  <p>В моем случае <code>redis.service.consul</code> </p>
  <p>Т.е. получается [название сревиса].service.consul
<pre><code class="shell">
$ curl -XPUT http://3.3.3.3:8500/v1/agent/service/register -d '{"name":"test-serv", "address":"'127.0.0.1'", "port":1234}'
avis@avisPC2[19:10:27]:~$ dig @3.3.3.2 test-serv.service.consul +short
127.0.0.1
avis@avisPC2[19:11:04]:~$ dig @3.3.3.3 test-serv.service.consul +short
127.0.0.1
</code></pre>
</p>
  <p>PS как нормально сделать пока не понял, хотя можно разрулить на уровне nginx-а...</p>
</div>

<div class="error">
  <p>Самое интересное что консул не хочет отвечать ни на какой другой хост, кроме того на котором запущен</p>
  <p>т.е. ни <code>dig @172.17.0.2</code> (IP докер контейнера), ни <code>dig @127.0.0.1</code> (он же localhost)</p>
  <p>только
    <pre><code class="perl">
      $ dig @3.3.3.2 +short redis.service.consul
      3.3.3.3
    </code></pre>
    <p>и ни о каких других доменах он не знает...</p>
  </p>
</div>

Добавляем все это поделие в `docker daemon` чтобы он при создании контейнера, добавлял в `/etc/resolv.conf` адрес консула, dns сервера

<pre><code class="perl">
$ cat /etc/docker/daemon.json 
{
  "dns": ["3.3.3.2", "8.8.8.8"],
  "dns-search": ["service.consul"]
}
$ sudo service docker restart 
$ docker run --rm ubuntu cat /etc/resolv.conf
nameserver 3.3.3.2
nameserver 8.8.8.8
</code></pre>

`"dns-search": ["service.consul"]` - позволяет обращатся к сервису по имени, без постфикса `service.consul`

Запускаем редисон на consul-1
<pre><code class="shell">
docker run --rm -d -p 6379:6379 --name redis_on_consul2 redis:3
</code></pre>

Пингуем сервис из consul-2
<pre><code class="perl">
$ docker run --rm redis:3 redis-cli -h redis.service.consul ping
PONG
</code></pre>

и наоборот пингуем сервис из consul-1
<pre><code class="perl">
$ docker run --rm redis:3 redis-cli -h redis.service.consul ping
PONG
</code></pre>

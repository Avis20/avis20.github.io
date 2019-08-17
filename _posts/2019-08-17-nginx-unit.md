---
title: Nginx - Unit
tags: nginx
reference:
  - title: What An Absolute Unit
    link: https://medium.com/house-organ/what-an-absolute-unit-a36851e72554
  - title: NGINX Unit
    link: https://unit.nginx.org
  - title: NGINX Unit – Application Server from Nginx
    link: https://blog.hostonnet.com/nginx-unit
---


* TOC 
{:toc}

# Установка Ubuntu 16.04

1
<pre><code class="perl">
wget http://nginx.org/keys/nginx_signing.key
sudo apt-key add nginx_signing.key
</code></pre>

2 Добавить 2 строки
<pre><code class="perl">
sudo echo "deb http://nginx.org/packages/mainline/ubuntu/ xenial nginx" | sudo tee -a /etc/apt/sources.list
sudo echo "deb-src http://nginx.org/packages/mainline/ubuntu/ xenial nginx" | sudo tee -a /etc/apt/sources.list
</code></pre>

3
<pre><code class="perl">
sudo apt-get update
sudo apt-get -y install unit
</code></pre>

# Настройка

1) запуск
<pre><code class="perl">
sudo service unitd start
</code></pre>

2) задаем конфиг файл
<pre><code class="perl">
sudo service unitd restoreconfig /usr/share/doc/unit/examples/example.config
</code></pre>

3) вывести текущий конфиг
<pre><code class="perl">
sudo service unitd dumpconfig
</code></pre>

По умолчанию unit содержит модули для работы с php и python. Для остальных нужно отдельно собирать

# Сборка

1) качаем исходники
<pre><code class="perl">
git clone https://github.com/nginx/unit.git && cd unit
</code></pre>

2) настраиваем конфиг
<pre><code class="perl">
./configure \
  --prefix=/usr \
  --bindir=/usr/bin \
  --sbindir=/usr/sbin \
  --modules=/usr/lib/unit/modules \
  --state=/var/unit/state \
  --pid=/var/run/unit.pid \
  --log=/var/log/unit.log \
  --user="$(id -un)" \
  --group="$(id -gn)" \
  --control=unix:/var/run/control.unit.sock
</code></pre>

3) Скачиваем поддержку dev разработки!!!
<div class="warn">
    <p>Без этого будет ошибка</p>
    <pre><code class="perl">
$ ./configure perl
configuring Perl module
checking for Perl ... not found

./configure: error: no Perl found.
    </code></pre>
</div>

<pre><code class="perl">
sudo apt-get install libperl-dev
</code></pre>

3) Добавляем поддержку модуля
<pre><code class="perl">
$ ./configure perl
configuring Perl module
checking for Perl ... found
checking for Perl version ... 5.22.1
 + Perl module: perl.unit.so
</code></pre>

4) Собираем 

<pre><code class="perl">
sudo make install
</code></pre>

5) Собираем модуль
<pre><code class="perl">
sudo make perl-install
</code></pre>

6) Проверяем
<pre><code class="perl">
$ sudo unitd --version
unit version: 1.10.0
configured as ./configure --prefix=/usr --bindir=/usr/bin --sbindir=/usr/sbin --modules=/usr/lib/unit/modules --state=/var/unit/state --pid=/var/run/unit.pid --log=/var/log/unit.log --user=vagrant --group=vagrant --control=unix:/var/run/control.unit.sock
$ ls -l /usr/lib/unit/modules
total 304
-rwxr-xr-x 1 root root 308568 Aug 17 12:05 perl.unit.so
</code></pre>

# Проба пера - psgi

1) Запскаем простое psgi приложение
<pre><code class="perl">
$ cat /home/vagrant/projects/hello-unit/index.pl
#!/usr/bin/env perl

use Data::Dumper;

my $app = sub {
      my $env = shift;
      return [
          '200',
          [ 'Content-Type' => 'text/plain' ],
          [ "Hello from Unit, Perl $^V, environment:\n\n", Dumper($env) ],
      ];
};
</code></pre>

<pre><code class="perl">
$ cat /home/vagrant/projects/hello-unit/perl.conf 
{
  "listeners": {
    "*:8080": {
      "application": "hello-unit"
    }
  },
  "applications": {
    "hello-unit": {
        "type": "perl",
        "user": "nobody",
        "processes": 1,
        "working_directory": "/vagrant/projects/hello-unit/",
        "script": "/vagrant/projects/hello-unit/index.pl"
    }
  }
}
</code></pre>

2) Скармливаем конфиг демону
<pre><code class="perl">
$ sudo curl -XPUT -d @perl.conf --unix-socket /var/run/control.unit.sock http://localhost/config/
{
    "success": "Reconfiguration done."
}
</code></pre>

<div class="warn">
    <p>Без sudo будет
        <pre><code class="perl">
curl: (7) Couldn't connect to server
        </code></pre>
    </p>
</div>

PS Для получения актуального конфига, также делается REST запрос
<pre><code class="perl">
$ sudo curl -XGET --unix-socket /var/run/control.unit.sock http://localhost/config/
{
    "listeners": {
        "*:8080": {
            "application": "hello-unit"
        }
    },

    "applications": {
        "hello-unit": {
            "type": "perl",
            "user": "nobody",
            "processes": 1,
            "working_directory": "/vagrant/projects/hello-unit/",
            "script": "/vagrant/projects/hello-unit/index.pl"
        }
    }
}
</code></pre>


3) пробуем обратиться к приложению, которое указали в конфиге
<pre><code class="perl">
$ curl localhost:8080
Hello from Unit, Perl v5.22.1, environment:

$VAR1 = {
          'psgi.input' => bless( , 'IO::File' ),
          'psgi.url_scheme' => 'http',
          'SERVER_PORT' => '80',
          'psgi.run_once' => '',
          'REQUEST_METHOD' => 'GET',
          'REQUEST_URI' => '/',
          'psgi.errors' => bless( , 'IO::File' ),
          'psgi.multithread' => ${\$VAR1->{'psgi.run_once'}},
          'SERVER_PROTOCOL' => 'HTTP/1.1',
          'HTTP_ACCEPT' => '*/*',
          'psgi.streaming' => 1,
          'SERVER_ADDR' => '127.0.0.1',
          'HTTP_USER_AGENT' => 'curl/7.47.0',
          'SERVER_SOFTWARE' => 'Unit/1.10.0',
          'psgi.multiprocess' => ${\$VAR1->{'psgi.streaming'}},
          'SERVER_NAME' => 'localhost',
          'PATH_INFO' => '/',
          'REMOTE_ADDR' => '127.0.0.1',
          'psgi.version' => [
                              1,
                              1
                            ],
          'psgi.nonblocking' => ${\$VAR1->{'psgi.run_once'}},
          'HTTP_HOST' => 'localhost:8080',
          'QUERY_STRING' => ''
        };
</code></pre>

# Проба пера - catalyst



# Конфиг

## applications - список запускаемых приложений 

## listeners - 

make perl-5.22-install
make perl-5.22
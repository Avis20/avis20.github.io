---
title: Perl - Catalyst
tags: [perl, catalyst]
reference:
  - title: Catalyst Advent Calendar
    link: http://www.catalystframework.org/calendar/2012

  - title: Руководство Catalyst
    link: http://dev-lab.info/%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE-catalyst/

  - title: Catalyst и его Chained
    link: http://dev-lab.info/2013/10/catalyst-%D0%B8-%D0%B5%D0%B3%D0%BE-chained/

---

* TOC 
{:toc}

## Установка через пакеты в Ubuntu 16.04

<pre><code class="perl">
sudo apt-get update && sudo apt install make build-essential
</code></pre>

<div class="warn">
    <p>Если не находит модули, можно захордкодить перменные окружения (но лучше всетаки не стоит)
<pre><code class="perl">
PERL5LIB="/home/avis/perl5/lib/perl5${PERL5LIB:+:${PERL5LIB}}"; export PERL5LIB; PERL5LIB="/home/avis/perl5/lib/perl5${PERL5LIB:+:${PERL5LIB}}" >> ~/.bashrc
</code></pre>
    </p>
</div>

Обычно установка сводиться к 
<pre><code class="perl">
sudo apt-get install libcatalyst-perl
</code></pre>

Но если чего начинает не хватать, то
<pre><code class="perl">
sudo apt-get install libcatalyst-perl libcatalyst-devel-perl \
libcatalyst-plugin-static-simple-perl libcatalyst-plugin-configloader-perl \
liblib-abs-perl \
libcatalyst-action-renderview-perl
</code></pre>

Для большинства задач хватает. 

Если же в пакетах нет, и лень собирать свои, то качаем с цпана
<pre><code class="perl">
curl -L cpanmin.us | sudo perl - -l /usr/share/perl5 App::cpanminus uni::perl local::lib
</code></pre>

## Создание приложения

Создаем пустое приложение
<pre><code class="perl">
catalyst.pl MyApp</code></pre>

Проверяем
<pre><code class="perl">
perl MyApp/script/myapp_server.pl</code></pre>

В браузере переходим на `localhost:3000` или `curl localhost:3000`

## Подрубаем nginx

<pre><code class="perl">
sudp apt-get install nginx</code></pre>

При переходе в браузере на ip виртуалки, в моем случае `http://192.168.16.78/`, видим чот сервис стартанул

Создаем свой файл конфига
<pre><code class="perl">
vim ~/catalyst.conf

upstream dev_backends {
    server     localhost:3000;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;

    location /      {
        proxy_cache                     off;
        proxy_set_header                Host                        $host;
        proxy_set_header                X-Real-IP                   $remote_addr;
        proxy_set_header                X-User-TimeZone             "Europe/Moscow";
        proxy_set_header                X-Real-IP                   $remote_addr;
        proxy_pass                      http://dev_backends;
    }

}
</code></pre>

Вырубаем дефолтную статику и влючаем свой конфиг

<pre><code class="perl">
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /home/avis/catalyst.conf /etc/nginx/sites-enabled/
sudo service nginx restart
</code></pre>

готово

## Подрубаем автостарт через апач

<pre><code class="perl">
sudo apt-get install apache2 libapache2-mod-perl2
</code></pre>

Вырубаем дефлтный конфиг
<pre><code class="perl">
</code></pre>


# Запуск

## Встроенный веб-сервер

<pre><code class="perl">
$ perl ./projects/hello-catalyst/MyApp/script/myapp_server.pl
...
[debug] Loaded Path actions:
.-------------------------------------+--------------------------------------.
| Path                                | Private                              |
+-------------------------------------+--------------------------------------+
| /                                   | /index                               |
| /...                                | /default                             |
'-------------------------------------+--------------------------------------'

[info] MyApp powered by Catalyst 5.90103
HTTP::Server::PSGI: Accepting connections at http://0:3000/
^C
</code></pre>

## Apache

## Starman

<pre><code class="perl">
sudo apt-get install starman
</code></pre>

<pre><code class="perl">
$ starman ./projects/hello-catalyst/MyApp/myapp.psgi -p 3000
...
Error while loading /home/vagrant/projects/hello-catalyst/MyApp/myapp.psgi: Can't locate MyApp.pm in @INC (you may need to install the MyApp module) (@INC contains: /home/avis/perl5/lib/perl5 /home/avis/perl5/lib/perl5 /etc/perl /usr/local/lib/x86_64-linux-gnu/perl/5.22.1 /usr/local/share/perl/5.22.1 /usr/lib/x86_64-linux-gnu/perl5/5.22 /usr/share/perl5 /usr/lib/x86_64-linux-gnu/perl/5.22 /usr/share/perl/5.22 /usr/local/lib/site_perl /usr/lib/x86_64-linux-gnu/perl-base .) at /home/vagrant/projects/hello-catalyst/MyApp/myapp.psgi line 4.
</code></pre>

хм...
<pre><code class="perl">

...
$ cat ./projects/hello-catalyst/MyApp/myapp.psgi 
use strict;
use warnings;

use lib::abs qw| ./lib |;

use MyApp;

my $app = MyApp->apply_default_middlewares(MyApp->psgi_app);
$app;
</code></pre>

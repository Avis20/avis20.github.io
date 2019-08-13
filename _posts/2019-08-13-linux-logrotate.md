---
title: Linux - Logrotate
tags: etc
reference:
  - title: НАСТРОЙКА LOGROTATE
    link: https://losst.ru/nastrojka-logrotate
  - title: logrotate
    link: https://www.opennet.ru/man.shtml?topic=logrotate&category=8&russian=0
---


* TOC 
{:toc}

# Установка

Ubuntu 16.04 - установлена по умолчанию

# Настройка

Стандартый конфиг - `/etc/logrotate.conf`

# logrotate

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-v, --verbose</b> = выводить отладочную информацию</li>
        <li><b>-d, --debug</b> = запустить но не ротировать логи</li>
        <li><b>-f, --force</b> = запустить принудительно</li>
        <li><b>-d</b> = 
            <pre><code class="bash">
                content
            </code></pre>
        </li>
    </ul>

</details>

# Конфиг

## Пути до логов

Первым параметром указывается путь до лога который ротируется. Пример

<pre><code class="bash">
/var/log/nginx.access.log {}
</code></pre>

либо несколько
<pre><code class="bash">
/var/log/nginx.access.log /var/log/nginx.error.log {}
</code></pre>

Также можно по маске
<pre><code class="bash">
/var/log/nginx.*.log {}
</code></pre>

<div class="warn">
    <p>Дира в которой лежит лог, должна иметь права 755 иначе logrotate будет угаться типа</p>
    <pre><code class="bash">
error: skipping "/var/log/nginx.access.log" because parent directory has insecure permissions (It's world writable or writable by group which is not "root") Set "su" directive in config file to tell logrotate which user/group should be used for rotation.
    </code></pre>
</div>

## Основные параметры

* hourly - каждый час;
* daily - каждый день;
* weekly - каждую неделю;
* monthly - каждый месяц;
* yearly - каждый год.

`olddir` - дира куда складываются логи

`missingok` - не выдавать ошибки, если лог файла не существует

`compress` - указывает, что старые логи необходимо сжимать

`delaycompress` - не сжимать последний и предпоследний лог

`rotate` - указывает сколько старых логов нужно хранить, в параметрах передается количество

<div class="warn">
   <p>Если не указать параметр rotate то логи буду удаляться сразу!</p>
</div>

`copytruncate` - не удалять исходный лог, а обрезать

`create` - указывает, что необходимо создать пустой лог файл после перемещения старого

`copy` - создать копию лога не меняя исходый

<div class="warn">
    <p>Программы, на подобие nginx, не пишут в новый файл. Нужно либо делать copytruncate, либо отправлять SIGHUB в postrotate см. ниже</p>
</div>

`size` - размер лога, когда он будет перемещен; k - билобайт, M - мегабайт, G - гигабайт

<div class="warn">
    <p>Если не указать размер то не будет ротироваться</p>
</div>

## Форматы

`dateext` - добавляет дату ротации после заголовка старого лога

`dateformat` - формат даты, см <a href="/2018/02/17/cli.html#d" target="_blank">date</a>. По умолчанию добавляет '-yyyymmdd'

<div class="warn">
    <p>Не все форматы поддерживаться, например в ubuntu не понял %H - дни, хотя в date норм</p>
    <p>Пишут что доступен в версии 3.9.0</p>
</div>

`start` - номер, с которого будет начата нумерация старых логов. В место dateext!

## Разное

`mail` - отправлять Email после завершения ротации; TODO

`maxage count` - выполнять ротацию логов, если они старше, чем указано в днях

`extension` - сохранять оригинальный лог файл после ротации, если у него указанное расширение; TODO

`notifempty` - Не сдвигать журнал, если он пуст (это переопределяет параметр ifempty).

## Скрипты

`prerotate/endscript` - выполнить bash скрипт перед ротацией но до сжатия

`postrotate/endscript` - выполнить bash скрипт после ротации но до сжатия

`sharedscripts` - выполнить скрипт только один раз, если используется маска

`nosharedscripts` - Выполнять скрипты prerotate и postrotate для каждого обработанного журнала

<div class="info">
    <p>Если указана маска и нужно как-то определить какой именно файл сейчас обрабатывается в скрипте, то полный путь до лога находиться в переменной $1</p>
</div>

# Пример

<pre><code class="bash">
$ cat /etc/logrotate.d/nginx.main.conf
/var/log/nginx.*.log {
    olddir /var/log/archive/
    hourly
    compress
    delaycompress
    missingok
    # create
    copytruncate
    size 1k
    rotate 3
    start 1
    # dateext
    # dateformat .%Y-%m-%d-%H-%s
    prerotate
        echo "Now rotating log = $1" >> /var/log/logrotate.pre.info
    endscript
    postrotate
        echo "Rotate is done; log = $1" >> /var/log/logrotate.post.info
    endscript
}
...
$ sudo logrotate /etc/logrotate.d/nginx.main.conf
...
$ ls -lh /var/log/nginx.*.log /var/log/archive/
-rw-r--r-- 1 root root  12K Aug 13 22:13 /var/log/nginx.access.log
-rw-r--r-- 1 root root    0 Aug 13 20:44 /var/log/nginx.error.log

/var/log/archive/:
total 16K
-rw-r--r-- 1 root root 6.7K Aug 13 22:12 nginx.access.log.1
-rw-r--r-- 1 root root  720 Aug 13 22:11 nginx.access.log.2.gz
-rw-r--r-- 1 root root  319 Aug 13 22:08 nginx.access.log.3.gz
...
</code></pre>
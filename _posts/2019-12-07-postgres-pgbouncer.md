---
title: "Postgres - PgBouncer"
tags: [database, postgres]
reference:
  - title: 
    link:
---

* TOC 
{:toc}


<h2 id="pool">Настройка пула соединений</h2>

Установка pgbouncer

<pre><code class="shell">
sudo apt-get install pgbouncer
</code></pre>

Логи
<pre><code class="shell">
tail -f /var/log/postgresql/pgbouncer.log
</code></pre>

Конфиг. Основные параметры
Указываем дефолтный сервер

<pre><code class="shell">
vim /etc/pgbouncer/pgbouncer.ini
;; database name = connect string
;;
;; connect string params:
;;   dbname= host= port= user= password=
;;   client_encoding= datestyle= timezone=
;;   pool_size= connect_query=
[databases]

* = host=localhost port=5432

</code></pre>

Настройка способа соединения
* session - сессия удерживается клиентом пока не закроется соединение
* transaction - соединение возвращается в общий пул после завершения транзакции
* statment - соединение освобождается после выполнения каждого отдельного стейтмента
<pre><code class="shell">
; When server connection is released back to pool:
;   session      - after client disconnects
;   transaction  - after transaction finishes
;   statement    - after statement finishes
pool_mode = transaction
</code></pre>

Настройка пула
Указываем максимальное кол-во одновременных клиентов
<pre><code class="shell">
; total number of clients that can connect
max_client_conn = 1000
</code></pre>

<div class="warn">
    <p>Значение max_client_conn, в pgbouncer, не должно превышать значения max_connections в postgres</p>
</div>

Настройки аунтефикации

<pre><code class="shell">
; any, trust, plain, crypt, md5
auth_type = md5
;auth_file = /8.0/main/global/pg_auth
auth_file = /etc/pgbouncer/userlist.txt
</code></pre>

Доступ к админке pgbouncer

<pre><code class="shell">
admin_users = postgres
</code></pre>

<div class="warn">
    <p>Параметр `auth_type`, по умолчанию trust, т.е. pgbouncer будет пускать в базу всех без пароля</p>
</div>

`/etc/pgbouncer/userlist.txt` содержит имена и пароли по которым pgbouncer подключается к БД.

Его можно сделать вручную

<pre><code class="shell">
echo -n "test12avis" | md5sum | awk '{print "md5"}'
md5b569f63db7a099534ce9ae73f0c16e70 

sudo vim /etc/pgbouncer/userlist.txt
"avis" "md5b569f63db7a099534ce9ae73f0c16e70"
</code></pre>

Либо с помощью psql

<pre><code class="shell">
postgres=# \o users.txt
postgres=# \t
Tuples only is on.
postgres=# select '"' || rolname || '" "' || rolpassword || '"' from pg_authid;
postgres=# \q
postgres@ubuntu:~cat users.txt 
 
 
 "bar" "md55426824942db4253f87a1009fd5d2d4f"
 "avis" "md5b569f63db7a099534ce9ae73f0c16e70"

</code></pre>

Запуск pgbouncer

<pre><code class="shell">
sudo chown postgres:postgres pgbouncer.ini
sudo -iu postgres
pgbouncer -d /etc/pgbouncer/pgbouncer.ini
2019-01-07 18:56:38.480 3914 LOG File descriptor limit: 1024 (H:1048576), max_client_conn: 1000, max fds possible: 1010
</code></pre>

Проверяем соединение

<pre><code class="shell">
psql -p 6432 -d dvdrental -U avis
Password for user avis: 
psql (9.5.12)
Type "help" for help.

dvdrental=# 

tail -f /var/log/postgresql/pgbouncer.log
2019-01-07 19:26:53.353 4581 LOG C-0xa6b550: (nodb)/(nouser)@unix(4592):6432 registered new auto-database: db = dvdrental
2019-01-07 19:26:53.354 4581 LOG C-0xa6b550: dvdrental/avis@unix(4592):6432 login attempt: db=dvdrental user=avis tls=no
2019-01-07 19:26:53.355 4581 LOG C-0xa6b550: dvdrental/avis@unix(4592):6432 closing because: client unexpected eof (age=0)
2019-01-07 19:26:56.744 4581 LOG C-0xa6b550: dvdrental/avis@unix(4592):6432 login attempt: db=dvdrental user=avis tls=no
2019-01-07 19:26:56.746 4581 LOG S-0xa70200: dvdrental/avis@127.0.0.1:5432 new connection to server (from 127.0.0.1:41824)
</code></pre>

Подключение к админке pgboucer-а

<pre><code class="shell">
sudo vim /etc/pgbouncer/pgbouncer.ini
admin_users = pgbouncer

echo -n "pgbpgbouncer" | md5sum | awk '{print "md5"}'
md5def3006d3446137225418cbeafd31885
sudo vim /etc/pgbouncer/users.txt
"pgbouncer" "md5def3006d3446137225418cbeafd31885"

sudo service pgbouncer restart

psql -p 6432 -U pgbouncer pgbouncer
Password for user pgbouncer: 
psql (9.5.12, server 1.7/bouncer)
Type "help" for help.

pgbouncer=# 
pgbouncer=# show version;
NOTICE:  pgbouncer version 1.7 (Debian)
SHOW
</code></pre>

<div class="warn"><p>Пароль - pgb</p></div>


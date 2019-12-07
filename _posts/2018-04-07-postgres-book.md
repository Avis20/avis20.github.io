---
title: "Заметки по книге - Администрирование PostgreSQL 9. Книга рецептов"
tags: [postgres, books, database]
reference:
  -
    link: http://qaru.site/questions/16236/how-to-change-postgresql-user-password
    title: Как изменить пароль пользователя PostgreSQL?
  - 
    title: psql manual
    link: http://postgresql.ru.net/manual/app-psql.html

---

* TOC 
{:toc}

# Глоссарий

<div>
    <ol>
        <li>Сервер - сервер БД и его процессы</li>
        <li>Сервис - обертка операционной системы с помощью которой вызывается сервер</li>
        <li>Страница (блок данных) - </li>
        <li>Кортеж (строка) - </li>
        <li>Пул соединений - это набор сессий, которые уже подключены. Его можно использовать для уменьшения нагрузки.(Пример <a href="#pool">pgbouncer</a>)</li>
        <li><b>Транзакция</b> - логическая единица работы</li>
    </ol>
</div>

# Установка PostgreSQL

## Установка из исходников

<pre><code class="perl">
$ wget https://ftp.postgresql.org/pub/source/v9.6.16/postgresql-9.6.16.tar.gz
$ tar xzf postgresql-9.6.16.tar.gz
$ ls -l
total 23912
drwxrwxr-x 6 vagrant vagrant     4096 Nov 11 22:23 postgresql-9.6.16
-rw-rw-r-- 1 vagrant vagrant 24474740 Nov 11 22:23 postgresql-9.6.16.tar.gz
</code></pre>

<pre><code class="shell">
$ sudo apt-get install make gcc libreadline-dev zlib1g-dev
</code></pre>

### Создание конфигурации
<pre><code class="perl">
$ cd postgresql-9.6.16 && ./configure
...
</code></pre>

В команде configure можно указать различные параметры конфигурации. Например:

* `--prefix` - каталог установки, по умолчанию /usr/local/pgsql;
* `--enable-debug` - для включения отладочной информации.

### Сборка PostgreSQL
Возможные варианты:

* make - сборка только сервера
* make world - сборка сервера, всех расширений и документации

<pre><code class="perl">
$ make
make[2]: Leaving directory '/home/vagrant/postgresql-9.6.16/src/test/regress'
make -C test/perl all
make[2]: Entering directory '/home/vagrant/postgresql-9.6.16/src/test/perl'
make[2]: Nothing to be done for 'all'.
make[2]: Leaving directory '/home/vagrant/postgresql-9.6.16/src/test/perl'
make[1]: Leaving directory '/home/vagrant/postgresql-9.6.16/src'
make -C config all
make[1]: Entering directory '/home/vagrant/postgresql-9.6.16/config'
make[1]: Nothing to be done for 'all'.
make[1]: Leaving directory '/home/vagrant/postgresql-9.6.16/config'
All of PostgreSQL successfully made. Ready to install.
</code></pre>

### Установка

<pre><code class="perl">
$ sudo make install
</code></pre>

### Настройка пользователя `postgres`

<pre><code class="perl">
$ sudo adduser postgres -- создаем пользователя
...
$ sudo -iu postgres -- проверяем вход
$ sudo mkdir /usr/local/pgsql/data/ -- создаем и присваиваем пользователя где будет храниться БД
$ sudo chown postgres /usr/local/pgsql/data/
$ tail -n 2 /home/postgres/.bashrc 
export PGDATA=/usr/local/pgsql/data; -- уст. путь до данных
PATH="/usr/local/pgsql/bin${PATH:+:${PATH}}"; export PATH; -- добавляем /usr/local/pgsql/bin для доступа к утилитам
</code></pre>

### Запуск кластера

Ключ -k включает подсчет контрольной суммы страниц, что позволяет своевременно обнаруживать повреждение данных.
<pre><code class="perl">
$ initdb -k
...
Success. You can now start the database server using:
    pg_ctl -D /usr/local/pgsql/data -l logfile start
</code></pre>

<pre><code class="perl">
pg_ctl -D /usr/local/pgsql/data -l logfile start
</code></pre>

* -D - по умолчанию $PGDATA

Проверяем
<pre><code class="perl">
$ psql -c 'select now();'
              now              
-------------------------------
 2019-12-05 20:18:56.048817+00
(1 row)
</code></pre>

### Установка (сборка) расширений

Список доступных расширений
<pre><code class="perl">
$ psql -c 'select * from pg_available_extensions;'
  name   | default_version | installed_version |           comment            
---------+-----------------+-------------------+------------------------------
 plpgsql | 1.0             | 1.0               | PL/pgSQL procedural language
(1 row)
</code></pre>

<a href="https://postgrespro.ru/docs/enterprise/9.6/contrib">Список модулей для 9.6</a>

<pre><code class="perl">
$ cd postgresql-9.6.16/contrib/pgcrypto/
$ make
...
$ sudo make install
...
$ psql -c 'select * from pg_available_extensions;'
   name   | default_version | installed_version |           comment            
----------+-----------------+-------------------+------------------------------
 plpgsql  | 1.0             | 1.0               | PL/pgSQL procedural language
 pgcrypto | 1.3             |                   | cryptographic functions
(2 rows)
</code></pre>


## Установка из пакетов

В книге нет инструкции к установке, поэтому использовал статью - [Как установить и начать использовать PostgreSQL в Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/postgresql-ubuntu-16-04-ru)
Сама установка свелась к
<pre><code class="shell">
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
</code></pre>


### Базовая установка postgres на ubuntu server 16.04.4

<pre><code class="shell">
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
</code></pre>

#### Install 9.6

<pre><code class="shell">
sudo add-apt-repository "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -sc)-pgdg main"
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install postgresql-9.6
</code></pre>


## Вход в БД

Зайти под пользователем postgres, в базу postgres
<pre><code class="shell">
sudo -iu postgres
...
postgres@Postgres:~$ psql 
psql (9.5.12)
Type "help" for help.

postgres=#
</code></pre>

# Запуск и остановка сервера

<pre><code class="perl">
$ pg_ctl stop -m fast|smart|immediate
</code></pre>

Shutdown modes are:
* fast        принудительно завершает сеансы и записывает на диск изменения из оперативной памяти;
* smart       ожидает завершения всех сеансов и записывает на диск изменения из оперативной памяти;
* immediate   принудительно завершает сеансы, при запуске потребуется восстановление.




# Конфигурирование

Основной файл конфигурации - `postgresql.conf`. Находиться в 
<pre><code class="shell">
$ psql 
postgres@postgres=# show config_file 
postgres-# ;
              config_file              
---------------------------------------
 /usr/local/pgsql/data/postgresql.conf
(1 row)
</code></pre>

При изменении без перезагрузки можно

1.
<pre><code class="shell">
$ pg_ctl reload
server signaled
</code></pre>

2.
<pre><code class="shell">
# select pg_reload_conf();
LOG:  received SIGHUP, reloading configuration files
 pg_reload_conf 
----------------
 t
(1 row)
</code></pre>

3.
<pre><code class="shell">
$ kill -s HUP $( pidof postgres )  
</code></pre>

## Изменение параметров

Для просмотра текущих параметров
<pre><code class="shell">
# select * from pg_settings where name like 'work_mem';
-[ RECORD 1 ]---+----------------------------------------------------------------------------------------------------------------------
name            | work_mem <-- Название
setting         | 4096 <-- текущее значение
unit            | kB
category        | Resource Usage / Memory 
short_desc      | Sets the maximum memory to be used for query workspaces.
extra_desc      | This much memory can be used by each internal sort operation and hash table before switching to temporary disk files.
context         | user <-- контекст который может изменить параметр
vartype         | integer
source          | default <-- источник. 
min_val         | 64
max_val         | 2147483647
enumvals        | 
boot_val        | 4096 <-- Значение по уполчанию
reset_val       | 4096 <-- уст. значение
sourcefile      | 
sourceline      | 
pending_restart | f

</code></pre>

Контексты
* internal - нельзя изменить, никак...
* postmaster - требуется перезапуск сервера
* sighup - достаточно перечитать конфиг
* superuser - может менять на ходу, супер пользователь, во время своего сеанса 
* user - любой может изменить для своего сеанса

Пример

При дублировании параметров в конфиге, примениться последний
<pre><code class="shell">
# select sourceline, name, setting, applied from pg_file_settings where name like 'work_mem';
 sourceline |   name   | setting | applied 
------------+----------+---------+---------
        647 | work_mem | 12MB    | f
        648 | work_mem | 8MB     | t
(2 rows)
</code></pre>

Флаг applied говорит какой из параметров примениться

<pre><code class="shell">
# select pg_reload_conf();
LOG:  received SIGHUP, reloading configuration files
LOG:  parameter "work_mem" changed to "8MB"
 pg_reload_conf 
----------------
 t
(1 row)
</code></pre>

<pre><code class="shell">
# select * from pg_settings where name like 'work_mem';
-[ RECORD 1 ]---+----------------------------------------------------------------------------------------------------------------------
name            | work_mem
setting         | 8192
unit            | kB
category        | Resource Usage / Memory
short_desc      | Sets the maximum memory to be used for query workspaces.
extra_desc      | This much memory can be used by each internal sort operation and hash table before switching to temporary disk files.
context         | user
vartype         | integer
source          | configuration file
min_val         | 64
max_val         | 2147483647
enumvals        | 
boot_val        | 4096
reset_val       | 8192
sourcefile      | /usr/local/pgsql/data/postgresql.conf
sourceline      | 648
pending_restart | f
</code></pre>

## Добавление/удаление из `postgresql.auto.conf`

Изменение postgresql.auto.conf
<pre><code class="shell">
# alter system set work_mem to '16MB';
ALTER SYSTEM
</code></pre>

<pre><code class="shell">
# select sourcefile, sourceline, name, setting, applied from pg_file_settings where name like 'work_mem';
                 sourcefile                 | sourceline |   name   | setting | appl
--------------------------------------------+------------+----------+---------+-----
 /usr/local/pgsql/data/postgresql.conf      |        647 | work_mem | 12MB    | f
 /usr/local/pgsql/data/postgresql.conf      |        648 | work_mem | 8MB     | f
 /usr/local/pgsql/data/postgresql.auto.conf |          3 | work_mem | 16MB    | t
(3 rows)
</code></pre>

<div class="warn">
  <p>Для применения параметра нужно перезагрузить конфиг</p>
<pre><code class="shell">
# show work_mem;
 work_mem 
----------
 8MB
(1 row)
</code></pre>
</div>

<pre><code class="shell">
# select pg_reload_conf();
LOG:  received SIGHUP, reloading configuration files
LOG:  parameter "work_mem" changed to "16MB"
 pg_reload_conf 
----------------
 t
(1 row)

Time: 1.770 ms
postgres@postgres=# show work_mem;
 work_mem 
----------
 16MB
(1 row)

Time: 1.496 ms
</code></pre>

Для удаления `alter system` используется `alter system reset`
<pre><code class="shell">
# alter system reset work_mem;
ALTER SYSTEM
Time: 10.622 ms
postgres@postgres=# show work_mem;
 work_mem 
----------
 16MB
(1 row)

Time: 0.307 ms
postgres@postgres=# select pg_reload_conf();
LOG:  received SIGHUP, reloading configuration files
 pg_reload_conf 
----------------
 t
(1 row)

Time: 0.509 ms
postgres@postgres=# LOG:  parameter "work_mem" changed to "8MB"
</code></pre>

## Открытие доступа к базе из вне

<ol>
  <li>
    <p>Установить адреса с которого постгрес будет ожидать соединения, </p>
    <p>для всех адресов listen_addresses='*' в /etc/postgresql/9.5/main/postgresql.conf</p>
  </li>
  <li>
    <p>Чтобы установить всем пользователям доступ ко всем базам по паролю, нужно добавить/изменить в /etc/postgresql/9.5/main/pg_hba.conf</p>
<pre><code class="shell">
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             0.0.0.0/0               md5
</code></pre>
  </li>
</ol>


## Удаленное подключение

<div class="warn">
    <p>Перед подключением необходимо задать пароль пользователя к базе. Сделать это можно так: 
        <pre><code class="shell">
avis=# alter user avis with password 'test12';
ALTER ROLE</code></pre>
    </p>
    <p><s>Что не очень безопасно, т.к. именно в таком виде будет храниться в базе</s> или нет...</p>
<pre><code class="sql">
postgres=# SELECT *
FROM pg_user
WHERE usename = 'avis';

-[ RECORD 1 ]+---------
usename      | avis
usesysid     | 16388
usecreatedb  | t
usesuper     | t
userepl      | f
usebypassrls | f
passwd       | ********
valuntil     | 
useconfig    | 
</code></pre>
    <p>Поэтому более безопасно задать пароль после подключения. см <a href="#pass">\password</a></p>
</div>

## Создание новой роли

<pre><code class="sql">
sudo -iu postgres
postgres@ubuntu:~createuser --interactive
Enter name of role to add: avis
Shall the new role be a superuser? (y/n) y
</code></pre>

<h3 id="pass">Сменить пароль пользователя под которым вошли \password</h3>

<pre><code class="shell">
avis@ubuntu:~psql -d postgres
postgres=# \password
Enter new password: 
Enter it again:
</code></pre>

## Подключение к базе

```psql -h host -p port -d dbname -U user```

* host - узел
* port - порт
* dbname - название базы данных
* user - пользователь
* пароль

<pre><code class="shell">
psql -h 192.168.16.106 -p 5432 -d avis -U avis
</code></pre>

Пароль test12

### Где я? кто я?

При подключении к базе, например через pgsql следующие команды помогут узнать где вы находитесь

* Текущая база

<pre><code class="shell">
avis=# select current_database();
...
 current_database 
------------------
 avis
(1 row)
</code></pre>

* Текущий пользователь
<pre><code class="shell">
avis=# select current_user;
...
 current_user 
--------------
 avis
(1 row)
</code></pre>

* Текущая версия postgres
<pre><code class="shell">
avis=# select version();
...
                                                     version                                                      
------------------------------------------------------------------------------------------------------------------
 PostgreSQL 9.5.12 on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 5.4.0-6ubuntu1~16.04.9) 5.4.0 20160609, 64-bit
(1 row)
</code></pre>



# Многоверсионность

Номер транзакции - отметка времени

* xmin - номер транзакции которая создала версию строки
* xmax - номер транзакции которая удалила версию строки

<pre><code class="shell">
create table t(
  s text
);

insert into t values ('Первая версия'); <-- xmin=600, xmax=0
# select *, xmin, xmax from t;
       s       | xmin | xmax 
---------------+------+------
 Первая версия |  600 |    0
(1 row)
</code></pre>


# Подключения

1. psql
<pre><code class="shell">
psql -U avis -h 192.168.16.102 -p 5432 avis
</code></pre>

1. sql manager  

<img src="/static/img/books/pgsql/1.png" alt="">

<img src="/static/img/books/pgsql/2.png" alt="">

1. pgAdmin

<img src="/static/img/books/pgsql/pgadmin1.png" alt="">

# Прочее

## Сколько времени работает сервер?

<pre><code class="shell">
SELECT date_trunc('second', CURRENT_TIMESTAMP - pg_postmaster_start_time());

 date_trunc 
------------
 00:56:57
(1 row)
</code></pre>

pg_postmaster_start_time - возвращает время когда сервер стартовал

## Где лежат логи сервера?

Он может быть в:
* Директории с данными
* В директории операционной системы - /spool/log, и т.п.
* Перенаправлен в syslog
* Может вовсе отсутсвовать

По умолчанию, в ubuntu - ```/var/log/postgresql/postgresql-9.5-main.log```

## Список баз данных на сервере

1. <pre><code class="shell">
psql -h 192.168.16.106 -l
                                  List of databases
                                  ...
</code></pre>
2. <pre><code class="shell">
avis=# \l
                                  List of databases
                                  ...
</code></pre>

3. <pre><code class="shell">
SELECT datname FROM pg_database;

  datname  
-----------
 template1
 template0
 postgres
 test
 avis
(5 rows)
</code></pre>

<div class="warn">
    <p>Пример рабочей базы - <a href="http://www.postgresqltutorial.com/postgresql-sample-database/">тут</a></p>
    <p>Установка <a href="http://www.postgresqltutorial.com/load-postgresql-sample-database/">тут</a></p>
</div>

## Сколько таблиц в БД?

1.
<pre><code class="sql">
psql -h 192.168.1.36 -p 5432 -d dvdrental -U avis
dvdrental=# \dt
             List of relations
 Schema |     Name      | Type  |  Owner   
--------+---------------+-------+----------
 public | actor         | table | postgres
 public | address       | table | postgres
 public | category      | table | postgres
 public | city          | table | postgres
 public | country       | table | postgres
 public | customer      | table | postgres
 public | film          | table | postgres
 public | film_actor    | table | postgres
 public | film_category | table | postgres
 public | inventory     | table | postgres
 public | language      | table | postgres
 public | payment       | table | postgres
 public | rental        | table | postgres
 public | staff         | table | postgres
 public | store         | table | postgres
(15 rows)
</code></pre>

2.
<pre><code class="sql">
SELECT count(*)
FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema', 'pg_catalog');

 count 
-------
    22
(1 row)
</code></pre>

В фонмиксе, на сегодняшний день - 14-04-2018, 26 схемы, 114 таблиц.

<img src="/static/img/books/pgsql/difficult.png" alt="">

## Сколько весит база данных?

<pre><code class="sql">
SELECT pg_size_pretty(pg_database_size(current_database()));
 pg_size_pretty 
----------------
 14 MB
(1 row)
</code></pre>

* current_database() - возвращает название текущей БД. 
* pg_database_size([название базы]) - возвращает размер базы в байтах
* pg_size_pretty([байты]) - возвращает размер в человекочитаемом виде

## Сколько весит таблица и индексы?

<pre><code class="sql">
SELECT pg_size_pretty(pg_table_size('public.store')) AS table_size,
       pg_size_pretty(pg_indexes_size('public.store')) AS index_size;

 table_size | index_size 
------------+------------
 8192 bytes | 32 kB
(1 row)
</code></pre>

Размер всей таблицы + ее индексы и т.п.
<pre><code class="sql">
SELECT pg_size_pretty(pg_total_relation_size('store'));

 pg_size_pretty 
----------------
 40 kB
(1 row)
</code></pre>

## Топ 10 самых больших таблиц

<pre><code class="sql">
SELECT TABLE_NAME,
       pg_size_pretty(pg_relation_size(TABLE_NAME)) AS size
FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY size DESC
LIMIT 10;

         table_name         |    size    
----------------------------+------------
 payment                    | 864 kB
 language                   | 8192 bytes
 staff                      | 8192 bytes
 store                      | 8192 bytes
 category                   | 8192 bytes
 country                    | 8192 bytes
 customer                   | 72 kB
 address                    | 64 kB
 film_category              | 48 kB
 film                       | 432 kB
(10 rows)

</code></pre>

## Сколько строк в таблице?

<pre><code class="sql">
SELECT count(*) FROM payment;

 count 
-------
 14596
(1 row)
</code></pre>


# Пример зависимостей объектов

<pre><code class="sql">
CREATE TABLE orders (
    order_id integer PRIMARY KEY
);
CREATE TABLE order_lines (
    order_id integer, line_id smallint,
    PRIMARY KEY (order_id, line_id)
);
</code></pre>

Добавляем ссылочную целостность

<pre><code class="sql">
ALTER TABLE order_lines ADD FOREIGN KEY (order_id) REFERENCES orders (order_id);
ALTER TABLE
</code></pre>

Теперь нельзя просто так удалить таблицу т.к. она имеет зависимости

<pre><code class="sql">
DROP TABLE orders;
ERROR:  cannot drop table orders because other objects depend on it
DETAIL:  constraint order_lines_order_id_fkey on table order_lines depends on table orders
HINT:  Use DROP ... CASCADE to drop the dependent objects too.
</code></pre>

Для получения полной информации о зависимостях таблицы

<pre><code class="sql">
\d+ orders
                         Table "public.orders"
  Column  |  Type   | Modifiers | Storage | Stats target | Description 
----------+---------+-----------+---------+--------------+-------------
 order_id | integer | not null  | plain   |              | 
Indexes:
    "orders_pkey" PRIMARY KEY, btree (order_id)
Referenced by:
    TABLE "order_lines" CONSTRAINT "order_lines_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(order_id)
</code></pre>

## Планирование новой базы данных

Пример <a href="https://dynalist.io/d/M5CeqEyn6xBIgqqp9XhAnSu1">тут</a>

# Проверка состояния сервера

## Состояние сервера

<pre><code class="sql">
sudo pg_ctlcluster 9.5 main status
pg_ctl: server is running (PID: 1869)
/usr/lib/postgresql/9.5/bin/postgres "-D" "/var/lib/postgresql/9.5/main" "-c" "config_file=/etc/postgresql/9.5/main/postgresql.conf"
avis@ubuntu:~
</code></pre>

## Запуск сервера вручную

Ubuntu
<pre><code class="sql">
sudo pg_ctlcluster 9.5 main start
Redirecting start request to systemctl
</code></pre>

## Быстрая и безопасная остановка сервера

<pre><code class="sql">
sudo pg_ctlcluster 9.5 main stop --force
Redirecting stop request to systemctl
</code></pre>

ключ `--force` указывает что нужно выполнить быстрое отключение, а если не получается выполняется мнгновенное отключение

## Перезагрузка конфига

<pre><code class="sql">
sudo pg_ctlcluster 9.5 main reload
</code></pre>

## Принудительное отключение пользователя

1. client
<pre><code class="sql">
dvdrental=# select count(*) from public.payment;
 count 
-------
 14596
(1 row)

</code></pre>

2. admin
<pre><code class="sql">
postgres=# SELECT * FROM pg_stat_activity WHERE pid = 1989;
-[ RECORD 1 ]----+-------------------------------------
datid            | 16389
datname          | dvdrental
pid              | 1989
usesysid         | 16388
usename          | avis
application_name | psql
client_addr      | 192.168.1.46
client_hostname  | 
client_port      | 34886
backend_start    | 2019-01-03 06:09:46.482286+03
xact_start       | 
query_start      | 2019-01-03 06:10:08.897423+03
state_change     | 2019-01-03 06:10:08.902233+03
waiting          | f
state            | idle
backend_xid      | 
backend_xmin     | 
query            | select count(*) from public.payment;


postgres=# SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = 1989;
-[ RECORD 1 ]--------+--
pg_terminate_backend | t

</code></pre>

3. client
<pre><code class="sql">
dvdrental=# SELECT 1;
FATAL:  terminating connection due to administrator command
SSL connection has been closed unexpectedly
The connection to the server was lost. Attempting reset: Succeeded.
</code></pre>


## Выделение для пользователя собственной БД

1. Создание пользователя и БД 
<pre><code class="sql">
postgres=# CREATE USER foo;
CREATE ROLE
postgres=# CREATE DATABASE foo OWNER = foo;
CREATE DATABASE
</code></pre>

2. Указываем права доступа

<pre><code class="sql">
postgres=# BEGIN;
BEGIN
postgres=# REVOKE CONNECT ON DATABASE foo FROM PUBLIC;
REVOKE
postgres=# GRANT CONNECT ON DATABASE foo TO foo;
GRANT
postgres=# COMMIT;
COMMIT
</code></pre>

3. Создаем другого пользователя чтобы проверить работает ли доступ, и пробуем подключиться

<pre><code class="sql">
postgres=# CREATE USER bar;
CREATE ROLE
postgres=# ALTER USER bar WITH password 'bar';
ALTER ROLE

avis@avis-PC[06:32:03]:~psql -h 192.168.1.36 -p 5432 -d foo -U bar
Password for user bar: 
psql: FATAL:  permission denied for database "foo"
DETAIL:  User does not have CONNECT privilege.
</code></pre>

## Создание нескольких серверов на одной системе

<pre><code class="sql">
sudo pg_createcluster 9.5 db2
Creating new cluster 9.5/db2 ...
  config /etc/postgresql/9.5/db2
  data   /var/lib/postgresql/9.5/db2
  locale en_US.UTF-8
  socket /var/run/postgresql
  port   5433
</code></pre>

Проделываем все операции что и с новоым сервером БД см. открытие доступов и т.п.
После этого получаем доступ к новому серверу БД

<pre><code class="sql">
sudo -iu postgres
postgres@ubuntu:~psql -p 5433
psql (9.5.12)
Type "help" for help.

postgres=# \l
                                  List of databases
   Name    |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges   
-----------+----------+----------+-------------+-------------+-----------------------
 postgres  | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | 
 template0 | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
           |          |          |             |             | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
           |          |          |             |             | postgres=CTc/postgres
(3 rows)

postgres=# 
</code></pre>

# Разное

Чтобы по 100 раз не вводить пароль, можно сохранить параметры подключения <u>с машины с которой подкючаетесь</u> в ~/.pgpass  
Формат:
```host:port:dbname:user:password```
<pre><code class="shell">
cat ~/.pgpass 
...
192.168.16.106:5432:*:avis:test12

psql -h 192.168.16.106
...
psql (9.5.12)
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
Type "help" for help.

avis=# 
</code></pre>


# Упр.

## 1

1. Запустите psql и проверьте информацию о текущем подключении.

<pre><code class="shell">
postgres=# \conninfo 
You are connected to database "postgres" as user "postgres" via socket in "/tmp" at port "5432".
</code></pre>

2. Выведите строки таблицы pg_tables.
<pre><code class="shell">
postgres=# select schemaname, tablename from pg_tables limit 4;
 schemaname |    tablename    
------------+-----------------
 pg_catalog | pg_statistic
 pg_catalog | pg_type
 pg_catalog | pg_authid
 pg_catalog | pg_user_mapping
(4 rows)
</code></pre>

3. Установите команду `less -XS` для постраничного просмотра и еще раз выведите все строки pg_tables.
<pre><code class="shell">
postgres=# \setenv PAGER 'less -XS'
</code></pre>

Для постоянного включения
<pre><code class="shell">
postgres@vagrant:~$ cat ~/.psqlrc 
\pset pager on
\setenv PAGER 'less -XS'
postgres@vagrant:~$ 
</code></pre>

4. Настройте psql так, чтобы для каждой команды печаталось время ее выполнения. Убедитесь, что при повторном запуске эта настройка сохраняется.

<pre><code class="shell">
$ cat ~/.psqlrc 
\timing
...
$ psql 
Pager is used for long output.
Timing is on.
psql (9.6.16)
Type "help" for help.

postgres=# select 1;
 ?column? 
----------
        1
(1 row)

Time: 0.709 ms
</code></pre>

5. Приглашение по умолчанию показывает имя базы данных. Настройте приглашение так, чтобы дополнительно
выводилась информация о пользователе: роль@база=#

<pre><code class="shell">
\set PROMPT1 '%n@%/%R%# '
\set PROMPT2 '%n@%/%R%# '
</code></pre>



## 2

1. Создайте таблицу с одной строкой.
<pre><code class="shell">
create table t(
  s text
);
insert into t values ('Первая версия');
</code></pre>

2. Начните первую транзакцию и выполните запрос к таблице.
<pre><code class="shell">
# begin ;
BEGIN
ubuntu_vb=# select * from t;
       s       
---------------
 Первая версия
(1 row)
</code></pre>
3. Во втором сеансе удалите строку и зафиксируйте изменения.
<pre><code class="shell">
# begin ;
BEGIN
ubuntu_vb=# delete from t;
DELETE 1
ubuntu_vb=# 
</code></pre>
4. Сколько строк увидит первая транзакция, выполнив тот же запрос повторно? Проверьте.

<pre><code class="shell">
# select *, xmin, xmax from t;
       s       | xmin | xmax 
---------------+------+------
 Первая версия |  607 |  608
(1 row)
</code></pre>

5. Завершите первую транзакцию.

<pre><code class="shell">
# commit ;
COMMIT
# select *, xmin, xmax from t;
 s | xmin | xmax 
---+------+------
(0 rows)
</code></pre>

6. Повторите все то же самое, но пусть теперь транзакция работает на уровне изоляции repeatable read:
`BEGIN ISOLATION LEVEL REPEATABLE READ;` Объясните отличия.

tx1
<pre><code class="shell">
# select *, xmin, xmax from t;
 s | xmin | xmax 
---+------+------
(0 rows)

ubuntu_vb=# insert into t values ('Первая версия');
INSERT 0 1
ubuntu_vb=# BEGIN ISOLATION LEVEL REPEATABLE READ;
BEGIN
ubuntu_vb=# select *, xmin, xmax from t;
       s       | xmin | xmax 
---------------+------+------
 Первая версия |  616 |    0
(1 row)
</code></pre>

tx2
<pre><code class="shell">
ubuntu_vb=# begin ;
BEGIN
ubuntu_vb=# select *, xmin, xmax from t;
       s       | xmin | xmax 
---------------+------+------
 Первая версия |  616 |    0
(1 row)

ubuntu_vb=# delete from t;
DELETE 1
ubuntu_vb=# commit ;
COMMIT
ubuntu_vb=# 
</code></pre>

tx1
<pre><code class="shell">
# select *, xmin, xmax from t;
       s       | xmin | xmax 
---------------+------+------
 Первая версия |  616 |  617
(1 row)
ubuntu_vb=# update t set s = 'e21';
ERROR:  could not serialize access due to concurrent update
ubuntu_vb=# select *, xmin, xmax from t;
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ubuntu_vb=# 
</code></pre>
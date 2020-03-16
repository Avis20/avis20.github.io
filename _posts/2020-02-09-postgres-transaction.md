---
title: Транзакции в Postgres
tags: [postgres, database, 1db]
reference:
  -
    link:
    title:

---

* TOC 
{:toc}
<br>

# Time line

- 44:25
- 25:23

<b>Транзакция</b> - логическая единица работы, удовлетворяющая след. 4-м свойствам (ACID)

<ol>
    <li><b>Атомарность (Atomicity)</b> - в транзакции выполняется все или ничего; транзакция не может выполниться частично</li>
    <li><b>Согласованность (Consistentcy)</b> - транзакция переводит базу данных из одного согласованного состояния в другое согласованное состояние</li>
    <li><b>Изолированность (Isolation)</b> - каждая транзакция выполняется вне зависимости от других транзакций</li>
    <li><b>Долговечность (Durability)</b> - если изменения состояния базы данных, сделанные транзакцией, зафиксированны, то они будут сохранены даже если потом произойдет сбой</li>
 </ol> 

<div class="info">
  <p>Транзакция нужна в первую очередь чтобы обеспечить предсказуемый результат!</p>
</div>


## Пример создания транзакции

<pre><code class="sql">
create table films (
    imdb varchar(16) primary key,
    title varchar(40) not null,
    kind varchar(10)
);
</code></pre>
<pre><code class="sql">
CREATE TABLE
</code></pre>
<hr>

Начало транзакции
<pre><code class="sql">
begin;
</code></pre>
<pre><code class="sql">
BEGIN
</code></pre>
<hr>

Обработка данных внутри транзакции
<pre><code class="sql">
insert into films (imdb, title, kind) values
(1234, 'Выживший', 'вестерн');
</code></pre>
<pre><code class="sql">
INSERT 0 1
</code></pre>
<hr>

Успешное завершение транзакции
<pre><code class="sql">
commit;
</code></pre>
<pre><code class="sql">
COMMIT
</code></pre>
<hr>

Проверка что данные после транзакции не потерялись
<pre><code class="sql">
TABLE films;
</code></pre>
<pre><code class="sql">
 imdb |  title   |  kind   
------+----------+---------
 1234 | Выживший | вестерн
(1 row)
</code></pre>
<hr>

### Журнал транзакций (WAL файлы)


### Бонус журналов транзакций
На базе журнала транзакций реализуется ряд дополнительных возможностей

* Point in time recovery - восстановление по журналу транзакций 
* Репликация - если есть две одинаковые копии БД, то с помощью WAL файлов можно обеспечить их синхронизацию. В одной БД WAL файлы создаються и по сети (rsync) передаються в копию.


## Изолированность. Мультиверсионность. MVCC

Номер транзакции - отметка времени

- xmin - номер транзакции которая создала версию строки
- xmax - номер транзакции которая удалила версию строки

### Пример блокировки транзакции

<pre><code class="sql">
create table accounts (
  id int,
  name varchar,
  balance int
);
</code></pre>

<pre><code class="sql">
CREATE TABLE
</code></pre>
<hr>

<pre><code class="sql">
insert into accounts
(id, name, balance) values
( 1, 'Alice', 500 );

</code></pre>

<pre><code class="sql">
INSERT 0 1
</code></pre>
<hr>

<pre><code class="sql">
TABLE accounts;
</code></pre>

<pre><code class="sql">
id | name  | balance 
----+-------+---------
  1 | Alice |     500
(1 row)
</code></pre>
<hr>


Транзакция №1
<pre><code class="sql">
BEGIN TRANSACTION
ISOLATION LEVEL REPEATABLE READ;
</code></pre>

<pre><code class="sql">
BEGIN
</code></pre>
<hr>

<pre><code class="sql">
SELECT balance
FROM accounts
WHERE name = 'Alice';
</code></pre>

<pre><code class="sql">
balance 
---------
     500
(1 row)
</code></pre>
<hr>

<pre><code class="sql">
UPDATE accounts
SET balance = balance + 100
WHERE name = 'Alice';
</code></pre>

<pre><code class="sql">
UPDATE 1
</code></pre>
<hr>

Транзакция №2

<pre><code class="sql">
BEGIN TRANSACTION
ISOLATION LEVEL REPEATABLE READ;
</code></pre>

<pre><code class="sql">
BEGIN
</code></pre>
<hr>

<pre><code class="sql">
SELECT balance
FROM accounts
WHERE name = 'Alice';
</code></pre>

<pre><code class="sql">
balance 
---------
     500
(1 row)
</code></pre>
<hr>

<pre><code class="sql">
UPDATE accounts
SET balance = balance + 500
WHERE name = 'Alice';
</code></pre>


Update висит пока 1-я транзакция сделает либо commit либо rollback

1) Если Транзакция №1 делает `commit`, то Транзакция №2 падает с ошибкой

<pre><code class="sql">
ERROR:  could not serialize access due to concurrent update
</code></pre>
<hr>

Более того, после этой ошибки вообще ничего сделать не получится, пока не сделаешь rollback
<pre><code class="sql">
select 1;
</code></pre>
<pre><code class="sql">
ERROR:  current transaction is aborted, commands ignored until end of transaction block
</code></pre>
<hr>

2) Если Транзакция №1 делает `rollback`, то Транзакция №2 завершается успешно

<pre><code class="sql">
UPDATE 1
</code></pre>
<hr>

## Уровни изолированности транзакции

- Read uncommited - чтение незафиксированных данных
- Read commited (по умолчанию) - чтение фиксированных данных
- Repeatable read - повторяемость чтения
- Serializable - упорядочиваемость

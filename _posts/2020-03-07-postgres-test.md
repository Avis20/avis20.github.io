---
title: Транзакции в Postgres v2
tags: [postgres, database, 1db]
reference:
  -
    link:
    title:

---

* TOC 
{:toc}

<div class="warn">
    <p>Перенес с <a href="https://www.notion.so/avis/Postgres-8d0be6645e19442ebfe0ceb2f2f322c3" target="blank">notion</a></p>
</div>


# Транзакции в Postgres

**Транзакция** - логическая единица работы, удовлетворяющая след. 4-м свойствам (ACID)

1. **Атомарность** (Atomicity) - в транзакции выполняется все или ничего; транзакция не может выполниться частично
2. **Согласованность** (Consistentcy) - транзакция переводит базу данных из одного согласованного состояния в другое согласованное состояние
3. **Изолированность** (Isolation) - каждая транзакция выполняется вне зависимости от других транзакций
4. **Долговечность** (Durability) - если изменения состояния базы данных, сделанные транзакцией, зафиксированны, то они будут сохранены даже если потом произойдет сбой

Транзакция нужна в первую очередь чтобы обеспечить предсказуемый результат!

### Пример создания транзакции

    create table films (
        imdb varchar(16) primary key,
        title varchar(40) not null,
        kind varchar(10)
    );

---

## Журнал транзакций (WAL файлы)

### Бонус журналов транзакций

На базе журнала транзакций реализуется ряд дополнительных возможностей

- Point in time recovery - восстановление по журналу транзакций
- Репликация - если есть две одинаковые копии БД, то с помощью WAL файлов можно обеспечить их синхронизацию. В одной БД WAL файлы создаються и по сети (rsync) передаются в копию.

## Изолированность. Мультиверсионность. MVCC

Номер транзакции - отметка времени

- xmin - номер транзакции которая создала версию строки
- xmax - номер транзакции которая удалила версию строки

### Пример блокировки транзакции

    create table accounts (
      id int,
      name varchar,
      balance int
    );

    CREATE TABLE

---

    insert into accounts
    (id, name, balance) values
    ( 1, 'Alice', 500 );

    INSERT 0 1

---

    table accounts;

    id | name  | balance 
    ----+-------+---------
      1 | Alice |     500
    (1 row)

---

Транзакция №1

    BEGIN TRANSACTION
    ISOLATION LEVEL REPEATABLE READ;

    BEGIN

    SELECT balance
    FROM accounts
    WHERE name = 'Alice';

    balance 
    ---------
         500
    (1 row)

    UPDATE accounts
    SET balance = balance + 100
    WHERE name = 'Alice';

    UPDATE 1

---

Транзакция №2

    BEGIN TRANSACTION
    ISOLATION LEVEL REPEATABLE READ;

    BEGIN

    SELECT balance
    FROM accounts
    WHERE name = 'Alice';

    balance 
    ---------
         500
    (1 row)

    UPDATE accounts
    SET balance = balance + 500
    WHERE name = 'Alice';

Update висит пока 1-я транзакция сделает либо commit либо rollback

---

- 1. Если Транзакция №1 делает commit, то Транзакция №2 падает с ошибкой

    ERROR:  could not serialize access due to concurrent update

Более того, после этой ошибки вообще ничего сделать не получится, пока не сделаешь rollback

    select 1;

    ERROR:  current transaction is aborted, commands ignored until end of transaction block

- 2. Если Транзакция №1 делает rollback, то Транзакция №2 завершается успешно

    UPDATE 1

# Time line

- 25:23
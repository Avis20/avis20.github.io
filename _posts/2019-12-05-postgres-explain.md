---
title: "Postgres - Explain"
tags: [database, postgres]
reference:
  - title: 
    link:
---

* TOC 
{:toc}

## Подготовка

<pre><code class="shell">
CREATE TABLE foo (c1 integer, c2 text);
INSERT INTO foo
  SELECT i, md5(random()::text)
  FROM generate_series(1, 1000000) AS i;
</code></pre>

## Последовательное сканирование `Seq Scan`

<pre><code class="shell">
EXPLAIN SELECT * FROM foo;
...
                          QUERY PLAN                          
--------------------------------------------------------------
 Seq Scan on foo  (cost=0.00..18334.00 rows=1000000 width=37)
(1 строка)
...
</code></pre>

* Seq Scan - последовательное, блок за блоком, чтение данных таблицы foo
* cost - оценка затратности операции.
    * 0.00 - затраты на получение первой строки
    * 18334.00 - затраты на получение всех строк
* width - стредний размер одной строки в байтах
* rows - примерное кол-во возвращаемых строк

При изменени данных, нужно обновить статитику командой `ANALYZE`
<pre><code class="shell">
# EXPLAIN SELECT * FROM foo;
...
                          QUERY PLAN                          
--------------------------------------------------------------
 Seq Scan on foo  (cost=0.00..18334.00 rows=1000000 width=37)
(1 строка)
...
INSERT INTO foo
  SELECT i, md5(random()::text)
  FROM generate_series(1, 10) AS i;
...
INSERT 0 10
...
EXPLAIN SELECT * FROM foo;
...
                          QUERY PLAN                          
--------------------------------------------------------------
 Seq Scan on foo  (cost=0.00..18334.00 rows=1000000 width=37)
(1 строка)
...
ANALYZE foo;
...
ANALYZE
...
EXPLAIN SELECT * FROM foo;
                          QUERY PLAN                          
--------------------------------------------------------------
 Seq Scan on foo  (cost=0.00..18334.30 rows=1000030 width=37)
(1 строка)

...
</code></pre>


Реальное выполнение происходит при вызове `EXPLAIN ANALYZE`
<pre><code class="shell">
EXPLAIN ANALYZE SELECT * FROM foo;
...
                                                   QUERY PLAN                                                   
----------------------------------------------------------------------------------------------------------------
 Seq Scan on foo  (cost=0.00..18334.30 rows=1000030 width=37) (actual time=0.019..108.546 rows=1000030 loops=1)
 Planning time: 0.335 ms
 Execution time: 156.198 ms
(3 строки)
</code></pre>

* actual time - реальное время выполения
* rows - реальное кол-во строк
* loops - сколько раз пришлось выполнить операцию `Seq Scan`
* Planning time - время выполения плана
* Execution time - время выполенния запроса

Средний Размер строки, можно узнать из системной таблицы
<pre><code class="shell">
SELECT sum(avg_width) as width FROM pg_stats WHERE tablename = 'foo';
 width 
-----
  37
(1 row)
</code></pre>



Без использования кэшей

<pre><code class="shell">
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM foo;
                                                   QUERY PLAN                                                   
----------------------------------------------------------------------------------------------------------------
 Seq Scan on foo  (cost=0.00..18334.30 rows=1000030 width=37) (actual time=0.557..292.230 rows=1000030 loops=1)
   Buffers: shared read=8334
 Planning time: 10.127 ms
 Execution time: 365.876 ms
(4 строки)
...
</code></pre>

* Buffers: shared read=8334 - кол-во блоков, считанные с диска

При повторном вызове
<pre><code class="shell">
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM foo;
                                                   QUERY PLAN                                                   
----------------------------------------------------------------------------------------------------------------
 Seq Scan on foo  (cost=0.00..18334.30 rows=1000030 width=37) (actual time=0.385..169.861 rows=1000030 loops=1)
   Buffers: shared hit=32 read=8302
 Planning time: 0.434 ms
 Execution time: 231.323 ms
(4 строки)
</code></pre>

* Buffers: shared hit=32 - кол-во блоков считанных с кэша 

## Соединение с помощью вложенных циклов `NESTED LOOPS JOIN`

<pre><code class="shell">
EXPLAIN (VERBOSE, ANALYZE, BUFFERS)
select t1.x, t2.y
from table1 t1, table2 t2
where t1.z = 'ABC';
...
                                                     QUERY PLAN                                                     
--------------------------------------------------------------------------------------------------------------------
 Nested Loop  (cost=0.00..130.19 rows=6780 width=8) (actual time=0.004..0.004 rows=0 loops=1)
   Output: t1.x, t2.y
   ->  Seq Scan on public.table2 t2  (cost=0.00..21.30 rows=1130 width=4) (actual time=0.003..0.003 rows=0 loops=1)
         Output: t2.id, t2.x, t2.y, t2.z
   ->  Materialize  (cost=0.00..24.16 rows=6 width=4) (never executed)
         Output: t1.x
         ->  Seq Scan on public.table1 t1  (cost=0.00..24.12 rows=6 width=4) (never executed)
               Output: t1.x
               Filter: (t1.z = 'ABC'::text)
 Planning time: 0.236 ms
 Execution time: 0.041 ms
(11 строк)
</code></pre>

### Алгоритм
1. Определяется ведущая таблица
2. Каждая строка ведущей таб. сравнивается, по условию выбора с внешней таб.
3. 

## Хеш-соединение `HASH JOIN`

1. Таблица с меньшим кол-вом строк выбирается как конструктивная
2. Формируется хеш таблица с колонкой по которым выполняется операция соединения
3. Для внешней таб. также выполняется функция хеширования на атрибуте соединения
4. Выполняется поиск 

<pre><code class="shell">
EXPLAIN (VERBOSE, ANALYZE, BUFFERS)
select t1.x, t2.y
from table1 t1, table2 t2
where t1.id = t2.id;
...
                                                     QUERY PLAN                                                     
--------------------------------------------------------------------------------------------------------------------
 Hash Join  (cost=24.20..50.08 rows=34 width=8) (actual time=0.005..0.005 rows=0 loops=1)
   Output: t1.x, t2.y
   Hash Cond: (t2.id = t1.id)
   ->  Seq Scan on public.table2 t2  (cost=0.00..21.30 rows=1130 width=8) (actual time=0.003..0.003 rows=0 loops=1)
         Output: t2.id, t2.x, t2.y, t2.z
   ->  Hash  (cost=24.12..24.12 rows=6 width=8) (never executed)
         Output: t1.x, t1.id
         ->  Seq Scan on public.table1 t1  (cost=0.00..24.12 rows=6 width=8) (never executed)
               Output: t1.x, t1.id
               Filter: (t1.z = 'ABC'::text)
 Planning time: 0.295 ms
 Execution time: 0.044 ms
(12 строк)
</code></pre>

## Соединение сортировкой и слиянием `SORT MERGE JOIN`
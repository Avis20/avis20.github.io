---
title: "Заметки по книге - SQL - Сборник рецептов"
tags: [book, database]
reference:
  - title: SQL_COOKBOOK_TABLE
    link: https://gist.github.com/YujiShen/39f6ef573ada22b87998
---

* TOC 
{:toc}

emp - служащие
* deptno - номер отдела
* comm - коммисионные
* sal - зарплата

# Глава 1. Извлечение записей (SELECT)

### Выборка всех данных
<pre><code class="sql">
sql_cookbook=# SELECT * FROM emp;
 empno | ename  |    job    | mgr  |  hiredate  |   sal   |  comm   | deptno 
-------+--------+-----------+------+------------+---------+---------+--------
  7369 | SMITH  | CLERK     | 7902 | 1980-12-17 |  800.00 |         |     20
  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30
  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30
  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |         |     20
  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30
  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |         |     30
  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |         |     10
  7788 | SCOTT  | ANALYST   | 7566 | 1982-12-09 | 3000.00 |         |     20
  7839 | KING   | PRESIDENT |      | 1981-11-17 | 5000.00 |         |     10
  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    0.00 |     30
  7876 | ADAMS  | CLERK     | 7788 | 1983-01-12 | 1100.00 |         |     20
  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |         |     30
  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |         |     20
  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |         |     10
(14 строк)
</code></pre>

<div class="sql">
    <p>Также есть сокращенная форма</p>
<pre><code class="sql">
sql_cookbook=# table emp;
 empno | ename  |    job    | mgr  |  hiredate  |   sal   |  comm   | deptno 
-------+--------+-----------+------+------------+---------+---------+--------
  7369 | SMITH  | CLERK     | 7902 | 1980-12-17 |  800.00 |         |     20
  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30
  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30
  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |         |     20
  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30
  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |         |     30
  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |         |     10
  7788 | SCOTT  | ANALYST   | 7566 | 1982-12-09 | 3000.00 |         |     20
  7839 | KING   | PRESIDENT |      | 1981-11-17 | 5000.00 |         |     10
  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    0.00 |     30
  7876 | ADAMS  | CLERK     | 7788 | 1983-01-12 | 1100.00 |         |     20
  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |         |     30
  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |         |     20
  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |         |     10
(14 строк)
</code></pre>
</div>

### Выборка определенных строк
<pre><code class="sql">
sql_cookbook=# SELECT * FROM emp WHERE deptno = 10;
 empno | ename  |    job    | mgr  |  hiredate  |   sal   | comm | deptno 
-------+--------+-----------+------+------------+---------+------+--------
  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |      |     10
  7839 | KING   | PRESIDENT |      | 1981-11-17 | 5000.00 |      |     10
  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |      |     10
(3 строки)
</code></pre>

### Выборка по нескольким условиям  
*Все служащие 10-го отдела, служащие получившие коммисионные и служащие 20-го отдела с зарплатой не более 2000*
<pre><code class="sql">
SELECT *
FROM emp
WHERE deptno = 10
      OR comm IS NOT NULL
      OR sal <= 2000 AND deptno = 20
...
 empno | ename  |    job    | mgr  |  hiredate  |   sal   |  comm   | deptno 
-------+--------+-----------+------+------------+---------+---------+--------
  7369 | SMITH  | CLERK     | 7902 | 1980-12-17 |  800.00 |         |     20
  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30
  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30
  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30
  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |         |     10
  7839 | KING   | PRESIDENT |      | 1981-11-17 | 5000.00 |         |     10
  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    0.00 |     30
  7876 | ADAMS  | CLERK     | 7788 | 1983-01-12 | 1100.00 |         |     20
  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |         |     10
(9 строк)
</code></pre>

### Выборка подмножества столбцов из таблицы (проекция)
<pre><code class="sql">
select ename, deptno, sal from emp;
...
 ename  | deptno |   sal   
--------+--------+---------
 SMITH  |     20 |  800.00
 ALLEN  |     30 | 1600.00
 WARD   |     30 | 1250.00
 JONES  |     20 | 2975.00
 MARTIN |     30 | 1250.00
 BLAKE  |     30 | 2850.00
 CLARK  |     10 | 2450.00
 SCOTT  |     20 | 3000.00
 KING   |     10 | 5000.00
 TURNER |     30 | 1500.00
 ADAMS  |     20 | 1100.00
 JAMES  |     30 |  950.00
 FORD   |     20 | 3000.00
 MILLER |     10 | 1300.00
(14 строк)
</code></pre>

### Задание столбцам значимые имена
<pre><code class="sql">
SELECT ename AS "Зарплата",
       comm AS "Коммисионные"
FROM emp;
...
 Зарплата | Коммисионные 
----------+--------------
 SMITH    |             
 ALLEN    |       300.00
 WARD     |       500.00
 JONES    |             
 MARTIN   |      1400.00
 BLAKE    |             
 CLARK    |             
 SCOTT    |             
 KING     |             
 TURNER   |         0.00
 ADAMS    |             
 JAMES    |             
 FORD     |             
 MILLER   |             
(14 строк)
</code></pre>

### Обращение к столбцу в WHERE по псевдониму

<pre><code class="sql">
SELECT * FROM (
    SELECT sal AS "Зарплата", comm AS "Коммисионные"
    FROM emp
) table1
WHERE "Зарплата" < 5000;
...
 Зарплата | Коммисионные 
----------+--------------
   800.00 |             
  1600.00 |       300.00
  1250.00 |       500.00
  2975.00 |             
  1250.00 |      1400.00
  2850.00 |             
  2450.00 |             
  3000.00 |             
  1500.00 |         0.00
  1100.00 |             
   950.00 |             
  3000.00 |             
  1300.00 |             
(13 строк)
</code></pre>

### Конкатенация значений столбцов
<pre><code class="sql">
SELECT ename || ' работает ' || job AS msg
FROM emp
WHERE deptno = 10;
...
           msg           
-------------------------
 CLARK работает MANAGER
 KING работает PRESIDENT
 MILLER работает CLERK
(3 строки)
</code></pre>

Оператор - `||` сокращенная запись функции CONCAT


### Использование условной логики в выражении `SELECT`  

<i>Вывести для служащих получающих зп $2000 или меньше - статус 'Низкооплачиваемый', для служащих получающих $4000 и более - 'Высокооплачиваемый', для остальных - 'OK'</i>
<pre><code class="sql">
SELECT ename AS "Имя",
       sal AS "Зарплата",
       CASE
           WHEN sal <= 2000 THEN 'Низкооплачиваемый'
           WHEN sal >= 4000 THEN 'Высокооплачиваемый'
           ELSE 'OK'
       END AS "Статус"
FROM emp
...
  Имя   | Зарплата |       Статус       
--------+----------+--------------------
 SMITH  |   800.00 | Низкооплачиваемый
 ALLEN  |  1600.00 | Низкооплачиваемый
 WARD   |  1250.00 | Низкооплачиваемый
 JONES  |  2975.00 | OK
 MARTIN |  1250.00 | Низкооплачиваемый
 BLAKE  |  2850.00 | OK
 CLARK  |  2450.00 | OK
 SCOTT  |  3000.00 | OK
 KING   |  5000.00 | Высокооплачиваемый
 TURNER |  1500.00 | Низкооплачиваемый
 ADAMS  |  1100.00 | Низкооплачиваемый
 JAMES  |   950.00 | Низкооплачиваемый
 FORD   |  3000.00 | OK
 MILLER |  1300.00 | Низкооплачиваемый
(14 строк)
</code></pre>

### Ограничение числа возвращаемых строк
<pre><code class="sql">
SELECT *
FROM emp
LIMIT 5;
...
 empno | ename  |   job    | mgr  |  hiredate  |   sal   |  comm   | deptno 
-------+--------+----------+------+------------+---------+---------+--------
  7369 | SMITH  | CLERK    | 7902 | 1980-12-17 |  800.00 |         |     20
  7499 | ALLEN  | SALESMAN | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30
  7521 | WARD   | SALESMAN | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30
  7566 | JONES  | MANAGER  | 7839 | 1981-04-02 | 2975.00 |         |     20
  7654 | MARTIN | SALESMAN | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30
(5 строк)
</code></pre>

### Возвращать n случайных записей таблицы
<pre><code class="sql">
SELECT * FROM emp
ORDER BY random()
LIMIT 5;
</code></pre>


### Поиск NULL значений
<pre><code class="sql">
SELECT *
FROM emp
WHERE comm IS NULL;
...
 empno | ename  |    job    | mgr  |  hiredate  |   sal   | comm | deptno 
-------+--------+-----------+------+------------+---------+------+--------
  7369 | SMITH  | CLERK     | 7902 | 1980-12-17 |  800.00 |      |     20
  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |      |     20
  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |      |     30
  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |      |     10
  7788 | SCOTT  | ANALYST   | 7566 | 1982-12-09 | 3000.00 |      |     20
  7839 | KING   | PRESIDENT |      | 1981-11-17 | 5000.00 |      |     10
  7876 | ADAMS  | CLERK     | 7788 | 1983-01-12 | 1100.00 |      |     20
  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |      |     30
  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |      |     20
  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |      |     10
(10 строк)
</code></pre>

### Преобразование NULL значений в не-NULL `COALESCE`
<pre><code class="sql">
SELECT *, COALESCE(comm, 0)
FROM emp;
 empno | ename  |    job    | mgr  |  hiredate  |   sal   |  comm   | deptno | coalesce 
-------+--------+-----------+------+------------+---------+---------+--------+----------
  7369 | SMITH  | CLERK     | 7902 | 1980-12-17 |  800.00 |         |     20 |        0
  7499 | ALLEN  | SALESMAN  | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30 |   300.00
  7521 | WARD   | SALESMAN  | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30 |   500.00
  7566 | JONES  | MANAGER   | 7839 | 1981-04-02 | 2975.00 |         |     20 |        0
  7654 | MARTIN | SALESMAN  | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30 |  1400.00
  7698 | BLAKE  | MANAGER   | 7839 | 1981-05-01 | 2850.00 |         |     30 |        0
  7782 | CLARK  | MANAGER   | 7839 | 1981-06-09 | 2450.00 |         |     10 |        0
  7788 | SCOTT  | ANALYST   | 7566 | 1982-12-09 | 3000.00 |         |     20 |        0
  7839 | KING   | PRESIDENT |      | 1981-11-17 | 5000.00 |         |     10 |        0
  7844 | TURNER | SALESMAN  | 7698 | 1981-09-08 | 1500.00 |    0.00 |     30 |     0.00
  7876 | ADAMS  | CLERK     | 7788 | 1983-01-12 | 1100.00 |         |     20 |        0
  7900 | JAMES  | CLERK     | 7698 | 1981-12-03 |  950.00 |         |     30 |        0
  7902 | FORD   | ANALYST   | 7566 | 1981-12-03 | 3000.00 |         |     20 |        0
  7934 | MILLER | CLERK     | 7782 | 1982-01-23 | 1300.00 |         |     10 |        0
(14 строк)
</code></pre>

Функция `COALESCE` - возвращает первое не NULL значение из списка параметров. Если все NULL то возвращает последнее.


### Поиск по шаблону `LIKE`
<i>Из служащих отделов 10 и 20 требуется выбрать только тех, в имени
которых встречается буква «I» или чье название должности заканчивается на «ER»:</i>

<pre><code class="sql">
SELECT ename, job
FROM emp
WHERE deptno IN (10, 20)
    AND (ename LIKE '%I%' OR job LIKE '%ER');
...
 ename  |    job    
--------+-----------
 SMITH  | CLERK
 JONES  | MANAGER
 CLARK  | MANAGER
 KING   | PRESIDENT
 MILLER | CLERK
(5 строк)
</code></pre>

# Глава 2. Сортировка результатов запроса

<i>
Требуется представить имена, должности и заработные платы служащих 10-го отдела и упорядочить их соответственно заработным платам (от наименьшей к наибольшей)
</i>

<pre><code class="sql">
SELECT ename, job, sal FROM emp
WHERE deptno = 10
ORDER BY sal ASC
...
 ename  |    job    |   sal   
--------+-----------+---------
 MILLER | CLERK     | 1300.00
 CLARK  | MANAGER   | 2450.00
 KING   | PRESIDENT | 5000.00
(3 строки)
</code></pre>

### Сортировка по несольким полям

<i>Требуется сортировать строки таблицы EMP сначала по столбцу DEPTNO по возрастанию, а затем по заработным платам по убыванию.</i>
<pre><code class="sql">
SELECT empno, deptno, sal, ename, job FROM emp
ORDER BY deptno ASC, sal DESC;
...
 empno | deptno |   sal   | ename  |    job    
-------+--------+---------+--------+-----------
  7839 |     10 | 5000.00 | KING   | PRESIDENT
  7782 |     10 | 2450.00 | CLARK  | MANAGER
  7934 |     10 | 1300.00 | MILLER | CLERK
  7788 |     20 | 3000.00 | SCOTT  | ANALYST
  7902 |     20 | 3000.00 | FORD   | ANALYST
  7566 |     20 | 2975.00 | JONES  | MANAGER
  7876 |     20 | 1100.00 | ADAMS  | CLERK
  7369 |     20 |  800.00 | SMITH  | CLERK
  7698 |     30 | 2850.00 | BLAKE  | MANAGER
  7499 |     30 | 1600.00 | ALLEN  | SALESMAN
  7844 |     30 | 1500.00 | TURNER | SALESMAN
  7521 |     30 | 1250.00 | WARD   | SALESMAN
  7654 |     30 | 1250.00 | MARTIN | SALESMAN
  7900 |     30 |  950.00 | JAMES  | CLERK
(14 строк)
</code></pre>

### Сортировка по подстрокам
<i>Имена и должности служащих, возвращенные из таблицы EMP, должны быть упорядочены по последним двум символам поля должности.</i>
<pre><code class="sql">
SELECT ename,
       job,
       length(job) - 1,
       substr(job, length(job) - 1)
FROM emp
ORDER BY substr(job, length(job) - 1);
...
 ename  |    job    | ?column? | substr 
--------+-----------+----------+--------
 TURNER | SALESMAN  |        7 | AN
 ALLEN  | SALESMAN  |        7 | AN
 WARD   | SALESMAN  |        7 | AN
 MARTIN | SALESMAN  |        7 | AN
 BLAKE  | MANAGER   |        6 | ER
 CLARK  | MANAGER   |        6 | ER
 JONES  | MANAGER   |        6 | ER
 KING   | PRESIDENT |        8 | NT
 SMITH  | CLERK     |        4 | RK
 JAMES  | CLERK     |        4 | RK
 MILLER | CLERK     |        4 | RK
 ADAMS  | CLERK     |        4 | RK
 SCOTT  | ANALYST   |        6 | ST
 FORD   | ANALYST   |        6 | ST
(14 строк)
</code></pre>

### Сортировка смешанных буквенно-цифровых данных

исходные данные
<pre><code class="sql">
CREATE VIEW v_emp AS
SELECT ename || ' ' || deptno AS DATA
FROM emp;

SELECT * FROM v_emp;
...
   data    
-----------
 SMITH 20
 ALLEN 30
 WARD 30
 JONES 20
 MARTIN 30
 BLAKE 30
 CLARK 10
 SCOTT 20
 KING 10
 TURNER 30
 ADAMS 20
 JAMES 30
 FORD 20
 MILLER 10
(14 строк)
</code></pre>

<i>Сортировать по deptno</i>
<pre><code class="sql">
SELECT *,
       -- перевести в строке data все цифры на знак #
       translate(data, '0123456789', '##########'),
       -- заменить знак # на пустоту
       replace( translate(data, '0123456789', '##########'), '#', ''),
       -- заменить полученные строки на пустоту
       replace(data, replace( translate(data, '0123456789', '##########'), '#', ''), '')
FROM v_emp
order by replace(data, replace( translate(data, '0123456789', '##########'), '#', ''), '');
...
   data    | translate | replace | replace 
-----------+-----------+---------+---------
 MILLER 10 | MILLER ## | MILLER  | 10
 CLARK 10  | CLARK ##  | CLARK   | 10
 KING 10   | KING ##   | KING    | 10
 SCOTT 20  | SCOTT ##  | SCOTT   | 20
 JONES 20  | JONES ##  | JONES   | 20
 SMITH 20  | SMITH ##  | SMITH   | 20
 ADAMS 20  | ADAMS ##  | ADAMS   | 20
 FORD 20   | FORD ##   | FORD    | 20
 WARD 30   | WARD ##   | WARD    | 30
 TURNER 30 | TURNER ## | TURNER  | 30
 ALLEN 30  | ALLEN ##  | ALLEN   | 30
 BLAKE 30  | BLAKE ##  | BLAKE   | 30
 MARTIN 30 | MARTIN ## | MARTIN  | 30
 JAMES 30  | JAMES ##  | JAMES   | 30
(14 строк)
</code></pre>

<i>Сортировать по ename</i>

<pre><code class="sql">
select *,
       translate(data, '0123456789', '##########'),
       replace( translate(data, '0123456789', '##########'), '#', '')
from v_emp
order by replace( translate(data, '0123456789', '##########'), '#', '')
...
   data    | translate | replace 
-----------+-----------+---------
 ADAMS 20  | ADAMS ##  | ADAMS 
 ALLEN 30  | ALLEN ##  | ALLEN 
 BLAKE 30  | BLAKE ##  | BLAKE 
 CLARK 10  | CLARK ##  | CLARK 
 FORD 20   | FORD ##   | FORD 
 JAMES 30  | JAMES ##  | JAMES 
 JONES 20  | JONES ##  | JONES 
 KING 10   | KING ##   | KING 
 MARTIN 30 | MARTIN ## | MARTIN 
 MILLER 10 | MILLER ## | MILLER 
 SCOTT 20  | SCOTT ##  | SCOTT 
 SMITH 20  | SMITH ##  | SMITH 
 TURNER 30 | TURNER ## | TURNER 
 WARD 30   | WARD ##   | WARD 
(14 строк)
</code></pre>

<div class="sql">
    <a href="http://www.postgresqltutorial.com/postgresql-translate/">postgresql-translate</a>
    <p><b>translate(string text, from text, to text)</b> - Заменяет символы в string, найденные в наборе from, на соответствующие символы в множестве to. Если строка from длиннее to, найденные в исходной строке лишние символы from удаляются.</p>
    <pre><code class="sql">
SELECT TRANSLATE('12345', '134', 'ax')
...
 translate 
-----------
 a2x5
(1 строка)
    </code></pre>
    <p>
        <ul>
            <li>Символ '1' заменяется на 'a', '3' на 'x'</li>
            <li>Т.к. строка '134' больше чем 'ax', то из строки '12345' символ '4' просто удаляется</li>
        </ul>
    </p>
    <p>заменяет символ `,` на ';'</p>
<pre><code class="sql">
SELECT TRANSLATE('apple,orange,banana', ',', ';');
...
      translate      
---------------------
 apple;orange;banana
(1 строка)
</code></pre>
</div>


### Обработка значений NULL при сортировке

<i>определенные значения comm сортируются по возврастанию, после них располагаются все строки с неопределенными значениями</i>
<pre><code class="sql">
SELECT ename, sal, comm FROM (
    SELECT ename, sal, comm, (
            CASE
                 WHEN comm IS NULL THEN 0
                 ELSE 1
            END
        ) AS is_null
    FROM emp
) x
ORDER BY is_null DESC, comm
...
 ename  |   sal   |  comm   
--------+---------+---------
 TURNER | 1500.00 |    0.00
 ALLEN  | 1600.00 |  300.00
 WARD   | 1250.00 |  500.00
 MARTIN | 1250.00 | 1400.00
 SCOTT  | 3000.00 |        
 KING   | 5000.00 |        
 ADAMS  | 1100.00 |        
 JAMES  |  950.00 |        
 FORD   | 3000.00 |        
 SMITH  |  800.00 |        
 MILLER | 1300.00 |        
 JONES  | 2975.00 |        
 BLAKE  | 2850.00 |        
 CLARK  | 2450.00 |        
(14 строк)
</code></pre>


### Сортировка через `CASE`

<i>
Eсли значение JOB - "SALESMAN", сортировка должна осуществляться по столбцу COMM; в противном случае сортируем по SAL
</i>
<pre><code class="sql">
SELECT ename, sal, job, comm
FROM emp
ORDER BY
CASE
  WHEN job = 'SALESMAN' THEN comm
  ELSE sal
END;
...
 ename  |   sal   |    job    |  comm   
--------+---------+-----------+---------
 TURNER | 1500.00 | SALESMAN  |    0.00
 ALLEN  | 1600.00 | SALESMAN  |  300.00
 WARD   | 1250.00 | SALESMAN  |  500.00
 SMITH  |  800.00 | CLERK     |        
 JAMES  |  950.00 | CLERK     |        
 ADAMS  | 1100.00 | CLERK     |        
 MILLER | 1300.00 | CLERK     |        
 MARTIN | 1250.00 | SALESMAN  | 1400.00
 CLARK  | 2450.00 | MANAGER   |        
 BLAKE  | 2850.00 | MANAGER   |        
 JONES  | 2975.00 | MANAGER   |        
 SCOTT  | 3000.00 | ANALYST   |        
 FORD   | 3000.00 | ANALYST   |        
 KING   | 5000.00 | PRESIDENT |        
(14 rows)
</code></pre>


# Глава 3. Работа с несколькими таблицами

<i>
вывести на экран имена и номер отдела служащих 10!го отдела, хранящиеся в таблице EMP, а также названия и номера всех отделов из таблицы DEPT
</i>

<pre><code class="sql">
SELECT ename, deptno
FROM emp
WHERE deptno = 10

UNION ALL

SELECT '-------', NULL

UNION ALL

SELECT dname, deptno
FROM dept;

   ename    | deptno 
------------+--------
 CLARK      |     10
 KING       |     10
 MILLER     |     10
 -------    |       
 ACCOUNTING |     10
 RESEARCH   |     20
 SALES      |     30
 OPERATIONS |     40
(8 rows)
</code></pre>

### Объединение строк

<i>
Вывести имена всех служащих 10-го отдела, а так же местонахождение отдела для каждого служащего
</i>

<pre><code class="sql">
SELECT ename, loc
FROM emp, dept
WHERE emp.deptno = dept.deptno AND emp.deptno = 10;
...
 ename  |   loc    
--------+----------
 CLARK  | NEW YORK
 KING   | NEW YORK
 MILLER | NEW YORK
(3 rows)
</code></pre>

### Поиск одинаковых сток в двух таблицах

<pre><code class="sql">
CREATE VIEW v_emp AS
SELECT ename, job, sal FROM emp
WHERE job = 'CLERK'
...
 ename  |  job  |   sal   
--------+-------+---------
 SMITH  | CLERK |  800.00
 ADAMS  | CLERK | 1100.00
 JAMES  | CLERK |  950.00
 MILLER | CLERK | 1300.00
(4 rows)

...

SELECT * FROM emp
WHERE (ename, job, sal) IN (
  SELECT ename, job, sal FROM emp
  INTERSECT
  SELECT ename,job, sal FROM v_emp
);
...

 empno | ename  |  job  | mgr  |  hiredate  |   sal   | comm | deptno 
-------+--------+-------+------+------------+---------+------+--------
  7369 | SMITH  | CLERK | 7902 | 1980-12-17 |  800.00 |      |     20
  7876 | ADAMS  | CLERK | 7788 | 1983-01-12 | 1100.00 |      |     20
  7900 | JAMES  | CLERK | 7698 | 1981-12-03 |  950.00 |      |     30
  7934 | MILLER | CLERK | 7782 | 1982-01-23 | 1300.00 |      |     10
(4 rows)


</code></pre>

### Извлечение из одной таблицы значений, которых нет в другой таблице

<i>Необходимо выяснить, каких отделов (если таковые имеются), представленных в таблице DEPT, нет в таблице EMP. В примере базы данных в таблице DEPT есть DEPTNO 40, которого нет в EMP; таким образом, результирующее множество должно быть следующим</i>

<pre><code class="sql">
DEPTNO
-------------
40
</code></pre>

<pre><code class="sql">
select deptno from dept
where deptno not in ( select deptno from emp )
...
 deptno 
--------
     40
(1 строка)
</code></pre>

<pre><code class="sql">
select deptno from dept
except
select deptno from emp
...
 deptno 
--------
     40
(1 строка)
</code></pre>

### Независимое добавление объединений в запрос `LEFT JOIN`

<i>Необходимо получить имена всех служащих, местонахождение отделов, в которых они работают, и даты выдачи им премий. Для
выполнения этой задачи существует таблица EMP_BONUS со следующими данными:</i>

<pre><code class="sql">
create table emp_bonus (
  empno int,
  received date,
  type int
);

insert into emp_bonus (empno, received, type) values
(7369, '2019-10-01', 1),
(7900, '2019-10-01', 2),
(7788, '2019-10-01', 3);
</code></pre>

<pre><code class="sql">
table emp_bonus;
...
 empno |  received  | type 
-------+------------+------
  7369 | 2019-10-01 |    1
  7900 | 2019-10-01 |    2
  7788 | 2019-10-01 |    3
(3 строки)
</code></pre>

Исходный запрос:
<pre><code class="sql">
SELECT e.empno, e.ename, d.loc
FROM emp e, dept d
WHERE e.deptno = d.deptno
...
 empno | ename  |   loc    
-------+--------+----------
  7934 | MILLER | NEW YORK
  7839 | KING   | NEW YORK
  7782 | CLARK  | NEW YORK
  7902 | FORD   | DALLAS
  7876 | ADAMS  | DALLAS
  7788 | SCOTT  | DALLAS
  7566 | JONES  | DALLAS
  7369 | SMITH  | DALLAS
  7900 | JAMES  | CHICAGO
  7844 | TURNER | CHICAGO
  7698 | BLAKE  | CHICAGO
  7654 | MARTIN | CHICAGO
  7521 | WARD   | CHICAGO
  7499 | ALLEN  | CHICAGO
(14 строк)
</code></pre>

<pre><code class="sql">
select e.empno, e.ename, d.loc, b.received
from emp e
join dept d on d.deptno = e.deptno
left join emp_bonus b on b.empno = e.empno
order by 3
...
 empno | ename  |   loc    |  received  
-------+--------+----------+------------
  7900 | JAMES  | CHICAGO  | 2019-10-01
  7521 | WARD   | CHICAGO  | 
  7844 | TURNER | CHICAGO  | 
  7499 | ALLEN  | CHICAGO  | 
  7654 | MARTIN | CHICAGO  | 
  7698 | BLAKE  | CHICAGO  | 
  7369 | SMITH  | DALLAS   | 2019-10-01
  7566 | JONES  | DALLAS   | 
  7788 | SCOTT  | DALLAS   | 2019-10-01
  7876 | ADAMS  | DALLAS   | 
  7902 | FORD   | DALLAS   | 
  7782 | CLARK  | NEW YORK | 
  7839 | KING   | NEW YORK | 
  7934 | MILLER | NEW YORK | 
(14 строк)
</code></pre>


### Выявление одинаковых данных в двух таблицах

<i>Требуется выяснить, имеются ли в двух таблицах (или представлениях) одинаковые данные</i>
<pre><code class="sql">
create view V as
select * from emp where deptno != 10
union all
select * from emp where ename = 'WARD'
</code></pre>

<pre><code class="sql">
table V;
...
 empno | ename  |   job    | mgr  |  hiredate  |   sal   |  comm   | deptno 
-------+--------+----------+------+------------+---------+---------+--------
  7369 | SMITH  | CLERK    | 7902 | 1980-12-17 |  800.00 |         |     20
  7499 | ALLEN  | SALESMAN | 7698 | 1981-02-20 | 1600.00 |  300.00 |     30
  7521 | WARD   | SALESMAN | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30
  7566 | JONES  | MANAGER  | 7839 | 1981-04-02 | 2975.00 |         |     20
  7654 | MARTIN | SALESMAN | 7698 | 1981-09-28 | 1250.00 | 1400.00 |     30
  7698 | BLAKE  | MANAGER  | 7839 | 1981-05-01 | 2850.00 |         |     30
  7788 | SCOTT  | ANALYST  | 7566 | 1982-12-09 | 3000.00 |         |     20
  7844 | TURNER | SALESMAN | 7698 | 1981-09-08 | 1500.00 |    0.00 |     30
  7876 | ADAMS  | CLERK    | 7788 | 1983-01-12 | 1100.00 |         |     20
  7900 | JAMES  | CLERK    | 7698 | 1981-12-03 |  950.00 |         |     30
  7902 | FORD   | ANALYST  | 7566 | 1981-12-03 | 3000.00 |         |     20
  7521 | WARD   | SALESMAN | 7698 | 1981-02-22 | 1250.00 |  500.00 |     30
(12 строк)
</code></pre>

<i>Должно быть получено следующее результирующее множество:</i>
<pre><code class="sql">

</code></pre>

<pre><code class="sql">
explain
select empno, ename, job, mgr, hiredate, sal, comm, deptno, count(*) as cnt from V
group by empno, ename, job, mgr, hiredate, sal, comm, deptno
except
select *, count(*) as cnt from emp
group by empno
</code></pre>

### Выборка...

<i>Требуется возвратить имя служащего 10-го отдела и местонахождение отдела</i>

<pre><code class="sql">
select e.ename, d.loc
from emp as e
join dept as d on d.deptno = e.deptno
where e.deptno = 10
...
 ename  |   loc    
--------+----------
 CLARK  | NEW YORK
 KING   | NEW YORK
 MILLER | NEW YORK
(3 строки)
</code></pre>

<pre><code class="sql">
select e.ename, d.loc
from emp as e, dept as d
where e.deptno = 10 and e.deptno = d.deptno
...
 ename  |   loc    
--------+----------
 CLARK  | NEW YORK
 KING   | NEW YORK
 MILLER | NEW YORK
(3 строки)
</code></pre>

<pre><code class="sql">
explain analyse
select e.ename, d.loc
from emp as e
join dept as d on d.deptno = e.deptno
where e.deptno = 10
...
                                               QUERY PLAN                                               
--------------------------------------------------------------------------------------------------------
 Nested Loop  (cost=0.00..18.96 rows=3 width=82) (actual time=0.029..0.039 rows=3 loops=1)
   ->  Seq Scan on emp e  (cost=0.00..1.18 rows=1 width=50) (actual time=0.015..0.017 rows=3 loops=1)
         Filter: (deptno = '10'::numeric)
         Rows Removed by Filter: 11
   ->  Seq Scan on dept d  (cost=0.00..17.75 rows=3 width=56) (actual time=0.005..0.006 rows=1 loops=3)
         Filter: (deptno = '10'::numeric)
         Rows Removed by Filter: 3
 Planning time: 0.405 ms
 Execution time: 0.073 ms
(9 строк)


explain analyse
select e.ename, d.loc
from emp as e, dept as d
where e.deptno = 10 and e.deptno = d.deptno
...
                                               QUERY PLAN                                               
--------------------------------------------------------------------------------------------------------
 Nested Loop  (cost=0.00..18.96 rows=3 width=82) (actual time=0.033..0.044 rows=3 loops=1)
   ->  Seq Scan on emp e  (cost=0.00..1.18 rows=1 width=50) (actual time=0.016..0.018 rows=3 loops=1)
         Filter: (deptno = '10'::numeric)
         Rows Removed by Filter: 11
   ->  Seq Scan on dept d  (cost=0.00..17.75 rows=3 width=56) (actual time=0.006..0.007 rows=1 loops=3)
         Filter: (deptno = '10'::numeric)
         Rows Removed by Filter: 3
 Planning time: 0.401 ms
 Execution time: 0.099 ms
(9 строк)
</code></pre>

### Объединение при агрегатных функций

<i>Найти сумму заработных плат служащих 10-го отдела, а также сумму их премий</i>

<pre><code class="sql">
insert into emp_bonus values
( 7934, '2019-12-01', 1),
( 7934, '2019-12-11', 2),
( 7839, '2019-12-21', 3),
( 7782, '2019-12-23', 1);
table emp_bonus;
...
 empno |  received  | type 
-------+------------+------
  7934 | 2019-12-01 |    1
  7934 | 2019-12-11 |    2
  7839 | 2019-12-21 |    3
  7782 | 2019-12-23 |    1
(4 строки)
</code></pre>

Вариант 1:
<pre><code class="sql">
select deptno, sum(sal), sum(bonus)
from (
  select e.empno, e.ename, e.sal, e.deptno,
  sum( e.sal * ( case when eb.type = 1 then 0.1 when eb.type = 2 then 0.2 when eb.type = 3 then 0.3 else 0 end ) ) as bonus 
  from emp as e
  left join emp_bonus eb on eb.empno = e.empno
  where e.deptno = 10
  group by e.empno, e.ename, e.sal, e.deptno
) as x
group by deptno
...
 deptno |   sum   |   sum    
--------+---------+----------
     10 | 8750.00 | 2135.000
(1 строка)
</code></pre>

Вариант 2
<pre><code class="sql">
select d.deptno, d.total_sal,
sum( e.sal * ( case when eb.type = 1 then 0.1 when eb.type = 2 then 0.2 when eb.type = 3 then 0.3 else 0 end ) ) as bonus
from (
  select deptno, sum(sal) as total_sal
  from emp 
  where deptno = 10
  group by deptno
) as d, emp as e
join emp_bonus as eb on eb.empno = e.empno
group by d.deptno, d.total_sal
...
 deptno | total_sal |  bonus   
--------+-----------+----------
     10 |   8750.00 | 2135.000
(1 строка)
</code></pre>
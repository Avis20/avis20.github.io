---
title: "Заметки по книге - SQL - Сборник рецептов"
tags: [book, database]
reference:
  - title:
    link:
---

* TOC 
{:toc}

emp - служащие
* deptno - номер отдела
* comm - коммисионные
* sal - зарплата

# Глава 1. Извлечение записей (SELECT)

Выборка всех данных
<pre><code class="perl">
SELECT * FROM emp;
</code></pre>

Выборка определенных строк
<pre><code class="perl">
SELECT * FROM emp
WHERE deptno = 10
</code></pre>

Выборка по нескольким условиям  
*Все служащие 10-го отдела, служащие получившие коммисионные и служащие 20-го отдела с зарплатой не более 2000*
<pre><code class="perl">
SELECT *
FROM emp
WHERE deptno = 10
      OR comm IS NOT NULL
      OR sal <= 2000 AND deptno = 20
</code></pre>
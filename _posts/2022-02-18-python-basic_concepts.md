---
title: Структуры данных в Python
tags: [python]
reference:
  -
    link:
    title:

---

* TOC 
{:toc}

# Глава 4. Структуры данных

Created: February 17, 2022 11:46 PM

## Типы последовательностей

- контейнерные последовательности
    - list, tuple, collections.deque - можно хранить эл. разных типов
    - Хранятся ссылки на объекты любого типа
- Плоские последовательности
    - str, bytes, bytearray, memoryview, array.array - можно хранить эл. только одного типа
    - Хранятся сами значения

**По признаку неизменяемости**

- *Изменяемые последовательности*
    - list, bytearray, array.array, collections.deque и memoryview
- *Не изменяемые последовательности*
    - tuple, str и bytes
    

## Списковое включение и генераторные выражения

- Списковое включение - listcomp
- генераторные выражения - genexp
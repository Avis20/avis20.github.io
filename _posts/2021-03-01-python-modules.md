---
title: Модули по работе с Python
tags: [python]
reference:
  -
    link:
    title:

---

* TOC 
{:toc}

# bottle

Created: Feb 16, 2021 6:29 PM
tag: веб
Описание: http веб-сервер

## Запуск сервера: run

Параметры:

- host [str] -
- port [int] -
- debug [bool] -
- reloaded [bool] -

## static_file

# calendar

Created: Feb 22, 2021 1:39 PM
tag: время

## Узнать високосный ли год: isleap

<pre><code class="python">
import calendar

print(calendar.isleap(2021))
# False

print(calendar.isleap(2020))
# True
</code></pre>

# collections

Created: Jan 31, 2021 5:07 PM

- namedtuple

# core

Created: Feb 23, 2021 4:25 PM
Описание: Модуль с базовыми функциями

## Напечатать значение на экран: print()

<pre><code class="python">
print(values, ..., sep=' ', end='\n', file=sys.output, flush=False)
</code></pre>



Входящие параметры

- values - Список параметров которые нужно вызвать. У объектов вызывает метод __str__
- sep - разделитель параметров. default = пробел
- end - последний символ при печати. default = перенос строки
- file - файловый дескриптор куда выводится текст. default = консоль
- flush - ?

Возвращает - None

Пример

<pre><code class="python">
print('hello, world')
</code></pre>



<pre><code class="python">
$ python3 ./script.py
hello, world
</code></pre>



# Функции работы с файлами

## Открыть файл: open()

<pre><code class="python">
fileobj = open(filename, mode)
</code></pre>



- fileobj - объект файла (файлхендлер?)
- filename - путь до файла
- mode - тип файла и действие над файлом. Первая буква - операция
    - r - чтение. По умолчанию. Если файла нет, будет исключение
    - w - запись. Если файл не существует, то будет создан. Если существует - перезаписан
    - x - запись, но только если файл не существует
    - a - запись в конец если существует
- Вторая буква - тип файла
    - t - текстовый файл
    - b - бинарный

<pre><code class="python">
file = open('text.txt', 'rt')
</code></pre>



## Записать в файл: write()

<pre><code class="python">

</code></pre>



Пример

<pre><code class="python">
text = '''\
Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.\
'''

file = open('text.txt', 'wt')
file.write(text)
</code></pre>



## write vs print

Записать в файл можно и через обычный print, но у print есть 2 преимущества

1. Не нужно в конце текста ставить перенос строки
2. Не нужно добавлять разделитель пробел если надо записать какой-то список

Пример

<pre><code class="python">
just_list = ['test1', 'test2']

file_print = open('print.txt', 'wt')
print(*just_list, file=file_print)

file_write = open('write.txt', 'wt')
file_write.write(','.join(just_list))
</code></pre>



<pre><code class="python">
$ python3 ./script.py && cat ./print.txt && cat ./write.txt 
test1 test2
test1,test2
</code></pre>



## Закрыть файл: close()

# map()

- Синтаксис

<pre><code class="python">
result = map(func, list)
</code></pre>



- func - функция которая вызывается для каждого эл. списка. Обязательный
- list - итерируемый объект. Обязательный, может быть несколько
- Если несколько list, то итерируется до самого короткого

- Примеры

<pre><code class="python">
# map с использованием lambda
numbers = [2, 3, 6, 6, 5]
map_numbers = list(map(lambda x: x * 2, numbers))

print(numbers)
print(map_numbers)
# [2, 3, 6, 6, 5]
# [4, 6, 12, 12, 10]

aquarium_creatures = [
    {"name": "sammy", "species": "shark", "tank number": 11, "type": "fish"},
    {"name": "ashley", "species": "crab", "tank number": 25, "type": "pythonfish"},
    {"name": "jo", "species": "guppy", "tank number": 18, "type": "fish"},
    {"name": "jackie", "species": "lobster", "tank number": 21, "type": "pythonfish"},
    {"name": "charlie", "species": "clownfish", "tank number": 12, "type": "fish"},
    {"name": "olly", "species": "green turtle", "tank number": 34, "type": "turtle"}
]

# map с пользовательской функцией

def assign_to_tank(aquarium_creatures, new_tank_number):
    def apply(x):
        x["tank number"] = new_tank_number
        return x
    return map(apply, aquarium_creatures)

pprint(aquarium_creatures)
assign = assign_to_tank(aquarium_creatures, 42)
pprint(list(assign))

# map со встроенными функциями

numbers = [1, 2, 3, 4]
powers = [3, 4, 6, 1]

power_numbers = map(pow, numbers, powers)
print(list(power_numbers))
# [1, 16, 729, 4]
</code></pre>



- Ссылки
    - Использование функции map в Python - [https://www.digitalocean.com/community/tutorials/how-to-use-the-python-map-function-ru

    #реализация-определяемой-пользователем-функции](https://www.digitalocean.com/community/tutorials/how-to-use-the-python-map-function-ru

    #%D1%80%D0%B5%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%BE%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D1%8F%D0%B5%D0%BC%D0%BE%D0%B9-%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D0%B5%D0%BC-%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B8)# datetime

Created: Feb 22, 2021 1:39 PM
tag: время
Описание: Модуль по работе с датой и временем

# Дата

## Создать дату: date

<pre><code class="python">
from datetime import date

today = date(2021, 2, 22)

print(today)
# 2021-02-22
</code></pre>



## Обращение к дате по отдельности: year, month, day

<pre><code class="python">
print("day =", today.day, "month =", today.month, "year =", today.year)
# day = 22 month = 2 year = 2021
</code></pre>



## Текущая дата: date.today()

<pre><code class="python">
from datetime import date

now = date.today()

print(now)
# 2021-02-22
</code></pre>



## Добавить дельту к дате: timedelta()

<pre><code class="python">
from datetime import date, timedelta

now = date.today()

print(now)
# 2021-02-22

one_day = timedelta(days=1)

print(now + one_day)
# 2021-02-23

print(now + one_day * 7)
# 2021-03-01
</code></pre>



# Время

## Инициализация времени: time

<pre><code class="python">
from datetime import time

now = time(13, 53)

print(now)
# 13:53:00

print("hour =", now.hour, "minute =", now.minute, "second =", now.second)
# hours = 13 minute = 53 seconds = 0
</code></pre>



# Инициализация даты и времени вместе: datetime()

<pre><code class="python">
from datetime import datetime

now = datetime.now()

print(now)
# 2021-02-22 13:57:24.470408

print("day =", now.day, "month =", now.month, "year =", now.year,
      "hour =", now.hour, "minute =", now.minute, "second =", now.second)
# day = 22 month = 2 year = 2021 hour = 14 minute = 3 second = 56
</code></pre>



## Объединить объекты date и time в datetime: combine()

<pre><code class="python">
from datetime import date, time, datetime

date = date.today()
time = time(12)

datetime = datetime.combine(date, time)

print(datetime)
# 2021-02-22 12:00:00
</code></pre>

# flask

Created: Feb 16, 2021 6:34 PM
tag: веб
Описание: http веб сервер. Чуть лучше bottle :)

## Установка

<pre><code class="python">
pip3 install flask
</code></pre>

# itertools

Created: Jan 31, 2021 5:07 PM

## Объединить объекты разных типов в один итерабельный список: `chain`

<pre><code class="python">
import itertools

for item in itertools.chain(['a', 'b', True], ('1', '2'), {'alarm', 'test'}, {'test1': 1, 'test2': 2}):
    print(item)
</code></pre>



<pre><code class="python">
$ python3 ./test.py 
a
b
True
1
2
alarm
test
test1
test2
</code></pre>



## Создать бесконечный список: `cycle`

<pre><code class="python">
import itertools

for item in itertools.cycle(['a', 'b', True]):
    print(item)
</code></pre>



<pre><code class="python">
a
b
True
...
...
</code></pre>



## Сложить и запомнить значение: `accumulate`

Функция accumulate вызывается для каждого эл в списке и складывает (по умолчанию) с ее текущим состоянием

<pre><code class="python">
import itertools

numbers = [1,2,3,4]

for item in itertools.accumulate(numbers):
    print(item)
</code></pre>



<pre><code class="python">
$ python3 ./test.py 
1
3
6
10
</code></pre>



Можно переопределить сложение

<pre><code class="python">
#!/usr/bin/env python3

import itertools

def multiply(a, b):
    result = a * b
    print("Элемент a =", a, "Элемент b =", b, "Результат a * b=",result)
    return result

numbers = [1,2,3,4]

for item in itertools.accumulate(numbers, multiply):
    print(item)
</code></pre>



<pre><code class="python">
$ python3 ./test.py 
1
Элемент a = 1 Элемент b = 2 Результат a * b= 2
2
Элемент a = 2 Элемент b = 3 Результат a * b= 6
6
Элемент a = 6 Элемент b = 4 Результат a * b= 24
24
</code></pre>

# os

Created: Feb 19, 2021 5:41 PM
Описание: Модуль для работы с ОС (Операционной Системой)

## Проверка существования файла (или директории): exists

<pre><code class="python">
import os

file_name = './text.txt'

with open(file_name, 'wt') as file:
    file.write('hello\n')

print("File exists? ", os.path.exists(file_name))
# File exists?  True

print("File exists? ", os.path.exists('alalala'))
# File exists?  False
</code></pre>



## Получить PID запущенного процесса: os.getpid()

<pre><code class="python">
import os
print(os.getpid())
</code></pre>



<pre><code class="python">
$ python3 ./test.py 
10755
$ python3 ./test.py 
10756
$ python3 ./test.py 
10763
$
</code></pre>



<pre><code class="python">
>>> import os
>>> os.getpid()
10846
>>> os.getpid()
10846
>>>
</code></pre>



- т.к. процесс еще жив, pid не меняется

## Получить путь до текущей рабочей диры: os.getcwd()

<pre><code class="python">
import os
print(os.getcwd())
</code></pre>



<pre><code class="python">
$ python3 ./test.py 
/home/avis/develop/learn/python/book-simple-python
</code></pre>



## Получить UID и GID (id юзера и id группы): getuid(), getgid()

<pre><code class="python">
>>> os.getuid()
1000
>>> os.getgid()
1000
>>>
</code></pre>

# pprint

Created: Jan 31, 2021 5:07 PM

# re

Created: Feb 4, 2021 7:51 PM
Описание: Модуль по работе с регулярными выражениями

- match
- findall
- search
- compile
- split
- sub

# redis

Created: Feb 14, 2021 4:13 PM
Описание: Модуль для работы с redis-ом

## Установка

<pre><code class="python">
pip install redis
</code></pre>



- Запуск сервиса и проверка

<pre><code class="python">
docker run --rm -d --name redis --net=host redis
</code></pre>



<pre><code class="python">
import redis

redis = redis.Redis(host='localhost', port=6379)
redis.set('test1', 1)
print(redis.get('test1'))
</code></pre>



<pre><code class="python">
b'1'
</code></pre>



## Строки

### Записать строку: `set`

<pre><code class="python">
bool = redis.set(key, value)
</code></pre>



<pre><code class="python">
print(redis.set('test1', 1))
</code></pre>



<pre><code class="python">
True
</code></pre>



### Получить строку из редиса: `get`

<pre><code class="python">
bytes = redis.get(key)
</code></pre>



<pre><code class="python">
print(redis.get('test1'))
</code></pre>



<pre><code class="python">
b'1'
</code></pre>

# shutil

Created: Feb 19, 2021 5:54 PM

## Копирование файла: shutil.copy

<pre><code class="python">
import os
import shutil

file_name = './text.txt'
new_file_name = file_name + 'new.txt'

with open(file_name, 'wt') as file:
    file.write('hello\n')

shutil.copy(file_name, new_file_name)
print(os.path.exists(new_file_name))
</code></pre>

# string

Created: Feb 4, 2021 8:14 PM

# subprocess

Created: Feb 19, 2021 6:18 PM
Описание: Работа с процессами

todo

- getoutput
- check_output()
- subprocess.getstatusoutput('date')
- subprocess.call('date')# time

Created: Feb 22, 2021 1:40 PM
tag: время

# unicodedata

Created: Feb 3, 2021 7:29 PM

# zmq

Created: Feb 23, 2021 4:25 PM
tag: веб
Описание: Фреймворк по работе с сетями через сокеты

## Режимы работы

- REQ (синхронный запрос)
- REP (синхронный ответ)
- DEALER (асинхронный запрос)
- ROUTER (асинхронный ответ)
- PUB (публикация)
- SUB (подписка)
- PUSH (разветвление на выходе)
- PULL (разветвление на входе)

## Ссылки

- дока - [https://zguide.zeromq.org/](https://zguide.zeromq.org/)
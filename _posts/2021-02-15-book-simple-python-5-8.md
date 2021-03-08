---
title: Заметки по книге "Простой python" [Глава 5-8]
tags: [book, python]
reference:
  -
    link:
    title:

---

* TOC 
{:toc}

# Глава 5. Py Boxes: модули, пакеты и программы

Created: Jan 31, 2021 10:09 AM

## Запуск файла

<pre><code class="python">
#!/usr/bin/env python3

print("Этот текст из скрипта")
</code></pre>

<pre><code class="python">
$ python3 hello.py 
Этот текст из скрипта
</code></pre>

## Передать аргументы скрипту

<pre><code class="python">
#!/usr/bin/env python3

import sys

print("Аргументы скрипта: ", sys.argv)
</code></pre>

<pre><code class="python">
$ python3 hello.py test=1 test2
Аргументы скрипта:  ['hello.py', 'test=1', 'test2']
</code></pre>

<pre><code class="python">
#!/usr/bin/env python3

import sys

print("Аргументы скрипта: ", sys.argv)

first_argv = sys.argv[1]
print("Первый аргумент: ", first_argv)
</code></pre>

<pre><code class="python">
$ python3 hello.py test
Аргументы скрипта:  ['hello.py', 'test']
Первый аргумент:  test
</code></pre>

Без аргументов упадет

<pre><code class="python">
$ python3 hello.py
Аргументы скрипта:  ['hello.py']
Traceback (most recent call last):
  File "hello.py", line 7, in &lt;module&gt;
    first_argv = sys.argv[1]
IndexError: list index out of range
</code></pre>

## Импорт модуля

Свой модуль 

<pre><code class="python">
$ cat ./weather.py 
#!/usr/bin/env python3

from random import choice

def get_desc():
    '''
    Вернуть рандомную погоду
    '''
    weather_list = ['rain', 'snow', 'sleet', 'fog', 'sun', 'who knows']
    return choice(weather_list)

</code></pre>

<pre><code class="python">
$ cat ./hello.py 
#!/usr/bin/env python3

import weather

today_weather = weather.get_desc();
print("Сегодня ", today_weather)
</code></pre>

<pre><code class="python">
$ python3 hello.py
Сегодня  who knows
$ python3 hello.py
Сегодня  rain
$ python3 hello.py
Сегодня  rain
$ python3 hello.py
Сегодня  snow
$ python3 hello.py
Сегодня  snow
</code></pre>

- `import ...` - импортирует весь модуль и нужно обращаться по имени модуля.название функции

<pre><code class="python">
import weather
weather.get_desc();
</code></pre>

- `from ... import ...` - импортирует только указанную функцию. Нужно обращаться по имени функции

<pre><code class="python">
>>> from random import choice
>>> test = [1,2,3]
>>> choice(test)
3
</code></pre>

<pre><code class="python">
>>> random.choice(test)
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in <module&gt;
NameError: name 'random' is not defined
>>>
</code></pre>

## Импорт модуля с алиасом: `as`

<pre><code class="python">
#!/usr/bin/env python3

import random as r
print(r.choice([1,2,3]))
</code></pre>

<pre><code class="python">
$ python3 hello.py
3
$ python3 hello.py
2
$ python3 hello.py
3
$
</code></pre>

Тоже самое только с названием функции

<pre><code class="python">
#!/usr/bin/env python3

from random import choice as rand
print( rand([1,2,3]) )
</code></pre>

<pre><code class="python">
$ python3 hello.py
3
$ python3 hello.py
1
$ python3 hello.py
1
</code></pre>

## Пакеты

Основная программа

<pre><code class="python">
$ cat ./boxes/weather.py 

from sources import daily, weekly

print("Прогноз на день: ", daily.forecast())
print("Недельный прогноз: ")

for index, weather in enumerate(weekly.forecast()):
    print(index, weather)
</code></pre>

Модуль daily.py

<pre><code class="python">
$ cat ./boxes/sources/daily.py 

def forecast():
    return 'как вчера'

</code></pre>

Модуль weekly.py

<pre><code class="python">
$ cat ./boxes/sources/weekly.py 

def forecast():
    return ['snow', 'more snow', 'sleet', 'rain']
</code></pre>

<pre><code class="python">
$ tree ./boxes/
./boxes/
├── sources
│   ├── daily.py
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── daily.cpython-35.pyc
│   │   ├── __init__.cpython-35.pyc
│   │   └── weekly.cpython-35.pyc
│   └── weekly.py
└── weather.py

2 directories, 7 files
</code></pre>

- Есть еще __init__.py но он пустой
- __pycache__ - питон сам создал, пока не понятно зачем

<pre><code class="python">
$ python3 boxes/weather.py 
Прогноз на день:  как вчера
Недельный прогноз: 
0 snow
1 more snow
2 sleet
3 rain

</code></pre>

## Стандартные функции: `setdefault()`, `defaultdict()`

При обращении к последовательности в которой нет элемента, вызывается исключение

Словарь:

<pre><code class="python">
>>> test_dict = {'test1': 1, 'test2': 2}
>>> print(test_dict['test3'])
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in <module&gt;
KeyError: 'test3'
>>>
</code></pre>

Можно сделать get()

<pre><code class="python">
>>> test_dict = {'test1': 1, 'test2': 2}
>>> print(test_dict.get('test3'))
None
>>>
</code></pre>

или setdefault() если эл. не найдено

<pre><code class="python">
>>> test_dict = {'test1': 1, 'test2': 2}
>>> print(test_dict.setdefault('test3', 3))
3
>>> test_dict
{'test2': 2, 'test3': 3, 'test1': 1}
</code></pre>

если эл. уже был, ничего не измениться

<pre><code class="python">
>>> test_dict
{'test2': 2, 'test3': 3, 'test1': 1}
>>> print(test_dict.setdefault('test2', 99999))
2
>>> test_dict
{'test2': 2, 'test3': 3, 'test1': 1}
</code></pre>

defaultdict возвращает значение указанного типа если не найден эл.

<pre><code class="python">
>>> from collections import defaultdict
>>> 
>>> table = defaultdict(int)
>>> table['test2']
0
>>> table
defaultdict(&lt;class 'int'&gt;, {'test2': 0})
>>>
</code></pre>

Можно использовать свои значения

<pre><code class="python">
from collections import defaultdict

def default_value():
    return 'default = 3'

table = defaultdict(default_value)

table['A'] = 1
table['B'] = 2

print(table['A'])
print(table['B'])
print(table['C'])
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
1
2
default = 3
</code></pre>

можно обращаться и не боятся исключения

<pre><code class="python">
from collections import defaultdict

food_counter = defaultdict(int)

for food in ['картошка', 'яйцо', 'капуста', 'хлеб', 'яйцо']:
    food_counter[food] += 1 

for food, count in food_counter.items():
    print(food, count)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
картошка 1
яйцо 2
капуста 1
хлеб 1
$
</code></pre>

## Доп. функции для работы со словарями

### Счетчики: `Counter`, `most_common`

Кол-во uniq значений в списке

<pre><code class="python">
from collections import Counter

breakfast = ['яйцо', 'хлеб', 'яйцо', 'яйцо']
breakfast_counter = Counter(breakfast)
print(breakfast_counter)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Counter({'яйцо': 3, 'хлеб': 1})
</code></pre>

<pre><code class="python">
from collections import Counter

test_dict = Counter({
    'test1': 1,
    'test2': 2,
    'test3': 3
})

test_list = dict( test_dict.most_common(1) )
print( test_list )
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
{'test3': 3}
</code></pre>

Можно объединять, вычитать и все тоже самое что и с множеством

<pre><code class="python">
#!/usr/bin/env python3

from collections import Counter

breakfast = ['яйцо', 'хлеб', 'яйцо', 'яйцо']
breakfast_counter = Counter(breakfast)
print(breakfast_counter)

lunch = ['хлеб', 'борщь', 'чеснок', 'хлеб', 'компот']
lunch_counter = Counter(lunch)
print(lunch_counter)

print("Всего: ", breakfast_counter + lunch_counter)
print("Завтрак без обеда: ", breakfast_counter - lunch_counter)
print("Общее у завтрака и обеда: ", breakfast_counter & lunch_counter)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Counter({'яйцо': 3, 'хлеб': 1})
Counter({'хлеб': 2, 'чеснок': 1, 'компот': 1, 'борщь': 1})
Всего:  Counter({'хлеб': 3, 'яйцо': 3, 'чеснок': 1, 'борщь': 1, 'компот': 1})
Завтрак без обеда:  Counter({'яйцо': 3})
Общее у завтрака и обеда:  Counter({'хлеб': 1})
</code></pre>

### Запомнить в каком порядке возвращать ключи у словаря: `OrderedDict`

<pre><code class="python">
from collections import OrderedDict

test_dict = OrderedDict([
    ('test1', 'test_v1'),
    ('test2', 'test_v2'),
    ('test3', 'test_v3')
])

print(test_dict)

for i, k in enumerate(test_dict):
    print("index =", i, "key =", k, "value =", test_dict[k])
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
OrderedDict([('test1', 'test_v1'), ('test2', 'test_v2'), ('test3', 'test_v3')])
index = 0 key = test1 value = test_v1
index = 1 key = test2 value = test_v2
index = 2 key = test3 value = test_v3
</code></pre>

### Очередь: `deque`

<pre><code class="python">
#!/usr/bin/env python3

from collections import deque

def palindrome(word):
    dq = deque(word)
    while len(dq) > 1:
        if dq.popleft() != dq.pop():
            return False
    return True

print( palindrome('') )
print( palindrome('a') )
print( palindrome('racecar') )
print( palindrome('test') )
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
True
True
True
False
</code></pre>

- popleft - возвращает и удаляет эл. слева
- pop - возвращает и удаляет эл. справа

# Глава 6: объекты и классы

Created: Feb 1, 2021 8:09 PM

## Пример создания класса

Самый простой класс, класс который ничего не делает

<pre><code class="python">
class Person():
    pass

someone = Person()
print(someone)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;__main__.Person object at 0x7fbab9efea58&gt;
</code></pre>

<pre><code class="python">
class Person():
    def __init__(self, name):
        self.name = name
        pass

someone = Person('Распутин')
print(someone)
print(someone.name)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;__main__.Person object at 0x7fba8a7e7a90&gt;
Распутин
</code></pre>

- __init__(self, name) - спец. название метода по которому инициализируется объект.
    - self - первый объект при инициализации, всегда называется self
    - name - атрибут объекта

## Наследование

<pre><code class="python">
class Car():
    def exclaim(self):
        print("Я машина", self)

class Yoga(Car):
    pass

car = Car()
yoga = Yoga()

car.exclaim()
yoga.exclaim()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Я машина &lt;__main__.Car object at 0x7f955bdc6c50&gt;
Я машина &lt;__main__.Yoga object at 0x7f955bdc6c88&gt;
</code></pre>

1. Создается класс Car
2. У класса метод exclaim выводит строку "Я машина"
3. Создается класс Yoga с наследованием от класса Car
4. Создается два объекта и у обоих доступен метод exclaim

## Перегрузка метода

<pre><code class="python">
class Car():
    def print_test(self):
        print("Test from class Car")
    def exclaim(self):
        print("Я машина", self)

class Yoga(Car):
    def print_test(self):
        print("Test from class Yoga")

car = Car()
yoga = Yoga()

car.exclaim()
yoga.exclaim()
print()
car.print_test()
yoga.print_test()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Я машина &lt;__main__.Car object at 0x7fc70d9d3cc0&gt;
Я машина &lt;__main__.Yoga object at 0x7fc70d9d3cf8&gt;

Test from class Car
Test from class Yoga
</code></pre>

- В методе Car есть метод print_test который переопределен в классе Yoga

Можно перегружать любые методы, в том числе инициализацию (__init__)

<pre><code class="python">
class Person():
    def __init__(self, name):
        self.name = name

class MPerson(Person):
    def __init__(self, name):
        self.name = "Doctor " + name

someone = Person('Распутин')
print(someone)
print(someone.name)

some_else = MPerson('Двапутин')
print(some_else.name)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;__main__.Person object at 0x7fd122ef5c18&gt;
Распутин
Doctor Двапутин
</code></pre>

## Отмена перегрузки, вызов родительского метода: `super()`

<pre><code class="python">
class Person():
    def __init__(self, name):
        self.name = name

class EmailPerson(Person):
    def __init__(self, name, email):
        super().__init__(name)
        self.email = email

someone = EmailPerson('Распутин', 'rasputin@mail.ru')
print(someone)
print(someone.name)
print(someone.email)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;__main__.EmailPerson object at 0x7f2f92a19c18&gt;
Распутин
rasputin@mail.ru
</code></pre>

## Публичные/приватные атрибуты (геттеры и сеттеры)

<pre><code class="python">
class Duck():
    def __init__(self, name):
        self.hidden_name = name
    def get_name(self):
        print('inside the getter')
        return self.hidden_name
    def set_name(self, name):
        print('inside the setter; new name = ', name)
        self.hidden_name = name
    name = property(get_name, set_name)

duck = Duck('Скрудж')
print(duck.name)

duck.name = 'Не скрудж'
print(duck.name)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
inside the getter
Скрудж
inside the setter; new name =  Не скрудж
inside the getter
Не скрудж
</code></pre>

- Все методы как обычные, только property отличается
- property - первый аргумент геттер, второй - сеттере
- Можно вызвать как обычный метод -

<pre><code class="python">
duck = Duck('Скрудж')
print(duck.get_name())

duck.set_name('Не скрудж')
print(duck.name)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
inside the getter
Скрудж
inside the setter; new name =  Не скрудж
inside the getter
Не скрудж
</code></pre>

### Через декораторы: `@property`, `@self.setter`

<pre><code class="python">
class Duck():
    def __init__(self, name):
        self.hidden_name = name
    @property
    def name(self):
        print('inside the getter')
        return self.hidden_name
    @name.setter
    def name(self, name):
        print('inside the setter; new name = ', name)
        self.hidden_name = name

duck = Duck('Скрудж')
print(duck.name)

duck.name = 'Не скрудж'
print(duck.name)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
inside the getter
Скрудж
inside the setter; new name =  Не скрудж
inside the getter
Не скрудж
</code></pre>

Значение может быть вычисляемым

<pre><code class="python">
class Circle():
    def __init__(self, radius):
        self.radius = radius
    @property
    def diameter(self):
        return 2 * self.radius

circle = Circle(2)
print("1. Радиус = ", circle.radius, "Диаметр = ", circle.diameter)
circle.radius = 7
print("2. Радиус = ", circle.radius, "Диаметр = ", circle.diameter)

circle2 = Circle(4)
print("3. Радиус = ", circle2.radius, "Диаметр = ", circle2.diameter)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
1. Радиус =  2 Диаметр =  4
2. Радиус =  7 Диаметр =  14
3. Радиус =  4 Диаметр =  8
</code></pre>

- По факту, property позволяет делать методы как атрибуты объекта
- Но при этом теряются все свойства как метода

## Protected атрибуты

Если просто записать атрибут в self, то даже при наличии сеттеров и геттеров, можно получить доступ извне

<pre><code class="python">
class Duck():
    def __init__(self, name):
        self.hidden_name = name
    @property
    def name(self):
        print('inside the getter')
        return self.hidden_name
    @name.setter
    def name(self, name):
        print('inside the setter; new name = ', name)
        self.hidden_name = name

duck = Duck('Скрудж')
print(duck.hidden_name)

duck.hidden_name = 'Не скрудж'

print(duck.name)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Скрудж
inside the getter
Не скрудж
</code></pre>

Чтобы закрыть атрибуты, нужно добавить __ в начало атрибута

<pre><code class="python">
class Duck():
    def __init__(self, name):
        self.__name = name
    @property
    def name(self):
        print('inside the getter')
        return self.__name
    @name.setter
    def name(self, name):
        print('inside the setter; new name = ', name)
        self.__name = name

duck = Duck('Скрудж')
print(duck.name)

duck.name = 'Не скрудж'
print(duck.name)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
inside the getter
Скрудж
inside the setter; new name =  Не скрудж
inside the getter
Не скрудж
</code></pre>

При обращении к закрытому атрибуту, будет исключение

<pre><code class="python">
duck = Duck('Скрудж')
print(duck.__name)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Traceback (most recent call last):
  File "./test.py", line 32, in &lt;module&gt;
    print(duck.__name)
AttributeError: 'Duck' object has no attribute '__name'
</code></pre>

Однако и эту защиту можно обойти

<pre><code class="python">
duck = Duck('Скрудж')
print(duck._Duck__name)

duck._Duck__name = 'Тест'
print(duck.name)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Скрудж
inside the getter
Тест
</code></pre>

## Методы и атрибуты класса

Для определения метода класса, нужно добавить декоратор @classmethod

<pre><code class="python">
class TestClass():
    count = 0
    def __init__(self):
        TestClass.count += 1
    def print_test(self):
        print('test', self)
    @classmethod
    def kids(cls):
        print("Всего ", cls.count, "объектов")

a = TestClass()
b = TestClass()
c = TestClass()

a.print_test()
b.print_test()
c.print_test()

TestClass.kids()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
test &lt;__main__.TestClass object at 0x7f77e3c4ac18&gt;
test &lt;__main__.TestClass object at 0x7f77e3c4ac88&gt;
test &lt;__main__.TestClass object at 0x7f77e3c4acc0&gt;
Всего  3 объектов
</code></pre>

## Полиморфизм! Утиная типизация?

> Полиморфизм - одна операция может быть произведена над разными объектами независимо от их класса. Если нечто выглядит как утка, плавает как утка и крякает как утка, то это, вероятно, и есть утка!

<pre><code class="python">
class Quote():
    def __init__(self, person, words):
        self.person = person
        self.words = words
    def who(self):
        return self.person
    def says(self):
        return self.words + '.'

class QuestionQuote(Quote):
    def says(self):
        return self.words + '?'

class ExclaimQuote(Quote):
    def says(self):
        return self.words + '!!!'

barney = Quote('Барни Стинсон', 'Ложь - это прекрасная история, которую портят правдой')
print(barney.who(), 'однажды сказал:', barney.says())

marshal = QuestionQuote('Маршал Эриксон', 'Мы щас точно говорим про блинчики')
print(marshal.who(), 'однажды сказал:', marshal.says())

marshal = ExclaimQuote('Маршал Эриксон', 'Ох ты ж ёёёёёжик')
print(marshal.who(), 'однажды сказал:', marshal.says())
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Барни Стинсон однажды сказал: Ложь - это прекрасная история, которую портят правдой.
Маршал Эриксон однажды сказал: Мы щас точно говорим про блинчики?
Маршал Эриксон однажды сказал: Ох ты ж ёёёёёжик!!!
</code></pre>

## Специальные методы:

Простой метод сравнения строк

<pre><code class="python">
class Word():
    def __init__(self, text):
        self.text = text
    def equals(self, word2):
        return self.text.lower() == word2.lower()

f1 = Word('привет')
f2 = Word('ПРИВЕТ')
f3 = Word('Пока')

print(f1.text, '==', f2.text, '? ', f1.equals(f2.text) )
print(f2.text, '==', f3.text, '? ', f2.equals(f3.text) )
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
привет == ПРИВЕТ ?  True
ПРИВЕТ == Пока ?  False
</code></pre>

Спец метод __eq__ переопределяет операцию сравнения

<pre><code class="python">
class Word():
    def __init__(self, text):
        self.text = text
    def __eq__(self, word2):
        return self.text.lower() == word2.text.lower()

f1 = Word('привет')
f2 = Word('ПРИВЕТ')
f3 = Word('Пока')

print(f1.text, '==', f2.text, '? ', f1 == f2 )
print(f2.text, '==', f3.text, '? ', f2 == f3 )
</code></pre>

<pre><code class="python">
python3 ./test.py 
привет == ПРИВЕТ ?  True
ПРИВЕТ == Пока ?  False
</code></pre>

## Композиция

<pre><code class="python">
class Bill():
    def __init__(self, desc):
        self.desc = desc

class Tail():
    def __init__(self, length):
        self.length = length

class Duck():
    def __init__(self, bill, tail):
        self.bill = bill
        self.tail = tail
    def about(self):
        print("Это утка, у нее", self.bill.desc, "клюв и", self.tail.length, "хвост")

bill = Bill("широкий и оранжевый")
tail = Tail("длиный")

duck = Duck(bill, tail)
duck.about()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Это утка, у нее широкий и оранжевый клюв и длиный хвост
</code></pre>

## Именованный кортеж: `nametuple`

<pre><code class="python">
from collections import namedtuple

Duck = namedtuple('Duck', 'bill tail')
duck = Duck("широкий и оранжевый", "длинный")

print(duck)
print('bill = ', duck.bill)
print('tail = ', duck.tail)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Duck(bill='широкий и оранжевый', tail='длинный')
bill =  широкий и оранжевый
tail =  длинный
</code></pre>

Тоже самое только через словарь

<pre><code class="python">
from collections import namedtuple

Duck = namedtuple('Duck', 'bill tail')

parts = {'bill': "широкий и красный", 'tail': "узкий"}
duck2 = Duck(**parts)

print(duck2)
print('bill = ', duck2.bill)
print('tail = ', duck2.tail)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Duck(bill='широкий и красный', tail='узкий')
bill =  широкий и красный
tail =  узкий
</code></pre>

- **parts - разыменование аргументов

## Классы и объекты vs модули

- Объекты наиболее полезны, когда вам нужно иметь некоторое количество отдельных экземпляров с одинаковым поведением (методами), но различающихся внутренним состоянием (атрибутами).
- Классы, в отличие от модулей, поддерживают наследование.
- Если вам нужен только один объект, модуль подойдет лучше. Независимо от
того, сколько обращений к модулю имеется в программе, будет загружена толь-
ко одна копия.
- Если у вас есть несколько переменных, которые содержат разные значения
и могут быть переданы как аргументы в несколько функций, лучше всего опре-
делить их как классы.
    - Например, вы можете использовать словарь с ключами size и color , чтобы представить цветное изображение. Вы можете создать разные словари для каждого изображения в программе и передавать их в качестве аргументов в функции scale() и transform(). По мере добавления новых ключей и функций может начаться путаница. Более последовательно было бы опреде- лить класс Image с атрибутами size или color и методами scale() и transform(). В этом случае все данные и методы для работы с цветными изображениями будут определены в одном месте.
- Используйте простейшее решение задачи. Словарь, список или кортеж проще,
компактнее и быстрее, чем модуль, который, в свою очередь, проще, чем класс.

# Глава 7: Работаем с данными профессионально

Created: Feb 3, 2021 7:28 PM

# Строки

## Unicode

Проверка

<pre><code class="python">
import unicodedata

def unicode_test(val):
    name = unicodedata.name(val)
    value2 = unicodedata.lookup(name)
    print("value=[%s]; name=[%s]; value2=[%s]" % (val, name, value2))

unicode_test('A')
unicode_test('$')
unicode_test('П')
unicode_test('ё')

unicode_test('\u20ac')
unicode_test('\u20a2')
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
value=[A]; name=[LATIN CAPITAL LETTER A]; value2=[A]
value=[$]; name=[DOLLAR SIGN]; value2=[$]
value=[П]; name=[CYRILLIC CAPITAL LETTER PE]; value2=[П]
value=[ё]; name=[CYRILLIC SMALL LETTER IO]; value2=[ё]
value=[€]; name=[EURO SIGN]; value2=[€]
value=[₢]; name=[CRUZEIRO SIGN]; value2=[₢]
</code></pre>

## Кодирование строк

<pre><code class="python">
snowman = '\u2603'
print(snowman.encode('utf-8'))
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
b'\xe2\x98\x83'
</code></pre>

## Декодирование строк

<pre><code class="python">
snowman = '\u2603'
encode_str = snowman.encode('utf-8')

encode_str = encode_str.decode('utf-8')

print(encode_str)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
☃
</code></pre>

## Форматирование строк

### Старый стиль - процентный

<pre><code class="python">
n = 42
f = 99998.04
s = 'Строка'

print('%d %f %s' % (n, f, s))

print("Минимальная длина поля 10 символов, выравнивание по правому краю")
print('%10d %10f %10s' % (n, f, s))

print("Выравнивание по левому краю")
print('%-10d %-10f %-10s' % (n, f, s))

print("Макс. кол-во символов = 4. Для дробных - 4 символа после запятой")
print('%10.4d %10.4f %10.4s' % (n, f, s))

print("Длинна полей из аргументов")
print('%*.*d %*.*f %*.*s' % (10, 3, n, 10, 3, f, 10, 3, s))
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
42 99998.040000 Строка
Минимальная длина поля 10 символов, выравнивание по правому краю
        42 99998.040000     Строка
Выравнивание по левому краю
42         99998.040000 Строка    
Макс. кол-во символов = 4. Для дробных - 4 символа после запятой
      0042 99998.0400       Стро
Длинна полей из аргументов
       042  99998.040        Стр
</code></pre>

### Новый стиль - {} и format

<pre><code class="python">
n = 42
f = 99998.04
s = 'Строка'

print('{} {} {}'.format(n, f, s))

print("Можно менять местами а не в порядке появления")
print('{1} {2} {0}'.format(n, f, s))

print("Или именовать")
print('{f} {n} {s}'.format(n=42, f=99998.04, s='Строка'))

d = {'n': 42, 'f': 99998.04, 's': 'Строка'}
print("Можно передать словарь")
print('{0[f]} {0[n]} {0[s]} {1}'.format(d, 'other'))

print("Формат поля через :")
print('{0:d} {1:f} {2:s}'.format(n, f, s))

print("Тоже самое только для именованных")
print('{f:f} {n:d} {s:s}'.format(n=42, f=99998.04, s='Строка'))

print("Длинна поля. К какому краю прижимать указывается через ><")
print('{0:>10d} {1:>10f} {2:>10s}'.format(n, f, s))

print("Длинна поля. К какому краю прижимать указывается через ><")
print('{0:<10d} {1:<10f} {2:<10s}'.format(n, f, s))

print("Длинна поля + по центру ^")
print('{0:^10d} {1:^10f} {2:^10s}'.format(n, f, s))

print("Заполнитель")
print('{0:!^10d} {1:!^10f} {2:!^10s}'.format(n, f, s))

print("Значение точность (после запятой)")
print('{0:>10.4f} {1:>10.4s}'.format(f, s))

print("Значение точности нельзя для целых чисел!")
print('{0:>10.4d}'.format(n))
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
42 99998.04 Строка
Можно менять местами а не в порядке появления
99998.04 Строка 42
Или именовать
99998.04 42 Строка
Можно передать словарь
99998.04 42 Строка other
Формат поля через :
42 99998.040000 Строка
Тоже самое только для именованных
99998.040000 42 Строка
Длинна поля. К какому краю прижимать указывается через ><
        42 99998.040000     Строка
Длинна поля. К какому краю прижимать указывается через ><
42         99998.040000 Строка    
Длинна поля + по центру ^
    42     99998.040000   Строка  
Заполнитель
!!!!42!!!! 99998.040000 !!Строка!!
Значение точность (после запятой)
99998.0400       Стро
Значение точности нельзя для целых чисел!
Traceback (most recent call last):
  File "./test.py", line 42, in &lt;module&gt;
    print('{0:>10.4d}'.format(n))
ValueError: Precision not allowed in integer format specifier
</code></pre>

### Супер новый формат (>+3.7) f"{}"

<pre><code class="python">
>>> hello = 'hello'
>>> f'{hello}'
'hello'
>>>
</code></pre>

Больше напоминает интерполяцию, но типа больше возможностей?...

- [https://realpython.com/python-f-strings/](https://realpython.com/python-f-strings/)

<pre><code class="python">
>>> f'{{ 2 + 3 }}'
'{ 2 + 3 }'
>>> f'{2 + 3}'
'5'
>>>
</code></pre>

## Регулярные выражения

Если будет найдена подстрока в source, то выводится то что удалось найти

<pre><code class="python">
import re

source = "Godsmack - Just One Time"

match = re.match('God', source)
if match:
    print(match.group())
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
God
</code></pre>

match работает только если найдет в начале строки!

<pre><code class="python">
>>> import re
>>> source = "Godsmack - Just One Time"
>>> match = re.match('Time', source)
>>> if match:
...     print(match.group())
...
>>>
</code></pre>

Даже 1 символ не в начале будет не найдено

<pre><code class="python">
import re

source = "Godsmack - Just One Time"

match = re.match('odsmack', source)
if match:
    print(match.group())
</code></pre>

<pre><code class="python">

</code></pre>

- search работает по всей строке, возвращает первое что найдет

<pre><code class="python">
import re

source = "Godsmack - Just One Time"

match = re.search('Just', source)
if match:
    print(match.group())
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Just
</code></pre>

- findall - находит все совпадения и возвращает список

<pre><code class="python">
import re

source = "Godsmack - Just One Time"

match = re.findall('s', source)
print(match)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
['s', 's']
</code></pre>

<pre><code class="python">
import re

source = "Godsmack - Just One Time"

match = re.findall('s\w+', source)
print(match)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
['smack', 'st']
</code></pre>

- split - разбить строку и вернуть кортеж

<pre><code class="python">
import re

source = "Godsmack - Just One Time"

match = re.split(' ', source)
print(type(match))
print(match)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;class 'list'&gt;
['Godsmack', '-', 'Just', 'One', 'Time']
</code></pre>

- sub - найти и заменить

<pre><code class="python">
import re

source = "Godsmack - Just One Time"

match = re.sub(' ', '?', source)
print(type(match))
print(match)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;class 'str'&gt;
Godsmack?-?Just?One?Time
</code></pre>

## Поиск через регулярные выражения

<pre><code class="python">
import re
import string

long_str = string.printable

print("Оригинальная строка:", long_str)

print("Только цифры:", re.findall("\d", long_str) )
print("Цифры, буквы, знак подчеркивания:", re.findall("\w", long_str) )
print("Пробелы:", re.findall("\s", long_str) )
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Оригинальная строка: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~   

Только цифры: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
Цифры, буквы, знак подчеркивания: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '_']
Пробелы: [' ', '\t', '\n', '\r', '\x0b', '\x0c']
</code></pre>

### Спецификаторы

Шаблон Совпадения
abc Буквосочетание abc
(expr) expr
expr1 | expr2 expr1 или expr2
Любой символ, кроме \n
^ Начало строки источника
$ Конец строки источника
prev ? Ноль или одно включение prev
prev * Ноль или больше включений prev, максимальное количество
prev *? Ноль или больше включений prev, минимальное количество
prev + Одно или больше включений prev, максимальное количество
prev +? Одно или больше включений prev, минимальное количество
prev { m } m последовательных включений prev
prev { m, n } От m до n последовательных включений prev, максимальное количество
prev { m, n }? От m до n последовательных включений prev, минимальное количество
[abc] a, или b, или c (аналогично a|b|c)
[^abc] Не (a, или b, или c)
prev (?= next) prev, если за ним следует next
prev (? ! next) prev, если за ним не следует next
(?<=prev ) next next, если перед ним находится prev
(?<! prev) next next, если перед ним не находится prev

<pre><code class="python">
import re

source = "Godsmack - Just One Time"

match = re.findall('One|Time', source)
print(type(match))
print(match)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;class 'list'&gt;
['One', 'Time']
</code></pre>

### Получение нескольких значений

- search -> groups возвращает кортеж,

<pre><code class="python">
import re

source = "Godsmack - Just One Time"

match = re.search('(One)|(Time)', source)
print(type(match))
print(match.groups())
print(match.group(0))
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;class '_sre.SRE_Match'&gt;
('One', None)
One
</code></pre>

Можно указать имена через `?P&lt; name &gt; expr`

<pre><code class="python">
import re

source = "Godsmack - Just One Time"

match = re.search('(?P&lt;One>One).*(?P<Time&gt;Time)', source)
print(type(match))
print(match.groups())
print(match.group('One'))
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;class '_sre.SRE_Match'&gt;
('One', 'Time')
One
</code></pre>

# Бинарные данные

## bytes и bytearrey

- bytes - кортеж байтов
- bytearrey - список байтов

<pre><code class="python">
blist = [1,2,3,255]

vbytes = bytes(blist)
print('vbytes=', vbytes)

avbytes = bytearray(blist)
print('avbytes=', avbytes)

avbytes[1] = 10
print('avbytes=', avbytes)

vbytes[1] = 10 # кортеж не изменяем!
print('vbytes=', vbytes)
</code></pre>

<pre><code class="python">
$ python3 test.py 
vbytes= b'\x01\x02\x03\xff'
avbytes= bytearray(b'\x01\x02\x03\xff')
avbytes= bytearray(b'\x01\n\x03\xff')
Traceback (most recent call last):
  File "test.py", line 15, in &lt;module&gt;
    vbytes[1] = 10 # кортеж не изменяем!
TypeError: 'bytes' object does not support item assignment
</code></pre>

- каждый элемент списка байтов может принимать значение от 0 до 256

<pre><code class="python">
byte_list = bytes([0, 255])
print("byte =", byte_list)
</code></pre>

<pre><code class="python">
$ python3 test.py 
byte = b'\x00\xff'
</code></pre>

## Преобразование: `struct`

<pre><code class="python">

</code></pre>

## Битовые операторы

# Глава 8: Данные должны куда-то попадать

Created: Feb 5, 2021 6:26 PM

# Чтение и запись в файл: `open`

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
    - 

<pre><code class="python">
text='''
Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
'''

file = open('./test_file.txt', 'wt')
file.write(text)
file.close()
</code></pre>

<pre><code class="python">
$ python3 test.py && cat test_file.txt 

Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
</code></pre>

### write vs print

- print по умолчанию добавляет пробел между параметрами и добавляет перенос в конце

<pre><code class="python">
file = open('./test_file.txt', 'wt')
print('test1', 'test2', 'test3', file=file)
file.close()
</code></pre>

<pre><code class="python">
$ python3 test.py && cat test_file.txt 
test1 test2 test3
</code></pre>

Чтобы убрать это свойство нужно передать sep и end

<pre><code class="python">
text='''\
Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
'''

file = open('./test_file.txt', 'wt')
print(text, file=file, sep='', end='')
file.close()
</code></pre>

<pre><code class="python">
$ python3 test.py && cat test_file.txt 
Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
</code></pre>

## Запись частями

<pre><code class="python">
text='''\
Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
'''

file = open('./test_file.txt', 'wt')

size = len(text)
offset = 0
chunk = 10

while offset < size:
    print('offset =', offset, 'text =', text[offset:offset+chunk])
    file.write( text[offset:offset+chunk] )
    offset += chunk

file.close()
</code></pre>

<pre><code class="python">
$ python3 test.py && cat test_file.txt 
offset = 0 text = Я инженер 
offset = 10 text = на сотню р
offset = 20 text = ублей,
И б
offset = 30 text = ольше я не
offset = 40 text =  получу.
М
offset = 50 text = не двадцат
offset = 60 text = ь пять, и 
offset = 70 text = я до сих п
offset = 80 text = ор
Не знаю
offset = 90 text = , чего хоч
offset = 100 text = у.

Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
</code></pre>

## Запись только если файл существует: x

<pre><code class="python">
text='''\
Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
'''

file = open('./test_file.txt', 'xt')
file.write(text)
file.close()
</code></pre>

<pre><code class="python">
$ rm -rf ./test_file.txt 
$ python3 test.py && cat test_file.txt 
Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
$ python3 test.py && cat test_file.txt 
Traceback (most recent call last):
  File "test.py", line 10, in &lt;module&gt;
    file = open('./test_file.txt', 'xt')
FileExistsError: [Errno 17] File exists: './test_file.txt'
</code></pre>

- Можно отловить исключение и переопределить поведение

<pre><code class="python">
try:
    file = open('./test_file.txt', 'xt')
    file.write(text)
    file.close()
except FileExistsError:
    print("Файл существует. Попробуйте его удалить")
    exit(1)
</code></pre>

<pre><code class="python">
$ python3 test.py && cat test_file.txt 
Файл существует. Попробуйте его удалить
</code></pre>

# Чтение файла: read, readline, readlines

- Просто чтение файла целиком

<pre><code class="python">
file = open('./test_file.txt', 'rt')
text = file.read()
print(type(text))
print(text)
file.close
</code></pre>

<pre><code class="python">
$ python3 test.py
&lt;class 'str'&gt;
Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
</code></pre>

по умолчанию read читает весь файл. 1гб файл будет занимать 1гб оперативки

### Чтение по частям

- read вернет пустую строку если ничего не осталось

<pre><code class="python">
file = open('./test_file.txt', 'rt')

text = ''
chunk = 52
while True:
    fragment = file.read(chunk)
    print('---->>> fragment =', fragment)
    if not fragment:
        break
    text += fragment

print('all text =', text)

file.close
</code></pre>

<pre><code class="python">
$ python3 test.py
---->>> fragment = Я инженер на сотню рублей,
И больше я не получу.
Мне
---->>> fragment =  двадцать пять, и я до сих пор
Не знаю, чего хочу.

---->>> fragment = 
all text = Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
</code></pre>

- readline - читает по срокам

<pre><code class="python">
file = open('./test_file.txt', 'rt')

text = ''
while True:
    line = file.readline()
    print('---->>> line =', line)
    if not line:
        break
    text += line

print('all text =', text)

file.close
</code></pre>

<pre><code class="python">
$ python3 test.py
---->>> line = Я инженер на сотню рублей,

---->>> line = И больше я не получу.

---->>> line = Мне двадцать пять, и я до сих пор

---->>> line = Не знаю, чего хочу.

---->>> line = 
all text = Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
</code></pre>

- Тоже самое только через итератор

<pre><code class="python">
file = open('./test_file.txt', 'rt')

text = ''
for line in file:
    text += line

print('all text =', text)

file.close
</code></pre>

<pre><code class="python">
$ python3 test.py
all text = Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
</code></pre>

- readlines читает построчно и возвращает список строк

<pre><code class="python">
file = open('./test_file.txt', 'rt')

lines = file.readlines()
print(type(lines))
print(lines)
print()

for line in lines:
    print(line, end='')

file.close
</code></pre>

<pre><code class="python">
$ python3 test.py
&lt;class 'list'&gt;
['Я инженер на сотню рублей,\n', 'И больше я не получу.\n', 'Мне двадцать пять, и я до сих пор\n', 'Не знаю, чего хочу.\n']

Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
</code></pre>

- print(line, end='') - не будет добавлять перенос после каждого вывода т.к. он изначально сохранился в строке

## Чтение и запись бинарных файлов

<pre><code class="python">
file = open('./binary_file.txt', 'wb')
bdata = bytes(range(0, 100))
file.write(bdata)
file.close()

open_file = open('./binary_file.txt', 'rb')
bdata = open_file.read()
print('bdata =', len(bdata))
open_file.close()
</code></pre>

<pre><code class="python">
$ python3 test.py
bdata = 100
</code></pre>

## Закрытие файла автоматически после выхода из блока

<pre><code class="python">
file_name = 'text_file.txt'

with open(file_name, 'wt') as file:
    text = '''\
Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
    '''
    file.write(text)

open_file = open(file_name, 'rt')
print(open_file.read())
open_file.close()
</code></pre>

<pre><code class="python">
$ python3 test.py
Я инженер на сотню рублей,
И больше я не получу.
Мне двадцать пять, и я до сих пор
Не знаю, чего хочу.
</code></pre>

## Смещение в файле: `seek()`, `tell()`

- tell - говорит на какой позиции находится курсор

<pre><code class="python">
>>> bfile = open('./binary_file.txt', 'rb')
>>> bfile.tell()
0
</code></pre>

- seek - перемещает курсор на заданную позицию

<pre><code class="python">
>>> bfile.seek(99)
99
>>> bfile.tell()
99
>>> bdata = bfile.read()
>>> len(bdata)
1
>>> bdata
b'c'
>>>
</code></pre>

- Также можно передать откуда смещаться - origin

<pre><code class="python">
seek(offset, origin)
</code></pre>

- origin = 0 (default) - сместиться на offset байт с начала файла
- origin = 1 - сместиться на offset с текущей позиции
- origin = 2 - сместиться на offset с конца файла

<pre><code class="python">
>>> bfile.seek(0)
0
>>> bfile.seek(10)
10
>>> bfile.seek(10, 1)
20
>>> bfile.tell()
20
>>> bfile.seek(-10, 2)
90
>>>
</code></pre>

# Форматы файлов

## csv

- Запись в файл

<pre><code class="python">
import csv

music = [
    ['You Me At Six', 'Room to Breathe'],
    ['Saliva', 'Lose Yourself'],
    ['Kingdom of Giants', 'Burner'],
    ['Palisades', 'War']
]

with open('./last_music.csv', 'wt') as file:
    csvout = csv.writer(file)
    csvout.writerows(music)
</code></pre>

<pre><code class="python">
$ python3 ./test.py && cat last_music.csv 
You Me At Six,Room to Breathe
Saliva,Lose Yourself
Kingdom of Giants,Burner
Palisades,War
</code></pre>

- Чтение из csv файла

<pre><code class="python">
def read_from_csv():
    with open(file_name, 'rt') as file:
        data = csv.reader(file)
        print(data)
        return [row for row in data]

music = read_from_csv()
print(music)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;_csv.reader object at 0x7f36b747bac8&gt;
[['You Me At Six', 'Room to Breathe'], ['Saliva', 'Lose Yourself'], ['Kingdom of Giants', 'Burner'], ['Palisades', 'War']]
</code></pre>

- Через DictReader можно указать название колонок

<pre><code class="python">
import csv
from pprint import pprint

file_name = './last_music.csv'

def read_from_csv():
    with open(file_name, 'rt') as file:
        data = csv.DictReader(file, fieldnames=['artist', 'name'])
        print(data)
        return [row for row in data]

music = read_from_csv()
pprint(music)
</code></pre>

<pre><code class="python">
&lt;csv.DictReader object at 0x7f31a2465ba8&gt;
[{'artist': 'You Me At Six', 'name': 'Room to Breathe'},
 {'artist': 'Saliva', 'name': 'Lose Yourself'},
 {'artist': 'Kingdom of Giants', 'name': 'Burner'},
 {'artist': 'Palisades', 'name': 'War'}]
</code></pre>

- DictWriter - записывает словарь + можно добавить заголовок через writeheader

<pre><code class="python">
import csv
from pprint import pprint

file_name = './last_music.csv'

music = [
    {
        'artist': 'You Me At Six',
        'name': 'Room to Breathe'
    },
    {
        'artist': 'Saliva', 'name':
        'Lose Yourself'
    },
    {
        'artist': 'Kingdom of Giants',
        'name': 'Burner'
    },
    {
        'artist': 'Palisades',
        'name': 'War'
    }
]

with open(file_name, 'wt') as file:
    cout = csv.DictWriter(file, fieldnames=['artist', 'name'])
    cout.writeheader()
    cout.writerows(music)
</code></pre>

<pre><code class="python">
$ python3 ./test.py && cat last_music.csv 
artist,name
You Me At Six,Room to Breathe
Saliva,Lose Yourself
Kingdom of Giants,Burner
Palisades,War
</code></pre>

<pre><code class="python">
def read_from_csv():
    with open(file_name, 'rt') as file:
        data = csv.DictReader(file)
        print(data)
        return [row for row in data]

music = read_from_csv()
pprint(music)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;csv.DictReader object at 0x7f02a4affb38&gt;
[{'artist': 'You Me At Six', 'name': 'Room to Breathe'},
 {'artist': 'Saliva', 'name': 'Lose Yourself'},
 {'artist': 'Kingdom of Giants', 'name': 'Burner'},
 {'artist': 'Palisades', 'name': 'War'}]
</code></pre>

## xml

<pre><code class="python">
import xml.etree.ElementTree as et

tree = et.ElementTree(file='menu.xml')
root = tree.getroot()
print(root.tag)

for child in root:
    print("tag = [", child.tag, "] atributtes = [", child.attrib, ']', sep='')
    for grandchild in child:
        print("\ttag = [", grandchild.tag, "] atributtes = [", grandchild.attrib, ']', sep='')
</code></pre>

<pre><code class="python">
$ cat menu.xml && python3 ./test.py 
&lt;?xml version="1.0"?&gt;
&lt;menu&gt;
    &lt;breakfast hours="7-11"&gt;
        &lt;item price="10">Блинчики</item&gt;
    &lt;/breakfast&gt;
&lt;/menu&gt;menu
tag = [breakfast] atributtes = [{'hours': '7-11'}]
  tag = [item] atributtes = [{'price': '10'}]
$
</code></pre>

## JSON

- dumps - закодировать в json строку

<pre><code class="python">
import json
from pprint import pprint

file_name = './last_music.json'

music = [
    {
        'artist': 'You Me At Six',
        'name': 'Room to Breathe'
    },
    {
        'artist': 'Saliva', 'name':
        'Lose Yourself'
    },
    {
        'artist': 'Kingdom of Giants',
        'name': 'Burner'
    },
    {
        'artist': 'Palisades',
        'name': 'War'
    }
]

with open(file_name, 'wt') as file:
    music_json = json.dumps(music)
    print(type(music_json))
    pprint(music_json)
    file.write(music_json)
</code></pre>

<pre><code class="python">
$ python3 ./test.py && cat last_music.json 
&lt;class 'str'&gt;
('[{"artist": "You Me At Six", "name": "Room to Breathe"}, {"artist": '
 '"Saliva", "name": "Lose Yourself"}, {"artist": "Kingdom of Giants", "name": '
 '"Burner"}, {"artist": "Palisades", "name": "War"}]')
[{"artist": "You Me At Six", "name": "Room to Breathe"}, {"artist": "Saliva", "name": "Lose Yourself"}, {"artist": "Kingdom of Giants", "name": "Burner"}, {"artist": "Palisades", "name": "War"}]$
</code></pre>

- loads - декодирует json строку

<pre><code class="python">
music_json = json.dumps(music)
print(type(music_json))
pprint(music_json)

music2 = json.loads(music_json)
print(type(music2))
pprint(music2)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;class 'str'&gt;
('[{"name": "Room to Breathe", "artist": "You Me At Six"}, {"name": "Lose '
 'Yourself", "artist": "Saliva"}, {"name": "Burner", "artist": "Kingdom of '
 'Giants"}, {"name": "War", "artist": "Palisades"}]')
&lt;class 'list'&gt;
[{'artist': 'You Me At Six', 'name': 'Room to Breathe'},
 {'artist': 'Saliva', 'name': 'Lose Yourself'},
 {'artist': 'Kingdom of Giants', 'name': 'Burner'},
 {'artist': 'Palisades', 'name': 'War'}]
</code></pre>

Не все данные удастся сериализовать. datetime например ломается, нужно приводить к строке.

<pre><code class="python">
import datetime
import json

now = datetime.datetime.now()
print( now )

datetime_str = json.dumps( now )
print("datetime_str =", datetime_str)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
2021-02-06 23:36:06.805184
Traceback (most recent call last):
  File "./test.py", line 9, in &lt;module&gt;
TypeError: datetime.datetime(2021, 2, 6, 23, 36, 6, 805184) is not JSON serializable
</code></pre>

<pre><code class="python">
import datetime
import json

now = datetime.datetime.now()
print( now )

datetime_str = json.dumps( str(now) )
print("datetime_str =", datetime_str)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
2021-02-06 23:34:23.983503
datetime_str = "2021-02-06 23:34:23.983503"
</code></pre>

## YAML

- dump - выгружает в yaml формате

<pre><code class="python">
import yaml

file_name = './last_music.yaml'

music = [
    {
        'artist': 'You Me At Six',
        'name': 'Room to Breathe'
    },
    {
        'artist': 'Saliva', 'name':
        'Lose Yourself'
    },
    {
        'artist': 'Kingdom of Giants',
        'name': 'Burner'
    },
    {
        'artist': 'Palisades',
        'name': 'War'
    }
]

with open(file_name, 'wt') as file:
    data = yaml.dump(music)
    file.write(data)
</code></pre>

<pre><code class="python">
$ python3 ./test.py && cat last_music.yaml 
- artist: You Me At Six
  name: Room to Breathe
- artist: Saliva
  name: Lose Yourself
- artist: Kingdom of Giants
  name: Burner
- artist: Palisades
  name: War
$
</code></pre>

- safe_load - чтение из yaml файла

<pre><code class="python">
import yaml
from pprint import pprint

file_name = './last_music.yaml'

with open(file_name, 'rt') as file:
    music = yaml.safe_load(file)
    print(type(music))
    pprint(music)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;class 'list'&gt;
[{'artist': 'You Me At Six', 'name': 'Room to Breathe'},
 {'artist': 'Saliva', 'name': 'Lose Yourself'},
 {'artist': 'Kingdom of Giants', 'name': 'Burner'},
 {'artist': 'Palisades', 'name': 'War'}]
</code></pre>

## Конфиг файлы `.cfg`

<pre><code class="python">
import configparser

cfg = configparser.ConfigParser()
cfg.read('settings.cfg')
print(cfg)
print(cfg['settings'])
print(cfg['settings']['test'])
</code></pre>

<pre><code class="python">
$ python3 ./test.py && cat ./settings.cfg 
&lt;configparser.ConfigParser object at 0x7f4d32eaaa90&gt;
&lt;Section: settings&gt;
file

[settings]
test = file
</code></pre>

## Сериализация с помощью pickle

<pre><code class="python">
import pickle
import datetime
from pprint import pprint

music = [
    {
        'artist': 'You Me At Six',
        'name': 'Room to Breathe'
    },
    {
        'artist': 'Saliva', 'name':
        'Lose Yourself'
    },
    {
        'artist': 'Kingdom of Giants',
        'name': 'Burner'
    },
    {
        'artist': 'Palisades',
        'name': 'War'
    }
]

music[0]['time'] = str(datetime.datetime.now())

def write_binary_data():
    with open('binary_music.bin', 'wb') as file:
        pickled = pickle.dumps(music)
        file.write(pickled)

def read_binary_data():
    with open('binary_music.bin', 'rb') as file:
        data = file.read()
        music = pickle.loads(data)
        pprint(music)

write_binary_data()
read_binary_data()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
[{'artist': 'You Me At Six',
  'name': 'Room to Breathe',
  'time': '2021-02-07 13:08:56.532117'},
 {'artist': 'Saliva', 'name': 'Lose Yourself'},
 {'artist': 'Kingdom of Giants', 'name': 'Burner'},
 {'artist': 'Palisades', 'name': 'War'}]
$
</code></pre>

- Можно так же преобразовать объекты

<pre><code class="python">
import pickle

class Tiny():
    def __str__(self):
        return 'tiny'

file_name = 'binary_object.bin'

def write_binary_data():
    with open(file_name, 'wb') as file:
        tiny = Tiny()
        print(tiny)
        pickled = pickle.dumps(tiny)
        file.write(pickled)

def read_binary_data():
    with open(file_name, 'rb') as file:
        data = file.read()
        obj = pickle.loads(data)
        print(obj)

write_binary_data()
read_binary_data()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
tiny
tiny
</code></pre>

<pre><code class="python">
$ cat binary_object.bin 
�c__main__
Tiny
q)�q.$ 
$
</code></pre>

# Работа с БД

## DB-API

- дока - [http://bit.ly/db-api](http://bit.ly/db-api)

## SQLite

<pre><code class="python">
import sqlite3

conn = sqlite3.connect('test.db')
curs = conn.cursor()

curs.execute('''
    CREATE TABLE zoo (
        name VARCHAR(20) PRIMARY KEY,
        count INT,
        cost FLOAT
    )
'''
)

insert = 'INSERT INTO zoo (name, count, cost) VALUES (?, ?, ?)'
res = curs.execute(insert, ('медведь', 1, 1000.1))

curs.execute('SELECT * FROM zoo')
rows = curs.fetchall()
print(rows)

curs.close()
conn.commit()
conn.close()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
[('медведь', 1, 1000.1)]
</code></pre>

## MySQL

<pre><code class="python">

</code></pre>

## PostgreSQL

- Для начала нужно установить драйвер -

<pre><code class="python">
sudo apt-get install postgresql python-psycopg2 libpq-dev
pip3 install psycopg2
</code></pre>

- Саму БД можно поднять в докере

<pre><code class="python">
PG_VER=11
sudo mkdir -p /var/tmp/pg_data/local/${PG_VER};
docker run --rm -d --name postgres -e POSTGRES_PASSWORD=1234 --net=host -v /var/tmp/pg_data/local/${PG_VER}:/var/lib/postgresql/data/ postgres:${PG_VER}
sleep 3;
psql -p 5432 -U postgres -h localhost -c 'create database local_db'
</code></pre>

<pre><code class="python">
import psycopg2

conn = psycopg2.connect(
    host = 'localhost',
    port = 5432,
    user = 'postgres',
    password = 1234,
    database = 'local_db'
)

curs = conn.cursor()

curs.execute('''
    CREATE TABLE public.zoo (
        name VARCHAR(20) PRIMARY KEY,
        count INT,
        cost FLOAT
    )
''')

insert = "INSERT INTO zoo (name, count, cost) VALUES (%(name)s, %(count)s, %(cost)s)"
res = curs.execute(insert, {'name': 'медведь', 'count': 1, 'cost': 1000.1})

curs.execute('SELECT * FROM zoo')
rows = curs.fetchall()
print(rows)

curs.close()
conn.commit()
conn.close()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
[('медведь', 1, 1000.1)]
$
</code></pre>

Как и с sqlite если в конце не сделать commit, то ничего не сохраниться

- По сравнению с sqlite, формат `curs.execute(insert)` принимает шаблон (специфичный) или готовую строку.
    - Можно как обычное процентное форматирование

    <pre><code class="python">
    "INSERT INTO zoo (name, count, cost) VALUES (%s, %s, %s)"
    </code></pre>

    - Так и передать словарь

    <pre><code class="python">
    "INSERT INTO zoo (name, count, cost) VALUES (%(name)s, %(count)s, %(cost)s)"
    </code></pre>

Как оно вообще заработало в sqlite?

## SQLAlchemy

- [https://www.sqlalchemy.org/](https://www.sqlalchemy.org/)
- [http://bit.ly/conn-pooling](http://bit.ly/conn-pooling)
- [http://bit.ly/obj-rel-tutorial](http://bit.ly/obj-rel-tutorial)

<pre><code class="python">
pip3 install sqlalchemy
</code></pre>

- Строка подключения к БД

<pre><code class="python">
dialect + driver :// user : password @ host : port / dbname
</code></pre>

- dialect - тип БД
- driver - драйвер
- user и password - параметры подключения
- host и port - расположения сервера БД
- dbname - имя БД

### Уровень движка (чуть лучше DB-API)

<pre><code class="python">
import sqlalchemy as sa

conn = sa.create_engine('postgresql+psycopg2://postgres:1234@localhost:5432/local_db')

result = conn.execute('''
    CREATE TABLE IF NOT EXISTS public.zoo (
        name VARCHAR(20) PRIMARY KEY,
        count INT,
        cost FLOAT
    )
''')

print(result)

insert = "INSERT INTO zoo (name, count, cost) VALUES (%s, %s, %s)"

conn.execute(insert, ('медведь', 1, 1000.0))
conn.execute(insert, ('утка', 4, 400.0))
conn.execute(insert, ('ласка', 2, 400.0))

rows = conn.execute('SELECT * FROM zoo')
print(rows)

for row in rows:
    print(row)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;sqlalchemy.engine.result.ResultProxy object at 0x7f92af7aa080&gt;
&lt;sqlalchemy.engine.result.ResultProxy object at 0x7f92af7aa390&gt;
('медведь', 1, 1000.0)
('утка', 4, 400.0)
('ласка', 2, 400.0)
</code></pre>

После выполнения SELECT, вернется объект ResultProxy по которому можно итерироваться

### Язык выражений SQL (level up)

<pre><code class="python">
import sqlalchemy as sa

conn = sa.create_engine('postgresql+psycopg2://postgres:1234@localhost:5432/local_db')

meta = sa.MetaData()
print(meta)

zoo = sa.Table('zoo', meta,
    sa.Column('name',  sa.String, primary_key = True),
    sa.Column('count', sa.Integer),
    sa.Column('cost',  sa.Float)
)

meta.create_all(conn)

# Нужно больше скобок, богу скобок
conn.execute( zoo.insert( ('медведь', 1, 1000.0) ) )
conn.execute( zoo.insert( ('утка', 4, 400.0) ) )
conn.execute( zoo.insert( ('ласка', 2, 400.0) ) )

# По факту превращается в 
# [SQL: INSERT INTO zoo (name, count, cost) VALUES (%(name)s, %(count)s, %(cost)s)]
# [parameters: {'count': 1, 'name': 'медведь', 'cost': 1000.0}]

result = conn.execute( zoo.select() )
rows = result.fetchall()
print(rows)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
MetaData(bind=None)
[('медведь', 1, 1000.0), ('утка', 4, 400.0), ('ласка', 2, 400.0)]
$
</code></pre>

### The Object-Relational Mapper (ORM)

<pre><code class="python">
import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

conn = sa.create_engine('postgresql+psycopg2://postgres:1234@localhost:5432/local_db')

# DDL

Base = declarative_base()
class Zoo(Base):
    __tablename__ = 'zoo'
    name  = sa.Column('name',  sa.String, primary_key = True)
    count = sa.Column('count', sa.Integer)
    cost  = sa.Column('cost',  sa.Float)

    def __init__(self, name, count, cost):
        self.name  = name
        self.count = count
        self.cost  = cost

    def __repr__(self):
        return '&lt;Zoo({}, {}, {})&gt;'.format(self.name, self.count, self.cost)

Base.metadata.create_all(conn)

# DML

one = Zoo('медведь', 1, 1000.0)
two = Zoo('утка', 4, 400.0)
three = Zoo('ласка', 2, 400.0)

print(one)

Session = sessionmaker(bind = conn)
session = Session()

session.add(one)
session.add_all([two, three])

session.commit()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;Zoo(медведь, 1, 1000.0)&gt;
</code></pre>

<pre><code class="python">
name   | count | cost 
---------+-------+------
 медведь |     1 | 1000
 утка    |     4 |  400
 ласка   |     2 |  400
(3 rows)
</code></pre>

# NoSQL - не только SQL

## dbm

- dbm - хранилка ключ/значение на диске. В принципе удобно не надо ничего подымать

<pre><code class="python">
import dbm

db = dbm.open('local_file.db', 'c')

db['test1'] = 'hello'
db['test2'] = 'world'

# Сколько эл. в хранилище
print( len(db) )
# 2

# Значение эл. test1
print( type(db['test1']) )
print( db['test1'] )
# &lt;class 'bytes'&gt;
# b'hello'

db.close()

db = dbm.open('local_file.db', 'c')

print( db['test2'] )
# b'world'
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
2
&lt;class 'bytes'&gt;
b'hello'
b'world'
</code></pre>

## Memcached

doc - [https://github.com/eguven/python3-memcached](https://github.com/eguven/python3-memcached)

- сервер кеширования строк. Основное плюшки
- Уст и получать значения
- Увел и умень значения

<pre><code class="python">
docker run --rm -d --name memcached --net=host memcached
</code></pre>

<pre><code class="python">
pip3 install python-memcached
</code></pre>

Проверить можно через telnet, но как-то сложно...

<pre><code class="python">
~$ telnet localhost 11211
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
get foo  
END
</code></pre>

<pre><code class="python">
import memcache

db = memcache.Client(['localhost:11211'])

db.set('foo', 'bar')
print( db.get('foo') )
# bar

db.set('test1', 0)
print( db.get('test1') )
# 0

db.incr('test1')
print( db.get('test1') )
# 1
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
bar
0
</code></pre>

## Redis

- redis - сервер структуры данных. Основные плюшки
- сохраняет данные на диск в случае перезагрузки
- больше ассортимент по структурам данных

<pre><code class="python">
docker run --rm -d --name redis --net=host redis
redis-cli -h localhost -p 6379
</code></pre>

<pre><code class="python">
pip3 install redis
</code></pre>

### Строки

<pre><code class="python">
import redis

redis = redis.Redis()
# или redis = redis.Redis('localhost')
# или redis = redis.Redis('localhost', 6379)

# Записать и получить значение
redis.set('test1', 'hello')

print( type( redis.get('test1') ) )
print( redis.get('test1') )
# &lt;class 'bytes'&gt;
# b'hello'

# setnx - Записать если ключа нет
redis.setnx('test2', 'world')

print( redis.get('test2') )
# b'world'

redis.setnx('test2', 'alarm')
print( redis.get('test2') )
# b'world'

# getset - уст новое значение и вернуть старое
print( redis.getset('test2', 'alarm') )
print( redis.get('test2') )
# b'world'
# b'alarm'

# getrange - вернуть часть строки
print( redis.getrange('test2', -3, -1) )
# b'arm'

# Если ключа не будет - то вернется пустая строка
print( redis.getrange('test3', 0, 0) )
# b''

# setrange - заменить часть строки
redis.setrange('test2', 0, '12')
print( redis.get('test2') )
# b'12arm'

# Если ключа не будет - то исключение если выход за диапазон
# print( redis.setrange('test3', -1, '12') )
# print( redis.get('test3') )

# mset - уст значения сразу нескольким ключам
redis.mset({'test4': 4, 'test5': 5})

# mget - получить значения по нескольким ключам
print( redis.mget(['test4', 'test5']) )
# [b'4', b'5']

# delete - удалить ключ
redis.delete('test4')
print( redis.get('test4') )
# None

# incr - инкремент
print( redis.incr('test4') )
# 1

# decr - декремент
print( redis.decr('test4') )
# 0
</code></pre>

<pre><code class="python">
&lt;class 'bytes'&gt;
b'hello'
b'12arm'
b'12arm'
b'12arm'
b'alarm'
b'arm'
b''
b'12arm'
[b'4', b'5']
None
1
0
</code></pre>

### Списки

<pre><code class="python">
#!/usr/bin/env python3

import redis

redis = redis.Redis()
# или redis = redis.Redis('localhost')
# или redis = redis.Redis('localhost', 6379)

# lpush - добавить в начало списка 
redis.lpush('zoo', 'медведь')

# lindex - получить эл. по смещению
print( str( redis.lindex('zoo', 0).decode('utf8') ) )
# медведь

# linsert - добавить эл. относительно смещения (before/after)
redis.linsert('zoo', 'before', 'медведь', 'лиса')
print( str( redis.lindex('zoo', 0).decode('utf8') ) )
# лиса

redis.linsert('zoo', 'after', 'лиса', 'утка')
print( str( redis.lindex('zoo', 1).decode('utf8') ) )
# утка

# lset - добавить в индекс 
redis.lset('zoo', 2, 'крокодил')
print( str( redis.lindex('zoo', 2).decode('utf8') ) )
# крокодил

# rpush - добавить в конец списка
redis.rpush('zoo', 'слон')

# lrange - получить список в диапазоне
print('\nlrange:');
print( [i.decode('utf8') for i in redis.lrange('zoo', 0, 3) ] )

# ltrim - обрезать список по диапазону
print('\nltrim:');
print( redis.ltrim('zoo', 1, 3) )
print( [i.decode('utf8') for i in redis.lrange('zoo', 0, 3) ] )

redis.flushall()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
медведь
лиса
утка
крокодил

lrange:
['лиса', 'утка', 'крокодил', 'слон']

ltrim:
True
['утка', 'крокодил', 'слон']
</code></pre>

### Хеши

<pre><code class="python">
#!/usr/bin/env python3

import redis

redis = redis.Redis()
# или redis = redis.Redis('localhost')
# или redis = redis.Redis('localhost', 6379)

music = { 'artist': 'You Me At Six', 'name': 'Room to Breathe' }

# hmset - записать хеш
print("\nhmset:")
print( redis.hmset('music', music) )

# hmget - получить несколько значений по ключам
print("\nhmget:")
print( redis.hmget('music', 'artist', 'name') )

# hset - записать новое значение ключа хеша
print("\nhset:")
print( redis.hset('music', 'test1', 1) )

# hget - получить значение ключа
print("\nhget:")
print( redis.hget('music', 'test1') )

# hkeys - получить все ключи хеша
print("\nhkeys:")
print( redis.hkeys('music') )

# hvals - получить все значения хеша
print("\nhvals:")
print( redis.hvals('music') )

# hgetall - получить все ключи и значения хеша
print("\nhgetall:")
print( redis.hgetall('music') )

# hlen - получить кол-во ключей
print("\nhlen:")
print( redis.hlen('music') )

# hsetnx - записать новый эл. если нет такого ключа
print("\nhsetnx:")
print( redis.hsetnx('music', 'test2', 2) )
print( redis.hsetnx('music', 'test2', 2) )

redis.flushall()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 

hmset:
True

hmget:
[b'You Me At Six', b'Room to Breathe']

hset:
1

hget:
b'1'

hkeys:
[b'artist', b'name', b'test1']

hvals:
[b'You Me At Six', b'Room to Breathe', b'1']

hgetall:
{b'test1': b'1', b'artist': b'You Me At Six', b'name': b'Room to Breathe'}

hlen:
3

hsetnx:
1
0
</code></pre>

### Множества

#TODO стр. 250

### Упорядоченные множества

#TODO стр. 251

### Биты

#TODO стр. 253

## Full-Text Databases

#TODO стр. 255

- Lucene - pylucene
- Solr - SolPython
- ElasticSearch - pyes
- Sphinx - sphinxapi
- Xapian - xappy
- Whoosh - Написан на Python, уже содержит API


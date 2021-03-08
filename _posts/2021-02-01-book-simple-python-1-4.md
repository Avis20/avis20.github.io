---
title: Заметки по книге "Простой python" [Глава 1-4]
tags: [book, python]
reference:
  -
    link:
    title:

---

* TOC 
{:toc}


# Глава 1. Python: с чем его едят

Created: Jan 24, 2021 11:27 AM

В книге пример с youtube, но ссылка похоже очень старая и уже давно не работает - [https://gdata.youtube.com/feeds/api/standardfeeds/top_rated?alt=json](https://gdata.youtube.com/feeds/api/standardfeeds/top_rated?alt=json)

В место нее я использовал json placeholder - [https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)

Без библиотеки requests

<pre><code class="python">
import json # Импорт всей библиотеки json
from urllib.request import urlopen

url = "https://jsonplaceholder.typicode.com/users"

response = urlopen(url)
content = response.read()
text = content.decode('utf8')
data = json.loads(text)

for user in data:
   print(user['username'], ' - ', user['email'], ' - ', user['phone'])
</code></pre>

- exp
    1. Импорт всей библиотеки json
    2. Импорт только функции urlopen из либы urllib.request
    3. Присвоение переменной значения с url до api
    4. Делаем запрос на сервер
    5. Записываем ответ от сервера в переменную content
    6. Декодим ответ от сервера
    7. Преобразуем строку с json в структуру для работы в python
    8. Цикл по списку пользователей
    9. Вывод данных о юзере
- пример json-а

    <pre><code class="python">
    [
      {
        "username": "Bret",
        "email": "Sincere@april.biz",
        "phone": "1-770-736-8031 x56442"
      },
      {
        "username": "Antonette",
        "email": "Shanna@melissa.tv",
        "phone": "010-692-6593 x09125"
      },
    ]
    </code></pre>

С библиотекой 

<pre><code class="python">
import requests
url = "https://jsonplaceholder.typicode.com/users"

response = requests.get(url)
data = response.json()
for user in data:
    print(user['username'], ' - ', user['email'], ' - ', user['phone'])
</code></pre>

- exp
    1. Импорт всей библиотеки requests
    2. Присвоение переменной значения url-а
    3. Выполнение запроса
    4. Пока не знаю
    5. Вывод информации о пользователе

ответ

<pre><code class="python">
$ python3 request_example.py 
Bret  -  Sincere@april.biz  -  1-770-736-8031 x56442
Antonette  -  Shanna@melissa.tv  -  010-692-6593 x09125
Samantha  -  Nathan@yesenia.net  -  1-463-123-4447
Karianne  -  Julianne.OConner@kory.org  -  493-170-9623 x156
Kamren  -  Lucio_Hettinger@annie.ca  -  (254)954-1289
Leopoldo_Corkery  -  Karley_Dach@jasper.info  -  1-477-935-8478 x6430
Elwyn.Skiles  -  Telly.Hoeger@billy.biz  -  210.067.6132
Maxime_Nienow  -  Sherwood@rosamond.me  -  586.493.6943 x140
Delphine  -  Chaim_McDermott@dana.io  -  (775)976-6794 x41206
Moriah.Stanton  -  Rey.Padberg@karina.biz  -  024-648-3804
</code></pre>

# Глава 2. Ингредиенты Python: числа, строки и переменные

Created: Jan 24, 2021 11:27 AM

Присваивание переменной

<pre><code class="python">
>>> a = 2
>>> print(a)
2
>>> b = a
>>> print(b)
2
>>>
</code></pre>

### Узнать тип переменной `type`

<pre><code class="python">
>>> type(a)
&lt;class 'int'&gt;
>>> type(b)
&lt;class 'int'&gt;
>>> type(21)
&lt;class 'int'&gt;
>>> type(9.9)
&lt;class 'float'&gt;
>>> type('dsa')
&lt;class 'str'&gt;
>>>
</code></pre>

### Зарезервированные слова

[Зарезервированные слова](%D0%93%D0%BB%D0%B0%D0%B2%D0%B0%202%20%D0%98%D0%BD%D0%B3%D1%80%D0%B5%D0%B4%D0%B8%D0%B5%D0%BD%D1%82%D1%8B%20Python%20%D1%87%D0%B8%D1%81%D0%BB%D0%B0,%20%D1%81%D1%82%D1%80%D0%BE%D0%BA%D0%B8%20%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%208afe12d8f91547609d0ec67bd923e1c9/%D0%97%D0%B0%D1%80%D0%B5%D0%B7%D0%B5%D1%80%D0%B2%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%20%D1%81%D0%BB%D0%BE%D0%B2%D0%B0%200dd815cbd19f4ed2b7bef379b085bc63.md)

## Числа

### Целые числа (`int`)

Пример

<pre><code class="python">
>>> 58
58
>>> a = 58
>>> print(a)
58
>>> type(a)
&lt;class 'int'&gt;
>>>
</code></pre>

### Преобразование в целое число `int`

<pre><code class="python">
>>> int(True)
1
>>> int(89.2)
89
>>> int('89')
89
>>>
</code></pre>

Преобразовать строку к Int можно только если в строке валидное число
Иначе будет исключение

<pre><code class="python">
>>> int('89.2')
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in <module&gt;
ValueError: invalid literal for int() with base 10: '89.2'

</code></pre>

### Дробные числа (`float`)

Пример

<pre><code class="python">
>>> 89.2
89.2
>>> b = 25.3
>>> print(b)
25.3
>>> type(b)
&lt;class 'float'&gt;
>>>
</code></pre>

### Преобразование в дробное число `float`

<pre><code class="python">
>>> float(True)
1.0
>>> float(89)
89.0
>>> float('89')
89.0
>>> float('89.1')
89.1
</code></pre>

Тоже самое и с дробным числом

<pre><code class="python">
>>> float('89.1a')
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in <module&gt;
ValueError: could not convert string to float: '89.1a'
>>>
</code></pre>

### Операторы

[Операторы](%D0%93%D0%BB%D0%B0%D0%B2%D0%B0%202%20%D0%98%D0%BD%D0%B3%D1%80%D0%B5%D0%B4%D0%B8%D0%B5%D0%BD%D1%82%D1%8B%20Python%20%D1%87%D0%B8%D1%81%D0%BB%D0%B0,%20%D1%81%D1%82%D1%80%D0%BE%D0%BA%D0%B8%20%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%208afe12d8f91547609d0ec67bd923e1c9/%D0%9E%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%202067b892ceeb49fca2c051612b199c03.csv)

## Строки

Пример

<pre><code class="python">
>>> 'text'
'text'
>>> c = 'text'
>>> print(c)
text
>>> type(c)
&lt;class 'str'&gt;
>>> c = "text"
>>> type(c)
&lt;class 'str'&gt;
>>>
</code></pre>

### Многострочный текст

<pre><code class="python">
>>> '''hello
... world'''
'hello\nworld'
>>> a = '''hello
... world'''
>>> print(a)
hello
world
>>>
</code></pre>

### Преобразование в строку `str`

пример

<pre><code class="python">
>>> str(12)
'12'
>>> str(True)
'True'
>>> str(89.2)
'89.2'
>>>
</code></pre>

### Конкатенация `+`

<pre><code class="python">
>>> "hello" + " world"
'hello world'
>>>
</code></pre>

### Умножение строки `*`

<pre><code class="python">
>>> 'test ' * 3
'test test test '
>>>
</code></pre>

### Посимвольное обращение к строке `[]`

<pre><code class="python">
>>> text = "Lorem ipsum dolor sit amet"
>>> text[0] -- первый символ
'L'
>>> text[-1] -- последний символ
't'
>>> text[0:3] -- 3 символа с начала
'Lor'
>>> text[:-1] -- Вырезать последний символ
'Lorem ipsum dolor sit ame'
>>>
</code></pre>

При выходе за пределы строки, происходит ошибка

<pre><code class="python">
>>> text[100]
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in <module&gt;
IndexError: string index out of range
>>>
</code></pre>

### Обращение к подстроке `[ start : end : step]`

- Оператор `[:]` возвращает всю строку
- Оператор `[start:]` - от start до конца
- Оператор `[:end]` - от начала строки до end - 1
- Оператор `[start:end]` - от start до end
- Оператор `[start:end:step]` - от start до end с шагом step

Развернуть строку

<pre><code class="python">
>>> text[-1::-1]
'tema tis rolod muspi meroL'
>>>
</code></pre>

### Длина строки `len`

<pre><code class="python">
>>> len(text)
26
>>>
</code></pre>

### Разбить строку `split`

<pre><code class="python">
>>> text.split(' ')
['Lorem', 'ipsum', 'dolor', 'sit', 'amet']
>>>
</code></pre>

### Объединить строку `join`

<pre><code class="python">
>>> split_text = text.split(' ')
>>> ', '.join(split_text)
'Lorem, ipsum, dolor, sit, amet'
>>>
</code></pre>

### Начинается с ? `startswith`

<pre><code class="python">
>>> text.startswith('Lorem')
True
>>> text.startswith('Lor')
True
>>> text.startswith('Lor1')
False
>>>
</code></pre>

### Заканчивается на ? `endwith`

<pre><code class="python">
>>> text.endswith('amet')
True
>>> text.endswith('am')
False
>>>
</code></pre>

### `find`

### `rfind`

### `count`

### `isallnum`

## Регистр, выравнивание, замена строки

### `strip`

### `capitalize`

### `title`

### `upper`

### `lower`

### `swapcase`

### `center`

### `ljust`

### `rjust`

### `replace`

# Глава 3: Наполнение Python: списки, кортежи, словари и множества

Created: Jan 24, 2021 11:27 AM

## Списки

### Создание списка - `[]` или метод `list()`

Примеры списков

<pre><code class="python">
>>> empty_list = []
>>> print(empty_list)
[]
>>> test_list = list()
>>> print(test_list)
[]
>>> week_days = ['пн', 'вт']
>>> print(week_days)
['пн', 'вт']
>>>
</code></pre>

Элементы списка могут повторятся

<pre><code class="python">
>>> uniq_list = ['test1', 'test2', 'test1']
>>> print(uniq_list)
['test1', 'test2', 'test1']
</code></pre>

### Обращение к элементам списка

<pre><code class="python">
>>> uniq_list = ['test1', 'test2', 'test3']
>>> print(uniq_list[1])
test2
>>> print(uniq_list[-1]) # Последний эл. списка
test3
</code></pre>

При обращении к эл. списка которого нет - исключение

<pre><code class="python">
>>> print(uniq_list[3])
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in <module&gt;
IndexError: list index out of range
</code></pre>

Обращение к диапазону эл. и их замена 

<pre><code class="python">
>>> list
['test1', 'test2', 'test3']
>>> list[1:3]
['test2', 'test3']
>>> list[1:3] = ['test3', 1]
>>> list
['test1', 'test3', 1]
>>> list[1:3] = ['test3'] # Если не указать значение то эл. удалиться
>>> list
['test1', 'test3']
>>> list[1:3] = ['test3', 1, 2] # если указать больше - добавиться
>>> list
['test1', 'test3', 1, 2]
</code></pre>

Инверсия списка

<pre><code class="python">
>>> list = [1,2,3,4,5]
>>> list[::-1]
[5, 4, 3, 2, 1]
</code></pre>

### Многоуровневые списки

<pre><code class="python">
>>> list1 = ['test1', 'test2', 'test3']
>>> list2 = ['test4', 'test5', 'test6']
>>> list3 = [list1, li
license(  list(     list1     list2     
>>> list3 = [list1, list2]
>>> print(list3)
[['test1', 'test2', 'test3'], ['test4', 'test5', 'test6']]
>>> print(list3[1][2])
test6
</code></pre>

Эл. списка можно менять, а эл. строки - нельзя!

<pre><code class="python">
>>> list = ['test1', 'test2', 'test3']
>>> list
['test1', 'test2', 'test3']
>>> list[0] = 'test4'
>>> list
['test4', 'test2', 'test3']
>>> str = 'test'
>>> str[0] = 1
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in <module&gt;
TypeError: 'str' object does not support item assignment
</code></pre>

### Добавление в список

в конец - append

<pre><code class="python">
>>> list = [1,2,3]
>>> list.append(4)
>>> list
[1, 2, 3, 4]
</code></pre>

В начало списка = insert(0)

<pre><code class="python">
>>> list = [1,2,3]
>>> list.insert(0, 0)
>>> list
[0, 1, 2, 3]
</code></pre>

Также в конец списка - insert(len(), object)

<pre><code class="python">
>>> list.insert(len(list), 4)
>>> list
[0, 1, 2, 3, 4]
</code></pre>

### Удаление из списка: `del` и `remove`

del

<pre><code class="python">
>>> list = [1,2,3]
>>> list
[1, 2, 3]
>>> del list[0]
>>> list
[2, 3]
</code></pre>

remove

<pre><code class="python">
>>> list1 = ['test1', 'test2', 'test3']
>>> list1.remove('test1')
>>> list1
['test2', 'test3']
</code></pre>

### Вернуть эл. из списка и удалить его: `pop`

Вернуть 1-й эл

<pre><code class="python">
>>> list1 = [1,2,3]
>>> list1.pop(0)
1
>>> list1
[2, 3]
</code></pre>

Вернуть последний эл.

<pre><code class="python">
>>> list1 = [1,2,3]
>>> list1.pop()
3
>>> list1.pop(-1)
2
</code></pre>

Вернуть n-й эл.

<pre><code class="python">
>>> list1 = [1,2,3]
>>> list1.pop(1)
2
>>> list1
</code></pre>

### Узнать позицию эл. в списке: `index`

<pre><code class="python">
>>> list1 = ['test1', 'test2', 'test3']
>>> list1.index('test2')
1
</code></pre>

Если будет 2 одинаковых эл. то вернется 1-й индекс

<pre><code class="python">
>>> list1 = ['test1', 'test2', 'test3', 'test1', 'test2']
>>> list1.index('test2')
1
</code></pre>

Если не будет найден эл. - исключение

<pre><code class="python">
>>> list1 = ['test1', 'test2', 'test3', 'test1', 'test2']
>>> list1.index('test')
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in <module&gt;
ValueError: 'test' is not in list
</code></pre>

### Узнать есть ли эл. в списке: `in`

<pre><code class="python">
>>> list1 = ['test1', 'test2', 'test3']
>>> 'test1' in list1
True
>>> 'test5' in list1
False
</code></pre>

### Скопировать список: `copy`, `list`, `[:]`

copy

<pre><code class="python">
>>> list1 = ['test1', 'test2', 'test3
>>> list2 = list1.copy()
>>> list2
['test1', 'test2', 'test3']
</code></pre>

list

<pre><code class="python">
>>> list1 = ['test1', 'test2', 'test3']
>>> list2 = list(list1)
>>> list2
['test1', 'test2', 'test3']
>>> list1.append('test4')
>>> list1
['test1', 'test2', 'test3', 'test4']
>>> list2
['test1', 'test2', 'test3']
</code></pre>

[:]

<pre><code class="python">
>>> list1 = ['test1', 'test2', 'test3']
>>> list2 = list1[:]
>>> list1
['test1', 'test2', 'test3']
>>> list1.append('test4')
>>> list1
['test1', 'test2', 'test3', 'test4']
>>> list2
['test1', 'test2', 'test3']
</code></pre>

## Кортежи

### Создание кортежа: `()`

<pre><code class="python">
>>> empty_tuple = ()
>>> empty_tuple
()
>>>
</code></pre>

еще

<pre><code class="python">
>>> tuple = ('test1', 'test2', 'test3')
>>> tuple
('test1', 'test2', 'test3')
>>> tuple2 = 'test1', 'test2', 'test3'
>>> tuple
('test1', 'test2', 'test3')
>>> tuple2
('test1', 'test2', 'test3')
</code></pre>

Можно вывести в переменные

<pre><code class="python">
>>> tuple = ('test1', 'test2', 'test3')
>>> t1, t2, t3 = tuple
>>> t1
'test1'
>>> t2
'test2'
>>> t3
'test3'
</code></pre>

(Как и списки)

<pre><code class="python">
>>> list = ['test1', 'test2', 'test3']
>>> t1, t2, t3 = list
>>> t1
'test1'
</code></pre>

Поменять значение 2-х переменных

<pre><code class="python">
>>> test1 = 'test3'
>>> test3 = 'test1'
>>> test1, test3
('test3', 'test1')
>>> test1, test3 = test3, test1
>>> test1, test3
('test1', 'test3')
</code></pre>

Как и списки, кортежи можно объединить через +=

<pre><code class="python">
>>> test_tuple1 = 'test1', 'test2'
>>> test_tuple2 = 'test3', 'test4'
>>> test_tuple1 += test_tuple2
>>> test_tuple1
('test1', 'test2', 'test3', 'test4')
>>>
</code></pre>

## Словари

### Создание словаря: `{}`

<pre><code class="python">
>>> empty_dict = {}
>>> empty_dict
{}
>>> dict = {'test1': 1, 'test2': 2}
>>> dict
{'test2': 2, 'test1': 1}
</code></pre>

### Преобразование в словарь: `dict()`

<pre><code class="python">
>>> list1 = [['test1', 'test2']]
>>> dict(list1)
{'test1': 'test2'}
>>> list1 = [['test1', 'test2'], ['test3', 1]]
>>> dict(list1)
{'test3': 1, 'test1': 'test2'}
</code></pre>

### Добавление/изменения эл. в словаре: `[]`

Добавить

<pre><code class="python">
>>> test_dict = {'test1': 1, 'test2': 2}
>>> test_dict
{'test1': 1, 'test2': 2}
>>> test_dict['test3'] = 3
>>> test_dict
{'test3': 3, 'test1': 1, 'test2': 2}
</code></pre>

Обновить

<pre><code class="python">
>>> test_dict = {'test1': 1, 'test2': 2}
>>> test_dict['test1'] = 3
>>> test_dict
{'test1': 3, 'test2': 2}
</code></pre>

### Удалить эл. словаря: `del`

<pre><code class="python">
>>> test_dict1 = {'test1': 1, 'test2': 2}
>>> del test_dict['test1']
>>> test_dict
{'test2': 2}
</code></pre>

## Множества

Множество - список из уникальных значений

### Создание множества: `set()`

<pre><code class="python">
>>> empty_set = set()
>>> empty_set
set()
>>> test_set = {1,2,3,4,4}
>>> test_set
{1, 2, 3, 4}
</code></pre>

### Преобразовать в множеств

Срока превращается в множество из уникальных значений

<pre><code class="python">
>>> set('hello')
{'l', 'e', 'o', 'h'}
</code></pre>

Список - в уникальное множество

<pre><code class="python">
>>> set(['test1', 'test2', 'test3', 'test1'])
{'test3', 'test2', 'test1'}
</code></pre>

Словарь - в уникальное множество из ключей словаря

<pre><code class="python">
>>> test_dict = {'test1': 1, 'test2': 2, 'test3': 3}
>>> set(test_dict)
{'test2', 'test3', 'test1'}
# В принципе тоже самое что и keys, только множество
>>> test_dict = {'test1': 1, 'test2': 2, 'test3': 3}
>>> list(test_dict.keys())
['test3', 'test2', 'test1']
</code></pre>

Словарь значений - в уникальное множество из значений словаря

<pre><code class="python">
>>> test_dict = {'test1': 1, 'test2': 2, 'test3': 1}
>>> set(test_dict.values())
{1, 2}
</code></pre>

# Глава 4: Корочка Python: структуры кода

Created: Jan 24, 2021 11:27 AM

## Комментарии: `#`

<pre><code class="python">
>>> # Коммент
... 2 + 1
3
>>>
</code></pre>

## Продолжение строки: `\`

<pre><code class="python">
>>> 2 + 1 + \
... 3
6
>>>
</code></pre>

## Операторы: `if`, `elif`, `else`

if

<pre><code class="python">
a = True

if a:
    print("a is True")
else:
    print("a is False")
$ python3 ./test.py 
a is True
</code></pre>

Много if

<pre><code class="python">
a = False
b = False

if a:
    if b:
        print("a and b is True")
    else:
        print("a is True and b is False")
else:
    if b:
        print("a is False and b is True")
    else:
        print("a and b is False")

$ python3 ./test.py 
a and b is False
</code></pre>

elif

<pre><code class="python">
color = "green"

if color == "red":
    print("color is red")
elif color == "green":
    print("color is green")
else:
    print("color is other color")
</code></pre>

## Булево сравнение: `and` `or` `!`

- = - равенство

<pre><code class="python">
>>> x = 7
>>> x == 7
True
>>> x == 5
False
</code></pre>

- != - неравенство

<pre><code class="python">
>>> x != 5
True
>>> x != 7
False
</code></pre>

- < - меньше

<pre><code class="python">
>>> x < 5
False
>>> x < 10
True
>>> x < 7
False
</code></pre>

- <= - меньше или равно

<pre><code class="python">
>>> x <= 10
True
>>> x <= 7
True
>>> x <= 5
False
</code></pre>

- > - больше

<pre><code class="python">
>>> x > 5
True
>>> x > 7
False
>>> x > 10
False
</code></pre>

- >= - больше или равно

<pre><code class="python">
>>> x >= 5
True
>>> x >= 7
True
>>> x > 10
False
</code></pre>

- in - включение

<pre><code class="python">
>>> numbers = [1,2,3]
>>> 2 in numbers
True
>>> 7 in numbers
False
</code></pre>

---

- and

<pre><code class="python">
>>> x > 5 and x < 10
True
>>> x > 10 and x < 10
False
</code></pre>

- or

<pre><code class="python">
>>> x > 5 or x > 10
True
</code></pre>

## Что есть ложь?

- Булева переменная False
- Значение None
- Целое число 0
- Дробное число 0.0
- пустая строка ('')
- пустой список ([])
- пустой кортеж (())
- пустой словарь ({})
- пустое множество (set())

Все остальное - истина!

## Оператор: `while`

<pre><code class="python">
count = 1
while count <= 5:
    print(count)
    count += 1

$ python3 ./test.py 
1
2
3
4
5
</code></pre>

break

<pre><code class="python">
while True:
    str = input("Введите символ [q для выхода]: ")
    if str == "q":
        break
    print(str.capitalize())

$ python3 ./test.py 
Введите символ [q для выхода]: w
W
Введите символ [q для выхода]: ee
Ee
Введите символ [q для выхода]: привет
Привет
Введите символ [q для выхода]: привет как дела?
Привет как дела?
Введите символ [q для выхода]: q
</code></pre>

continue

<pre><code class="python">
while True:
    val = input("Введите число [q для выхода]: ")
    if val == "q":
        break
    number = int(val)
    if number % 2 == 0:
        continue
    print(number, " Квадрат числа ", number*number )

$ python3 ./test.py 
Введите число [q для выхода]: 1
1  Квадрат числа  1
Введите число [q для выхода]: 2
Введите число [q для выхода]: 3
3  Квадрат числа  9
Введите число [q для выхода]: 4
Введите число [q для выхода]: 5
5  Квадрат числа  25
Введите число [q для выхода]: 6
Введите число [q для выхода]: 7
7  Квадрат числа  49
Введите число [q для выхода]:
</code></pre>

else

<pre><code class="python">
numbers = [1, 3, 5, 2]
index = 0
while index < len(numbers):
    number = numbers[index]
    if number % 2 == 0:
        print("Есть четное число!", number)
        break
    index += 1
else:
    print("Не найдено четных чисел")
</code></pre>

Если не был вызов break, то перейдет в else

## Оператор: `for`

<pre><code class="python">
>>> test_list = ['test1', 'test2', 'test3']
>>> for item in test_list:
...     print(item)
... 
test1
test2
test3
>>>
</code></pre>

если по строке - то цикл по символьно

<pre><code class="python">
>>> for letter in 'hello, world!':
...     print(letter)
... 
h
e
l
l
o
,
 
w
o
r
l
d
!
</code></pre>

по словарю, по умолчанию вернет ключи

<pre><code class="python">
>>> test_dict = {'test1': 1, 'test2': 2, 'test3': 3}
>>> for key in test_dict:
...     print(key)
... 
test1
test3
test2
</code></pre>

по значениям

<pre><code class="python">
>>> test_dict = {'test1': 1, 'test2': 2, 'test3': 3}
>>> for val in test_dict.values():
...     print(val)
... 
1
3
2
</code></pre>

по ключам и значениям

<pre><code class="python">
>>> for key, val in test_dict.items():
...     print("Key is '", key, "' Value is '", val, "'")
... 
Key is ' test1 ' Value is ' 1 '
Key is ' test3 ' Value is ' 3 '
Key is ' test2 ' Value is ' 2 '
</code></pre>

else

<pre><code class="python">
test_list = ['test1', 'test2', 'test3']

for item in test_list:
    print(item)
    if item == 'test2':
        break
else:
    print("test")

$ python3 ./test.py 
test1
test2
</code></pre>

Если не был вызван break, то будет else

## Включения

<pre><code class="python">
>>> test_list = [n for n in range(1,6)]
>>> test_list
[1, 2, 3, 4, 5]
</code></pre>

Список из не четных чисел, к которым делается +10

<pre><code class="python">
>>> [n + 10 for n in range(1,6) if n % 2 == 1]
[11, 13, 15]
</code></pre>

### Включение словаря

<pre><code class="python">
>>> word = 'hello, world!'
>>> {letter: word.count(letter) for letter in word}
{'r': 1, 'l': 3, 'w': 1, ' ': 1, 'h': 1, ',': 1, '!': 1, 'o': 2, 'e': 1, 'd': 1}
</code></pre>

Без вызова count() дважды на одну букву - убрать дубли через set()

<pre><code class="python">
>>> {letter: word.count(letter) for letter in set(word)}
{'r': 1, 'l': 3, 'w': 1, 'd': 1, 'h': 1, ',': 1, '!': 1, 'o': 2, 'e': 1, ' ': 1}
</code></pre>

Убрать пробел

<pre><code class="python">
>>> {letter: word.count(letter) for letter in set(word) if letter != ' '}
{'r': 1, 'l': 3, 'w': 1, 'd': 1, 'h': 1, ',': 1, '!': 1, 'o': 2, 'e': 1}
</code></pre>

## Функции

<pre><code class="python">
def do_nothing():
    pass

do_nothing()
</code></pre>

<pre><code class="python">
def test_print():
    print('test_print in def test_print')

test_print()

$ python3 ./test.py 
test_print in def test_print
</code></pre>

### Ответ

Если не указан return, то вернется None

<pre><code class="python">
>>> def test_return():
...     1 + 1
... 
>>> print(test_return())
None
</code></pre>

### Передача аргументов и получение ответа

<pre><code class="python">
def check_color(color):
    if color == "red":
        return "color is red"
    elif color == "green":
        return "color is green"
    else:
        return "color is other color"
    
print(check_color("red"))
print(check_color("green"))
$ python3 ./test.py 
color is red
color is green
</code></pre>

### None это undef?

<pre><code class="python">
def test():
    pass

print(test())

$ python3 ./test.py 
None
</code></pre>

<pre><code class="python">
>>> def is_none(var):
...     if var is None:
...         print("It's None")
...     elif var:
...         print("It's True")
...     else:
...         print("It's False")
... 
>>> is_none(None)
It's None
>>> is_none(True)
It's True
>>> is_none(False)
It's False
>>> is_none([])
It's False
>>> is_none(())
It's False
>>> is_none([])
It's False
>>> is_none(0)
It's False
>>> is_none(0.0)
It's False
>>> is_none('')
It's False
>>> is_none("")
It's False
</code></pre>

### Позиционные аргументы

<pre><code class="python">
>>> def test_position(t1, t2, t3):
...     return {'test1': t1, 'test2': t2, 'test3': t3}
... 
>>> test_position(1,2,3)
{'test1': 1, 'test3': 3, 'test2': 2}
>>> test_position('a','b','c')
{'test1': 'a', 'test3': 'c', 'test2': 'b'}
</code></pre>

Порядок важен, и кол-во аргументов важно. Если не будет хотяб 1, то исключение - 

<pre><code class="python">
>>> test_position('a','b')
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in <module&gt;
TypeError: test_position() missing 1 required positional argument: 't3'
</code></pre>

больше тоже плохо

<pre><code class="python">
>>> test_position(1,2,3,4)
Traceback (most recent call last):
  File "&lt;stdin>", line 1, in <module&gt;
TypeError: test_position() takes 3 positional arguments but 4 were given
</code></pre>

### Аргументы key = value

Чтобы не сломалась последовательность, можно указать какая переменная чему равна

<pre><code class="python">
>>> def test_position(t1, t2, t3):
...     return {'test1': t1, 'test2': t2, 'test3': t3}
... 
>>> test_position(t2 = 1, t3 = 2, t1 = 3)
{'test1': 3, 'test3': 2, 'test2': 1}
</code></pre>

Также нельзя ни больше, ни меньше. Если будет 2 раза - исключение

<pre><code class="python">
>>> test_position(t2 = 1, t3 = 2, t1 = 3, t2 = 2)
  File "&lt;stdin&gt;", line 1
SyntaxError: keyword argument repeated
</code></pre>

### Значения по умолчанию

<pre><code class="python">
>>> def test_position(t1, t2, t3 = 't3'):
...     return {'test1': t1, 'test2': t2, 'test3': t3}
... 
>>> test_position(t2 = 1, t1 = 1)
{'test1': 1, 'test3': 't3', 'test2': 1}
</code></pre>

Дефолтные значения не чистятся!

<pre><code class="python">
def test_result(item, result=[]):
    result.append(item)
    return result

print(test_result(1))
print(test_result(2))
</code></pre>

Можно проверить на None перед запуском

<pre><code class="python">
def test_result(args, result=None):
    if result is None:
        result = []
    result.append(args)
    return result

print(test_result(1))
print(test_result(2))
print(test_result(3, [1,2]))

$ python3 ./test.py 
[1]
[2]
[1, 2, 3]
</code></pre>

### Позиционные аргументы через *

> Обычно пишется как *args

args - будет неизменяемый кортеж (tuple)

Если указать * перед аргументом, то при вызове получим кортеж из аргументов

<pre><code class="python">
def test_ask(*arg):
    print("Args is ", arg)

test_ask()
test_ask(1)
test_ask(1,2,3)

$ python3 test.py 
Args is  ()
Args is  (1,)
Args is  (1, 2, 3)
</code></pre>

удобно использовать как список "остальных" аргументов

<pre><code class="python">
def test_req(var1, var2, *args):
    print("Var1 is required", var1)
    print("Var2 is required", var2)
    print("Other params = ", args)

test_req('test1', 'test2', 'other test3')
</code></pre>

Порядок при этом важен!

Если будет 

<pre><code class="python">
def test_req(*args, var1, var2):
</code></pre>

то при обращении к функции - исключение

<pre><code class="python">
$ python3 test.py 
Traceback (most recent call last):
  File "test.py", line 9, in &lt;module&gt;
    test_req('other test3', 'test1', 'test2')
TypeError: test_req() missing 2 required keyword-only arguments: 'var1' and 'var2'
</code></pre>

Также нельзя установить по умолчанию

<pre><code class="python">
def test_req(var1, var2, *args = (1)):
    print("Var1 is required", var1)

$ python3 test.py 
  File "test.py", line 4
    def test_req(var1, var2, *args = (1)):
                                   ^
SyntaxError: invalid syntax
</code></pre>

### Аргументы через ** - словарь

Тоже самое что и кортеж всех остальных, только ключи почему-то должны быть не строкой?

<pre><code class="python">
def test_req(val1, **kwargs):
    print("Val1 is required", val1)
    print("Other key/value params = ", kwargs)
    print()

test_req(1, test1=1, test2=1, other_test3=1, yet_yet_yet = 3)

$ python3 test.py 
Val1 is required 1
Other key/value params =  {'test1': 1, 'test2': 1, 'other_test3': 1, 'yet_yet_yet': 3}
</code></pre>

### Дока к функциям: `help`

<pre><code class="python">
>>> def return1(var):
...     'Вернуть 1-й аргумент'
...     return(var)
... 
>>> help(return1)

Help on function return1 in module __main__:

return1(var)
    Вернуть 1-й аргумент
(END)
</code></pre>

<pre><code class="python">
def print_if_true(var, check):
    '''
    Вывести первый аргумент если второй аргумент равен True
    Аргументы:
        1. *var* - переменная которую нужно вывести
        2. *check* - переменная по которой проверяется
    '''
    if check:
        print(var)

help(print_if_true)

Help on function print_if_true in module __main__:

print_if_true(var, check)
    Вывести первый аргумент если второй аргумент равен True
    Аргументы:
        1. *var* - переменная которую нужно вывести
        2. *check* - переменная по которой проверяется
(END)
</code></pre>

Вывод похож на man страницу. Чтоб вывести как строку 

<pre><code class="python">
>>> print(return1.__doc__)
Вернуть 1-й аргумент
>>>
</code></pre>

<pre><code class="python">
print(print_if_true.__doc__)

$ python3 test.py 

    Вывести первый аргумент если второй аргумент равен True
    Аргументы:
        1. *var* - переменная которую нужно вывести
        2. *check* - переменная по которой проверяется
</code></pre>

## Функции - объекты первого класса. Поэтому можно передавать как аргументы

<pre><code class="python">
>>> def test():
...     pass
...
>>> type(test)
&lt;class 'function'&gt;
</code></pre>

Можно передать функцию как аргумент другой функции

<pre><code class="python">
>>> def answer():
...     print(42)
... 
>>> def run_func(func):
...     func()
... 
>>> run_func(answer)
42
</code></pre>

с аргументами

<pre><code class="python">
def sum_two(arg1, arg2):
    print(arg1 + arg2)

def run_two(func, v1, v2):
    func(v1, v2)

run_two(sum_two, 4, 5)

$ python3 test.py 
9
</code></pre>

### Функция в функции

<pre><code class="python">
def test_func1():
    def test_func2():
        print("Hello in func2")

    test_func2()
    print("Hello in func1")

test_func1()

$ python3 test.py 
Hello in func2
Hello in func1
</code></pre>

## Замыкания

> Замыкание — это функция, которая динамически генерируется другой функцией, и они обе могут изменяться и запоминать значения переменных, которые были созданы вне функции.

<pre><code class="python">
>>> def say_func(saying):
...     def print_say():
...         print(saying)
...     return print_say
... 
>>> a = say_func('test1')
</code></pre>

a - будет ссылкой на функцию внутри другой функции

<pre><code class="python">
>>> print(a)
&lt;function say_func.&lt;locals&gt;.print_say at 0x7fc7afc59c80&gt;
</code></pre>

Если вызвать - то вызовиться print_say

<pre><code class="python">
>>> a()
test1
</code></pre>

Если переменная глобальная, то каждый вызов будет работать с ней

<pre><code class="python">
test_list = []

def say_func():
    def print_say():
        test_list.append(1)
    return print_say

a = say_func()
b = say_func()
a()
b()

print(test_list)

$ python3 ./test.py 
[1, 1]
</code></pre>

Но у каждого замыкания будет своя локальная переменная

<pre><code class="python">
def say_func():
    test_list = []
    def print_say(item):
        test_list.append(item)
        print(test_list)
    return print_say

a = say_func()
b = say_func()
a(1)
b(2)
a('hello')
b('world')
</code></pre>

## Анонимные функции: `lambda()`

<pre><code class="python">
def edit_text(text, func):
    for word in text:
        func(word)

def edit_word(word):
    print(word.capitalize() + '!')

text = ['привет', 'я', 'список', 'слов', 'которые', 'нужно', 'изменить']
edit_text(text, edit_word)
</code></pre>

- edit_text - принимает текст и функцию
    - Для каждого слова в списке вызывается функция
- edit_word - принимает слово
    - выводит слово с большой буквы и с восклицательным знаком
- edit_text(text, edit_word) - передаем текст и функцию

<pre><code class="python">
$ python3 ./test.py 
Привет!
Я!
Список!
Слов!
Которые!
Нужно!
Изменить!
</code></pre>

тоже самое но через лямбду

<pre><code class="python">
def edit_text(text, func):
    for word in text:
        func(word)

text = ['привет', 'я', 'список', 'слов', 'которые', 'нужно', 'изменить']

edit_text(text, lambda word: print(word.capitalize() + '!'))
</code></pre>

- От слова lambda до двоеточия (:) - список аргументов.
- От : до закрывающей скобки - тело функции

можно даже в переменную сохранить))

<pre><code class="python">
>>> a = lambda : 1
>>> a
&lt;function &lt;lambda&gt; at 0x7fc7afc59d08&gt;
>>> a()
1
</code></pre>

## Генераторы

Особый тип списков - генераторы

<pre><code class="python">
>>> sum(range(1, 10))
45
</code></pre>

<pre><code class="python">
>>> def my_range(start = 0, end = 10, step = 1):
...     number = start
...     while number < end:
...         yield number
...         number += step
...
>>> print(my_range)
&lt;function my_range at 0x7f88811ac9d8&gt;
</code></pre>

че такое интересно `yield` ?

<pre><code class="python">
>>> r = my_range(1,5)
>>> print(r)
&lt;generator object my_range at 0x7f88811c4468&gt;
</code></pre>

Смысл генератора - один раз вызвать и он заканчивается)

<pre><code class="python">
def my_range(start = 0, end = 10, step = 1):
    number = start
    while number < end:
        yield number
        number += step

a = my_range(2, 10)
b = my_range(10, 20)

for x in b:
    print("B is ", x)
    for i in a:
        print("A is ", i)
</code></pre>

## Декораторы (обертки над функциями)

<pre><code class="python">
def print_debug(func):
    def new_func(*args, **kwargs):
        print("Вызов функции:", func.__name__)
        print("Дока функции:", func.__doc__)
        print("Позиционные аргументы:", args)
        print("Аргументы ключ/значение:", kwargs)
        result = func(*args, **kwargs)
        print("Результат:", result)
        return result
    return new_func

def sum_two(a, b):
    '''
    Функция сложения двух аргументов
    Возвращает сумму двух переданных аргументов
    '''
    return a + b

x = 22
y = 2

print(sum_two(x, y))

debug_func = print_debug(sum_two) # мануальное присваивание декоратора
debug_func(x, y)
</code></pre>

<pre><code class="python">
24
Вызов функции: sum_two
Дока функции: 
    Функция сложения двух аргументов
    Возвращает сумму двух переданных аргументов
    
Позиционные аргументы: (22, 2)
Аргументы ключ/значение: {}
Результат: 24
</code></pre>

- print_debug - возвращает функцию которая вызывается аж в последней строке

До этого момента это объект функции, но без вызова

<pre><code class="python">
debug_func = print_debug(sum_two)
print(debug_func)
&lt;function print_debug.<&lt;locals&gt;.new_func at 0x7f50313b6730&gt;
</code></pre>

В первом случае, просто вызов функции напрямую.

Через декоратор - идет обертка а затем вызов.

Не любой декоратор должен вызывать функцию

Можно добавить @название_декоратора в место мануального присваивания

<pre><code class="python">
def print_debug(func):
    print('AAAAAAAAa')
    def new_func(*args, **kwargs):
        print("Вызов функции:", func.__name__)
        print("Дока функции:", func.__doc__)
        print("Позиционные аргументы:", args)
        print("Аргументы ключ/значение:", kwargs)
        result = func(*args, **kwargs)
        print("Результат:", result)
        return result
    print('BBBBB')
    return new_func

@print_debug
def sum_two(a, b):
    '''
    Функция сложения двух аргументов
    Возвращает сумму двух переданных аргументов
    '''
    return a + b

x = 22
y = 2

print(sum_two(x, y))
</code></pre>

<pre><code class="python">
AAAAAAAAa
BBBBB
Вызов функции: sum_two
Дока функции: 
    Функция сложения двух аргументов
    Возвращает сумму двух переданных аргументов
    
Позиционные аргументы: (22, 2)
Аргументы ключ/значение: {}
Результат: 24
24
</code></pre>

Как видно, в начале вызов декоратора, потом вызов функции, потом возврат результата

Можно несколько декораторов

<pre><code class="python">
def print_debug(func):
    print('AAAAAAAAa')
    def new_func(*args, **kwargs):
        print("Вызов функции:", func.__name__)
        print("Дока функции:", func.__doc__)
        print("Позиционные аргументы:", args)
        print("Аргументы ключ/значение:", kwargs)
        result = func(*args, **kwargs)
        print("Результат:", result)
        return result
    print('BBBBB')
    return new_func

def square(func):
    def new_func(*args, **kwargs):
        result = func(*args, **kwargs)
        print("Вызов функции возведения в квадрат")
        return result * result
    return new_func

@square
@print_debug
def sum_two(a, b):
    '''
    Функция сложения двух аргументов
    Возвращает сумму двух переданных аргументов
    '''
    return a + b

x = 3
y = 2

print(sum_two(x, y))
</code></pre>

В таком случае декораторы будут вызываться в обратном порядке, начиная с названия функции

<pre><code class="python">
@print_debug
@square
def sum_two(a, b):
    '''
    Функция сложения двух аргументов
    Возвращает сумму двух переданных аргументов
    '''
    return a + b

x = 3
y = 2

print(sum_two(x, y))
</code></pre>

<pre><code class="python">
AAAAAAAAa
BBBBB
Вызов функции: new_func
Дока функции: None
Позиционные аргументы: (3, 2)
Аргументы ключ/значение: {}
Вызов функции возведения в квадрат
Результат: 25
25
</code></pre>

## Пространство имен

1. Глобальные переменные

<pre><code class="python">
hello = 'hello'

def print_hello():
    print(hello)

print_hello()
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
hello
</code></pre>

Можно обращаться, но нельзя изменять!

<pre><code class="python">
hello = 'hello'

def print_hello():
    print("Глобольная переменная равна = ", hello)
    hello = 'bye'
    print("Локальная переменная равна = ", hello)
    print(hello)

print_hello()
</code></pre>

<pre><code class="python">
Traceback (most recent call last):
  File "./test.py", line 11, in &lt;module&gt;
    print_hello()
  File "./test.py", line 6, in print_hello
    print("Глобольная переменная равна = ", hello)
UnboundLocalError: local variable 'hello' referenced before assignment
</code></pre>

Но при этом, можно назвать одинаково

<pre><code class="python">
hello = 'hello'

def print_hello():
    hello = 'bye'
    print("Локальная переменная равна = ", hello)
    print(hello)

print_hello()
print(hello)
</code></pre>

<pre><code class="python">
Локальная переменная равна =  bye
bye
hello
</code></pre>

### `gloabl`

Для доступа к глобальной переменной, используется global. Тогда можно изменять глобальную в функции

<pre><code class="python">
hello = 'hello'

def print_hello():
    global hello
    hello = 'bye'
    print("Локальная переменная равна = ", hello)
    print(hello)

print_hello()
print(hello)
</code></pre>

<pre><code class="python">
Локальная переменная равна =  bye
bye
bye
</code></pre>

<pre><code class="python">
hello = 'hello'

def print_hello():
    hello = 'bye'
    print("locals:", locals())

print_hello()

print("globals: ", globals())
</code></pre>

<pre><code class="python">
locals: {'hello': 'bye'}
globals:  {'__builtins__': &lt;module 'builtins' (built-in)>, '__doc__': None, '__cached__': None, '__loader__': <_frozen_importlib_external.SourceFileLoader object at 0x7fc265e0e9b0>, '__spec__': None, 'print_hello': <function print_hello at 0x7fc265d792f0&gt;, 'hello': 'hello', '__name__': '__main__', '__file__': './test.py', '__package__': None}
</code></pre>

- locals() - возвращает список локальных имен переменных
- globals() - возвращает список глобальных имен переменных

## Обработка ошибок: `try` и `except`

Пример исключения

<pre><code class="python">
test_list = [1,2,3]
test_list[4]
</code></pre>

<pre><code class="python">
Traceback (most recent call last):
  File "./test.py", line 5, in &lt;module&gt;
    test_list[4]
IndexError: list index out of range
avis@avis[20:50:51]:~/learn/python/book-simple-python$
</code></pre>

Обработка

<pre><code class="python">
test_list = [1,2,3]
index = 4
try:
    test_list[index]
except:
    print("Нужна позиция с 0 до", len(test_list) - 1, "но получено: ", index)
</code></pre>

<pre><code class="python">
avis@avis[20:52:56]:~/learn/python/book-simple-python$ python3 ./test.py 
Нужна позиция с 0 до 2 но получено:  4
</code></pre>

Если не указать тип исключения, то будут ловиться все исключения.

Формат - *except тип_исключения as имя*

<pre><code class="python">
test_list = [1,2,3]

while True:
    index = input("Позиция? [q для выхода]: ")
    if index == 'q':
        break
    try:
        index = int(index)
        print(test_list[index])
    except IndexError as err:
        print("Плохой индекс: ", index)
    except Exception as other:
        print("Другая ошибка: ", other)
</code></pre>

<pre><code class="python">
Позиция? [q для выхода]: 1
2
Позиция? [q для выхода]: 0
1
Позиция? [q для выхода]: 200
Плохой индекс:  200
Позиция? [q для выхода]: да?
Другая ошибка:  invalid literal for int() with base 10: 'да?'
Позиция? [q для выхода]: ну лад
Другая ошибка:  invalid literal for int() with base 10: 'ну лад'
Позиция? [q для выхода]: 3
Плохой индекс:  3
Позиция? [q для выхода]: й
Другая ошибка:  invalid literal for int() with base 10: 'й'
Позиция? [q для выхода]: q
</code></pre>

### Собственные исключения

<pre><code class="python">
class UppercaseException(Exception):
    pass

text = ['test', 'upper', 'case', 'AAAAAAAA']

for word in text:
    if word.isupper():
        raise UppercaseException(word)
</code></pre>

<pre><code class="python">
Traceback (most recent call last):
  File "./test.py", line 10, in &lt;module&gt;
    raise UppercaseException(word)
__main__.UppercaseException: AAAAAAAA
</code></pre>

Создаем класс и вызываем его если встречаем слово все буквы которого с болькой 

Если pass - то выводится стандатное исключение 

но можно изменить?

<pre><code class="python">
class UppercaseException(Exception):
    print("Почему все с большой????")
    pass

text = ['test', 'upper', 'case', 'AAAAAAAA']

for word in text:
    if word.isupper():
        raise UppercaseException(word)
</code></pre>

<pre><code class="python">
Почему все с большой????
Traceback (most recent call last):
  File "./test.py", line 11, in &lt;module&gt;
    raise UppercaseException(word)
__main__.UppercaseException: AAAAAAAA
</code></pre>

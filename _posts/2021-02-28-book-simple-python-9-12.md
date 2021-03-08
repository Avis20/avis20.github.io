---
title: Заметки по книге "Простой python" [Глава 9-12]
tags: [book, python]
reference:
  -
    link:
    title:

---

* TOC 
{:toc}


# Глава 9: Распутываем Всемирную паутину

Created: Feb 15, 2021 7:02 PM

## Стандартные библиотеки по работе с интернетом?

### Сделать запрос на сервер: urlib.request

<pre><code class="python">
import urllib.request as ur
import json

url = 'http://api.quotable.io/random'
response = ur.urlopen(url)
print(response)

json_str = response.read().decode('utf8')
data = json.loads(json_str)
print(data['content'])
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
&lt;http.client.HTTPResponse object at 0x7fbcfc7e58d0&gt;
It is not so important to know everything as to appreciate what we learn.
</code></pre>

- Получить заголовок ответа

<pre><code class="python">
import urllib.request as ur

url = 'http://api.quotable.io/random'
response = ur.urlopen(url)
print('Content-Type =', response.getheader('Content-Type'))
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Content-Type = application/json; charset=utf-8
</code></pre>

- Вывести все заголовки ответа от сервера

<pre><code class="python">
import urllib.request as ur

url = 'http://api.quotable.io/random'
response = ur.urlopen(url)

for key, val in response.getheaders():
    print(key, '=', val)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Server = Cowboy
Connection = close
X-Powered-By = Express
Access-Control-Allow-Origin = *
Content-Type = application/json; charset=utf-8
Content-Length = 247
Etag = W/"f7-fihZeTv49YZDFBuuHP4e4eCJgaA"
Date = Mon, 15 Feb 2021 16:22:12 GMT
Via = 1.1 vegur
</code></pre>

## Библиотека requests

<pre><code class="python">
import requests
import json

url = 'http://api.quotable.io/random'
response = requests.get(url)
print(response)
# &lt;Response [200]&gt;

print(type(response.text))
print(response.text)
# &lt;class 'str'&gt;
'''
{
  "_id": "4eekGH2qL80L",
  "tags": [
    "famous-quotes"
  ],
  "content": "He who lives in harmony with himself lives in harmony with the world.",
  "author": "Marcus Aurelius",
  "length": 69
}
'''

data = json.loads(response.text)
print(data['content'])
# No one has ever become poor by giving.
</code></pre>

# Веб серверы

## Самый простой веб сервер: `http.server`

- По умолчанию выводит содержимое текущей директории

<pre><code class="python">
$ ls -l
итого 12
drwxrwxr-x 2 avis avis 4096 фев 14 13:51 l1
-rwxrwxr-x 1 avis avis  918 фев 15 19:27 test.py
-rwxrwxr-x 1 avis avis 1544 фев 15 19:01 work_videos.py
</code></pre>

<pre><code class="python">
$ python3 -m http.server
Serving HTTP on 0.0.0.0 port 8000 ...
127.0.0.1 - - [15/Feb/2021 19:29:25] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [15/Feb/2021 19:29:32] "GET / HTTP/1.1" 200 -
</code></pre>

<pre><code class="python">
$ curl localhost:8000
&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8"&gt;
&lt;title>Directory listing for /</title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;h1>Directory listing for /</h1&gt;
&lt;hr&gt;
&lt;ul&gt;
&lt;li><a href="l1/">l1/</a></li&gt;
&lt;li><a href="test.py">test.py</a></li&gt;
&lt;li><a href="work_videos.py">work_videos.py</a></li&gt;
&lt;/ul&gt;
&lt;hr&gt;
&lt;/body&gt;
&lt;/html&gt;
$
</code></pre>

## Фреймворки

### Bottle

<pre><code class="python">
from bottle import route, run

@route('/')
def home():
    return "Hello, world!"

run(host='localhost', port=9999)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Bottle v0.12.19 server starting up (using WSGIRefServer())...
Listening on http://localhost:9999/
Hit Ctrl-C to quit.

127.0.0.1 - - [15/Feb/2021 19:52:34] "GET / HTTP/1.1" 200 14
</code></pre>

<pre><code class="python">
$ curl localhost:9999
Hello, world!
$
</code></pre>

- Для раздачи static_file

<pre><code class="python">
from bottle import route, run, static_file

@route('/')
def main():
    return static_file('index.html', root='.')

run(host='localhost', port=9999)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Bottle v0.12.19 server starting up (using WSGIRefServer())...
Listening on http://localhost:9999/
Hit Ctrl-C to quit.

127.0.0.1 - - [15/Feb/2021 20:05:31] "GET / HTTP/1.1" 200 221
</code></pre>

<pre><code class="python">
$ cat index.html
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title>Test Page</title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h2>Hello</h2&gt;
&lt;/body&gt;
&lt;/html&gt;
$
</code></pre>

<pre><code class="python">
$ curl localhost:9999
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title>Test Page</title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h2>Hello</h2&gt;
&lt;/body&gt;
&lt;/html&gt;
$
</code></pre>

- Все что будет передано после /echo/* будет в передано как срока первому параметру

<pre><code class="python">
@route('/echo/&lt;thing&gt;')
def echo(thing):
    return "Привет %s\n" % thing
</code></pre>

- Пример unit теста

Server =

<pre><code class="python">
from bottle import route, run, static_file

@route('/')
def main():
    return static_file('index.html', root='.')

@route('/echo/&lt;thing&gt;')
def echo(thing):
    return "Hello %s\n" % thing

run(host='localhost', port=9999)
</code></pre>

Test script =

<pre><code class="python">
import requests

response = requests.get('http://localhost:9999/echo/Test')

if response.status_code == 200 and response.text == "Hello Test\n":
    print("ok")
else:
    print("not ok; got =", response.text)
</code></pre>

Run

<pre><code class="python">
$ python3 ./test.py 
Bottle v0.12.19 server starting up (using WSGIRefServer())...
Listening on http://localhost:9999/
Hit Ctrl-C to quit.

127.0.0.1 - - [16/Feb/2021 18:26:08] "GET /echo/Test HTTP/1.1" 200 11
</code></pre>

<pre><code class="python">
$ python3 ./bottle_test.py 
ok
</code></pre>

### Flask

- Пример веб-сервера на flask

<pre><code class="python">
from flask import Flask
app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/echo/&lt;thing&gt;')
def echo(thing):
    return "Hello %s\n" % thing

app.run(port=9999, debug=True)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
 * Serving Flask app "test" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://127.0.0.1:9999/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 257-630-425
127.0.0.1 - - [16/Feb/2021 19:31:12] "GET /echo/Test HTTP/1.1" 200 -
</code></pre>

<pre><code class="python">
$ python3 ./bottle_test.py 
ok
</code></pre>

- Пример использования шаблонизатора jijna2

<pre><code class="python">
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/echo/&lt;thing&gt;')
def echo(thing):
    return render_template('flask.html', thing=thing)

app.run(port=9999, debug=True)
</code></pre>

<pre><code class="python">
$ cat ./templates/flask.html 
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title>Flask Example</title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h2>Hello {{ thing }}</h2&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
 * Serving Flask app "test" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://127.0.0.1:9999/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 257-630-425
127.0.0.1 - - [16/Feb/2021 19:38:13] "GET /echo/Test HTTP/1.1" 200 -
</code></pre>

<pre><code class="python">
$ curl localhost:9999/echo/Test
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title>Flask Example</title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h2>Hello Test</h2&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

- Передача параметра в query_string

<pre><code class="python">
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/echo/')
def echo():
    param1 = request.args.get('param1')
    param2 = request.args.get('param2')
    return render_template('flask2.html', param1=param1, param2=param2)

if __name__ == '__main__':
    app.run(port=9999, debug=True)
</code></pre>

<pre><code class="python">
$ curl localhost:9999/echo/?param1=Test
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title>Flask2 Example</title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h2>Admin: Hello Test. How are you?<br>Test: I am None, and you?</h2&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

## Web Server Gateway Interface (WSGI)

### Apache #TODO

### Nginx #TODO

## Работа с браузером

- Открыть новую страницу в браузере

<pre><code class="python">
import webbrowser

url = 'https://python.org'
webbrowser.open(url)
</code></pre>

### Selenium: #TODO

## Парсинг сайтов

### Паук scrapy

- [http://scrapy.org/](http://scrapy.org/)

### Вывод html данных: `BeautifulSoup`

- Вывести все ссылки с веб страницы

<pre><code class="python">
import sys
import requests
from bs4 import BeautifulSoup as soup

def get_links(url):
    result = requests.get(url)
    html = result.text
    doc = soup(html)
    print(type(doc))
    links = []
    for el in doc.find_all('a'):
        links.append(el.get('href'))
    return links

if __name__ == '__main__':
    for url in sys.argv[1:]:
        print(url)
        for num, link in enumerate(get_links(url)):
            print(num, link)
</code></pre>

<pre><code class="python">
$ python3 ./test.py https://ya.ru
https://ya.ru
./test.py:11: GuessedAtParserWarning: No parser was explicitly specified, so I'm using the best available HTML parser for this system ("lxml"). This usually isn't a problem, but if you run this code on another system, or in a different virtual environment, it may use a different parser and behave differently.

The code that caused this warning is on line 11 of the file ./test.py. To get rid of this warning, pass the additional argument 'features="lxml"' to the BeautifulSoup constructor.

  doc = soup(html)
&lt;class 'bs4.BeautifulSoup'&gt;
0 https://mail.yandex.ru
1 //yandex.ru
$ python3 ./test.py https://google.ru
https://google.ru
./test.py:11: GuessedAtParserWarning: No parser was explicitly specified, so I'm using the best available HTML parser for this system ("lxml"). This usually isn't a problem, but if you run this code on another system, or in a different virtual environment, it may use a different parser and behave differently.

The code that caused this warning is on line 11 of the file ./test.py. To get rid of this warning, pass the additional argument 'features="lxml"' to the BeautifulSoup constructor.

  doc = soup(html)
&lt;class 'bs4.BeautifulSoup'&gt;
0 https://www.google.ru/imghp?hl=ru&tab=wi
1 https://maps.google.ru/maps?hl=ru&tab=wl
2 https://play.google.com/?hl=ru&tab=w8
3 https://www.youtube.com/?gl=RU&tab=w1
4 https://news.google.com/?tab=wn
5 https://mail.google.com/mail/?tab=wm
6 https://drive.google.com/?tab=wo
7 https://www.google.ru/intl/ru/about/products?tab=wh
8 http://www.google.ru/history/optout?hl=ru
9 /preferences?hl=ru
10 https://accounts.google.com/ServiceLogin?hl=ru&passive=true&continue=https://www.google.ru/&ec=GAZAAQ
11 /advanced_search?hl=ru&authuser=0
12 /intl/ru/ads/
13 http://www.google.ru/intl/ru/services/
14 /intl/ru/about.html
15 https://www.google.ru/setprefdomain?prefdom=US&sig=K_cPvulQWDJ9leqNkSVr2saS_BfLM%3D
16 /intl/ru/policies/privacy/
17 /intl/ru/policies/terms/
$
</code></pre>

# Глава 10: Операционные системы

Created: Feb 19, 2021 5:43 PM

# Файлы

## Проверка существования файла: exists

<pre><code class="python">
import os

file_name = './text.txt'

with open(file_name, 'wt') as file:
    file.write('hello\n')

print("File exists? ", os.path.exists(file_name))
# File exists?  True
print("File exists? ", os.path.exists('alalala'))
# File exists?  False

print("is file?", os.path.isfile(file_name))
# is file? True

print("is file?", os.path.isfile('.'))
# is file? False

print("is dir?", os.path.isdir('.'))
# is dir? True
</code></pre>

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

## Перемещение (переименование) файла: os.rename

<pre><code class="python">
import os

file_name = './text.txt'
new_file_name = file_name + 'new.txt'

with open(file_name, 'wt') as file:
    file.write('hello\n')

print(os.rename(file_name, new_file_name))
# None

print(os.path.exists(file_name))
# False

print(os.path.exists(new_file_name))
# True
</code></pre>

## Создание ссылок: link и symlink

- link - жесткая ссылка

<pre><code class="python">
import os

file_name = './text.txt'
new_file_name = file_name + '.new.txt'

with open(file_name, 'wt') as file:
    file.write('hello\n')

print(os.link(file_name, new_file_name))
# None

print(os.path.islink(new_file_name))
# True

print(os.remove(new_file_name))
</code></pre>

<pre><code class="python">
$ ls -la ./text.txt.new.txt 
-rw-rw-r-- 2 avis avis 6 фев 19 18:03 ./text.txt.new.txt
</code></pre>

- 2 - сколько ссылок

- symlink - символьная ссылка

<pre><code class="python">
import os

file_name = './text.txt'
new_file_name = file_name + '.new.txt'

with open(file_name, 'wt') as file:
    file.write('hello\n')

print(os.symlink(file_name, new_file_name))
# None

print(os.path.islink(new_file_name))
# True

print(os.remove(new_file_name))
</code></pre>

<pre><code class="python">
$ ls -la ./text.txt.new.txt 
lrwxrwxrwx 1 avis avis 10 фев 19 18:04 ./text.txt.new.txt -> ./text.txt
</code></pre>

## #TODO:

- функции chmod()
- функции chown()
- abspath()
- функции realpath()
- remove()
- mkdir()
- rmdir()
- listdir()
- chdir()
- glob()

# Процессы

## Создание процесса: subprocess

<pre><code class="python">
import subprocess

result = subprocess.getoutput('date')
print(result)
# Пт фев 19 18:17:59 MSK 2021
</code></pre>

- Основной процесс будет висеть пока подпроцесс не завершиться

<pre><code class="python">
import subprocess

result = subprocess.getoutput("perl -E 'sleep 3; say 2'")
print(result)

print(1)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
2
1
$
</code></pre>

- Строка в getoutput передается как есть

<pre><code class="python">
import subprocess

result = subprocess.getoutput('ps aux | grep python | wc -l')
print(result)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
11
</code></pre>

- Для запуска списка команд - check_output. Возвращает список байтов

<pre><code class="python">
import subprocess

result = subprocess.check_output(['date', '-u'])
print(result.decode('utf8'))
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Пт фев 19 15:25:45 UTC 2021
</code></pre>

- Получить статус и результат в виде кортежа - getstatusoutput

<pre><code class="python">
import subprocess

result = subprocess.getstatusoutput(['date', '-u'])
print(result)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
(0, 'Пт фев 19 18:27:05 MSK 2021')
</code></pre>

- Получить только статус - call

<pre><code class="python">
import subprocess

result = subprocess.call(['date', '-u'])
print(result)

print('result=', result)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Пт фев 19 15:36:41 UTC 2021
0
result= 0
</code></pre>

Причем обычную строку он уже не принимает...

<pre><code class="python">
import subprocess

result = subprocess.call('date -u')
print(result)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Traceback (most recent call last):
  File "./test.py", line 5, in &lt;module&gt;
    result = subprocess.call('date -u')
</code></pre>

- Нужно через shell=True

<pre><code class="python">
import subprocess

result = subprocess.call('date -u', shell=True)
print(result)

print('result=', result)
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Пт фев 19 15:38:17 UTC 2021
0
result= 0
</code></pre>

## Использование мультипроцессинга: multiprocessing

<pre><code class="python">
import multiprocessing as mp
import os
import time

def do_this(text):
    whoami(text)

def whoami(text):
    time.sleep(1)
    print("Процесс %s говорит: '%s'" % (os.getpid(), text))

if __name__ == '__main__':
    whoami('Я основная программа main')
    for i in range(4):
        proc = mp.Process(target=do_this, args=("Я функция %s" % i, ))
        proc.start()
    print("Конец main")
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Процесс 14933 говорит: 'Я основная программа main'
Конец main
Процесс 14935 говорит: 'Я функция 0'
Процесс 14937 говорит: 'Я функция 2'
Процесс 14936 говорит: 'Я функция 1'
Процесс 14938 говорит: 'Я функция 3'
</code></pre>

- Основной процесс породил несколько fork процессов и ждет пока все завершаться

запятая в "args=("Я функция %s" % i, )" обязательна! без нее ошибка

### Принудительное завершение процесса: terminate()

<pre><code class="python">
import multiprocessing as mp
import time
import os

def whoami(name):
    print("Я %s, PID=%s" % (name, os.getpid()))

def loop(name):
    whoami(name)
    start = 1
    stop = 1000
    for n in range(start, stop):
        print("\tNumber %s of %s" % (n, stop))
        time.sleep(start)

if __name__ == '__main__':
    whoami("основной процесс main")
    proc = mp.Process(target=loop, args=("loopy", ))
    proc.start()
    time.sleep(3)
    print(proc.terminate())
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Я основной процесс main, PID=16249
Я loopy, PID=16250
    Number 1 of 1000
    Number 2 of 1000
    Number 3 of 1000
None
</code></pre>

- бгг, если завершить основной процесс то дочерний будет дальше жить))

<pre><code class="python">
import subprocess
import multiprocessing as mp
import time
import os

def whoami(name):
    print("Я %s, PID=%s" % (name, os.getpid()))

def loop(name):
    whoami(name)
    start = 1
    stop = 1000
    for n in range(start, stop):
        print("\tNumber %s of %s; parent pid=%s" % (n, stop, os.getppid()))
        time.sleep(start)

if __name__ == '__main__':
    whoami("основной процесс main")
    proc = mp.Process(target=loop, args=("loopy", ))
    proc.start()
    time.sleep(3)
    print("I'll be back -_-")
    subprocess.call(['kill', str(os.getpid())])
</code></pre>

<pre><code class="python">
$ python3 ./test.py 
Я основной процесс main, PID=16970
Я loopy, PID=16971
    Number 1 of 1000; parent pid=16970
    Number 2 of 1000; parent pid=16970
    Number 3 of 1000; parent pid=16970
I'll be back -_-
    Number 4 of 1000; parent pid=16970
Завершено
$   Number 5 of 1000; parent pid=2146
    Number 6 of 1000; parent pid=2146
</code></pre>

# Дата и время

## Дата

<pre><code class="python">
from datetime import date

today = date(2021, 2, 22)

print(today)
# 2021-02-22

print("day =", today.day, "month =", today.month, "year =", today.year)
# day = 22 month = 2 year = 2021
</code></pre>

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

# Время: time

## Вывод текущего времени в epoth: time.time()

<pre><code class="python">
from time import time, ctime

now = time()

print(now)
# 1613993148.653525

fnow = ctime(now)
print(fnow)
# Mon Feb 22 14:27:51 2021
</code></pre>

## Время в текущем часовом поясе (localtime) и в UTC (gmtime)

<pre><code class="python">
import time

print(time.localtime())
# time.struct_time(tm_year=2021, tm_mon=2, tm_mday=22, tm_hour=14, tm_min=31,
# tm_sec=52, tm_wday=0, tm_yday=53, tm_isdst=0)

print(time.gmtime())
# time.struct_time(tm_year=2021, tm_mon=2, tm_mday=22, tm_hour=11, tm_min=32,
# tm_sec=32, tm_wday=0, tm_yday=53, tm_isdst=0)
</code></pre>

## Форматирование времени

- Преобразовать время к строке - strftime

<pre><code class="python">
import time

format = "Сегодня: %A, %B %d %Y. Локальное время: %H:%M:%S%p"

now = time.localtime()

print(time.strftime(format, now))
# Сегодня: Monday, February 22 2021. Локальное время: 14:39:42PM
</code></pre>

- Спецификатор Единица даты/времени Диапазон
- %Y Год 1900–...
- %m Месяц 01–12
- %B Название месяца Январь, ...
- %b Сокращение для месяца Янв, ...
- %d День месяца 01–31
- %А Название дня Воскресенье, ...
- а Сокращение для дня Вск, ...
- %Н Часы (24 часа) 00–23
- %I Часы (12 часов) 01–12
- %p AM или PM AM, PM
- %M Минуты 00–59
- %S Секунды 00–59

- Преобразовать строку ко времени - strptime

<pre><code class="python">
import time

fmt = "%Y-%m-%d"

print(time.strptime("2020-01-06", fmt))
# time.struct_time(tm_year=2020, tm_mon=1, tm_mday=6, tm_hour=0, tm_min=0,
# tm_sec=0, tm_wday=0, tm_yday=6, tm_isdst=-1)
</code></pre>

# Глава 11. Конкуренция и сети

Created: Feb 23, 2021 11:20 AM

# Очереди

<pre><code class="python">
import multiprocessing as mp
import time

def washer(dishes, output):
    for dish in dishes:
        print("Мытье ", dish, time.localtime().tm_sec)
        time.sleep(3)
        output.put(dish)

def dryer(input):
    while True:
        dish = input.get()
        print("Сушка ", dish, time.localtime().tm_sec)
        time.sleep(1)
        input.task_done()

dish_queue = mp.JoinableQueue()
dryer_proc = mp.Process(target=dryer, args=(dish_queue, ))
dryer_proc.daemon = True
dryer_proc.start()
dishes = ['салат', 'суп', 'жаркое', 'бараньи ребрышки']
washer(dishes, dish_queue)
dish_queue.join()
</code></pre>

<pre><code class="python">
$ python3 ./dishes.py 
Мытье  салат 41
Мытье  суп 44
Сушка  салат 44
Мытье  жаркое 47
Сушка  суп 47
Мытье  бараньи ребрышки 50
Сушка  жаркое 50
Сушка  бараньи ребрышки 53
</code></pre>

<pre><code class="python">
python3(11140)-+-python3(11141)
               `-{python3}(11150)
</code></pre>

# Потоки

<pre><code class="python">
import os
import time
import threading

def do_this(what):
    time.sleep(100)
    whoami(what)

def whoami(text):
    print("Поток %s сказал: %s " % (threading.current_thread(), text))

if __name__ == '__main__':
    whoami("Я основная программа, " + str(os.getpid()))
    for i in range(4):
        proc = threading.Thread(target=do_this, args=("Я поток %s" % i,))
        proc.start()
</code></pre>

<pre><code class="python">
$ python3 thread.py
Поток &lt;_MainThread(MainThread, started 140012683785984)&gt; сказал: Я основная программа, 10785 
Поток &lt;Thread(Thread-4, started 140012627429120)&gt; сказал: Я поток 3 
Поток &lt;Thread(Thread-2, started 140012644214528)&gt; сказал: Я поток 1 
Поток &lt;Thread(Thread-1, started 140012652607232)&gt; сказал: Я поток 0 
Поток &lt;Thread(Thread-3, started 140012635821824)&gt; сказал: Я поток 2
</code></pre>

<pre><code class="python">
$ pstree -p 10857 | less
python3(10857)-+-{python3}(10858)
               |-{python3}(10859)
               |-{python3}(10860)
               `-{python3}(10861)
</code></pre>

- Мытье посуды на потоках

<pre><code class="python">
import os
import threading
import queue
import time

def washer(dishes, dish_queue):
    for dish in dishes:
        print("Мытье ", dish, time.localtime().tm_sec)
        time.sleep(10)
        dish_queue.put(dish)

def dryer(dish_queue):
    while True:
        dish = dish_queue.get()
        print("Сушка ", dish, time.localtime().tm_sec)
        time.sleep(5)
        dish_queue.task_done()

print(os.getpid())
dish_queue = queue.Queue()
for n in range(2):
    thread = threading.Thread(target=dryer, args=(dish_queue, ))
    thread.start()

dishes = ['салат', 'суп', 'жаркое', 'бараньи ребрышки']
washer(dishes, dish_queue)
dish_queue.join()
</code></pre>

<pre><code class="python">
$ python3 dishes.py 
11871
Мытье  салат 50
Мытье  суп 0
Сушка  салат 0
Мытье  жаркое 10
Сушка  суп 10
Мытье  бараньи ребрышки 20
Сушка  жаркое 20
Сушка  бараньи ребрышки 30
</code></pre>

<pre><code class="python">
python3(11871)-+-{python3}(11872)
               `-{python3}(11873)
</code></pre>

## Зеленые потоки и gevent

### gevent

- [http://www.gevent.org/](http://www.gevent.org/)

<pre><code class="python">
pip3 install gevent
</code></pre>

<pre><code class="python">
import gevent
from gevent import socket

hosts = ['google.com', 'ya.ru']
jobs = [gevent.spawn(socket.gethostbyname, host) for host in hosts]
gevent.joinall(jobs, timeout=5)
for job in jobs:
    print(job.key, job.value)
</code></pre>

<pre><code class="python">
$ python3 ./gevent_test.py 
74.125.205.138
87.250.250.242
</code></pre>

- gevent.spawn - создает потоки и в случае если один из них заблокирован, переключает на другой
- socket.gethostbyname - возвращает ip адрес хоста
- gevent.joinall - ждет выполнения всех потоков

<pre><code class="python">
import gevent
from gevent import monkey
import socket

monkey.patch_all()

hosts = ['google.com', 'ya.ru', 'dads.com']
jobs = [gevent.spawn(socket.gethostbyname, host) for host in hosts]
gevent.joinall(jobs, timeout=5)
for job in jobs:
    print(job.value)
</code></pre>

По факту ничего не поменялось, только добавился monkey.patch_all() который вроде ничего не делает

### twisted

<pre><code class="python">
pip3 install twisted
</code></pre>

- какаята магия если честно... я ваще не шарю о чем пишу

<pre><code class="python">

</code></pre>

### asyncio (Asynchronous IO Support Rebooted)

# Очередь на основе redis

- мойщик

<pre><code class="python">
import redis

redis = redis.Redis()

print("Мойка началась!")

dishes = ['салат', 'суп', 'жаркое', 'бараньи ребрышки']
for dish in dishes:
    print("Мытье", dish)
    msg = dish.encode('utf8')
    redis.rpush('dishes', msg)

redis.rpush('dishes', 'quit')
print("Мойка закончилась!")
</code></pre>

- сушильщик

<pre><code class="python">
import redis

redis = redis.Redis()

print("Сушка началась!")

while True:
    msg = redis.blpop('dishes')
    if not msg:
        break
    value = msg[1].decode('utf8')
    if value == 'quit':
        break
    print("Сушка", value)

print("Сушка закончилась!")
</code></pre>

- Запуск мойщика - в редисе 4 тарелки

<pre><code class="python">
$ python3 redis_washer.py
Мойка началась!
Мытье салат
Мытье суп
Мытье жаркое
Мытье бараньи ребрышки
Мойка закончилась!
$
</code></pre>

<pre><code class="python">
127.0.0.1:6379> llen dishes
(integer) 5
</code></pre>

<pre><code class="python">
import os
import time
import multiprocessing as mp
import redis

COUNT_DRYERS = 3
TIMEOUT = 20
redis = redis.Redis()

def drying():
    pid = os.getpid()
    print("Сушка началась! процесс {}".format(pid))
    while True:
        msg = redis.blpop('dishes', TIMEOUT)
        if not msg:
            break
        value = msg[1].decode('utf8')
        if value == 'quit':
            break
        print("{}: сушка {}".format(pid, value))
        time.sleep(0.3)
    print("Сушка закончилась! процесс {}".format(pid))

if __name__ == '__main__':
    for dryer in range(COUNT_DRYERS):
        proc = mp.Process(target=drying)
        proc.start()
</code></pre>

# Сети

## Публикация-Подписка (pub-sub)

> Модель публикации-подписки не является очередью - это широковещательная система. Один (или более) процесс публикует сообщения. Каждый процесс-подписчик указывает, сообщения какого типа он хочет получать. Копия каждого сообщения отправляется каждому подписчику, указавшему этот тип.

### Redis

- Публикатор

<pre><code class="python">
import redis
import random

redis = redis.Redis()

artists = ['DETACH', 'Orden Ogan', 'Matt Guillory', 'Dragged Under',
           'Radio Tapok', 'Strike', '10 Years', 'A Day To Remember']

tracks = ['Afterglow', 'Heart of the Android',
          'Give Me a Sign', 'Just Like Me',
          'Wrong Side of Heaven', 'Плачь',
          'Never Too Late', 'Sleep In The Fire']

for msg in range(10):
    artist = random.choice(artists)
    track = random.choice(tracks)
    print("Публикация: Группа {} исполняет {}".format(artist, track))
    redis.publish(artist, track)
</code></pre>

- Подписчик

<pre><code class="python">
import redis

redis = redis.Redis()

topics = ['Radio Tapok', 'A Day To Remember']

sub = redis.pubsub()
sub.subscribe(topics)
for msg in sub.listen():
    if msg['type'] == 'message':
        artist = msg['channel']
        track = msg['data']
        print("Подписка: Группа {} исполняет {}".format(
            artist.decode('utf8'),
            track.decode('utf8')
        ))
</code></pre>

- Запуск публикатора+подписчика

<pre><code class="python">
$ python3 redis_pub.py 
Публикация: Группа A Day To Remember исполняет Just Like Me
Публикация: Группа Strike исполняет Give Me a Sign
Публикация: Группа Orden Ogan исполняет Heart of the Android
Публикация: Группа Radio Tapok исполняет Just Like Me
Публикация: Группа Strike исполняет Never Too Late
Публикация: Группа A Day To Remember исполняет Плачь
Публикация: Группа Matt Guillory исполняет Just Like Me
Публикация: Группа Strike исполняет Never Too Late
Публикация: Группа Dragged Under исполняет Never Too Late
Публикация: Группа 10 Years исполняет Afterglow
</code></pre>

<pre><code class="python">
$ python3 ./redis_sub.py
Подписка: Группа A Day To Remember исполняет Just Like Me
Подписка: Группа Radio Tapok исполняет Just Like Me
Подписка: Группа A Day To Remember исполняет Плачь
</code></pre>

<pre><code class="python">
1614355585.717940 [0 127.0.0.1:34986] "SUBSCRIBE" "Radio Tapok" "A Day To Remember"
1614355604.167930 [0 127.0.0.1:34988] "PUBLISH" "A Day To Remember" "Just Like Me"
1614355604.168081 [0 127.0.0.1:34988] "PUBLISH" "Strike" "Give Me a Sign"
1614355604.168188 [0 127.0.0.1:34988] "PUBLISH" "Orden Ogan" "Heart of the Android"
1614355604.168282 [0 127.0.0.1:34988] "PUBLISH" "Radio Tapok" "Just Like Me"
1614355604.168380 [0 127.0.0.1:34988] "PUBLISH" "Strike" "Never Too Late"
1614355604.168470 [0 127.0.0.1:34988] "PUBLISH" "A Day To Remember" "\xd0\x9f\xd0\xbb\xd0\xb0\xd1\x87\xd1\x8c"
1614355604.168564 [0 127.0.0.1:34988] "PUBLISH" "Matt Guillory" "Just Like Me"
1614355604.168650 [0 127.0.0.1:34988] "PUBLISH" "Strike" "Never Too Late"
1614355604.168759 [0 127.0.0.1:34988] "PUBLISH" "Dragged Under" "Never Too Late"
1614355604.168859 [0 127.0.0.1:34988] "PUBLISH" "10 Years" "Afterglow"
</code></pre>

Важно вначале запустить подписчика а потом публикатора! Иначе сообщения пропадут и никто их не увидит!

Если будет 2 и более подписчика, то оба получат сообщения

### ZeroMQ

<pre><code class="python">
pip3 install zmq
</code></pre>

или ?

<pre><code class="python">
pip3 install pyzmq
</code></pre>

- Публикатор

<pre><code class="python">
import random
import time
import zmq

host = '*'
port = 6789

ctx = zmq.Context()
print(zmq.PUB)
pub = ctx.socket(zmq.PUB)
pub.bind('tcp://{}:{}'.format(host, port))

artists = ['DETACH', 'Orden Ogan', 'Matt Guillory', 'Dragged Under',
           'Radio Tapok', 'Strike', '10 Years', 'A Day To Remember']

tracks = ['Afterglow', 'Heart of the Android',
          'Give Me a Sign', 'Just Like Me',
          'Wrong Side of Heaven', 'Плачь',
          'Never Too Late', 'Sleep In The Fire']

time.sleep(1)
for msg in range(10):
    artist = random.choice(artists)
    track = random.choice(tracks)
    print("Публикация: Группа {} исполняет {}".format(artist, track))
    pub.send_multipart([artist.encode('utf8'), track.encode('utf8')])
</code></pre>

- Подписчик

<pre><code class="python">
import zmq

host = 'localhost'
port = 6789

ctx = zmq.Context()
sub = ctx.socket(zmq.SUB)
sub.connect('tcp://{}:{}'.format(host, port))
topics = ['Radio Tapok', 'A Day To Remember']

for top in topics:
    sub.setsockopt(zmq.SUBSCRIBE, top.encode('utf8'))

while True:
    artist, track = sub.recv_multipart()
    print("Подписка: Группа {} исполняет {}".format(
        artist.decode('utf8'),
        track.decode('utf8')
    ))
</code></pre>

<pre><code class="python">
$ python ./main.py 
1
Публикация: Группа A Day To Remember исполняет Never Too Late
Публикация: Группа Radio Tapok исполняет Never Too Late
Публикация: Группа A Day To Remember исполняет Плачь
Публикация: Группа DETACH исполняет Плачь
Публикация: Группа Strike исполняет Heart of the Android
Публикация: Группа A Day To Remember исполняет Heart of the Android
Публикация: Группа 10 Years исполняет Afterglow
Публикация: Группа Matt Guillory исполняет Just Like Me
Публикация: Группа Strike исполняет Afterglow
Публикация: Группа Strike исполняет Wrong Side of Heaven
$ python ./main.py 
1
Публикация: Группа A Day To Remember исполняет Плачь
Публикация: Группа Dragged Under исполняет Just Like Me
Публикация: Группа DETACH исполняет Just Like Me
Публикация: Группа Orden Ogan исполняет Heart of the Android
Публикация: Группа Dragged Under исполняет Just Like Me
Публикация: Группа 10 Years исполняет Never Too Late
Публикация: Группа Radio Tapok исполняет Плачь
Публикация: Группа Dragged Under исполняет Just Like Me
Публикация: Группа Orden Ogan исполняет Afterglow
Публикация: Группа Strike исполняет Never Too Late
</code></pre>

<pre><code class="python">
$ python ./test.py 
Подписка: Группа A Day To Remember исполняет Never Too Late
Подписка: Группа Radio Tapok исполняет Never Too Late
Подписка: Группа A Day To Remember исполняет Плачь
Подписка: Группа A Day To Remember исполняет Heart of the Android
Подписка: Группа A Day To Remember исполняет Плачь
Подписка: Группа Radio Tapok исполняет Плачь
</code></pre>

### RabbitMQ

- [http://pika.readthedocs.org/](http://pika.readthedocs.org/)
- туториал - [http://bit.ly/pub-sub-tut](http://bit.ly/pub-sub-tut)

# Запрос-Ответ

## Пример UDP и TCP сервера

- UDP сервер

<pre><code class="python">
from datetime import datetime
import socket

print("Старт сервера в", datetime.now())
print("Ждем клиентов")

max_size = 4096
server_address = ('localhost', 6789)
server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
server.bind(server_address)

data, client = server.recvfrom(max_size)
print("В ", datetime.now(), client, "сказал", data)
server.sendto(b'Are you talking to me?', client)
server.close()
</code></pre>

- UDP клиент

<pre><code class="python">
from datetime import datetime
import socket

server_address = ('localhost', 6789)
max_size = 4096
print("Старт клиента в ", datetime.now())
client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
client.sendto(b'HEy!', server_address)

data, server = client.recvfrom(max_size)
print("В ", datetime.now(), server, "сказал", data)
client.close()
</code></pre>

- socket.SOCK_DGRAM - говорит о том что сервер и/или клиент будет работать с датаграммой т.е. по UDP соединению
- После запуска сервера, он ждет подключения клиентов (`server.recvfrom(max_size)`)

<pre><code class="python">
$ python3 udp_server.py
Старт сервера в 2021-02-28 13:36:43.385251
Ждем клиентов
</code></pre>

<pre><code class="python">
$ python3 udp_client.py
Старт клиента в  2021-02-28 13:37:56.216326
В  2021-02-28 13:37:56.216635 ('127.0.0.1', 6789) сказал b'Are you talking to me?'
$
</code></pre>

<pre><code class="python">
$ python3 udp_server.py
Старт сервера в 2021-02-28 13:36:43.385251
Ждем клиентов
В  2021-02-28 13:37:56.216575 ('127.0.0.1', 42279) сказал b'HEy!'
$
</code></pre>

После запуска клиента, тот отправил строку "HEy!" и в ответ получил "Are you talking to me?"

- TCP сервер

<pre><code class="python">
from datetime import datetime
import socket

print("Старт сервера в", datetime.now())
print("Ждем клиентов")

max_size = 1024
server_address = ('localhost', 6789)
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(server_address)
server.listen(5)
client, addr = server.accept()
data = client.recv(max_size)
print("В ", datetime.now(), client, "сказал", data)
client.sendall(b'Are you talking to me?')
client.close()
server.close()
</code></pre>

<pre><code class="python">
$ python3 tcp_server.py
Старт сервера в 2021-02-28 13:49:06.119605
Ждем клиентов
</code></pre>

- TCP клиент

<pre><code class="python">
from datetime import datetime
import socket

server_address = ('localhost', 6789)
max_size = 1024
print("Старт клиента в ", datetime.now())
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(server_address)
client.sendall(b'HEy!')
data = client.recv(max_size)
print("В ", datetime.now(), "сказал", data)
client.close()
</code></pre>

<pre><code class="python">
$ python3 tcp_client.py
Старт клиента в  2021-02-28 13:51:16.269556
</code></pre>

1. Клиент отправил сообщение на сервер

<pre><code class="python">
$ python3 tcp_server.py
Старт сервера в 2021-02-28 13:49:06.119605
Ждем клиентов
В  2021-02-28 13:51:16.269913 &lt;socket.socket fd=4, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.0.1', 6789), raddr=('127.0.0.1', 57602)&gt; сказал b'HEy!'
$
</code></pre>

2. После чего сервер ответил клиенту

<pre><code class="python">
$ python3 tcp_client.py
Старт клиента в  2021-02-28 13:51:16.269556
В  2021-02-28 13:51:16.270032 сказал b'Are you talking to me?'
$
</code></pre>

## ZeroMQ

- Дока - [https://zguide.zeromq.org/](https://zguide.zeromq.org/)

Для Python 3.5.2 последняя версия модуля ломалась, так что поставил более раннюю 

<pre><code class="python">
pip3 install 'pyzmq==19.0.0'
</code></pre>

- Сервер

<pre><code class="python">
import zmq

host = '127.0.0.1'
port = 6789

ctx = zmq.Context()
server = ctx.socket(zmq.REP)
addres = "tcp://{}:{}".format(host, port)
print(addres)
server.bind(addres)

while True:
    req_bytes = server.recv()
    request_str = req_bytes.decode('utf8')
    print("Получен запрос [", request_str, "]", sep='')
    reply_str = "Ответ от сервера: {}".format(request_str)
    reply_bytes = reply_str.encode('utf8')
    server.send(reply_bytes)
</code></pre>

- Клиент

<pre><code class="python">
import zmq

host = '127.0.0.1'
port = 6789
address = "tcp://{}:{}".format(host, port)
print(address)

ctx = zmq.Context()
client = ctx.socket(zmq.REQ)
client.connect(address)

for n in range(1, 5):
    req_msg = "Message #{}".format(n)
    req_bytes = req_msg.encode('utf8')
    client.send(req_bytes)
    reply_bytes = client.recv()
    reply_str = reply_bytes.decode('utf8')
    print("Отправлено: [{}]; Получено: [{}]".format(req_msg, reply_str))
</code></pre>

- Запуск сервера

<pre><code class="python">
$ python3 zmq_server.py
tcp://127.0.0.1:6789
Получен запрос [Message #1]
Получен запрос [Message #2]
Получен запрос [Message #3]
Получен запрос [Message #4]
</code></pre>

- Запуск клиента

<pre><code class="python">
$ python3 zmq_client.py
tcp://127.0.0.1:6789
Отправлено: [Message #1]; Получено: [Ответ от сервера: Message #1]
Отправлено: [Message #2]; Получено: [Ответ от сервера: Message #2]
Отправлено: [Message #3]; Получено: [Ответ от сервера: Message #3]
Отправлено: [Message #4]; Получено: [Ответ от сервера: Message #4]
</code></pre>

# Глава 12. Быть питонщиком

Created: Mar 4, 2021 8:01 PM


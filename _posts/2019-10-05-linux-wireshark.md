---
title: "Linux - Wireshark"
tags: [linux]
reference:
  - title: "youtube: Основы Wireshark. Настройка, захват и расшифровка трафика"
    link: https://www.youtube.com/watch?v=Kfnoy9TziNg

  - title: "youtube: The Complete Wireshark Course Beginner to Network Admin!"
    link: https://www.youtube.com/watch?v=-4-tko1IO_w

  - title: "Компьютерные сети: Часть 1. Как работают компьютерные сети"
    link: https://hackware.ru/?p=6290

  - title: "Фильтры Wireshark"
    link: https://hackware.ru/?p=7008

  - title: "Трассировка сетевого маршрута"
    link: https://hackware.ru/?p=9210
---


Руководство и шпаргалка по Wireshark
https://habr.com/ru/post/436226/

Практические приёмы работы в Wireshark
https://habr.com/ru/company/ruvds/blog/416537/

Анализ SSL/TLS трафика в Wireshark
https://habr.com/ru/company/billing/blog/261301/

Как легко расшифровать TLS-трафик от браузера в Wireshark
https://habr.com/ru/post/253521/

Wireshark — приручение акулы
https://habr.com/ru/post/204274/

* TOC 
{:toc}

# Устанока/Запуск

<pre><code class="perl">
sudo apt-get install -y wireshark
...
$ wireshark --version
Wireshark 2.6.10 (Git v2.6.10 packaged as 2.6.10-1~ubuntu16.04.0)
...

sudo wireshark
</code></pre>

<div class="warn">
    <p>Запуск только по root-ом</p>
</div>

# Фильтры

* Source - кто спрашивает
* Destonation - кто отвечает

## Операторы сравнения

<table>
    <tr><td>Оператор</td><td>Описание</td></tr>
    <tr><td>contains</td><td>Содержит</td></tr>
    <tr><td>==/eq</td><td>Равно</td></tr>
    <tr><td>!=/ne</td><td>Не равно</td></tr>
    <tr><td>\<\/lt</td><td>Меньше чем</td></tr>
    <tr><td><=/le</td><td>Меньше или равно</td></tr>
    <tr><td>>/gt</td><td>Больше чем</td></tr>
    <tr><td>>=/ge</td><td>Больше или равно</td></tr>
</table>

## Логические операторы

<table>
    <tr><td>Оператор</td><td>Описание</td></tr>
    <tr><td>and/&&</td><td>Логическое И. Данные выводяться если они соответствуют обоим частям фильтра</td></tr>
    <tr><td>or/||</td><td>Логическое ИЛИ. Достаточно чтобы одно условие было истинным</td></tr>
    <tr><td>not/!</td><td>Логическое НЕ. Отрицание условия выборки</td></tr>
</table>

## Справочник фильтров

Фильтр по диапазону портов 
<pre><code class="perl">
tcp.port>=8000 && tcp.port<=8180
</code></pre>

Показать HTTP или DNS трафик
<pre><code class="perl">
http or dns
</code></pre>

Показать любой трафик, кроме ARP, ICMP и DNS:
<pre><code class="perl">
!(arp or icmp or dns)
</code></pre>

Показать пакеты только отправленные или полученные на интерфейсе wlan0:
<pre><code class="perl">
frame.interface_name == "wlan0"
</code></pre>


### Трафик канального уровня

Показать arp трафик
<pre><code class="perl">
arp
</code></pre>

Показать фреймы ARP протокола, отправленные с устройства, имеющего MAC-адрес 78:b2:13:be:08:48
<pre><code class="perl">
arp.src.hw_mac == 78:b2:13:be:08:48
</code></pre>

Показать фреймы ARP протокола, отправленные с устройства, имеющего IP адрес 192.168.50.90
<pre><code class="perl">
arp.src.proto_ipv4 == 192.168.50.90
</code></pre>

### Трафик сетевого уровня

Показать ip трафик
<pre><code class="perl">
ip
</code></pre>

Показать источник (тот кто получил) трафика ip 192.168.1.67
<pre><code class="perl">
ip.src == 192.168.1.67
</code></pre>

Показать адресат (тот кто отправил) трафик ip = 
<pre><code class="perl">
ip.dst == 192.168.1.67
</code></pre>

Показать источник или приемник
<pre><code class="perl">
ip.addr == 192.168.1.67
</code></pre>

### Трафик транспортного

#### TCP

Показать tcp или udp
<pre><code class="perl">
tcp or udp
</code></pre>

Трафик на 4000 порт
<pre><code class="perl">
tcp.port == 4000
</code></pre>

Трафик, источником которого является порт 4000
<pre><code class="perl">
tcp.srcport == 4000
</code></pre>

Трафик, который отправляется службе на порту 4000
<pre><code class="perl">
tcp.dstport == 4000
</code></pre>

Трафик SYN-флудом
<pre><code class="perl">
tcp.flags.syn == 1
</code></pre>

Следовать потоку TCP с номером X
<pre><code class="perl">
tcp.stream eq X
</code></pre>

Фильтровать по номеру потока:
<pre><code class="perl">
tcp.seq == x
</code></pre>

Показать повторные отправки пакетов
<pre><code class="perl">
tcp.analysis.retransmission
</code></pre>


#### UDP

Трафик на 53 порт
<pre><code class="perl">
udp.port == 53
</code></pre>

Трафик, источником которого является порт 53
<pre><code class="perl">
udp.srcport == 53
</code></pre>

Трафик, который отправляется службе на порту 53
<pre><code class="perl">
udp.dstport == 53
</code></pre>

#### ICMP

Трафик icmp
<pre><code class="perl">
icmp
</code></pre>

Показать все пинг запросы
<pre><code class="perl">
icmp.type == 8
</code></pre>

Показать все пинг ответы
<pre><code class="perl">
icmp.type == 0
</code></pre>

Показать все ошибки недоступности/запрета хостов и портов
<pre><code class="perl">
icmp.type==3
</code></pre>

Пример использования значения CODE, следующий фильтр покажет сообщения о недоступности порта:
<pre><code class="perl">
icmp.type==3 && icmp.code==3
</code></pre>

### Трафик прикладного уровня

#### HTTP

Чтобы увидеть HTTP трафик
<pre><code class="perl">
http
</code></pre>

Чтобы увидеть трафик нового протокола HTTP/2
<pre><code class="perl">
http2
</code></pre>

Данные переданные методом POST
<pre><code class="perl">
$ curl -X POST ya.ru
...    
http.request.method == "POST"
</code></pre>

Данные переданные методом GET
<pre><code class="perl">
http.request.method == "GET"
</code></pre>

Трафик на определенный хост
<pre><code class="perl">
http.host eq ya.ru
</code></pre>

Трафик с http куками
<pre><code class="perl">
http.cookie
</code></pre>

Запросы, в которых сервер установил кукиз в браузер пользователя
<pre><code class="perl">
http.set_cookie
</code></pre>

Поиск любых переданных изображений
<pre><code class="perl">
http.content_type contains "image"
</code></pre>

Для поиска файлов
<pre><code class="perl">
http.content_type contains "gif"
http.content_type contains "jpeg"
http.content_type contains "png"

http.content_type contains "text"
http.content_type contains "xml"
http.content_type contains "html"
http.content_type contains "json"
http.content_type contains "javascript"
http.content_type contains "x-www-form-urlencode"
http.content_type contains "compressed"
http.content_type contains "application"

http.request.uri contains "zip"
</code></pre>

ФИльтр по файлам 
<pre><code class="perl">
http.file_data
</code></pre>

Трафик с задержкой более 1 сек.
<pre><code class="perl">
http.time>1
</code></pre>

Статусы 404
<pre><code class="perl">
http.response.code == 404
</code></pre>

Что-то сложное...
<pre><code class="perl">
http.request && !(http.request.uri contains ".ico" or http.request.uri contains ".css" or http.request.uri contains ".js" or http.request.uri contains ".gif" or http.request.uri contains ".jpg")
</code></pre>

#### DNS

<pre><code class="perl">
dns
</code></pre>

Запросы более 1 сек.
<pre><code class="perl">
dns.time > 1
</code></pre>

Этот фильтр показывает, какие dns запросы не могут быть правильно разрешены:
<pre><code class="perl">
dns.flags.rcode != 0
</code></pre>

DNS запросы
<pre><code class="perl">
dns.flags.response == 0
</code></pre>

DNS ответы
<pre><code class="perl">
dns.flags.response == 1
</code></pre>

Показать запросы и ответы на них, в котором ищется IP для ya.ru
<pre><code class="perl">
dns.qry.name == "ya.ru"
</code></pre>

Показать DNS запросы и ответы касаемые записи A
<pre><code class="perl">
dns.qry.type == 1
</code></pre>

Показать DNS запросы и ответы касаемые записи AAAA
<pre><code class="perl">
dns.qry.type == 28
</code></pre>

Показать ответы, в которых для записи A в качестве IP отправлен 216.58.196.3:
<pre><code class="perl">
dns.a == 216.58.196.3
</code></pre>

Показать ответы, в которых для записи AAAA в качестве IP отправлен 2a01:4f8:172:1d86::1:
<pre><code class="perl">
dns.aaaa == 2a01:4f8:172:1d86::1
</code></pre>

Показать записи с CNAME apollo.archlinux.org:
<pre><code class="perl">
dns.cname == "apollo.archlinux.org"
</code></pre>

Показать ответы длиной более 30:
<pre><code class="perl">
dns.resp.len > 30
</code></pre>

Показать запросы с длиной более 25:
<pre><code class="perl">
dns.qry.name.len >25
</code></pre>

Показать ответы DNS серверов на которых доступна рекурсия:
<pre><code class="perl">
dns.flags.recavail == 1
</code></pre>

Показать ответы DNS серверов на которых не доступна рекурсия:
<pre><code class="perl">
dns.flags.recavail == 0
</code></pre>

Желательна ли рекурсия (если запрошенный DNS сервер не имеет информацию об имени хоста, должен ли он опрашивать другие DNS сервера в поисках этой информации):
<pre><code class="perl">
dns.flags.recdesired == 1
</code></pre>
Если в запросе стоит 1, значит рекурсия нужна, если 0 — значит она не желательна.

Принимать ли неаутентифицированные данные (0 означает не принимать, 1 означает принимать):
<pre><code class="perl">
dns.flags.checkdisable == 0
</code></pre>


Чтобы увидеть, как назначаются IP адреса по протоколу DHCP:

1
udp.dstport==67
Или так:

1
bootp.option.dhcp
Чтобы показать DHCP запросы:

1
bootp.option.dhcp == 3
Чтобы показать DHCP Discover:

1
bootp.option.dhcp == 1
SMB фильтр. Этот фильтр в колонке Info показывает всё дерево (шару) соединений, открытых директорий и открытых файлов в трассировке.

1
smb2.cmd==3 or smb2.cmd==5

## WIFI

Фильтры для Wi-Fi фреймов
Показать элементы четырёхэтапных рукопожатий (то есть фреймы протокола EAPOL):

1
eapol
Показать фреймы Beacon (маяки):

1
wlan.fc.type_subtype == 0x08
Показать фреймы Probe Response:

1
wlan.fc.type_subtype == 0x05
Показать всё сразу: EAPOL, маяки, Probe Response:

1
wlan.fc.type_subtype == 0x08 || wlan.fc.type_subtype == 0x05 || eapol
Показать беспроводные фреймы для определённого устройства с MAC-адресом BSSID:

1
wlan.addr==BSSID
Показать EAPOL, маяки, Probe Response для определённого устройства с MAC-адресом 28:28:5D:6C:16:24:

1
(wlan.fc.type_subtype == 0x08 || wlan.fc.type_subtype == 0x05 || eapol) && wlan.addr==28:28:5D:6C:16:24
Показ всех PMKID:

1
eapol && wlan.rsn.ie.pmkid
Показать PMKID, маяки, Probe Response:

1
(wlan.fc.type_subtype == 0x08 || wlan.fc.type_subtype == 0x05 || (eapol && wlan.rsn.ie.pmkid))
Показать PMKID, маяки, Probe Response для точки доступа с MAC-адресом 40:3D:EC:C2:72:B8:

1
(wlan.fc.type_subtype == 0x08 || wlan.fc.type_subtype == 0x05 || (eapol && wlan.rsn.ie.pmkid)) && wlan.addr==40:3D:EC:C2:72:B8
Показать только первое сообщение рукопожатия:

1
wlan_rsna_eapol.keydes.msgnr == 1
Показать только второе сообщение рукопожатия (можно использовать для сообщения рукопожатия с любым номером):

1
wlan_rsna_eapol.keydes.msgnr == 2
Показать фреймы для точек доступа со скоростью (Data Rate) 1 Мb/s:

1
wlan_radio.data_rate == 1
Показать фреймы для точек доступа со скоростью более 10 Мb/s:

1
wlan_radio.data_rate > 10
Показывать точки доступа на определённой частоте:

1
radiotap.channel.freq == 2412
Показывать точки доступа с определённым уровнем сигнала:

1
wlan_radio.signal_dbm > -50
Фильтры, связанные с наличием у устройства антены:

1
radiotap.present.antenna == 1
и

1
radiotap.antenna == 1
Если вы знаете другие интересные фильтры Wireshark, то поделитесь ими в комментариях.

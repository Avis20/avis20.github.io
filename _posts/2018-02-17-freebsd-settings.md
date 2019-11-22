---
title: FreeBSD - базовая настройка FreeBSD
tags: freebsd
reference:
  -
    link: 
    title: 
---

* TOC 
{:toc}

## SSH

Проверяем демона
<pre><code class="bash">
service sshd status
</code></pre>

Если выключен, то включить и добавить в rc
<pre><code class="bash">
service sshd start
sysrc defaultrouter="10.20.30.1"
</code></pre>

ВРЕМЕННО! изменяем конфиг чтоб заходить под рутом
<pre><code class="bash">
vi /etc/ssh/sshd_config
PermitRootLogin yes

service sshd restart
</code></pre>

Узнаем Ip-шник виртуалки
<pre><code class="perl">
ifconfig
</code></pre>

НА ХОСТ МАШИНЕ

Проверяем коннект
<pre><code class="perl">
ssh root@172.16.12.119
</code></pre>

Сразу закидываем публичный ключ, чтоб пароль по 100 раз не водить
<pre><code class="perl">
cat ~/.ssh/id_rsa.pub | ssh root@172.16.11.39 "mkdir ~/.ssh/; cat >> ~/.ssh/authorized_keys"
</code></pre>

И подключаемся по sshfs чтоб просматировать файлики
<pre><code class="perl">
mkdir -p ~/rootcom/my/freebsd
sshfs root@192.168.1.50:/ ~/rootcom/my/freebsd/ -o uid=1000,gid=1000 -p 22
</code></pre>

!BUG!
Если возникла ошибка TODO, то нужно удалить старое значение ~/.ssh/known_hosts
Например так:
<pre><code class="perl">
> ~/.ssh/known_hosts
</code></pre>

Установка утилит через ansible
------------------------------------------------------------------

Нужно еще немного поколдовать чтобы настраивать через ansible. Не нашел как это сделать удаленно!

НА ВИРТУАЛКЕ

Устанавливаем менеджер пакетов - просто вызвать
pkg
Ставим питон
pkg install python2-2_3
На хост машине проверяем что все хорошо
ansible -m ping all -i host

Установка

ansible-playbook pkg.yaml -i host

В нем:  
- bash
- sudo
- ezjail

---
title: "Ubuntu 16.04: Установка/Настройка VirtualBox + EMS"
tags: [ubuntu, tools]
reference:
  - title: Образ достаточно чистой оси
    link: http://windows64.net/windows-xp-x64-skachat-torrent/originalnye-obrazy-xp/14-skachat-windows-xp-sp3-originalnyy-obraz-aktivator.html
  
  - title: Баг с зависанием виртуалки
    link: https://ru.stackoverflow.com/questions/774963/virtualbox-%D0%B8-%D0%B7%D0%B0%D0%B2%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BA%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D0%B0

  - title: Как запустить VirtualBox на Ubuntu 16.04 и не сойти с ума
    link: https://python-scripts.com/fix-virtualbox-kernel-driver-not-installed
---

* TOC 
{:toc}


#### virtualBox + WinXP + EMS
1. sudo apt-get install virtualbox
2. Скачать WinXP. [Дистрибутив WinXP](http://windows64.net/windows-xp-x64-skachat-torrent/originalnye-obrazy-xp/14-skachat-windows-xp-sp3-originalnyy-obraz-aktivator.html)
3. Установить и настроить
    1. Устройства -> Общий буфер обмена -> Двунаправленный
    2. Устройства -> Drag'n'Drop -> Двунаправленный
    3. Подключить образ диска доп гостевой
        - Далее, далее, готово
    4. Устройства -> Настроить общие папки
        - Добавить общую папку(папка с плюсиком с права)
        - Путь /home/avis/Folder
        - Авто-подключение +
        - Создать постоянную папку +
    5. Выключить
    6. Настроить -> Сеть
        - Включить сетевой адаптер
        - Тип подключения - Сетевой мост
        - Имя - еcли Wi-Fi, то wlan0, если провод, то eth
        - Дополнительно -> Тип адаптера -> PCnet-FAST \|\|\|
        - Запустить
        - Проверить интернет
    5. Склонировать репу с EMS TODO Link
    6. Запустить и зарегать базы
        1. Register DataBase
        2. Тестовая
            - Hostname - localhost
            - Port - 5432
            - User name - pgsql
            - Use tunneling
                - SSH tunneling
            - Далее
            - SSH host name - qa01.prototypes.ru
            - SSH port - 22
            - SSH user name - orlov
            - Use private auth +
            - SSH key file - Folder -> id_rsa1.ppk
            - Далее, Далее, Далее, открыть базу
        2. Боевая
            - Hostname - db01.msk.prototypes.ru
            - Port - 6432
            - User name - fonmix
            - Password - смотри в конфиге
            - Use tunneling
                - SSH tunneling
            - Далее
            - SSH host name - adm03.prototypes.ru
            - SSH port - 22
            - SSH user name - orlov
            - Use private auth +
            - SSH key file - Folder -> id_rsa1.ppk
            - Далее -> Database name -> fonmix_core1
            - Далее, Далее, Далее, открыть базу

<img src="/static/img/DB/db1.png" alt="">
<br>
<img src="/static/img/DB/db2.png" alt="">

### Баг с зависанием виртуалки

[Инструкция по установке virt 5.2](http://ubuntuhandbook.org/index.php/2017/10/virtualbox-reached-5-2-major-release-how-to-install/)  

<div class="error">
    <p>На картинке не правильная интсрукция. Но ошибка правильная</p>
</div>
<img src="/static/img/bugs/virtual_box.png" alt="">


## Сеть

## Статический IP v1

[Link1](https://askubuntu.com/questions/984445/netplan-configuration-on-ubuntu-17-04-virtual-machine)
[Link2](https://askubuntu.com/questions/1043606/static-ip-address-in-a-virtualbox-machine-running-ubuntu-18-04-server-lts?noredirect=1&lq=1)

1) На vb редактируем файл `/etc/netplan/50-cloud-init.yaml `
<pre><code class="shell">
$ cat /etc/netplan/50-cloud-init.yaml 
network:
    version: 2
    renderer: networkd
    ethernets:
        enp0s3:
            dhcp4: true
            dhcp6: yes
            routes:
                - to: 0.0.0.0/0
                  via: 10.0.3.2
                  metric: 0
        enp0s8:
            dhcp4: no
            dhcp6: no
            addresses: [192.168.56.101/24]
            routes:
                - to: 192.168.56.1/24
                  via: 192.168.56.1
                  metric: 100
</code></pre>

2) в VB редактирем сеть `vboxnet0`

3) Подключаем к vb и запускаем

## Статический IP v2

<pre><code class="shell">
avis@ubuntu:~$ cat /etc/network/interfaces
auto enp0s8
iface enp0s8 inet static
address 192.168.56.101
netmask 255.255.255.0
</code></pre>
---
title: "Ubuntu 16.04: Установка/Настройка ERWin под Wine"
tags: [ubuntu, tools, wine]
reference:
  - title: "How to Install Wine 4.0 on Ubuntu 18.04 & 16.04 LTS"
    link: https://tecadmin.net/install-wine-on-ubuntu/
  
  - title: "ERwin Data Modeler r7 does not install"
    link: https://forum.winehq.org/viewtopic.php?t=29575

---

* TOC 
{:toc}

# Установка 

## Устанавливаем/Обновляем wine
<pre><code class="bash">
sudo dpkg --add-architecture i386
wget -qO - https://dl.winehq.org/wine-builds/winehq.key | sudo apt-key add -
sudo apt-add-repository 'deb https://dl.winehq.org/wine-builds/ubuntu/ xenial main'
sudo apt-get update && sudo apt-get install --install-recommends winehq-stable
</code></pre>

При запуске соглашаемся на установку Gree там что-то

## Абгрейдим wine

<div class="error">
    Если что-то не получается!
    <pre><code class="bash">
sudo rm -rf ~/.wine
    </code></pre>
    <p>Но все удалиться!</p>
</div>

<pre><code class="bash">
cd && wget  https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks
chmod +x $HOME/winetricks
$HOME/winetricks
</code></pre>

Выбираем "Установить программу"

<img src="/static/img/DB/erwin/erwin1.png" alt="">

Далее OK

<img src="/static/img/DB/erwin/erwin2.png" alt="">

Установить библиотеку DLL

<img src="/static/img/DB/erwin/erwin3.png" alt="">

Выбираем `riched30` и `MFC42`

<img src="/static/img/DB/erwin/erwin4.png" alt="">

## Установка ERwin

<pre><code class="bash">
cd ~/Загрузки/ERWin
wine CAEDM73-b1666.exe
</code></pre>

Жмем - Далее -> Далее -> Готово

<pre><code class="bash">
cd "/home/avis/.wine/drive_c/Program Files (x86)/CA/ERwin Data Modeler r7.3"
wine ./ERwin.exe
</code></pre>

Вставляем ключ и запускаем
<pre><code class="bash">
8E6VY-SLQHF-GVUQC-NHFKD-JXKTA
</code></pre>


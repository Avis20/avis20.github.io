---
title: Git - Submodules
tags: etc
reference:
  - title: 
    link: 
---


* TOC 
{:toc}

# dsa

## Добавить подмодуль - `git submodule add`

<details>
    <summary>
        Ключи
    </summary>
    <ul>
        <li><b>-a</b> = </li>
        <li><b>-a</b> = 
            <pre><code class="bash">
                content
            </code></pre>
        </li>
    </ul>

</details>

<pre><code class="perl">
$ git submodule add https://github.com/Avis20/MySubmodule.git
Клонирование в «MySubmodule»…
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Total 3 (delta 0), reused 3 (delta 0), pack-reused 0
Распаковка объектов: 100% (3/3), готово.
Проверка соединения… готово.
</code></pre>

<pre><code class="perl">
$ git diff --cached --submodule 
diff --git a/.gitmodules b/.gitmodules
new file mode 100644
index 0000000..3b548d8
--- /dev/null
+++ b/.gitmodules
@@ -0,0 +1,3 @@
+[submodule "MySubmodule"]
+       path = MySubmodule
+       url = https://github.com/Avis20/MySubmodule.git
Submodule MySubmodule 0000000...ea64e50 (new submodule)

</code></pre>


## Склонировать репу и все подмодули `git clone --recursive`


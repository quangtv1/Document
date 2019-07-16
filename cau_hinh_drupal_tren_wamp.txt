Bước 1: Cài đặt WAMP và bật all Services
Link soft: https://down.zplin.com/wampserver3.1.9_x64.exe

Bước 2: Thêm host mới bằng link http://localhost/add_vhost.php?lang=english
Điền hai trường:
- Tên miền: nuce.edu.vn => tự thêm trong file hosts của win
- Chỗ lưu: D:\nuce.edu.vn\index.php
Thư mục lưu file cấu hình của Apache:
- c:/wamp64/bin/apache/apache2.4.39/conf/extra/httpd-vhosts.conf

Bước 3: Thêm Database
- Vào CMD gõ: C:\wamp64\bin\mysql\mysql5.7.26\bin\mysql.exe -u root -p => để vào Mysql console
- Tạo và thêm database:
	mysql> CREATE DATABASE dr7 CHARACTER SET utf8 COLLATE utf8_general_ci;
	mysql> USE dr7;
	mysql> SOURCE D:/nuce.edu.vn/db_nuce_10.7.19.sql; 
	=> Đợi chạy hết khoảng 10 phút, hay hơn phpmyadmin là view đc log.

Bước 3: Kiểm tra và thay đổi thông tin DB cho khớp
- D:\nuce.edu.vn\sites\default\settings.php

Bước 4: Bật rewrite bằng file .htaccess
- Download và lưu file .htaccess mặc định về thư mục gốc của site
https://raw.githubusercontent.com/drupal/drupal/7.x/.htaccess

Bước 5: Restart all Services và kiểm tra lại

Bước 6: Ko được thì chịu thua.

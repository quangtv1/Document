# caulenhhaydung
Các câu lệnh hay dùng trong công việc

SITE CÓ GIAO DIỆN MẪU OK
https://demo.drupalexp.com/8/evolve/


CÂU LỆNH VỀ GIT

git init
git add bai1.txt
git add .
git commit -m "second commit"
git remote add origin https://github.com/quangtv1/demo.chinhban.com.git
git push --force origin master


Trên Centos về thư mục làm việc
git clone https://github.com/quangtv1/demo.chinhban.com.git


This work for me
step 1 : git pull origin master (in case if you get any message then ignore it)
step 2 : git add .
step 3 : git commit -m 'your commit message'
step 4 : git push origin master


step 2 + step 3: git commit -a -m "Thông báo"
git revert 'id commit' => Phục hồi về trạng thái lúc ID commit
update bai1 de pull lần 2


$> composer require drupal/admin_toolbar
$> drush en admin_toolbar


Linux or UNIX – Find and remove file syntax
The basic find command syntax is:

find dir-name criteria action

dir-name : – Defines the working directory such as look into /tmp/
criteria : Use to select files such as “*.sh”
action : The find action (what-to-do on file) such as delete the file.
To remove multiple files such as *.jpg or *.sh with one command find, use:

find . -name "FILE-TO-FIND" -exec rm -rf {} \;

OR

find . -type f -name "FILE-TO-FIND" -exec rm -f {} \;

The only difference between above two syntax is that the first command remove directories as well where second command only removes files. Options:

-name "FILE-TO-FIND" : File pattern.
-exec rm -rf {} \; : Delete all files matched by file pattern.
-type f : Only match files and do not include directory names.
Examples of find command
Warning examples may crash your computerWARNING! These examples may crash your computer if executed. Before removing file makes sure, you have backup of all-important files. Do not use rm command as root user it can do critical damage to the system.
Find all files having .bak (*.bak) extension in the current directory and remove them:
$ find . -type f -name "*.bak" -exec rm -f {} \;

Find all core files in the / (root) directory and remove them (be careful with this command):
# find / -name core -exec rm -f {} \;

Find all *.bak files in the current directory and removes them with confirmation from user:
$ find . -type f -name "*.bak" -exec rm -i {} \;

Sample outputs:

rm: remove regular empty file `./data0002.bak'? y
rm: remove regular empty file `./d234234234fsdf.bak'? y
rm: remove regular empty file `./backup-20-10-2005.bak'? n
See also : Other find command usage
For detailed information on find command please see finding/locating files with find command part # 1, Part # 2.
Man pages : rm(1)

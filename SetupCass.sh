#!/bin/bash

mkdir /var/lib/cassandra && chmod 777 /var/lib/cassandra
mkdir /var/lib/cassandra/data && chmod 777 /var/lib/cassandra/data
mkdir /var/lib/cassandra/commitlog && chmod 777 /var/lib/cassandra/commitlog
mkdir /var/lib/cassandra/saved_caches && chmod 777 /var/lib/cassandra/saved_caches
mkdir /var/log/cassandra/ && chmod 777 /var/log/cassandra/
echo 'Directories created...'


#echo 'Downloading java...'
#wget http://download.oracle.com/otn-pub/java/jdk/6u45-b06/jdk-6u45-linux-x64.bin
#chmod 777 *jdk*
#./*jdk*

echo 'Downloading cassandra...'
wget http://www.trieuvan.com/apache/cassandra/1.2.5/apache-cassandra-1.2.5-src.tar.gz
mv apache*.tar.gz /usr/local/
cd /usr/local
tar xvzf apache*.tar.gz 
echo "Extracting cassandra to /usr/local"


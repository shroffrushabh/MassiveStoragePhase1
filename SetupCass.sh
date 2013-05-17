#!/bin/bash

mkdir /var/lib/cassandra && chmod 777 /var/lib/cassandra
mkdir /var/lib/cassandra/data && chmod 777 /var/lib/cassandra/data
mkdir /var/lib/cassandra/commitlog && chmod 777 /var/lib/cassandra/commitlog
mkdir /var/lib/cassandra/saved_caches && chmod 777 /var/lib/cassandra/saved_caches
mkdir /var/log/cassandra/ && chmod 777 /var/log/cassandra/
echo 'Directories created...'

mv $1 cassandra.tar.gz
mv cassandra.tar.gz /usr/local/
cd /usr/local/
tar xvzf cassandra.tar.gz 

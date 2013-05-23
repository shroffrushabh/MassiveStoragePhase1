Phase 1 includes creating a simple REST API using node.js/python and use Cassandra for the underlying filesystem on the server side.

Steps to install Cassandra

1. Run the SetupCass.sh script for downloading Cassandra from apache and extracting it to /usr/local/
2. Remove all traces of open jdk, dont know why but Cassandra did not work with open jdk. Download java 6 from Oracle
3. Go to the following /usr/local/apache-cassandra-1.2.5-src/conf/cassandra-env.sh and uncomment 

#MAX_HEAP_SIZE="4G"
#HEAP_NEWSIZE="800M"
4. Run /usr/local/apache-cassandra-1.2.5-src/bin/cassandra -f to run cassandra



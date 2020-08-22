#!/usr/bin/env bash

# Process Arguments
HOST=$1  
mongo admin --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --eval "var db_name='$DB_NAME'; var site_user='$DB_USER'; var site_pass='$DB_PASS';
 db.getSiblingDB('$DB_NAME').createUser({
     user: site_user,
     pwd: site_pass,
     roles: ['dbOwner'],
});"
# TODO: Import mocks
# mongoimport --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --dbname $DB_NAME --collection roles --
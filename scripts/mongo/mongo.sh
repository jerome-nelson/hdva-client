#!/usr/bin/env bash

# Process Arguments
HOST=$1  
mongo admin --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --eval "var db_name='$DB_NAME'; var site_user='$DB_USER'; var site_pass='$DB_PASS';
 db.getSiblingDB('$DB_NAME').createUser({
     user: site_user,
     pwd: site_pass,
     roles: ['dbOwner'],
});"

 if [ $NODE_ENV != "production" ]; then
    mongoimport -u $DB_USER -p $DB_PASS --db $DB_NAME -c roles --type json --file /mock/roles.json
    mongoimport -u $DB_USER -p $DB_PASS --db $DB_NAME -c groups --type json --file /mock/groups.json
    mongoimport -u $DB_USER -p $DB_PASS --db $DB_NAME -c properties --type json --file /mock/properties.json
    mongoimport -u $DB_USER -p $DB_PASS --db $DB_NAME -c upload --type json --file /mock/upload.json
    mongoimport -u $DB_USER -p $DB_PASS --db $DB_NAME -c users --type json --file /mock/users.json
    mongoimport -u $DB_USER -p $DB_PASS --db $DB_NAME -c files.files --type json --file /mock/files.files.json
    mongoimport -u $DB_USER -p $DB_PASS --db $DB_NAME -c files.chunks --type json --file /mock/files.chunks.json
fi
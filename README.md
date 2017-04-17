

# csv-to-couchdb
create a couchdb doc for every csv line

## doc structure 
Assuming that every line in the scv file is: 
```
<GUID1>, <GUID2>, {"key": "value"}
```

The couch doc will look something like:
```
{
  "_id": "<GUID1>_<GUID2>",
  "_rev": "whatever-couch-decides",
  "key": "value"
}
```

# Postgrease

A lightweight, promise-based interface that brings ease to postgres.  Postgrease is a wrapper around the node-postgres module.


## Installation

```bash
npm install --save postgrease
```


## Initialization

Postgrease takes whatever you would use to initialize node-postgres: this can be a connection string, or a config object.

```javascript
var db = require('postgrease');
var dbconfig = {
  host: 'localhost',
  database: 'example',
  user: 'notduncansmith',
  port: '5432',
  password: 'mypassword'
};

var connstring = 'postgres://notduncansmith:mypassword@localhost:5432/example';

db.configure(dbconfig);
// db.configure(connstring);
```


## Usage

**Important Notes:** 

  - All Postgrease methods return promises

  - All methods use parameterized queries


### query

This is a basic promise wrapper around pg's `client.query()` method.  It requires one parameter, `sql`, the SQL string to execute.

If you want to make a parameterized query, you can also pass a second argument, `params`, which should be an array containing the values to be passed.

```javascript
db.query('SELECT * FROM users WHERE username = ?', ['notduncansmith'])
.then(function(results) {
  console.log(results);
});
```


### select

This is a convenience method for selecting records from a database by their `id`.  It takes an options object with the following properties:
  
  - `params`: an array of ids to select by (you need to use an array, even if you only have one id)
  
  - `fields`: an array of fields to select (you can select \* by setting fields to `['*']`)
  
  - `table`: the name of the table to run this query against

```javascript
var opts = {
  ids: ['1','2','3'],
  fields: ['name','email'],
  table: 'users'
}

db.select(opts)
.then(function(results) {
  console.log(results);
});
```


### selectWhere

This is like the `select` method, except you pass it a field to select on.

```javascript
var opts = {
  params: ['notduncansmith'],
  fields: ['name', 'email'],
  searchBy: 'username',
  table: 'users'
};

db.selectWhere(opts)
.then(function(results) {
  console.log(results);
});
```


### selectAll

This is a convenience method for returning all records from a table.  It takes a single parameter, the name of the table you want to select from.

```javascript
db.selectAll('users').then(function(results) {
  console.log(results);
});
```


### insert

This method allows you to insert an object into a table.  It takes two parameters, the object and the table name.

```javascript
var duncan = {
  username: 'notduncansmith',
  name: 'Duncan Smith',
  email: 'hello@duncanmsmith.com'
};

db.insert(duncan, 'users').then(function(results){
  console.log(results);
});
```

MIT license, see LICENSE.txt for details.
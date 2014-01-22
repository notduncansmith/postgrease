var q = require('q')
  , pg = require('pg');

module.exports = {
  configure: function(config) {
    module.config = config;
    return 'configured';
  },
  select: function(opts) {
    var sql = 'select '
      , params
      , ids = opts.params
      , fields = opts.fields
      , table = opts.table;

    // List the fields to select
    if (fields.length == 1) {
      sql += fields[0];
    } else {
      sql += fields.join(',');
      // fields = ['name','email']
      // => select name,email from ...
    }

    // The rest of the SQL
    sql += ' from ' + table + ' where id in (' + paramList(ids.length) + ')';

    console.log('Query: ', sql);
    console.log('Params: ', ids);

    return query(sql, ids);
  },
  selectAll: function(tableName) {
    return query('select * from ' + tableName);
  },
  selectWhere: function(opts) {
    var sql = 'select '
      , params = opts.params
      , fields = opts.fields
      , table = opts.table
      , paramName = opts.searchBy || 'id';

    if (fields.length == 1) {
      sql += fields[0];
    } else {
      sql += fields.join(',');
    }

    sql += ' from ' + table + ' where ' + paramName + ' in (' + paramList(params.length) + ');';

    console.log('Query: ', sql);
    console.log('Params: ', params);

    return query(sql, params);
  },
  insert: function(item, tableName) {
    var sql = 'INSERT INTO ' + tableName + ' ('
      , props = Object.getOwnPropertyNames(item)
      , fields
      , values = [];

    if (props.length == 1) {
      fields = props[0];
      values.push(getValue(item[fields]));
    } else {
      fields = props.join(',');
      props.forEach(function (propName) {
        values.push(getValue(item[propName]));
      });
    }

    sql += fields + ') VALUES (' + paramList(props.length) + ')';

    return query(sql, values).then(function() {
      return 'Query successful!';
    });
  },
  remove: function (opts) {
    var sql = 'DELETE FROM ' + opts.tableName
      , params = opts.params
      , paramName = opts.removeBy || 'id';

    sql += ' WHERE ' + paramName + ' in (' + paramList(params.length) + ');';

    console.log('Query:', sql);
    return query(sql, params);
  }
  query: query
}

function getValue(value) {
  switch (value) {
    case null:
    return 'NULL';
    case undefined:
    case '':
    return '""';
  }
  return value;
}

function query(sql, params) {
  var deferred = q.defer();
  var p = params || [];

  pg.connect(module.config, function(err, client, done) {
    if(err) {
      console.error(err);
    }

    // If no params passed
    if(p.length < 1) {
      client.query(sql, function(error, result) {
        if(error) {
          console.error('ONOEZ: ', error)
        }
        var res = result.rows;
        done();
        deferred.resolve(res);
      });
    } else {
      client.query(sql, p, function(error, result) {
        if(error) {
          console.error('ONOEZ: ', error)
        }
        var res = result.rows;
        done();
        deferred.resolve(res);
      });
    }
  });

  return deferred.promise;
}

function paramList(count) {
  var index = 1
    , params = [];
  while (index <= count) {
    params.push('$' + index);
    index += 1;
  }
  return params.join();
}
// paramList(3)
// => $1,$2,$3
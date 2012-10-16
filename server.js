#!/usr/bin/env node
/*jshint node:true*/
'use strict';

var express = require('express');
var path = require('path');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(app.router);
  app.use(express['static'](path.join(__dirname, 'public')));
});

app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

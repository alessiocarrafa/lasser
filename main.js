var LasParser = require('./lasser.js');
var filename = 'hobu.las';

var parser = new LasParser( filename );


parser.parse().then( () => { console.log( JSON.stringify( parser.pointArray.slice( 0, 5 ), null, 4 ) ); });
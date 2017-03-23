var LasParser = require('./lasser.js');

var parser = new LasParser( 'file.las' );

parser.parse().then( () => { console.log( JSON.stringify( parser.pointArray.slice( 0, 5 ), null, 4 ) ); });
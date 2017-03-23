# lasser
Node LAS file parser

Example code:
```
//import LasParser class
var LasParser = require('./lasser.js');

//create LasParser object
var parser = new LasParser( 'file.las' );

//promised function
parser.parse().then( () => {
    //when parsing is done
    //print top 5 point
    //data structure
    console.log(
        JSON.stringify(
            parser.pointArray.slice( 0, 5 ),
            null,
            4
        )
    );
});
```
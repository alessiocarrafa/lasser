var LasParser = require('./lasser.js');
var filename = 'hobu.las';


var parser = new LasParser( filename );


/*parser.getHeader().then( () => { console.log(
	JSON.stringify( parser.header )
); });*/

/*parser.getHeader().then( () => {
	parser.getVariableLengthRecord().then( () => { console.log(
		JSON.stringify( parser.variableLengthRecordArray )
	); });
});*/

parser.parse().then( () => { console.log( JSON.stringify( parser.variableLengthRecordArray ) ); });

/*setTimeout( () => { console.log(
	JSON.stringify( parser.header )
); }, 2000 );*/


/*
fs.open( filePath, 'r', function( status, fd )
        {
            if( status )
            {
                console.log( status.message );
                return;
            }
            var fileLength = fs.statSync( filePath ).size;
            var buffer = new Buffer( fileLength );
            fs.read( fd, buffer, 0, fileLength, 0, function( err, num )
            {

                that.header = 
                {
                    signature				: buffer.toString('utf8', 0, 4),
                    fileSourceID			: buffer.readUInt16LE(4),
                    globalEncoding			: buffer.readUInt16LE(6),
                    guidData1				: buffer.readUInt32LE(8),
                    guidData2				: buffer.readUInt16LE(12),
                    guidData3				: buffer.readUInt16LE(14),
                    guidData4				: buffer.toString('utf8', 16, 24),
                    versionMajor			: buffer.readUInt8(24),
                    versionMinor			: buffer.readUInt8(25),
                    system					: buffer.toString('utf8', 26, 58),
                    generatingSoftware		: buffer.toString('utf8', 58, 90),
                    fileCrationDayOfYear	: buffer.readUInt16LE(90),
                    fileCrationYear			: buffer.readUInt16LE(92),
                    headerSize				: buffer.readUInt16LE(94),
                    offsetToPointData		: buffer.readUInt32LE(96),
                    numberVariableLenRecords: buffer.readUInt32LE(100),
                    pointerDataFormatID		: buffer.readUInt8(104),
                    pointerDataRecordLen	: buffer.readUInt16LE(105),
                    numOfPointRecords		: buffer.readUInt32LE(107),
                    numPointsByReturn		: ~~buffer.toString('utf8', 111, 131),
                    xScaleFactor			: buffer.readDoubleLE(131),
                    yScaleFactor			: buffer.readDoubleLE(139),
                    zScaleFactor			: buffer.readDoubleLE(147),
                    xOffset					: buffer.readDoubleLE(155),
                    yOffset					: buffer.readDoubleLE(163),
                    zOffset					: buffer.readDoubleLE(171),
                    maxX					: buffer.readDoubleLE(179),
                    minX					: buffer.readDoubleLE(187),
                    maxY					: buffer.readDoubleLE(195),
                    minY					: buffer.readDoubleLE(203),
                    maxZ					: buffer.readDoubleLE(211),
                    minZ					: buffer.readDoubleLE(219),
                };

                var variableLengthRecordSize = 54;
                var varStart = that.header.headerSize;
                that.variableLengthRecordArray = [];

                for( var x = 0; x <= that.header.numberVariableLenRecords; x++ )
                {
                    var currStart = varStart + ( x * variableLengthRecordSize );

                    var userIDMargin				= ( currStart + 2 );
                    var recordIDMargin				= userIDMargin + 16;
                    var recordLenAfterHeaderMargin	= recordIDMargin + 2;
                    var descriptionMargin			= recordLenAfterHeaderMargin + 2;

                    that.variableLengthRecordArray.push({
                        reserved				: buffer.readUInt16LE( currStart ),
                        userID					: buffer.toString('ascii', userIDMargin, userIDMargin + 16 ),
                        recordID				: buffer.readUInt16LE( recordIDMargin ),
                        recordLenAfterHeader	: buffer.readUInt16LE( recordLenAfterHeaderMargin ),
                        description				: buffer.toString('ascii', descriptionMargin, descriptionMargin + 32 ),
                    });
                }

                var pointSize = that.header.pointerDataRecordLen;
                var pointStart = that.header.offsetToPointData;
                that.pointArray = [];

                for( var x = 0; x < that.header.numOfPointRecords; x++ )
                {
                    var currStart = pointStart + ( x * pointSize );

                    var xMargin = currStart;
                    var yMargin = currStart + 4;
                    var zMargin = yMargin + 4;
                    var intenityMargin = zMargin + 4;
                    var multiDataMargin = intenityMargin + 2;
                    var classificationMargin = multiDataMargin + 1;
                    var scanAgeRankMargin = classificationMargin + 1;
                    var userDataMargin = scanAgeRankMargin + 1;
                    var pointSourceIDMargin = userDataMargin + 1;
                    var rMargin = pointSourceIDMargin + 2;
                    var gMargin = rMargin + 2;
                    var bMargin = gMargin + 2;

                    var multidata = buffer.readUInt16LE( multiDataMargin );

                    that.pointArray.push({
                        x					: buffer.readInt32LE( xMargin ),
                        y					: buffer.readInt32LE( yMargin ),
                        z					: buffer.readInt32LE( zMargin ),
                        intensity			: buffer.readUInt16LE( intenityMargin ),
                        returnNumber		: ( createMask( 0, 2 ) & multidata ),
                        numOfRetutns		: ( createMask( 3, 5 ) & multidata ),
                        scanDirectionFlag	: ( createMask( 6, 7 ) & multidata ),
                        edgeOfFlightLine	: ( createMask( 7, 8 ) & multidata ),
                        classification		: buffer.readUInt8(classificationMargin),
                        scanAgeRank			: buffer.readUInt8(scanAgeRankMargin),
                        userData			: buffer.readUInt8(userDataMargin),
                        pointSourceID		: buffer.readUInt16LE(pointSourceIDMargin),
                        red					: buffer.readUInt16LE(rMargin),
                        green				: buffer.readUInt16LE(gMargin),
                        blue				: buffer.readUInt16LE(bMargin),
                    });

                }
            });
        });
*/
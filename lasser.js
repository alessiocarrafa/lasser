var fs = require('fs');

'use strict';

function createMask( a, b )
{
	var r = 0;
	for( var i = a; i <= b; i++ ) r |= 1 << i;
	return r;
}

module.exports = class LasParser
{
    constructor( filePath )
    {
        this.filePath = filePath;
    }

    getHeader()
    {
        return new Promise( ( resolve, reject ) => {
            fs.open( this.filePath, 'r', ( status, fd ) =>
            {
                if( status )
                {
                    console.log( status.message ); return;
                }

                var buffer = new Buffer( 256 );
                fs.read( fd, buffer, 0, 256, 0, ( err, num ) =>
                {
                    this.header = 
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

                    resolve();
                });
            });
        });
    }

    getVariableLengthRecord()
    {
        return new Promise( ( resolve, reject ) => {
            fs.open( this.filePath, 'r', ( status, fd ) =>
            {
                if( status )
                {
                    console.log( status.message ); return;
                }

                var variableLengthRecordSize = 54;
                var totalVariableLengthRecordSize = variableLengthRecordSize * ( this.header.numberVariableLenRecords + 1 );

                var buffer = new Buffer( this.header.headerSize + totalVariableLengthRecordSize );
                fs.read( fd, buffer, 0, totalVariableLengthRecordSize, 0, ( err, num ) =>
                {
                    this.variableLengthRecordArray = [];

                    for( var x = 0; x <= this.header.numberVariableLenRecords; x++ )
                    {
                        var currStart = this.header.headerSize + ( x * variableLengthRecordSize );

                        var userIDMargin				= ( currStart + 2 );
                        var recordIDMargin				= userIDMargin + 16;
                        var recordLenAfterHeaderMargin	= recordIDMargin + 2;
                        var descriptionMargin			= recordLenAfterHeaderMargin + 2;

                        this.variableLengthRecordArray.push({
                            reserved				: buffer.readUInt16LE( currStart ),
                            userID					: buffer.toString('ascii', userIDMargin, userIDMargin + 16 ),
                            recordID				: buffer.readUInt16LE( recordIDMargin ),
                            recordLenAfterHeader	: buffer.readUInt16LE( recordLenAfterHeaderMargin ),
                            description				: buffer.toString('ascii', descriptionMargin, descriptionMargin + 32 ),
                        });
                    }

                    resolve();
                });
            });
        });
    }

    getPointArray()
    {
        
    }

    parse()
    {
        return new Promise( ( resolve, reject ) => {
            this.getHeader().then( () => {
                this.getVariableLengthRecord().then( () => { resolve(); } );
            });
        });
    }
}
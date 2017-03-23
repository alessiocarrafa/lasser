var fs = require('fs');

'use strict';

let createMask = ( a, b ) => { let r = 0; for( var i = a; i <= b; i++ ) r |= 1 << i; return r; };

let _Int32	= ( buff, val ) => buff.readInt32LE	( val );
let _UInt16	= ( buff, val ) => buff.readUInt16LE( val );
let _UInt8	= ( buff, val ) => buff.readUInt8	( val );
let _Double	= ( buff, val ) => buff.readDoubleLE( val );

//basic point ID definition ( will be extended from ID 2 andID 3 adding RGB information )
var basicPointDataFormat = [
	//Point Format ID 0
	[
		{ name: 'x'					, margin: 0, cback: _Int32 },
		{ name: 'y'					, margin: 4, cback: _Int32 },
		{ name: 'z'					, margin: 4, cback: _Int32 },
		{ name: 'intensity'			, margin: 4, cback: _UInt16 },
		{ name: 'returnNumber'		, margin: 2, cback: ( buff, val ) => { return createMask( 0, 2 ) & buff.readUInt16LE( val ) } },
		{ name: 'numOfRetutns'		, margin: 0, cback: ( buff, val ) => { return createMask( 3, 5 ) & buff.readUInt16LE( val ) } },
		{ name: 'scanDirectionFlag'	, margin: 0, cback: ( buff, val ) => { return createMask( 6, 7 ) & buff.readUInt16LE( val ) } },
		{ name: 'edgeOfFlightLine'	, margin: 0, cback: ( buff, val ) => { return createMask( 7, 8 ) & buff.readUInt16LE( val ) } },
		{ name: 'classification'	, margin: 1, cback: _UInt8 },
		{ name: 'scanAgeRank'		, margin: 1, cback: _UInt8 },
		{ name: 'userData'			, margin: 1, cback: _UInt8 },
		{ name: 'pointSourceID'		, margin: 1, cback: _UInt16 }
	],
	//Point Format ID 1
	[
		{ name: 'x'					, margin: 0, cback: _Int32 },
		{ name: 'y'					, margin: 4, cback: _Int32 },
		{ name: 'z'					, margin: 4, cback: _Int32 },
		{ name: 'intensity'			, margin: 4, cback: _UInt16 },
		{ name: 'returnNumber'		, margin: 2, cback: ( buff, val ) => { return createMask( 0, 2 ) & buff.readUInt16LE( val ) } },
		{ name: 'numOfRetutns'		, margin: 0, cback: ( buff, val ) => { return createMask( 3, 5 ) & buff.readUInt16LE( val ) } },
		{ name: 'scanDirectionFlag'	, margin: 0, cback: ( buff, val ) => { return createMask( 6, 7 ) & buff.readUInt16LE( val ) } },
		{ name: 'edgeOfFlightLine'	, margin: 0, cback: ( buff, val ) => { return createMask( 7, 8 ) & buff.readUInt16LE( val ) } },
		{ name: 'classification'	, margin: 1, cback: _UInt8 },
		{ name: 'scanAgeRank'		, margin: 1, cback: _UInt8 },
		{ name: 'userData'			, margin: 1, cback: _UInt8 },
		{ name: 'pointSourceID'		, margin: 1, cback: _UInt16 },
		{ name: 'gpsTime'			, margin: 2, cback: _Double }
	]
];

//point format as extension of the basic type ( ID 0 and ID 1 )
var pointDataFormat = [
	...basicPointDataFormat,
	//Point Format ID 2
	[
		...basicPointDataFormat[0],
		{ name: 'red'	, margin: 2, cback: _UInt16 },
		{ name: 'green'	, margin: 2, cback: _UInt16 },
		{ name: 'blue'	, margin: 2, cback: _UInt16 }
	],
	//Point Format ID 3
	[
		...basicPointDataFormat[1],
		{ name: 'red'	, margin: 2, cback: _UInt16 },
		{ name: 'green'	, margin: 2, cback: _UInt16 },
		{ name: 'blue'	, margin: 2, cback: _UInt16 }
	]
];

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

					//resolve promise
					resolve( this.header );
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
							userID					: buffer.toString('utf8', userIDMargin, userIDMargin + 16 ),
							recordID				: buffer.readUInt16LE( recordIDMargin ),
							recordLenAfterHeader	: buffer.readUInt16LE( recordLenAfterHeaderMargin ),
							description				: buffer.toString('utf8', descriptionMargin, descriptionMargin + 32 ),
						});
					}

					//resolve promise
					resolve( this.variableLengthRecordArray );
				});
			});
		});
	}

	getPointArray()
	{
		if( this.header && this.header.pointerDataFormatID != -1 )
		{
			//switch on different point format ID
			let currentTemplate = pointDataFormat[ this.header.pointerDataFormatID ];

			return new Promise( ( resolve, reject ) => {
				fs.open( this.filePath, 'r', ( status, fd ) =>
				{
					if( status )
					{
						console.log( status.message ); return;
					}

					var fileLength = fs.statSync( this.filePath ).size;
					var buffer = new Buffer( fileLength );
					fs.read( fd, buffer, 0, fileLength, 0, ( err, num ) =>
					{

						var pointSize = this.header.pointerDataRecordLen;
						var pointStart = this.header.offsetToPointData;
						this.pointArray = [];

						//get all points in file
						for( var x = 0; x < this.header.numOfPointRecords; x++ )
						{
							var currStart = pointStart + ( x * pointSize );

							let pointToAdd = {};
							let incrementalMargin = 0;

							//populate pointToAdd based on currentTemplate
							for( var t = 0; t < currentTemplate.length; t++ )
							{
								let currVal = currentTemplate[t];
								incrementalMargin += currVal.margin;
								pointToAdd[ currVal.name ] = currVal.cback( buffer, currStart + incrementalMargin );								
							}

							this.pointArray.push( pointToAdd );
						}

						//resolve promise
						resolve( this.pointArray );
					});
				});
			});
		}
	}

	parse()
	{
		return new Promise( ( resolve, reject ) => {
			this.getHeader().then( () => {
				this.getVariableLengthRecord().then( () => {
					this.getPointArray().then( () => {
						resolve();
					});
				});
			});
		});
	}
}
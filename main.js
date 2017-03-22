var fs = require('fs');

fs.open( 'hobu.las', 'r', function( status, fd )
{
	if( status )
	{
		console.log( status.message );
		return;
	}
	var buffer = new Buffer(1024);
	fs.read(fd, buffer, 0, 1024, 0, function(err, num) {

		var header = 
		{
			signature				: buffer.toString('utf8', 0, 4),
			globalEncoding			: buffer.readUInt16LE(6),
			guidData1				: buffer.readUInt32LE(8),
			guidData2				: buffer.readUInt16LE(12),
			guidData3				: buffer.readUInt16LE(14),
			guidData4				: buffer.toString('utf8', 16, 24),
			versionMajor			: buffer.readUInt8(24),
			versionMinor			: buffer.readUInt8(25),
			system					: buffer.toString('utf8', 26, 58),
			generatingSoftware		: buffer.toString('ascii', 58, 90),
			fileCrationDayOfYear	: buffer.readUInt16LE(90),
			fileCrationYear			: buffer.readUInt16LE(92),
			headerSize				: buffer.readUInt16LE(94),
			offsetToPointData		: buffer.readUInt32LE(96),
			numberVariableLenRecords: buffer.readUInt32LE(100),
			pointerDataFormatID		: buffer.readUInt8(104),
			pointerDataRecordLen	: buffer.readUInt8(105),
			numOfPointRecords		: buffer.readUInt32LE(106),
			numPointsByReturn		: ~~buffer.toString('ascii', 110, 130),
			xScaleFactor			: buffer.readDoubleLE(130),
			yScaleFactor			: buffer.readDoubleLE(138),
			zScaleFactor			: buffer.readDoubleLE(146),
			xOffset					: buffer.readDoubleLE(154),
			yOffset					: buffer.readDoubleLE(162),
			zOffset					: buffer.readDoubleLE(170),
			maxX					: buffer.readDoubleLE(178),
			minX					: buffer.readDoubleLE(186),
			maxY					: buffer.readDoubleLE(194),
			minY					: buffer.readDoubleLE(202),
			maxZ					: buffer.readDoubleLE(210),
			minZ					: buffer.readDoubleLE(218),
		};

		var variableLengthRecordSize = 54;
		var start = header.headerSize;
		var variableLengthRecordArray = [];

		for( var x = 0; x <= header.numberVariableLenRecords; x++ )
		{
			var currStart = start + ( x * variableLengthRecordSize );

			var userIDMargin				= ( currStart + 2 );
			var recordIDMargin				= userIDMargin + 16;
			var recordLenAfterHeaderMargin	= recordIDMargin + 2;
			var descriptionMargin			= recordLenAfterHeaderMargin + 2;

			variableLengthRecordArray.push({
				reserved				: buffer.readUInt16LE( currStart ),
				userID					: buffer.toString('ascii', userIDMargin, userIDMargin + 16 ),
				recordID				: buffer.readUInt16LE( recordIDMargin ),
				recordLenAfterHeader	: buffer.readUInt16LE( recordLenAfterHeaderMargin ),
				description				: buffer.toString('ascii', descriptionMargin, descriptionMargin + 32 ),
			});
		}

		console.log(
			JSON.stringify( header, null, 4 ),
			JSON.stringify( variableLengthRecordArray, null, 4 )
		);
	});
});
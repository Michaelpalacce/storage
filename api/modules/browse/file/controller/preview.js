'use strict';

// Dependencies
const app		= require( 'event_request' )();
const FileInput	= require( '../input/file_input' );
const router	= app.Router();

/**
 * @brief	Adds a '/api/file/data' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/file/data', ( event ) => {
	const input	= new FileInput( event );

	event.getFileStream( input.getFile() ).pipe( event.response );
});

module.exports	= router;
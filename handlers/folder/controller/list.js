'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const app			= Server();
const BrowseInput	= require( '../input/browse_input' );
const FileSystem	= require( '../../main/utils/file_system' );
const formatItem	= require( '../../main/utils/file_formatter' );

/**
 * @brief	Adds a '/browse/getFiles' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir, position
 *
 * @return	void
 */
app.get( '/browse/getFiles', ( event )=>{
	const input	= new BrowseInput( event );

	if ( ! input.isValid() )
		throw new Error( `Invalid input: ${input.getReasonToString()}` );

	const dir			= input.getDirectory();
	const fileSystem	= new FileSystem();

	fileSystem.getAllItems( dir, input.getToken() ).then(( result )=>{
		const response	= {
			items		: result.items.map( ( item )=>{
				return formatItem( item, event );
			}),
			nextToken	: encodeURIComponent( Buffer.from( JSON.stringify( result.nextToken ) ).toString( 'base64' ) ),
			hasMore		: result.hasMore,
			dir
		};

		if ( input.getToken() === '' )
		{
			const backItem	= formatItem( dir, event, true );
			response.items	= [backItem, ...response.items];
		}

		event.send( response )
	}).catch( event.next );
} );

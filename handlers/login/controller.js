'use strict';

// Dependencies
const { Router }	= require( 'event_request' );

let router			= new Router();

/**
 * @brief	Adds a '/login' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/login',
	method	: 'GET',
	handler	: ( event ) => {
		event.render( 'login', {}, event.next );
	}
});

/**
 * @brief	Adds a '/login' route with method POST
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/login',
	method	: 'POST',
	handler	: ( event ) => {
		event.redirect( event.session.authenticated ? '/browse' : '/login' );
	},
});

module.exports	= router;

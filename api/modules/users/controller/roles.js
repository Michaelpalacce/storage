'use strict';

const app					= require( 'event_request' )();
const Acl					= require( '../../../main/acls/acl' );
const { formatPermissions }	= require( '../../../main/acls/permissions_helper' );
const router				= app.Router();

/**
 * @brief	Adds a new route `/api/users/roles` with method GET which returns all the roles and their permissions
 *
 * @details	No Optional or required params
 *
 * @return	void
 */
router.get( '/users/roles', ( event ) => {
	event.send( formatPermissions( Acl.getRoles() ) );
});

module.exports	= router;
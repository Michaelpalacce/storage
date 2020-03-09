'use strict';

// Dependencies
const { Server }		= require( 'event_request' );

const securityHandler	= require( './main/security' );

const ipHandler			= require( './ip/controller/controller' );
const moveHandler		= require( './move/controller/controller' );
const browseHandler		= require( './browse/controller/browse' );
const downloadHandler	= require( './download/controller' );
const uploadHandler		= require( './upload/controller' );
const deleteHandler		= require( './delete/controller' );
const previewHandler	= require( './preview/controller' );

const router			= Server().Router();

router.add( securityHandler );

router.add( ipHandler );
router.add( moveHandler );
router.add( browseHandler );
router.add( downloadHandler );
router.add( uploadHandler );
router.add( deleteHandler );
router.add( previewHandler );

module.exports	= router;

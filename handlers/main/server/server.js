'use strict';

// Dependencies
const http			= require( 'http' );
const { Server }	= require( 'event_request' );
const socketIO		= require( 'socket.io' );

const app			= Server();
const server		= http.createServer( app.attach() );
const io			= socketIO( server );

// Add environment variables to the process.env
app.apply( app.er_env );

require( './bootstrap' );

module.exports	= { server, io };
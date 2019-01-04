'use strict';

const ejs																= require( 'ejs' );
const path																= require( 'path' );
const envConfig															= require( './../../config/env' );
const { Loggur, PluginManager, BodyParserHandler, Logging, LOG_LEVELS }	= require( 'event_request' );
const AuthenticationManager												= require( './authentication_manager' );
const { MultipartFormParser }											= BodyParserHandler;
const PROJECT_ROOT														= path.parse( require.main.filename ).dir;
const { Console, File }													= Logging;

// Authentication callback that will authenticated the request if the user has permissions
// this can be changed to anything you want but must return a boolean at the end
const authenticationCallback	= ( event )=>{
	let username	= typeof event.body.username === 'string' ? event.body.username : false;
	let password	= typeof event.body.password === 'string' ? event.body.password : false;

	return username === envConfig.username && password === envConfig.password;
};

module.exports		= ()=>{
	let staticResourcesPlugin		= PluginManager.getPlugin( 'event_request_static_resources' );
	let timeoutPlugin				= PluginManager.getPlugin( 'event_request_timeout' );
	let templatingEnginePlugin		= PluginManager.getPlugin( 'event_request_templating_engine' );
	let cacheServerPlugin			= PluginManager.getPlugin( 'cache_server' );
	let sessionPlugin				= PluginManager.getPlugin( 'event_request_session' );
	let multipartBodyParserPlugin	= PluginManager.getPlugin( 'event_request_body_parser_multipart' );
	let loggerPlugin				= PluginManager.getPlugin( 'event_request_logger' );

	cacheServerPlugin.startServer( ()=>{
		Loggur.log( 'Caching server started' );
	});

	staticResourcesPlugin.setOptions( { paths : [envConfig.staticPath, 'favicon.ico'] } );
	timeoutPlugin.setOptions( { timeout : envConfig.requestTimeout } );
	templatingEnginePlugin.setOptions( { templateDir : path.join( PROJECT_ROOT, './templates' ), engine : ejs } );

	let logger	= Loggur.createLogger({
		serverName	: 'Storage',
		logLevel	: LOG_LEVELS.debug,
		capture		: false,
		transports	: [
			new Console( { logLevel : LOG_LEVELS.notice } ),
			new File({
				logLevel	: LOG_LEVELS.notice,
				filePath	: '/logs/access.log',
				logLevels	: { notice : LOG_LEVELS.notice }
			}),
			new File({
				logLevel	: LOG_LEVELS.error,
				filePath	: '/logs/error_log.log',
			}),
			new File({
				logLevel	: LOG_LEVELS.debug,
				filePath	: '/logs/debug_log.log'
			})
		]
	});

	Loggur.addLogger( logger );

	loggerPlugin.setOptions({ logger });
	sessionPlugin.setOptions({
		tokenExpiration			: envConfig.tokenExpiration,
		authenticationRoute		: '/login',
		authenticationCallback	: authenticationCallback,
		managers				: [
			'default',
			{
				instance	: AuthenticationManager,
				options		: { indexRoute : '/browse' }
			}
		]
	});
	multipartBodyParserPlugin.setOptions({
		parsers: [{ instance : MultipartFormParser, options : { tempDir : path.join( PROJECT_ROOT, '/Uploads' ) } }]
	});
};
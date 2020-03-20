const User	= require( './user' );

const USER_KEY	= 'USERS_DATA';

/**
 * @brief	Class responsible for user CRUD operations
 */
class UserManager
{
	constructor( dataStore )
	{
		this.dataStore	= dataStore;
		this.users		= null;

		this.fetchUsers();

		setInterval(()=>{
			this.flushUsers();
		}, 2500 );
	}

	/**
	 * @brief	Handle any errors from the dataStore
	 *
	 * @details	setImmediate is called because we don't want to throw in a catch block of a promise
	 *
	 * @param	err Error
	 *
	 * @return	void
	 */
	catchError( err )
	{
		setImmediate(()=>{
			throw err;
		});
	}

	/**
	 * @brief	Fetches the users only one time from the dataStore
	 *
	 * @return	void
	 */
	async fetchUsers()
	{
		if ( this.users === null )
		{
			this.users			= {};
			const usersString	= await this.dataStore.get( USER_KEY ).catch( this.catchError.bind( this ) );
			const usersData		= JSON.parse( usersString == null ? '[]' : usersString.value );

			for ( const username in usersData )
			{
				const userData	= usersData[username];
				const user		= new User( userData );

				if ( ! user.isValid() )
				{
					throw new Error( 'Error while fetching users' );
				}

				this.users[user.getUsername()]	= user;
			}
		}
	}

	/**
	 * @brief	Commits any changes to the users to the data store
	 *
	 * @return	void
	 */
	flushUsers()
	{
		this.dataStore.set( USER_KEY, JSON.stringify( this.users ) ).catch( this.catchError.bind( this ) )
	}

	/**
	 * @brief	Gets a user from the data store
	 *
	 * @param	username String
	 *
	 * @return	User
	 */
	get( username )
	{
		if ( ! this.has( username ) )
		{
			throw new Error( `User: ${username} does not exist` );
		}

		return this.users[username];
	}

	/**
	 * @brief	Checks a user in the data store
	 *
	 * @param	username String
	 *
	 * @return	Boolean
	 */
	has( username )
	{
		return this.users[username] != undefined;
	}

	/**
	 * @brief	Sets a user in the data store
	 *
	 * @param	userData Object
	 *
	 * @return	void
	 */
	set( userData )
	{
		if ( typeof userData.username !== 'string' || this.has( userData.username ) )
		{
			throw new Error( `User: ${userData.username} already exist` );
		}

		this.users[userData.username]	= new User( userData );
	}

	/**
	 * @brief	Deletes a user from the data store
	 *
	 * @param	username String
	 *
	 * @return	void
	 */
	delete( username )
	{
		if ( ! this.has( username ) )
		{
			throw new Error( `User: ${username} does not exist` );
		}

		delete this.users[username];
	}

	/**
	 * @brief	Updates the user if it exists
	 *
	 * @param	username String
	 * @param	userData Object
	 *
	 * @returns	void
	 */
	update( username, userData )
	{
		if ( typeof username !== 'string' || ! this.has( username ) )
		{
			throw new Error( `User: ${username} does not exist` );
		}

		userData.username		= username;
		this.users[username]	= new User( userData );
	}
}

module.exports	= UserManager;
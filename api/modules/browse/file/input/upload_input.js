'use strict';

// Dependencies
const Input			= require( '../../../../main/validation/input' );
const { decode }	= require( '../../../../main/utils/base_64_encoder' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class UploadInput extends Input
{
	/**
	 * @brief	Returns the file
	 *
	 * @returns	String
	 */
	getDirectory()
	{
		return this.get( UploadInput.DIRECTORY_KEY );
	}

	/**
	 * @return	String
	 */
	getEncodedDirectory()
	{
		return encodeURIComponent( Buffer.from( this.get( UploadInput.DIRECTORY_KEY ) ).toString( 'base64' ) );
	}

	/**
	 * @brief	Gets the files for download
	 *
	 * @returns	String
	 */
	getFiles()
	{
		return this.get( UploadInput.FILES_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.body, { directory : 'filled||string', $files : 'filled' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		let { directory, $files }				= this.reason.getValidationResult();

		this.model[UploadInput.DIRECTORY_KEY]	= decode( directory );
		this.model[UploadInput.FILES_KEY]		= $files;

		return true;
	}
}

UploadInput.DIRECTORY_KEY	= 'directory';
UploadInput.FILES_KEY		= '$files';

module.exports	= UploadInput;
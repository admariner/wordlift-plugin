<?php
/**
 * Define the menu entry and the page for 'Download Your Data'.
 *
 * @todo       transition this page to {@link Wordlift_Admin_Page}.
 *
 * @since      3.6.0
 *
 * @package    Wordlift
 * @subpackage Wordlift/admin
 */

/**
 * The Wordlift_Admin_Download_Your_Data_Page class.
 *
 * @since 3.6.0
 */
class Wordlift_Admin_Download_Your_Data_Page {
	/**
	 * Allowed types.
	 *
	 * @since  3.16.0
	 * @access private
	 * @var $allowed_types array Allowed types.
	 */
	private $allowed_types = array(
		'application/json;charset=UTF-8',
		'application/rdf+xml;charset=UTF-8',
	);

	/**
	 * A {@link Wordlift_Configuration_Service} instance.
	 *
	 * @since 3.9.8
	 *
	 * @param \Wordlift_Configuration_Service $configuration_service A {@link Wordlift_Configuration_Service} instance.
	 */
	function __construct( $configuration_service ) {

		$this->configuration_service = $configuration_service;

	}

	/**
	 * Hook to 'admin_menu' to add the 'Download Your Data' page.
	 *
	 * @since 3.6.0
	 */
	public function admin_menu() {

		// Add a callback to our 'page' function.
		add_submenu_page(
			'wl_admin_menu',
			_x( 'Download Your Data', 'Page title', 'wordlift' ),
			_x( 'Download Your Data', 'Menu title', 'wordlift' ),
			'manage_options',
			'wl_download_your_data',
			array( $this, 'page' )
		);

	}

	/**
	 * The admin menu callback to render the page.
	 *
	 * @since 3.6.0
	 */
	public function page() {

		// Include the partial.
		include( plugin_dir_path( __FILE__ ) . 'partials/wordlift-admin-download-your-data.php' );

	}

	/**
	 * Ajax call to redirect to a download URL.
	 *
	 * @since 3.6.0
	 */
	public function download_your_data() {

		// Avoid PHP notices when buffer is empty.
		if ( ob_get_contents() ) {
			ob_end_clean();
		}

		// Get WL's key.
		$key = $this->configuration_service->get_key();

		// Use json suffix by default.
		$suffix = 'json';

		// Check if there is suffix.
		if ( isset( $_GET['out'] ) ) {
			$suffix = sanitize_text_field( wp_unslash( $_GET['out'] ) );
		}

		// Create filename.
		$filename = 'dataset.' . $suffix;

		// Make the request.
		$response = wp_safe_remote_get( WL_CONFIG_WORDLIFT_API_URL_DEFAULT_VALUE . "datasets/key=$key/$filename" );

		if (
			is_wp_error( $response ) ||
			200 !== (int) $response['response']['code']
		) {
			// Something is not working properly, so display error message.
			wp_die( esc_html__( 'There was an error trying to connect to the server. Please try again later.', 'wordlift' ) );
		}

		// Get response body.
		$body     = wp_remote_retrieve_body( $response );
		$type     = wp_remote_retrieve_header( $response, 'content-type' );
		$filename = 'dataset-' . date( 'Y-m-d-H-i-s' ) . '.' . $suffix;

		if ( ! in_array( $type, $this->allowed_types, true ) ) {
			// The file type is not from allowed types.
			wp_die( esc_html__( 'The server responds, but this file type is not permitted for security reasons.', 'wordlift' ) );
		}

		// Add proper file headers.
		header( "Content-Disposition: attachment; filename=$filename" );
		header( "Content-Type: $type" );

		/*
		 * Echo the response body. As this is not HTML we can not escape it
		 * and neither sanitize it, therefor turning off the linter notice.
		 */
		echo $body; // WPCS: XSS OK.

		// Exit in both cases.
		exit;
	}
}

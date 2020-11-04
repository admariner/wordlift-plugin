<?php

namespace Wordlift\Dataset;

use Wordlift\Api\Api_Service;
use Wordlift\Jsonld\Jsonld_Service;

class Sync_Service {

	/**
	 * @var \Wordlift_Log_Service
	 */
	private $log;

	/**
	 * @var Api_Service
	 */
	private $api_service;

	/**
	 * @var Jsonld_Service
	 */
	private $jsonld_service;

	/**
	 * @var Sync_Background_Process
	 */
	private $sync_background_process;

	/**
	 * @var Sync_Service
	 */
	private static $instance;

	/**
	 * Constructor.
	 *
	 * @param $api_service Api_Service The {@link Api_Service} used to communicate with the remote APIs.
	 * @param $jsonld_service Jsonld_Service The {@link Jsonld_Service} used to generate the JSON-LD to post to the remote API.
	 */
	public function __construct( $api_service, $jsonld_service ) {

		$this->log = \Wordlift_Log_Service::get_logger( get_class() );

		$this->api_service    = $api_service;
		$this->jsonld_service = $jsonld_service;

		// You need to initialize this early, otherwise the Background Process isn't registered in AJAX calls.
		$this->sync_background_process = new Sync_Background_Process( $this );;

		self::$instance = $this;

		/**
		 * Register hooks for post and meta.
		 */
		add_action( 'save_post', array( $this, 'sync_item' ) );
		add_action( 'added_post_meta', array( $this, 'sync_item_on_meta_change' ), 10, 4 );
		add_action( 'updated_post_meta', array( $this, 'sync_item_on_meta_change' ), 10, 4 );
		add_action( 'deleted_post_meta', array( $this, 'sync_item_on_meta_change' ), 10, 4 );
		add_action( 'delete_post', array( $this, 'delete_item' ) );

	}

	public function sync_item_on_meta_change( $meta_id, $object_id, $meta_key, $_meta_value ) {

		if ( '_wl_synced_gmt' === $meta_key ) {
			return;
		}

		$this->sync_item( $object_id );
	}

	public static function get_instance() {
		return self::$instance;
	}

	/**
	 * Starts a new synchronization.
	 */
	public function start() {

		// Create the Sync_Background_Process.
		$this->sync_background_process->start();

	}

	/**
	 * Request to cancel a background process.
	 */
	public function request_cancel() {

		$this->sync_background_process->request_cancel();

	}

	/**
	 * Get the next post ID to synchronize or NULL if there are no posts to synchronize.
	 *
	 * @return string|null The post ID or NULL if there are no posts to synchronize.
	 */
	public function next() {
		global $wpdb;

		$state = $this->info();

		// Limit the query to the allowed post types.
		$post_type_in = implode( "','", array_map( 'esc_sql', \Wordlift_Entity_Service::valid_entity_post_types() ) );

		// Get the next post ID.
		return $wpdb->get_var( "
			SELECT p.ID
			FROM $wpdb->posts p
			         LEFT JOIN $wpdb->postmeta pm
			                   ON pm.post_id = p.ID
			                       AND pm.meta_key = '_wl_synced_gmt'
			WHERE p.post_status = 'publish'
			  AND p.post_type IN ('$post_type_in')
			ORDER BY p.ID
			LIMIT {$state->index},1
			" );
	}

	public function count() {
		global $wpdb;
		$post_type_in = implode( "','", array_map( 'esc_sql', \Wordlift_Entity_Service::valid_entity_post_types() ) );

		return $wpdb->get_var( "
			SELECT COUNT(1)
			FROM $wpdb->posts p
			         LEFT JOIN $wpdb->postmeta pm
			                   ON pm.post_id = p.ID
			                       AND pm.meta_key = '_wl_synced_gmt'
			WHERE p.post_status = 'publish'
			  AND p.post_type IN ('$post_type_in')
			" );
	}

	public function info() {
		return Sync_Background_Process::get_state();
	}

	public function sync_item( $post_id ) {

		$this->log->info( "Synchronizing post $post_id..." );

		// Get the JSON-LD for the specified post and its entity URI.
		$jsonld_value = $this->jsonld_service->get( Jsonld_Service::TYPE_POST, $post_id );
		$uri          = get_post_meta( $post_id, 'entity_url', true );
		$jsonld       = wp_json_encode( $jsonld_value );

		// Make a request to the remote endpoint.
		$state              = $this->info();
		$state_header_value = str_replace( "\n", '', wp_json_encode( $state ) );
		$response           = $this->api_service->request(
			'POST', '/middleware/dataset?uri=' . rawurlencode( $uri ),
			array(
				'Content-Type'                     => 'application/ld+json',
				'X-Wordlift-Dataset-Sync-State-V1' => $state_header_value
			),
			$jsonld );

		$this->log->debug( "Response for $post_id received: " . ( $response->is_success() ? 'yes' : 'no' ) );

		// Update the sync date in case of success, otherwise log an error.
		if ( $response->is_success() ) {

			update_post_meta( $post_id, '_wl_synced_gmt', current_time( 'mysql', true ) );

			$this->log->debug( "Post $post_id synchronized." );

			return true;
		} else {
			// @@todo: should we put a limit retry here?delete_item
			$response_dump = var_export( $response, true );
			$this->log->error(
				sprintf( 'An error occurred while synchronizing the data for post ID %d: %s', $post_id, $response_dump ) );

			return false;
		}

	}

	/**
	 * @param $post_id
	 *
	 * @todo Complete the delete item.
	 */
	public function delete_item( $post_id ) {
		$uri = get_post_meta( $post_id, 'entity_url', true );
		// Make a request to the remote endpoint.
		$state_header_value = str_replace( wp_json_encode( $this->info() ), "\n", '' );
		$response           = $this->api_service->request(
			'DELETE', '/middleware/dataset?uri=' . rawurlencode( $uri ),
			array(
				'Content-Type'                     => 'application/ld+json',
				'X-Wordlift-Dataset-Sync-State-V1' => $state_header_value
			) );
	}

}

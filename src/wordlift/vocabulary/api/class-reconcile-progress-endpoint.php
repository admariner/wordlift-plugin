<?php
/**
 * @since 1.3.0
 * @author Naveen Muthusamy <naveen@wordlift.io>
 */

namespace Wordlift\Vocabulary\Api;


/**
 * This endpoint is used to obtain the reconcile progress, number of tags accepted / total number of tags.
 */
class Reconcile_Progress_Endpoint {

	public function register_routes() {
		add_action( 'rest_api_init',
			function () {
				$this->register_progress_route();
			} );
	}


	public function get_terms_compat( $taxonomy, $args_with_taxonomy_key ) {
		global $wp_version;

		if ( version_compare( $wp_version, '4.5', '<' ) ) {
			return get_terms( $taxonomy, $args_with_taxonomy_key );
		} else {
			return get_terms( $args_with_taxonomy_key );
		}
	}


	public function progress() {

		$total_tags = count( $this->get_terms_compat( 'post_tag', array(
			'taxonomy'   => 'post_tag',
			'hide_empty' => false,
			'fields'     => 'ids'
		) ) );

		$completed = count( $this->get_terms_compat(
			'post_tag',
			array(
				'taxonomy'   => 'post_tag',
				'hide_empty' => false,
				'fields'     => 'ids',
				'meta_query' => array(
					array(
						'key'     => Entity_Rest_Endpoint::IGNORE_TAG_FROM_LISTING,
						'compare' => '=',
						'value'   => '1'
					)
				),
			)
		)
		);


		return array(
			'completed' => $completed,
			'total'     => $total_tags
		);
	}


	private function register_progress_route() {
		register_rest_route(
			Api_Config::REST_NAMESPACE,
			'/reconcile_progress/progress',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'progress' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}


}
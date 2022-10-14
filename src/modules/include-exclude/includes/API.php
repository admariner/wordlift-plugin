<?php

namespace Wordlift\Modules\Include_Exclude;

class API {

	public function register_hooks() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes() {
		register_rest_route(
			WL_REST_ROUTE_DEFAULT_NAMESPACE,
			'/include-exclude/config',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_include_exclude_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		register_rest_route(
			WL_REST_ROUTE_DEFAULT_NAMESPACE,
			'/include-exclude/config',
			array(
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_include_exclude_data' ),
				'args'                => array(
					'type' => array(
						'required'          => true,
						'type'              => 'string',
						'validate_callback' => function ( $param ) {
							if ( empty( $param ) || ! in_array( $param, array( 'INCLUDE', 'EXCLUDE' ), true ) ) {
								return new \WP_Error(
									'wordlift_invalid_include_exclude_type',
									__( 'type can be either INCLUDE or EXCLUDE.', 'wordlift' ),
									array(
										'status' => 400,
									)
								);
							}
						},
					),
					'urls' => array(
						'required'          => true,
						'type'              => 'string',
						'validate_callback' => function ( $param ) {
							return is_string( $param ) && ! empty( $param );
						},
					),
				),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}

	public function get_include_exclude_data() {
		$include_exclude_data = get_option( 'wl_exclude_include_urls_settings', array() );
		if ( empty( $include_exclude_data ) || empty( $include_exclude_data['urls'] ) ) {
			return new \WP_Error(
				'wl_include_exclude_data_not_found',
				__( 'Include/Exclude data not found', 'wordlift' ),
				array(
					'status' => 404,
				)
			);
		}
		$data = array(
			'type' => $include_exclude_data['type'],
			'urls' => $include_exclude_data['urls'],
		);
		return rest_ensure_response( $data );
	}

	public function update_include_exclude_data( \WP_REST_Request $request ) {
		$data = $request->get_params();
		$type = $data['type'];
		$urls = $data['urls'];
		// $content_type = $request->get_content_type(); // TODO: Content-Type checking.
		// phpcs:disable
		// if ( ! isset( $content_type['value'] ) || 'application/vnd.wordlift.include-exclude-config.v1+json' !== $content_type['value'] ) {
		// 	return new \WP_Error(
		// 		'wl_include_exclude_invalid_content_type',
		// 		__( 'Invalid content type.', 'wordlift' ),
		// 		array(
		// 			'status' => 400,
		// 		)
		// 	);
		// }
		// phpcs:enable

		$include_exclude_data = array(
			'type' => $type,
			'urls' => $urls,
		);

		$updated = update_option( 'wl_exclude_include_urls_settings', $include_exclude_data );

		if ( $updated ) {
			return new \WP_REST_Response( null, 204 );
		} else {
			return new \WP_Error(
				'wl_include_exclude_data_update_failed',
				__( 'Include/Exclude data update failed.', 'wordlift' ),
				array(
					'status' => 400,
				)
			);
		}
	}
}

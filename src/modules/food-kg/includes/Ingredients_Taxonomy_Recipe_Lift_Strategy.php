<?php

namespace Wordlift\Modules\Food_Kg;

class Ingredients_Taxonomy_Recipe_Lift_Strategy implements Recipe_Lift_Strategy {

	/**
	 * @var Ingredients_Client
	 */
	private $ingredients_client;

	/**
	 * @var Notices
	 */
	private $notices;

	function __construct( Ingredients_Client $ingredients_client, Notices $notices ) {
		$this->ingredients_client = $ingredients_client;
		$this->notices            = $notices;
	}

	function run() {
		$this->notices->queue( 'info', __( 'WordLift detected WP Recipe Maker and, it is lifting the ingredients...', 'wordlift' ) );

		/**
		 * @var string[] $terms
		 */
		$terms       = get_terms(
			array(
				'taxonomy'   => 'wprm_ingredient',
				'fields'     => 'names',
				'hide_empty' => false,
			)
		);
		$ingredients = $this->ingredients_client->ingredients( $terms );

		foreach ( $ingredients as $key => $value ) {
			$term = get_term_by( 'name', $key, 'wprm_ingredient' );
			if ( ! isset( $term ) ) {
				continue;
			}
			update_term_meta( $term->term_id, '_wl_jsonld', $value );

			/**
			 * @@todo update notification with progress
			 */
		}

		/**
		 * @@todo add notification that procedure is complete, with information about the number of processed items vs
		 *   total items
		 */
		$count_terms        = count( $terms );
		$count_lifted_terms = count( $ingredients );
		$this->notices->queue( 'info', sprintf( __( 'WordLift detected WP Recipe Maker and, it lifted %1$d of %2$d ingredient(s).', 'wordlift' ), $count_lifted_terms, $count_terms ) );
	}
}

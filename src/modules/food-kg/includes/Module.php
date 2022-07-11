<?php

namespace Wordlift\Modules\Food_Kg;

use Wordlift\Api\Api_Service_Ext;


class Module {

	const RUN_EVENT = 'wl_food_kg__run';

	/**
	 * @var Api_Service_Ext
	 */
	private $api_service;

	/**
	 * @var Recipe_Lift_Strategy
	 */
	private $recipe_lift_strategy;

	/**
	 * @param Api_Service_Ext $api_service
	 * @param Recipe_Lift_Strategy $recipe_lift_strategy
	 */
	public function __construct( Api_Service_Ext $api_service, Recipe_Lift_Strategy $recipe_lift_strategy ) {
		$this->api_service          = $api_service;
		$this->recipe_lift_strategy = $recipe_lift_strategy;
	}

	public function register_hooks() {
		add_action( 'wl_key_updated', [ $this, '__key_updated' ] );
		add_action( self::RUN_EVENT, [ $this, '__run' ] );
		add_action( 'wp_ajax_wl_food_kg__run', [ $this, '__run' ] );
	}

	public function __key_updated() {
		try {
			$me_response    = $this->api_service->me();
			$has_food_kg    = isset( $me_response->networks )
			                  && array_reduce( $me_response->networks, [ $this, '__has_food_kg' ], false );
			$next_scheduled = wp_next_scheduled( self::RUN_EVENT );

			// We're connected to the Food KG, but not yet scheduled.
			if ( $has_food_kg && ! $next_scheduled ) {
				wp_schedule_event( time(), 'daily', self::RUN_EVENT );
			}

			// We're not connected to the Food KG, but we're scheduled.
			if ( ! $has_food_kg && $next_scheduled ) {
				wp_unschedule_event( $next_scheduled, self::RUN_EVENT );
			}

		} catch ( \Exception $e ) {

		}
	}

	public function __run() {
		$this->recipe_lift_strategy->run();
	}

	private function __has_food_kg( $carry, $item ) {
		return $carry || 'https://knowledge.cafemedia.com/food/' === $item->dataset_uri;
	}

}

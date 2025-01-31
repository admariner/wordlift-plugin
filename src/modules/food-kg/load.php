<?php
/**
 * Module Name: Food KG
 * Description: Lifts ingredients using semantic data from the Food KG
 * Experimental: Yes
 *
 * @since   1.0.0
 * @package wordlift
 */

use Wordlift\Modules\Common\Symfony\Component\Config\FileLocator;
use Wordlift\Modules\Common\Symfony\Component\DependencyInjection\ContainerBuilder;
use Wordlift\Modules\Common\Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Wordlift\Modules\Food_Kg\Jsonld;
use Wordlift\Modules\Food_Kg\Main_Ingredient_Jsonld;
use Wordlift\Modules\Food_Kg\Preconditions;
use Wordlift\Task\All_Posts_Task;
use Wordlift\Task\Background\Background_Task_Factory;
use Wordlift\Task\Single_Call_Task;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WL_FOOD_KG_FILE', __FILE__ );
define( 'WL_FOOD_KG_DIR_PATH', dirname( WL_FOOD_KG_FILE ) );

function __wl_foodkg__load() {

	// Autoloader for plugin itself.
	if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
		require __DIR__ . '/vendor/autoload.php';
	}

	$container_builder = new ContainerBuilder();
	$loader            = new YamlFileLoader( $container_builder, new FileLocator( __DIR__ ) );
	$loader->load( 'services.yml' );
	$container_builder->compile();

	$notices = $container_builder->get( 'Wordlift\Modules\Food_Kg\Notices' );
	$notices->register_hooks();

	/**
	 * @var Preconditions $preconditions
	 */
	$preconditions = $container_builder->get( 'Wordlift\Modules\Food_Kg\Preconditions' );
	if ( ! $preconditions->pass() ) {
		return;
	}

	// Meta Box.
	$meta_box = $container_builder->get( 'Wordlift\Modules\Food_Kg\Admin\Meta_Box' );
	$meta_box->register_hooks();

	$module = $container_builder->get( 'Wordlift\Modules\Food_Kg\Module' );
	$module->register_hooks();

	/** @var Jsonld $jsonld */
	$jsonld = $container_builder->get( 'Wordlift\Modules\Food_Kg\Jsonld' );
	$jsonld->register_hooks();

	/**
	 * Ingredients API.
	 */
	$ingredients_api = $container_builder->get( 'Wordlift\Modules\Food_Kg\Ingredients_API' );
	$ingredients_api->register_hooks();

	/** @var Main_Ingredient_Jsonld $jsonld */
	$main_ingredient_jsonld = $container_builder->get( 'Wordlift\Modules\Food_Kg\Main_Ingredient_Jsonld' );
	$main_ingredient_jsonld->register_hooks();

	// Main Ingredient Background Task.
	$main_ingredient_recipe_lift     = $container_builder->get( 'Wordlift\Modules\Food_Kg\Main_Ingredient_Recipe_Lift_Strategy' );
	$main_ingredient_background_task = Background_Task_Factory::create_action_scheduler_task(
		'wl_main_ingredient_sync',
		'wordlift',
		new All_Posts_Task(
			array( $main_ingredient_recipe_lift, 'process' ),
			'wprm_recipe',
			'sync-main-ingredient'
		),
		'/main-ingredient',
		'sync-main-ingredient',
		__( 'Synchronize Main Ingredient', 'wordlift' )
	);

	// Ingredients Taxonomy Background Task.
	$ingredients_taxonomy_recipe_lift     = $container_builder->get( 'Wordlift\Modules\Food_Kg\Ingredients_Taxonomy_Recipe_Lift_Strategy' );
	$ingredients_taxonomy_background_task = Background_Task_Factory::create(
		new Single_Call_Task(
			array( $ingredients_taxonomy_recipe_lift, 'run' ),
			'sync-ingredients-taxonomy'
		),
		'/sync-ingredients-taxonomy',
		'sync-ingredients-taxonomy',
		__( 'Synchronize Ingredients Taxonomy', 'wordlift' )
	);

	add_action(
		$module::RUN_EVENT,
		function () use ( $main_ingredient_background_task, $ingredients_taxonomy_background_task ) {
			$main_ingredient_background_task->start();
			$ingredients_taxonomy_background_task->start();
		}
	);

	if ( is_admin() ) {
		$page = $container_builder->get( 'Wordlift\Modules\Food_Kg\Admin\Page' );
		$page->register_hooks();

		$page = $container_builder->get( 'Wordlift\Modules\Food_Kg\Admin\Ingredients_Taxonomy_Page' );
		$page->register_hooks();

		// Download Ingredients Data.
		$download_ingredients_data = $container_builder->get( 'Wordlift\Modules\Food_Kg\Admin\Download_Ingredients_Data' );
		$download_ingredients_data->register_hooks();
	}
}

add_action( 'plugins_loaded', '__wl_foodkg__load' );


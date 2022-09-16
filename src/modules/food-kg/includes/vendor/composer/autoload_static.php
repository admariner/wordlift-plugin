<?php

// autoload_static.php @generated by Composer

namespace Wordlift_Modules_Food_Kg_Composer\Autoload;

class ComposerStaticInitbaaf547b24d2757395578581da934187 {

	public static $classMap = array(
		'ComposerAutoloaderInitbaaf547b24d2757395578581da934187' => __DIR__ . '/..' . '/composer/autoload_real.php',
		'Composer\\InstalledVersions'                      => __DIR__ . '/..' . '/composer/InstalledVersions.php',
		'Wordlift\\Modules\\Food_Kg\\Admin\\Full_Page_Delegate' => __DIR__ . '/../..' . '/admin/Full_Page_Delegate.php',
		'Wordlift\\Modules\\Food_Kg\\Admin\\Ingredients_List_Table' => __DIR__ . '/../..' . '/admin/Ingredients_List_Table.php',
		'Wordlift\\Modules\\Food_Kg\\Admin\\Ingredients_Modal_Page_Delegate' => __DIR__ . '/../..' . '/admin/Ingredients_Modal_Page_Delegate.php',
		'Wordlift\\Modules\\Food_Kg\\Admin\\Main_Ingredient_List_Table' => __DIR__ . '/../..' . '/admin/Main_Ingredient_List_Table.php',
		'Wordlift\\Modules\\Food_Kg\\Admin\\Main_Ingredient_Modal_Page_Delegate' => __DIR__ . '/../..' . '/admin/Main_Ingredient_Modal_Page_Delegate.php',
		'Wordlift\\Modules\\Food_Kg\\Admin\\Page'          => __DIR__ . '/../..' . '/admin/Page.php',
		'Wordlift\\Modules\\Food_Kg\\Admin\\Page_Delegate' => __DIR__ . '/../..' . '/admin/Page_Delegate.php',
		'Wordlift\\Modules\\Food_Kg\\Ingredients'          => __DIR__ . '/../..' . '/Ingredients.php',
		'Wordlift\\Modules\\Food_Kg\\Ingredients_Client'   => __DIR__ . '/../..' . '/Ingredients_Client.php',
		'Wordlift\\Modules\\Food_Kg\\Ingredients_Taxonomy_Recipe_Lift_Strategy' => __DIR__ . '/../..' . '/Ingredients_Taxonomy_Recipe_Lift_Strategy.php',
		'Wordlift\\Modules\\Food_Kg\\Jsonld'               => __DIR__ . '/../..' . '/Jsonld.php',
		'Wordlift\\Modules\\Food_Kg\\Main_Ingredient_Jsonld' => __DIR__ . '/../..' . '/Main_Ingredient_Jsonld.php',
		'Wordlift\\Modules\\Food_Kg\\Main_Ingredient_Recipe_Lift_Strategy' => __DIR__ . '/../..' . '/Main_Ingredient_Recipe_Lift_Strategy.php',
		'Wordlift\\Modules\\Food_Kg\\Module'               => __DIR__ . '/../..' . '/Module.php',
		'Wordlift\\Modules\\Food_Kg\\Meta_Box'               => __DIR__ . '/../..' . '/Meta_Box.php',
		'Wordlift\\Modules\\Food_Kg\\Notices'              => __DIR__ . '/../..' . '/Notices.php',
		'Wordlift\\Modules\\Food_Kg\\Preconditions'        => __DIR__ . '/../..' . '/Preconditions.php',
		'Wordlift\\Modules\\Food_Kg\\Recipe_Lift_Strategy' => __DIR__ . '/../..' . '/Recipe_Lift_Strategy.php',
		'Wordlift_Modules_Food_Kg_Composer\\Autoload\\ClassLoader' => __DIR__ . '/..' . '/composer/ClassLoader.php',
		'Wordlift_Modules_Food_Kg_Composer\\Autoload\\ComposerStaticInitbaaf547b24d2757395578581da934187' => __DIR__ . '/..' . '/composer/autoload_static.php',
	);

	public static function getInitializer( ClassLoader $loader ) {
		return \Closure::bind(
			function () use ( $loader ) {
				$loader->classMap = ComposerStaticInitbaaf547b24d2757395578581da934187::$classMap;

			},
			null,
			ClassLoader::class
		);
	}
}

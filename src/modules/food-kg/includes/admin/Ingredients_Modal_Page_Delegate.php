<?php

namespace Wordlift\Modules\Food_Kg\Admin;

class Ingredients_Modal_Page_Delegate implements Page_Delegate {
	public function render() {
		$term_id = filter_input( INPUT_GET, 'term_id', FILTER_SANITIZE_NUMBER_INT );
		// phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		$value = get_term_meta( $term_id, '_wl_jsonld', true );

		include WL_FOOD_KG_DIR_PATH . '/includes/admin/partials/jsonld.php';
	}

	public function admin_enqueue_scripts() {
		wp_enqueue_style( 'wl-food-kg-jsonld', plugin_dir_url( __FILE__ ) . '/partials/jsonld.css', array(), WORDLIFT_VERSION );

		// Enqueue code editor and settings for manipulating HTML.
		$settings = wp_enqueue_code_editor(
			array(
				'type'      => 'application/ld+json',
				'minHeight' => '100%',
			)
		);

		wp_add_inline_script(
			'code-editor',
			sprintf(
				'jQuery( function() { wp.codeEditor.initialize( "jsonld", %s ); } );',
				wp_json_encode( $settings )
			)
		);
	}
}

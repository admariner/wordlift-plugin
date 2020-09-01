<?php

use Wordlift\Mappings\Mappings_DBO;
use Wordlift\Mappings\Mappings_Validator;

/**
 * Class Mapping_Acf_Repeater_Support_Test
 * @group mappings.
 */
class Mapping_Acf_Repeater_Support_Test extends WP_UnitTestCase {
	/**
	 * @var Wordlift_Jsonld_Service
	 */
	private $jsonld_service;
	/**
	 * @var Mappings_DBO
	 */
	private $dbo;

	function setUp() {
		parent::setUp(); // TODO: Change the autogenerated stub
		$this->jsonld_service = Wordlift_Jsonld_Service::get_instance();
		// Initialize dependencies for the test.
		$this->dbo = new Mappings_DBO();
		// Try to get the ACF PRO Key, if not set, skip this test.
		$acf_pro_key = getenv( 'ACF_PRO_KEY' );
		if ( empty( $acf_pro_key ) ) {
			$this->markTestSkipped( '`ACF_PRO_KEY` not set, test skipped.' );
		}

		// Load the WP Filesystem.
		$wp_filesystem = $this->load_wp_filesystem();
		$this->assertNotNull( $wp_filesystem, 'We require a $wp_filesystem.' );

		// Download the ACF PRO package.
		$acf_download_url = "https://connect.advancedcustomfields.com/index.php?a=download&p=pro&k=$acf_pro_key";
		$response         = wp_remote_get( $acf_download_url, array( 'timeout' => 60, ) );

		// Store the zip file to the plugin directory.
		$acf_destination_path = $wp_filesystem->wp_plugins_dir() . '/advanced-custom-fields-pro.zip';

		// Store the data locally.
		$body = wp_remote_retrieve_body( $response );
		$this->assertFalse( is_wp_error( $response ) || ! isset( $response['body'] ), 'An error occurred: ' . var_export( $response, true ) );
		$result_1 = $wp_filesystem->put_contents( $acf_destination_path, $body );
		$this->assertTrue( $result_1, "Unable to save ACF Pro to the local WordPress test install [ class name :: " . get_class( $wp_filesystem ) . " ][ url :: $acf_download_url ][ path :: $acf_destination_path ]." );

		// Unzip the plugin.
		$result_2 = unzip_file( $acf_destination_path, $wp_filesystem->wp_plugins_dir() );
		$this->assertNotWPError( $result_2, 'An error occurred: ' . var_export( $result_2, true ) );

		// Activate the plugin.
		$result_3 = activate_plugin( 'advanced-custom-fields-pro/acf.php' );
		$this->assertNotWPError( $result_3, 'An error occurred: ' . var_export( $result_3, true ) );

		// Add the How To taxonomy term.
		$result_4 = wp_insert_term( 'How To', 'category' );
		$this->assertNotWPError( $result_4, 'An error occurred: ' . var_export( $result_4, true ) );

		// Empty reference array.
		$this->references = array();

		// register a repeater field.
		if ( function_exists( 'acf_add_local_field_group' ) ):
			acf_add_local_field_group( array(
				'key'    => 'group_5e611eba11fbe',
				'title'  => 'FinancialProduct',
				'fields' => array(
					array(
						'key'               => 'field_5e09d8a36d4fd',
						'label'             => 'Color',
						'name'              => '_wl_color',
						'type'              => 'repeater',
						'instructions'      => '',
						'required'          => 0,
						'conditional_logic' => 0,
						'wrapper'           => array(
							'width' => '',
							'class' => '',
							'id'    => '',
						),
						'collapsed'         => '',
						'min'               => 0,
						'max'               => 0,
						'layout'            => 'block',
						'button_label'      => 'Add Step',
						'sub_fields'        => array(
							array(
								'key'               => 'field_5e09d8e26d4fe',
								'label'             => 'Type',
								'name'              => 'color',
								'type'              => 'text',
								'instructions'      => '',
								'required'          => 1,
								'conditional_logic' => 0,
								'wrapper'           => array(
									'width' => '',
									'class' => '',
									'id'    => '',
								),
								'choices'           => array(
									'HowToStep'    => 'Step',
									'HowToSection' => 'Section',
								),
								'allow_null'        => 0,
								'other_choice'      => 0,
								'default_value'     => 'HowToStep',
								'layout'            => 'horizontal',
								'return_format'     => 'value',
								'save_other_choice' => 0,
							)
						)
					)
				)
			) );
		endif;

	}

	/**
	 * Get a {@link WP_Filesystem_Direct} instance.
	 *
	 * @return WP_Filesystem_Direct The {@link WP_Filesystem_Direct} instance.
	 */
	private function load_wp_filesystem() {
		// Required for REST API calls
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			include_once ABSPATH . 'wp-admin/includes/file.php';
		}

		// Load `WP_Filesystem`, forcing the direct method.
		add_filter( 'filesystem_method', array( $this, '__return_direct' ) );
		WP_Filesystem();
		remove_filter( 'filesystem_method', array( $this, '__return_direct' ) );

		global $wp_filesystem;

		return $wp_filesystem;
	}

	/**
	 * Always return `direct`. Useful to force the {@link WP_Filesystem} function to always return a
	 * {@link WP_Filesystem_Direct} instance.
	 *
	 * @return string Always `direct`.
	 */
	public function __return_direct() {

		return 'direct';
	}


	private function create_new_mapping_item( $taxonomy, $taxonomy_value, $properties ) {
		$mapping_id = $this->dbo->insert_mapping_item( 'foo' );
		// Create a rule group.
		$rule_group_id = $this->dbo->insert_rule_group( $mapping_id );

		$rule_id = $this->dbo->insert_or_update_rule_item(
			array(
				'rule_field_one'   => $taxonomy,
				'rule_logic_field' => '===',
				'rule_field_two'   => $taxonomy_value,
				'rule_group_id'    => $rule_group_id,
			)
		);
		foreach ( $properties as $property ) {
			$property['mapping_id'] = $mapping_id;
			$this->dbo->insert_or_update_property( $property );
		}
	}


	public function test_acf_repeater_field_should_be_converted_correctly() {
		$post_id = $this->factory()->post->create();
		wp_add_object_terms( $post_id, 'foo', Wordlift_Entity_Type_Taxonomy_Service::TAXONOMY_NAME );
		$result_1   = wp_add_object_terms( $post_id, 'how-to', 'category' );
		$properties = array(
			array(
				'property_name'      => 'color',
				'field_type'         => 'acf',
				'field_name'         => '_wl_color',
				'transform_function' => 'none',
				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
			),
		);
		$this->create_new_mapping_item( 'category', (int) $result_1[0], $properties );

		// insert the data for repeater field.
		for ( $i = 1; $i <= 2; $i ++ ) {
			$result = add_row(
				'_wl_color', array( 'color' => "color${i}" ), $post_id );
			$this->assertNotFalse( $result, 'Must not be false.' );
		}
		// Create a mapping and get the json ld.
		// Get the json ld data for this post.
		$jsonlds       = $this->jsonld_service->get_jsonld( false, $post_id );
		$target_jsonld = end( $jsonlds );

		$this->assertArrayHasKey( 'color', $target_jsonld );
		$this->assertEquals( $target_jsonld['color'], array( 'color1', 'color2' ) );
	}

	public function test_when_supplied_with_non_unique_and_empty_fields_to_repeater_field_should_be_removed() {
		$post_id = $this->factory()->post->create();
		wp_add_object_terms( $post_id, 'foo', Wordlift_Entity_Type_Taxonomy_Service::TAXONOMY_NAME );
		$result_1   = wp_add_object_terms( $post_id, 'how-to', 'category' );
		$properties = array(
			array(
				'property_name'      => 'color',
				'field_type'         => 'acf',
				'field_name'         => '_wl_color',
				'transform_function' => 'none',
				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
			),
		);
		$this->create_new_mapping_item( 'category', (int) $result_1[0], $properties );

		// insert the data for repeater field.
		for ( $i = 1; $i <= 2; $i ++ ) {
			$result = add_row(
				'_wl_color', array( 'color' => "color${i}" ), $post_id );
			$this->assertNotFalse( $result, 'Must not be false.' );
		}

		// Also add empty and non unique rows.
		add_row( '_wl_color', array( 'color' => "color1" ), $post_id );
		add_row( '_wl_color', array( 'color' => "" ), $post_id );
		add_row( '_wl_color', array( 'color' => "0" ), $post_id );

		// Create a mapping and get the json ld.
		// Get the json ld data for this post.
		$jsonlds       = $this->jsonld_service->get_jsonld( false, $post_id );
		$target_jsonld = end( $jsonlds );

		$this->assertArrayHasKey( 'color', $target_jsonld );
		$this->assertEquals( $target_jsonld['color'], array( 'color1', 'color2', '0' ) );
	}

//	public function test_on_terms_page_repeater_support_should_function_correctly() {
//		// Create a taxonomy + term.
//		register_taxonomy( 'foo', null );
//		$term_data = wp_create_term( 'bar', 'foo' );
//		$term_id   = $term_data['term_id'];
//
//		$properties = array(
//			array(
//				'property_name'      => 'color',
//				'field_type'         => 'acf',
//				'field_name'         => '_wl_color',
//				'transform_function' => 'none',
//				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
//			),
//		);
//		$this->create_new_mapping_item( 'taxonomy', 'foo', $properties );
//		$term = get_term( $term_id );
//		// insert the data for repeater field.
//		for ( $i = 1; $i <= 2; $i ++ ) {
//			$result = add_row(
//				'_wl_color', array( 'color' => "color${i}" ), $term );
//			$this->assertNotFalse( $result, 'Must not be false.' );
//		}
//
//		// Also add empty and non unique rows.
//		add_row( '_wl_color', array( 'color' => "color1" ), $term );
//		add_row( '_wl_color', array( 'color' => "" ), $term );
//		add_row( '_wl_color', array( 'color' => "0" ), $term );
//
//		global $wp_query;
//		$wp_query->queried_object    = get_term( $term_id );
//		$wp_query->queried_object_id = $term_id;
//		// get the json ld.
//		$result        = apply_filters( 'wl_term_jsonld_array',
//			array( 'jsonld' => array(), 'references' => array() ),
//			null
//		);
//		$target_jsonld = $result['jsonld'];
//
//		$this->assertArrayHasKey( 'color', $target_jsonld );
//		$this->assertEquals( $target_jsonld['color'], array( 'color1', 'color2', '0' ) );
//
//	}
//
//	public function test_on_terms_page_should_get_correct_data_for_acf_field() {
//		// register a acf field.
//		if ( function_exists( 'acf_add_local_field_group' ) ) {
//			acf_add_local_field_group( array(
//				'key'    => 'group_5e611eba11fb3',
//				'title'  => 'Example',
//				'fields' => array(
//					array(
//						'key'               => 'field_5e09d8a36d4fd',
//						'label'             => 'Color',
//						'name'              => '_wl_url',
//						'type'              => 'text',
//						'instructions'      => '',
//						'required'          => 0,
//						'conditional_logic' => 0,
//						'wrapper'           => array(
//							'width' => '',
//							'class' => '',
//							'id'    => '',
//						),
//						'collapsed'         => '',
//						'min'               => 0,
//						'max'               => 0,
//						'layout'            => 'block',
//						'button_label'      => 'Add Step',
//					)
//				)
//			) );
//
//		}
//
//		// Create a taxonomy + term.
//		register_taxonomy( 'foo', null );
//		$term_data = wp_create_term( 'bar', 'foo' );
//		$term_id   = $term_data['term_id'];
//		$term      = get_term( $term_id );
//		// lets add a url to the acf field.
//		update_field( '_wl_url', 'http://foo.com', $term );
//
//		$properties = array(
//			array(
//				'property_name'      => 'test_prop',
//				'field_type'         => 'acf',
//				'field_name'         => '_wl_url',
//				'transform_function' => 'none',
//				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
//			),
//		);
//		$this->create_new_mapping_item( 'taxonomy', 'foo', $properties );
//		$term = get_term( $term_id );
//		global $wp_query;
//		$wp_query->queried_object    = get_term( $term_id );
//		$wp_query->queried_object_id = $term_id;
//		// get the json ld.
//		$result        = apply_filters( 'wl_term_jsonld_array',
//			array( 'jsonld' => array(), 'references' => array() ),
//			null
//		);
//		$target_jsonld = $result['jsonld'];
//
//		$this->assertArrayHasKey( 'test_prop', $target_jsonld );
//		$this->assertEquals( $target_jsonld['test_prop'], 'http://foo.com' );
//
//
//	}


}

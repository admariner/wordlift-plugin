<?php
/**
 * This file provides the test for the Mappings feature.
 *
 * @since 3.25.0
 * @package Wordlift
 * @subpackage Wordlift/tests
 */

use Wordlift\Jsonld\Jsonld_Context_Enum;
use Wordlift\Mappings\Mappings_DBO;
use Wordlift\Mappings\Mappings_Validator;
use Wordlift\Mappings\Validators\Rule_Groups_Validator;
use Wordlift\Mappings\Validators\Rule_Validators_Registry;
use Wordlift\Mappings\Validators\Taxonomy_Rule_Validator;

/**
 * Class Wordlift_Mappings_Test
 *
 * @group mappings
 */
class Wordlift_Mappings_Test extends WP_UnitTestCase {

	private $jsonld_service;

	/**
	 * The {@link Mappings_Validator} instance to test.
	 *
	 * @since  3.25.0
	 * @access private
	 * @var Mappings_Validator $validator The {@link Mappings_Validator} instance to test.
	 */
	private $validator;

	/**
	 * The {@link Mappings_DBO} instance to test.
	 *
	 * @since  3.25.0
	 * @access private
	 * @var Mappings_DBO $dbo The {@link Mappings_DBO} instance to test.
	 */
	private $dbo;
	/**
	 * @var Wordlift_Term_JsonLd_Adapter
	 */
	private $term_jsonld_service;

	/**
	 * @throws Exception
	 */
	function setUp() {
		parent::setUp(); // TODO: Change the autogenerated stub

		// Initialize dependencies for the test.
		$this->dbo                 = new Mappings_DBO();
		$default_rule_validator    = new Taxonomy_Rule_Validator();
		$rule_validators_registry  = new Rule_Validators_Registry( $default_rule_validator );
		$rule_groups_validator     = new Rule_Groups_Validator( $rule_validators_registry );
		$this->validator           = new Mappings_Validator( $this->dbo, $rule_groups_validator );
		$this->jsonld_service      = Wordlift_Jsonld_Service::get_instance();
		$this->term_jsonld_service = Wordlift_Term_JsonLd_Adapter::get_instance();
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

	/**
	 * Test when the mapping is valid
	 */

	/** Test when the mapping is valid, check if it is mapping correctly on JSON-LD data, this test
	 * actually tests whether it is using wl_post_jsonld hook */
	public function test_provided_valid_mapping_check_for_correct_jsonld() {
		// Create a post.
		$post_id    = $this->factory()->post->create();
		$result_1   = wp_add_object_terms( $post_id, 'how-to', 'category' );
		$properties = array(
			array(
				'property_name'      => '@type',
				'field_type'         => 'text',
				'field_name'         => 'HowTo',
				'transform_function' => 'none',
				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
			),
		);
		$this->create_new_mapping_item( 'category', (int) $result_1[0], $properties );
		// Get the json ld data for this post.
		$jsonlds       = $this->jsonld_service->get_jsonld( false, $post_id );
		$target_jsonld = end( $jsonlds );
		$this->assertTrue( is_array( $target_jsonld ), "JSON-LD must be an array:\n" . var_export( $target_jsonld, true ) );
		$this->assertArrayHasKey( '@type', $target_jsonld, "JSON-LD is missing @type:\n" . var_export( $target_jsonld, true ) );
		$this->assertEquals( 'HowTo', $target_jsonld['@type'], "@type is incorrect: " . $target_jsonld['@type'] );
	}

	/** Test when the mapping is valid, check if it is mapping correctly on JSON-LD data, this test
	 * actually tests whether it is using wl_entity_jsonld hook */
	public function test_provided_valid_mapping_check_for_correct_entity_jsonld() {
		// Create a post.
		$post_id = wp_insert_post(
			array(
				'post_title' => 'foo'
			)
		);

		wp_add_object_terms( $post_id, 'foo', Wordlift_Entity_Type_Taxonomy_Service::TAXONOMY_NAME );
		$result_1   = wp_add_object_terms( $post_id, 'how-to', 'category' );
		$properties = array(
			array(
				'property_name'      => '@type',
				'field_type'         => 'text',
				'field_name'         => 'HowTo',
				'transform_function' => 'none',
				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
			),
		);
		$this->create_new_mapping_item( 'category', (int) $result_1[0], $properties );
		// Get the json ld data for this post.
		$jsonlds       = $this->jsonld_service->get_jsonld( false, $post_id );
		$target_jsonld = end( $jsonlds );
		$this->assertArrayHasKey( '@type', $target_jsonld );
		$this->assertEquals( 'HowTo', $target_jsonld['@type'] );
	}

	public function test_provided_valid_nested_mapping_should_get_correct_jsonld() {
		// Create a post.
		$post_id = wp_insert_post(
			array(
				'post_title' => 'foo'
			)
		);

		wp_add_object_terms( $post_id, 'foo', Wordlift_Entity_Type_Taxonomy_Service::TAXONOMY_NAME );
		$result_1   = wp_add_object_terms( $post_id, 'how-to', 'category' );
		$properties = array(
			array(
				'property_name'      => 'weight/foo/@type',
				'field_type'         => 'text',
				'field_name'         => 'Test',
				'transform_function' => 'none',
				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
			),
		);
		$this->create_new_mapping_item( 'category', (int) $result_1[0], $properties );
		// Get the json ld data for this post.
		$jsonlds       = $this->jsonld_service->get_jsonld( false, $post_id );
		$target_jsonld = end( $jsonlds );
		$this->assertArrayHasKey( 'weight', $target_jsonld );
		$this->assertArrayHasKey( 'foo', $target_jsonld['weight'] );
		$this->assertArrayHasKey( '@type', $target_jsonld['weight']['foo'] );
	}

	public function test_provided_valid_nested_schema_mapping_should_produce_valid_jsonld() {
		// Create a post.
		$post_id = wp_insert_post(
			array(
				'post_title' => 'foo'
			)
		);

		wp_add_object_terms( $post_id, 'foo', Wordlift_Entity_Type_Taxonomy_Service::TAXONOMY_NAME );
		$result_1   = wp_add_object_terms( $post_id, 'how-to', 'category' );
		$properties = array(
			array(
				'property_name'      => 'weight/foo/@type',
				'field_type'         => 'text',
				'field_name'         => 'Test',
				'transform_function' => 'none',
				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
			),
			array(
				'property_name'      => 'weight/foo/random',
				'field_type'         => 'text',
				'field_name'         => 'Test',
				'transform_function' => 'none',
				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
			),
		);
		$this->create_new_mapping_item( 'category', (int) $result_1[0], $properties );
		// Get the json ld data for this post.
		$jsonlds       = $this->jsonld_service->get_jsonld( false, $post_id );
		$target_jsonld = end( $jsonlds );
		$this->assertArrayHasKey( 'weight', $target_jsonld );
		$this->assertArrayHasKey( 'foo', $target_jsonld['weight'] );
		$this->assertArrayHasKey( '@type', $target_jsonld['weight']['foo'] );
		$this->assertArrayHasKey( 'random', $target_jsonld['weight']['foo'] );
		$this->assertEquals( 'Test', $target_jsonld['weight']['foo']['random'] );
	}


	public function test_given_empty_meta_value_should_not_add_the_property_on_jsonld() {
		// Create a post.
		$post_id = wp_insert_post(
			array(
				'post_title' => 'foo'
			)
		);

		wp_add_object_terms( $post_id, 'foo', Wordlift_Entity_Type_Taxonomy_Service::TAXONOMY_NAME );
		$result_1   = wp_add_object_terms( $post_id, 'how-to', 'category' );
		$properties = array(
			array(
				'property_name'      => 'foo',
				'field_type'         => \Wordlift\Mappings\Jsonld_Converter::FIELD_TYPE_CUSTOM_FIELD,
				'field_name'         => 'foo',
				'transform_function' => 'none',
				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
			),
		);
		$this->create_new_mapping_item( 'category', (int) $result_1[0], $properties );
		// Get the json ld data for this post.
		$jsonlds       = $this->jsonld_service->get_jsonld( false, $post_id );
		$target_jsonld = end( $jsonlds );
		$this->assertFalse( array_key_exists( 'foo', $target_jsonld ) );
	}

	public function test_given_a_term_page_with_no_mappings_should_not_add_data_in_jsonld() {
		register_taxonomy( 'foo', null );
		$term_data = wp_create_term( 'bar', 'foo' );
		$term_id   = $term_data['term_id'];
		update_term_meta( $term_id, 'foo', 'bar' );
		/**
		 * Create many post items to make the term_id and post_id
		 * equal.
		 */
		$this->factory()->post->create_many(9);
		/**
		 * step 1: create a post.
		 */
		$post_id = $this->factory()->post->create();

		update_post_meta( $post_id, 'foo', 'bar' );
		/**
		 * Step 2: configure mappings for this post.
		 */
		$properties = array(
			array(
				'property_name'      => 'foo',
				'field_type'         => \Wordlift\Mappings\Jsonld_Converter::FIELD_TYPE_CUSTOM_FIELD,
				'field_name'         => 'foo',
				'transform_function' => 'none',
				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
			),
		);
		/**
		 * setup rule and rule groups.
		 */
		$mapping_id    = $this->dbo->insert_mapping_item( 'post_mapping' );
		$rule_group_id = $this->dbo->insert_rule_group( $mapping_id );
		// Add rules.
		$this->dbo->insert_or_update_rule_item( array(
			'rule_field_one'   => 'post_type',
			'rule_logic_field' => \Wordlift\Mappings\Validators\Rule_Validator::IS_EQUAL_TO,
			'rule_field_two'   => 'post',
			'rule_group_id'    => $rule_group_id,
		) );
		/**
		 * Update the properties for mappings.
		 */
		foreach ( $properties as $property ) {
			$property['mapping_id'] = $mapping_id;
			$this->dbo->insert_or_update_property( $property );
		}
		/**
		 * Now get the jsonld for term, it should not have the post jsonld and also
		 * should not have foo property.
		 */

		$data = $this->term_jsonld_service->get( $term_id, Jsonld_Context_Enum::PAGE );

		$this->assertFalse( array_key_exists( 'foo', $data ) );
	}

	public function test_given_a_term_page_should_get_correct_data_in_mappings_for_meta_field() {
		// Create a taxonomy + term.
		register_taxonomy( 'foo', null );
		$term_data  = wp_create_term( 'bar', 'foo' );
		$term_id    = $term_data['term_id'];
		$properties = array(
			array(
				'property_name'      => 'foo',
				'field_type'         => \Wordlift\Mappings\Jsonld_Converter::FIELD_TYPE_CUSTOM_FIELD,
				'field_name'         => 'foo',
				'transform_function' => 'none',
				'property_status'    => Mappings_Validator::ACTIVE_CATEGORY,
			),
		);
		update_term_meta( $term_id, 'foo', 'bar value' );
		// we have created the term, create a rule group, properties and mapping item.
		$this->create_new_mapping_item( 'taxonomy', 'foo', $properties );
		// now set the term as queried object.
		global $wp_query;
		$wp_query->queried_object    = get_term( $term_id );
		$wp_query->queried_object_id = $term_id;
		// get the json ld.
		$result = apply_filters( 'wl_term_jsonld_array',
			array( 'jsonld' => array(), 'references' => array() ),
			$term_id
		);
		$jsonld = $result['jsonld'];
		$this->assertArrayHasKey( 'foo', $jsonld );
		$this->assertEquals( 'bar value', $jsonld['foo'] );
	}

}

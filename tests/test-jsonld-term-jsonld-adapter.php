<?php
/**
 * Tests the wordlift test jsonld adapter class.
 *
 * @since 3.26.0
 * @author Naveen Muthusamy <naveen@wordlift.io>
 * @package    Wordlift
 * @subpackage Wordlift/tests
 */

use Wordlift\Jsonld\Jsonld_Context_Enum;

/**
 * Class Wordlift_Term_Jsonld_Adapter_Test
 * @group jsonld
 */
class Wordlift_Term_Jsonld_Adapter_Test extends Wordlift_Unit_Test_Case {
	/**
	 * @var Wordlift_Term_JsonLd_Adapter instance.
	 */
	private $adapter;

	function setUp() {
		parent::setUp(); // TODO: Change the autogenerated stub
		$this->adapter = new Wordlift_Term_JsonLd_Adapter( Wordlift_Entity_Uri_Service::get_instance(), Wordlift_Jsonld_Service::get_instance() );
	}

	public function test_if_less_than_2_posts_are_present_then_dont_alter_the_jsonld() {
		// lets create a category
		$category_id = wp_insert_category( array( 'cat_name' => 'foo' ) );
		$result      = $this->adapter->get( $category_id, Jsonld_Context_Enum::PAGE );
		$this->assertEquals( array(), $result );
	}

	public function test_if_more_than_2_posts_present_then_add_jsonld() {
		// lets create a category
		$category_id = wp_insert_category( array( 'cat_name' => 'foo' ) );

		// Add 2 posts
		$first_post = $this->factory->post->create( array(
			'post_title' => 'foo'
		) );
		wp_set_post_categories( $first_post, array( $category_id ) );

		$second_post = $this->factory->post->create( array(
			'post_title' => 'bar'
		) );
		wp_set_post_categories( $second_post, array( $category_id ) );

		$args = array(
			'tax_query' => array(
				array(
					'taxonomy' => 'category',
					'field'    => 'term_id',
					'terms'    => $category_id
				)
			)
		);
		/**
		 * Emulating the query on the taxonomy page.
		 */
		global $wp_query;
		$wp_query = new WP_Query( $args );

		// get json ld data
		$result = $this->adapter->get( $category_id, Jsonld_Context_Enum::PAGE );
		$result = $result[0];
		// the result should have key itemListElement.
		$this->assertArrayHasKey( 'itemListElement', $result );
		// the result should have 2 post jsonlds
		$this->assertCount( 2, $result['itemListElement'] );

		$single_item = $result['itemListElement'][0];
		$this->assertArrayHasKey( '@type', $single_item );
		$this->assertArrayHasKey( 'position', $single_item );
		$this->assertEquals( $single_item['@type'], 'ListItem' );
		$this->assertEquals( $single_item['position'], 1 );
	}

	public function test_if_term_has_entity_linked_should_have_entity_data_in_jsonld() {
		// lets create a category
		$term_id = wp_insert_category( array( 'cat_name' => 'foo' ) );

		// Add entity to this category page.
		// Create an entity.
		$entity_id = $this->factory->post->create( array(
			'post_type'   => 'entity',
			'post_status' => 'publish',
			'post_title'  => 'Test Entity not Linked to a Term',
		) );

		add_term_meta( $term_id,
			'_wl_entity_id',
			Wordlift_Entity_Service::get_instance()->get_uri( $entity_id )
		);

		// Now this entity data should show up on term page.

		// Add 2 posts
		$first_post = $this->factory->post->create( array(
			'post_title' => 'foo'
		) );
		wp_set_post_categories( $first_post, array( $term_id ) );

		$second_post = $this->factory->post->create( array(
			'post_title' => 'bar'
		) );
		wp_set_post_categories( $second_post, array( $term_id ) );

		$args = array(
			'tax_query' => array(
				array(
					'taxonomy' => 'category',
					'field'    => 'term_id',
					'terms'    => $term_id
				)
			)
		);


		/**
		 * Emulating the query on the taxonomy page.
		 */
		global $wp_query;
		$wp_query = new WP_Query( $args );
		$jsonld   = $this->adapter->get( $term_id, Jsonld_Context_Enum::PAGE );
		$this->assertCount( 2, $jsonld, '2 items expected, instead I got this: ' . json_encode( $jsonld, 128 ) );
		$result = $jsonld[0];
		// the result should have key itemListElement.
		$this->assertArrayHasKey( 'itemListElement', $result );
		// the result should have 2 post jsonlds
		$this->assertCount( 2, $result['itemListElement'] );

		$single_item = $result['itemListElement'][0];
		$this->assertArrayHasKey( '@type', $single_item );
		$this->assertArrayHasKey( 'position', $single_item );
		$this->assertEquals( $single_item['@type'], 'ListItem' );
		$this->assertEquals( $single_item['position'], 1 );
	}

}

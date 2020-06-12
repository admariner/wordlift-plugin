<?php
// Tests temporarily disabled because FAQ isnt present in 3.26.0 release.
//
//use Wordlift\Faq\Faq_Rest_Controller;
//
///**
// * Tests: Tests the FAQ Rest Controller
// * @since 3.26.0
// * @package wordlift
// * @subpackage wordlift/tests
// *
// */
//
//class FAQ_REST_Controller_Test extends Wordlift_Unit_Test_Case {
//	private $faq_route = '/wordlift/v1/faq';
//	/**
//	 * @inheritdoc
//	 */
//	public function setUp() {
//		parent::setUp();
//
//		$this->rest_instance = new Faq_Rest_Controller();
//		global $wp_rest_server;
//
//		$wp_rest_server = new WP_REST_Server();
//		$this->server   = $wp_rest_server;
//		//$this->rest_instance->register_routes();
//		do_action( 'rest_api_init' );
//	}
//	public function test_rest_instance_not_null() {
//		$this->assertNotNull( $this->rest_instance );
//	}
//	public function test_given_question_and_answer_should_save_it_for_post() {
//		$post_id = $this->factory()->post->create( array('post_title' => 'foo'));
//		$request = $this->get_create_faq_item_request( $post_id );
//		$response  = $this->server->dispatch( $request );
//		// Should return 200 response
//		$this->assertEquals( 200, $response->get_status() );
//		$faq_items = get_post_meta($post_id, Faq_Rest_Controller::FAQ_META_KEY);
//		$this->assertCount( 2, $faq_items );
//		$response_data = $response->get_data();
//		$this->assertEquals( 'success', $response_data['status'] );
//	}
//
//	public function test_given_invalid_data_to_insert_faq_item_should_return_error() {
//		// Create user with 'publish_posts' capability.
//		$user_id   = $this->factory->user->create( array( 'role' => 'author' ) );
//		wp_set_current_user( $user_id );
//		// insert the data for this post, prepare POST request to FAQ.
//		$request   = new WP_REST_Request( 'POST', $this->faq_route );
//		$request->set_header( 'content-type', 'application/json' );
//		$request->set_body( wp_json_encode( array() ) );
//		$response  = $this->server->dispatch( $request );
//		$response_data = $response->get_data();
//		$this->assertEquals( 'rest_missing_callback_param', $response_data['code'] );
//	}
//	public function test_whether_rest_server_has_faq_route() {
//		$routes = $this->server->get_routes();
//		$this->assertArrayHasKey( $this->faq_route, $routes);
//	}
//
//	public function test_can_get_faq_items_from_api() {
//		$post_id = $this->factory()->post->create( array('post_title' => 'foo'));
//		$create_faq_items_request = $this->get_create_faq_item_request( $post_id );
//		$this->server->dispatch( $create_faq_items_request );
//		$request   = new WP_REST_Request( 'GET', $this->faq_route . "/". $post_id );
//		$request->set_query_params(array(
//			'post_id' => $post_id,
//		));
//		$response  = $this->server->dispatch( $request );
//		$this->assertEquals( 200, $response->get_status() );
//		$this->assertCount( 2, $response->get_data() );
//
//	}
//
//	/**
//	 * Test changing the faq items in the ui and update
//	 * it on the API.
//	 */
//	public function test_update_faq_items() {
//		// We created the items on the DB
//		$post_id = $this->factory()->post->create( array('post_title' => 'foo'));
//		$create_faq_items_request = $this->get_create_faq_item_request( $post_id );
//		$this->server->dispatch( $create_faq_items_request );
//		// Now emulate changing the data in ui and trying to update it on the ui
//		$first_item_id = get_post_meta( $post_id, Faq_Rest_Controller::FAQ_META_KEY );
//		$first_item_id = $first_item_id[0]['id'];
//
//		$data = array(
//			'post_id' => $post_id,
//			'faq_items' => array(
//				array(
//					'question' => 'changed_question_1',
//					'answer'   => 'changed_answer_1',
//					'previous_question_value' => 'foo question 1',
//					'previous_answer_value'   => 'foo answer 1',
//					'id' => $first_item_id
//				)
//			)
//		);
//		$request   = new WP_REST_Request( 'PUT', $this->faq_route );
//		$request->set_header( 'content-type', 'application/json' );
//		$request->set_body( wp_json_encode( $data ) );
//		$response  = $this->server->dispatch( $request );
//		$this->assertEquals( $response->get_status(), 200 );
//		$faq_items = get_post_meta($post_id, Faq_Rest_Controller::FAQ_META_KEY);
//		$changed_faq_item = $faq_items[0];
//		$this->assertEquals( $changed_faq_item['question'], 'changed_question_1');
//		$this->assertEquals( $changed_faq_item['answer'], 'changed_answer_1');
//	}
//
//	public function test_can_update_duplicate_items_correctly() {
//		$post_id = $this->factory()->post->create( array('post_title' => 'foo'));
//		$data = array(
//			'post_id'   => $post_id,
//			'faq_items' => array(
//				array(
//					'question' => 'foo',
//					'answer'   => 'bar'
//				),
//				array(
//					'question' => 'foo',
//					'answer'   => 'bar'
//				)
//			)
//		);
//		// We have create request with two duplicate items.
//		$create_faq_items_request = $this->get_create_faq_item_request( $post_id, $data );
//		$this->server->dispatch( $create_faq_items_request );
//
//		$request   = new WP_REST_Request( 'GET', $this->faq_route . "/". $post_id );
//		$request->set_query_params(array(
//			'post_id' => $post_id,
//		));
//		$response  = $this->server->dispatch( $request )->get_data();
//
//		$data = array(
//			'post_id' => $post_id,
//			'faq_items' => array(
//				array(
//					'question' => 'foo1',
//					'answer'   => 'bar1',
//					'previous_question_value' => 'foo',
//					'previous_answer_value'   => 'bar',
//					'id' => $response[0]["id"]
//				)
//			)
//		);
//		// we are trying to update the duplicate item, and send the update request.
//		$request   = new WP_REST_Request( 'PUT', $this->faq_route );
//		$request->set_header( 'content-type', 'application/json' );
//		$request->set_body( wp_json_encode( $data ) );
//		$response  = $this->server->dispatch( $request );
//
//		$faq_data = get_post_meta( $post_id, Faq_Rest_Controller::FAQ_META_KEY);
//		// check the first item,it should be having foo1, bar1 as question and answer.
//		$first_faq_item = $faq_data[0];
//		$this->assertEquals('foo1', $first_faq_item['question']);
//		$this->assertEquals('bar1', $first_faq_item['answer']);
//	}
//
//	/**
//	 * @param $post_id
//	 *
//	 * @return WP_REST_Request
//	 */
//	private function get_create_faq_item_request( $post_id, $faq_items_data = null ) {
//		$data = array(
//			'post_id'   => $post_id,
//			'faq_items' => array(
//				array(
//					'question' => 'foo question 1',
//					'answer'   => 'foo answer 1'
//				),
//				array(
//					'question' => 'foo question 2',
//					'answer'   => 'foo answer 2'
//				)
//			)
//		);
//		if ( $faq_items_data !== null) {
//			$data = $faq_items_data;
//		}
//		// Create user with 'publish_posts' capability.
//		$user_id = $this->factory->user->create( array( 'role' => 'author' ) );
//		wp_set_current_user( $user_id );
//		// insert the data for this post, prepare POST request to FAQ.
//		$request = new WP_REST_Request( 'POST', $this->faq_route );
//		$request->set_header( 'content-type', 'application/json' );
//		$request->set_body( wp_json_encode( $data ) );
//
//		return $request;
//	}
//	/**
//	 * Testing if only the answer is deleted, then it should delete only
//	 * the answer not the full faq item.
//	 */
//	public function test_can_only_delete_the_answer() {
//		$post_id = $this->factory()->post->create( array('post_title' => 'foo'));
//		$data = array(
//			'post_id'   => $post_id,
//			'faq_items' => array(
//				array(
//					'question' => 'foo1',
//					'answer'   => 'bar1'
//				),
//				array(
//					'question' => 'foo2',
//					'answer'   => 'bar2'
//				)
//			)
//		);
//		// We have created two faq items.
//		$create_faq_items_request = $this->get_create_faq_item_request( $post_id, $data );
//		$this->server->dispatch( $create_faq_items_request );
//
//		// now lets get those items.
//		$request   = new WP_REST_Request( 'GET', $this->faq_route . "/". $post_id );
//		$request->set_query_params(array(
//			'post_id' => $post_id,
//		));
//		$response  = $this->server->dispatch( $request )->get_data();
//
//		// we need to craft a request to delete the answer only.
//		$data = array(
//			'post_id' => $post_id,
//			'faq_items' => array(
//				array(
//					'question' => 'foo1',
//					'answer'   => 'bar1',
//					'id' => (string) $response[0]["id"],
//					'field_to_be_deleted' => 'answer'
//				)
//			)
//		);
//		// request to delete the faq items.
//		$request   = new WP_REST_Request( WP_REST_Server::DELETABLE, $this->faq_route );
//		$request->set_header( 'content-type', 'application/json' );
//		$request->set_body( wp_json_encode( $data ) );
//		$response  = $this->server->dispatch( $request );
//		// should be 200
//		$this->assertEquals(200, $response->get_status());
//		$data = $response->get_data();
//		// should return success
//		$this->assertArrayHasKey('status', $data);
//		// should be success in status
//		$this->assertEquals($data['status'], 'success');
//		// check if the item is removed.
//		$items = get_post_meta($post_id, Faq_Rest_Controller::FAQ_META_KEY);
//		$this->assertEquals( 2, count($items) );
//		// also the answer should be empty in the first item.
//		$this->assertEquals('', $items[0]['answer']);
//	}
//	/**
//	 * Testing if the user can delete the Faq items correctly.
//	 */
//	public function test_can_delete_faq_items_correctly() {
//		$post_id = $this->factory()->post->create( array('post_title' => 'foo'));
//		$data = array(
//			'post_id'   => $post_id,
//			'faq_items' => array(
//				array(
//					'question' => 'foo1',
//					'answer'   => 'bar1'
//				),
//				array(
//					'question' => 'foo2',
//					'answer'   => 'bar2'
//				)
//			)
//		);
//		// We have created two faq items.
//		$create_faq_items_request = $this->get_create_faq_item_request( $post_id, $data );
//		$this->server->dispatch( $create_faq_items_request );
//
//		$request   = new WP_REST_Request( 'GET', $this->faq_route . "/". $post_id );
//		$request->set_query_params(array(
//			'post_id' => $post_id,
//		));
//		$response  = $this->server->dispatch( $request )->get_data();
//		// lets try to delete them.
//		$data = array(
//			'post_id' => $post_id,
//			'faq_items' => array(
//				array(
//					'question' => 'foo1',
//					'answer'   => 'bar1',
//					'id' => (string) $response[0]["id"],
//					'field_to_be_deleted' => Faq_Rest_Controller::QUESTION
//				)
//			)
//		);
//		// request to delete the faq items.
//		$request   = new WP_REST_Request( WP_REST_Server::DELETABLE, $this->faq_route );
//		$request->set_header( 'content-type', 'application/json' );
//		$request->set_body( wp_json_encode( $data ) );
//		$response  = $this->server->dispatch( $request );
//		// should be 200
//		$this->assertEquals(200, $response->get_status());
//		$data = $response->get_data();
//		// should return success
//		$this->assertArrayHasKey('status', $data);
//		// should be success in status
//		$this->assertEquals($data['status'], 'success');
//		// check if the item is removed.
//		$items = get_post_meta($post_id, Faq_Rest_Controller::FAQ_META_KEY);
//		$this->assertEquals( 1, count($items) );
//	}
//}

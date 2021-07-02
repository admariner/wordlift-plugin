<?php
/**
 * @since 3.32.0
 * @author Naveen Muthusamy <naveen@wordlift.io>
 * This class provides a abstract layer for content filter service to generate a link by entity uri service.
 */

namespace Wordlift\Link;

use Wordlift\Common\Singleton;
use Wordlift\Object_Type_Enum;

class Object_Link_Provider extends Singleton {
	/**
	 * @var array<Link>
	 */
	private $link_providers;

	/**
	 * @return Object_Link_Provider
	 */
	public static function get_instance() {
		return parent::get_instance();
	}

	public function __construct() {
		parent::__construct();
		$this->link_providers = array(
			Object_Type_Enum::POST => Post_Link::get_instance(),
			Object_Type_Enum::TERM => Term_Link::get_instance()
		);
	}

	/**
	 * @param $id
	 * @param $label_to_be_ignored
	 */
	public function get_link_title( $id, $label_to_be_ignored, $type ) {

	}

	public function get_link( $type ) {

	}

	/**
	 * Return the object type by the entity uri.
	 * @return int which can be any of the {@link Object_Type_Enum} values.
	 */
	public function get_object_type( $uri ) {

	}

	/**
	 * @param $uri
	 * @param $object_type
	 *
	 * @return int
	 */
	public function get_object_id_by_type( $uri, $object_type ) {

	}

	public function get_same_as_uris( $id, $object_type ) {
		$provider = $this->get_provider( $object_type );
		if ( ! $provider ) {
			return array();
		}

		return $provider->get_same_as_uris( $id );
	}

	/**
	 * @param $object_type
	 *
	 * @return mixed|Link
	 */
	private function get_provider( $object_type ) {

		if ( ! array_key_exists( $object_type, $this->link_providers ) ) {
			return false;
		}

		return $this->link_providers[ $object_type ];
	}


}
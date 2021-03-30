<?php

namespace Wordlift\Vocabulary\Data\Entity_List;

/**
 * This class is created to support new multiple entity matches in db.
 * @since 3.30.0
 * @author Naveen Muthusamy <naveen@wordlift.io>
 */
class Default_Entity_List extends Entity_List {

	const META_KEY = '_wl_vocabulary_entity_match_for_term';

	/**
	 * @var Legacy_Entity_List
	 */
	private $legacy_entity;

	/**
	 * Default_Entity constructor.
	 *
	 * @param $term_id int
	 * @param $legacy_entity Legacy_Entity_List
	 */
	public function __construct( $term_id, $legacy_entity ) {
		parent::__construct( $term_id );
		$this->legacy_entity = $legacy_entity;
	}

	public function get_jsonld_data() {
		$default_data = get_term_meta( $this->term_id, self::META_KEY, true );
		if ( is_array( $default_data ) ) {
			return $default_data;
		}

		// Use legacy entity if the data doesnt exist on that key.
		return $this->legacy_entity->get_jsonld_data();
	}

	public function save_jsonld_data( $entity_data ) {
		$same_as_list = array_merge( $entity_data['sameAs'], array( $entity_data['@id'] ) );

		$alt_labels = array( (string) $entity_data['name'] );

		$entity_list = get_term_meta( $this->term_id, self::META_KEY, true );

		$entity = array(
			'@type'         => $entity_data['@type'],
			'description'   => $entity_data['description'],
			'sameAs'        => $same_as_list,
			'alternateName' => $alt_labels
		);

		if ( ! is_array( $entity_list ) ) {
			// Then the data is not present, so wrap the data in array
			$entity_list = array( $entity );
		} else {
			array_push( $entity_list, $entity );
		}

		update_term_meta( $this->term_id, self::META_KEY, $entity_list );

	}

	public function clear_data() {
		delete_term_meta( $this->term_id, self::META_KEY );

	}

	public function remove_entity_by_id( $entityId ) {
	}
}
<?php

namespace Wordlift\Modules\Pods;

class Quiet_Skin extends \WP_Upgrader_Skin {

	// phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
	public function feedback( $feedback, ...$args ) {
		// Dont print result.
	}

}

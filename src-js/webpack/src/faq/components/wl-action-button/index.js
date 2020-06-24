/**
 * WlCard : shows a card for containing elements
 * @since 3.26.0
 * @author Naveen Muthusamy
 */

/**
 * External dependencies.
 */
import React from "react";
/**
 * Internal dependencies.
 */
import "./index.scss";

const WlActionButton = ({ className = "", text, onClickHandler }) => {
  return (
    <button onClick={onClickHandler} className={"wl-action-button " + className} type={"button"}>
      {text}
    </button>
  );
};

export default WlActionButton;

/**
 * BulkActionComponent : Displays the list of bulk actions 
 * based on the category
 *
 * @author Naveen Muthusamy <naveen@wordlift.io>
 * @since 3.24.0
 */

/**
 * External dependencies
 */
import React from "react"
import { BulkActionOptions } from "./BulkActionSubComponents"

/** Bulk action apply button */
const BulkActionApplyButton = ({ bulkActionSubmitHandler }) => {
    return (
        <div className="wl-col">
            <button 
                className="button action"
                onClick={ () => { bulkActionSubmitHandler() }}>
                Apply
            </button>
        </div>
    )
}

/** Bulk action options wrapper */
const BulkActionOptionsWrapper = ( { choosenCategory } ) => {
    return (
        <div className="wl-col">
            <select className="form-control">
                <option value="-1">Bulk Actions</option>
                <BulkActionOptions 
                    choosenCategory={choosenCategory} 
                />
            </select>
        </div>
    )
}

class BulkActionComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <BulkActionOptionsWrapper 
                    choosenCategory = { this.props.choosenCategory }
                />
                <BulkActionApplyButton 
                    bulkActionSubmitHandler = { this.props.bulkActionSubmitHandler }
                />
            </React.Fragment>
        )
    }
}

export default BulkActionComponent
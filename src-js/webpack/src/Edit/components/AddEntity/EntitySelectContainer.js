import { connect } from "react-redux";

import EntitySelect from "./EntitySelect";
import { close, setValue } from "./actions";

const mapStateToProps = ({ open, value, items }) => ({ open, value, items });

const mapDispatchToProps = dispatch => ({
  onInputChange: value => dispatch(setValue(value)),
  onCancel: () => dispatch(close())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntitySelect);

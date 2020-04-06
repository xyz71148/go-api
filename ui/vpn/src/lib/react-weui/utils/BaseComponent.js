import React from 'react';
import ReactDOM from "react-dom";

/**
 * screen mask, use in `Dialog`, `ActionSheet`, `Popup`.
 *
 */
class BaseComponent extends React.Component {
	constructor(props) {
		super(props);
		this.el = document.createElement('div');
	}

	componentDidMount() {
		document.body.appendChild(this.el);
	}

	componentWillUnmount() {
		document.body.removeChild(this.el);
	}

	render() {
		return ReactDOM.createPortal(
			this.props.children,
			this.el,
		);
	}
}


export default BaseComponent;

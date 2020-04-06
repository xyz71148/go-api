import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from '../../utils/classnames';
import BaseComponent from '../../utils/BaseComponent';

import Mask from '../mask';

/**
 *  pop out indicator to inform users
 *
 */
class Toast extends Component {
    static propTypes = {
        /**
         * Icon Value
         *
         */
        icon: PropTypes.string,
        /**
         * Icon Size
         *
         */
        iconSize: PropTypes.string,
        /**
         * display toast
         *
         */
        show: PropTypes.bool
    };

    static defaultProps = {
        icon: 'toast',
        show: false,
    };

    render() {
        const {className, icon,loading, show, children, iconSize,text, ...others} = this.props;
        const cls = classNames('weui-icon_toast', {
            [className]: className,
            'weui-icon-success-no-circle': !loading,
            'weui-loading': !!loading
        });
        return (
                show ?
                    <BaseComponent>
                        <Mask transparent={true}/>
                        <div className="weui-toast" style={{transition: "opacity 0.5s"}}>
                            <i className={cls} />
                            <p className="weui-toast__content">{text}</p>
                        </div>
                    </BaseComponent>:
                    null

        );
    }
}

export default Toast;

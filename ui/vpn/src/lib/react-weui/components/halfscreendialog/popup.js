import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from '../../utils/classnames';
import BaseComponent from '../../utils/BaseComponent';

import Mask from '../mask';
import './popup.less';

/**
 *  An Popup modal from bottom
 *
 */
class Popup extends Component {
    static propTypes = {
        /**
         * display the component
         *
         */
        show: PropTypes.bool,
        /**
         * show mask
         *
         */
        enableMask: PropTypes.bool
    };

    static defaultProps = {
        show: false,
        enableMask: false
    }

    render() {
        const { className, children, show, onRequestClose, enableMask, ...others } = this.props;
        const cls = classNames('weui-half-screen-dialog', {
            'weui-half-screen-dialog_show': show
        }, className);

        return (
            <BaseComponent>
                <div className={"js_dialog"}>
                    <Mask transparent={enableMask} style={{display: show ? 'block' : 'none'}} onClick={onRequestClose} />
                    <div className={cls} {...others} style={{display: show ? 'block' : 'none'}}  >
                        <div className="weui-half-screen-dialog__hd">
                            <div className="weui-half-screen-dialog__hd__side">
                                <button onClick={onRequestClose} className="weui-icon-btn">关闭<i className="weui-icon-close-thin" /></button>
                            </div>
                            <div className="weui-half-screen-dialog__hd__main">
                                <strong className="weui-half-screen-dialog__title">标题</strong>
                            </div>
                        </div>
                        <div className="weui-half-screen-dialog__bd">
                            { children }
                        </div>
                    </div>
                </div>
            </BaseComponent>
        );
    }
}

export default Popup;

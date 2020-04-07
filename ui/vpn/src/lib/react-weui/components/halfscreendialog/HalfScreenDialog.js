import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from '../../utils/classnames';
import BaseComponent from '../../utils/BaseComponent';

import Mask from '../mask';
import './style.css';

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

    componentDidMount() {

    }


    render() {
        const {className, height, children, title, show, onClose, enableMask, ...others} = this.props;
        const cls = classNames('weui-half-screen-dialog', {
            'weui-half-screen-dialog_show': show
        }, className);
        const height_ = height ? height : "75vh";
        return (
            show ?
                    <BaseComponent>
                        <Mask className={"weui-animate-fade-in"} transparent={enableMask} style={{zIndex:5000-1}} onClick={onClose}/>

                        <div className={cls} {...others} style={{height:height_}}>
                            <div className="weui-half-screen-dialog__hd">
                                <div className="weui-half-screen-dialog__hd__side">
                                    <button onClick={onClose} className="weui-icon-btn">关闭<i
                                        className="weui-icon-close-thin"/></button>
                                </div>
                                {
                                    title &&
                                    <div className="weui-half-screen-dialog__hd__main">
                                        <strong className="weui-half-screen-dialog__title">{title}</strong>
                                    </div>
                                }

                            </div>
                            <div className="weui-half-screen-dialog__bd">
                                {children}
                            </div>

                        </div>
                    </BaseComponent>
                : null
        );
    }
}

export default Popup;

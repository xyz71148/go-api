import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from '../../utils/classnames';
import BaseComponent from '../../utils/BaseComponent';
import Mask from '../mask';
import './style.css';

/**
 * Used to display a collection of actions that contain a set of interactivity, including descriptions, links, and so on. Popup from the bottom, generally used to respond to user clicks on the page.
 */
class ActionSheet extends Component {
    static propTypes = {
        /**
         * Array of Objects for menus, `label` property is Required
         *
         */
        menus: PropTypes.array,
        /**
         * Array of Objects for actions, `label` property is Required
         *
         */
        actions: PropTypes.array,
        /**
         * To display ActionSheet
         *
         */
        show: PropTypes.bool,
        /**
         * Function triggers when user click on the mask
         *
         */
        onRequestClose: PropTypes.func,
        /**
         * style: ios/android
         */
        type: PropTypes.string,
    };

    static defaultProps = {
        type: '',
        menus: [],
        actions: [],
        show: false,
    };

    constructor(props) {
        super(props);


        this.handleMaskClick = this.handleMaskClick.bind(this);
    }

    renderMenuItem() {
        return this.props.menus.map((menu, idx) => {
            const {label, className, ...others} = menu;
            const cls = classNames({
                'weui-actionsheet__cell': true,
                [className]: className
            });

            return (
                <div key={idx} {...others} className={cls}>{label}</div>
            );
        });
    }

    renderActions() {
        return this.props.actions.map((action, idx) => {
            const {label, className, ...others} = action;
            const cls = classNames({
                'weui-actionsheet__cell': true,
                [className]: className
            });

            return (
                <div key={idx} {...others} className={cls}>{label}</div>
            );
        });
    }

    handleMaskClick(e) {
        if (this.props.onClose) this.props.onClose(e);
    }

    render() {
        const {show, type, onClose, menus, actions, ...others} = this.props;
        const cls = classNames({
            'weui-actionsheet': true,
            'weui-actionsheet_toggle': show
        });

        let styleType = type ? type : 'ios';

        return (
            show ?
            <BaseComponent>
                <div
                    className={styleType === 'android' ? 'weui-skin_android' : ''}
                >
                    <Mask className={"weui-animate-fade-in"} style={{zIndex:6000-1}} onClick={this.handleMaskClick}/>
                    <div className={cls} {...others} >
                        <div className="weui-actionsheet__menu">
                            {this.renderMenuItem()}
                        </div>
                        <div className="weui-actionsheet__action">
                            {this.renderActions()}
                        </div>
                    </div>
                </div>
            </BaseComponent>:null
        );
    }
};

export default ActionSheet;

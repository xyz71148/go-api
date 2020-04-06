import React from 'react';
import PropTypes from 'prop-types';
import classNames from '../../utils/classnames';
import BaseComponent from '../../utils/BaseComponent';

/**
 * screen mask, use in `Dialog`, `ActionSheet`, `Popup`.
 *
 */
class Mask extends React.Component {
    static propTypes = {
        /**
         * Whather mask should be transparent (no color)
         *
         */
        transparent: PropTypes.bool
    };

    static defaultProps = {
        transparent: false
    };

    render() {
        const {transparent, className, ...others} = this.props;
        const clz = classNames({
            'weui-mask': !transparent,
            'weui-mask_transparent': transparent
        }, className);

        return (
            <BaseComponent>
                <div className={clz} {...others}></div>
            </BaseComponent>
        );
    }
}

export default Mask;

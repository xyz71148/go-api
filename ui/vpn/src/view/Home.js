import React, {Component} from 'react';
import './Home.css';
import {FaBars} from 'react-icons/fa';
import Star from './components/Star';
import {connect} from "react-redux";

class Home extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        return (
            <div className="Home">
                <div className={"setting"}>
                    <FaBars size={"1.5em"} color={"white"}/>
                </div>
                <Star />
            </div>
        );
    }
}

export default connect(({instance}) => ({
    showVipLines: instance.showVipLines,
    showVipLinesActionSheet: instance.showVipLinesActionSheet,
}))(Home);
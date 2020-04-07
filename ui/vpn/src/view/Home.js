import React, {Component} from 'react';
import './Home.css';
import {FaBars} from 'react-icons/fa';
import Star from './components/Star';
import {connect} from "react-redux";
import {del_access_token, is_logged} from '../lib/utils'
class Home extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        const menus = [];
        if(is_logged()){
            menus.push(
                {
                    label: '退出登录',
                    onClick:  () => {
                        del_access_token();
                        this.props.dispatch({
                            type:"app/setState",
                            payload:{
                                access_token:null
                            }
                        })
                        console.log('退出登录');
                        window.location.reload();
                    }
                }
            )
        }
        return (
            <div className="Home">
                <div onClick={()=>{
                    window.weui.actionSheet(menus, [
                        {
                            label: '取消',
                            onClick: function () {
                                console.log('取消');
                            }
                        }
                    ], {
                        title: '',
                        className: "weui-custom",
                        onClose: function(){
                            console.log('关闭');
                        }
                    });


                }}  className={"setting"}>
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
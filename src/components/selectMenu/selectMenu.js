/**
 * Created by gaoju on 2017/12/9.
 */
/**
 * Created by gaoju on 2017/11/16.
 */
import React, { Component } from 'react'
import { Link } from 'react-router'
import MaskAlter from '../Alter/maskAlter/maskalter'
import { Menu, Dropdown,Icon } from 'antd';
import './style.css'

class SelectMenu extends Component {
    constructor(props) {
        super(props)
        this.state={
            visible: false
        }
    }
    handleClick =()=>{
        this.setState({visible:true});
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <MaskAlter title="三角函数"></MaskAlter>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                    <MaskAlter title="知识点2"></MaskAlter>
                </Menu.Item>
            </Menu>
        );
        return (
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" href="#">提示</a>
                </Dropdown>
            </div>
        );
    }
}

export default SelectMenu
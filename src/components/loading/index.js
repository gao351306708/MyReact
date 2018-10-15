/**
 * 加载图标
 * Created by gaoju on 2018/8/16.
 */
import React, { Cmponent } from 'react'
import {Spin } from 'antd'
import PropTypes from 'prop-types'


class Loading extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            size: props.size || "small",//默认显示小的
            tip:props.tip || '',
            style:props.style || {},
        }
    }
    render() {
        const {size,tip,style} = this.state;
        const css = {
            textAlign:"center"
        }
        return (
            <div style={css}><Spin tip={tip} size={size} style={style} /></div>
        );
    }
}
Loading.propTypes = {
    size: PropTypes.string,//加载动画的大小
    tip:PropTypes.string,//提示语
    style:PropTypes.object,//样式
}
export default Loading
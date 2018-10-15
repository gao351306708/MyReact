/**
 * 考纲复习(专题模块复习)页面
 * Created by gaoju on 2018/5/17.
 */
import React,{Component} from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './question_style.css'
import {Pagination,Modal,message} from 'antd'
import {Storage_S} from '../../../../config'

//修改翻页文字链接
function itemRender(current, type, originalElement) {
    if (type === 'prev') {
        return <a>上一页</a>;
    } else if (type === 'next') {
        return <a>下一页</a>;
    }
    return originalElement;
}
var base = new Base64();//base64对象
class ThematicQuesList extends Component{
    constructor(props) {
        super(props)
        this.state={
        }
    }
    componentDidMount(){

    };
    render(){
        return (
            <div className="mask2" style={{backgroundColor:'rgb(193, 223, 249)'}}>
                <div className="thematicQues-parts">
                    <div className="partOne">
                        这里是每一部分的head内容。可能是表格也可能是其他的东西
                    </div>
                    <div className="partTwo">
                        <div className="pageslist">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThematicQuesList)
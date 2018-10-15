/**
 * 下载文件
 * Created by gaoju on 2018/7/17
 */

import React,{Component} from 'react'
import './style.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {WINDOW_HOST} from '../../config'
import * as Modals from '../../method_public/antd-modal'
import {download} from '../../redux/actions/upload'


class DownLoadFile extends Component{
    constructor(props){
        super(props)
        this.state={
            imageURL:"",
            preview:props.preview || 'true',//是否预显示,
            personFlag:props.personFlag || '1'//谁上传的： 教师、学生、管理员。。。。；教师为0，学生为1;默认为学生上传
        }
    }
    downloadSubmit=()=>{
        console.log("下载文件！！！")
    }
    render(){
        return(
            <div className="fileupload">
                <form>
                    <a>这是要下载的文件</a>
                    <button type="button" className="btn btn-default btn-sm" onClick={this.downloadSubmit}>开始上传</button>
                </form>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({download}, dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(DownLoadFile)
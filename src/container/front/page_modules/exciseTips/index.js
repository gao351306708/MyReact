/**解题技巧
 * Created by gaoju on 2018/7/4.
 */
import React,{Component} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {downloadFile} from '../../../../redux/actions/upload'
import * as Modals from '../../../../method_public/antd-modal'
import {Button} from 'antd';


class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            name:'download'
        };
    }
    downloadSubmit(name){
        console.log("下载文件！！！",name,this.state.name)
        this.props.actions.downloadFile({
            body:{
                "name": name
            },
            callback:(data)=>{
                console.log(data)
            }
        })
    }
    render(){
        return (
            <div className="exciseTips">
                <ul>
                    <li>
                        <div><a href="javascript:void(0);">1、考试相关文档:</a></div>
                        <ul style={{margin:'0 20px',padding:'0 20px'}}>
                            <li>2018年广东省中考数学考试大纲<a href="/api/download?name=2018年广东省中考数学考试大纲.pdf" className="btnDownload">下载</a></li>
                            <li>广东省中考数学试卷结构和命题规律<a href="/api/download?name=广东省中考数学试卷结构和命题规律(2016年~2018年).pdf" className="btnDownload">下载</a></li>
                        </ul>
                        {/*<a href="public/docs/readme.txt" className="btnDownload">广东省中考数学试卷结构和命题规律(下载)</a>*/}
                    </li>
                </ul>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({downloadFile}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Index)
/**
 *知识点复习（按照章节复习，选中四部分其中某一部分的页面展示）
 * Created by gaoju on 2018/7/26.
 */
import React,{Component} from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './style.css'
import {requestData} from '../../../../method_public/public'
import {Pagination,Modal,message} from 'antd'
import {Storage_S} from '../../../../config'
import PureRenderMixin from '../../../../method_public/pure-render'
import {getAllQuestionOfThematic,getAllChildOfQuestion,getKnowledgeIdList,setThematicQuestionAnswerInfo} from '../../../../redux/actions/math'
import {getProvinceList} from '../../../../redux/actions/page'
import MultipleChoice from '../../../../components/multipleChoice/index'
import DialogMask from '../../../../components/Alter/dialogMask/dialogmask'
import Knowledge from './knowledge.js'
import { Collapse,Select } from 'antd';

var base = new Base64();//base64对象
class ChapterPart extends Component{
    constructor(props) {
        super(props)
        let num = this.props.params.num;
        console.log("this.props.param====>>>>",num)
        this.state = {
        }
    }
    componentDidMount(){
    };
    handleChapter(e){
    }
    handleGrade(num,e){
    }
    render(){
        return (
            <div className="mask2" style={{backgroundColor:'rgb(193, 223, 249)'}}>
                <div className="thematicChapter">
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
        actions: bindActionCreators({push,getProvinceList}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChapterPart)
/**
 * 知识点弹框页面
 * Created by gaoju on 2018/5/28.
 */

import React,{Component} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getKnowledgeIdList,sentKnowledgeForQuestionInfo,getEveryQuestion} from '../../../../redux/actions/math'
import './question_style.css'
import ShowMask from '../../../../components/Alter/showMask'
import MultipleChoice from '../../../../components/multipleChoice/index'
import {MathJaxEditor} from '../../../../components/editer'
import DialogMask from '../../../../components/Alter/dialogMask/dialogmask'
import Loading from '../../../../components/loading/index'
import {getCoords} from '../../../../method_public/public'
import {Storage_S,Storage_L} from '../../../../config'
import Knowledge2 from './knowledge.js'
import { Menu, Icon,Button,Spin } from 'antd'


class Knowledge extends Component{
    constructor(props){
        super(props);
        this.state={
            knowledgeName:props.knowledgeName,//知识点名
            knowledgeId:props.knowledgeId || '',
            questionId:props.questionId ||'',
            examPaperId:props.examPaperId || '',
            questionListOfKnowledge:[],//知识点对应的所有试题
            target_id:'',
            position:[],
            showEditor:false,
            DialogMaskFlag2:false,
            Pending : true,//加载转圈标志
        }
    }
    componentDidMount(){
        let knowledgeName = this.state.knowledgeName;
        console.log("knowledgeName:::-22222->",knowledgeName)
        this.props.actions.getKnowledgeIdList({
            body:[{knowledgeName:knowledgeName}],
            success:(data)=>{
                if(data[0].code != 200){
                    setTimeout(()=>{
                        this.setState({
                            Pending:false
                        })
                    },500)
                    return ;
                }
                let newdata=[],alldata = data[0].data;
                let knowledgeId = alldata[0].knowledgeid;
                for(let i in alldata){
                    newdata[i] = {
                        id:alldata[i].questionid
                    }
                }
                this.props.actions.getEveryQuestion({
                    body:newdata,
                    success:(data)=>{
                        let newData = [];
                        for(let i in data){
                            newData.push((data[i].data)[0])
                        }
                        console.log("hahahahahhaha---33333333-->>>>",newData)
                            this.setState({
                                questionListOfKnowledge:newData,
                                knowledgeId:knowledgeId,
                                Pending:false
                            },()=>{
                                this.addEvent();//为每一个空添加事件
                            })
                    },
                    error:(message)=>{
                        console.log(message)
                    }
                })
            },
            error:(message)=>{
                console.log(message)
            }
        })
    }
    addEvent(){
        let _this = this;
        $(".knowledgeContent .practice").find('.div_input').each(function(i){
            let add_id='';
            add_id = "knowledge-"+i;
            $(this).attr("id",add_id);
            $(this).on('click',function(event){
                _this.FocusHandle(this,add_id)
            })
        });
    }
    FocusHandle(e,add_id){
        let tar_id,top='',left='';
        if($(e)[0].localName == 'img'){
            tar_id= ($(e)[0].offsetParent);
        }else {
            tar_id = $(e)[0];
        }
        let positions = getCoords(tar_id);//获取当前点击的元素在页面中的位置
        top = (positions.top-40) + "px";
        left = (positions.left+50) + "px";
        $(tar_id).addClass("inputfoucs-style");
        this.setState({showEditor:true,position:[top,left],target_id:add_id})
    }
    exitBack(){
        this.props.closeKnowledge();
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        let allListDom = $('form').find('.practice');
        let arryList = [];
        let sentList={};
        allListDom.each(function (i) {
            let answer='';
            let isture = true;
            let questiondata = ($(this).attr('data')).split(',');//获取试题的答案数组，第一个为类型，第二个是正确答案
            if(questiondata[0] == '选择题'){
                answer = $(this).find('ul p input:checked').val();
                if(questiondata[1] != answer){
                    isture = false;
                }
                arryList.push({
                    "type":'选择题',
                    "answer":answer,
                    "isTure":isture
                })
            }else {
                let mysrc = '';
                let divInput = $(this).find('.div_input');
                divInput.each(function(ii){
                    let questionanswer = questiondata[1].split('||');//有多个空的时候判断每一个空的答案
                    if($(this).children('img').length>0){//先查找公式编辑器输入的内容即用编辑器输入的会产生一个img标签，没有则直接查text
                        mysrc = $(this).find('img')[0].src;
                        answer = $(this).find('img')[0].dataset.latex;
                    }else{
                        answer = $(this).text().trim();
                    }
                    if(answer != questionanswer[ii]){//判断答案，只要有一个是错误的则此题为错误的
                        isture = false;
                    }
                })
                arryList.push({
                    "type":'填空题',
                    "answer":answer,
                    "isTure":isture
                })
            }
            console.log(answer);
        })
        sentList = {
            "knowledgeName":this.state.knowledgeName,
            "knowledgeId":this.state.knowledgeId,
            "questionId":this.state.questionId,
            "examPaperId":this.state.examPaperId,
            "userId":Storage_S.getItem('userid'),
            "infoList":arryList
        }
        console.log("arryList===>>>",sentList);
        this.props.actions.sentKnowledgeForQuestionInfo({
            body:sentList,
            success:(data)=>{
                console.log("提交成功！")
            },
            errror:(mes)=>{console.error(mes)}
        })
    }
    getKnowledge(e){
        console.log($(e.target)[0].innerText)
        let knowledge = $(e.target)[0].innerText;
        this.setState({DialogMaskFlag2:true,knowledgeName:knowledge})
    }
    closeKnowledgeBox(){
        UE.delEditor('knowledgeContainer');
        this.setState({DialogMaskFlag2:false})
    }
    onchangehandle(answer){
        console.log("onchangehandle=====>>::::::::::>>>>>>",answer,this.choice)
    }
    _QuestionContent(data){
        if(data.length<1){return <div className="center">没有找到对应的数据。。。。</div>}
        return data.map((item,index)=>{
            let content = item.content;
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                let qqq =  '<span class="div_input" contenteditable="true"></span>';
                content = content.replace(/#blank#|#BLANK#/g,qqq);
            }
            let questionanswer = [item.questiontemplate,(item.answer).trim()];
            return(
                <div key={index} className="practice" data={questionanswer}>
                    <div className="typeName">{"【"+(item.questiontemplate.replace(/\s/,'').substr(0,1))+"】"}</div>
                    <ul>
                        <li>
                            <div dangerouslySetInnerHTML={{__html:content}}></div>
                        </li>
                        {item.questiontemplate == "选择题" ?<MultipleChoice template="noRender" type={item.questiontype} answer="" changeSave={this.onchangehandle.bind(this)}  index={index} choiceList={item.optionselect} />:''}
                    </ul>
                </div>
            )
        })
    }
    render(){
        let {questionListOfKnowledge,Pending} = this.state;
        return(
            <div className="knowledgeContent">
                <MathJaxEditor position={this.state.position} editorId="knowledgeContainer" target_id={this.state.target_id} showEditor={this.state.showEditor}/>
                <form onSubmit={this.handleSubmit}>
                    {Pending ? <Loading tip="loading" size="large" /> : this._QuestionContent(questionListOfKnowledge)}
                    <div className="submitBtn"><button type="submit" className="btn btn-primary submit_btn">提交</button></div>
                </form>
                {/*!this.state.DialogMaskFlag2?"":<DialogMask title={this.state.knowledgeName} position={[20,20]} id="1" closeDialog={()=>this.closeKnowledgeBox()}><Knowledge2 knowledgeName={this.state.knowledgeName} /></DialogMask>*/}
            </div>
        )
    }
}
Knowledge.propTypes = {
    knowledgeName:PropTypes.string,//知识点名
    knowledgeId:PropTypes.string,//知识ID号
    questionId:PropTypes.string,//知识所属试题的ID号
    examPaperId:PropTypes.string,//知识所属试卷的ID号
}
function mapStateToProps(state, ownProps) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getKnowledgeIdList,sentKnowledgeForQuestionInfo,getEveryQuestion}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Knowledge)

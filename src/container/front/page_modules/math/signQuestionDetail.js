/**
 * 单个试题的展示页面，即试题详情页面
 * Created by gaoju on 2017/11/29.
 */
import React,{Component} from 'react'
import './question_style.css'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push,goBack } from 'react-router-redux'
import {getQuestion,getContentOfChildItems,getContentOfChildItemsForQues} from '../../../../redux/actions/math'
import MultipleChoice from '../../../../components/multipleChoice/index'
import { Menu, Icon,Button,Tooltip } from 'antd'


class SignQuestion extends Component{
    constructor(props){
        super(props);
        let activeId = window.location.hash.split('/')[window.location.hash.split('/').length-1];//当前页面的id
        this.state={
            activeId:activeId,
            dataAll:[],
            observeContent:[],
            reviewContent:[],
            analysisContent:[],
            explainContent:[]
        }
    }
    componentDidMount(){
        this.props.actions.getQuestion({body:[{id:this.state.activeId}],
            success:(data)=>{
                if(data[0].code == 200){
                    console.log("getQuestion===========>",data)
                    //this.getChildData((data[0].data)[0].childsid)
                    this.setState({dataAll:data[0].data})
                }
            }})
    }
    getChildData(data){
        for(let ii in data){
            let type = data[ii].parttype;
            let quesid = data[ii].itemid;
            console.log(type,quesid)
            if(type != 'Exercise1' && type != 'Exercise2'){
                this.props.actions.getContentOfChildItems({
                    body:[{id : quesid}],
                    success:(data)=>{
                        if(data[0].code == 200){
                            let dataArray=[];
                            for(let i=0;i<(data[0].data).length;i++){
                                dataArray.push({id:(data[0].data)[i].itemid})
                            }
                            this.props.actions.getContentOfChildItemsForQues({
                                body:dataArray,
                                success:(data)=>{
                                    if(data[0].code == 200){
                                        if(type == 'Objective'){
                                            this.setState({observeContent:data[0].data});
                                        }else if(type == 'Review'){
                                            this.setState({reviewContent:data[0].data});
                                        } else if(type == 'Analysis'){
                                            this.setState({analysisContent:data[0].data});
                                        }else if(type == 'Explain'){
                                            this.setState({explainContent:data[0].data});
                                        }
                                    }else {
                                        console.error(data[0].message)
                                    }
                                },
                                error:(err)=>{console.error(err)}
                            })
                        }else {
                            console.error(data[0].message)
                        }
                    },
                    error:(err)=>{console.error(err)}
                })
            }
        }

    }
    exitBack(){
        this.props.actions.goBack()
    }
    _childsList(data){
        return data.map(function(item,index){
            return <li key={index} dangerouslySetInnerHTML={{__html:item.content}}></li>
        })
    }
    _contentQtxt(data){
        let content = data[0].content;
        let questiontype = data[0].questiontemplate;
        let childs = data[0].childs;
        let observe = this.state.observeContent;
        let review = this.state.reviewContent;
        let analysis = this.state.analysisContent;
        let explain = this.state.explainContent;
        console.log("题目的四个部分：：",observe,review,analysis,explain)
        if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
            content = content.replace(/<u>blank<\/u>|blank|BLANK/g,'<span class="div_input"></span>')
        }
        return (
            <div className="questionDetail">
                <ul>
                    <li dangerouslySetInnerHTML={{__html:content}}></li>
                    {questiontype == "选择题" ?<MultipleChoice type={data[0].questiontype} answer='' index={0} choiceList={data[0].optionselect} />:''}
                    {childs.length<1?"":this._childsList(childs)}
                </ul>
                <ul>答案：<li dangerouslySetInnerHTML={{__html:data[0].answer}}></li></ul>
                <ul>{observe.length>0 ?<li dangerouslySetInnerHTML={{__html:observe[0].content}}></li>:''}</ul>
                <ul>{review.length>0 ?<li dangerouslySetInnerHTML={{__html:review[0].content}}></li>:''}</ul>
                <ul>{analysis.length>0 ?<li dangerouslySetInnerHTML={{__html:analysis[0].content}}></li>:''}</ul>
                <ul>{explain.length>0 ? <li dangerouslySetInnerHTML={{__html:explain[0].content}}></li>:''}</ul>
            </div>
        )
    }
    render(){
        if((this.state.dataAll).length<1) return (<div />);
        return(
            <div className="mask">
                <div className="math-question-content">
                    <div className="exit" onClick={()=>this.exitBack(this)}><button type="button" className="btn btn-default">返回</button></div>
                    <section className="QtxtContent">
                        <div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt(this.state.dataAll)}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,goBack,getQuestion,getContentOfChildItems,getContentOfChildItemsForQues}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignQuestion)

/**
 * 全部试题列表页面
 * Created by gaoju on 2017/11/23.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import PureRenderMixin from '../../../../method_public/pure-render'
import {getAllQuestionsList,getFirstDataOfPaper} from '../../../../redux/actions/math'
import {Storage_S} from '../../../../config'
import Preview from './preview'
import Analysis from './dataAnalysis.js'
import DialogMask from '../../../../components/Alter/dialogMask/dialogmask'
import { Button,Collapse } from 'antd';
import './style.css'
const Panel = Collapse.Panel;

function callback(key) {
    console.log(key);
}
class QuestionAll extends Component{
    constructor(props){
        super(props);
        this.state={
            quiz_again_status:false,//二测标志
            indexNum:0,
            showStatus:false,//模考为true,专题为false
            allList:[],
            previewFlag:false,
            previewData:'',
            DialogMaskFlag:false,
            dataAnalysisDate:''
        };
    }
    componentDidMount(){
        //用route的参数来判断是从那个页面进来，进而取对应页面数据和显示对应页面
        if(this.props.params.quesParam=="exams"){//模考试题
            this.props.actions.getAllQuestionsList({
                body:[{id:Storage_S.getItem('userid')}],
                success:(data)=>{
                    console.log("getAllQuestionsList=====>>>",data)
                    this.getDataOfFirst(data)
                },
                error:(message)=>{console.warn("数据错误")}
            });
        }else if(this.props.params.quesParam=="questions"){//专题
        }
    };
    getDataOfFirst(items){
        let olddata = items[0].data;
        var len = olddata.length;
        let i;
        var dataArray = [];
        let userid=Storage_S.getItem('userid')
        for(i=0;i<len;i++){
            dataArray.push({userid:userid,id:olddata[i].examid})
        }
        this.props.actions.getFirstDataOfPaper({
            body:dataArray,
            success:(data)=>{
                for(let i=0;i<data.length;i++){
                    if(data[i].data.length >0){//已经做过了一测
                        olddata[i].doneDetails =data[i];
                    }else {//没有做过一测或者没有做完一次
                        olddata[i].doneDetails ={"code":200,"data":[]};
                    }
                }
                console.log("getFirstDataOfPaper==2222===>>>",olddata)
                this.setState({showStatus:true, allList:olddata})
            },
            error:(mes)=>{console.error("数据获取失败")}
        })
    }
    /*试卷对应二测部分*/
    _renderShowExplain(data,index){
        return(
            <div id={"quizAgin"+index} className={(this.state.indexNum==index && this.state.quiz_again_status)?"transtionBefore transtionAfter":"transtionBefore"}>
                <div className="questionsAll-item-content">
                    <div className="title2 col-md-7"><p>{data.exampaper+"(此部分针对试题答题结果进行分析)"}</p></div>
                    <div className="btn_list col-md-5">
                        <Button type="dashed" className="marginr5" onClick={()=>this.expand_goto(data)}>开始训练</Button>
                        {/*<Button type="dashed" className="marginr5" onClick={()=>this.preview(data,'1')}>结果预览</Button>*/}
                        <Button type="dashed" className="marginr5">数据分析</Button>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
            )
    }
    /*真题试卷列表*/
    _renderQuestionPage(data){
        let pageSize = data.length;
        if (pageSize > 0) {
            return data.map(function(item,index){
                let doneFlag = false;
                let doneDetails = (item.doneDetails.data[0]);
                if(doneDetails){
                    if(doneDetails.IsDone == 'yes'){
                        doneFlag = true;
                    }
                }
                let doneTitle = doneFlag ?"（已做）":"（未做）";
                return(
                    <div key={index} className="questionsAll-item">
                        <div className="questionsAll-item-content">
                            <Collapse onChange={callback}>
                                <Panel header={item.exampaper+doneTitle} key="1">
                                    <div className="questionsAll-item-content-child row">
                                        <div className="col-md-4 title">摸 底</div>
                                        <div className="col-md-8 btn_list">
                                            {doneFlag?<span className="wancheng">已完成</span>:<span className="wancheng">未完成</span>}
                                            {doneFlag?<span className="wancheng">总分：{doneDetails.Score}</span>:""}
                                            {doneFlag?<span className="wancheng">批改状态：{doneDetails.markFlag}</span>:""}
                                            <Button type="dashed" className="bttn " onClick={()=>this.preview(item,doneFlag)}>结果预览</Button>
                                            <Button type="dashed" className="marginr5" onClick={()=>this.dataAnalysis(item)}>数据分析</Button>
                                            <Button type="dashed" className="bttn " onClick={()=>this.gotoPractice(item)}>开始</Button>
                                        </div>
                                    </div>
                                    <div className="questionsAll-item-content-child row">
                                        <div className="col-md-4 title">强 化</div>
                                        <div className="col-md-8 btn_list">
                                            <Button type="dashed" className="marginr5">数据分析</Button>
                                            <Button type="dashed" className="bttn " onClick={()=>this.expand_goto(item,index,doneFlag)}>开始</Button>
                                        </div>
                                    </div>
                                    <div className="questionsAll-item-content-child row">
                                        <div className="col-md-4 title">检 测</div>
                                        <div className="col-md-8 btn_list">
                                            <Button type="dashed" className="marginr5">数据分析</Button>
                                            <Button type="dashed" className="bttn " onClick={()=>this.practiceAgain(item)}>开始</Button>
                                        </div>
                                    </div>
                                    <div className="questionsAll-item-content-child row">
                                        <div className="col-md-4 title">拓 展</div>
                                        <div className="col-md-8 btn_list">
                                            <Button type="dashed" className="marginr5">数据分析</Button>
                                            <Button type="dashed" className="bttn" onClick={()=>this.practiceAgain(item)}>开始</Button>
                                        </div>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                        {/**
                         <div className="questionsAll-item-content">
                         <div className="col-md-5 title"><p>{item.exampaper}</p></div>
                         <div className="col-md-7 btn_list">
                         {doneFlag?<span className="wancheng">已完成</span>:<span className="wancheng">未完成</span>}
                         {doneFlag?<span className="wancheng">总分：{doneDetails.Score}</span>:""}
                         {doneFlag?<span className="wancheng">批改状态：{doneDetails.markFlag}</span>:""}
                            <Button type="dashed" className="bttn " onClick={()=>this.preview(item,"1")}>结果预览</Button>
                            <Button type="dashed" className="bttn " onClick={()=>this.gotoPractice(item)}>摸底</Button>
                            <Button type="dashed" className="bttn " onClick={()=>this.quizAgain(item,index,doneFlag)}>强化</Button>
                            <Button type="dashed" className="bttn " onClick={()=>this.practiceAgain(item,index)}>检测</Button>
                            <Button type="dashed" className="bttn " onClick={()=>this.practiceAgain(item,index)}>拓展</Button>
                            </div>
                            <div className="clearfix"></div>
                            </div>
                        */}
                        {this._renderShowExplain(item,index)}
                    </div>
                )
            },this);
        }
    }
    /*专题试卷列表*/
    _renderExamPage(data){
        return(
            <div>
                <div className="examAll-item">
                    <div className="title" onClick={()=>this.goThematicQuestion('one')}>知识点复习</div>
                </div>
                <div className="examAll-item">
                 <div className="title" onClick={()=>this.goThematicQuestion('two')}>专题复习</div>
                 </div>
            </div>
        )
    }
    goThematicQuestion(flag){
        this.props.actions.push(`/home/math/questions/${flag}`);
    }
    gotoPractice(data){
        let id = data.examid;
        Storage_S.setItem(id,JSON.stringify(data))
        this.props.actions.push(`/home/math/exams/practice/${id}`);
    }
    practiceAgain(){
        alert("此部分的试题是根据模块试卷结构知识点新出的试题，用来检测训练的效果")
    }
    quizAgain(data,index,flag){
        //判断本套试题有没有测试完成过，只有一测完成了才能二测
        if(flag){
            this.setState({
                quiz_again_status : !this.state.quiz_again_status,
                indexNum : index
            });
        }else{
            alert("你还没有做完本套试题一测，请先做完一测！")
        }
    }
    preview(data,flag){
        if(!flag){
            alert("您还没有做完本套试题,无法查看，请先做完试卷在查看！")
            return;
        }
        this.setState({previewFlag : true,previewData:data});
    }
    dataAnalysis(data){
        this.setState({DialogMaskFlag : true,dataAnalysisDate:data});
    }
    closeDialogMask(){
        console.log("closeDialogMask")
        this.setState({DialogMaskFlag : false});
    }
    closePreview(){
        this.setState({previewFlag : false});
    }
    expand_goto(data,index,flag){
        //判断本套试题有没有测试完成过，只有一测完成了才能二测
        if(!flag){
            alert("你还没有做完本套试题一测，请先做完一测！")
            return;
        }
        this.setState({
            quiz_again_status : !this.state.quiz_again_status,
            indexNum : index
        });
        let id = data.examid;
        Storage_S.setItem(id,JSON.stringify(data))
        this.props.actions.push(`/home/math/exams/question/${id}`);
    }
    render(){
        return(
            <div className="questionsAll">
                <header><h2>{this.state.showStatus?'模 考':'考纲复习'}</h2></header>
                <section>
                    {this.state.showStatus?this._renderQuestionPage(this.state.allList):this._renderExamPage(this.state.allList)}
                    {this.props.children}
                </section>
                {this.state.previewFlag?<Preview data={this.state.previewData} closePreview={()=>this.setState({previewFlag : false})} />:<div/>}
                {this.state.DialogMaskFlag?<DialogMask title="试题分析" closeDialog={()=>this.setState({DialogMaskFlag : false})}><Analysis data={this.state.dataAnalysisDate}/></DialogMask>:<div/>}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push, getAllQuestionsList ,getFirstDataOfPaper}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionAll)
/**
 * 二测试卷的批改页面（专门单独写）
 * Created by gaoju on 2018/6/29.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon,Button,Modal } from 'antd'
// redux
import { bindActionCreators } from 'redux'
import PureRenderMixin from '../../method_public/pure-render'
import { connect } from 'react-redux'
import { push,goBack } from 'react-router-redux'
import {getAllChildOfQuestion,getChildQuestionsForQuestion,getContentOfChildItems,getContentOfChildItemsForQues,getQuestion} from '../../redux/actions/math'
import {updateMarkExamInfo,getDataOfPaper} from '../../redux/actions/teacher'
import {Pagination} from '../../components/pagination'
import MyCollapse from '../../components/collapse/index'
import MultipleChoice from '../../components/multipleChoice/index'
import UpLoadFile from '../../components/upload/index'
import * as Modals from '../../method_public/antd-modal'
import {Storage_S} from '../../config'

const sectionParts = ["观察部分试题","考点部分试题","分析部分试题","解析部分试题","巩固练习部分试题","拓展练习部分试题"];
const sectionParts2 = ["Objective","Review","Analysis","Explain","Exercise1","Exercise2"];
var allDataOfItem={};
var num = 0;
class PaperDetail extends Component {
    constructor(props) {
        super(props)
        let name = this.props.params;
        this.state = {
            userid:name.userid||'',
            paperid:name.paperid||'',
            total:5,
            current: 0,//当前是第几题
            allQuestionetails:[],
            currentQuesData:[],
            allDataOfItem:[],//某个试题的所有部分的数据
            errorArray:[],
            previewVisible:false,
            examInfoID:'',//试卷唯一ID
            marktipsFlag:false,
            markTipsid:'',//批改按钮的id可以用来找到具体某一题
            nowAnalysisPart:'',
            previewImage:''
        };
    };
    componentDidMount(){
        let userid = this.state.userid;
        this.props.actions.getDataOfPaper({//获取测试考试试卷的做题结果
            body:{id: this.state.paperid},
            success:(data)=>{
                let dealData = (data[0].ExamResult).replace(/\\/g,"@&@")//json中有\的时候会出错
                let datajson = JSON.parse(dealData);
                let errorArray=[];//错误题号
                var ii=0;
                for(let ss in datajson){
                    if(datajson[ss] && datajson[ss]!= "null"){
                        if(datajson[ss].Contents.length>0){
                            if(!(datajson[ss].Contents[0].IsTrue)){//获取错题列表
                                errorArray[ii] =  Number(ss)+1;
                                ii = ii+1;
                            };
                        }
                    }else {
                        errorArray[ii] =  Number(ss)+1;
                        ii = ii+1;
                    }
                }
                console.log("--------------allQuestionetails------------------->>",datajson)
                console.log("--------------errorArray------------------->>",errorArray)
                this.getData(datajson[0],0)
                this.setState({
                    total:datajson.length,
                    errorArray:errorArray,
                    allQuestionetails:datajson,
                    current:0,
                    examInfoID:data[0].ExamInfoID,
                })
            },
            error:(message)=>{
                console.error(message)
            }
        })
    };
    getData(data,page){
        if(data){
            this.props.actions.getAllChildOfQuestion({
                body:[{id:data.QuesID}],
                success:(data)=>{
                    console.log("currentQuesData-------===---->>>",(data[0].data));
                    this.setState({
                        current: page+1,
                        currentQuesData:data[0].data
                    })
                    this.getAllDataOfChildItem()
                },
                error:(message)=>{console.error(message)}
            })
        }
    }
    getAllDataOfChildItem(){
        let typelist = ['Objective','Review','Analysis','Explain','Exercise1','Exercise2'];
        for(let i in typelist){
            this.onClickCallback(typelist[i]);
        }
    }
    onClickCallback(type) {
        let whichOne=[0,1];
        let list = this.state.currentQuesData;
        let childid = list[0].childsid;
        let childs = list[0].childs;//大题的问题
        whichOne = whichOne[0];//某个试题下的小题（解答题的小问）,默认没有
        if(childs.length >0){
            this.props.actions.getChildQuestionsForQuestion({
                body:[{id:childs[whichOne].questionid}],
                success:(data)=>{
                    childid =  childid.concat(data[0].data);
                    if(type == 'Exercise1' || type == 'Exercise2'){
                        this.getDateOfPractice(type,childid)
                    }else {
                        this.getDateOfAnalysis(type,childid)
                    }
                },
                error:(err)=>{console.error(err)}
            })
        }else {
            if(type == 'Exercise1' || type == 'Exercise2'){
                this.getDateOfPractice(type,childid)
            }else {
                this.getDateOfAnalysis(type,childid)
            }
        }
    }
    getDateOfAnalysis(type,alldata){
        for(let i=0;i<alldata.length;i++){
            if(alldata[i].parttype == type){//在返回值中查找对应部分的内容，有就查询数据
                this.props.actions.getContentOfChildItems({
                    body:[{id:alldata[i].itemid}],
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
                                        allDataOfItem[type] = data[0].data;
                                        if(Object.keys(allDataOfItem).length == 6){//表示所有的请求已经完毕
                                            this.setState({allDataOfItem:allDataOfItem});
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
    getDateOfPractice(type,data){//获取练习部分的试题
        let exerciseArray = [];
        for(let i=0;i<data.length;i++){
            if(data[i].parttype == type){//在返回值中查找对应部分的内容，有就查询数据
                exerciseArray.push({id:data[i].itemid})
            }
        }
        this.props.actions.getQuestion({
            body:exerciseArray,
            success:(data)=>{
                let newdata = [];
                if(data){
                    for (let i in data){
                        newdata[i] = (data[i].data)[0];
                    }
                }
                allDataOfItem[type] = newdata;
                if(Object.keys(allDataOfItem).length == 6){//表示所有的请求已经完毕
                    this.setState({allDataOfItem:allDataOfItem});
                }
            },
            error:(err)=>{console.error(err)}
        })
    }
    exitBack(){
        let _this = this;
        Modals.showConfirm("是否已经全部提交？", function () {
            let url = (_this.props.location.pathname).split('/');
            url = url.splice(0,url.length-3);
            let endurl = url.join('/');
            _this.props.actions.goBack()
        })
    }
    onChange = (page) => {
        console.log("page--",page);
        this.getData(this.state.allQuestionetails[page-1],page-1)
    }
    onClickOther(e){
        if(e.target.className != 'pigaiTips'){
            if(this.state.marktipsFlag){
                this.setState({marktipsFlag:false})
            }
        }
    }
    MarkTips(e){
        let target = e.target.id;
        console.log("MarkTips=====>>>>>>>>>>",target)
        this.setState({marktipsFlag:true,markTipsid:target})
    }
    submitMark(data){
        let markTipsid = this.state.markTipsid;
        let markTipsidList = markTipsid.split('-');//question-num-objective-index:['question','2','objective','0']
        console.log("markTipsidList=====>>>>>>>>>>",markTipsidList)
        if(data.length>0){
            let allquestiontails = this.state.allQuestionetails[this.state.current-1];
            if(markTipsidList[2] == 'main'){//主题干的批改
                allquestiontails.teacherMark = this.textarea.value;
                allquestiontails.score = this.markscore.value;
                allquestiontails.teacherMarkUrl = this.uploadcontent.getAttribute('data-value');
            }else{
                if(allquestiontails.hasOwnProperty('childs')){
                    allquestiontails.childs[0][markTipsidList[2]][markTipsidList[3]].teacherMark = this.textarea.value;
                    allquestiontails.childs[0][markTipsidList[2]][markTipsidList[3]].score = this.markscore.value;
                    allquestiontails.childs[0][markTipsidList[2]][markTipsidList[3]].teacherMarkUrl = this.uploadcontent.getAttribute('data-value');
                }
            }
            console.log(this.state.allQuestionetails[this.state.current-1])
            console.log(this.uploadcontent.getAttribute('data-value'))
        }
        this.setState({marktipsFlag:false})
    }
    submitAllQuestion(){
        let ExamResult = this.state.allQuestionetails;
        let allscore = 0;
        for(let i in ExamResult){
            allscore = allscore + Number(ExamResult[i].score);
        }
        let sentList={
            ExamInfoID:this.state.examInfoID,
            ExamResult:this.state.allQuestionetails,
            markFlag:"已批改",
            Score:allscore,
            marker:Storage_S.getItem("username")
        }
        this.props.actions.updateMarkExamInfo({
            body:{data:sentList},
            success:(data)=>{
                alert("提交成功！")
            },
            error:(message)=>{
                alert("提交出错！")
            }
        })
    }
    submitHandle(img_url){
        console.warn(img_url)
        this.uploadcontent.setAttribute('data-value',img_url)
    }
    _studentAnwser_Main(data){
        return (
            <div className="studentAnwser">
                <div className="studenttext">
                    <span>学生答案：</span>
                </div>
                {!(data && data.length>0)?"":<div>
                    <span dangerouslySetInnerHTML={{__html:data[0].content}}></span>
                    {!(data[0].url)?"":<div className="studentimg">
                        <img width="260px" src={data[0].url}/>
                        <div className="chakan" onClick={()=>{this.setState({previewVisible: true,previewImage:data[0].url})}}>查看</div>
                    </div>}
                    <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible: false})}}>
                        <img alt="preview" style={{ width: '100%' }} src={this.state.previewImage} />
                    </Modal>
                </div>}
            </div>
        )
    }
    _studentAnwser_Child(list,type){
        if(!list){return}
        let data = list.content;
        return (
            <div className="studentAnwser">
                <div className="studenttext">
                    <span>学生答案：</span>
                </div>
                {data ? data.map((item,index)=>{
                    return (
                        <div key={index} style={{float:'left'}}>
                            <span>{item.answer}</span>
                            {!(item.url)?"":(
                                <div>
                                    <div className="studentimg">
                                        <img width="100px" src={item.url}/>
                                        <div className="chakan" onClick={()=>{this.setState({previewVisible: true,previewImage:data[0].url})}}>查看</div>
                                    </div>
                                    <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible: false})}}>
                                        <img alt="preview" style={{ width: '100%' }} src={this.state.previewImage} />
                                    </Modal>
                                </div>
                            )}
                            <span>；</span>
                        </div>
                    )
                },this):''}
                <div className="clearfix"></div>
            </div>
        )
    }
    _childsList(data){
        if(data.length>0){
            return data.map(function(item,index){
                return <li key={index} dangerouslySetInnerHTML={{__html:item.content}}></li>
            })
        }
    }
    _contentQtxt(data,current){
        if(!data){return ;}
        if(data.length<1){return ;}
        let items = data[0];
        let content = items.content;
        let questiontemplate = items.questiontemplate;
        let childs = items.childs;
        let questionType=false;
        //选择题的时候要处理返回的选项格式
        if(questiontemplate == '选择题'){
            questionType = true;
        }
        let oldanswer = this.state.allQuestionetails[current-1].Contents ;//做过一次的数据
        if(content){
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/\_|\s/g,"");
                let qqq =  '<span class="div_input"></span>';
                content = content.replace(/blank|BLANK/g,qqq);
            }
            return (
                <div>
                    <div className="displayflex QtxtContent_main_title">
                        <div className="QtxtContent_main_title_left">{questiontemplate}：{"（本题15分）"}</div>
                    </div>
                    <div>
                        <ul id="mainTopic" style={{padding:"8px 0"}}>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            {questionType?<MultipleChoice type={items.questiontype} answer={oldanswer[0].content} isCando="false" index={"MainContent"+current} choiceList={items.optionselect} />:''}
                            {childs.length<1?"":this._childsList(childs)}
                            <li><strong>正确答案：</strong><span dangerouslySetInnerHTML={{__html:items.answer}}></span></li>
                            {questionType?"":this._studentAnwser_Main(oldanswer)}
                        </ul>
                        {items.isobjective == '主观' ? <div className="pigaiTips" id={'question-'+current+'-main'} onClick={(e)=>{this.MarkTips(e)}}>批改</div>:''}
                        <div className="clearfix"></div>
                    </div>
                </div>
            )
        }
    }
    _partQuestionContent(data,type){
        if(data){
            let partlist = data[type];
            let oldAnswer =[];
            let current = this.state.current;
            if(this.state.allQuestionetails[current-1]){
                if((this.state.allQuestionetails[current-1].childs)){
                    oldAnswer = (this.state.allQuestionetails[current-1].childs[0])[type];
                }
            }
            if(partlist && partlist.length>0){
                return partlist.map((item,index)=>{
                    let content = item.content;
                    let questionType = '';
                    let childs = item.childs ? item.childs :[];
                    let oldanswer = oldAnswer[index] ? oldAnswer[index]:null;//学生的答案

                    if(item.questiontemplate == '选择题'){
                        questionType = true;
                    }
                    if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                        content = content.replace(/\_|\s/g,"");
                        let qqq =  '<span class="div_input"></span>';
                        content = content.replace(/blank|BLANK/g,qqq);
                    }
                    return(
                        <div key={index} className="erveryQuestion">
                            <ul>
                                <li dangerouslySetInnerHTML={{__html:content}}></li>
                                {item.questiontemplate == '选择题'?<MultipleChoice type={item.questiontype} isCando="false" answer={oldanswer?(oldanswer.content[0]).answer:''} index={type+"-"+index} choiceList={item.optionselect} />:''}
                                {childs.length<1?"":this._childsList(childs)}
                                <li><strong>正确答案：</strong><span dangerouslySetInnerHTML={{__html:item.answer}}></span></li>
                                {questionType?"":this._studentAnwser_Child(oldanswer,type)}
                            </ul>
                            {item.isobjective == '主观' ? <div className="pigaiTips" id={'question-'+current+'-'+type+'-'+index} onClick={(e)=>{this.MarkTips(e)}}>批改</div>:''}
                        </div>
                    )
                },this)
            }
        }
    }
    render() {
        let currentQuesData =  this.state.currentQuesData;
        let current =  this.state.current;
        return (
            <div className="mask3 paperDetail">
                <div className="math-question-content" onClick={(e)=>this.onClickOther(e)}>
                    <header>
                        <div className="title" id="title">{"2018年中考题"+"（一测试卷）"}</div>
                        <div className="exit" >
                            <button type="button" className="btn btn-default" onClick={()=>this.submitAllQuestion()}>全部提交</button>
                            <button type="button" className="btn btn-default" onClick={()=>this.exitBack()}>退出</button>
                        </div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div className="Question_content">
                        <div className="pagination_all">
                            <div className="widthPrecent5 margint10">题号:</div>
                            <div className="padding0">
                                <Pagination total={this.state.total} current={current} errorList={this.state.errorArray}   onChange={this.onChange}/></div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <hr/>
                    <section>
                        <div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt(currentQuesData,current)}
                            </div>
                        </div>
                    </section>
                    <hr/>
                    <section>
                        <div className="childContent">
                            <MyCollapse title="观察部分试题">
                                {this._partQuestionContent(this.state.allDataOfItem,'Objective')}
                            </MyCollapse>
                            <MyCollapse title="考点部分试题">
                                {this._partQuestionContent(this.state.allDataOfItem,'Review')}
                            </MyCollapse>
                            <MyCollapse title="分析部分试题">
                                {this._partQuestionContent(this.state.allDataOfItem,'Analysis')}
                            </MyCollapse>
                            <MyCollapse title="解答部分试题">
                                {this._partQuestionContent(this.state.allDataOfItem,'Explain')}
                            </MyCollapse>
                            <MyCollapse title="巩固部分试题">
                                {this._partQuestionContent(this.state.allDataOfItem,'Exercise1')}
                            </MyCollapse>
                            <MyCollapse title="拓展部分试题">
                                {this._partQuestionContent(this.state.allDataOfItem,'Exercise2')}
                            </MyCollapse>
                        </div>
                    </section>
                </div>
                <div style={{display:"flex",justifyContent:"center"}}>
                    {!this.state.marktipsFlag?"":(
                        <div className="teacherMark">
                            <div className="makescore">
                                <label>打分:</label><input id="markscore" ref={(e)=>{this.markscore = e}} type="number" className="form-control markscore"/>
                            </div>
                            <div className="makecontent">
                                <span>评语:</span>
                                <textarea id="textarea" ref={(e)=>{this.textarea = e}} className="form-control" rows="3"></textarea>
                            </div>
                            <div className="uploadcontent" ref={(e)=>{this.uploadcontent = e}}>
                                <UpLoadFile preview="false" personFlag="0"  submitHandle={this.submitHandle.bind(this)} />
                            </div>
                            <div className="submit">
                                <Button type="primary" onClick={()=>{this.submitMark(currentQuesData)}}>提交</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,goBack,getDataOfPaper,getAllChildOfQuestion,updateMarkExamInfo,getChildQuestionsForQuestion,getContentOfChildItems,getContentOfChildItemsForQues,getQuestion}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaperDetail)

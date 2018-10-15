/**
 * 摸底考试试卷屁孩页面
 * Created by gaoju on 2018/6/26.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon,Button,Modal } from 'antd'
// redux
import { bindActionCreators } from 'redux'
import PureRenderMixin from '../../method_public/pure-render'
import { connect } from 'react-redux'
import { push,goBack } from 'react-router-redux'
import {getAllChildOfQuestion} from '../../redux/actions/math'
import {updateMarkExamInfo,getDataOfPaper,updateMarkQuestionInfo} from '../../redux/actions/teacher'
import {Pagination} from '../../components/pagination'
import UpLoadFile from '../../components/upload/index'
import MultipleChoice from '../../components/multipleChoice/index'
import * as Modals from '../../method_public/antd-modal'
import {Storage_S} from '../../config'

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
            errorArray:[],
            previewVisible:false,
            examInfoID:''//试卷唯一ID
        };
    };
    componentDidMount(){
        console.log(this.state.userid,this.state.paperid);
        let userid = this.state.userid;
        this.props.actions.getDataOfPaper({//获取最近一测考试的结果
            body:{id: this.state.paperid},
            success:(data)=>{
                console.log("getDataOfPaper------->>>----->>>>",data);
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
                    examInfoID:data[0].ExamInfoID
                })
            },
            error:(message)=>{
                console.error(message)
            }
        })
    };
    getData(data,page){
        let allQuestionetails = this.state.allQuestionetails[page];
        if(allQuestionetails){
            if(allQuestionetails.score){
                this.markscore.value = allQuestionetails.score;
            }
            if(allQuestionetails.teacherMark){
                this.textarea.value = allQuestionetails.teacherMark;
            }
            if(allQuestionetails.teacherMarkUrl){
                this.uploadcontent.setAttribute('data-value',allQuestionetails.teacherMarkUrl);
            }
        }
        if(data){
            this.props.actions.getAllChildOfQuestion({body:[{id:data.QuesID}],
                success:(data)=>{
                    console.log("currentQuesData-------===---->>>",(data[0].data));
                    this.setState({
                        current: page+1,
                        currentQuesData:data[0].data
                    })
                }})
        }
    }
    exitBack(){
        let _this = this;
        ///main/papers/paper/${activeName}/${id}
        Modals.showConfirm("是否已经全部提交？", function () {
            let url = (_this.props.location.pathname).split('/');
            //let tar = url.pop();
            url = url.splice(0,url.length-3);
            let endurl = url.join('/');
            //_this.props.actions.push(endurl);
            _this.props.actions.goBack()
        })
    }
    onChange = (page) => {
        console.log("page--",page);
        this.markscore.value = "";
        this.textarea.value = "";
        this.uploadcontent.setAttribute('data-value','');
        this.getData(this.state.allQuestionetails[page-1],page-1)
    }
    submitMark(data){
        if(data.length>0){
            if(this.markscore.value > data[0].totalpoints){
                alert("打分不能超过题目分数！");
                return
            }
            this.state.allQuestionetails[this.state.current-1].teacherMark = this.textarea.value;
            this.state.allQuestionetails[this.state.current-1].score = this.markscore.value;
            this.state.allQuestionetails[this.state.current-1].teacherMarkUrl = this.uploadcontent.getAttribute('data-value');
            console.log(this.state.allQuestionetails[this.state.current-1])
            console.log(this.uploadcontent.getAttribute('data-value'))
        }
    }
    submitAllQuestion(){
        let ExamResult = this.state.allQuestionetails;
        console.log("submitAllQuestion---=====---=======>>>>>>",ExamResult)
        let allscore = 0;
        for(let i in ExamResult){
            allscore = allscore + Number(ExamResult[i].score);
        }
        let sentList={
            ExamInfoID:this.state.examInfoID,
            ExamResult:ExamResult,
            markFlag:"已批改",
            Score:allscore,
            marker:Storage_S.getItem("username")
        }
        console.log(sentList)
        this.props.actions.updateMarkExamInfo({
            body:{data:sentList},
            success:(data)=>{
                alert("提交成功！")
            },
            error:(message)=>{
                alert("提交出错！")
            }
        })
        this.props.actions.updateMarkQuestionInfo({
            body:{data:sentList},
            success:(data)=>{
                alert("提交成功！aaaaaaaa")
            },
            error:(message)=>{
                alert("提交出错！aaaaaaaaa")
            }
        })
    }
    submitHandle(img_url){
        console.warn(img_url)
        this.uploadcontent.setAttribute('data-value',img_url)
    }
    _studentAnwser(data){
        console.log("_studentAnwser------------------->>>>>",data)
        return (
            <div className="studentAnwser">
                <div className="studenttext">
                    <span>学生答案：</span>
                </div>
                {!(data && data.length>0)?"":<div>
                    <span dangerouslySetInnerHTML={{__html:data[0].content}}></span>
                    {!(data[0].url)?"":<div className="studentimg">
                        <img width="260px" src={data[0].url}/>
                        <div className="chakan" onClick={()=>{this.setState({previewVisible: true})}}>查看</div>
                    </div>}
                    <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible: false})}}>
                        <img alt="preview" style={{ width: '100%' }} src={data[0].url} />
                    </Modal>
                </div>}
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
    _contentQtxt(data,index){
        console.log("_contentQtext------||||||\\\\//////--------------------->>>>>",data)
        let items = data[0];
        let content = items.content;
        let questiontemplate = items.questiontemplate;
        let childs = items.childs;
        let questionType=false;
        //选择题的时候要处理返回的选项格式
        if(questiontemplate == '选择题'){
            questionType = true;
        }
        let oldanswer = this.state.allQuestionetails[index-1].Contents ;//做过一次的数据
        if(content){
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/\_|\s/g,"");
                let qqq =  '<span class="div_input"></span>';
                content = content.replace(/blank|BLANK/g,qqq);
            }
            return (
                <div>
                    <div className="displayflex QtxtContent_main_title">
                        <div className="QtxtContent_main_title_left">{questiontemplate}：{"（本题"+items.totalpoints+"分）"}</div>
                    </div>
                    <div>
                        <ul id="mainTopic" style={{padding:"8px 0"}}>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            {questionType?<MultipleChoice type={items.questiontype} answer={oldanswer[0].content} isCando="false" index={index} choiceList={items.optionselect} />:''}
                            {childs.length<1?"":this._childsList(childs)}
                            {questionType?"":this._studentAnwser(oldanswer)}
                        </ul>
                    </div>
                </div>
            )
        }
    }
    render() {
        let currentQuesData =  this.state.currentQuesData;
        if(currentQuesData.length<1){
            return <div/>
        }
        return (
            <div className="mask3 paperDetail">
                <div className="math-question-content">
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
                                <Pagination total={this.state.total} current={this.state.current} errorList={this.state.errorArray}   onChange={this.onChange}/></div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <hr/>
                    <section>
                        <div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt(currentQuesData,this.state.current)}
                            </div>
                        </div>
                    </section>
                    <hr/>
                    <section style={{display:"flex",justifyContent:"center"}}>
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
                    </section>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,goBack,getDataOfPaper,getAllChildOfQuestion,updateMarkExamInfo,updateMarkQuestionInfo}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaperDetail)

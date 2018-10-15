/**
 * Created by gaoju on 2018/7/13.
 */
import React,{Component} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList,getQuestion} from '../../../../redux/actions/math'
import ShowMask from '../../../../components/Alter/showMask'
import {Button,Modal,Collapse,Row,Col} from 'antd'
const Panel = Collapse.Panel;

const customPanelStyle = {
    background: 'rgb(238, 236, 236)',
    fontSize:14,
    borderRadius: 4,
    border: 0,
    overflow: 'hidden',
};
class PaperDetail extends Component{
    constructor(props){
        super(props)
        let alldata = props.data;
        let questionDetails = (alldata.ExamResult).replace(/\\/g,"@&@");
        this.state={
            questionDetails:JSON.parse(questionDetails),
            paperId:alldata.ExamPaperID,//某套题的试卷id，可取到某套试题的所有数据
            paperAllData:alldata,
            paper_title:alldata.ExamPaperTitle,//试卷标题
            questions:[],//每道试题的详情
            previewVisible:false,
            previewUrl:''
        }
    }
    componentDidMount(){
        this.props.actions.getQuestionList({
            body:[{id:this.state.paperId}],
            success:(data)=>{
                let all_question = data[0].data;//解析JSON
                this.getData(all_question)
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
    }
    getData(data){
        var dataArray=[];
        for(let i=0;i<data.length;i++){
            dataArray.push({id:data[i].questionid})
        }
        this.props.actions.getQuestion({
            body:dataArray,
            success:(data)=>{
                let details = this.state.questionDetails;
                for(let i in data){
                    data[i].details =details[i];
                }
                this.setState({questions:data})
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
    }
    handlePreview(url){
        this.setState({
            previewVisible: true,
            previewUrl: url
        });
    }
    _childsList(data){
        return data.map(function(item,index){
            return <li key={index} dangerouslySetInnerHTML={{__html:item.content}}></li>
        })
    }
    _doAndAnswer(data,index){
        let imgurl =data.Contents[0].url?data.Contents[0].url:"";
        return (
            <div>
                <div>解：__</div>
                <div>附件(提交的答案)：
                    <img className="preview_img" src={imgurl}/><span onClick={()=>this.handlePreview(imgurl)}>查看</span>
                </div>
            </div>
        )
    }
    _showQuestionList(data){
        return data.map(function(item,index){
            let detail = item.details;
            let newitem = item.data[0];
            let content = (newitem.content);
            let options = newitem.optionselect;
            let childs = newitem.childs;
            $.trim(options);//去掉前后的空格
            let ss = options.replace(/["\[\]]/g,"");
            let optionArray = ss.split(",");
            var base = new Base64();//base64对象
            let detailFlag = true;
            let answerFlag = '';
            if(detail && detail.Contents.length>0){
                detailFlag = (detail.Contents[0]).IsTrue;
                answerFlag = (detail.Contents[0]).content;
            }
            if(content){
                if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                    content = content.replace(/<u>blank<\/u>|blank|BLANK|#blank#|#BLANK#/g, `<span style="text-decoration:underline; ">${answerFlag}</span>`);
                }
                return(
                    <div key={index} className={detailFlag?'question-css':'question-css-err'}>
                        {detailFlag?'':<img style={{width:'20px',position:'absolute',left:'5px'}} src="public/images/error.png"/>}
                        <ul>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            <li>
                                { optionArray.length<4 ? "":<p>
                                    <label className="checkbox-inline">
                                        <span className={answerFlag=='A' ? 'question-answer-2':'question-answer-1'}>(A)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[0])}}></span></label>
                                    <label className="checkbox-inline">
                                        <span className={answerFlag=='B' ? 'question-answer-2':'question-answer-1'}>(B)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[1])}}></span></label>
                                    <label className="checkbox-inline">
                                        <span className={answerFlag=='C' ? 'question-answer-2':'question-answer-1'}>(C)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[2])}}></span></label>
                                    <label className="checkbox-inline">
                                        <span className={answerFlag=='D' ? 'question-answer-2':'question-answer-1'}>(D)</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[3])}}></span></label>
                                </p>}
                            </li>
                            {childs.length<1?"":this._childsList(childs)}
                            {newitem.questiontemplate == '简答题' ? this._doAndAnswer(detail,index) :''}
                            <Collapse bordered={false} style={{margin:0}}>
                                <Panel header="试题解析详情" key="1" style={customPanelStyle}>
                                    <Row>
                                        <Col span={3}>正确答案：</Col>
                                        <Col span={21}><p dangerouslySetInnerHTML={{__html:newitem.answer}}></p></Col></Row>
                                    <Row>
                                        <Col span={3}>知识点：</Col>
                                        <Col span={21}><p>{newitem.knowledge}</p></Col></Row>
                                </Panel>
                            </Collapse>
                        </ul>
                    </div>
                )
            }
        },this)
    }
    render(){
        let {paperAllData,questions,previewVisible, previewUrl } = this.state;
        if(questions.length<1){
            return <div/>;
        }
        console.log("paperAllData-------->>>>",paperAllData)
        console.log("questions-------->>>>",questions)
        return(
            <div>
                <ShowMask></ShowMask>
                <div className="Preview-content">
                    <Button className="exit" onClick={this.props.closePreview}>退出</Button>
                    <div className="Preview_header">
                        <div className="title">{paperAllData.ExamPaperTitle}</div>
                        <div className="second-title">
                            <div>总分: 120</div>
                            <div>难度: 中等</div>
                        </div>
                        {paperAllData.ExamType == '一测' ? <div className="examPaperScore">{paperAllData.Score+'分'}</div> : ''}
                    </div>
                    <section>
                        {this._showQuestionList(questions)}
                        <Modal visible={previewVisible} footer={null} onCancel={()=>this.setState({previewVisible: false})}>
                            <img alt="preview" style={{ width: '100%' }} src={previewUrl} />
                        </Modal>
                    </section>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({getQuestionList,getQuestion}, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(PaperDetail)
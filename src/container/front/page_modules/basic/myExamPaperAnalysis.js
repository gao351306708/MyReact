/**
 * 图表分析做题情况
 * Created by gaoju on 2018/8/7.
 */
import React,{Component} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList,getQuestion} from '../../../../redux/actions/math'
import DialodMask from '../../../../components/Alter/dialogMask/dialogmask'
import {Button,Table,Tabs } from 'antd'
import echarts from 'echarts'
import {TableDataMap1,TableDataMap2,TableDataMap3,Pie1} from './config'

const TabPane = Tabs.TabPane;
var newQustionTableData1 = TableDataMap1.dataSource;
var newQustionTableData2 = TableDataMap2.dataSource;
var newQustionTableData3 = TableDataMap3.dataSource;
class ExamPaperAnalysis extends Component{
    constructor(props){
        super(props)
        let alldata = props.data;
        let questionDetails = (alldata.ExamResult).replace(/\\/g,"@&@");
        this.state={
            alldata:alldata,
            questionDetails:JSON.parse(questionDetails) || [],
            qustionTableData1:newQustionTableData1,
            qustionTableData2:newQustionTableData2,
            qustionTableData3:newQustionTableData3
        }
    }
    componentDidMount(){
        console.log("componentDidMount==========>",this.state.questionDetails);
        let {qustionTableData1} = this.state;
        let data2 = [];
        let data3 = [];
        let questionDetails = this.state.questionDetails;
        let singleQuestionNum = 0,singleQuestionErrorNum={num:0,option:''};
        let tianKongQuestionNum = 0,tianKongQuestionErrorNum = {num:0,option:''};
        let jianDaQuestionNum = 0,jianDaQuestionErrorNum = {num:0,option:''};
        let knowledge = [];//知识点提取
        if(questionDetails.length>0){
            for(let i in questionDetails){
                let j = Number(i) + 1;
                data2.push({
                    key: i,
                    questionNum: j,
                    knowledge: questionDetails[i].knowledge,
                    difficulty:questionDetails[i].difficulty,
                    isOrRight: questionDetails[i].score ==0 ? '×':'√'
                });
                if(questionDetails[i].QuesType == '选择题'){
                    singleQuestionNum = singleQuestionNum + 1;
                    if(questionDetails[i].score == 0){
                        singleQuestionErrorNum.num = singleQuestionErrorNum.num + 1;
                        singleQuestionErrorNum.option = singleQuestionErrorNum.option + j +',';
                    }
                }else if(questionDetails[i].QuesType == '填空题'){
                    tianKongQuestionNum = tianKongQuestionNum + 1;
                    if(questionDetails[i].score == 0){
                        tianKongQuestionErrorNum.num = tianKongQuestionErrorNum.num + 1;
                        tianKongQuestionErrorNum.option = tianKongQuestionErrorNum.option + j +',';
                    }
                }else if(questionDetails[i].QuesType == '简答题'){
                    jianDaQuestionNum = jianDaQuestionNum + 1;
                    if(questionDetails[i].score == 0){
                        jianDaQuestionErrorNum.num = jianDaQuestionErrorNum.num + 1;
                        jianDaQuestionErrorNum.option = jianDaQuestionErrorNum.option + j +',';
                    }
                }
                if(questionDetails[i].knowledge){
                    let item = (questionDetails[i].knowledge).split('；');
                    let istrue = questionDetails[i].isOrRight;//对错
                    let number = istrue?0:1;
                    for(let j=0;j<item.length;j++){
                        if(knowledge.length>0){//存在
                            let ishave = false;//默认此知识点没有在knowledge中
                            for(let m=0;m<knowledge.length;m++){
                                if(knowledge[m].name == item[j] ){//knowledge中有这个知识点
                                    knowledge[m].num = knowledge[m].num + number;
                                    ishave = true;
                                }
                            }
                            if(!ishave){
                                knowledge.push({"name":item[j],"num":1,"errorNum":number})
                            }

                        }else {
                            knowledge.push({"name":item[j],"num":1,"errorNum":number});
                        }

                    }
                }
            }
        }
        qustionTableData1[0].num = singleQuestionNum;
        qustionTableData1[0].errorNum = singleQuestionErrorNum.num+" ("+singleQuestionErrorNum.option+")";
        qustionTableData1[0].percent = ((1-(singleQuestionErrorNum.num/singleQuestionNum))*100).toFixed(2)+'%';
        qustionTableData1[1].num = tianKongQuestionNum;
        qustionTableData1[1].errorNum = tianKongQuestionErrorNum.num+" ("+tianKongQuestionErrorNum.option+")";
        qustionTableData1[1].percent = ((1-(tianKongQuestionErrorNum.num/tianKongQuestionNum))*100).toFixed(2)+'%';
        qustionTableData1[2].num = jianDaQuestionNum;
        qustionTableData1[2].errorNum = jianDaQuestionErrorNum.num+" ("+jianDaQuestionErrorNum.option+")";
        qustionTableData1[2].percent = ((1-(jianDaQuestionErrorNum.num/jianDaQuestionNum))*100).toFixed(2)+'%';
        for(let i=0;i<knowledge.length;i++){
            data3.push({
                key: i,
                knowledge: knowledge[i].name,
                num: knowledge[i].num,
                errorNum:knowledge[i].errorNum,
                percent: ((1-(knowledge[i].errorNum/knowledge[i].num))*100).toFixed(2)+'%'
            } )
        }
        console.log("knowledge====>>>>",knowledge,data3)
        //实例化echart
        var pieChartOne = echarts.init(this.pieOne);
        pieChartOne.setOption(Pie1({
            singleQuestionNum:singleQuestionNum,
            tianKongQuestionNum:tianKongQuestionNum,
            jianDaQuestionNum:jianDaQuestionNum
        }));
        this.setState({qustionTableData3:data3,qustionTableData2:data2})
    }
    callback(key) {
        console.log(key);
    }
    render(){
        return(
            <div className="dataAnalysis">
                <div className="section">
                    <div className="part-one" ref={(e)=>this.pieOne=e}></div>
                    <div className="part-two">
                        <h4><strong>试题对错</strong></h4>
                        <Table dataSource={this.state.qustionTableData1}
                               columns={TableDataMap1.columns}
                               bordered={true}
                               pagination={{position: 'none'}}>
                        </Table>
                    </div>
                </div>
                <div className="section">
                    <Tabs onChange={this.callback} type="card">
                        <TabPane tab="试题详情" key="1">
                            <div className="part-three">
                                <Table dataSource={this.state.qustionTableData2}
                                       columns={TableDataMap2.columns}
                                       bordered={true}
                                       size="small"
                                       pagination={{position: 'none',pageSize:100}}
                                >
                                </Table>
                            </div>
                        </TabPane>
                        <TabPane tab="知识点掌握统计" key="2">
                            <div className="part-three">
                                <Table dataSource={this.state.qustionTableData3}
                                       columns={TableDataMap3.columns}
                                       bordered={true}
                                       size="small"
                                       pagination={{position: 'none',pageSize:100}}
                                >
                                </Table>
                            </div>
                        </TabPane>
                    </Tabs>
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
export default connect(mapStateToProps, mapDispatchToProps)(ExamPaperAnalysis)
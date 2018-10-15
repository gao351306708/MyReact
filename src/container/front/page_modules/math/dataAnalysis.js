/**
 * 试卷做题数据图标分析
 * Created by gaoju on 2018/7/2.
 */
import React,{Component} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getQuestionList,getQuestion} from '../../../../redux/actions/math'
import DialodMask from '../../../../components/Alter/dialogMask/dialogmask'
import {Button} from 'antd'
//import echarts from 'echarts'
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

class Analysis extends Component{
    constructor(props){
        super(props)
        let alldata = props.data;
        let questionDetails = [];
        if((alldata.doneDetails.data).length > 0){
            let midData = (alldata.doneDetails.data[0].ExamResult).replace(/\\/g,"@&@");
            questionDetails = JSON.parse(midData);
        }
        this.state={
            alldata:alldata,
            questionDetails:questionDetails || []
        }
    }
    componentDidMount(){
        let questionDetails = this.state.questionDetails;
        let singleQuestionNum = 0;
        let tianKongQuestionNum = 0;
        let jianDaQuestionNum = 0;
        let knowledge = [];//知识点
        if(questionDetails.length>0){
            for(let i in questionDetails){
                if(questionDetails[i].QuesType == '选择题'){
                    singleQuestionNum = singleQuestionNum + 1;
                }else if(questionDetails[i].QuesType == '填空题'){
                    tianKongQuestionNum = tianKongQuestionNum + 1;
                }else if(questionDetails[i].QuesType == '简答题'){
                    jianDaQuestionNum = jianDaQuestionNum + 1;
                }
                if(questionDetails[i].knowledge){
                    let item = (questionDetails[i].knowledge).split('；');
                    console.log("questionDetails[i].knowledge====>>>",item)
                    let istrue = questionDetails[i].Contents[0].IsTrue;//对错
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
        console.log("knowledge====>>>>",knowledge)
        var xDataName = [];//柱状X轴知识点名
        var xDataNameNum = [];//柱状X轴知识点出现次数
        var xDataNameErrorNum = [];//柱状X轴知识点出现次数
        if(knowledge.length>0){
            for(let i in knowledge){
                xDataName.push(knowledge[i].name);
                xDataNameNum.push(knowledge[i].num);
                xDataNameErrorNum.push(knowledge[i].errorNum)
            }
        }
        console.log("xDataName====>>>>",xDataName,xDataNameNum);
        var pieChartOne = echarts.init(this.pieOne);
        var pieChartTwo = echarts.init(this.pieTwo);
        //var pieChartThree = echarts.init(this.pieThree);
        pieChartOne.setOption({
            title: {
                text: '试卷结构'
            },
            legend: {
                data: ['选择题','填空题','简答题']
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}:{c}个 ({d}%)',//tooltip显示格式。自定义
            },
            series: [{
                name: 'pie',
                type: 'pie',
                selectedMode: 'single',
                selectedOffset: 0,
                data:[
                    {value: singleQuestionNum, name: '选择题',
                        label: {
                            normal: {
                                position: 'inside',
                                formatter : '{d}%'
                            }
                        }
                    },
                    {value: tianKongQuestionNum, name: '填空题',
                        label: {
                            normal: {
                                position: 'inside',
                                formatter : '{d}%'
                            }
                        }
                    },
                    {value: jianDaQuestionNum, name: '简答题',
                        label: {
                            normal: {
                                position: 'inside',
                                formatter : '{d}%'
                            }
                        }
                    }
                ]
            }]
        });
        pieChartTwo.setOption({
            title: {
                text: '知识点分布'
            },
            tooltip: {},
            xAxis: {
                name:'知识点',
                data: xDataName
            },
            yAxis: {
                axisTick: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                name:'出现次数',
                data: [0,1,2,3,4,5]
            },
            series: [{
                name: '出现次数',
                type: 'bar',
                data: xDataNameNum
            },{
                name: '错误次数',
                type: 'bar',
                data: xDataNameErrorNum
            }]
        });
    }
    shouldComponentUpdate(nextProps,nextState){
        return true;
    }
    _showQuestionList(data){
        console.log(data)
    }
    render(){
        return(
            <div className="dataAnalysis">
                <div className="part-one" ref={(e)=>this.pieOne=e}></div>
                <div className="part-two" ref={(e)=>this.pieTwo=e}></div>
                <div className="part-three" ref={(e)=>this.pieThree=e}></div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Analysis)
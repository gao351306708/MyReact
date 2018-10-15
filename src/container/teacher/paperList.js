/**
 * Created by gaoju on 2018/6/26.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon,Button } from 'antd'
// redux
import { bindActionCreators } from 'redux'
import PureRenderMixin from '../../method_public/pure-render'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {getAllPaperOfStudent } from '../../redux/actions/teacher'

class PaperList extends Component {
    constructor(props) {
        super(props)
        let name = this.props.params.userid;
        this.state = {
            activeName:name||'',//当前学生id
            paperAllList:[],//学生的所有试卷

        };
    };
    componentDidMount(){
        console.log("componentDidMount===>",this.state.activeName)
        this.getPaperList(this.state.activeName)
    };
    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps===>",nextProps.params.userid)
        if(nextProps.params.userid != this.state.activeName){
            console.log("componentWillReceiveProps===in",nextProps.params.userid)
            this.setState({activeName:nextProps.params.userid})
            this.getPaperList(nextProps.params.userid)
        }
    }
    shouldComponentUpdate(nextProps,nextState){
        console.log("shouldComponentUpdate===>",nextProps,nextState)
        return true
    }
    getPaperList(id){
        this.props.actions.getAllPaperOfStudent({
            body:{id:id},
            success:(data)=>{
                console.log("getAllPaperOfStudent---->>>>",data)
                if(data){
                    this.setState({paperAllList:data})
                }
            },
            error:(message)=>{
                this.setState({paperAllList:[]})
                console.warn(message)}
        });
    }
    gotoPaper(item){
        let activeName = this.state.activeName;
        let id  = item.ExamInfoID;
        let type = item.ExamType;
        //papers/paper/:userid/:paperid
        if(type == '二测'){
            this.props.actions.push(`/main/papers/paperTwo/${activeName}/${id}`)
        }else{
            this.props.actions.push(`/main/papers/paper/${activeName}/${id}`)
        }
    }
    render() {
        let paperAllList = this.state.paperAllList;
        if(paperAllList.length<1) {
            return (
                <div className="noData">^_^没有数据！！！</div>
            )
        }
        return (
            <div className="PaperList">
                {paperAllList.map((item,index)=> {
                    return (
                        <div key={index} className="listitem">
                            <div className="one"><h4>({index+1})、{item.ExamPaperTitle}--{item.ExamType}--{this.state.activeName}</h4></div>
                            <div className="two"><span>完成进度：{item.IsDone=='yes'?"已完成":"未完成"}</span><span>批改状态：{item.markFlag}</span>
                                {item.ExamType!='二测'?<span>得分：{item.Score}</span>:""}
                                <Button type="primary" size="small" onClick={()=>{this.gotoPaper(item)}}>开始批改</Button>
                            </div>
                        </div>
                    )
                },this)}
            </div>
        );
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,getAllPaperOfStudent}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaperList)

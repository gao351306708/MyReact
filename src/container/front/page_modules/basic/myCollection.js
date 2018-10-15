/**
 * 收藏试题页
 * Created by gaoju on 2017/12/12.
 */
import React,{Component} from 'react'
import './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { Link } from 'react-router'
import {getCollectInfo } from '../../../../redux/actions/user'
import { Collapse } from 'antd';
import {Storage_S} from '../../../../config'

const Panel = Collapse.Panel;
class Collect extends Component{
    constructor(props){
        super(props);
        this.state={
            collectList : []
        }
    }
    componentDidMount(){
        this.props.actions.getCollectInfo({body:{userid:Storage_S.getItem('userid')},
            success:(data)=>{
                this.setState({collectList:data})
            }
        });
    };
    _questionList(list){
        return list.map((item,index)=>{
            let url = '/home/math/questionDetail/'+item.questionid;
            return(
                <div key={index} className="collectAll_question">
                    <Link to={url}><p><span>{index+'、'}</span>{item.content}</p></Link>
                </div>
            )
        })
    }
    render(){
        let quesTypeX=[],quesTypeT=[],quesTypeJ=[],quesTypeQ=[],list = this.state.collectList;
        for(let ii in list){
            let type = list[ii].questiontype;
            switch (type){
                case '选择题': quesTypeX.push(list[ii]);
                    break;
                case '填空题': quesTypeT.push(list[ii]);
                    break;
                case '简答题': quesTypeJ.push(list[ii]);
                    break;
                default : quesTypeQ.push(list[ii]);
                    break;
            }
        }
        return(
            <div className="collectAll">
                <Collapse bordered={false}>
                    <Panel header={"选择题"+"("+quesTypeX.length+")"}>
                        {this._questionList(quesTypeX)}
                    </Panel>
                    <Panel header={"填空题"+"("+quesTypeT.length+")"}>
                        {this._questionList(quesTypeT)}
                    </Panel>
                    <Panel header={"简答题"+"("+quesTypeJ.length+")"}>
                        {this._questionList(quesTypeJ)}
                    </Panel>
                    <Panel header={"其他"+"("+quesTypeQ.length+")"}>
                        {this._questionList(quesTypeQ)}
                    </Panel>
                </Collapse>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push, getCollectInfo}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Collect)
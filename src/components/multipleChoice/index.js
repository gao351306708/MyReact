/**
 * 选择题(单选，多选)
 * Created by gaoju on 2018/4/16.
 */
import React,{Component} from 'react'
import './style.css'
import PropTypes from 'prop-types'

const base = new Base64();
const optionName=['A','B','C','D','E','F','G'];
class Choice extends Component{
    constructor(props){
        super(props)
        console.log("radioChange=1111=",props.isCando)
        this.state = {
            type:props.type,//选择类型。单选或者多选
            choiceList:props.choiceList,//选项
            index:props.index,
            radioState:props.answer || '',//答案
            isCando: props.isCando//是否可以选择答案
        }
    }
    radioChange =(e)=>{
        let isCando = this.state.isCando;
        console.log("radioChange===>>>>>",e.target.type,e.target.name)
        if(isCando != "false"){
            let endstr = '',tar = e.target.value;
            if(e.target.type == 'checkbox'){
                if((this.state.radioState).split('').indexOf(tar) != -1){
                    endstr = this.state.radioState.replace(eval("/"+tar+"/"),"");
                }else {
                    endstr = this.state.radioState + tar;
                }
                this.setState({radioState: endstr})
            }else {
                this.setState({radioState: tar})
            }
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.template != 'noRender'){
            if(nextProps.answer != this.state.radioState){
                this.setState({radioState: nextProps.answer})
            }
        }
    }
    shouldComponentUpdate(nextProps,nextState){
        return true;
    }
    render(){
        let optionArray=[],option = this.props.choiceList,type = this.props.type;
        let ss = ($.trim(option)).replace(/["\[\]\s]/g,"");
        let answer = this.state.radioState;
        if(answer){//多选题
            answer = answer.split('');
        }
        optionArray = ss.split(",");
        const optionList = (length)=>{
            const list = [];
            for(let i=0;i<length;i++){
                list.push(<label className="checkbox-inline optionsCss" key={i}>
                    <input type={type == '单选题'?'radio':'checkbox'} checked={(answer.indexOf(optionName[i]) != -1)?true:false}
                           onChange={this.radioChange} value={optionName[i]} name={"Selects"+this.props.index} />
                    <span className="marginl5 marginr5">{optionName[i]+"、"}</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[i])}}></span>
                    </label>)
            }
            return list;
        }
        return(
                <li>
                    <p>{optionArray.length>1?optionList(optionArray.length):''}</p>
                </li>
        )
    }
}
Choice.propTypes = {
    type:PropTypes.string,//选择类型。单选或者多选
    choiceList:PropTypes.string,//选项
    index:PropTypes.number,//编号
    radioState:PropTypes.string || '',//答案
    isCando: PropTypes.bool//是否可以选择答案
}
export default Choice
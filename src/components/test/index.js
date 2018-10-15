/**
 * Created by gaoju on 2017/12/21.
 */
import React,{Component} from 'react'
import './style.css'
import {Pagination,Pagination2} from '../pagination'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {WINDOW_HOST} from '../../config'
import {FormulaEditor,MathJaxEditor} from '../editer/index'
import {upload} from '../../redux/actions/upload'
import {beforeUpload} from '../../method_public/public'
import { message,Icon } from 'antd'
import InputDiv from '../input/input_Div'
import MultipleChoice from '../multipleChoice/index'
import SelectMenu from '../selectMenu/selectMenu'
import {getQuestionList,getQuestion} from '../../redux/actions/math'

class Test extends Component{
    constructor(props){
        super(props)
        this.state={
            imageURL: '',
            showEditor:true,
            target_id:'',
            position:[],
            content:'',
            current:1
        }
    }
    componentDidMount(){
        //this.props.actions.getQuestionList({
        //    body:{
        //        paperid : [{id:'a635f4e3-3e24-48a4-91c7-938468e01fe9'}]
        //    },
        //    success:(data)=>{
        //        console.log("getQuestionList----preview-->",data)
        //        let all_question = data;//解析JSON
        //        this.getData(all_question)
        //    },
        //    error:(mes)=>{
        //        console.error('数据接收发生错误');
        //    }
        //})
        //this.addEventFuc2();
    }
    componentDidUpdate(prevProps,prevState){
        //完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
        this.addEventFuc2();//为填空题以及解答添加事件处理
    }
    addEventFuc2(){
        let _this = this;
        $(".skipText").each(function(i){
            console.log('skipText------>',$(this))
            $(this).append(<SelectMenu />)
        });
    }
    getData(data){
        var dataArray=[],idArray=[];
        for(let i=0;i<data.length;i++){
            idArray.push({id:data[i].questionid})
        }
        this.props.actions.getQuestion({
            body:{
                data : idArray
            },
            success:(data)=>{
                console.log("getQuestion--->",data)
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
        //console.log(dataArray)
    }
    focusHandle=(e)=>{
        let tar_id,top='',left='',id='';
        if($(e.target)[0].localName == 'img'){
           tar_id= ($(e.target)[0].offsetParent);
        }else {
            tar_id = $(e.target)[0];
        }
        top = (tar_id.offsetTop + tar_id.clientHeight + 2)+"px";
        left = (tar_id.offsetLeft)+"px";
        id=tar_id.id;
        console.log("11111",top,left,tar_id)
        this.setState({showEditor:true,position:[top,left],target_id:id})
    }
    upLoadSubmit = (e) =>{
        e.preventDefault();
        let file = this.uploadInput.files[0];
        if(beforeUpload(file)){
            const data = new FormData();
            data.append("file", file);
            data.append("username", '王大崔');
            this.props.actions.upload({
                body:{
                    method: 'POST',
                    body: data
                },
                callback:(data)=>{
                    message.success('上传成功！')
                    this.setState({ imageURL: `${WINDOW_HOST}/${data.file}` });
                }
            })
        }
    }
    deleteSubmit = (e) =>{
        e.preventDefault();
        let file = this.uploadInput;
        file.value = '';
        $('#preview').empty()
    }
    preview =()=>{
        let file = this.uploadInput.files[0];
        var img = new Image(), url = img.src = URL.createObjectURL(file);
        $(img).addClass("img-responsive");
        var $img = $(img);
        img.onload = function() {
            URL.revokeObjectURL(url);
            $('#preview').empty().append($img);
        }
    }
    closeHandle (flag){
        this.setState({showEditor:flag})
    }
    getEditContent(cont,dom,url){
        console.warn(cont,dom,url)
        $("#"+dom).text('').append(cont);
    }
    handleChange=(e)=>{
        console.error(e)
        this.setState({current:Number(e)})
    }
    addEventFuc(){
        let _this = this;
        $(".div_input").each(function(i){
            $(this).on('focus',function(){
                _this.FocusHandle(this,i)
            })
        });
    }
    FocusHandle(e,num){
        console.log("focused",e)
        let add_id = "answer"+this.state.current+num;
        $(e).addClass("inputfoucs-style");
        $(e).attr("id",add_id);
        this.setState({showEditor:true,target_id: add_id})
    }
    onFocusHandle(e){
        $('.div_input').each(function(){
            $(this).removeClass("inputfoucs-style")
        })
        $(this.refs[e.target.name]).addClass("inputfoucs-style")
        this.setState({showEditor:true,target_id:e.target.name})
    }
    divList(){
        /*<div style={{margin:"20px",border:"1px solid gray",minHeight:"100px",padding:"10px"}}>
            输入1：<div contentEditable="true" className="div_input"/>
            <div dangerouslySetInnerHTML={{__html:this.state.content}}></div>
            {this.state.showEditor?<FormulaEditor inputDom={this.state.target_id} editContent={this.getEditContent.bind(this)} closeHandle={this.closeHandle.bind(this)}/>:''}
        </div>*/
    }

    showhtml(record){

        var html = {__html:record};

        return <div dangerouslySetInnerHTML={html}></div> ;

    }
    render(){
        let optionselect= '[  "5pWw6L20",  "57ud5a+55YC8",  "55u45Y+N5pWw44CC"]';
        let str = "<p>1.如图，则点B表示的数为（）。 </p>∴∠A+∠B=__{@平行线的性质||直角坐标@},hahha@sdka___{@平行线的性质@}";
        let replacedText;
        str = str.replace(/\s/g,'');
        var regex=/\{\@(.+?)\@\}/g;
        //var result;
        //while((result=regex.exec(str))!=null)
        //    console.log(result[1],result);
        //replacedText = reactStringReplace(str,regex,(match,i)=>(
        //    <button className="skipText" key={match+i}></button>
        //));
        replacedText = str.replace(regex,'<span class="mustText">※</span>')
        console.log("str---------str---------->>>",replacedText);
        return(
            <div style={{padding:"20px"}}>
                <Pagination total={20} color="red"  current={this.state.current} onChange={this.handleChange.bind(this)}></Pagination>
                <Pagination2 total={12} arraylist={[5,5,0,4,8,0,10,8,10,12,13,15]} current={this.state.current} onChange={this.handleChange.bind(this)}></Pagination2>
                <button type="button" className="btn btn-primary" onClick={()=>{this.setState({current:Number(this.state.current+1)})}}>下一个</button>
                <br/>
                <div style={{margin:"20px",border:"1px solid gray",minHeight:"100px",padding:"10px"}}>
                    <form>
                        <input ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.preview} /><br/>
                        <div id="preview"></div>
                        <p>请再次确定上传的文件是否正确，上传后不能修改</p>
                        <button type="button" className="btn btn-default btn-sm" onClick={this.upLoadSubmit}>开始上传</button>
                        <button type="button" className="btn btn-default btn-sm" onClick={this.deleteSubmit}>删除</button>
                        <br/>
                    </form>
                </div>
                <div className="nothispart">没有此部分</div>
                <div id="div_input" data="" className="div_input" onClick={this.focusHandle}></div><br/>
                <div  id="div_input1" data="" className="div_input" onClick={this.focusHandle}></div>------
                <div  id="div_input2" data="" className="div_input" onClick={this.focusHandle}>123</div>
                <br/>
                <div dangerouslySetInnerHTML={{__html:replacedText}}></div><br/>
                <div>{replacedText}</div>
                <MultipleChoice type="单选题" index={'1'} choiceList={optionselect} />
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ push,getQuestionList,getQuestion, upload}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Test)
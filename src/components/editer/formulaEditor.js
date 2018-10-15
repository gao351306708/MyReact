/**
 * 自定义可拖动的编辑器
 * Created by gaoju on 2018/1/15.
 */
import React,{Component} from 'react'
import ReactDom from 'react-dom'
import Editor from 'react-umeditor'
import './style.css'
import {Icon} from 'antd'
import UpLoadFile from '../upload/index'

class FormulaEdit extends Component{
    constructor(props){
        super(props)
        this.state = {
            position:props.position,
            showEditor:props.showFlag || false,
            content: "",
            imgUrl:''
        }
    }
    componentDidMount(){
        //拖动效果
        setTimeout(this.drafting,1000)
    }
    drafting(){
        var div1 = document.getElementById("formulaDialog");
        div1.onmousedown = function(ev){
            var oevent = ev || event;
            var distanceX = oevent.clientX - div1.offsetLeft;
            var distanceY = oevent.clientY - div1.offsetTop;
            document.onmousemove = function(ev){
                var oevent = ev || event;
                div1.style.left = oevent.clientX - distanceX + 'px';
                div1.style.top = oevent.clientY - distanceY + 'px';
            };
            document.onmouseup = function(){
                document.onmousemove = null;
                document.onmouseup = null;
            };
            ;
        };
    }
    handleChange(content){
        this.setState({
            content: content
        })
    }
    getIcons(){
        //工具栏
        var icons = ['undo redo |','selectall','cleardoc','formula']
        return icons;
    }
    btnClick =(e)=>{
        let content = this.editor.getContent();
        let img_url = this.state.imgUrl;
        if(!this.props.inputDom) return alert("请点击要填写的输入框")
        this.props.editContent(content,this.props.inputDom,img_url)
    }
    callbackImgUrl(cont){
        console.log("imgUrl====>>>",cont)
        this.setState({imgUrl:cont})
    }
    render(){
        var icons = this.getIcons();
        return (
            <div id="formulaDialog" className="formDialog">
                <Icon type="close" className="marginl5" onClick={()=>this.props.closeHandle(false)}/>
                <Editor ref={(e)=>{this.editor = e}}
                        icons={icons}
                        defaultValue={this.state.content}
                        onChange={this.handleChange.bind(this)}
                />
                <UpLoadFile imgUrl={this.callbackImgUrl.bind(this)} submitHandle={this.btnClick.bind(this)}></UpLoadFile>
            </div>
        )
    }
}
export default FormulaEdit
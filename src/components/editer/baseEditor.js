/**
 * umeditor编辑器
 * Created by gaoju on 2018/1/10.
 */
import React,{Component} from 'react'
import Editor from 'react-umeditor'
import './style.css'
import {Icon} from 'antd'

class Edit extends Component{
    constructor(props){
        super(props)
        this.state = {
            content: props.content || ""
        }
    }
    handleChange(content){
        this.setState({
            content: content
        })
    }
    getIcons(){
        //工具栏
        var icons = [
            "undo redo | bold italic underline strikethrough fontborder emphasis | ",
            "superscript subscript | formula |",
            "insertorderedlist insertunorderedlist | selectall | ",
            "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
            "horizontal | spechars | inserttable"
        ]
        return icons;
    }
    render(){
        var icons = this.getIcons();
        return (
            <div>
                <Editor ref={(e)=>{this.editor = e}}
                 icons={icons}
                 defaultValue={this.state.content}
                 onChange={this.handleChange.bind(this)}
                 />
            </div>
        )
    }
}
export default Edit
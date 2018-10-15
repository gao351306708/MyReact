/**
 * mathjax公式编辑器
 * Created by gaoju on 2018/3/27.
 */
import React,{Component} from 'react'
import './style.css'

class MathJaxEditor extends Component{
    constructor(props){
        super(props)
        this.state={
            showEditor:props.showEditor||false,
            position:props.position,
            target_id:props.target_id,
            content:''
        }
        window.setLatexValue = this.setLatexValue.bind(this);//设置全局回调，子页面来调用
    }
    componentDidMount(){
        //编辑框
        let editorname = this.props.editorId;
        var ue = UE.getEditor(editorname, {
            toolbars: [['kityformula']],
            elementPathEnabled:false,
            wordCount:false
        });
        setTimeout(function(){
            $(".edui-editor-iframeholder").remove();
        },1000)
    }
    componentWillReceiveProps(nextProps){
        //this.props //当前的props,nextProps //下一阶段的props
        window.nowDom = nextProps.target_id;//当前聚焦的元素
    }
    setLatexValue(value,img){
        $("#"+window.nowDom).text("");
        $("#"+window.nowDom).attr("data",value);
        $("#"+window.nowDom).append(img);
        $("#"+window.nowDom).attr("contenteditable",false);
        //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);//重新渲染一遍
    }
    clearLatexValue(){
        $("#"+window.nowDom).text("");
        $("#"+window.nowDom).attr("data",'');
        $("#"+window.nowDom).attr("contenteditable",true)
        //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);//重新渲染一遍
    }
    render(){
        const displayCss=[{display:"inline-flex",top:this.props.position[0],left:this.props.position[1]},{display:"none"}];
        let editorid = this.props.editorId;
        console.log("editorid---1111111111------->",editorid)
        return(
            <div className="mathEditorTip" style={this.props.showEditor?displayCss[0]:displayCss[1]}>
                <div id={editorid} className="editorContainer" type="text/plain"></div>
                <div className="mathJaxClear" onClick={this.clearLatexValue}>清空</div>
            </div>
        )
    }
}
export default MathJaxEditor
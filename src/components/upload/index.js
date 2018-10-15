/**
 * Created by gaoju on 2018/1/18.
 */

import React,{Component} from 'react'
import './style.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {WINDOW_HOST} from '../../config'
import {beforeUpload} from '../../method_public/public'
import * as Modals from '../../method_public/antd-modal'
import {upload} from '../../redux/actions/upload'


class UpLoadFile extends Component{
    constructor(props){
        super(props)
        this.state={
            imageURL:"",
            preview:props.preview || 'true',//是否预显示,
            personFlag:props.personFlag || '1'//谁上传的： 教师、学生、管理员。。。。；教师为0，学生为1;默认为学生上传
        }
    }
    upLoadSubmit = (e) =>{
        e.preventDefault();
        let _this = this;
        console.log("upLoadSubmit=====>>>>>",this.state.personFlag)
        let file = _this.uploadInput.files[0];
        if(beforeUpload(file)){
            Modals.showConfirm("请再次确定上传的文件是否正确，上传后不能修改，确定是否提交？", function () {
                const data = new FormData();
                data.append("personflag", _this.state.personFlag);
                data.append("file", file);
                data.append("username", sessionStorage.getItem('username'));
                //data.append("preurl",_this.state.imageURL);//前一个上传的答案，如果从新上传一张则删除上传的前一张
                data.append("preurl",'');
                _this.props.actions.upload({
                    body:{
                        method: 'POST',
                        body: data
                    },
                    callback:(data)=>{
                        Modals.success('','上传成功！')
                        _this.deleteSubmit();
                        _this.setState({ imageURL: `${WINDOW_HOST}/${data.file}` });
                        setTimeout(()=>{
                            _this.props.submitHandle(_this.state.imageURL,_this.props.id);
                        },1000)
                    }
                })

            })
        }
    }
    deleteSubmit = () =>{
        let file = this.uploadInput;
        file.value = '';
        $('#preview').empty()
    }
    preview =()=>{
        let file = this.uploadInput.files[0];
        let img = new Image(), url = img.src = URL.createObjectURL(file);
        $(img).addClass("img-responsive");
        let $img = $(img);
        img.onload = function() {
            URL.revokeObjectURL(url);
            $('#preview').empty().append($img);
        }
        //<input id="exampleInputFile" ref={(ref) => { this.uploadInput = ref; }} type="file" width="200px" onChange={this.preview} /><br/>
    }
    render(){
        console.log("this.state.preview====>>>>>>",this.state.preview)
        return(
            <div className="fileupload">
                <form>
                    <label htmlFor="exampleInputFile">上传文件：</label>
                    <input id="exampleInputFile" ref={(ref) => { this.uploadInput = ref; }} type="file" width="200px" onChange={this.preview} /><br/>
                    {this.state.preview != 'false'?<div id="preview"></div>:''}
                    <button type="button" className="btn ant-btn-danger btn-sm" onClick={this.deleteSubmit}>删除</button>
                    <button type="button" className="btn btn-default btn-sm" onClick={this.upLoadSubmit}>开始上传</button>
                    <br/>
                </form>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({upload}, dispatch)
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(UpLoadFile)
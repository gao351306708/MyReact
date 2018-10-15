/**
 * 使用antd库 对话弹框
 * Created by gaoju on 2018/5/28.
 */
import {Modal,Button,message } from 'antd'
const confirm = Modal.confirm;

//全局 对话框
export function success(title,content){
    Modal.success({
        title: title,
        content: content
    });
}
export function error(title,content) {
    Modal.error({
        title: title,
        content: content
    });
}

export function warning(title,content) {
    Modal.warning({
        title: title,
        content: content
    });
}
export function showConfirm(content,callback) {
    confirm({
        content: content,
        onOk(){
            return callback();
        },
        onCancel(){
            return;
        }
    });
}

//message的全局配置
message.config({
    top: 100,
    maxCount: 3
});
export function messageSuccess(content,duration,callback) {
    return message.success(content,duration,callback);
}
export function messageError(content,duration,callback) {
    return message.error(content,duration,callback);
}
export function messageWarning(content,duration,callback) {
    return message.warning(content,duration,callback);
}
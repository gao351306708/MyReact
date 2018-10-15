/**
 * 老师信息模块action
 * Created by gaoju on 2017/11/15.
 */
import * as TYPES from '../types';
import * as CONFIG from '../../config';
import { request } from './request';
import { bodyUrlencoded } from '../../method_public/public'

//登录校验
export function login(opt) {
    return (dispatch) => {
        const route = '/api/teacher';//服务端数据
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//注册
export function teacherRegister(opt) {
    return (dispatch) => {
        const route = '/api/teacher/register';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//获取学生所有做的试卷
export function getAllPaperOfStudent(opt){
    return (dispatch) => {
        const route = '/api/teacher/allPaperOfStudent';//服务端数据
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//获取一测试卷的做题详情
export function getDataOfPaper(opt) {
    return (dispatch) => {
        const route = '/api/teacher/dataOfPaper';
        request(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body:bodyUrlencoded(opt.body) })
    }
}
//上传试卷批改信息
export function updateMarkExamInfo(opt){
    return (dispatch) => {
        const route = '/api/teacher/updateMarkExamInfo';//服务端数据
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(opt.body.data)})
    }
}
//上传试题批改信息
export function updateMarkQuestionInfo(opt){
    return (dispatch) => {
        const route = '/api/teacher/updateMarkQuestionInfo';//服务端数据
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(opt.body.data)})
    }
}
/**
 * 用户信息模块action
 * Created by gaoju on 2017/11/15.
 */
import * as TYPES from '../types';
import * as CONFIG from '../../config';
import { request } from './request';
import { bodyUrlencoded } from '../../method_public/public'

//获取数据的方式先 全部使用 GET。用真实数据时使用POST方式----<<------看这里!!!------------
export function auth(opt) {
    return (dispatch) => {
        const route = `/api/page/auth`;
        request(route, {}, dispatch, opt.success, opt.error, { method: 'POST', headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: bodyUrlencoded(opt.body) })
    }
}
//获取所有用户
export function allUsers(opt) {
    return (dispatch) => {
        const route = '/api/user';//服务端数据
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'GET',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body:(opt.body) })
    }
}
//登录校验
export function login(opt) {
    return (dispatch) => {
        const route = '/api/user/token_name';//服务端数据
        //const route = 'src/data/userInfo.json';//本地数据
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//修改密码
export function changePassword(opt) {
    return (dispatch) => {
        const route = '/api/user/password';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//忘记密码
export function forgetPassword(opt) {
    return (dispatch) => {
        const route = '/api/user/password';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//注册
export function register(opt) {
    return (dispatch) => {
        const route = '/api/user/register';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
export function resetPassword(opt){
    return (dispatch) => {
        const route = '/api/user/resetPassword';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//获取用户基本信息
export function getUserBasicInfo(opt) {
    return (dispatch) => {
        const route = '/api/user/basic_info';
        //const route = 'src/data/userInfo.json';//用假数据时候需要修改 发送的方式。:get
        const success = (data) => {
            dispatch({ type: TYPES.USERBASICINFO_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route, {}, dispatch, success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//获取用户收藏的试题
export function getCollectInfo(opt) {
    return (dispatch) => {
        const route = '/api/user/getCollection';
        const success = (data) => {
            dispatch({ type: TYPES.USERCOLLECTINFO_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route, opt.params || {}, dispatch, success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//获取用户收藏的试题
export function getCollection(opt){
    return (dispatch) => {
        const route = '/api/user/getCollection';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//更新用户基本信息
export function updateUserInfo(opt) {
    return (dispatch) => {
        const route = '/api/user/updateBasicInfo';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//更新用户基本信息
export function updateHeadImg(opt) {
    return (dispatch) => {
        const route = '/api/user/updateHeadImg';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
/**
 * 前端网络请求数据
 * Created by gaoju on 2017/11/15.
 */

// fetch 需要使用 Promise 的 polyfill
import { pendingTask, begin, end } from 'react-redux-spinner'
import 'babel-polyfill'
import fetch from 'isomorphic-fetch'
import * as CONFIG from '../../config'
import * as TYPES from '../types'
import { bodyUrlencoded } from '../../method_public/public'

export function request(route, params, dispatch, success=null, error=null, { method='GET', headers={}, body=null }={}) {

    dispatch({type: TYPES.REQUEST_LOADING, [ pendingTask ]: begin})
    const p = params ? '?' + Object.entries(params).map((i) => `${i[0]}=${encodeURI(i[1])}`).join('&') : '';//处理get请求有参数的，转换参数形式
    const url = `${ CONFIG.API_URI }${ route }${ p }`;
    let data = { method: method, headers: headers}
    if (method !== 'GET'){
        data.body = ($.isEmptyObject(body)) ? {} : body.replace(/&nbsp;/g,'');
    }
    console.log(`[${method}]:${url}::${data}`,data)
    fetch(url, data)
        .then((response) => {
            dispatch({ type: TYPES.REQUEST_DONE, [ pendingTask ]: end})
            if (response.status === 200) {
                return response.json()
            } else {
                return { code: response.status }
            }
        })
        .then((res) => {
            if (res.code === 200) {
                if (method !== 'GET') dispatch({ type: TYPES.REQUEST_SUCCESS })
                success && success(res.data)
            } else {
                dispatch({ type: TYPES.REQUEST_ERROR, res })
                error && error(res.message)
            }
        })
        .catch((err) => {
            console.error(err)
            error(res)
        })
}
//g改装版 fetch数据请求，使用promise.all 模拟同步加载数据
export function requestSyn(route,params, dispatch, success=null, error=null, { method='GET', headers={}, body=null }={}) {
    //请求开始
    dispatch({type: TYPES.REQUEST_LOADING, [ pendingTask ]: begin})

    const p = params ? '?' + Object.entries(params).map((i) => `${i[0]}=${encodeURI(i[1])}`).join('&') : '';
    const url = `${ CONFIG.API_URI }${ route }${ p }`;
    let datalist = body;
    console.log("requestdatalist------>>>>>>",datalist)
    //使用promise的all方法将异步执行转化为同步执行，即查询的参数为一个数组列表，一个一个发送。当其中一个出错时则整体查询出错。
    Promise.all(datalist.map((list) =>{
        let data = { method: method,
                    headers: headers,
                    body:bodyUrlencoded(list)};

        //console.log(`[${method}]:${url}::${data}`,data);
        return fetch(url,data).then((response) => {
                    dispatch({ type: TYPES.REQUEST_DONE, [ pendingTask ]: end})
                    if (response.status === 200) {
                        return response.json()
                    } else {
                        return error && error(res.message)
                    }
                })
    }
    )).then((res) => {
        //console.log("respond===200=====>",res)
        if (res) {
            if (method !== 'GET') dispatch({ type: TYPES.REQUEST_SUCCESS })
            return success && success(res)
        } else {
            dispatch({ type: TYPES.REQUEST_ERROR, res })
            return error(res.message)
        }
    })
}
export function requestClean() {
    return { type: TYPES.REQUEST_CLEAN }
}
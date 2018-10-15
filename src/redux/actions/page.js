/**
 * Created by gaoju on 2017/11/15.
 */

import * as TYPES from '../types';
import { request } from './request';
import { bodyUrlencoded } from '../../method_public/public'

//首页展示列表
export function getHomeShowList(opt) {
    return (dispatch) => {
        const route = '/api/page/homelist';//服务器数据
        //const route = "src/data/home.json";//本地数据
        const success = (data) => {
            dispatch({ type: TYPES.HOMESHOW_LIST_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route,{},dispatch,success, opt.error)
    }
}
//首页展示列表
export function getProvinceList(opt) {
    return (dispatch) => {
        const route = '/api/provinceList';//服务器数据
        const success = (data) => {
            dispatch({ type: TYPES.Province_LIST_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route,{},dispatch,success, opt.error)
    }
}

export function cleanCurrentPage(opt) {
    return (dispatch) => {
        dispatch({ type: TYPES.PAGE_CLEAN_CURRENT})
    }
}
export function cleanHomeShowList(opt) {
    return (dispatch) => {
        dispatch({ type: TYPES.HOMESHOW_LIST_CLEAN })
    }
}
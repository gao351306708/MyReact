/**
 * Created by gaoju on 2017/12/6.
 */
import Immutable from 'immutable';
import * as TYPES from '../types'
import { createReducer } from 'redux-immutablejs'

//Immutable创建的对象数据是持久化，不变化的。只要新建的或者赋值都会产生新的数据对象
export const currentPage = createReducer(Immutable.fromJS({preload: false}), {
    [TYPES.PAGE_UPDATE_CURRENT]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))
    },
    [TYPES.PAGE_CLEAN_CURRENT]: (state, action) => {
        return state.clear().set('preload', false)
    },
})
export const homeShowList = createReducer(Immutable.fromJS({preload: false}), {
    [TYPES.HOMESHOW_LIST_UPDATA]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))
    },
    [TYPES.HOMESHOW_LIST_CLEAN]: (state, action) => {
        return state.clear().set('preload', false)
    }
});
export const provinceList = createReducer(Immutable.fromJS({preload:false}),{
    [TYPES.Province_LIST_UPDATA]:(state,action)=>{
        return state.set('preload',true).merge(Immutable.fromJS(action.result))
    },
    [TYPES.Province_LIST_CLEAN]: (state, action) => {
        return state.clear().set('preload', false)
    }
})
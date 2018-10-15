/**
 * Created by gaoju on 2018/5/28.
 */
import Immutable from 'immutable';
import * as TYPES from '../types'
import { createReducer } from 'redux-immutablejs'

//Immutable创建的对象数据是持久化，不变话的。只要新建的或者赋值都会产生新的数据对象
export const TimingFlag = createReducer(Immutable.fromJS({preload:false}),{
    [TYPES.SET_TIMING]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.result))
    },
    [TYPES.CLEAR_TIMING]: (state, action) => {
        return state.clear().set('preload', false).merge(Immutable.fromJS(action.result))
    }
})
export const PREROUTE = createReducer(Immutable.fromJS({preload:false}),{
    [TYPES.ADD_PREROUTE]: (state=[], action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.preRoute))
    },
    [TYPES.DEL_PREROUTE]: (state, action) => {
        return state.set('preload', true).merge(Immutable.fromJS(action.preRoute))
    }
})

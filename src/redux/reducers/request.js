/**网络请求每个阶段
 * Created by gaoju on 2017/12/6.
 */

import Immutable from 'immutable'
import * as TYPES from '../types'
import { createReducer } from 'redux-immutablejs'

export default createReducer(Immutable.fromJS({status: null, error: null}), {
    [TYPES.REQUEST_LOADING]: (state, action) => {
        return state.merge({
            status: 'loading',
        })
    },
    [TYPES.REQUEST_ERROR]: (state, action) => {
        return state.merge({
            status: 'error',
            code: action.code,
            error: Immutable.fromJS(action.error),
        })
    },
    [TYPES.REQUEST_CLEAN]: (state, action) => {
        return state.merge({
            status: null,
            error: null,
        })
    },
    [TYPES.REQUEST_SUCCESS]: (state, action) => {
        return state.merge({
            status: 'success',
            error: null,
        })
    }
})
/**
 * 中考学生系统入口
 * Created by gaoju on 2017/11/15.
 */
import React from 'react'
import { render } from 'react-dom'
import { Router, hashHistory } from 'react-router'
import routes from '../router/front'
// redux
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from '../redux/configureStore'


const store = configureStore(hashHistory)
const history = syncHistoryWithStore(hashHistory, store)
render(
    (
        <Provider store={store}>
            <Router history={history} routes={routes} />
        </Provider>
    ), document.getElementById('root')
)
/**
 * 中考教师系统入口
 * Created by gaoju on 2018/6/26.
 */
import React from 'react'
import { render } from 'react-dom'
import { Router, hashHistory } from 'react-router'
import routes from '../router/teacher'
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
    ), document.getElementById('teacherRoot')
)
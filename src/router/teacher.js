/**
 * 教师系统项目路由配置
 * Created by gaoju on 2017/11/15.
 */
import React from 'react'
import { Route } from 'react-router'

import Login from '../container/teacher/login'
import {isAdmin} from '../method_public/public'
import Main from '../container/teacher/main'
import Register from '../container/teacher/register'
import PaperList from '../container/teacher/paperList'
import PaperDetail from '../container/teacher/paperDetail'
import PaperDetailTwo from '../container/teacher/paperDetailTwo'

const requireAuth = (nextState, replace) => {
    if (!isAdmin()) {
        window.confirm("请登录！")
        replace({ pathname: '/' })
    }
}
const routes = (
    <Route>
        <Route path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/main" component={Main} onEnter={requireAuth} >
            <Route path="papers" component={PaperList} />
            <Route path="papers/:userid" component={PaperList} />
            <Route path="papers/paper/:userid/:paperid" component={PaperDetail} />
            <Route path="papers/paperTwo/:userid/:paperid" component={PaperDetailTwo} />
        </Route>
    </Route>
);

export default routes
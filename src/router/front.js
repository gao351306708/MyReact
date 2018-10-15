/**
 * 项目路由配置
 * Created by gaoju on 2017/11/15.
 */
import React from 'react'
import { Route } from 'react-router'

import Door from '../container/front/door'
import {isAdmin} from '../method_public/public'
import Home from '../container/front/home'
import Register from '../container/front/register'
import ForgotPassword from '../container/front/forgotpassword'
import Basic from '../container/front/page_modules/basic'
import Math from '../container/front/page_modules/math'
import ExciseTips from '../container/front/page_modules/exciseTips/index'
import BasicInfo from '../container/front/page_modules/basic/basicInfo'
import MyCollection from '../container/front/page_modules/basic/myCollection'
import MyExamPaper from '../container/front/page_modules/basic/myExamPaper'
import EchartsDetails from '../container/front/page_modules/basic/echartsDetails'
import ThematiceParts from '../container/front/page_modules/math/thematiceParts'
import Question from '../container/front/page_modules/math/question'
import Practice from '../container/front/page_modules/math/practice'
import ExamAllPaper from '../container/front/page_modules/math/exam'
import Chapter from  '../container/front/page_modules/math/thematicChapter'
import ChapterPart from  '../container/front/page_modules/math/thematicChapterPart'
import ExamPoint from  '../container/front/page_modules/math/thematicExamPoints'
import ThematicQuesList from  '../container/front/page_modules/math/thematicQuesList'
import QuestionDetail from '../container/front/page_modules/math/signQuestionDetail'
import Knowledge from '../container/front/page_modules/math/knowledge'
import Test from '../components/test/index'
import NoFound from '../container/front/nofound'

const requireAuth = (nextState, replace) => {
    if (!isAdmin()) {
        window.confirm("请登录！")
        replace({ pathname: '/' })
    }
}
const routes = (
    <Route>
        <Route path="/" component={Door} />
        <Route path="/register" component={Register} />
        <Route path="/forgotpassword" component={ForgotPassword} />
        <Route path="/home" component={Home} onEnter={requireAuth} >
            <Route path="basic" component={Basic} />
            <Route path="basic/basicInfo" component={BasicInfo}/>
            <Route path="basic/myCollection" component={MyCollection}/>
            <Route path="basic/echartsDetails" component={EchartsDetails}/>
            <Route path="basic/myExamPaper" component={MyExamPaper}/>
            <Route path="excisetip" component={ExciseTips}/>
            <Route path="math" component={Math}/>
            <Route path="math/thematiceParts" component={ThematiceParts}/>
            <Route path="math/thematiceParts/chapters" component={Chapter} />
            <Route path="math/thematiceParts/chapters/:num" component={ChapterPart} />
            <Route path="math/thematiceParts/exampoint" component={ExamPoint} />
            <Route path="math/thematiceParts/thematic" component={ThematicQuesList} />
            <Route path="math/exams" component={ExamAllPaper}/>
            <Route path="math/exams/question/:id" component={Question} />
            <Route path="math/exams/practice/:id" component={Practice} />
            <Route path="math/questionDetail/:id" component={QuestionDetail} />
            <Route path="math/knowledge/:name" component={Knowledge} />
        </Route>
        <Route path="/test" component={Test} />
        <Route path="*" component={NoFound} />
    </Route>
);

export default routes
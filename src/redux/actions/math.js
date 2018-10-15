/**
 * Created by gaoju on 2017/11/21.
 */
import { request,requestSyn } from './request';
import * as TYPES from '../types';
import * as CONFIG from '../../config';
import { bodyUrlencoded } from '../../method_public/public'

//获取所有练习试卷
export function getAllQuestionsList(opt) {
    return (dispatch) => {
        //const route = '../src/data/questions.json';//本地数据
        const route = '/api/math/allPapers';
        const success = (data) => {
            dispatch({ type: TYPES.ALLQUESTIONSLIST_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        //使用fetch发送数据时，headers格式如果是这种形式（默认）{"Content-Type": "application/x-www-form-urlencoded"}
        // 则body里面的参数格式应该为“a="paramsa&b=paramsb....."”
        console.log(opt.body);
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取某套练习试卷的所有试题（即：1-25道考试题题目）
export function getQuestionList(opt) {
    return (dispatch) => {
        //const route = '../src/data/ExamsData/JSON/'+opt.body.param;//本地数据
        const route = '/api/math/questionsOfPaper';
        const success = (data) => {
            dispatch({ type: TYPES.QUESTIONSLIST_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取某个主试题的信息
export function getQuestion(opt) {
    return (dispatch) => {
        //const route = 'src/data/ExamsData/JSON/Question/'+opt.param;//本地数据
        const route = '/api/math/question';
        const success = (data) => {
            dispatch({ type: TYPES.GETMAINQUESTION_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取某套试卷的所有关联的子题。所有！！！（子题下面的子题。。。）
export function getAllChildOfExam(opt) {
    return (dispatch) => {
        const route = '/api/math/getAllChildOfExam';
        request(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//获取某个知识点中所有的试题的详情:
export function getEveryQuestion(opt) {
    return (dispatch) => {
        //const route = 'src/data/ExamsData/JSON/Question/'+opt.param;//本地数据
        const route = '/api/math/everyQuestion';
        requestSyn(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取某个试题的所有子试题（即：主题，观察，考点，分析。。。），的所有内容详情，有多少查多少个
export function getAllChildDetailsOfQuestion(opt) {
    return (dispatch) => {
        const route = '/api/math/allChildDetailsOfQuestion';
        requestSyn(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取某个试题的所有子试题（即：主题，观察，考点，分析。。。）
export function getAllChildOfQuestion(opt) {
    return (dispatch) => {
        const route = '/api/math/allChildOfQuestion';
        const success = (data) => {
            dispatch({ type: TYPES.SECONDTESTQUESTIONS_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//查询二测中某个试题的子题内容（观察or分析or 。。。）,比如观察部分的题，有可能有多个题
export function getContentOfChildItems(opt) {
    return (dispatch) => {
        const route = '/api/math/contentOfChildItems';
        requestSyn(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//查询二测中某个试题的子题内容（观察or分析or 。。。）,比如观察部分多个题的题的详情
export function getContentOfChildItemsForQues(opt) {
    return (dispatch) => {
        const route = '/api/math/contentOfChildItemsForQues';
        const success = (data) => {
            dispatch({ type: TYPES.GETCONTENTOFCHILDQUES_UPDATA, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取某道大题的小问题的子题信息
export function getChildQuestionsForQuestion(opt) {
    return (dispatch) => {
        const route = '/api/math/childQuestionsForQuestion';
        requestSyn(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取一测试卷的做题详情
export function getFirstDataOfPaper(opt) {
    return (dispatch) => {
        const route = '/api/math/firstDataOfPaper';
        const success = (data) => {
            dispatch({ type: TYPES.GETFIRSTDATAOFPAPER, result: {items: data} })
            opt.success && opt.success(data)
        }
        requestSyn(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取一测试卷的做题详情
export function getSecendDataOfPaper(opt) {
    return (dispatch) => {
        const route = '/api/math/secendDataOfPaper';
        requestSyn(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取章节知识点目录结构
export function getAllKnowledgeOfChapter(opt){
    return (dispatch) => {
        const route = '/api/math/allKnowledgeOfChapter';
        request(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: (opt.body) })
    }
}
//获取知识点对应的试题,通过名字查找(默认用名字)
export function getKnowledgeIdList(opt) {
    return (dispatch) => {
        const route = '/api/math/knowledgeIdList';
        requestSyn(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//获取知识点对应的试题，通过Id查找
export function getKnowledgeIdListWithId(opt) {
    return (dispatch) => {
        const route = '/api/math/knowledgeIdListWithId';
        requestSyn(route,{},dispatch,opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}
//存储知识点做题的信息
export function sentKnowledgeForQuestionInfo(opt){
    let data = opt.body;
    return (dispatch)=>{
        const route = '/api/math/knowledgeForQuestionInfo';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(data)})
    }
}
//存储用户试卷的做题数据
export function sentUserPaperData(opt) {
    let data = opt.body.data;
    return (dispatch) => {
        const route = '/api/math/sentUserPaperData';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(data)})
    }
}
//存储用户试卷中每一个试题的做题数据
export function sentUserQuestionDataOfPaper(opt) {
    let data = opt.body.data;
    return (dispatch) => {
        const route = '/api/math/sentUserQuestionDataOfPaper';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(data)})
    }
}
//存储用户做专题时的某一个试题答案数据
export function setThematicQuestionAnswerInfo(opt){
    let data = opt.body;
    return (dispatch) => {
        const route = '/api/math/thematicQuestionAnswerInfo';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: bodyUrlencoded(data)})
    }
}
//收藏试卷或者试题
export function doSetCollection(opt){
    return (dispatch)=>{
        const route = '/api/math/setCollection';
        request(route, {}, dispatch, opt.success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodyUrlencoded(opt.body) })
    }
}
//获取所有真题模块训练的试题
export function getAllQuestionOfThematic(opt) {
    return (dispatch) => {
        const route = '/api/math/allQuestionOfThematic';//本地数据
        const success = (data) => {
            dispatch({ type: TYPES.ALLQUESTIONOFTHEMATIC_UPDATE, result: {items: data} })
            opt.success && opt.success(data)
        }
        request(route,{},dispatch,success, opt.error,
            { method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: opt.body })
    }
}

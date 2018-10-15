/**
 * Created by gaoju on 2018/9/13.
 */
import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import './question_style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import {getFirstDataOfPaper,getAllChildOfExam,getAllChildOfQuestion,getContentOfChildItems,getContentOfChildItemsForQues,getQuestion,getChildQuestionsForQuestion,doSetCollection,sentUserPaperData} from '../../../../redux/actions/math'
import {setPreRoute} from '../../../../redux/actions/public'
import {getCoords,compareDifferent} from '../../../../method_public/public'
import PureRenderMixin from '../../../../method_public/pure-render'
import SelectMenu from '../../../../components/selectMenu/selectMenu'
import NoThisPart from '../../../../components/defaultJPG/nothispart'
import {Storage_S,Storage_L} from '../../../../config'
import {EveryChildInfo} from '../../../../method_public/sentJson'
import moment from 'moment'
import {Menu, Icon,Button,Input,message } from 'antd'
import {Pagination,Pagination2} from '../../../../components/pagination'
import MultipleChoice from '../../../../components/multipleChoice/index'
import {BaseEditor,MathJaxEditor} from '../../../../components/editer'
import UpLoadFile from '../../../../components/upload/index'
import DialogMask from '../../../../components/Alter/dialogMask/dialogmask'
import Knowledge from './knowledge.js'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
var num = 0;
const rootSubmenuKeys = ['sub0','sub1', 'sub2', 'sub3','sub4'];
var everyChildInfo = JSON.stringify(EveryChildInfo);
var newChildList = JSON.parse(everyChildInfo);
var sentJson = {
    "ExamInfoID":"", "UserID":"", "ExamPaperID":"","ExamPaperTitle":"",
    "StartDate":null, "FinishDate":null, "SpendTime":0, "ExamType":"", "Score":0,
    "ExamResult":[],
    "DoExamInfo":[],
    "currentquesid":1,
    "AllDone":'no'
}
var autoKnowledgeList=[];//每个试题 分析部分 小题或填空题的 相关考点。用来自动弹出知识点复习框的
class Question extends Component{
    constructor(props){
        super(props);
        let activeId = window.location.hash.split('/')[window.location.hash.split('/').length-1];//当前页面的id
        let paperItems = JSON.parse(Storage_L.getItem(activeId+"-second"))//缓存中取出做题情况的对应数据
        this.state={
            collapsed: false,
            activeId:activeId,//试卷ID
            sentAllList: !paperItems? sentJson : paperItems,//组装答案列表，用来发送存储源数据
            allQuestionetails:[],//一测所有试题做题结果
            currentQuesData:[],//当前试题的所有内容
            analysisLeftContent:[],//当前试题的分析部分
            exerciseContent:[],//当前试题的练习部分
            current: !paperItems ? null : paperItems.currentquesid,//当前是第几题
            current1: !paperItems ? null : paperItems.currentquesid,
            current2:!paperItems ? null : paperItems.currentquesid,//错误题页码
            total:0,
            errorArray : [],//一测做错的题
            mainContent:true,//主题干显隐，展开true闭合false
            mainContentH:0,//主题干显隐高度
            two_answer_flag:false,//主题干显隐，展开true闭合false
            two_answer_content:'',
            //exerciseIndex:'',
            AnalysisMenu:'0',//分析解答中左侧menu
            AnalysisFlag:true,//分析解答
            nowAnalysisPart:'',//当前解析的是那一部分
            nowPart:'',//当前显示的是那一部分：解析，答案，巩固，拓展
            AnswerFlag:false,//标准答案
            Exercise1Flag:false,//巩固
            openKeys:['sub0'],
            radioState:'',
            showEditor:false,
            target_id:'',
            position:[],
            solution:false,
            DialogMaskFlag:false,
            knowledgeName:''
        }
    }
    componentDidMount(){
        sentJson.ExamInfoID = moment().format('x');//当前时间戳作为此次做题id
        sentJson.UserID =Storage_S.getItem('userid');
        sentJson.ExamPaperID = this.state.activeId;
        sentJson.StartDate = moment().format();
        sentJson.ExamType = "二测";
        sentJson.ExamPaperTitle = JSON.parse(Storage_S.getItem(this.state.activeId)).exampaper;
        this.props.actions.getFirstDataOfPaper({//获取最近一测考试的结果
            body:[{
                userid: Storage_S.getItem('userid'),
                id: this.state.activeId
            }],
            success:(data)=>{
                let datajson = JSON.parse((data[0].data)[0].ExamResult.replace(/\\/g,"@&@"));
                let errorArray=[];//错误题号
                var ii=0;
                for(let ss in datajson){
                    if(datajson[ss] && datajson[ss]!= "null"){
                        if(datajson[ss].Contents.length>0){
                            if(!(datajson[ss].Contents[0].IsTrue)){//获取错题列表
                                errorArray[ii] =  Number(ss)+1;
                                ii = ii+1;
                            };
                        }
                    }else {
                        errorArray[ii] =  Number(ss)+1;
                        ii = ii+1;
                    }
                }
                if(errorArray.length>0){
                    let nowNum = !this.state.current2 ? errorArray[0] : this.state.current2 ;
                    this.getData(datajson[nowNum-1],nowNum-1)
                    this.setState({
                        total:datajson.length,
                        errorArray:errorArray,
                        allQuestionetails:datajson,
                        current2: nowNum,
                        current: nowNum
                    })
                }else {
                    let nowNum = !this.state.current1 ? 1 : this.state.current1 ;
                    this.getData(datajson[nowNum-1],nowNum-1)
                    this.setState({
                        total:datajson.length,
                        errorArray:errorArray,
                        allQuestionetails:datajson,
                        current:nowNum,
                        current1:nowNum
                    })
                }
                this.props.actions.getAllChildOfExam({
                    body:{id : this.state.activeId},
                    success:(data)=>{
                        console.log("getAllChildOfExam--所有试题的信息->>>",data)
                    },
                    error:(mes)=>{console.error(mes)}
                })

            },
            error:(message)=>{
                console.error(message)
            }
        })
        //离开route的钩子处理事件
        //this.props.router.setRouteLeaveHook(
        //    this.props.route,
        //    this.routerWillLeave
        //)
    }
    shouldComponentUpdate(nextProps,nextState){
        //当切换题的时候如果新的数据还没有加载出来则不需要render
        if(this.state.current != nextState.current){
            if(this.state.currentQuesData == nextState.currentQuesData){
                return false;
            }
        }
        return true;
    }
    componentDidUpdate(prevProps,prevState){
        //完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
        if(prevState.analysisLeftContent != this.state.analysisLeftContent){
            this.addEventFuc();//为分析部分添加事件处理
        }
        if(prevState.currentQuesData != this.state.currentQuesData){
            this.addOldAnswer();//显示主题干一测试题的答案
        }
        if(prevState.nowAnalysisPart != this.state.nowAnalysisPart){
            this.addAnswer(this.state.nowAnalysisPart);//为填空题以及解答添加事件处理
        }
        if(prevState.mainContent != this.state.mainContent){
            let H = $('.QtxtContent_main').height();
            this.setState({mainContentH:H})
        }
    }
    routerWillLeave=(nextLocation)=> {
        // 返回 false 会继续停留当前页面，否则，返回一个字符串，会显示给用户，让其自己决定
        if(confirm('确认要离开？')){
            UE.delEditor('questionContainer');//退出的时候删除实例化的编辑器
            setTimeout(()=>{
                return true;
            },1000)
        }else {
            return false;
        }
    }
    requestQuestion(type,data){
        let childid = data[0].childsid;
        switch (type){
            case 'AnalyContent' :
                this.setState({AnalysisFlag:true, AnswerFlag:false, Exercise1Flag:false,mainContent:true,showEditor:false,nowPart:type});
                break;
            case 'Answer' :
                this.setState({AnalysisFlag:false, AnswerFlag:true, Exercise1Flag:false,mainContent:false,showEditor:false,nowPart:type});
                break;
            case 'Exercise1' :
                this.getDateOfPractice(type,childid);
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:true,mainContent:false,showEditor:false,nowPart:type});
                break;
            case 'Exercise2':
                this.getDateOfPractice(type,childid);
                this.setState({AnalysisFlag:false, AnswerFlag:false, Exercise1Flag:true,mainContent:false,showEditor:false,nowPart:type});
                break;
            default: break;
        }

    }
    handleClick = (e) =>{
        let type = e.key, whichOne=(e.keyPath[1]);
        let list = this.state.currentQuesData;
        let childid = list[0].childsid;
        let childs = list[0].childs;//大题的问题
        whichOne = whichOne?whichOne.replace(/sub/g,''):whichOne;//某个试题下的小题（解答题的小问）
        console.warn(whichOne,type,childid,childs)
        if(childs.length >0){//简答题有小问的话 每个小问有对应的解析、考点、观察、解答四个部分
            this.props.actions.getChildQuestionsForQuestion({
                body:[{id:childs[whichOne].questionid}],
                success:(data)=>{
                    childid =  childid.concat(data[0].data)
                    this.toGetPartData(type,childid)
                },
                error:(err)=>{console.error(err)}
            })
        }else {
            this.toGetPartData(type,childid)
        }
    }
    toGetPartData(type,childid){
        switch (type){
            case 'observe' :
                this.getDateOfAnalysis('Objective',childid);
                break;
            case 'analysis' :
                this.getDateOfAnalysis('Analysis',childid);
                break;
            case 'review' :
                this.getDateOfAnalysis('Review',childid);
                break;
            case 'answer':
                this.getDateOfAnalysis('Explain',childid);
                break;
            default: break;
        }
    }
    addOldAnswer(){
        let _this = this;
        let oldcontent = this.state.sentAllList.ExamResult[this.state.current-1];//做过一次的数据
        let oldanswer = (oldcontent && (oldcontent.Contents).length>0) ? oldcontent.Contents: this.state.allQuestionetails[this.state.current-1].Contents;
        $("#Content_Qtxt").find('.div_input').each(function(i){
            let add_id = "question"+_this.state.current+i;
            if(oldanswer[i]){
                if(oldanswer[i].url){//有图片的话,添加img
                    $(this).append('<img src='+oldanswer[i].url+' data-latex='+oldanswer[i].content+'/>');
                }else{
                    $(this).text(oldanswer[i].content);
                }
            }
            $(this).attr("id",add_id);
            $(this).on('click',function(event){
                if(_this.state.solution){
                    _this.FocusHandle(this,add_id)
                }
            })
        });
    }
    addEventFuc(type){
        let _this = this;
        $('.mustText').on('click',function(e){
            _this.getKnowledge(e);
        });
        $("#Analysis_Qtxt").find('.div_input').each(function(i){
            let add_id='';
            add_id = "answer-"+_this.state.current+"-"+_this.state.nowAnalysisPart+"-"+i;
            $(this).attr("id",add_id);
            $(this).on('click',function(event){
                _this.FocusHandle(this,add_id)
            })
        });
    }
    addAnswer(type){
        let childsLen = this.state.sentAllList.ExamResult[this.state.current-1];
        let ddd = !childsLen ? '':childsLen.childs[0][type];
        $(".analysisContent").each(function(ii){
            $(this).find('.div_input').each(function(i){
                if(ddd && ddd.length>0){
                    let answers = ddd[ii].content[i];
                    if(answers){
                        if(answers.url){//有图片的话,添加img
                            $(this).append('<img src='+answers.url+' data-latex='+answers.content+'/>');
                        }else{
                            $(this).text(answers.answer);
                        }
                    }else{
                        $(this).text(answers.answer);
                    }
                }
            })
        })
    }
    FocusHandle(e,add_id){
        let tar_id,top='',left='';
        if($(e)[0].localName == 'img'){
            tar_id= ($(e)[0].offsetParent);
        }else {
            tar_id = $(e)[0];
        }
        let positions = getCoords(tar_id);//获取当前点击的元素在页面中的位置
        top = (positions.top-40) + "px";
        left = (positions.left+50) + "px";
        $(tar_id).addClass("inputfoucs-style");
        if(add_id != this.state.target_id){
            this.setState({showEditor:true,position:[top,left],target_id:add_id})
        }else {
            if(!this.state.showEditor){
                this.setState({showEditor:true,position:[top,left],target_id:add_id})
            }
        }
    }
    toggleCollapsed = ()=>{
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    _childsList(data){
        if(data.length>0){
            return data.map(function(item,index){
                return <li key={index} dangerouslySetInnerHTML={{__html:item.content}}></li>
            })
        }
    }
    doCollection(){
        let ques = this.state.allQuestionetails[this.state.current-1];
        let setdata={
            userId: Storage_S.getItem('userid'),
            questionId:ques.QuesID,
            questionType:ques.QuesType,
            parentId: this.state.activeId,
            title: "我是题目"
        }
        this.props.actions.doSetCollection({
            body: setdata,
            success:()=>{alert("收藏成功！")},
            error:(mes)=>{alert("收藏失败！("+mes+")")}
        })
    }
    redoIt(){
        let answers = $("#mainTopic").find(".div_input");//选项;
        answers.each(function(){
            $(this).attr("contentEditable",true)
        })
        this.setState({solution: true})
    }
    //主试题重新做的提交按钮
    redoSubmit(data,items,index){
        let contents =[],istrue=false,score=0;
        if(items.questiontemplate == '选择题'){//选择题
            let answers = $("#mainTopic").find("input:checked");//选项;
            let answer = '';
            answers.each(function(ii){
                answer += $(this).val();//用户填写的答案
            });
            if(compareDifferent(data[0].answer,answer)){
                istrue =true;
                score = data[0].totalpoints;
            }
            contents[0] ={
                "content":answer,
                "isTrue":istrue,
                "url":''
            }
        }else{
            let mysrc = '',myvalue = '';
            let rightanswer = data[0].answer.trim().split(',')//处理填空题可能有两个答案的情况，每空平分总分
            if(items.questiontemplate == '简答题'){
                mysrc = $("#main-solution").find('img')[0].src;
                contents[0] = {
                    "content":'',
                    "isTrue":istrue,
                    "url":mysrc
                };
            }else {
                let answers = $("#mainTopic").find(".div_input");//选项;
                let  len = answers ? answers.length : 1 ;//有几个空，平均每个空的答案得分
                answers.each(function(ii){
                    if($(this).children('img').length>0){//先查找公式编辑器输入的内容即用编辑器输入的会产生一个img标签，没有则直接查text
                        mysrc = $(this).find('img')[0].src;
                        myvalue = $(this).find('img')[0].dataset.latex;
                    }else{
                        myvalue = $(this).text();
                    }
                    if(compareDifferent(rightanswer[ii],myvalue)){
                        istrue =true;
                        score += Number(data[0].totalpoints)/len;
                    }
                    contents[ii] = {
                        "content":myvalue,
                        "isTrue":istrue,
                        "url":mysrc
                    };
                })
            }
        }
        console.log("contents--contents-contents--contents----->>>>",contents)
        newChildList.Contents = contents;
        newChildList.score = score;
        (this.state.sentAllList).ExamResult[index-1] = newChildList;
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//每做完一个题缓存一个
        message.success("提交成功")
    }
    //获取分析、考点、解答、观察四个部分的数据
    getDateOfAnalysis(type,alldata){
        for(let i=0;i<alldata.length;i++){
            if(alldata[i].parttype == type){//在返回值中查找对应部分的内容，有就查询数据
                this.props.actions.getContentOfChildItems({
                    body:[{id:alldata[i].itemid}],
                    success:(data)=>{
                        if(data[0].code == 200){
                            let dataArray=[];
                            for(let i=0;i<(data[0].data).length;i++){
                                dataArray.push({id:(data[0].data)[i].itemid})
                            }
                            this.props.actions.getContentOfChildItemsForQues({
                                body:dataArray,
                                success:(data)=>{
                                    console.log("getContentOfChildItemsForQues=====>>>",data)
                                    if(data[0].code == 200){
                                        this.setState({analysisLeftContent:data[0].data,showEditor:false,nowAnalysisPart:type});
                                    }else {
                                        console.error(data[0].message)
                                    }
                                },
                                error:(err)=>{console.error(err)}
                            })
                        }else {
                            console.error(data[0].message)
                        }
                    },
                    error:(err)=>{console.error(err)}
                })
            }else {
                this.setState({analysisLeftContent:[],showEditor:false});
            }
        }
    }
    getDateOfPractice(type,data){
        let exerciseArray = [];
        for(let i=0;i<data.length;i++){
            if(data[i].parttype == type){//在返回值中查找对应部分的内容，有就查询数据
                exerciseArray.push({id:data[i].itemid})
            }
        }
        this.props.actions.getQuestion({
            body:exerciseArray,
            success:(data)=>{
                console.log("getQuestion---->>",data)
                let newdata = [];
                for(let i in data){
                    let content = data[i].data[0].content;
                    //去掉数据库查回来的无效数据
                    if(content.indexOf('巩固练习')==-1 && content.indexOf('拓展练习')==-1){
                        newdata.push(data[i])
                    }
                }
                console.log("练习的试题----》》》》》》》",newdata)
                this.setState({exerciseContent:newdata})
            },
            error:(err)=>{console.error(err)}
        })
    }
    //上传图片的回调函数，返回图片地址
    getEditContent(url,id){
        console.warn("getEditContent==>>",id,url)
        $("#"+id).find('img')[0].src = url;
        //$("#"+dom).text('').append(cont);
    }
    //查看巩固练习或者拓展练习部分 试题的答案解析
    seeAnswer (data){
        this.setState({two_answer_content:data})
    }
    clickTip(index,olddata){
        if(olddata && olddata.isdone == true){
            this.setState(
                {two_answer_flag:!this.state.two_answer_flag,
                    //exerciseIndex:index
                })
        }else {
            alert("请先提交答案再查看提示!")
        }
    }
    //巩固练习，拓展练习的提交答案
    submitAnwser(index,data){
        let target_value='',type = this.state.nowPart,url='';
        let target_exe = "exerciseTopic-"+type+"-"+index;//目标区块id
        if(data.questiontemplate == '选择题'){
            $("#"+target_exe).find("ul input:checked").each(function(ii){
                target_value += $(this).val();
            })
            if(!target_value){
                alert("请选择答案再提交！")
                return;
            }
            newChildList.childs[0][type][index] = {
                "itemid": data.questionid,
                "content":[{
                    "answer": target_value,
                    "url":url,
                    "isRight": compareDifferent(data.answer,target_value),
                    "knowledge":data.knowledge,
                    "isdone":true
                }]
            };
        }else {
            let tarid = "solution-"+type+"-"+index;
            url = $("#"+tarid).find('img')[0].src;//上传的图片的地址
            newChildList.childs[0][type][index] = {
                "itemid": data.questionid,
                "content":[{
                    "answer": '',
                    "url":url,
                    "isRight": false,
                    "knowledge":data.knowledge,
                    "isdone":true
                }]
            };
        }
        console.log("提交的答案",type,index,target_value,url);
        (this.state.sentAllList).currentquesid = this.state.current;
        (this.state.sentAllList).ExamResult[this.state.current-1] = newChildList;
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//每做完一个题缓存一个
        message.success("提交成功")
        //this.setState({exerciseIndex:index})
    }
    makeScore(index,total){
        let tar = "makescore"+index,score = '';
        score = $("#"+tar).val();
        if(score-total>0){
            alert("此题分数不能大于"+total+",请重新输入!")
        }
        console.log("打分",tar,$("#"+tar).val(),total)
    }
    //提交整套试卷的数据详情
    submitAllQuestion(){
        if(confirm("确定提交吗？")){
            (this.state.sentAllList).FinishDate = moment().format();//结束时间
            (this.state.sentAllList).AllDone = "yes";
            let endalllist = (this.state.sentAllList).ExamResult;
            let endnewlist = [] ,allscore=0;
            let len = (this.state.allQuestionetails).length;
            for(let ii=0;ii<len;ii++){
                if(!endalllist[ii]){
                    endnewlist[ii] = this.state.allQuestionetails[ii];
                }else {
                    endnewlist[ii] = endalllist[ii];
                }
                allscore += Number(endnewlist[ii].score);
            }
            (this.state.sentAllList).ExamResult = endnewlist;
            (this.state.sentAllList).Score = allscore;
            let sentItems = this.state.sentAllList;
            console.log("全部提交的内容：：====》》》》",sentItems);
            this.props.actions.sentUserPaperData({
                body:{data:sentItems},
                success:(data)=>{
                    alert("提交成功")
                    Storage_L.clear()
                },
                error:(mes)=>{
                    console.error('数据接收发生错误');
                }
            })
        }
    }
    //解答分析部分中每个部分小题的提交按钮处理逻辑
    submitOne(e,data,index,type,questionType){
        console.log("此题的信息：=======",data,this.state.current,type,index,questionType);
        if(!(newChildList.childs[0][type][index])){//先初始化每个部分小题答案信息，方便后面存储新的信息
            newChildList.childs[0][type][index] = {
                "itemid": "",
                "content":[]
            };
        }
        let isOrRight = false;//当前题的最终正确与否
        let lastKnowledge = [];//当前题的最终自动弹框需要的知识点
        if(questionType){//当前题目是选择题
            let value = '', isRight = false, knowledgesCont=[],knowledge_new = [];
            let knowledge = ((data.knowledge).replace(/\<B\>|\<\/B\>/g,"")).split("；");//知识点
            let rightanswer = (data.answer).trim().replace(/\s|，/g,"");//正确答案
            let inputList = $(e.target).parent().parent().find(".main_cont input:checked");//选项
            inputList.each(function(ii){
                value += $(this).val();//用户填写的答案
            })
            isRight = compareDifferent(value,rightanswer);
            if(knowledge.length>0){
                for(let ss in knowledge){//每一个知识点独立出来，当知识点复习之后需要记录每一个知识点做题的情况，rightRank为知识点的正确率
                    knowledge_new[ss] = {
                        "name":knowledge[ss]?knowledge[ss]:"",
                        "rightRank":"0"
                    }
                }
            };
            newChildList.childs[0][type][index].content[0] = {
                "answer":value,
                "url":'',
                "isRight": isRight,
                "knowledges":knowledge_new
            };
            isOrRight = isRight;
            lastKnowledge = knowledge;
        }else{
            let knowledge = ((data.knowledge).replace(/["\[\]\s]/g,"")).split('||');//知识点
            let inputList = $(e.target).parent().parent().find(".div_input");
            let endRigth = true;//有多个空的时候 只要错一个就当这道题是错误的。
            inputList.each(function(ii){
                let value = '',mysrc='', isRight = false, knowledgesCont=[];
                let rightanswer = (data.answer).trim().replace(/\s/g,"").split("||");//正确答案
                let everyRightanswer = '';//每一个空的正确答案
                let knowledges = knowledge[ii] ? knowledge[ii].split('@#'):[];//每一个空所包含的知识点
                let knowledge_new = [];//要存储的知识点

                if($(this).children('img').length>0){//先查找公式编辑器输入的内容，即用编辑器输入的会产生一个img标签，没有则直接查text
                    mysrc = $(this).find('img')[0].src;
                    value = $(this).find('img')[0].dataset.latex;
                }else{
                    value = $(this).text();
                }
                //value = $(this).attr("data")?$(this).attr("data"): $(this)[0].innerText;//用户填写的答案
                everyRightanswer = rightanswer[ii].replace(/$/g,'');//格式化正确答案，去除多余的其他字符
                isRight = compareDifferent(everyRightanswer,value);
                if(!isRight){//有错误的空，则这道题为错
                    endRigth = false;
                    lastKnowledge = lastKnowledge.concat(knowledges);
                }
                if(knowledges.length>0){
                    for(let ss in knowledges){
                        knowledge_new[ss] = {
                            "name":knowledges[ss]?knowledges[ss]:"",
                            "rightRank":"0"
                        }
                    }
                };
                newChildList.childs[0][type][index].content[ii] = {
                    "answer":value,
                    "url":mysrc,
                    "isRight": isRight,
                    "knowledges":knowledge_new
                };
            });
            isOrRight = endRigth;
            //lastKnowledge = knowledge;
        }
        if(!isOrRight){//如果做错了 则自动弹框知识点复习
            autoKnowledgeList = lastKnowledge;
            this.autoGetKnowledge()
        }
        newChildList.childs[0][type][index].itemid = data.itemid;
        (this.state.sentAllList).currentquesid = this.state.current;
        (this.state.sentAllList).ExamResult[this.state.current-1] = newChildList;
        Storage_L.setItem(this.state.activeId+"-second",JSON.stringify(this.state.sentAllList))//每做完一个题缓存一个
        message.success("提交成功")
    }
    //点击显示知识点弹框
    getKnowledge(e){
        let knowledge = $(e.target)[0].innerText;
        this.setState({DialogMaskFlag:true,knowledgeName:knowledge})
    }
    //当点击提交按钮 题目做错了之后 自动显示知识点弹框
    autoGetKnowledge(){
        console.log("autoGetKnowledge---------自动弹框的知识点列表---》",autoKnowledgeList)
        let knowledge = autoKnowledgeList[0];
        this.setState({DialogMaskFlag:true,knowledgeName:knowledge})
    }
    closeKnowledgeBox(){
        UE.delEditor('knowledgeContainer');
        this.setState({DialogMaskFlag:false})
    }
    _contentQtxt(data,index){
        console.log("_contentQtext------//////--------------------->>>>>",data)
        let items = data[0];
        let content = items.content;
        let questiontemplate = items.questiontemplate;
        let childs = items.childs;
        let questionType=false;
        //选择题的时候要处理返回的选项格式
        if(questiontemplate == '选择题'){
            questionType = true;
        }
        let oldcontent = this.state.sentAllList.ExamResult[index-1];//做过一次的数据
        let oldanswer = (oldcontent && (oldcontent.Contents).length>0) ? oldcontent.Contents: this.state.allQuestionetails[index-1].Contents;
        console.log("oldanswer=====>>>>>>>>",oldanswer)
        if(content){
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                let qqq =  '<span class="div_input"></span>';
                content = content.replace(/blank|BLANK|#blank#|#BLANK#/g,qqq);
            }
            return (
                <div>
                    <div className="displayflex QtxtContent_main_title">
                        <div className="QtxtContent_main_title_left">{questiontemplate}：</div>
                        <div className="QtxtContent_main_title_right">
                            <Button onClick={()=>this.doCollection()}>收藏</Button>
                            <Button onClick={()=>this.redoIt()}>重做</Button>
                            <Button id="redosubimt" onClick={()=>this.redoSubmit(data,items,index)}>提交</Button>
                        </div>
                    </div>
                    <div>
                        <ul id="mainTopic" style={{padding:"8px 0"}}>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            {questionType?<MultipleChoice type={items.questiontype} answer={oldanswer.length>0?oldanswer[0].content:""} index={index} choiceList={items.optionselect} />:''}
                            {childs.length<1?"":this._childsList(childs)}
                        </ul>
                        <ul>
                            {items.isobjective == '主观'?(<div>
                                <li id="solition" style={{paddingTop:"5px"}}>解：<span id="main-solution">
                                     <img src={oldanswer[0].url} width="200px" />
                                </span></li>
                                <UpLoadFile id="main-solution" submitHandle={this.getEditContent.bind(this)} />
                            </div>):''}
                        </ul>
                    </div>
                </div>
            )
        }
    }
    _analysisQtxt(data,type){
        let num = this.state.current;
        let mainQuestionId = this.state.allQuestionetails[this.state.current-1].QuesID;//当前某一个主试题的Id
        let childsLen = this.state.sentAllList.ExamResult[num-1];
        let ddd = !childsLen ? '':childsLen.childs[0][type];//某一部分，是数组形式
        return data.map(function(item,index){
            let content = item.content;
            let knowledge = item.knowledge;
            let questionType=false;
            let ddd_content = (ddd && ddd.length>0) ? ddd[index].content : [];//解析的某部分的第几个content所有内容（比如考点中的第一个小题全部内容）
            let regex=/{@.+?@}/g;
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/<u>blank<\/u>|blank|BLANK|#blank#|#BLANK#/g,'<span contenteditable="true" class="div_input"></span>')
            }
            let knowledgelist = content.match(regex);//找出必填空的知识点
            if(knowledgelist && knowledgelist.length>0){
                for(let i in knowledgelist){
                    content = content.replace(/{@|@}/g,'');
                    let knowname = knowledgelist[i].replace(/\s|{@|@}/g,'');
                    console.warn("knowname====>>>>>",knowname)
                    let knownamelist = knowname.split('；');//处理一个空有多个知识点的情况
                    for(let j in knownamelist){
                        content = content.replace(new RegExp(knownamelist[j],'g'),'<span class="mustText">'+knownamelist[j]+'</span>')//标记必填空
                    }
                }
            }
            if(item.questiontemplate == '选择题'){
                questionType = true;
            }
            if(knowledge){
                knowledge = (knowledge.replace(/["\[\]\s]/g,""));
                knowledge = knowledge.replace(/；|\@\#|;|\|\|/g,"@&").split('@&');
            }
            return (
                <div className="analysisContent" style={{padding: "10px",borderBottom: '1px dashed gray'}} key={index} >
                    <ul className="main_cont">
                        <li dangerouslySetInnerHTML={{__html:content}}></li>
                        {questionType?<MultipleChoice type="多选题" answer={ddd_content.length>0?ddd_content[0].answer:''} index={index} choiceList={item.optionselect} />:''}
                    </ul>
                    {(item.answer).length<1?"":<ul>
                        {knowledge.length>0 ? <span>知识点回顾：{knowledge.map((itm,index)=>{
                            return <a key={index} style={{marginLeft:"5px"}} onClick={(e)=>this.getKnowledge(e)} dangerouslySetInnerHTML={{__html:itm.replace(/\@\#/g,',')}}></a>
                        })}</span> :''}
                        <span style={{margin:"0 10px"}}>答案：<span dangerouslySetInnerHTML={{__html:item.answer}}></span></span>
                        <button className="marginl10" onClick={(e)=>{this.submitOne(e,item,index,type,questionType,knowledge)}}>提交</button>
                    </ul>}
                    {!this.state.DialogMaskFlag?"":<DialogMask title={this.state.knowledgeName} closeDialog={()=>this.closeKnowledgeBox()}><Knowledge questionId={mainQuestionId} examPaperId={this.state.activeId} knowledgeName={this.state.knowledgeName} /></DialogMask>}
                </div>
            )
        },this)
    }
    _practicesQtxt(data){
        let num = this.state.current,type = this.state.nowPart;
        let childsLen = this.state.sentAllList.ExamResult[num-1];
        let ddd = !childsLen ? '':childsLen.childs[0][type];
        return data.map(function (item,index) {
            let items = (item.data)[0];
            let content = items.content;
            let questionType = false;
            let ddd_content = (ddd && ddd[index]) ? ddd[index] : '';//解析的某部分的第几个content所有内容（比如考点中的第一个小题全部内容）
            if (content.indexOf("blank") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/blank|BLANK|#blank#|#BLANK#/g,'<input type="text" class="input_blank"/>');
            }
            if(items.questiontemplate == '选择题'){
                questionType = true;//有两个选项以上
            }
            console.log("_practicesQtxt---->>>",index,ddd_content)
            if(content){
                return (
                    <div className="exercise2" key={index}>
                        <div className="exercise2-border">
                            <div className="exercise2_main_content">
                                <div id={"exerciseTopic-"+type+"-"+index}>
                                    <ul>
                                        <li style={{paddingTop:"6px"}} dangerouslySetInnerHTML={{__html:content}}></li>
                                        {questionType?<MultipleChoice type={items.questiontype} answer={ddd_content?(ddd_content.content)[0].answer:''} index={index} choiceList={items.optionselect} />:''}
                                        {items.childs.size<1?"":this._childsList(items.childs)}
                                        {items.isobjective == '主观'?(<div>
                                            <li className={"solution-"+type+"-"+index} style={{paddingTop:"5px"}}>解：
                                                <span id={"solution-"+type+"-"+index}>
                                                    <img src={ddd_content? (ddd_content.content)[0].url:''} width="200px" />
                                                </span>
                                                <UpLoadFile id={"solution-"+type+"-"+index} preview="false" submitHandle={this.getEditContent.bind(this)} />
                                            </li>
                                        </div>):''}
                                    </ul>
                                </div>
                                <div>
                                    {/*
                                     <span style={{cursor:'pointer',color:'palevioletred'}} onClick={()=>this.clickTip(index,ddd_content)}>解析:</span>
                                     <Icon className="tips" type={this.state.exerciseIndex==index && this.state.two_answer_flag?"up":"down"}/>
                                     */}
                                    <div className="submitAndscore">
                                        <Button type="primary" size="small" onClick={()=>this.submitAnwser(index,items)}>提交答案</Button>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                {/*<div className={this.state.exerciseIndex==index && this.state.two_answer_flag ?"exercise2_help":"displaynone"}>
                                 <div className="exercise2_main_sites">
                                 <Button type="dashed" size="small" onClick={()=>this.seeAnswer(items.knowledge)}>考点</Button>
                                 <Button type="dashed" size="small" onClick={()=>this.seeAnswer(items.answer)}>答案</Button>
                                 <Button type="dashed" size="small" onClick={()=>this.seeAnswer(items.analysis)}>解析</Button>
                                 </div>
                                 <div>
                                 <p><span dangerouslySetInnerHTML={{__html:this.state.two_answer_content}}></span></p>
                                 </div>
                                 </div>
                                 */}
                            </div>
                        </div>
                    </div>
                )
            }
        },this)
    }
    _AnswerFlag(type,data){
        return (
            <div>
                <div>答案为：</div>
                <div dangerouslySetInnerHTML={{__html:data[0].answer}}></div>
            </div>
        )
    }
    getData(data,page){
        let olddata = this.state.sentAllList.ExamResult[page];
        if(!olddata){//没有此题缓存，则取出一测的做题答案信息
            newChildList = JSON.parse(everyChildInfo)//先全部给空，初始化
            newChildList.Contents = data.Contents;
            newChildList.knowledge = data.knowledge;
            newChildList.score = data.score;
        }else {
            newChildList = olddata;
        }
        if(data){
            this.props.actions.getAllChildOfQuestion({body:[{id:data.QuesID}],
                success:(data)=>{
                    console.log("currentQuesData-------===---->>>",(data[0].data));
                    newChildList.QuesID = (data[0].data)[0].questionid;
                    newChildList.QuesType = (data[0].data)[0].questiontemplate;
                    this.setState({
                        current2: page+1,
                        current: page+1,
                        current1: page+1,
                        analysisLeftContent:[],
                        exerciseContent:[],
                        showEditor:false,
                        solution: false,
                        currentQuesData:data[0].data
                    })
                    $('#Explain_exer').click()//默认点击一下解析部分
                }})
        }
    }
    onChange = (page) => {
        console.log("page--",page)
        this.getData(this.state.allQuestionetails[page-1],page-1)
    }
    exitBack(){
        UE.delEditor('questionContainer');//退出的时候删除实例化的编辑器
        this.props.actions.push("/home/math/exams")
    }
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }
    _menuList(len){
        const menulist = (length)=>{
            const list = [];
            for(let i=0;i<length;i++){
                list.push(<SubMenu key={"sub"+(i)} title={"第("+(i+1)+")问"}>
                    <Menu.Item key="observe" id="ddddd" ref={(item)=>{this.observe = item}}>观察</Menu.Item>
                    <Menu.Item key="review">考点</Menu.Item>
                    <Menu.Item key="analysis">分析</Menu.Item>
                    <Menu.Item key="answer">解法</Menu.Item>
                </SubMenu>)
            }
            return list;
        }
        if(len>0){
            return (
                <MenuItemGroup key="sub" title={<span>试题分析</span>}>
                    { menulist(len)}
                </MenuItemGroup>
            )

        }else {
            return (
                <MenuItemGroup key="sub" title={<span>试题分析</span>}>
                    <Menu.Item key="observe" id="ddddd" ref={(item)=>{this.observe = item}}>观察</Menu.Item>
                    <Menu.Item key="review">考点</Menu.Item>
                    <Menu.Item key="analysis">分析</Menu.Item>
                    <Menu.Item key="answer">解法</Menu.Item>
                </MenuItemGroup >
            )
        }
    }
    render(){
        num = num+1;
        console.log("-------------num-------------->",num)
        const {SecondTestQuestions,GetFirstDataOfPaper} = this.props;
        let error = PureRenderMixin.Compare([SecondTestQuestions,GetFirstDataOfPaper]);
        if (!error) return <div/>
        let title = JSON.parse(Storage_S.getItem(this.state.activeId)).exampaper;
        let errLength = (this.state.errorArray).length;
        let childslen=0;
        if(this.state.currentQuesData.length>0){
            childslen = this.state.currentQuesData[0].childs.length;
        }else {return <div/>}
        //获取各部分的高度
        let hh = ($(window).height()-$('.Question_content').height()-$('header').height() -140)+'px';
        const contH = {
            height:hh,
            overflowY:'auto'
        };
        return(
            <div className="mask">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">{title+"（检测提升）"}</div>
                        <div className="exit" >
                            <button type="button" className="btn btn-default" onClick={()=>this.submitAllQuestion()}>全部提交</button>
                            <button type="button" className="btn btn-default" onClick={()=>this.exitBack()}>退出</button>
                        </div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div className="Question_content">
                        <div className="pagination_all">
                            <div className="widthPrecent5 margint10">题号:</div>
                            <div className="padding0">
                                <Pagination2 total={this.state.total} scoreArraylist={[3,3,3,3,3,0,0,3,3,0,5,5,5,5,0,6,8,15,10,10]} current={this.state.current1}  onChange={this.onChange}/></div>
                        </div>
                        <div className="pagination_content">
                            <div className="pagination_before col-md-7">
                                <div className="pagination_all">
                                    <div className="widthPrecent7 margint10">错题:</div>
                                    <div className="padding0">
                                        <Pagination className="pagination_error" wordNum={this.state.errorArray} current={this.state.current2} onChange={this.onChange} total={errLength} /></div>
                                </div>
                            </div>
                            <div className="btnContainer col-md-5" id="btnContainer">
                                <button id="Explain_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("AnalyContent",this.state.currentQuesData)}>
                                    解答分析
                                </button>
                                <button id="Anwser_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("Answer",this.state.currentQuesData)}>
                                    标准答案
                                </button>
                                <button id="Exercise1_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("Exercise1",this.state.currentQuesData)}>
                                    巩固练习
                                </button>
                                <button id="Exercise2_exer" type="button" className="btn btn-primary"
                                        onClick={()=>this.requestQuestion("Exercise2",this.state.currentQuesData)}>
                                    拓展练习
                                </button>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <br/>
                    <hr/>
                    <section className="QtxtContent" style={contH}>
                        <MathJaxEditor position={this.state.position} editorId="questionContainer" target_id={this.state.target_id} showEditor={this.state.showEditor}/>
                        {!this.state.mainContent?"":<div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt(this.state.currentQuesData,this.state.current)}
                            </div>
                        </div>}
                        <div>
                            <div id="Analysis_Qtxt" style={{height:"100%"}} className={this.state.AnalysisFlag?'':'displaynone'}>
                                <div className="content_three">
                                    <div className={this.state.collapsed?"content_three_left2":"content_three_left"}>
                                        <menu>
                                            <div onClick={this.toggleCollapsed} className="shrink">
                                                <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                                            </div>
                                            <Menu
                                                ref={(e) => { this.Menu = e; }}
                                                onClick={this.handleClick}
                                                openKeys={this.state.openKeys}
                                                onOpenChange={this.onOpenChange}
                                                mode="inline"
                                                inlineCollapsed={this.state.collapsed}
                                            >
                                                {this._menuList(childslen)}
                                            </Menu>
                                        </menu>
                                    </div>
                                    <div className="content_three_right">
                                        <p style={{color:"darkgoldenrod",fontSize:"12px"}}>tips：标有红色※的空必须填写奥！</p>
                                        <div id="analysusQuesCont">
                                            {(this.state.analysisLeftContent).length>0?this._analysisQtxt(this.state.analysisLeftContent,this.state.nowAnalysisPart):<NoThisPart/>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="AnswerFlag" className={this.state.AnswerFlag?'':'displaynone'}>
                                <div className="content_three_right">
                                    {this._AnswerFlag('Exercise1',this.state.currentQuesData)}
                                </div>
                                <div style={{clear:"both"}}></div>
                            </div>
                            <div id="Exercise1_Qtxt" className={this.state.Exercise1Flag?'':'displaynone'}>
                                <div className="content_three_right">
                                    {(this.state.exerciseContent).length>0?this._practicesQtxt(this.state.exerciseContent):''}
                                </div>
                                <div style={{clear:"both"}}></div>
                            </div>

                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        SecondTestQuestions:state.SecondTestQuestions,
        GetFirstDataOfPaper:state.GetFirstDataOfPaper
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,setPreRoute,getFirstDataOfPaper,getAllChildOfExam,getAllChildOfQuestion,getContentOfChildItems,getContentOfChildItemsForQues,getQuestion,getChildQuestionsForQuestion,doSetCollection,sentUserPaperData}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)

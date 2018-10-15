/**
 * 训练，测试的
 * Created by gaoju on 2017/12/29.
 */
import React,{Component} from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push,goBack } from 'react-router-redux'
import {getQuestionList,getQuestion,sentUserPaperData,sentUserQuestionDataOfPaper,getFirstDataOfPaper} from '../../../../redux/actions/math'
import Timing from '../../../../components/timing'
import {MathJaxEditor} from '../../../../components/editer'
import UpLoadFile from '../../../../components/upload/index'
import PureRenderMixin from '../../../../method_public/pure-render'
import {Storage_S,Storage_L,QuestionScore} from '../../../../config'
import './question_style.css'
import moment from 'moment'
import {Modal} from 'antd'
import * as Modals from '../../../../method_public/antd-modal'
import Pagination from '../../../../components/pagination/pagination'
import MultipleChoice from '../../../../components/multipleChoice/index'
import {getCoords,compareDifferent} from '../../../../method_public/public'

var sentJson = {
    "ExamInfoID":"", "UserID":"", "ExamPaperID":"","ExamPaperTitle":"","ExamOrExercise":"",
    "StartDate":null, "FinishDate":null, "SpendTime":0, "ExamType":"", "Score":0,
    "ExamResult":[],
    "DoExamInfo":null,
    "currentquesid":0,
    "AllDone":'no'
}
class Question extends Component{
    constructor(props){
        super(props);
        let activeId = window.location.hash.split('/')[window.location.hash.split('/').length-1];//当前页面的id
        let paper = JSON.parse(Storage_S.getItem(activeId))//用id来从缓存中取出试卷的对应数据
        let paperItems = JSON.parse(Storage_L.getItem(activeId))//缓存中取出做题情况的对应数据
        this.state={
            dataAll:paper,//整套试卷,可取到某套试题的所有数据
            activeId: activeId,
            cleartimeflag:true,//定时器
            current: !paperItems ? 1 : paperItems.currentquesid,//当前题号
            totalNum:0,//试题总数
            all_question:[],//所有题目
            sentList: !paperItems? sentJson : paperItems,//组装答案列表，用来发送存储源数据
            oldAnwers:'',//答案
            target_id:'',//当前要操作的dom
            img_url:'',
            previewVisible:false,//提交的照片放大查看
            AnswerContent:[],
            questionList:'',
            showEditor:false,
            position:[]
        }
    }
    componentDidMount(){
        sentJson.ExamInfoID = moment().format('x');//当前时间戳作为此次做题id
        sentJson.UserID =Storage_S.getItem('userid');
        sentJson.ExamPaperID = this.state.activeId;
        sentJson.StartDate = moment().format();
        sentJson.ExamType = "一测";
        sentJson.ExamPaperTitle = (this.state.dataAll).exampaper;
        sentJson.ExamOrExercise = "exam";
        this.props.actions.getQuestionList({
            body:[{id:this.state.activeId}],
            success:(data)=>{
                let newdata = data[0];
                if(newdata.code == 200){
                    console.log("getQuestionList-----====--->>>>>",newdata.data)
                    let all_question = newdata.data;//解析JSON
                    let data_len = all_question.length;//本套试题的所有题目数
                    this.getData(all_question[this.state.current-1]);
                    this.setState({
                        totalNum:data_len,
                        all_question:all_question
                    })
                }
            },
            error:(mes)=>{
                console.error('数据接收发生错误');
            }
        })
        //离开route的钩子处理事件
        //this.props.router.setRouteLeaveHook(
        //    this.props.route,
        //    this.routerWillLeave
        //)
    }
    componentDidUpdate(prevProps,prevState){
        if(prevState.questionList != this.state.questionList){
            this.addEventFuc()//为填空题以及解答添加事件处理
        }
    }
    routerWillLeave=(nextLocation)=> {
        // 返回 false 会继续停留当前页面，否则，返回一个字符串，会显示给用户，让其自己决定
        if(confirm('确认要离开？')){
            this.setState({cleartimeflag:true})
            UE.delEditor('practiceContainer');
            setTimeout(()=>{
                return true;
            },1000)
        }else {
            return false;
        }
    }
    addEventFuc(){
        let _this = this;
        $(".div_input").each(function(i){
            let add_id = "practice"+_this.state.current+i;
            if(_this.state.oldAnwers[i]){
                if(_this.state.oldAnwers[i].url){//有图片的话,添加img
                    $(this).append('<img src='+_this.state.oldAnwers[i].url+' data-latex='+_this.state.oldAnwers[i].content+'/>');
                }else{
                    $(this).text(_this.state.oldAnwers[i].content);
                }
            }
            $(this).attr("id",add_id);
            $(this).on('click',function(event){
                _this.FocusHandle(this,add_id)
            })
        });
    }
    FocusHandle(e,add_id){
        let tar_id,top='',left='';
        if($(e)[0].localName == 'img'){
            tar_id= ($(e)[0].offsetParent);
        }else {
            tar_id = $(e)[0];
        }
        let positions = getCoords(tar_id);//获取当前点击的元素在页面中的位置
        top = (positions.top-42) + "px";
        left = (positions.left + 50) + "px";

        $(tar_id).addClass("inputfoucs-style");
        if(add_id != this.state.target_id){
            this.setState({showEditor:true,position:[top,left],target_id:add_id})
        }else {
            if(!this.state.showEditor){
                this.setState({showEditor:true,position:[top,left],target_id:add_id})
            }
        }
    }
    getData(data){
        if(data){
            this.props.actions.getQuestion({body:[{id:data.questionid}],
                success:(data)=>{
                    console.log("getQuestion=======555555=========>",data)
                    if(data[0].code == 200){
                        let isHave = (this.state.sentList).ExamResult[this.state.current-1];//做过了就显示选择的答案
                        let oldAnwers = '';
                        if(isHave){
                            oldAnwers = isHave.Contents;
                        }
                        console.log("this.state.sentList=======555555=========>",this.state.sentList)
                        this.setState({oldAnwers: oldAnwers,questionList:data[0].data})
                    }
                }})
        }
    }
    _childsList(data){
        return data.map(function(item,index){
            return <li key={index} dangerouslySetInnerHTML={{__html:item.get('content')}}></li>
        })
    }
    _doAndAnswer(data){
        let imgurl = data[0] ? data[0].url : this.state.img_url;
        if(this.state.img_url){
            imgurl = this.state.img_url;
        }else {
            imgurl = data[0] ? data[0].url : '';
        }
        return (
            <div>
                <div>解：__</div>
                <div>附件(提交的答案)：
                    <img className="preview_img" src={imgurl}/><span onClick={()=>this.handlePreview()}>查看</span>
                    <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>this.handleCancel()}>
                        <img alt="preview" style={{ width: '100%' }} src={imgurl} />
                    </Modal>
                </div>
            </div>
        )
    }
    _contentQtxt(data,index){
        let item = (data.get('items')).get(0);
        let items = item.get('data').get(0);
        let content = items.get('content');
        let questiontype = items.get('questiontemplate');
        let childs = items.get('childs');
        let oldAnwers = this.state.oldAnwers[0] ? this.state.oldAnwers[0].content :'';
        if(content){
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/<u>blank<\/u>|blank|BLANK|#blank#|#BLANK#/g,'<span contenteditable="true" class="div_input"></span>')
            }
            return (
                <div>
                    <div className="displayflex QtxtContent_main_title">
                        <div className="QtxtContent_main_title_left">{questiontype}：</div>
                    </div>
                    <div className="padding10">
                        <ul>
                            <li dangerouslySetInnerHTML={{__html:content}}></li>
                            {questiontype == "选择题" ?<MultipleChoice type={items.get('questiontype')} answer={oldAnwers}  index={index} choiceList={items.get('optionselect')} />:''}
                            {childs.size<1?"":this._childsList(childs)}
                            {questiontype == '简答题' ? this._doAndAnswer(this.state.oldAnwers) :''}
                        </ul>
                    </div>
                </div>
            )
        }
    }
    handlePreview(){
        this.setState({
            previewVisible: true
        });
    }
    handleCancel(){
        this.setState({ previewVisible: false })
    }
    onChange = (page) => {
        this.setState({
            current: page,
            oldAnwers:'',
            img_url:'',
            AnswerContent:[],
            showEditor:false
        })
        this.getData(this.state.all_question[page-1])
    }
    endHandle(data){
        confirm('时间已到！')
    }
    exitBack(){
        this.setState({cleartimeflag:true});
        UE.delEditor('practiceContainer');
        setTimeout(()=>{
            this.props.actions.goBack();
        },500)

    }
    nextSubmit(page,GetQuestion){
        var nextpage = page+1;
        var isright = false;
        var targetDom = '';
        let AnswerArr = [];
        let dataItems = ((GetQuestion.get('items')).get(0)).get('data').get(0);//试题数据
        let answer = $.trim(dataItems.get('answer'));
        let type = dataItems.get('questiontemplate');
        let isobjective = dataItems.get('isobjective');
        let quesId = dataItems.get('questionid');
        let childs = dataItems.get('childs');
        let knowledge = '';
        let difficulty = dataItems.get('difficulty');
        let nexflag = true;
        let quesScore = dataItems.get('totalpoints');
        if(!quesScore){//判断试题是否有分数，如果数据库中的试题没有分数 则为其赋一个分数。
            if(type == "选择题"){quesScore = QuestionScore[0]}
            if(type == "填空题"){quesScore = QuestionScore[1]}
            if(type == "简答题"){quesScore = QuestionScore[2]}
        }
        if(childs.size>0){//判断试题是否有子题，如果有 取出对应子题的知识点
            childs.map((item,index)=>{
                console.log("childs--------------------->>>>>>>>>>>>",index,item.get('knowledge'))
                knowledge = knowledge + item.get('knowledge') + '；';
            })
        }else {
            knowledge = dataItems.get('knowledge');
        }
        let score = quesScore;//先把题的得分拿出来，错了在赋值为0
        console.log(page,nextpage,"正确答案：",answer,knowledge)
        if(type == "选择题"){
            let doms = document.getElementsByTagName("input");
            //获取选择的答案
            for(let i=0;i<doms.length;i++){
                if(doms[i].checked){
                    targetDom = doms[i];
                }
            }
            //选择答案后执行
            if(targetDom){
                let myAnswer = targetDom.value;
                if(compareDifferent(myAnswer,answer)){
                    isright = true;
                    console.log("选择正确")
                }else{
                    isright = false;
                    score = 0;
                    console.error("选择错误")
                }
                AnswerArr = [{
                    "domid":'',
                    "content": myAnswer,
                    "url":"",
                    "IsTrue": isright
                }]
                //this.state.AnswerContent = AnswerArr;
            }else {
                nexflag = false;
                alert('请选择一个答案！')
            }
        }else {//除了选择题，其他的先统一按照简答题来处理
            let _this = this;//全局this赋给新的值
            if(isobjective == '主观'){//如果是主观题则按照错题来处理
                AnswerArr = [{
                    "domid":'',
                    "content": '',
                    "url": _this.state.img_url,
                    "IsTrue": false
                }]
                score = 0;
            }else{
                answer = answer ? answer.split("||") : answer;//处理答案是多的空的情况
                $(".div_input").each(function(i){
                    let myAnswer='',myId='',mysrc='';
                    if($(this).children('img').length>0){//先查找公式编辑器输入的内容即用编辑器输入的会产生一个img标签，没有则直接查text
                        mysrc = $(this).find('img')[0].src;
                        myAnswer = $(this).find('img')[0].dataset.latex;
                    }else{
                        myAnswer = $(this).text();
                    }
                    myId = $(this).attr("id");
                    if(compareDifferent(myAnswer,answer[i])){
                        isright = true;
                        console.log("正确")
                    }else{
                        isright = false;
                        score = 0;
                        console.error("错误")
                    }
                    AnswerArr[i] = {
                        "domid":myId,
                        "content": myAnswer,
                        "url": mysrc || _this.state.img_url,
                        "IsTrue": isright
                    }
                });
            }

            //this.state.AnswerContent = AnswerArr;
        }
        if(nexflag){
            let nowList = (this.state.sentList).ExamResult;
            let isOrRight = true;
            (this.state.sentList).currentquesid = page;//当前题号，断点续做
            if(AnswerArr.length>0){//如果某道试题有多个空，则只要有错的 则此题为错
                for(let ii in AnswerArr){
                    if(!(AnswerArr[ii].IsTrue)){
                        isOrRight = false;
                    }
                }}
            nowList[page-1] = {
                "QuesID": quesId,
                "QuesType": type,
                "Contents": AnswerArr,
                "isOrRight":isOrRight,
                "score":score,
                "QuesScore": quesScore,
                "knowledge":knowledge,
                "difficulty":difficulty
            }
            Storage_L.setItem(this.state.activeId,JSON.stringify(this.state.sentList))//每做完一个题缓存一个
            if(nextpage>this.state.totalNum){//最后一个题做完了
                let _this = this;
                Modals.showConfirm("已做到最后一题，是否全部提交？", function () {
                    _this.allSubmit();
                })
            }else {
                this.setState({
                    current: nextpage,
                    oldAnwers:'',
                    img_url:'',
                    AnswerContent:[],
                    showEditor:false
                })
                this.getData(this.state.all_question[page])
            }
        }
    }
    allSubmit(){
        let endList = (this.state.sentList).ExamResult;
        let _this = this;
        for(let i=0;i<endList.length;i++){
            if(!endList[i]){
                Modals.warning("提示","第"+(i+1)+"个题还没有做，请切到第"+(i+1)+"个题提交并点击页面确定按钮")
                return
            }
        }
        Modals.showConfirm("确定提交吗？", function () {
            (_this.state.sentList).FinishDate = moment().format();//结束时间
            (_this.state.sentList).AllDone = "yes";
            let endalllist = (_this.state.sentList).ExamResult,allscore=0;
            for(let ii in endalllist){
                allscore += Number(endalllist[ii].score);
            }
            (_this.state.sentList).Score = allscore;
            let sentItems = _this.state.sentList;
            _this.props.actions.sentUserPaperData({
                body:{data:sentItems},
                success:(data)=>{
                    Modals.messageSuccess("提交成功!",2, function () {
                        Storage_L.clear()
                        _this.exitBack()
                    });
                },
                error:(mes)=>{
                    console.error('数据接收发生错误');
                }
            })
            _this.props.actions.sentUserQuestionDataOfPaper({
                body:{data:sentItems},
                success:(data)=>{
                    Storage_L.clear()
                    console.log('sentUserQuestionDataOfPaper数据插入成功');
                },
                error:(mes)=>{
                    console.error('sentUserQuestionDataOfPaper数据接收发生错误');
                }
            })
        })
    }
    getEditContent(url){
        console.warn("上传图片的地址",url)
        this.setState({img_url: url})
    }
    render(){
        const {GetQuestion} = this.props;
        let error = PureRenderMixin.Compare([GetQuestion]);
        if (!error || this.state.totalNum<1){
            return (
                <div className="mask math-question-content">
                    <header>
                        <div className="title" id="title">没有找到试卷对应试题</div>
                        <div className="exit" onClick={()=>this.exitBack(this)}><button type="button" className="btn btn-default">退出</button></div>
                    </header>
                </div>
            )
        }
        let objective = ((GetQuestion.get('items')).get(0)).get('data').get(0).get('isobjective');
        let objectiveFlag = (objective== "主观") ? true:false;
        let title = (this.state.dataAll).exampaper;//试卷标题
        let cleartime = this.state.cleartimeflag;
        //获取各部分的高度
        let hh = ($(window).height()-$('.pagination_content').height()-$('header').height()-160)+'px';
        const contH = {
            height:hh,
            overflowY:'auto'
        };
        return(
            <div className="mask" id="practice">
                <div className="math-question-content">
                    <header>
                        <div className="title" id="title">{title}<Timing duration={2*60*60} clearTime={cleartime} endHandle={()=>this.endHandle(this)}></Timing></div>
                        <div className="exit" onClick={()=>this.exitBack(this)}><button type="button" className="btn btn-default">退出</button></div>
                    </header>
                    <center><hr width="90%" size={2}  color="black"></hr></center>
                    <div className="pagination_content">
                        <div className="pagination_before pagination_all">
                            <div className="widthPrecent5 margint10">题号:</div>
                            <div className="padding0">
                                <Pagination total={this.state.totalNum} current={this.state.current} onChange={this.onChange}/>
                            </div>
                        </div>
                    </div>
                    <section className="QtxtContent" style={contH}>
                        <MathJaxEditor position={this.state.position} editorId="practiceContainer" target_id={this.state.target_id} showEditor={this.state.showEditor}/>
                        <div className="QtxtContent_main">
                            <div id="Content_Qtxt">
                                {this._contentQtxt(GetQuestion,this.state.current)}
                            </div>
                        </div>
                        <div id="MathContent">
                            {!objectiveFlag ? '':<UpLoadFile submitHandle={this.getEditContent.bind(this)} />}
                        </div>
                    </section>
                    <button type="button" className="btn btn-primary next_btn" disabled={(this.state.current==(this.state.totalNum+1))?true:false} onClick={()=>this.nextSubmit(this.state.current,GetQuestion)}>确定</button>
                    {/*<button type="button" className="btn btn-primary submit_btn" disabled={(this.state.current==(this.state.totalNum+1))?false:true} onClick={()=>this.allSubmit(this)}>全部提交</button>*/}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        GetQuestion:state.GetQuestion,
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,goBack,getQuestionList,getQuestion,sentUserPaperData,sentUserQuestionDataOfPaper,getFirstDataOfPaper}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)

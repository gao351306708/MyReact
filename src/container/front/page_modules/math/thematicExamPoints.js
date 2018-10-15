/**
 * 考纲复习--按照考点复习页面
 * Created by gaoju on 2018/5/16.
 */
import React,{Component} from 'react'
import { push,goBack } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './style.css'
import {requestData} from '../../../../method_public/public'
import {Pagination,Menu,Modal,message,Tree,Spin,Select,Icon} from 'antd'
import {Storage_S} from '../../../../config'
import PureRenderMixin from '../../../../method_public/pure-render'
import {getAllQuestionOfThematic,getAllChildOfQuestion,getKnowledgeIdList,setThematicQuestionAnswerInfo} from '../../../../redux/actions/math'
import {getProvinceList} from '../../../../redux/actions/page'
import MultipleChoice from '../../../../components/multipleChoice/index'
import DialogMask from '../../../../components/Alter/dialogMask/dialogmask'
import Knowledge from './knowledge.js'
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const SubMenu = Menu.SubMenu;

//修改翻页文字链接
function itemRender(current, type, originalElement) {
    if (type === 'prev') {
        return <a>上一页</a>;
    } else if (type === 'next') {
        return <a>下一页</a>;
    }
    return originalElement;
}
var base = new Base64();//base64对象
var fourPartOfChapter = ["知识点回顾","重点考点、备考思路","聚焦中考","真题过关"]
class ThematicExamPoints extends Component{
    constructor(props) {
        super(props)
        this.state = {
            allChapterList:[],//左右章节
            childOfChapterList:{},//每一章的子集
            selectedKeys:[],//选择的章和讲
            modalVisible:false,
            DialogMaskFlag:false,
            knowledgeName:'',
            currentPage:1,
            totalNum:0,
            allQuestionList:[],//当前模块的所有试题
            selectQuestionList:[],//条件选择后的所有试题
            currentQuestionList:[],//当前页面所显示的试题
            currentQuestionId:'',
            questionDetails:[],//点击作答页面显示的试题详情
        }
    }
    componentDidMount(){
        let _this = this;
        requestData('../src/data/knowledge.json',{},function(data){
            console.log("knowlege---->>>>",data)
            setTimeout(()=>{
                _this.setState({allChapterList:data})
            },1000)
        })
        //获取省份列表
        this.props.actions.getProvinceList({});
        this.props.actions.getAllQuestionOfThematic({
            body:{},
            success:(data)=>{
                console.log("getAllQuestionOfThematic--===-->",data)
                this.setState({
                    allQuestionList:data,
                    totalNum:(data.length)
                })
                this.getCurrentDate('全部')
            },
            error:(mes)=>{
                console.error(mes)
            }
        })
    };
    getCurrentDate(type){
        let list = (this.state.allQuestionList);
        let newList = [];
        if(type == '全部'){
            newList = list;
        }else {
            for (let i in list){
                if(list[i].questiontemplate == type){
                    newList.push(list[i]);
                }
            }
        }
        let nowPageList = newList.slice(0,10);//默认取出前10条
        this.setState({
            currentPage:1,
            totalNum:newList.length,
            selectQuestionList:newList,
            currentQuestionList:nowPageList
        })
    }
    onPageChange = (pagenum)=>{
        let nowPageList = (this.state.selectQuestionList).slice((10*pagenum-10),(10*pagenum));
        this.setState({
            currentPage:pagenum,
            currentQuestionList:nowPageList
        })
    }
    closeKnowledgeBox(){
        UE.delEditor('knowledgeContainer');
        this.setState({DialogMaskFlag:false})
    }
    doIt(data){
        let id = data.questionid;
        this.props.actions.getAllChildOfQuestion({
            body:[{id:id}],
            success:(data)=>{
                console.log("getAllChildOfQuestion--===-->",data);
                this.setState({
                    modalVisible:true,
                    currentQuestionId:id,
                    questionDetails:data[0].data})
            },
            error:(mes)=>{
                console.error(mes)
            }
        })
    }
    _optionList(data){
        let options = data.get('items');
        if(options.size>0){
            return options.map((item,index)=>{
                return <Option key={item.get('province')}>{item.get('province')}</Option>
            })
        }
    }
    setModalVisible(flag){
        this.setState({modalVisible:flag})
    }
    //试题列表
    _questionList(list){
        let arraylist = list;
        console.log(arraylist)
        return arraylist.map(function(item,index){
            let options = item.optionselect;
            let options_end = options.trim().replace(/["\[\]]/g,"");
            let optionArray = options_end.split(",");
            let answerFlag = '';
            let content = item.content;
            if(!content){
                return <div className="every-li-css" key={index}></div>
            }
            if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
                content = content.replace(/\s/g,'');
                content = content.replace(/<u>blank<\/u>|blank|BLANK/g,'____')
            }
            return (
                <div className="every-li-css" key={index}>
                    <li>
                        <fieldset className="fieldcontent">
                            <div className="content" dangerouslySetInnerHTML={{__html:content}}>
                            </div>
                            <div className="options">
                                { optionArray.length<4 ? "":<div>
                                    <div className="col-md-3">
                                        <label className="checkbox-inline">
                                            <span className={answerFlag=='A' ? 'question-answer-2':'question-answer-1'}>(A)、</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[0])}}></span></label>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="checkbox-inline">
                                            <span className={answerFlag=='B' ? 'question-answer-2':'question-answer-1'}>(B)、</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[1])}}></span></label>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="checkbox-inline">
                                            <span className={answerFlag=='C' ? 'question-answer-2':'question-answer-1'}>(C)、</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[2])}}></span></label>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="checkbox-inline">
                                            <span className={answerFlag=='D' ? 'question-answer-2':'question-answer-1'}>(D)、</span><span dangerouslySetInnerHTML={{__html:base.decode(optionArray[3])}}></span></label>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>}
                            </div>
                        </fieldset>
                        <div className="fieldtip">
                            <div className="col-md-5">
                                <span>真题：1</span><span>难度：0.5</span>
                            </div>
                            <div className="col-md-7 right">
                                <span onClick={()=>this.doIt(item)}>作答</span>
                            </div>
                        </div>
                    </li>
                </div>
            )
        },this)
    }
    //做题详情页面，弹框显示的内容
    showAnalysis(data){
        $("#jiexiFlag").css("display","block")
    }
    submitAnswer(data){
        let target_value='',mysrc = '',sentdata={},isright = false,score = 0;
        if(data.questiontemplate == '选择题'){
            $("#modalQuestion .parts .options").find("ul input:checked").each(function(ii){
                target_value += $(this).val();
            })
            isright = ((data.answer).trim() == target_value) ? true:false
        }else {//先统一当做选择题来做
            let truethAnswer = data.answer.split("||");//题目的真实答案
            let myvalue = '',myanswerright=true;
            $("#solition ").find(".div_input").each(function(i){
                console.log("target_value--->",$(this));
                if($(this).children('img').length>0){//先查找公式编辑器输入的内容即用编辑器输入的会产生一个img标签，没有则直接查text
                    mysrc = mysrc + $(this).find('img')[0].src +"||";
                    myvalue = $(this).find('img')[0].dataset.latex;
                }else{
                    myvalue = $(this).text() ;
                }
                target_value = target_value + myvalue + "||";//将填写的答案拼接起来
                if(!(truethAnswer[i].trim() == target_value)){//只要有一个空的答案错了 则此题为错
                    myanswerright = false;
                }
            })
            isright = myanswerright;
        }
        if(!target_value){
            alert("请选择或填写答案！")
            return ;
        }
        if(!isright){
            $("#modalQuestion .reslutimg").append('<span style="color:red">做错了。。。</span>')
        }else{
            $("#modalQuestion .reslutimg").append('<span>做对了！</span>')
        }
        score = isright ? data.totalpoints : 0;
        sentdata = {
            userId: Storage_S.getItem('userid'),
            questionData: JSON.stringify(data),
            whereFrom:"考点复习",
            answer:target_value,
            isRight:isright,
            score:score,
            url:mysrc
        }
        this.props.actions.setThematicQuestionAnswerInfo({
            body:sentdata,
            success:(data)=>{
                console.log("getAllChildOfQuestion--===-->",data);
                message.success("提交成功")
            },
            error:(mes)=>{
                console.error(mes)
            }
        })
    }
    getKnowledge(e){
        console.log($(e.target)[0].innerText)
        let knowledge = $(e.target)[0].innerText;
        console.log("getKnowledge-----constructor--------props--->",this.props.location.pathname)
        //this.props.actions.push(`/home/math/knowledge/${knowledge}`)
        this.setState({DialogMaskFlag:true,knowledgeName:knowledge})
    }
    selectorChange(e,flag){
        let type = e.target.text;
        switch (type){
            case "全部": this.getCurrentDate('全部');
                break;
            case "选择题": this.getCurrentDate('选择题');
                break;
            case "填空题": this.getCurrentDate('填空题');
                break;
            case "简答题": this.getCurrentDate('简答题');
                break;
            default: this.getCurrentDate('全部');
                break;
        }
    }
    handleChange(value){
        console.log(`Selected: ${value}`);
    }
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys);
    }
    _fromContent(data){
        console.log("当前题的ID：",data[0])
        if(data.length<1) return;
        let item = data[0];
        let questionType=false;
        if(item.questiontemplate == '选择题'){
            questionType = true;//有两个选项以上
        }
        let content = item.content;
        let count = 0;//填空题空的个数
        let answerList=[];
        if (content.indexOf("blank") != -1 || content.indexOf("BLANK") != -1) {//如果有则去掉所有空格和blank
            let mathStr = "blank|BLANK|#BLANK#|#blank#";
            let regex = new RegExp(mathStr, 'g'); // 使用g表示整个字符串都要匹配
            let result = content.match(regex);
            count = !result ? 0 : result.length;
            content = content.replace(/blank|BLANK|#BLANK#|#blank#/g,'__')
            for(let i=0;i<count;i++){
                answerList.push(<span contentEditable="true" className="div_input"></span>)
            }
        }
        console.log("填空题 空的个数：：",count)
        return(
            <fieldset id="modalQuestion" className="modal-main-content">
                <div className="parts">
                    <div className="content" dangerouslySetInnerHTML={{__html:content}}>
                    </div>
                    <div className="options">
                        <ul>
                            {questionType?<MultipleChoice type={item.questiontype} answer={''} index={1} choiceList={item.optionselect} />:''}
                        </ul>
                    </div>
                </div>
                <div className="parts answerContent">
                    {questionType ? "":<li id="solition" style={{paddingTop:"5px"}}>解：<span contentEditable="true" className="div_input"></span><span className="answerTips">(有两个答案的用分号"；"隔开奥)</span></li>}
                </div>
                <hr/>
                <div className="parts btn-jiexi">
                    <button onClick={()=>this.submitAnswer(item)}>提交</button>
                    <button onClick={()=>this.showAnalysis(item)}>解析</button></div>
                <div id="jiexiFlag" style={{display:"none"}}>
                    <div className="parts part-review">
                        <p>考点：{(item.knowledge.split('；')).length>0 ? (item.knowledge.split('；')).map((item,index)=>{
                            return <span className="head" key={index} onClick={(e)=>this.getKnowledge(e)}>{item}</span>
                        }):""}</p>
                    </div>
                    <div className="parts part-analysis">
                        <p>分析：<span className="head" dangerouslySetInnerHTML={{__html:item.analysis}}></span></p>
                    </div>
                    <div className="parts part-reslution">
                        <p>解答：<span className="head" dangerouslySetInnerHTML={{__html:item.answer}}></span></p>
                    </div>
                </div>
                {!this.state.DialogMaskFlag?"":<DialogMask title={this.state.knowledgeName} closeDialog={()=>this.closeKnowledgeBox()}><Knowledge questionId={item.questionid}  knowledgeName={this.state.knowledgeName} /></DialogMask>}
            </fieldset>
        )
    }
    _chapterMenu(list){
        if(list.length<1) return;
        return list.map(function(item,index){
            return (
                <TreeNode title={item.knowledge} key={item.knowledgeid}>
            {item.child.length>0?item.child.map(function(item2,index2){
                return (
                    <TreeNode title={item2.knowledge} key={item2.knowledgeid}></TreeNode>
                )
            }):""}
            </TreeNode>
            )
        },this)
    }
    handleClick = (e) => {
        console.log('click ', e);
    }
    exitOut(){
        setTimeout(()=>{
            this.props.actions.goBack();
        },500)
    }
    handleSelectChange1 = (value)=>{
        let data = this.state.allChapterList[value];
        let selectedKeys = [];
        selectedKeys[0] = this.state.allChapterList[value].knowledge;
        console.log('handleSelectChange1111 ', value,selectedKeys);
        this.setState({childOfChapterList:data,selectedKeys:selectedKeys})
    }
    handleSelectChange2 = (value)=>{
        console.log('select ', value);
        let selectedKeys = this.state.selectedKeys;
        selectedKeys[1] = "--"+(this.state.childOfChapterList.child)[value].knowledge;
        console.log('handleSelectChange2222 ', value,selectedKeys);
        this.setState({selectedKeys:selectedKeys})
    }
    render(){
        let { provinceList } = this.props;
        let {childOfChapterList,allChapterList,selectedKeys} = this.state;
        let error = PureRenderMixin.Compare([provinceList]);//优化render
        let height_h = $(window).height()-90;
        const sentionH = {
            height:height_h+"px",
            backgroundColor:'#dbf5ef'
        }
        return (
            <div className="mask2" style={{backgroundColor:'#ead4ae'}}>
                <div className="thematic-wapper">
                    <div className="thematicExitBtn treeNodeUnselectable" onClick={()=>{this.exitOut()}}>返回</div>
                    <div className="thematic-parts-header">
                        <div className="part">
                            章节：<Select style={{ width: 200 }} onChange={this.handleSelectChange1}>
                                    {allChapterList.length>0 ? allChapterList.map((item,index)=>{
                                        return <Option value={index} key={index}>{item.knowledge}</Option>
                                    }):""}
                                </Select>
                        </div>
                        <div className="part">
                            讲：<Select style={{ width: 200 }} onChange={this.handleSelectChange2}>
                                {childOfChapterList.knowledge && childOfChapterList.child.length>0 ? childOfChapterList.child.map((item,index)=>{
                                    return <Option value={index} key={index}>{item.knowledge}</Option>
                                }):""}
                            </Select>
                        </div>
                        <div className="part">{selectedKeys.length>0 ? selectedKeys.map((item,index)=>{
                            return <span key={index}>{item}</span>
                        }):""}</div>
                    </div>
                    <div className="thematic-parts-section">
                        <div className="thematic-parts-left">
                            <div className="examPointMenu">考点目录</div>
                            <div className="menuList">
                                <Menu
                                    onClick={this.handleClick}
                                    style={{ width: "100%"}}
                                    mode="inline"
                                >
                                    <SubMenu key="1" title={<span><Icon type="bars" /><span>知识点回顾</span></span>}>
                                        <Tree
                                            onSelect={this.onSelect}
                                        >
                                            {this._chapterMenu(allChapterList)}
                                        </Tree>
                                    </SubMenu>
                                    <SubMenu key="2" title={<span><Icon type="bars" /><span>重点考点、备考思路</span></span>}>
                                    </SubMenu>
                                    <SubMenu key="3" title={<span><Icon type="bars" /><span>聚焦中考</span></span>}>
                                    </SubMenu>
                                    <SubMenu key="4" title={<span><Icon type="bars" /><span>真题过关</span></span>}>
                                    </SubMenu>
                                </Menu>
                            </div>
                        </div>
                        <section className="thematic-parts-right" style={sentionH}>
                            <div className="thematicQues-parts">
                                <div className="partOne" style={{backgroundColor:'white'}}>
                                    <div className="selectorLine">
                                        <div className="selector-key"><strong>地区：</strong></div>
                                        <div className="selector-value">
                                            <Select size="default" defaultValue="全部" onChange={this.handleChange} style={{ width: 100,height:26 }}>
                                                <Option key="全部">全部</Option>
                                                {error ? this._optionList(provinceList):""}
                                            </Select>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                    <div className="selectorLine">
                                        <div className="selector-key"><strong>题型：</strong></div>
                                        <div className="selector-value">
                                            <ul>
                                                <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>全部</a></li>
                                                <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>选择题</a></li>
                                                <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>填空题</a></li>
                                                <li><a href="javascript:void(0)" onClick={(e)=>this.selectorChange(e,'tx')}>简答题</a></li>
                                            </ul>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                    <div className="questionNumber">找到<span style={{color:'red'}}>{this.state.totalNum}</span>个相关题</div>
                                </div>
                                <div className="partTwo">
                                    <div className="pageslist">
                                        <ul>
                                            {this._questionList(this.state.currentQuestionList)}
                                        </ul>
                                        <Modal
                                            title="试题详情"
                                            wrapClassName="vertical-center-modal resetCss"
                                            visible={this.state.modalVisible}
                                            maskClosable={false}
                                            closable={false}
                                            destroyOnClose={true}
                                            onOk={() => this.setModalVisible(false)}
                                            onCancel={() => this.setModalVisible(false)}
                                        >
                                            {this._fromContent(this.state.questionDetails)}
                                        </Modal>
                                    </div>
                                    <div className="pagesfooter">
                                        <Pagination showQuickJumper itemRender={itemRender} pageSize={10} current={this.state.currentPage} total={this.state.totalNum} onChange={this.onPageChange}></Pagination>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        provinceList: state.provinceList
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({push,goBack,getAllQuestionOfThematic,getProvinceList,getAllChildOfQuestion,getKnowledgeIdList,setThematicQuestionAnswerInfo}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ThematicExamPoints)
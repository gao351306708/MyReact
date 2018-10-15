/**
 * Created by gaoju on 2017/11/15.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon } from 'antd'
// redux
import { bindActionCreators } from 'redux'
import PureRenderMixin from '../../method_public/pure-render'
import { connect } from 'react-redux'
import { push ,replace} from 'react-router-redux'
import {handleImg} from '../../method_public/public'
import {updateStoreHeadImg} from '../../redux/actions/public'
import {Storage_S} from '../../config'

const SubMenu = Menu.SubMenu;
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            route:'basic',
            activeName:window.location.hash.split('/')[window.location.hash.split('/').length-1]
        };
        this.exitOut = this.exitOut.bind(this);
    };
    componentDidMount(){
        let headimg = Storage_S.getItem('headimg');
        let screenHeight = document.documentElement.clientHeight;
        let screenWeight = document.documentElement.clientWidth;
        console.log(screenWeight,screenHeight)
        document.body.style.backgroundColor = '#F5F5F5';
        document.getElementById("section").style.height = (screenHeight-80-40)+'px';
        this.props.actions.updateStoreHeadImg({data:headimg,clear:false})//当页面刷新store会重置，需要重新更新store
    };
    handleClick = (e) => {
        let route='';
        let routeflag=e.keyPath.pop();
        if(routeflag == "basic"){
            route = "basic/"+e.key;
            this.props.actions.push(`/home/${route}`)
        }else if(routeflag == "math"){
            route = e.key;
            this.props.actions.push(`/home/${route}`)
        }else if(routeflag == 'excisetip'){
            route = e.key;
            this.props.actions.push(`/home/${route}`)
        }
        //this.setState({
        //    activeName: route
        //})
    };
    exitOut(){
        if(window.confirm("确定要退出吗？")){
            sessionStorage.clear();
            this.props.actions.updateStoreHeadImg({data:'',clear:true})//清除store中的数据
            this.props.actions.replace('/');
        }else {
            console.log("不想退出你点击干嘛？")
        }
    };
    render() {
        let { userheadimg} = this.props;
        return (
            <div className="home">
                <header id="header-home" className="flex-box box-align-center justify-center">
                    <div className="full-width position-relative width-max-xxlarge">
                        <div className="logolay"><a href="http://www.idiil.com.cn/index.html" ><img src="public/images/uu14.png"/></a></div>
                        <div className="floatR displayflex">
                            <div><img className="door-headerimg" src={handleImg(userheadimg.get('headimg'))} /></div>
                            <div className="header-logout" onClick={this.exitOut}>退出</div>
                        </div>
                    </div>
                </header>
                <section id="section" className="flex-box section-all">
                    <menu className="menu-css">
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: 180}}
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['basic']}
                            mode="inline"
                        >
                            <SubMenu key="basic" title={<span><Icon type="bars" /><span>我的栏目</span></span>}>
                                <Menu.Item key="basicInfo">基本信息</Menu.Item>
                                <Menu.Item key="myCollection">我的收藏</Menu.Item>
                                <Menu.Item key="myExamPaper">已做试卷</Menu.Item>
                                <Menu.Item key="echartsDetails">图表分析</Menu.Item>
                            </SubMenu>
                            <Menu.Item key="math"><Icon type="code-o" />数学栏目</Menu.Item>
                            <Menu.Item key="excisetip"><Icon type="code-o" />中考资讯</Menu.Item>
                        </Menu>
                    </menu>
                    <section className="full-width section-left">
                        <div>{this.props.children}</div>
                    </section>
                </section>
            </div>
        );
    }
}
function mapStateToProps(state, ownProps) {
    return {
        userheadimg: state.userheadimg
    }
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,replace,updateStoreHeadImg}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

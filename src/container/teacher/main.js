/**
 * Created by gaoju on 2018/6/26.
 */
import React,{Component} from 'react'
import './style.css'
import { Menu, Icon } from 'antd'
// redux
import { bindActionCreators } from 'redux'
import PureRenderMixin from '../../method_public/pure-render'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {allUsers } from '../../redux/actions/user'

const SubMenu = Menu.SubMenu;
class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeName:[]
        };
        this.exitOut = this.exitOut.bind(this);
    };
    componentDidMount(){
        document.body.style.backgroundColor = '#F5F5F5';
        let screenHeight = document.documentElement.clientHeight;
        let screenWeight = document.documentElement.clientWidth;
        document.getElementById("section").style.height = (screenHeight-80-40)+'px';
        this.props.actions.allUsers({
            body: {},
            success: (data) => {
                console.log("all studentImg ---->>",data)
                this.setState({activeName:data})
            },
            error: (message) => {
                console.log(message)
            }
        })

    };
    shouldComponentUpdate(nextProps,nextState){
        return true
    }
    handleClick = (e) => {
        console.log('click ', e);
        let route='';
        route = "papers/"+e.key;
        this.props.actions.push(`/main/${route}`)
    };
    exitOut(){
        if(window.confirm("确定要退出吗？")){
            sessionStorage.clear();
            this.props.actions.push('/');
        }else {
            console.log("不想退出你点击干嘛？")
        }
    };
    _MenuList(list){
        console.log("_MenuList-======-->",list)
        if(list.length>0){
           return list.map((item,index)=>{
                return <Menu.Item key={item.userid}>{item.username}</Menu.Item>
            })
        }
    }
    render() {
        let studentList = this.state.activeName;
        return (
            <div className="TeacherMain home">
                <header id="header-home" className="flex-box box-align-center justify-center">
                    <div className="full-width position-relative width-max-xxlarge">
                        <div className="logolay"><a href="http://www.idiil.com.cn/index.html" ><img src="../public/images/uu14.png"/></a>
                        </div>
                        <div className="header-check-btn" onClick={this.exitOut}>退出</div>
                    </div>
                </header>
                <section id="section" className="flex-box section-all">
                    <menu className="menu-css">
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: 180}}
                            defaultOpenKeys={['basic']}
                            mode="inline"
                        >
                            <SubMenu key="basic" title={<span><Icon type="user" /><span>学生</span></span>}>
                                {this._MenuList(studentList)}
                            </SubMenu>
                        </Menu>
                    </menu>
                    <section className="full-width section-left">
                        {this.props.children}
                    </section>
                </section>
            </div>
        );
    }
}
function mapStateToProps(state, ownProps) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,allUsers}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

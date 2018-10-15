/**
 * Created by gaoju on 2017/11/15.
 */
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Form, Menu, Dropdown, Icon, Input, Button } from 'antd'
import 'antd/dist/antd.css';
import './style.css'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {login } from '../../redux/actions/teacher'
import {Storage_S} from '../../config'

const FormItem = Form.Item;
class Door extends Component {
    constructor(props) {
        super(props);
        const { getFieldDecorator, getFieldsError, getFieldError} = this.props.form;
    }
    componentDidMount(){
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.actions.login({
                    body: {
                        name: values.userName,
                        password: values.password
                    },
                    success: (data) => {
                        Storage_S.setItem('username', values.userName)
                        Storage_S.setItem('userid', data[0].userid)
                        this.props.actions.push('main')
                    },
                    error: (message) => {
                        this.props.form.setFields({
                            password: {
                                errors: [new Error(message || "数据错误")]
                            }
                        });
                    }
                })
            }
        });
    };
    render() {
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        };
        return (
            <div className="door">
                <header id="header" className="header2 flex-box box-align-center justify-center">
                    <div className="full-width position-relative width-max-xxlarge">
                        <div className="logolay"><a href="http://www.idiil.com.cn/index.html" ><img src="../public/images/uu14.png"/></a></div>
                    </div>
                </header>
                <div className="mainWapper">
                    <section className="banner-wapper2">
                        <div className="teacherFormLogin">
                            <Form onSubmit={this.handleSubmit} className="login-form margin-auto">
                                <FormItem {...formItemLayout} label="用户名">
                                    {getFieldDecorator('userName', {
                                        rules: [{ required: true, message: '请输入用户名!' }]
                                    })(
                                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="密码">
                                    {getFieldDecorator('password', {
                                        rules: [{
                                            required: true,
                                            message: '请输入密码!'
                                        }]
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                                    )}
                                </FormItem>
                                <FormItem wrapperCol={{ span: 15, offset: 5 }}>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        登 录
                                    </Button>
                                </FormItem>
                            </Form>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
const teacherDoor = Form.create()(Door);
//将redux中state的对象与组件绑定起来。一一对应map对象
function mapStateToProps(state,ownProps) {
    return {}
}
//使用bindActionCreators绑定action
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push,login}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(teacherDoor)
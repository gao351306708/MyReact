/**
 * Created by gaoju on 2017/12/6.
 */
/**
 * Created by gaoju on 2017/11/16.
 */
import React ,{Component} from 'react'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import { push } from 'react-router-redux'
import {resetPassword} from '../../redux/actions/user'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import './style.css'

const FormItem = Form.Item;
class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        const { getFieldDecorator, getFieldsError, getFieldError} = this.props.form
        this.state={
            confirmDirty: false,
            checkPass:true
        }
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('请输入与上面密码相同的密码!');
        } else {
            callback();
        }
    }
    checkPhone = (rule, value, callback) => {
        console.log("phone:"+value)
        if (value && (value.length != 11) ) {
            callback('请输入正确手机号（11位数字）!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.actions.resetPassword({
                    body: {
                        username: values.nickname,
                        phone: values.phone,
                        new_password: values.password
                    },
                    success: (data) => {
                        console.log("register success:"+data)
                        alert("密码重置成功")
                        this.props.actions.push('/')
                    },
                    error: (message) => {
                        this.props.form.setFields({
                            phone: {
                                value: values.phone,
                                errors: [new Error(message)]
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
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 8,
                    offset: 8
                }
            }
        };
        return (
            <div className="register">
                <header className="flex-box box-align-center justify-center">
                    <div className="full-width position-relative width-max-xxlarge">
                        <div className="logolay"><a href="http://www.idiil.com.cn/index.html" ><img src="public/images/uu14.png"/></a></div>
                        <div className="header-check-btn header-left-font">
                            <span>已有账号？</span>
                            <Link to="/" style={{color:"#333"}}>请登录</Link>
                        </div>
                    </div>
                </header>
                <section>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="用户名"
                            hasFeedback
                        >
                            {getFieldDecorator('nickname', {
                                rules: [{ required: true, message: '请输入用户名!', whitespace: true }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="手机号"
                        >
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: '请输入手机号!' }],
                            },{
                                validator: this.checkPhone
                            })(
                                <Input type="number" style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="新密码"
                            hasFeedback
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '请输入新密码!',
                                }, {
                                    validator: this.checkConfirm,
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="确认新密码"
                            hasFeedback
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: '请再次输入密码确认!'
                                }, {
                                    validator: this.checkPassword
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button className="full-width" type="primary" htmlType="submit">重置密码</Button>
                        </FormItem>
                    </Form>
                </section>
                <footer>
                    <div className="content">
                        <div className="content-left">
                            <p>总公司地址：北京市海淀区信息路28号科实大厦B-07A-1</p>
                            <p>联系电话：010-62984888</p>
                            <p>版权所有:美国爱迪乐教育研究院爱迪乐学习中心 京ICP备10015906号 京公网安备11010802021421号</p>
                        </div>
                        <div className="content-right">
                            <img src="public/images/u84.png"/>
                        </div>
                    </div>
                </footer>
            </div>

        );
    }

}
const ResetPassword = Form.create()(ForgotPassword);
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ push, resetPassword}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)

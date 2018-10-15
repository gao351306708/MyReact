/**
 * Created by gaoju on 2018/7/3.
 */
import React ,{Component} from 'react'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import { push } from 'react-router-redux'
import {teacherRegister} from '../../redux/actions/teacher'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import './style.css'

const FormItem = Form.Item;
class RegisterForm extends Component {
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
                this.props.actions.teacherRegister({
                    body: {
                        username: values.nickname,
                        password: values.password
                    },
                    success: (data) => {
                        console.log("register success:"+data)
                        alert("恭喜您，注册成功！！！")
                        this.props.actions.push('/')
                    },
                    error: (message) => {
                        this.props.form.setFields({
                            nickname: {
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
                            label="密码"
                            hasFeedback
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '请输入密码!',
                                }, {
                                    validator: this.checkConfirm,
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="确认密码"
                            hasFeedback
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: '请输入确认密码!'
                                }, {
                                    validator: this.checkPassword
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button className="full-width" type="primary" htmlType="submit">注册</Button>
                        </FormItem>
                    </Form>
                </section>
            </div>

        );
    }

}
const Register = Form.create()(RegisterForm);
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ push, teacherRegister}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Register)

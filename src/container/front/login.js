/**
 * Created by gaoju on 2017/11/16.
 */
import React ,{Component} from 'react'
import { Link } from 'react-router'
// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push,replace } from 'react-router-redux'
import {login } from '../../redux/actions/user'
import {Storage_S} from '../../config'
import { Form, Icon, Input, Button, Checkbox, Modal} from 'antd'
import {updateStoreHeadImg} from '../../redux/actions/public'
import './style.css'

const FormItem = Form.Item;
class LoginForm extends Component {
    constructor(props) {
        super(props);
        const { getFieldDecorator, getFieldsError, getFieldError} = this.props.form;
        this.state={
            modalVisible: false,
            title:props.title || "登录",
            style:props.style || ''
        }
    }
    setModalVisible(modalVisible) {
        this.setState({modalVisible});
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.actions.login({
                    body: {
                        name: values.userName,
                        password: values.password
                    },
                    success: (data) => {
                        console.log("login====>>>>",data);
                        Storage_S.setItem('username', data[0].username)
                        Storage_S.setItem('loginstatus',true)
                        Storage_S.setItem('userid', data[0].userid)
                        Storage_S.setItem('headimg', data[0].headimg)
                        this.props.actions.updateStoreHeadImg({data:data[0].headimg,clear:false})
                        this.props.actions.replace('home')
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
            <div>
                <a type="primary" className={this.state.style} onClick={() => this.setModalVisible(true)}>{this.state.title}</a>
                <Modal
                    title="登录"
                    footer=""
                    maskClosable={false}
                    wrapClassName="vertical-center-modal"
                    visible={this.state.modalVisible}
                    onCancel={() => this.setModalVisible(false)}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form margin-auto">
                        <FormItem {...formItemLayout} label="用户名">
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }]
                            })(
                                <Input autoComplete="text" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="密码">
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true,
                                    message: '请输入密码!'
                                }]
                            })(
                                <Input autoComplete="text" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                            )}
                        </FormItem>
                        <FormItem wrapperCol={{ span: 15, offset: 5 }}>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登 录
                            </Button>
                            <Link to="/register">立即注册</Link>
                            <Link className="login-form-forgot" to="/forgotpassword">忘记密码</Link>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }

}
const Login = Form.create()(LoginForm);
function mapStateToProps(state) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ push,replace,login,updateStoreHeadImg}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
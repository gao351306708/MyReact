/**
 * @desc 用户 控制器
 * @dateTime 2017-11-29
 **/

var User = require('../../database/user.db');
var Helper = require('../helper');
//var doGetUserBasicInfo = require('../userModule/getUserInfo')//将处理函数单独放在一个模块文件中来处理。

module.exports = {
    // 模块初始化
    init: function(app) {
        app.get('/user', this.doGetUserAllItems);
        app.post('/user/token', this.doGetUserItemByPhone);
        app.post('/user/token_name', this.doGetUserItemByUserName);
        app.post('/user/password', this.doPutPassword);
        app.post('/user/register', this.doRegister);
        app.post('/user/resetPassword',this.doResetPassword);
        app.post('/user/basic_info', this.doGetUserBasicInfo);
        app.post('/user/updateBasicInfo',this.doUpdateBasicInfo);
        app.post('/user/updateHeadImg',this.doUpdateHeadImg);
        app.post('/user/getCollection',this.doGetCollection)
    },
    // 获取所有用户信息
    doGetUserAllItems: function(req, res) {
        var props = {};
        var user = new User({props: props});
        user.getUserAllItems(function(err, data) {
            if(!err){
                if (data.length) {
                    return res.send({
                        code: 200,
                        data: data
                    })
                } else {
                    console.log(data)
                    return res.send({
                        code: 500,
                        message: '查询出错'
                    })
                }
            }else {
                console.log(err)
                return res.send({
                    code: 501,
                    message: '报出错了'
                })
            }
        })
    },
    // 用户登录，通过用户名登陆
    doGetUserItemByUserName: function(req, res) {
        var props = req.body;
        props.password = Helper.getMD5(req.body.password);
        var user = new User({ props: props });
        user.getUserItemByUserName(function(err, data) {
            if(!err){
                if (data.length>0) {
                    return res.send({
                        code: 200,
                        data: data
                    })
                } else {
                    return res.send({
                        code: 500,
                        message: '用户名不存在或密码错误'
                    })
                }
            }else {
                console.log(err)
                return res.send({
                    code: 501,
                    message: '报出错了'
                })
            }
        })
    },
    // 用户登录，通过手机号登陆
    doGetUserItemByPhone: function(req, res) {
        var props = req.body;
        props.password = Helper.getMD5(req.body.password);
        var user = new User({ props: props });
        user.getUserItemByPhone(function(err, data) {
            if(!err){
                if (data.length) {
                    console.log(data)
                    return res.send({
                        code: 200,
                        data: data
                    })
                } else {
                    return res.send({
                        code: 500,
                        message: '用户名或密码不正确'
                    })
                }
            }else {
                console.log(err)
                return res.send({
                    code: 501,
                    message: '报出错了'
                })
            }
        })
    },

    // 重置密码
    doPutPassword: function(req, res) {
        var props = {
            id: req.body.id,
            new_password: Helper.getMD5(req.body.new_password),
        };
        var user = new User({ props: props });
        user.putUserPassword(function(err, data) {
            if(!err){
                if (data.changedRows >= 0) {
                    return res.send({
                        code: 200
                    })
                } else {
                    return res.send({
                        code: 500,
                        message: '重置密码出错'
                    })
                }
            }else {
                return res.send({
                    code: 501,
                    message: '出错了'
                })
            }
        })
    },
    doResetPassword: function (req,res) {
        let props = req.body;
        let user = new User({props:props});
        user.getUserWithNameAndPwd(function (err,data) {
            if(!err){
                if(data.length>0){
                    let props = {
                        id: data[0].id,
                        new_password: Helper.getMD5(req.body.new_password)
                    };
                    let user = new User({props:props});
                    user.putUserPassword(function(err, data) {
                        if(!err){
                            return res.send({
                                code: 200,
                                message:data
                            })
                        }else {
                            return res.send({
                                code: 500,
                                message: '重置密码出错'
                            })
                        }
                    })
                }else {
                    return res.send({
                        code:500,
                        message:'此用户不存在或者手机号不正确'
                    })
                }
            }else {
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了'
                })
            }
        })
    },
    // 注册
    doRegister: function(req, res) {
        const params = {
            username:req.body.username
        };
        let user = new User({ props: params });
        //判断用户名是否存在
        user.getUserInfo(function(err, data){
            if(err){
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了0.0'
                });
            }
            if(data.length<1){
                const params = {};
                let user = new User({ props: params });
                //获取当前最新用户id
                user.getMaxUserId(function(err, data){
                    let num = data[0].userid;
                    let props = req.body;
                    if (num.length>0) {//有用户
                        props.idiilumber = Helper.createUserId(data[0].userid);
                    } else {
                        props.idiilumber = 'IDIIL00000001';//第一个用户
                    }
                    props.password = Helper.getMD5(req.body.password);
                    let user = new User({ props: props });
                    //添加新用户
                    user.addUser(function(err, data) {
                        if(err){
                            console.log(err)
                            return res.send({
                                code: 501,
                                message: '出错了0.0'
                            });
                        }
                        if (data.insertId>0) {
                            return res.send({
                                code: 200,
                                data:data.insertId
                            })
                        } else {
                            console.log(err)
                            return res.send({
                                code: 500,
                                type:'register',
                                message: '注册出错了,请重新注册'
                            })
                        }
                    })
                })
            }else {
                return res.send({
                    code: 500,
                    type:'username',
                    message: '用户名已存在，请重新输入！'
                })
            }
        })
    },
    doGetUserBasicInfo: function (req,res) {
        var props = {
            username: req.body.params
        };
        var user = new User({props:props});
        user.getUserBasicInfo(function(err,data){
            if(err){
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了0.0'
                });
            }
            if(data.length>0){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                return res.send({
                    code: 500,
                    message: '获取信息错误'
                })
            }
        })
    },
    doUpdateBasicInfo: function (req,res){
        var props = req.body;
        var user = new User({props:props});
        user.UpdateBasicInfo(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                return res.send({
                    code: 500,
                    message: '修改出错'
                })
            }
        })
    },
    doUpdateHeadImg: function (req,res){
        var props = req.body;
        var user = new User({props:props});
        user.UpdateHeadImg(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                return res.send({
                    code: 500,
                    message: '修改出错'
                })
            }
        })
    },
    doGetCollection: function(req,res){
        var props = req.body;
        var user = new User({props:props});
        user.getCollection(function(err,data){
            if(!err){
                return res.send({
                    code:200,
                    data:data
                })
            }else{
                return res.send({
                    code:501,
                    message:'获取数据出错'
                })
            }
        })
    }


}

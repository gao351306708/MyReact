/**
 * 目前没有用的接口。
 * Created by gaoju on 2018/6/28.
 */

var User = require('../../database/user.db');

var doGetUserBasicInfo = function (req,res) {
    var props = {
        username: req.body.params
    };
    var user = new User({props:props});
    user.getUserBasicInfo(function(err,data){
        console.log("getUserBasicInfo===>>>",data)
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
}
module.exports = doGetUserBasicInfo;
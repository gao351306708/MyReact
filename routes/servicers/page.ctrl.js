/**
 * Created by gaoju on 2018/1/9.
 */

var Page = require('../../database/page.db');

module.exports={
    init: function(app) {
        app.get('/page/homelist', this.doGetDoorShowItems);//获取首页展示学生列表信息
        app.get('/provinceList',this.getProvinceList);//获取省份的列表
    },
    // 获取首页展示学生的列表信息
    doGetDoorShowItems: function(req, res) {
        var props = {};
        var page = new Page({props: props});
        page.getDoorShowItems(function(err, data) {
            if(err){
                console.log(err)
                return res.send({
                    code: 501,
                    message: '出错了0.0'
                });
            }
            if (data.length>0) {
                return res.send({
                    code: 200,
                    data: data
                })
            } else {
                return res.send({
                    code: 500,
                    message: '出错了'
                })
            }
        })
    },
    getProvinceList:function(req,res){
        var page = new Page({props:{}});
        page.getProvinceList(function(err,data){
            if(!err){
                return res.send({
                    code: 200,
                    data:data
                });
            }else {
                return res.send({
                    code: 501,
                    message: '出错了0.0'
                });
            }
        })
    }
}
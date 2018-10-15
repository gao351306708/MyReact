/**
 * 查询页面基本信息
 * Created by gaoju on 2018/1/9.
 */

var helper = require('../routes/helper'),
    con = require('./config.db');

/*用户模块 构造方法*/
var Page = function(page) {
    this.props = page.props
};

/*获取首页展示的学生列表信息*/
Page.prototype.getDoorShowItems = function(callback) {
    var _sql = "select headimg,username,phone from tblUser limit 3";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getDoorShowItems',
        callback: callback
    })
};
/*获取所有省份*/
Page.prototype.getProvinceList = function(callback){
    var _spl = "select province from tblProvince";
    helper.db_query({
        connect:con,
        sql:_spl,
        name:"getProvinceList",
        callback:callback
    })
}

module.exports = Page
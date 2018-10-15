/**
 * 前端公用方法
 * Created by gaoju on 2017/11/15.
 */
import 'babel-polyfill'
import fetch from 'isomorphic-fetch'

//简单版 fetch数据请求
export function requestData(route,params,callback){
    //处理get请求有参数的，转换参数形式
    //const p = params ? '?' + Object.entries(params).map((i) => `${i[0]}=${encodeURI(i[1])}`).join('&') : '';
    //const url = `${ route }${ p }`;
    //let data = { method: method, headers: headers}
    //if (method !== 'GET') data.body = body
    //console.log(`[${method}]:${url}::${data}`,data)
    return fetch(route,params)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            const error = new Error(response.statusText);
            error.response = response;
            throw error;
        })
        .then((res) => {
            return callback(res)
        })
        .catch((err) => {
            console.warn(err)
            return callback(err)
        })
}
//判断用户是否登录
export function isAdmin(){
    let username = sessionStorage.getItem('username');
    console.log("session username------>",username)
    if(!username){
        return false;
    }else {
        return true;
    }
}
export function bodyUrlencoded(body) {
    if(body){
        let data = Object.entries(body);
        let str = `${data[0][0]}=${data[0][1]}`;
        data.forEach((item,i) => {
            if (i>0) {
                str+= `&&${item[0]}=${item[1]}`;
            }
        })
        return str
    }else {
        return ''
    }
}
export function parseURL(url) {
    let _url = url.replace(/&/g,'*');
    return _url
}

export function limitStringlength(str, length) {
    return str.substr(0, length) + '...'
}
//img加载处理，当没有正常加载显示时使用默认图片
export function handleImg(url){
    if(url && url!='undefined' && url!='null'){
        return url;
    }else {
        return 'public/images/default.jpg';
    }
}
//转码file文件为 base64
export function getBase64(img,callback) {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = function(e){
        callback(reader.result)
    }
}
//上传图片文件格式判断
export function beforeUpload(file) {
    if(file){
        const isJPG = file.type === 'image/png'||'image/jpg';
        const isNameType = file.name;
        if (!isJPG) {
            alert('只能上传png或者jpg格式的图片!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            alert('图片大小不能大于2M!');
        }
        return isJPG && isLt2M;
    }else {
        alert("请选择上传文件！")
        return false
    }
}
//年级格式转换
export function exchangeGrade(data) {
    if(data){
        let grade = data.toString();
        switch (grade) {
            case '1':return '一年级';
            case '2':return '二年级';
            case '3':return '三年级';
            case '4':return '四年级';
            case '5':return '五年级';
            case '6':return '六年级';
            case '7':return '初一';
            case '8':return '初二';
            case '9':return '初三';
            default:
                return ''
        }
    }else {
        return ''
    }
}
//获取当前点击的元素在页面中的位置
export function getCoords(el){
    var box = el.getBoundingClientRect(),
        doc = el.ownerDocument,
        body = doc.body,
        html = doc.documentElement,
        clientTop = html.clientTop || body.clientTop || 0,
        clientLeft = html.clientLeft || body.clientLeft || 0,
        top = box.top + (self.pageYOffset || html.scrollTop || body.scrollTop ) - clientTop,
        left = box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft;
    return { 'top': top, 'left': left };
}
//模糊查询，key为要匹配的字符；list为所有数据；obj为list中用来匹配的字段；
export function searchMatch(key,list,obj){
    var datalist = list,keyValue='';
    var reg = '';
    var endlist=[];
    if(!key){
        return '';
    }else {
        keyValue = key.replace('/\s/g','');//获取输入的值，去掉多有的空格
        reg = new RegExp(keyValue);
        for(let i in datalist){
            if((datalist[i][obj]).match(reg)){
                endlist.push(datalist[i]);
            }
        }
        return endlist;
    }
}
//模糊查询，key为要匹配的数组；list为所有数据
export function searchChechboxMatch(keylist,list){
    var datalist = list;
    var endlist=[];
    for(let i in datalist){
        let isdone='未完成';
        if(datalist[i].IsDone == 'yes'){
            isdone='已完成'
        }
        let dataArry = [datalist[i].ExamType,isdone,datalist[i].markFlag];//每一项的三个标志值
        if(subset(dataArry,keylist)){
            endlist.push(datalist[i]);
        }
    }
    return endlist;
}
//A是否包含B
function subset(A,B){
    A = A.slice();
    for(var i=0, len=B.length; i<len; i++){
        if(A.indexOf(B[i]) === -1){
            return false;
        }else{
            A.splice(A.indexOf(B[i]),1);
        }
    }
    return true;
}
//比较A和B的值是否相同
export function compareDifferent(A,B){
    var A = A.toString();
    var B = B.toString();
    var numA = A ? (A.replace(/\s/g,'')).replace(/<i>|<\/i>|<br>|<\/br>|<BR>|<\/BR>|<SUB>|<sub>|<sup>|<SUP>/g,'') : A;
    var numB = B ? (B.replace(/\s/g,'')).replace(/<i>|<\/i>|<br>|<\/br>|<BR>|<\/BR>|<SUB>|<sub>|<sup>|<SUP>/g,'') : B;
    try {
        var expr1 = KAS.parse(numA).expr;
        var expr2 = KAS.parse(numB).expr;
        var end = KAS.compare(expr1, expr2).equal;
        if(end){
            return true;
        }else {
            return false;
        }
    }catch (e){
        if(numA == numB){//处理KAS插件无法处理特殊字符的情况，在报错前先普通比较一下
            return true;
        }
        console.error("function compareDifferent is error: "+e.message+"; the params is : "+numA+" and "+numB);
        return false;
    }

}
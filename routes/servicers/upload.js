/**
 * 文件处理：上传、下载
 * Created by gaoju on 2018/1/16.
 */
const CONFIG_MAP = require('../../config')
const Helper = require('../helper')

module.exports={
    init: function(app) {
        app.post('/upload',this.doUpLoadFile);//上传文件
        app.get('/download',this.doDownLoadFile);//下载文件
    },
    doUpLoadFile: (req, res, next) => {
        let personflag = req.body.personflag;//那个角色上传的，有教师、学生。。教师为0，学生为1
        let imageFile = req.files.file;
        let foldername='',preUrl='',dateString='',target_path='';
        let whichfile = '';
        if(personflag == '0'){
            whichfile = 'teacherImg';
        }else if(personflag == '1'){
            whichfile = 'studentImg';
        }
        let path = `${CONFIG_MAP.root_path}/uploadImages/${whichfile}`
        foldername = req.body.username;
        preUrl = req.body.preurl;
        Helper.deleteFile((path+"/"+foldername),preUrl);//文件存在，删除文件
        dateString = Helper.randomString(true,5,16);//产生随机文件名
        target_path = Helper.createFolder(path,foldername);
        //将上传的图片移到指定目录
        imageFile.mv(`${target_path}/${dateString}.png`, function(err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({file: `${whichfile}/${foldername}/${dateString}.png`});
        });
    },
    doDownLoadFile:(req,res,next) =>{
        let file = req.query.name;
        //let file = 'readme.txt';
        let filepath = `${CONFIG_MAP.root_path}/docs/${file}`;
        console.log("doDownLoadFile===>>>",filepath,file);
        res.set('Content-Type','application/octet-stream');//D:\gaoju\Midexam\React\docs\readme.txt
        res.download(filepath);
    }
}

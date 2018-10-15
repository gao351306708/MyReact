/**
 * 单独拎出来的模块，由于此接口需要处理数据库返回的的数据，代码太多 还不如当做一个文件来处理。
 * 此接口查询某套试卷的所有题目，每个题目的所有子题。最终得到的是一个 json格式的dom树
 * Created by gaoju on 2018/8/20.
 *  select  * from tblExamPaper2Question where examid='6306179e-56af-484a-a2f2-92e20cd1295c' order by ordersn
    select  * from tblQuestion where parentid='Q_be4f1628-619c-4211-af76-c91e298a05ad'
    select  * from tblQuestion2Part  where questionid='Q_984268f2-d631-41dd-9f80-001f76bcbca3'  order by ordersn
    select  * from tblQuestionPart2Item  where partid='Q_def88163-1ff6-44d8-af29-d914b34e8027' order by ordersn
 *
 */
var Math = require('../../database/math.db');

//var questionAllJson = [];//总数据
var doGetAllChildOfExam = function (req,res) {
    var props = req.body;
    var questionAllJson = [];//总数据
    //查询每套试题对应的主题目
    var math = new Math({props:props});
    math.getQuestionsOfPaperList(async function(err,data){
        if(!err){
            //循环遍历每道题，查询对应信息
            for(let ii in data){
                let  questionid = data[ii].questionid;
                //查询每一个试题的子试题
                let childs =  await getQuestionChilds(questionid);
                data[ii].childs = childs;
                if(childs.length>0){
                    for (let m in childs){
                        let childid = childs[m].questionid;
                        //查询子题的子题
                        let childchilds =  await getQuestionChilds(questionid);
                        if(childchilds.length>0){
                            for (let n in childchilds){
                                let child_id = childchilds[n].questionid;
                                //查询每一个试题分五个部分
                                let data1 = await FillQuestionPart(child_id);
                                childchilds[n].childparts = data1
                                for(let j in data1){
                                    var id = data1[j].partid;
                                    //查询每一个部分的子信息
                                    let data2 = await FillQuestionPartItem(id);
                                    data1[j].childs = data2
                                }
                            }
                        }
                        //查询每一个试题分五个部分
                        let data1 = await FillQuestionPart(childid);
                        childs[m].childparts = data1
                        for(let j in data1){
                            var id = data1[j].partid;
                            //查询每一个部分的子信息
                            let data2 = await FillQuestionPartItem(id);
                            data1[j].childs = data2
                        }
                    }
                }
                //查询每一个试题分五个部分
                let data1 = await FillQuestionPart(questionid);
                data[ii].childparts = data1
                for(let j in data1){
                    var id = data1[j].partid;
                    //查询每一个部分的子信息
                    let data2 = await FillQuestionPartItem(id);
                    data1[j].childs = data2
                }
                questionAllJson = data;
            }
            return res.send({
                code:200,
                data:questionAllJson
            })
        }
    })
}
//查询每个主试题的小问题
async function getQuestionChilds(id){
    return new Promise((resolve,reject)=>{
        let math = new Math({props:{id:id}});
        math.getQuestionChild(function(err,data){
            if(!err){
                resolve(data)
            }
        })
    })
}
//查询试题的五个部分
async function FillQuestionPart(id){
    return new Promise((resolve,reject)=>{
        let  math = new Math({props:{id:id}});
        math.getChildQuestionsForQuestion(function(err,data){
            if(!err){
                resolve(data)
            }
        })
    })
}
//查询五个部分的信息
async function FillQuestionPartItem(id){
    return new Promise((resolve,reject)=>{
        let math = new Math({props:{id:id}});
        math.getContentOfChildItems(function (err,data) {
            if(!err){
                resolve(data);
            }
        })
    })

}

module.exports = doGetAllChildOfExam;
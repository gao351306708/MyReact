/**
 * 数据存储Json结构
 * Created by gaoju on 2018/4/23.
 */

export var sentJson_Question = {
    "ExamInfoID": "",
    "UserID": "",
    "ExamPaperID":"",
    "Score": "",
    "AllDone": "",
    "currentquesid": 0,
    "StartDate": "",
    "FinishDate": "",
    "SpendTime":0,
    "ExamType":"",
    "DoExamInfo":"",
    "ExamResult": []
};
//默认：二测数据中每一个试题下面子题的数据存储结构
/*
* answer= [
    {
     "content":"",
     "isTrue":false,
     "url":""
     }
   ]
* */
export var EveryChildInfo={
    "QuesID": "",
    "QuesType": "",
    "Contents": [],
    "score": 0,
    "knowledge":'',
    "childs": [
        {
            "Objective": [
            ],
            "Review": [
            ],
            "Analysis": [
            ],
            "Explain": [
            ],
            "Exercise1": [
            ],
            "Exercise2": [
            ]
        }
    ]
}
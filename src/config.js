/**
 * 项目前端配置
 * Created by gaoju on 2017/11/15.
 */

export const API_URI = '';
export const USER_KEY = '@GAOJU:USER';
export const WINDOW_HOST = window.location.origin;
export const Storage_S = window.sessionStorage;//session存储
export const Storage_L = window.localStorage;//本地存储缓存
export const QuestionScore=[3,3,5]//试题的分数，questionScore[0]：选择题分数，questionScore[1]：填空题，questionScore[2]：简答题

export const HEADERS = {
    'Accept': 'application/json',
    'Content-Type' : 'application/json; charset=UTF-8',
    'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
    'Host': API_URI,
    'Referer': 'http://' + API_URI + '/',
};
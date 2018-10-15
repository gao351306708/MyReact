/**
 * Created by gaoju on 2018/1/16.
 */
import { requestData } from '../../method_public/public'
import { bodyUrlencoded } from '../../method_public/public'

//文件上传接口
export function upload(opt) {
    return () => {
        const route = '/api/upload';
        requestData(route,opt.body,opt.callback)
    }
}
//文件下载接口
export function downloadFile(opt) {
    return () => {
        const route = '/api/download';
    }
}
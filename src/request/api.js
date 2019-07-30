import $axios from './axios';
import qs from 'qs';
import url from '../utils/config';

let getData = function (projName, path, json) { //封装请求
    let d = new Object();
    d.token = "123456";
    d.projName = projName;
    d.path = path;
    d.json = JSON.stringify(json);
    return d;
}
let strCase = function (str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

const api ={
    /** 
     * get方法， 对应get请求 post对应post请求
     * @param {String} url.url_base [请求的url地址] 
     * @param {String} table [请求时携带的参数(数据库表名)] 
     * @param {Object} json [请求时携带的参数(对象)]
     */

    //查询接口
    queryForMap(table, json) {
        return $axios.get(url.url_base, {
            params: getData("AE_API", `/https/${table}/queryForMap.do`, json)
        })
    },

    //分页接口
    getPageInfo(table, json) {
      return $axios.get(url.url_base, {
        params: getData("AE_API", `/https/${table}/getPageInfo.do`, json)
      })
    },

    getDataByPage(table,json) {
        return $axios.get(url.url_base, {
            params: getData("AE_API", `/https/${table}/get${strCase(table)}sByPage.do`, json)
        })
    },

    //登录接口
    login(json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/user/loginByPwd.do", json)))
    },

    //根据id查询详情接口
    getDetailById(table, json) {
        return $axios.get(url.url_base, {
            params: getData("AE_API", `/https/${table}/get${strCase(table)}.do`, json)
        })
    },

    //添加接口
    add(table,json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_API", `/https/${table}/add.do`, json)))
    },
    //批量添加接口
    adds(table, json) {
      return $axios.post(url.url_base, qs.stringify(getData("AE_API", `/https/${table}/adds.do`, json)))
    },
    //拓展接口，传sql
    exec(table, json) {
      return $axios.post(url.url_base, qs.stringify(getData("AE_API", `/https/${table}/exec.do`, json)))
    },

    //生成订单id用于支付接口
    getUserOrderId(json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/wxEnroll.do", json)))
    },

    //更改支付状态接口
    updatePayStatus(json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/updatePayStatus.do", json)))
    },

    //更新接口
    update(table,json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_API", `/https/${table}/update.do`, json)))
    },

    //删除接口
    deleteByIds(table,json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_API", `/https/${table}/deleteByIds.do`, json)))
    },

    //发送验证码接口
    getCode(json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/identifyingCode/getCode.do", json)))
    },

    //发送短信接口
    sendMsg(json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/sendMsg.do", json)))
    },

    //发起退班
    retireClass(json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/retireClass.do", json)))
    },

    //退班撤回
    retireClassRevoke (json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/retireClassRevoke.do", json)))
    },

    //删除已关闭的退班
    retireClassDelete (json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/retireClassDelete.do", json)))
    },

    //发起调班
    classTransfer(json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/transferClass.do", json)))
    },

    //调班审核通过
    transferClassCheckOut (json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/transferClassCheckOut.do", json)))
    },

    //调班审核不通过
    transferClassNoApprove (json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/transferClassNoApprove.do", json)))
    },

    //调班撤回
    transferClassRevoke (json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/transferClassRevoke.do", json)))
    },

    //删除已关闭的调班
    transferClassDelete (json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/transferClassDelete.do", json)))
    },

    //获取调班价格
    getTransferClassPayable (json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/activityEnroll/getTransferClassPayable.do", json)))
    },

    //获取订单列表
    getUserOrderList(json) {
        return $axios.get(url.url_base, {
            params: getData("AE_EXT_API", "/https/userOrder/getUserOrderList.do", json)
        })
    },

    //重置订单编号
    resetOrderNumber(json) {
        return $axios.post(url.url_base, qs.stringify(getData("AE_EXT_API", "/https/userOrder/resetOrderNumber.do", json)))
    },
}

export default api;
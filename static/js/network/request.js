/**
 http://api.gaoshiwang.cn/docs/
 扩展一个网络请求模块
 **/
// var urlPrefix = 'http://localhost:8080/HotelManage/';
var urlPrefix = 'http://api.gaoshiwang.cn';

/**
 * 用法如下：

 //定义一个模板拓展路劲
 layui.extend({
  request: '{/}./static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
})
 //引用模板
 //使用拓展模块
 layui.use(['request', 'mod1'], function(){
  var request = layui.request
  ,mod1 = layui.mod1
  ,mod2 = layui.mod2;
  //调用模板里面的网络请求方法
  request.doGet('login',{
  username:username,
  password:password
  },function(response){
  //这里是接口请求返回的数据
  });
});



 */
layui.define(['jquery', 'layer'], function (exports) { //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var $ = layui.jquery;
    var layer = layui.layer;

    var obj = {
        /**
         * 获取一个get请求
         * @param url 请求的网络接口路劲
         * @param data 请求的数据对象
         * @param callback 请求返回结果回调
         */
        doGet: function (url, data, callback) {
            doRequest('GET', url, data, callback);
        },
        /**
         * 获取一个post请求
         * @param url 请求的网络接口路劲
         * @param data 请求的数据对象
         * @param callback 请求返回结果回调
         */
        doPost: function (url, data, callback) {
            doRequest('POST', url, JSON.stringify(data), callback);
        },
        doPatch: function (url, data, callback) {
            doRequest('PATCH', url, JSON.stringify(data), callback);
        },
        doPut: function (url, data, callback) {
            doRequest('PUT', url, JSON.stringify(data), callback);
        },
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
    };

    function doRequest(type, url, data, callback) {
        var index = layer.load(0, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        $.ajax({
            type: type,
            async: true,
            url: urlPrefix + url,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            data: data,
            dataType: 'json',
            //success(result,status,xhr)
            success: function (response,status,xhr) {
                layer.close(index);
                console.log(status);
                console.log(xhr.status);
                if (!Boolean(response.meta.success)) {
                    layer.msg(response.meta.message, {icon: 5});
                    return false;
                } else {
                    callback(response.data);
                }

            },
            beforeSend: function (xhr) {
            },
            //complete(xhr,status)
            complete: function () {
                layer.close(index);
            },
            //error(xhr,status,error)
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(index);
                if (XMLHttpRequest.status == 403) {
                    layer.msg('登录失效，请重新登录', 5);
                    setTimeout(function () {
                        window.location.href = "/HotelAdmin/login.html";
                    }, 2000);
                    return;
                }
                layer.msg('#ERROR', {icon: 5});
            }
        });
    }

    //输出网络接口
    exports('request', obj);
});  
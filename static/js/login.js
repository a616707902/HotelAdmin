layui.extend({
    request: '{/}./static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
})

layui.use(['form', 'request'], function () {
    var form = layui.form;
    var requset = layui.request;
    //监听提交
    form.on('submit(login)', function (data) {
        // alert(888)
        requset.doPost('UserOperation/login', {
            username: data.field.username,
            password: data.field.password
        }, function (response) {


                //登录成功将登录返回的数据写入本地存储
                layui.sessionData('user', {
                    key: 'user',
                    value: {
                        isLogin: true,
                        userName: response.username,
                        realName: response.name
                    }

                });
                window.location.href="/HotelAdmin/pages/home/home.html";

        });
        return false;
    });
});
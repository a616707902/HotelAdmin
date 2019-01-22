layui.extend({
    request: '{/}./static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
})

layui.use(['form', 'request'], function () {
    var form = layui.form;
    var requset = layui.request;
   /* var daxiao = "/HotelAdmin/static/images/newMessage.mp3";
    var daxiao = new Audio(daxiao);
    daxiao .play(); //播放*/
    //监听提交
    form.on('submit(login)', function (data) {
        // alert(888)
        requset.doPost('/auth/', {
            username: data.field.username,
            password: data.field.password
        }, function (response) {
            sessionStorage.removeItem('menu');
                //登录成功将登录返回的数据写入本地存储
                layui.data('user', {
                    key: 'user',
                    value: {
                        isLogin: true,
                        userName: response.username,
                        realName: response.user_name
                    }

                });
            layui.data('token', {
                key: 'token',
                value:'jwt '+ response.token
            });
            layui.data('perms', {
                key: 'perms',
                value:response.perms
            });
                window.location.href="./pages/home/home.html";

        });
        return false;
    });
});
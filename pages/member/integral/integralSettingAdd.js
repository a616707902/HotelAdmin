layui.extend({
    request: '{/}../../../static/js/network/request',
});
/*var usertable = layui.sessionData('user');
var user = usertable.user;
if (usertable == undefined || user == undefined || !user.isLogin) {
    window.parent.location.href = "/HotelAdmin/login.html";
}
var hotel = user.hotelID;*/
layui.use(['layer', 'request', 'jquery', 'form', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    form.on('submit(add)', function (data) {

        editRechargeSetting(data);

        return false;
    });
    $(function () {

        getRechargeSettingDetail()
    });


    function editRechargeSetting(data) {
        request.doPut("/admin/integral_settings/" + 1 + "/", {
            money: data.field.money,
            integral: data.field.integral
        }, function (data) {
            layer.alert("修改成功", {
                icon: 6
            }, function () {
                parent.reflush();
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
            });
        });
    }


    function getRechargeSettingDetail() {
        request.doGet("/admin/integral_settings/" + 1 + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
        })
    }
})
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
        //发异步，把数据提交给php
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        if ("edit" == op) {
            editRechargeSetting(data, id);
        } else {
            addRechargeSetting(data);
        }

        return false;
    });
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        if ("detail" == op || "edit" == op) {
            if ("detail" == op) {
                $(".layui-form-item button").addClass("layui-hide");
            }
            getRechargeSettingDetail(id, op)
        }
    });


    function editRechargeSetting(data, id) {
        request.doPut("/admin/recharge_settings/" + id + "/", {
            is_active: data.field.is_active == '1' ? true : false,
            recharge_price: data.field.recharge_price,
            free_balance: data.field.free_balance
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

    function addRechargeSetting(data) {
        request.doPost("/admin/recharge_settings/", {
            is_active: data.field.is_active == '1' ? true : false,
            recharge_price: data.field.recharge_price,
            free_balance: data.field.free_balance

        }, function (data) {
            layer.alert("增加成功", {
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

    function getRechargeSettingDetail(id, op) {
        request.doGet("/admin/recharge_settings/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            if (response.is_active) {
                $("#radio1").attr("checked", "checked");
            } else {
                $("#radio2").attr("checked", "checked");
            }
        })
    }
})
layui.extend({
    request: '{/}../../static/js/network/request',
});
layui.use(['layer', 'request', 'jquery', 'form'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        if ("edit" == op) {
            editVipSet(data, id);
        } else {
            addVipSet(data);
        }

        return false;
    });

    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        if ( "edit" == op) {

            getVipSetDetail(id,op);
        }

    });


    function editVipSet(data, id) {
        request.doPut("/admin/vip_settings/" + id + "/", {
            vip_name: data.field.vip_name,
            hotel_discount: data.field.hotel_discount,
            vip_weight: data.field.vip_weight
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

    function addVipSet(data) {
        request.doPost("/admin/vip_settings/", {
            vip_name: data.field.vip_name,
            hotel_discount: data.field.hotel_discount,
            vip_weight: data.field.vip_weight
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

    function getVipSetDetail(id,op) {
        request.doGet("/admin/vip_settings/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            form.render(); //刷新select选择框渲染
        });
    }
});
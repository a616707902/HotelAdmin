layui.extend({
    request: '{/}../../static/js/network/request',
});

layui.use(['layer', 'request', 'jquery', 'form', 'table', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

    });


    form.on('radio(order_status)', function (data) {
        if (data.value == 61) {
            $('#span_rufund').addClass("layui-hide");

        } else {
            $('#span_rufund').removeClass("layui-hide");
        }
        return false;
    });
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var id = request.getQueryString("id");
        request.doPut("/admin/market_refunded/" + id + "/deal_apply/", {
            order_status: data.field.order_status,
            admin_refunded_info: {
                refunded_address: data.field.refunded_address,
                refunded_name: data.field.refunded_name,
                refunded_phone: data.field.refunded_phone,
                remark: data.field.remark
            }
        }, function (data) {
            layer.alert("提交成功", {
                icon: 6
            }, function () {
                parent.reflush();
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
            });
        });


        return false;
    });
    $("#close").click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });


})
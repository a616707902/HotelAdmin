layui.extend({
    request: '{/}../../static/js/network/request',
});

layui.use(['layer', 'request', 'jquery', 'form', 'table', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var table = layui.table;
    var request = layui.request;
    $(function () {
        var id = request.getQueryString("id");
        getOrderDetail(id)

    });
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var id = request.getQueryString("id");

        request.doPut("/admin/market_order/" + id + "/", {
            market_order_contact: {
                id: data.field.market_order_contact_id,
                consignee_name: data.field.consignee_name,
                consignee_address: data.field.consignee_address,
                consignee_phone: data.field.consignee_phone,
                order: data.field.market_order_contact_order
            },
            order_status: 20,
            operator_remark: $("#operator_remark").val(),
            order_express: {
                express_id: data.field.express_id,
                express_name: data.field.express_name
            }

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


        return false;
    });
    $("#close").click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });

    function getOrderDetail(id) {
        request.doGet("/admin/market_order/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            var market_order_contact = response.market_order_contact;
            $.each(market_order_contact, function (key, value) {
                $("#market_order_contact_" + key).val(value);
            })


        });
        form.render();
    }
})
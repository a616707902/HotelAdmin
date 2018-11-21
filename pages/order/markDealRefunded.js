layui.extend({
    request: '{/}../../static/js/network/request',
});
var money=0;
var integral=0;
layui.use(['layer', 'request', 'jquery', 'form', 'table', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var table = layui.table;
    var request = layui.request;
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        getOrderDetail(id, op)

    });
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var id = request.getQueryString("id");
        var refunded = parseInt($("#refunded_money").val());
        var refunded_integral = parseInt($("#refunded_integral").val());
        if (refunded < 0 || refunded > money) {
            layer.msg("退款金额应在0~" + money + "范围内!", {icon: 5});
            return false;
        }
        if (refunded_integral < 0 || refunded_integral > integral) {
            layer.msg("退还金额应在0~" + integral + "范围内!", {icon: 5});
            return false;
        }
        request.doPut("/admin/market_refunded/" + id + "/", {
            refunded_integral:$("#refunded_integral").val(),
            refunded_money:$("#refunded_money").val(),
            operator_remark: $("#operator_remark").val()
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
        return false;
    });

    function getOrderDetail(id, op) {
        request.doGet("/admin/market_refunded/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            var order_pay = response.order_pay;
            // $.each(market_order_contact, function (key, value) {
            //     $("#market_order_contact_" + key).val(value);
            // })
            var user_refunded_info=response.user_refunded_info;
            if (user_refunded_info){
                $.each(user_refunded_info, function (key, value) {
                    $('#user_refunded_info_' + key).val(value);
                });

            }
            money = response.order_pay.money;
            integral = response.order_pay.integral;
            $.each(order_pay, function (key, value) {
                $("#order_pay_" + key).val(value);
            })

        });
        form.render();
    }
})
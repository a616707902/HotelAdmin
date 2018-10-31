layui.extend({
    request: '{/}../../static/js/network/request',
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
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        getOrderDetail(id, op)

    });
    // form.on('submit(refund)', function (data) {
    //     //发异步，把数据提交给php
    //     var id = request.getQueryString("id");
    //     request.doPut("/admin/hotel_order/" + id + "/refund/", {
    //         order_status: $("#order_status").val(),
    //         operator_remark: $("#operator_remark").val()
    //     }, function (data) {
    //         layer.alert("退款成功", {
    //             icon: 6
    //         }, function () {
    //             parent.reflush();
    //             // 获得frame索引
    //             var index = parent.layer.getFrameIndex(window.name);
    //             //关闭当前frame
    //             parent.layer.close(index);
    //         });
    //     });
    //
    //
    //     return false;
    // });
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var id = request.getQueryString("id");
        var order_status = $("#order_status").val();
        if (order_status == "") {
            layer.msg("请选择订单状态", {icon: 5});
            return;
        }
        request.doPut("/admin/hotel_order/" + id + "/", {
            order_status: data.field.order_status,
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
    });

    function getOrderDetail(id, op) {
        request.doGet("/admin/hotel_order/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            var status = response.order_status;
            //待入住状态  需确认订单
            if (status == 25) {
                $("#confirm_div").removeClass("layui-hide")
            }

            if (status != 10) {
                $("#pay_div").removeClass("layui-hide")
            }
            var hotel_order_detail = response.hotel_order_detail;
            var order_pay = response.order_pay;
            $.each(hotel_order_detail, function (key, value) {
                $('#hotel_order_detail_' + key).val(value);
            });
            $.each(order_pay, function (key, value) {
                $('#order_pay_' + key).val(value);
            });
            form.render();
        })
    }
})
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
    var money = 0;
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        getOrderDetail(id, op)

    });

    form.on('submit(add)', function (data) {
        var id = request.getQueryString("id");
        //发异步，把数据提交给php
        var refunded = parseFloat($("#refunded_money").val());
        var moneyFloat=parseFloat(money);
        if (refunded < 0 || refunded > moneyFloat) {
            layer.msg("退款金额应在0~" + money + "范围内!", {icon: 5});
            return false;
        }
        request.doPut("/admin/hotel_refunded/" + id + "/", {
            refunded_money: $("#refunded_money").val(),
            operator_remark: $("#operator_remark").val()
        }, function (data) {
            layer.alert("退款提交成功", {
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
    form.on('submit(retry)', function (data) {
        var id = request.getQueryString("id");
        request.doPost("/admin/hotel_refunded/"+id+"/retry/", {
            operator_remark:""
        }, function (data) {
            layer.alert("退款提交成功", {
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
        request.doGet("/admin/hotel_refunded/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            money = response.order_pay.money;
            var status = response.order_status;
            if (status != 50) {
                $("#refunded_button").addClass("layui-hide");
                $("#refunded_money").attr("readonly","readonly");
                $("#operator_remark").attr("readonly","readonly");
            }else{
                $("#refunded_button").removeClass("layui-hide");
                $("#refunded_money").val(money);
            }
            var order_refunded=response.order_refunded;
            if (order_refunded){
                $("#refunded_span").removeClass("layui-hide");
                $("#refunding_div").addClass("layui-hide");
                $.each(order_refunded, function (key, value) {
                    $('#order_refunded_' + key).val(value);
                });
                if((response.order_status==55&&response.order_refunded.refunded_status==40)
                    ||(response.order_status==55&&response.order_refunded.refunded_status==30)){
                    $("#retry_refunded_button").removeClass("layui-hide")
                }
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
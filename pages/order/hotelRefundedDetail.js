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
    var money=0;
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        getOrderDetail(id, op)

    });

    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var refunded=$("#refunded_money").val();
        if (refunded<0||refunded>money){
            layer.msg("退款金额应在0~"+money+"范围内!",{icon:5});
            return ;
        }
        request.doPut("/admin/hotel_refunded/" + id + "/", {
            order_status: $("#refunded_money").val(),
            operator_remark: $("#operator_remark").val()
        }, function (data) {
            layer.alert("退款成功", {
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
            money=response.order_pay.money;
            var status = response.order_status;
            if (status!=50){
                $("#refunded_button").addClass("layui-hide")
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
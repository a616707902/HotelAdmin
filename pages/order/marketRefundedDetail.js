layui.extend({
    request: '{/}../../static/js/network/request',
});
/*var usertable = layui.sessionData('user');
var user = usertable.user;
if (usertable == undefined || user == undefined || !user.isLogin) {
    window.parent.location.href = "/HotelAdmin/login.html";
}
var hotel = user.hotelID;*/
var TableHeader = [[ //表头
    {field: 'goods', align: 'center', title: '商品名称'},
    {field: 'sale_price', align: 'center', title: '商品单价'}
    , {field: 'integral', align: 'center', title: '消费积分'}
    , {field: 'nums', align: 'center', title: '数量'}
    , {field: 'single_goods_amount', align: 'center', title: '总计'}

]];
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

        request.doPut("/admin/market_refunded/" + id + "/", {
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
        request.doGet("/admin/market_order/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            var status = response.order_status;
            if (status != 50) {
                $("#refunded_button").addClass("layui-hide")
            }
            var market_order_contact = response.market_order_contact;
            var order_pay = response.order_pay;
            $.each(market_order_contact, function (key, value) {
                $("#market_order_contact_" + key).val(value);
            })
            $.each(order_pay, function (key, value) {
                $("#order_pay_" + key).val(value);
            })
            var market_order_detail = response.market_order_detail;
            table.render({
                elem: '#goodsList'
                , limit: market_order_detail.length//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: market_order_detail
            });

        });
        form.render();
    }
})
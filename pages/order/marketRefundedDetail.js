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
    {field: 'goods_name', align: 'center', title: '商品名称'},
    {field: 'goods_price', align: 'center', title: '商品单价'}
    , {field: 'goods_integral', align: 'center', title: '消费积分'}
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
            var status = response.order_status;
            if (status == 60) {
                $("#span_refunded").removeClass("layui-hide")
            }
            var market_order_contact = response.market_order_contact;
            var order_pay = response.order_pay;
            $.each(market_order_contact, function (key, value) {
                $("#market_order_contact_" + key).val(value);
            })
            $.each(order_pay, function (key, value) {
                $("#order_pay_" + key).val(value);
            })
            var order_refunded=response.order_refunded;
            var user_refunded_info=response.user_refunded_info;
            if (order_refunded){
                $("#refunded_span").removeClass("layui-hide");
                $.each(order_refunded, function (key, value) {
                    $('#order_refunded_' + key).val(value);
                });

            }
            if (user_refunded_info){
                $.each(user_refunded_info, function (key, value) {
                    $('#user_refunded_info_' + key).val(value);
                });

            }
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
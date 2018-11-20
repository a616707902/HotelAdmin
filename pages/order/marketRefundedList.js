layui.extend({
    request: '{/}../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
var TableHeader = [[ //表头
    {field: 'order_id', align: 'center', title: '订单号'},
    {field: 'order_amount', align: 'center', title: '订单总价'}
    ,{field: 'integral', align: 'center', title: '消费积分'}
    , {field: 'create_time', align: 'center', title: '下单时间'}
    , {field: 'order_status_display', align: 'center', title: '订单状态'}
    , {field: 'refunded_status', align: 'center', title: '退款状态' ,templet: '#titleTpl', unresize: true}
    , {field: 'refunded_info', align: 'center', title: '快递（快递单号）' ,templet: '#titleTp2', unresize: true}
    , {field: 'consumer', align: 'center', title: '会员账号'}
    // , {field: 'room_nums', align: 'center', title: '房间数'}
    // , {field: 'room_style_name', align: 'center', title: '房间类型'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];

layui.use(['layer', 'jquery', 'request', 'form', 'table', 'laydate', 'laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table = layui.table;
    var laydate = layui.laydate;
    var laypage = layui.laypage

    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        // location.replace(location.href);
        getOrderList();
    }
    form.on('submit(sreach)', function (data) {
        Config.page=1;
        getOrderList();
        return false;
    });
     function getOrderList() {
        requset.doGet("/admin/market_refunded/", {
            page: Config.page,
            page_size: Config.pageSize,
            order_status: $("#order_status").val(),
        }, function (data) {
            //第一个实例
            Config.count = data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#orderList'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();

        });
    }

    table.on('tool(orderList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("详情", "./marketRefundedDetail.html?op=detail&id=" + data.id);
        }
        else if (obj.event === 'edit') { //处理退款申请
            WeAdminShow("处理退款申请", "./market_dealApply.html?op=edit&id=" + data.id,600,300);
        }
        else if (obj.event === 'refunded') { //处理退款申请
            WeAdminShow("退款", "./markDealRefunded.html?op=refunded&id=" + data.id,600,600);
        }else if (obj.event === 'retry') { //处理退款申请
            retryRefunded(data.id);
        }
    });

    function retryRefunded(id) {
        requset.doPost("/admin/market_refunded/"+id+"/retry/", {
            operator_remark:""
        }, function (data) {
          var index=  layer.alert("退款提交成功", {
                icon: 6
            }, function () {
                layer.close(index);
                getOrderList();
            });

        });
    }
    $(function () {
        getOrderList();
    });

    function Rflaypage() {
        laypage.render({
            elem: 'page'
            , count: Config.count
            , limit: Config.pageSize
            , curr: Config.page
            , layout: ['prev', 'page', 'next', 'limit']
            , jump: function (obj, first) {
                Config.pageSize = obj.limit
                Config.page = obj.curr;
                if (!first) {
                    getOrderList();
                }
            }
        });
    }

})

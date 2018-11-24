layui.extend({
    request: '{/}../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'order_id', align: 'center', title: '订单号'},
    {field: 'belong_hotel_name', align: 'center', title: '所属酒店'}
    , {field: 'create_time', align: 'center', title: '下单时间'}
    , {field: 'order_status_display', align: 'center', title: '订单状态'}
    , {field: 'refunded_status', align: 'center', title: '退款状态' ,templet: '#titleTpl', unresize: true}
    , {field: 'consumer', align: 'center', title: '会员账号'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form', 'table', 'laydate', 'laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table = layui.table;
    var laydate = layui.laydate;
    var laypage = layui.laypage;


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
function  getOrderList() {
        requset.doGet("/admin/hotel_refunded/", {
            page: Config.page,
            page_size: Config.pageSize,
            order_status: $("#order_status").val()
        }, function (data) {
            //第一个实例
            Config.count = data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#lists'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();

        });
    }

    table.on('tool(lists)', function (obj) {
        var data = obj.data;

        if (obj.event === 'edit') {
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("详情", "./hotelRefundedDetail.html?op=edit&id=" + data.id);
        }else if(obj.event === 'retry'){
            retryRefunded(data.id);
        } else if(obj.event === 'dealapply'){
            WeAdminShow("处理退款申请", "./hotel_DealApply.html?id=" + data.id,600,300);
        }else if(obj.event === 'refunded'){
            WeAdminShow("退款", "./hotelRefundedDetail.html?op=refunded&id=" + data.id);
        }
    });
    $(function () {
        getOrderList();
    });

    function retryRefunded(id) {
        requset.doPost("/admin/hotel_refunded/"+id+"/retry/", {
            operator_remark:""
        }, function (data) {
          var index =  layer.alert("退款提交成功", {
                icon: 6
            }, function () {
              layer.close(index);
                getOrderList();
            });

        });
    }

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

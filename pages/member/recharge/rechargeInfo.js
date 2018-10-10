layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
// "id": 1,
//     "consumer_name": "aaa",
//     "pick_status": 10,
//     "pick_status_display": "提交申请",
//     "pick_money": "100.00",
//     "pick_time": "2018-09-25T21:29:36.443111",
//     "success_time": null
var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    // {field: 'phone', align: 'center', title: '电话'}
    {field: 'id', align: 'center', title: 'ID'},
    {field: 'order_id', align: 'center', title: '流水号'},
    {field: 'consumer_name', align: 'center', title: '会员姓名'}
    , {field: 'recharge_status_display', align: 'center', title: '充值状态'}
    , {field: 'recharge_money', align: 'center', title: '充值金额'}
    , {field: 'free_money', align: 'center', title: '剩余金额'}
    , {field: 'pay_time', align: 'center', title: '充值时间'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form','table','laydate'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    var laydate = layui.laydate;

    table.render({
        elem: '#memberList'
        ,page: true //开启分页
        ,cols:TableHeader
        ,data:[]
    });
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    form.on('submit(sreach)', function (data) {
        getConsumer();
        return false;
    });
    window.getConsumer = function () {
        requset.doGet("/admin/recharge_info/", {
            search:""
        }, function (data) {
            //第一个实例
            $("#total").html(data.count);
            table.render({
                elem: '#memberList'
                ,page: true //开启分页
                ,cols: TableHeader
                ,data:data.results
            });
        });
    }

    table.on('tool(memberList)', function(obj){
        var data = obj.data;
        if(obj.event === 'detail'){
            WeAdminShow("详情","./rechargeInfoDetail.html?op=detail&id="+data.id);
        }
    });
    $(function () {
        getConsumer();
    });

})

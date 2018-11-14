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
    {field: 'consumer_name', align: 'center', title: '会员姓名'}
    , {field: 'phone', align: 'center', title: '联系电话'}
    , {field: 'content', align: 'center', title: '内容'}
    , {field: 'create_time', align: 'center', title: '提交时间'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
layui.use(['layer', 'jquery', 'request', 'form','table','laydate', 'laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    var laydate = layui.laydate;
    var laypage = layui.laypage

    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    form.on('submit(sreach)', function (data) {
        Config.page=1;
        getOpinoins();
        return false;
    });
    function getOpinoins () {
        requset.doGet("/admin/opinions/", {
            page: Config.page,
            page_size: Config.pageSize,
            search:""
        }, function (data) {
            //第一个实例
            Config.count = data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#List'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();
        });
    }

    table.on('tool(List)', function(obj){
        var data = obj.data;
        if(obj.event === 'detail'){
            WeAdminShow("详情","./opinionsDetail.html?op=detail&id="+data.id,600,400);
        }
    });
    $(function () {
        getOpinoins();
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
                    getConsumer();
                }
            }
        });
    }
})

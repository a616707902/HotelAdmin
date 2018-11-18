layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    // {field: 'phone', align: 'center', title: '电话'}
    {field: 'user', align: 'center', title: '会员账号'}
    , {field: 'integral', align: 'center', title: '积分数'}
    , {field: 'growth_value', align: 'center', title: '成长值'}
    , {field: 'update_time', align: 'center', title: '更新时间'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form','table', 'laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    var laypage = layui.laypage

    table.render({
        elem: '#memberList'
        ,page: true //开启分页
        ,cols:TableHeader
        ,data:[]
    });
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        // location.replace(location.href);
        getIntegral();
    }
    form.on('submit(sreach)', function (data) {
        Config.page=1;
        getIntegral();
        return false;
    });
    window.getIntegral = function () {
        requset.doGet("/admin/integral/", {
            page: Config.page,
            page_size: Config.pageSize,
            // user_name__contains:$("#user_name__contains").val(),
            search:""
            // user__date_joined__range:$("#start").val()+""+$("#end").val(),
            // phone__contains:$("#phone__contains").val()
        }, function (data) {
            //第一个实例
            Config.count = data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#memberList'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();


        });
    }

    table.on('tool(memberList)', function(obj){
        var data = obj.data;
        if(obj.event === 'detail'){
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("详情","./integralDetail.html?op=detail&id="+data.id);
        }
    });
    $(function () {
        getIntegral();
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
                    getIntegral();
                }
            }
        });
    }
})

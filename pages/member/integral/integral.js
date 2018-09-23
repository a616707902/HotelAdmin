layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});

var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    // {field: 'phone', align: 'center', title: '电话'}
    {field: 'user', align: 'center', title: '会员账号'}
    , {field: 'integral', align: 'center', title: '积分数'}
    , {field: 'growth_value', align: 'center', title: '成长值'}
    , {field: 'update_time', align: 'center', title: '更新时间'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form','table'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;

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
        getIntegral();
        return false;
    });
    window.getIntegral = function () {
        requset.doGet("/admin/integral/", {
            // user_name__contains:$("#user_name__contains").val(),
            search:""
            // user__date_joined__range:$("#start").val()+""+$("#end").val(),
            // phone__contains:$("#phone__contains").val()
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
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("详情","./integralDetail.html?op=detail&id="+data.id);
        }
    });
    $(function () {
        getIntegral();
    });

})

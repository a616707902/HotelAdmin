layui.extend({
    request: '{/}../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});

var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    // {field: 'phone', align: 'center', title: '电话'}
     {field: 'user_name', align: 'center', title: '会员姓名'}
    , {field: 'user_account', align: 'center', title: '会员账号'}
    , {field: 'sex_display', align: 'center', title: '性别'}
    // , {field: 'contact_addr', align: 'center', title: '联系地址'}
    // , {field: 'is_distribution', align: 'center', title: '是否分销人员' ,templet: '#switchTpl', unresize: true}
    // , {field: 'sell_user_name', align: 'center', title: '分销用户名'}
    // , {field: 'bonus', align: 'center', title: '金额'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form','table','laydate'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    var laydate = layui.laydate;

    //执行一个laydate实例
    laydate.render({
        elem: '#start' //指定元素
    });
    table.render({
        elem: '#memberList'
        ,page: true //开启分页
        ,cols:TableHeader
        ,data:[]
    });
    //执行一个laydate实例
    laydate.render({
        elem: '#end' //指定元素
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
        requset.doGet("/admin/consumer/", {
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
            WeAdminShow("详情","./consumerDetail.html?op=detail&id="+data.id);
        }
    });
    $(function () {
        getConsumer();
    });

})

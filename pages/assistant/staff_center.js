layui.extend({
    request: '{/}../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader=[[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id',align:'center', title: 'ID'}
    ,{field: 'user_name',align:'center', title: '管理员姓名' }
    ,{field: 'sex_display',align:'center', title: '性别'}
    ,{field: 'username',align:'center', title: '登录账号'}
    ,{field: 'belong_hotel_name', align:'center',title: '所属酒店' }
    ,{field: 'is_active', align:'center',title: '状态' ,templet: '#switchTpl', unresize: true}
    ,{ title: '操作',  align:'center', toolbar: '#barDemo'}

]];
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
layui.use(['layer', 'jquery', 'request', 'form','table','laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    var laypage = layui.laypage
    form.on('submit(sreach)', function (data) {
        Config.page=1;
        getStaffCenter(data.field.search);
    });
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    table.render({
        elem: '#hotelList'
        ,page: true //开启分页
        ,cols:TableHeader
        ,data:[]
    });
     function getStaffCenter(search) {
        requset.doGet("/admin/staff_center/", {
            page: Config.page,
            page_size: Config.pageSize,
            search: search
        }, function (data) {
            //第一个实例
            Config.count = data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#staffList'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();

        });
    }
    table.on('tool(staffList)', function(obj){
        var data = obj.data;
        if(obj.event === 'assign'){
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("授权角色","./StaffRoleAssign.html?op=assign&id="+data.id);
        } else if(obj.event === 'del'){
            // layer.confirm('真的删除行么', function(index){
            //     obj.del();
            //     layer.close(index);
            // });
        } else if(obj.event === 'edit'){
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            WeAdminShow("编辑修改","./StaffAdd.html?op=edit&id="+data.id);
        }
    });
    $(function () {
        getStaffCenter($("#search").val())

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
});
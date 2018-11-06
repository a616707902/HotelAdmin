layui.extend({
    request: '{/}../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader=[[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id',align:'center', title: 'ID'}
    ,{field: 'name',align:'center', title: '角色名' }
    // ,{field: 'perms',align:'center', title: '权限'}
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

    window.getStaffCenter = function (search) {
        requset.doGet("/admin/role/", {
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
        if(obj.event === 'detail'){
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("角色详情","./roleAdd.html?op=detail&id="+data.id);
        } else if(obj.event === 'del'){
            // layer.confirm('真的删除行么', function(index){
            //     obj.del();
            //     layer.close(index);
            // });
        } else if(obj.event === 'edit'){
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            WeAdminShow("编辑修改","./roleAdd.html?op=edit&id="+data.id);
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
layui.extend({
    request: '{/}../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader=[[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id',align:'center', title: 'ID'}
    ,{field: 'user_name',align:'center', title: '管理员姓名' }
    ,{field: 'sex',align:'center', title: '年龄'}
    ,{field: 'user',align:'center', title: '登录账号'}
    ,{field: 'belong_hotel', align:'center',title: '所属酒店' }
    ,{ title: '操作',  align:'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form','table'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    form.on('submit(sreach)', function (data) {
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
    window.getStaffCenter = function (search) {
        requset.doGet("/admin/staff_center/", {
            search: search
        }, function (data) {
            //第一个实例
            $("#total").html(data.count);
            table.render({
                elem: '#staffList'
                ,page: true //开启分页
                ,cols: TableHeader
                ,data:data.results
                , done: function(res, curr, count){

                }
            });

        });
    }
    table.on('tool(staffList)', function(obj){
        var data = obj.data;
        if(obj.event === 'detail'){
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("管理员详情","./StaffAdd.html?op=detail&id="+data.id);
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
});
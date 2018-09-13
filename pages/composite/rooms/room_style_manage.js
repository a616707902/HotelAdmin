layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader=[[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id',align:'center', title: 'ID'}
    ,{field: 'style_name',align:'center', title: '类型名称' }
    ,{field: 'room_profile',align:'center', title: '房间类型简介'}
    ,{field: 'room_count',align:'center', title: '总数量'}
    ,{field: 'is_active', align:'center',title: '状态' ,templet: '#switchTpl', unresize: true}
    ,{field: 'left_room_count', align:'center',title: '剩余房间数' }
    ,{ title: '操作',  align:'center', toolbar: '#barDemo'}

]];
// unresize 是否禁用拖拽列宽
layui.use(['layer', 'jquery', 'request', 'form','table'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    form.on('submit(sreach)', function (data) {
        getAllRoomStyle(data.field.search);
        return false;
    });
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    table.render({
        elem: '#roomstylelist'
        ,page: true //开启分页
        ,cols:TableHeader
        ,data:[]
    });
    window.getAllRoomStyle = function (search) {
        requset.doGet("/admin/room_style/", {
            search: search
        }, function (data) {
            //第一个实例
            $("#total").html(data.count);
            table.render({
                elem: '#roomstylelist'
                ,page: true //开启分页
                ,cols: TableHeader
                ,data:data.results
            });

        });
    }
    table.on('tool(roomstylelist)', function(obj){
        var data = obj.data;
        if(obj.event === 'detail'){
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("详情","./room_styleAdd.html?op=detail&id="+data.id);
        } else if(obj.event === 'del'){
        } else if(obj.event === 'edit'){
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            WeAdminShow("编辑","./room_styleAdd.html?op=edit&id="+data.id);
        }
    });
    $(function () {
        getAllRoomStyle($("#roomstyle").val())
        $('#add').click(function () {
            WeAdminShow("添加","./room_styleAdd.html?");
        });
    });



})
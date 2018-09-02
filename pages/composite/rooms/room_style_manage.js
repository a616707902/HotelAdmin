layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader=[[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id',align:'center', title: 'ID'}
    ,{field: 'style_name',align:'center', title: '类型名称' }
    ,{field: 'room_profile',align:'center', title: '房间类型简介'}
    ,{field: 'room_count',align:'center', title: '总数量'}
    ,{field: 'is_active', align:'center',title: '状态' }
    ,{field: 'left_room_count', align:'center',title: '剩余房间数' }
    ,{ title: '操作',  align:'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form','table'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    form.on('submit(sreach)', function (data) {
        getAllRoomStyle(data.field.search);
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
            AddHotel("详情","./room_styleAdd.html?op='detail'&id="+data.id);
        } else if(obj.event === 'del'){
            // layer.confirm('真的删除行么', function(index){
            //     obj.del();
            //     layer.close(index);
            // });
        } else if(obj.event === 'edit'){
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            AddHotel("编辑","./room_styleAdd.html?op='edit'&id="+data.id);
        }
    });
    $(function () {
        getAllRoomStyle($("#roomstyle").val())
        $('#add').click(function () {
            AddHotel("添加","./room_styleAdd.html?");
        });
    });
    window.AddHotel=function (title, url,  w, h) {
        if (title == null || title == '') {
            title = false;
        }
        ;
        if (url == null || url == '') {
            url = "/HotelAdmin/pages/404.html";
        }
        ;
        if (w == null || w == '') {
            w = ($(window).width() * 0.9);
        }
        ;
        if (h == null || h == '') {
            h = ($(window).height() - 50);
        }
        ;
        layer.open({
            type: 2,
            area: [w + 'px', h + 'px'],
            fix: false, //不固定
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            title: title,
            content: url,
            success: function (layero, index) {
            }
        });
    }


})
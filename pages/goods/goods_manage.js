layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader=[[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id',align:'center', title: 'ID'}
    ,{field: 'room_style',align:'center', title: '房间类型' }
    ,{field: 'room_nums',align:'center', title: '房间号'}
    ,{field: 'room_status',align:'center', title: '房间状态'}
    ,{field: 'room_status_display', align:'center',title: '入住状态' }
    ,{field: 'reserve_time', align:'center',title: '入住时间' }
    ,{field: 'reserve_out_time', align:'center',title: '退房时间' }
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
        elem: '#roomlist'
        ,page: true //开启分页
        ,cols:TableHeader
        ,data:[]
    });
    window.getAllRoomStyle = function (search) {
        requset.doGet("/admin/room/", {
            search: search
        }, function (data) {
            //第一个实例
            $("#total").html(data.count);
            table.render({
                elem: '#roomlist'
                ,page: true //开启分页
                ,cols: TableHeader
                ,data:data.results
            });

        });
    }
    table.on('tool(roomlist)', function(obj){
        var data = obj.data;
        if(obj.event === 'detail'){
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            AddHotel("详情","./GoodsAdd.html?op='detail'&id="+data.id);
        } else if(obj.event === 'del'){
            // layer.confirm('真的删除行么', function(index){
            //     obj.del();
            //     layer.close(index);
            // });
        } else if(obj.event === 'edit'){
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            AddHotel("编辑","./GoodsAdd.html?op='edit'&id="+data.id);
        }
    });
    $(function () {
        getAllRoomStyle($("#roomstyle").val())
        $('#add').click(function () {
            AddHotel("添加","./GoodsAdd.html?");
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
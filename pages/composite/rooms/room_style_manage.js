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
    // ,{field: 'left_room_count', align:'center',title: '剩余房间数' }
    ,{ title: '操作',  align:'center', toolbar: '#barDemo'}

]];
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
// unresize 是否禁用拖拽列宽
layui.use(['layer', 'jquery', 'request', 'form','table','laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    var laypage=layui.laypage;
    form.on('submit(sreach)', function (data) {
        Config.page=1;
        getAllRoomStyle(data.field.search);
        return false;
    });
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    window.getAllRoomStyle = function (search) {
        requset.doGet("/admin/room_style/", {
            page: Config.page,
            page_size: Config.pageSize,
            search: search
        }, function (data) {
            //第一个实例
            Config.count = data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#list'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();

        });
    }
    table.on('tool(list)', function(obj){
        var data = obj.data;
         if(obj.event === 'del'){
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
                    getAllRoomStyle($("#roomstyle").val());
                }
            }
        });
    }


})
layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader=[[ //表头
    {type:'checkbox',align:'center'},
    {field: 'id',align:'center', title: 'ID'}
    ,{field: 'name',align:'center', title: '酒店名称' }
    ,{field: 'address',align:'center', title: '酒店地址'}
    ,{field: 'createtime',align:'center', title: '创建时间'}
    ,{field: 'state', align:'center',title: '状态' }
    ,{ title: '操作',  align:'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form','table'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    form.on('submit(sreach)', function (data) {
        getAllHotel(data.field.search);
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
    window.getAllHotel = function (search) {
        requset.doGet("/admin/hotel/", {
            search: search
        }, function (data) {
            //第一个实例
            table.render({
                elem: '#hotelList'
                ,page: true //开启分页
                ,cols: TableHeader
                ,data:data
            });
        });
    }
    $(function () {
        getAllHotel($("#hotelname").val())

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
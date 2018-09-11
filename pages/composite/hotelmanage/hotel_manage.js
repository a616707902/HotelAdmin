layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader=[[ //表头
    {type:'checkbox',align:'center'},
    {field: 'id',align:'center', title: 'ID'}
    ,{field: 'name',align:'center', title: '酒店名称' }
    ,{field: 'address',align:'center', title: '酒店地址'}
    // ,{field: 'createtime',align:'center', title: '创建时间'}
    // ,{field: 'state', align:'center',title: '状态' }
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
            $("#total").html(data.count);
            table.render({
                elem: '#hotelList'
                ,page: true //开启分页
                ,cols: TableHeader
                ,data:data.results
                , done: function(res, curr, count){

                }
            });

        });
    }
    table.on('tool(hotelList)', function(obj){
        var data = obj.data;
        if(obj.event === 'detail'){
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("酒店详情","./HotelAdd.html?op=detail&id="+data.id);
        } else if(obj.event === 'del'){
            // layer.confirm('真的删除行么', function(index){
            //     obj.del();
            //     layer.close(index);
            // });
        } else if(obj.event === 'edit'){
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            WeAdminShow("编辑修改","./HotelAdd.html?op=edit&id="+data.id);
        }
    });
    $(function () {
        getAllHotel($("#hotelname").val())

    });
});
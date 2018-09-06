layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader=[[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id',align:'center', title: 'ID'}
    ,{field: 'category_name',align:'center', title: '商品类型名称' }
    ,{field: 'is_active', align:'center',title: '状态' }
    ,{field: 'create_time', align:'center',title: '创建时间' }
    ,{ title: '操作',  align:'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form','table'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    form.on('submit(search)', function (data) {
        getAllGoodsStyle(data.field.search);
    });
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    table.render({
        elem: '#goodsstylelist'
        ,page: true //开启分页
        ,cols:TableHeader
        ,data:[]
    });
    window.getAllGoodsStyle = function (search) {
        requset.doGet("admin/goods_category/", {
            search: search
        }, function (data) {
            //第一个实例
            $("#total").html(data.count);
            table.render({
                elem: '#goodsstylelist'
                ,page: true //开启分页
                ,cols: TableHeader
                ,data:data.results
            });

        });
    }
    table.on('tool(goodsstylelist)', function(obj){
        var data = obj.data;
        if(obj.event === 'detail'){
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("详情","./goods_styleAdd.html?op=detail&id="+data.id);
        } else if(obj.event === 'del'){
            // layer.confirm('真的删除行么', function(index){
            //     obj.del();
            //     layer.close(index);
            // });
        } else if(obj.event === 'edit'){
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            WeAdminShow("编辑","./goods_styleAdd.html?op=edit&id="+data.id);
        }
    });
    $(function () {
        getAllGoodsStyle($("#goodsstyle").val());
        $('#add').click(function () {
            WeAdminShow("添加","./goods_styleAdd.html?");
        });
    });


})
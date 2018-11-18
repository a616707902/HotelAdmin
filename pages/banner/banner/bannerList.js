layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    // {field: 'id', align: 'center', title: 'ID'}
    {field: 'banner_title', align: 'center', title: '横幅标题'}
    , {field: 'banner_images', align: 'center', title: '展示照片', templet: '#imgTpl', style:"height:100px;", unresize: true,}
    , {field: 'is_show', align: 'center', title: '是否显示', templet: '#switchTpl', unresize: true}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
layui.use(['layer', 'jquery', 'request', 'form', 'table', 'laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var table = layui.table;
    var laypage = layui.laypage
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        // location.replace(location.href);
        getAllBanner()
    }
    function getAllBanner(search) {
        request.doGet("/admin/banner/", {
            page: Config.page,
            page_size: Config.pageSize,
            search: search
        }, function (data) {
            //第一个实例
            Config.count = data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#lists'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();

        });
    }
    table.on('tool(lists)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            var id = data.id
            var index=    layer.confirm('确定删除当前横幅？', {
                btn: ['删除','取消'] //按钮
            }, function(){
                request.doDelete("/admin/banner/" + id + "/", {}, function (response) {
                    reflush();
                    layer.close(index);
                });
            }, function(){
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            WeAdminShow("编辑", "./bannerDetail.html?op=edit&id=" + data.id);
        }
    });
    $(function () {
        getAllBanner()
        $('#add').click(function () {
            WeAdminShow("添加", "./bannerDetail.html?");
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
                    getAllBanner()
                }
            }
        });
    }

});
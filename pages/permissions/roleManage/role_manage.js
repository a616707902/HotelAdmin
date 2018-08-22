layui.extend({
    request: '{/}../../../static/js/network/request',
});


layui.use(['request','jquery'],function () {
    window.reflush = function () {
        window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    window.AddRoleShow=function (title, url,  w, h) {

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
                var body = layui.layer.getChildFrame('body', index);
            }
        });
    }

});

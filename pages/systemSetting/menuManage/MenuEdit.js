layui.extend({
    request: '{/}../../../static/js/network/request',
});
layui.use(['layer', 'request', 'jquery', 'form'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
//监听提交
    form.on('submit(add)', function (data) {
        var levelnum = parseInt($("#pid-select").find("option:selected").attr("data-level")) + 1;
        console.log(data.field);
        //发异步，把数据提交给php
        request.doPost("MenuOperation/changeMenu", {
            menuid: data.field.menuid,
            parentid: data.field.pid,
            levelnum: levelnum,
            menuname: data.field.menuname,
            menuurl: data.field.menuurl,
            menuicon: data.field.menuicon,
            menusort: data.field.sort,
            state: data.field.status

        }, function (data) {
            layer.alert("修改成功", {
                icon: 6
            }, function () {
                parent.reflush();
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
            });
        });
        return false;
    });


    // $("#reset").click(function () {
    //     $("#pid-select option:first").prop("selected", 'selected');
    //     $("#form1").find('input[type=text],input[type=hidden]').each(function () {
    //         $(this).val('');
    //     });
    //
    // });
    //遍历select option
    $(function () {
        setTimeout(function () {
            //这里要延时不然不显示腹肌菜单
            $("#pid-select option").each(function (text) {
                var level = $(this).attr('data-level');
                var text = $(this).text();
                console.log(text);
                if (level > 0) {
                    text = "├　" + text;
                    for (var i = 0; i < level; i++) {
                        text = "　　" + text;　//js中连续显示多个空格，需要使用全角的空格
                        //console.log(i+"text:"+text);
                    }
                }
                $(this).text(text);

            });

            form.render(); //刷新select选择框渲染

        }, 100);

    });


});
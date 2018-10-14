layui.extend({
    request: '{/}../../static/js/network/request',
});
layui.use(['layer', 'request', 'jquery', 'form', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        if ("edit" == op) {
            editStaff(data, id);
        } else {
            addStaff(data);
        }

        return false;
    });

    $(function () {
        getAllPerms();
    });

    /**
     * 获取所有模块
     * @param hotel
     */
    function getAllPerms() {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        request.doGet("/admin/perms/config/", {}, function (perms) {
            if (perms != null) {
                var html = "";
                for (var i = 0; i < perms.length; i++) {
                    html += " <input type=\"checkbox\" name=\"tags\" value='" + perms[i].codename + "'  title=\"" + perms[i].name + "\">"
                }
                $("#perms_div").html(html);
                form.render();
            }
            if (id != undefined) {
                getRoleDetail(id);
            }

        });
    }

    function editStaff(data, id) {

        request.doPut("/admin/role/" + id + "/", {
            perms:getPerms(),
            name:data.field.name
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
    }

    function addStaff(data) {
        request.doPost("/admin/role/", {
            perms:getPerms(),
            name:data.field.name
        }, function (data) {
            layer.alert("增加成功", {
                icon: 6
            }, function () {
                parent.reflush();
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
            });
        });
    }

    function getPerms() {
        var tags = new Array();
        var checks = document.getElementsByName("tags")
        if (checks != null) {
            for (var i = 0; i < checks.length; i++) {
                if (checks[i].checked) {
                    tags.push(checks[i].value);
                }
            }
        }
        return tags;
    }
    function getRoleDetail(id) {
        var op = request.getQueryString("op");

        request.doGet("/admin/role/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);

            });
            var tags = response.perms;
            var checks = document.getElementsByName("tags")
            if (tags != null && checks != null) {
                for (var i = 0; i < checks.length; i++) {
                    for (var j = 0; j < tags.length; j++) {
                        if (checks[i].value == tags[j]) {
                            checks[i].checked = true;
                        }
                    }
                }
            }
            form.render();
        })
        return false;
    }



})
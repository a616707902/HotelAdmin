layui.extend({
    request: '{/}../../static/js/network/request',
});
/*var usertable = layui.sessionData('user');
var user = usertable.user;
if (usertable == undefined || user == undefined || !user.isLogin) {
    window.parent.location.href = "/HotelAdmin/login.html";
}
var hotel = user.hotelID;*/
var hotel = '';
layui.use(['layer', 'request', 'jquery', 'form'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    form.on('submit(add)', function (data) {
        addAssignRole();
        return false;
    });

    function addAssignRole() {
        request.doPost("/admin/staff_center/assign_role/", {
            user_id: user_id,
            role_id_list: getRoleChecked()
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

    $(function () {
        var id = request.getQueryString("id");
        getStaffCenterDetail(id)

        $("#close").click(function () {
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        });
    });
    var groups;
    var user_id;
    function getStaffCenterDetail(id) {

        request.doGet("/admin/staff_center/" + id + "/", {}, function (response) {
            groups=response.groups;
            user_id=response.user_id;
            getAllRole()
        });
        return false;
    }

    /**
     * 获取所有角色
     * @param hotel
     */
    function getAllRole() {
        request.doGet("/admin/role/", {
            page: 1,
            page_size: 100000
        }, function (data) {
            var allrole = data.results;
            if (allrole != null) {
                var html = "";
                if (groups != null && groups.length > 0) {
                    for (var i = 0; i < allrole.length; i++) {
                        for (var j = 0; j < groups.length; j++) {
                            if (allrole[i].name == groups[j]) {
                                html += " <input type=\"checkbox\" name=\"tags\" value='" + allrole[i].id + "'  title=\"" + allrole[i].name + "\" checked>"
                            } else {
                                if (j == 0) {
                                    html += " <input type=\"checkbox\" name=\"tags\" value='" + allrole[i].id + "'  title=\"" + allrole[i].name + "\">"
                                }

                            }
                        }
                    }
                } else {
                    for (var i = 0; i < allrole.length; i++) {
                        html += " <input type=\"checkbox\" name=\"tags\" value='" + allrole[i].id + "'  title=\"" + allrole[i].name + "\">"
                    }
                }

                $("#role_div").html(html);
                form.render();
            }

        });
    }

    function getRoleChecked() {
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


})
layui.extend({
    request: '{/}../../../static/js/network/request',
});
/*var usertable = layui.sessionData('user');
var user = usertable.user;
if (usertable == undefined || user == undefined || !user.isLogin) {
    window.parent.location.href = "/HotelAdmin/login.html";
}
var hotel = user.hotelID;*/
var hotel = '1';
layui.use(['layer', 'request', 'jquery', 'form', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var upload = layui.upload;
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        if ("edit" == op) {
            editRoomStyle(data, id);
        } else {
            addRoomStyle(data);
        }

        return false;
    });
    upload.render({
        elem: '#test2'
        , url: '/upload/'
        , multiple: true
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo2').append('<img src="' + result + '" alt="' + file.name + '" class="layui-upload-img">')
            });
        }
        , done: function (res) {
            //上传完毕
        }
    });
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");


        getHotelSelect(hotel);
        if ("detail" == op || "edit" == op) {
            if ("detail" == op) {
                $(".layui-form-item button").addClass("layui-hide");
            }
            getRoomStyleDetail(id)
        }
    });
    upload.render({
        elem: '#test1'
        , url: 'http://api.gaoshiwang.cn/admin/image/'
        , field: 'image'
        , multiple: true
        , headers: {"Authorization": layui.data('token').token}
        // ,auto: false
        // ,bindAction: '#add'
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //上传完毕
            if (res.id > 0) {
                console.log(res);
                $('#cover_images').val(res.image);
            }
        }
        , error: function (res) {
            layer.msg(res, {icon: 5});
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });

    /**
     * 获取当前账号下能管理的所有酒店
     * @param hotel
     */
    function getHotelSelect(hotel) {
        var url = "/admin/hotel/"
        if (hotel != null && hotel != '') {
            url = "/admin/hotel/" + hotel + "/";
        }
        var htmlselect = "";
        request.doGet(url, {}, function (data) {

            if (hotel != null && hotel != '') {
                htmlselect += "<option value=\"" + data.id + "\">" + data.name + "</option>";
            } else if (data != null && data.results.length > 0) {
                for (var i = 0; i < data.results.length; i++) {
                    htmlselect += "<option value=\"" + data.results[i].id + "\">" + data.results[i].name + "</option>";
                }
            }
            $('#hotel-select').html(htmlselect);
            form.render('select'); //刷新select选择框渲染
        });
    }

    function editRoomStyle(data, id) {
        request.doPut("/admin/room_style/" + id + "/", {
            price: data.field.price,
            is_active: data.field.is_active == '1' ? true : false,
            style_name: data.field.style_name,
            room_profile: data.field.room_profile,
            images: [
                "string"
            ]
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

    function addRoomStyle(data) {
        request.doPost("/admin/room_style/", {
            price: data.field.price,
            hotel: data.field.hotel,
            is_active: data.field.is_active == '1' ? true : false,
            style_name: data.field.style_name,
            room_profile: data.field.room_profile,
            images: [
                "string"
            ]
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

    function getRoomStyleDetail(id) {
        request.doGet("/admin/room_style/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            var images = response.images;
            for (var i = 0; i < images.length; i++) {
                $('#demo2').append('<img src="' + images[i] + '" alt="房间参考照片" class="layui-upload-img">')
            }
        })
    }

    var demoListView = $('#demoList')
        , uploadListIns = upload.render({
        elem: '#testList'
        , url: 'http://api.gaoshiwang.cn/admin/image/'
        , accept: 'file'
        , field: 'image'
        , headers: {"Authorization": layui.data('token').token}
        , multiple: true
        , auto: false
        , bindAction: '#testListAction'
        , choose: function (obj) {
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {

                var tr = $([' <div class="layui-upload-list ">\n' +
                '<span class="con_img" >' +
                '                    <img style="width: 300px;height: 300px" src=' + result + ' class="layui-upload-img" >\n' +
                '<span id="upload_' + index + '" class="ms "style="color: rgb(248,253,253);text-align: center">上传成功</span></span>' +
                '                    <span ><button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>' +
                '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>' +
                '</span>\n' +
                '                </div>'
                ].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function () {
                    obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function () {
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                    //tr.find('.uploadSucceed').removeAttr("imgpath");
                });

                demoListView.append(tr);
            });
        }, before: function (obj) { //obj参数包含的信息，跟choose回调完全一致
            layer.load(); //上传loading

        }
        , done: function (res, index, upload) {
            layer.closeAll('loading');
            if (res.id > 0) { //上传成功
                var span = demoListView.find('#upload_' + index);
                // ,tds = tr.children();
                span.removeClass('layui-hide');
                // tds.eq(3).html(''); //清空操作
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }
            this.error(index, upload);
        }
        , error: function (index, upload) {
            var tr = demoListView.find('tr#upload-' + index)
                , tds = tr.children();
            // tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            tds.eq(2).find('.demo-reload').removeClass('layui-hide'); //显示重传
        }
    });
})
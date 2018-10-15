layui.extend({
    request: '{/}../../../static/js/network/request',
});
/*var usertable = layui.sessionData('user');
var user = usertable.user;
if (usertable == undefined || user == undefined || !user.isLogin) {
    window.parent.location.href = "/HotelAdmin/login.html";
}
var hotel = user.hotelID;*/
var hotel = '';
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
    var uploadData = null;
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        uploadData = data;
        if (getJsonLength(Instfiles) > 0) {
            uploadInst.upload();
        } else if (getJsonLength(files) > 0) {
            uploadListIns.upload();
        } else {
            loadData();
        }


        return false;
    });
    function loadData() {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        if ("edit" == op) {
            editRoomStyle(uploadData, id);
        } else {
            addRoomStyle(uploadData);
        }

    }
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        getAllTag(hotel,op,id)


    });
    function getAllTag(hotel,op,id) {
        request.doGet("/admin/tags/", {}, function (data) {
            var alltag = data.results;
            if (alltag != null) {
                var html = "";
                for (var i = 0; i < alltag.length; i++) {
                    html += " <input type=\"checkbox\" name=\"tags\" value='" + alltag[i].name + "' tagid=\" + alltag[i].id + \" title=\"" + alltag[i].name + "\">"
                }
                $("#tag_div").html(html);
                form.render();
            }
            getHotelSelect(hotel,op,id);

        });
    }
    var Instfiles;
    var uploadInst =upload.render({
        elem: '#test1'
        , url: 'http://api.gaoshiwang.cn/admin/image/'
        , field: 'image'
        , multiple: true
        , headers: {"Authorization": layui.data('token').token}
         ,auto: false
        // ,bindAction: '#add'
        , choose: function (obj) {
            //预读本地文件示例，不支持ie8
            Instfiles = obj.pushFile()
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //上传完毕
            if (res.id > 0) {
                console.log(res);
                $('#cover_images').val(res.image);
                if (getJsonLength(files) > 0) {
                    uploadListIns.upload();
                } else {
                    loadData();
                }
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
    function getHotelSelect(hotel,op,id) {
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
            if ( "edit" == op) {
                getRoomStyleDetail(id)
            }
        });
    }

    function editRoomStyle(data, id) {
        request.doPut("/admin/room_style/" + id + "/", {
            tags:getTags(),
            price: data.field.price,
            belong_hotel: data.field.hotel,
            cover_image:$("#cover_images").val(),
            is_active: data.field.is_active == '1' ? true : false,
            room_count:data.field.room_count,
            style_name: data.field.style_name,
            room_profile: data.field.room_profile,
            images: getImages()
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
        // "tags": [
        //     "string"
        // ],
        //     "price": 0,
        //     "is_active": true,
        //     "cover_image": "string",
        //     "room_count": 0,
        //     "style_name": "string",
        //     "room_profile": "string",
        //     "images": [
        //     "string"
        // ],
        //     "belong_hotel": "string"
        request.doPost("/admin/room_style/", {
            tags:getTags(),
            price: data.field.price,
            belong_hotel: data.field.hotel,
            cover_image:$("#cover_images").val(),
            is_active: data.field.is_active == '1' ? true : false,
            room_count:data.field.room_count,
            style_name: data.field.style_name,
            room_profile: data.field.room_profile,
            images: getImages()
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

    var demoListView = $('#layer-photos-demo')

    function getRoomStyleDetail(id) {
        var op = request.getQueryString("op");

        request.doGet("/admin/room_style/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            $("input[name=is_active]").each(function () {
                if ($(this).val() == response.is_active) {
                    $(this).attr('checked', true);
                }
            });
            $("#room_count_div").removeClass("layui-hide");
            // $("#left_room_count_div").removeClass("layui-hide");
            var images = response.images;
            for (var i = 0; i < images.length; i++) {
                    var tr = $([' <div class="layui-upload-list ">\n' +
                    '<span class="con_img" >' +
                    '                    <img id="image_' + i + '" imageUrl="'+images[i]+'" style="width: 200px;height: 200px" layer-src=' + images[i] + ' src=' + images[i] + ' class="layui-upload-img image_path" >\n' +
                    '</span>' +
                    '                    <span >' +
                    '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>' +
                    '</span>\n' +
                    '                </div>'
                    ].join(''));
                    //删除
                    tr.find('.demo-delete').on('click', function () {
                        // delete files[index]; //删除对应的文件
                        $(this).parent("span").parent(".layui-upload-list").remove();
                    });
                    demoListView.append(tr);
            }
            $("input[name=is_active]").each(function () {
                if ($(this).val() == response.is_active) {
                    $(this).attr('checked', true);
                }
            });
            var tags = response.tags;
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
    }

    var files;
    var uploadListIns = upload.render({
        elem: '#testList'
        , url: 'http://api.gaoshiwang.cn/admin/image/'
        , accept: 'file'
        , field: 'image'
        , headers: {"Authorization": layui.data('token').token}
        , multiple: true
        , auto: false

        , choose: function (obj) {
             files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {

                var tr = $([' <div class="layui-upload-list ">\n' +
                '<span class="con_img" >' +
                '                    <img id="image_' + index + '"  style="width: 200px;height: 200px" layer-src=' + file + ' src=' + result + ' class="layui-upload-img image_path" >\n' +
                '<span id="upload_' + index + '" class="ms layui-hide"style="color: rgb(248,253,253);text-align: center;">上传成功</span></span>' +
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
                // layer.photos({
                //     photos: '#layer-photos-demo'
                //     ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                //     ,full:true
                // });
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
                var img = demoListView.find('#image_' + index);
                img.attr("imageUrl", res.image);
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
        },
        allDone: function (obj) { //当文件全部被提交后，才触发
        console.log(obj.total); //得到总文件数
        console.log(obj.successful); //请求成功的文件数
        console.log(obj.aborted); //请求失败的文件数
        if (obj.total == obj.successful) {
            loadData();
        } else {
            layer.msg("有文件未上传成功，请重新上传", {icon: 5});
        }

    }
    });

    var getImages = function () {
        var images = new Array();
        var spans = $(".image_path");
        for (var i = 0; i < spans.length; i++) {
            images.push($(spans[i]).attr("imageUrl"))
        }
        return images;
    }

    function getJsonLength(jsonData) {

        var jsonLength = 0;

        for (var item in jsonData) {

            jsonLength++;

        }
        return jsonLength;
    }
    function getTags() {
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
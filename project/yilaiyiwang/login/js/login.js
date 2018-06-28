$(function () {
    // 登录账号input失去焦点时所触发的函数
    $('#iphoneInputIn').blur(function () {
        // 账号的验证 手机号验证
        if (!RegExpObj.Reg_mobilePhone.test($(this).val())) {
            $("#an").css("display", "block");
        }
    }).focus(function () {
        $("#an").css("display", "none");
    });
    //密码输入框事件
    $('#passwordUp').blur(function () {
        if ($(this).val() == '') {
            $("#pw").css("display", "block");
        }
    }).focus(function () {
        $("#pw").css("display", "none");
    });
    // 登录函数封装
    //  鼠标点击登录按钮 执行login函数
    $('.loginBtn').click(function () {
        if (!RegExpObj.Reg_mobilePhone.test($('#iphoneInputIn').val())) {
            $("#an").css("display", "block");
        } else {
            $("#an").css("display", "none");
            $("#pw").css("display", "none");
           var index = layer.msg('请勿重复操作,正在处理...', {
               icon: 16,
               shade: 0.3,
               time: 0
           });
            $.ajax({
                type: 'POST',
                url: IP + 'login',
                dataType: 'json',
                data: {
                    "username": $('#iphoneInputIn').val(),
                    "password": $('#passwordUp').val()
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (data) {
                    console.log(data)
                    if (data.status == 200) {
                         /* 获取个人中心信息 */
                         $.ajax({
                             type: 'POST',
                             url: IP + 'user/getSelfDetail',
                             dataType: 'json',
                             data: {},
                             xhrFields: {
                                 withCredentials: true
                             },
                             crossDomain: true,
                             async:false,
                             success: function (data) {
                                 console.log(data);
                                 if (data.status == 200) {
                                  localStorage.setItem('userId', data.userId);
                                  localStorage.setItem('name', data.name);
                                  localStorage.setItem('occupationName', data.occupationName);
                                  localStorage.setItem('deptName', data.deptName);
                                  localStorage.setItem('hospitalName', data.hospitalName);
                                
                                    }
                                }
                         });

                        layer.close(index);
                        localStorage.setItem('rolesName', data.rolesName);
                        if (data.rolesName == '医政') {
                            window.location.href = '/yilaiyiwang/workbench/workbench.html';
                        } else {
                            window.location.href = '/yilaiyiwang/morkbench/morkbench.html';
                        }
                    } else if (data.status == 208) {
                        layer.msg("用户名或密码错误！",{time:2000});
                    } else if (data.status == 252) {
                        layer.msg("未审核",{time:2000});
                    } else if (data.status == 253) {
                        layer.msg("审核未通过",{time:2000});
                    }else{
                        layer.msg('网络连接错误！');
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            });
        }
    });
    // 点击回车调用按钮点击事件
    $("body").keydown(function (event) {

        if (event.keyCode == "13") {

            $('.loginBtn').click();
        }
    });
});

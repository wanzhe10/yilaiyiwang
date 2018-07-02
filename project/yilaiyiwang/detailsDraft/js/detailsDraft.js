$(function() {
    var fileAllArr = []; //所有图片原始资源
    // 选择的医生信息数组
    var favoriteArr = [];
    var hospitalName = '';
    var noDocDeptId = '';
    var scaleNum = 10; // 图片缩放倍数
    //姓名 身份证号 验证

    // 验证中文名字
    $('#username').blur(function() {
        if ($('#username').val().length === 0) {
            layer.msg('姓名不能为空');
        } else if (!RegExpObj.Reg_Name.test($('#username').val())) {
            layer.msg('输入内容格式有误,请修改');
        }
    });
     //  校验身份证号
     $('#idCard').blur(function () {
         // 账号的验证 手机号验证
         if ($('#idCard').val().length === 0) {
             layer.msg('身份证号不能为空');
         } else if (!RegExpObj.Reg_IDCardNo.test($('#idCard').val())) {
             layer.msg('输入内容格式有误，请修改');
         } else {
             discriCard($(this).val())
         }
     });
    //  校验年龄 身高 体重
    $('#age').blur(function() {
        if (!RegExpObj.Reg_age.test($('#age').val())) {
            layer.msg('输入内容格式有误，请修改');
        } else if ($('#age').val().length == 0) {
            layer.msg('年龄不能为空');
        }
    });
    $('#high').blur(function() {
        if (!RegExpObj.Reg_Number.test($('#high').val())) {
            layer.msg('输入内容格式有误，请修改');

        } else if ($('#high').val().length == 0) {
            layer.msg('身高不能为空');
        }
    });
    $('#weight').blur(function() {
        if (!RegExpObj.Reg_Number.test($('#weight').val())) {

            layer.msg('输入内容格式有误，请修改');
        } else if ($('#weight').val().length == 0) {
            layer.msg('体重不能为空');
        }
    });
    //    验证电话号码
    $('#phone').blur(function() {
        if (!RegExpObj.Reg_isPhone.test($('#phone').val())) {
            layer.msg('输入内容格式有误，请修改');
        } else if ($('#phone').val().length == 0) {
            layer.msg('电话号码不能为空');
        } else if (!RegExpObj.Reg_isPhone.test($('#phone').val())) {
            layer.msg('输入内容格式有误，请修改');
        }
    });
    //    验证常住城市
    $('#address').blur(function() {
        if ($('#address').val().length == 0) {
            layer.msg('城市不能为空');
        } else if (!RegExpObj.Reg_address.test($('#address').val())) {
            layer.msg('输入内容格式有误，请修改');
        }
    });
    // 验证初步诊断不能为空
    $('#createCase_textDiagnose').blur(function() {
        if ($('#createCase_textDiagnose').val().length == 0) {
            layer.msg('初步诊断不能为空');
        }
    });
    // 验证会、转诊目的不能为空
    $('#createCase_textGola').blur(function() {
        if ($('#createCase_textGola').val().length == 0) {
            layer.msg('会/转诊目的不能为空');
        }
    });
     // 输入身份证号自动计算年龄 性别 idCard
     function discriCard(UUserCard) {
         var unit = '岁'; // 单位
         var num = 0; // 值
         if (UUserCard.length == 18) {
             //获取出生日期
             var userYear = UUserCard.substring(6, 10);
             var userMonth = UUserCard.substring(10, 12);
             var userDay = UUserCard.substring(12, 14);
             //获取性别
             if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
                 $('#man').addClass('active').siblings('a').removeClass('active');
             } else {
                 $('#woman').addClass('active').siblings('a').removeClass('active');
                 //是女则执行代码 ...
             }
         } else {
             var userYear = 19 + UUserCard.substring(6, 8);
             var userMonth = UUserCard.substring(8, 10);
             var userDay = UUserCard.substring(10, 12);
             //获取性别
             if (parseInt(UUserCard.substring(14, 15)) % 2 == 1) {
                 console.log($('.sex > a').html())
                 $('#man').addClass('active').siblings('a').removeClass('active');
             } else {
                 $('#woman').addClass('active').siblings('a').removeClass('active');
                 //是女则执行代码 ...
             }
         }
         // 计算年月日
         var myDate = new Date();
         var year = myDate.getFullYear(); // 当前年份
         var month = myDate.getMonth() + 1; // 当前月份
         var day = myDate.getDate(); // 当前号数
         if (year - userYear > 0) {
             num = year - userYear;
             unit = '岁';
         } else if (month - userMonth > 0) {
             num = month - userMonth;
             unit = '月';
         } else if (day - userDay >= 0) {
             num = day - userDay;
             unit = '天';
         } else {
             layer.msg('输入内容格式有误，请修改');
         }
         $('#age').val(num);
         $('.choiceAge').val(unit);
     }



    // 草稿的-创建病历左侧列表
    $.ajax({
        type: 'GET',
        url: IP + 'caseType/findList',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        success: function(data) {
            console.log(data);
            if (data.status == 200) {

                var _html = '<li class="oneLevelItem patientInfo active">\
                    <p class="oneLevelName">患者基本信息</p>\
                </li>\
                <li class="oneLevelItem caseHistory">\
                    <p class="oneLevelName">电子病历附件</p>\
                    <ul class="twoLevelUl">';
                $.each(data.listList, function(key, val) {
                    _html += '<li class="twoLevelItem">\
                                <p class="twoLevelName">' + key + '</p>\
                                <ul class="threeLevelUl">';
                    for (var i = 0; i < val.length; i++) {
                        _html += '<li class="threeLevelItem" name="' + val[i].id + '">' + val[i].name + '</li>'
                    }
                    _html += '</ul>\
                            </li>'
                });
                _html += '</ul>\
            </li>'
                $('.oneLevelUl').html(_html);
                $('.oneLevelItem').eq(0).addClass('active').find('.twoLevelUl').show().find('.twoLevelItem').eq(0).addClass('active').find('.tthreeLevelUl').slideDown();
                // $('.oneLevelUl').find('.threeLevelItem').eq(0).addClass('active');
                $('.oneLevelUl').css({
                    'width': '145px',
                    'position': 'fixed',
                });
                $('.twoLevelUl').css({
                    'height': $(window).height() - 230 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
                });


                var upfileHtml = '';
                $.each(data.listList, function(key, val) {
                    for (var i = 0; i < val.length; i++) {
                        upfileHtml += '<li name="' + val[i].name + '" id="' + val[i].id + '" class="upfileItem clearfix">\
                            <div class="upfileContent">\
                                <div class="operateLeft">' + key + '-' + val[i].name + '</div>\
                                <ul class="fileContent clearfix">\
                                    <li class="fileAdd">\
                                        <a class="addfileBtn" href="javascript:;"></a>\
                                        <input class="fileInput" type="file">\
                                        <p class="fileName">添加文件</p>\
                                    </li>\
                                </ul>\
                            </div>\
                        </li>'
                    }
                });
                $('.upfileUl').html(upfileHtml);
            } else if (data.status == 250) {
                window.location = '/yilaiyiwang/login/login.html'
            }
        },
        error: function(err) {
            console.log(err);
        },
    });

    var hospitalPicArr = [];
    // 获取选医生左侧通讯录数据
    $.ajax({
        type: 'GET',
        url: IP + 'hospital/findHospitalDetailList',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        crossDomain: true,
        success: function(data) {
            console.log(data);
            if (data.status == 200) {
                var hospitalArr = data.hospitalListBeanList;
                  hospitalId = hospitalArr[0].hospitalId;
                  hospitalName = hospitalArr[0].hospitalName;
                var _html = '';
                for (var i = 0; i < hospitalArr.length; i++) {
                    hospitalPicArr.push({"hospitalId": hospitalArr[i].hospitalId,"hospitalImgPic": hospitalArr[i].price,"hospitalVideoPic": hospitalArr[i].priceVideo});
                    _html += '<li imgPric="' + hospitalArr[i].price + '" videoPric="' + hospitalArr[i].priceVideo + '" hospitalTel="' + hospitalArr[i].phone + '" class="hospitalItem">\
                        <p class="hospitalName">' + hospitalArr[i].hospitalName + '</p>\
                        <ul class="sectionUl">';
                    var sectionArr = hospitalArr[i].hospitalDeptsManagerBeanList;
                    for (var j = 0; j < sectionArr.length; j++) {
                        _html += '<li class="sectionItem">\
                                <p class="sectionName">' + sectionArr[j].parentName + '</p>\
                                <ul class="deptUl">'
                        var deptArr = sectionArr[j].changeDept;
                        for (var x = 0; x < deptArr.length; x++) {
                            _html += '<li name="' + deptArr[x].deptHospitalId + '" class="deptItem">' + deptArr[x].name + '</li>'
                        }
                        _html += '</ul>\
                         </li>'
                    }
                    _html += '</ul>\
                    </li>'
                }
                $('.hospitalUl').html(_html);
                // 默认选项
                $('.hospitalItem').eq(0).addClass('active').find('.sectionUl').show().find('.sectionItem').eq(0).addClass('active').find('.deptUl').slideDown();
                $('.hospitalUl').find('.deptItem').eq(0).addClass('active');
                $('.hospitalUl').css({
                    'width': '145px',
                    'position': 'fixed',
                });
                $('.sectionUl').css({
                    'height': $(window).height() - 200 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
                });
                // 医院价格 和 手机号 处理
                $('.hospitalTel').html(hospitalArr[0].phone);
                $('.imgPric').attr('imgPric', $('.hospitalItem').eq(0).attr('imgpric'));
                $('.videoPric').attr('videoPric', $('.hospitalItem').eq(0).attr('videopric'));
                favoriteHtml();
                // 获取默认科室的医生
                deptIdGetDoctors($('.hospitalUl').find('.deptItem').eq(0).attr('name'));
            } else if (data.status == 250) {
                window.location = '/yilaiyiwang/login/login.html';
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
    // order/selectDraftsOrderById 查看草稿详情接口
    $.ajax({
        type: 'POST',
        url: IP + 'order/selectDraftsOrderById',
        dataType: 'json',
        data: {
            "orderId": localStorage.getItem('detailsId'),
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        async: false,
        success: function(data) {
            console.log(data)
            if (data.status == 200) {
                // 成功操作
                sessionStorage.setItem('data', JSON.stringify(data));
            } else if (data.status == 250) {
                // 未登录操作
                window.location = '/yilaiyiwang/login/login.html';
            } else {
                // 其他操作
            }
        },
        error: function(err) {
            console.log(err);

        },
    });

    var orderHospitalId = '';
    // 判断是从草稿箱跳转来的
    if (JSON.parse(sessionStorage.getItem('data'))) {
        var data = JSON.parse(sessionStorage.getItem('data'));
        orderHospitalId = data.orderFormBean.hospitalId;
        console.log(data);
        // 清楚缓存数据
        sessionStorage.removeItem('data');
        // 整理医生数组
        for (var i = 0; i < data.orderDoctorsList.length; i++) {
            if (data.orderDoctorsList[i].firstDoctor == 1) {
                for (var j = 0; j < hospitalPicArr.length;j++) {
                    if (data.orderFormBean.hospitalId == hospitalPicArr[j].hospitalId) {
                        favoriteArr.unshift({
                            id: data.orderDoctorsList[i].id, // 医生id
                            hospitalName: data.orderDoctorsList[i].hospitalName, // 医院名字
                            hospitalId: data.orderDoctorsList[i].hospitalId, // 医院id
                            deptName: data.orderDoctorsList[i].deptName, // 科室名字
                            deptId: data.orderDoctorsList[i].deptId, // 科室id
                            name: data.orderDoctorsList[i].name, // 医生名字
                            medicalFees: data.orderDoctorsList[i].picPrice, // 图文价格
                            medicalFeesVideo: data.orderDoctorsList[i].avPrice, // 视频价格
                            occupationName: data.orderDoctorsList[i].occupation, // 职称名字
                            occupationId: data.orderDoctorsList[i].occupationId, // 职称id
                            hospitalImgPic: hospitalPicArr[j].hospitalImgPic, // 医院图文价格
                            hospitalVideoPic: hospitalPicArr[j].hospitalVideoPic, // 医院视频价格
                        });
                    }
                }
            } else {
                for (var j = 0; j < hospitalPicArr.length; j++) {
                    if (data.orderFormBean.hospitalId == hospitalPicArr[j].hospitalId) {
                        favoriteArr.unshift({
                            id: data.orderDoctorsList[i].id, // 医生id
                            hospitalName: data.orderDoctorsList[i].hospitalName, // 医院名字
                            hospitalId: data.orderDoctorsList[i].hospitalId, // 医院id
                            deptName: data.orderDoctorsList[i].deptName, // 科室名字
                            deptId: data.orderDoctorsList[i].deptId, // 科室id
                            name: data.orderDoctorsList[i].name, // 医生名字
                            medicalFees: data.orderDoctorsList[i].picPrice, // 图文价格
                            medicalFeesVideo: data.orderDoctorsList[i].avPrice, // 视频价格
                            occupationName: data.orderDoctorsList[i].occupation, // 职称名字
                            occupationId: data.orderDoctorsList[i].occupationId, // 职称id
                            hospitalImgPic: hospitalPicArr[j].hospitalImgPic, // 医院图文价格
                            hospitalVideoPic: hospitalPicArr[j].hospitalVideoPic, // 医院视频价格
                        });
                    }
                }
            }
        }
        
        favoriteHtml();

        $('#username').val(data.orderFormBean.name);
        $('#idCard').val(data.orderFormBean.idCard);
        $('#phone').val(data.orderFormBean.phone);
        $('#address').val(data.orderFormBean.address);
        var orderId = data.orderFormBean.id;
        var choiceAge = data.orderFormBean.age;
        $('#age').val(choiceAge.substr(0, choiceAge.length - 1));
        $('.choiceAge').val(choiceAge.substr(-1, 1));
        $('#high').val(data.orderFormBean.high);
        $('#weight').val(data.orderFormBean.weight);
        if (data.orderFormBean.sex == '男') {
            $('.sex > a').removeClass('active').eq(0).addClass('active');
        } else {
            $('.sex > a').removeClass('active').eq(1).addClass('active');
        }
        $('.urgent > a').removeClass('active').eq(data.orderFormBean.isurgent).addClass('active');
        $('#createCase_textDiagnose').val(data.orderFormBean.diagnosis); //初步诊断
        $('#createCase_textGola').val(data.orderFormBean.telemedicineTarget); //会诊目的



        /* 电子病历附件 */
        var tempArr = data.patientCaseList;
        for (var i = 0; i < tempArr.length; i++) {
            var fileType = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('.') + 1, tempArr[i].filesUrl.length);
            var fileName = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('/') + 1, tempArr[i].filesUrl.length);
            fileAllArr.push(fileName);
            if (fileType == 'png' || fileType == 'jpg') {
                if (tempArr[i].remarks == '') {
                    $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                           <div style = "background-image: url(&apos;'+ imgIp + tempArr[i].filesUrl +'&apos;)"></div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                } else {
                    $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                           <div style = "background-image: url(&apos;'+ imgIp + tempArr[i].filesUrl +'&apos;)"></div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="img" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
                }
            } else if (fileType == 'pdf') {
                if (tempArr[i].remarks == '') {
                    $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/pdf_icon.png)"> </div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="pdf" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                } else {
                    $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/pdf_icon.png)"> </div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="pdf" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
                }
            } else if (fileType == 'dcm') {
                if (tempArr[i].remarks == '') {
                    $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '"  class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/dcm_icon.png)"> </div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="dcm" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                        </li>')
                } else {
                    $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" filePath="' + tempArr[i].filesUrl + '" class="fileItem">\
                                            <div class="bgSize" style = "background-image: url(/yilaiyiwang/images/dcm_icon.png)"> </div>\
                                            <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>\
                                            <p type="dcm" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                        </li>')
                }
            }
            $('.sum').html(fileAllArr.length);
            $(".fileContent").sortable({
                items: "li:not(.fileAdd)"
            });
        }
    }


    // 上面tab切换
    $('.tabContent > a').click(function() {
        var _index = $(this).index();
        $(this).addClass('active').siblings('a').removeClass('active');
        $('.contentBox > div').eq(_index).show().siblings('div').hide();
        $('.tabBox > a').eq(_index).show().siblings('a').hide();
    });
    // 底部上一步下一步切换
    $('.tabBox > a').click(function() {
        var _index = $(this).index();
        $(this).hide().siblings('a').show();
        $('.contentBox > div').eq(_index).hide().siblings('div').show();
        $('.tabContent > a').eq(_index).removeClass('active').siblings('a').addClass('active');
    });

    // 男女选择
    $('.sex > a').click(function() {
        $(this).addClass('active').siblings('a').removeClass('active');
    });
    // 加急选择
    $('.urgent > a').click(function() {
        $(this).addClass('active').siblings('a').removeClass('active');
    });



    // 展示选择的医生
    function favoriteHtml() {
        console.log(favoriteArr)
        var _html = "";

        $('.doctorCount').html(favoriteArr.length);
        if (favoriteArr.length == 0) {
            _html = '<li class="clearfix"><span>主会诊人:未选择</span></li>';
            for (var i = 0; i < hospitalPicArr.length;i++) {
                if (hospitalPicArr[i].hospitalId == orderHospitalId) {
                    $('.imgPric').html(hospitalPicArr[i].hospitalImgPic);
                    $('.videoPric').html(hospitalPicArr[i].hospitalVideoPic);
                }
            }
            
        } else {
            var imgPric = Number(favoriteArr[0].hospitalImgPic);
            var videoPric = Number(favoriteArr[0].hospitalVideoPic);
            for (var i = 0; i < favoriteArr.length; i++) {
                if (i == 0) {
                    _html += '<li class="clearfix"><span>主会诊人:<' + favoriteArr[i].hospitalName + ';' + favoriteArr[i].deptName + ';' + favoriteArr[i].name + ';' + favoriteArr[i].occupationName + '>;</span><img class="delDocBtn" src="../images/delDoc.png" alt=""></li>';
                } else {
                    _html += '<li class="clearfix"><span><' + favoriteArr[i].hospitalName + ';' + favoriteArr[i].deptName + ';' + favoriteArr[i].name + ';' + favoriteArr[i].occupationName + '>;</span><img class="delDocBtn" src="../images/delDoc.png" alt=""></li>';
                }
                imgPric += Number(favoriteArr[i].medicalFees);
                videoPric += Number(favoriteArr[i].medicalFeesVideo);
            }
        }
        $('.favoriteUl').html(_html);
        $('.imgPric').html(imgPric);
        $('.videoPric').html(videoPric);
    }
    favoriteHtml();

    // 滚动事件
    $(window).scroll(function() {
        $('.hospitalUl').css({
            'width': '145px',
            'position': 'fixed',
        });
        if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
            $('.sectionUl').css({
                'height': $(window).height() - 300 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            });
        } else {
            $('.sectionUl').css({
                'height': $(window).height() - 230 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            });
        }
    });

    $(window).scroll(function() {
        $('.oneLevelUl').css({
            'width': '145px',
            'position': 'fixed',
        });
        if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
            $('.twoLevelUl').css({
                'height': $(window).height() - 300 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
            });
        } else {
            $('.twoLevelUl').css({
                'height': $(window).height() - 230 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
            });
        }
    });

    // 选医生左侧三级列表切换
    // 医院切换
    $('.hospitalUl').delegate('.hospitalItem', 'click', function() {
        $(this).addClass('active').siblings('.hospitalItem').removeClass('active');
        $(this).find('.sectionUl').stop(true).slideToggle();
        $(this).siblings('.hospitalItem').find('.sectionUl').stop(true).slideUp();
        $('.hospitalTel').html($(this).attr('phone'));
        // $('.imgPric').attr('imgPric', $(this).attr('imgPric')).html($(this).attr('imgPric'));
        // $('.videoPric').attr('videoPric', $(this).attr('videoPric')).html($(this).attr('videoPric'));
           hospitalId = $(this).attr('hospitalid');
           hospitalName = $(this).find('.hospitalName').html();
    });
    // 一级科室切换
    $('.hospitalUl').delegate('.sectionItem', 'click', function() {
        if ($(this).find('.deptUl').css('display') == 'none') {
            $(this).addClass('active').siblings('.sectionItem').removeClass('active');
        } else {
            $(this).removeClass('active').siblings('.sectionItem').removeClass('active');
        }
        $(this).find('.deptUl').stop(true, true).slideToggle();
        $(this).siblings('.sectionItem').find('.deptUl').stop(true, true).slideUp();
        return false;
    });
    // 二级科室切换
    $('.hospitalUl').delegate('.deptUl', 'click', function() {
        return false;
    });
    $('.hospitalUl').delegate('.deptItem', 'click', function() {
        $('.hospitalUl').find('.deptItem').removeClass('active');
        $(this).addClass('active');
        deptIdGetDoctors($(this).attr('name'));
        return false;
    });

    // 根据二级科室id查询医生
    function deptIdGetDoctors(deptId) {
        // deptId 二级科室id
        $.ajax({
            type: 'POST',
            url: IP + 'user/selectSimpleUserWithDeptId',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                deptHospitalId: deptId,
            },
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    var tempArr = data.userList;
                    var _html = '<li class="doctorChunk noDocter">\
                        <div class="Firstdiamond"></div>\
                        <div class="message">\
                            <span class="mess_l">不选医生</span><span>远程中心</span>\
                            <p class="p1">北京朝阳医院本部</p>\
                            <p class="p4">选择此项,申请将发送至对方医院远程中心,由医务人员将为您调度医院资源,诊费会在选定医院后确定。<br />请将您的备注信息填至【会/转诊目的】 </p>\
                        </div>\
                    </li>';
                    
                    var userCaseHistoryBeanList = [];
                    for (var i = 0; i < tempArr.length; i++) {
                        // 获取病历要求
                        $.ajax({
                            type: 'POST',
                            url: IP + 'userCaseHistory/selectCaseTypeList',
                            dataType: 'json',
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            data: {
                                userId: tempArr[i].id,
                            },
                            async: false,
                            success: function(data) {
                                console.log(data);
                                if (data.status == 200) {
                                    userCaseHistoryBeanList = data.userCaseHistoryBeanList;
                                } else if (data.status == 250) {

                                } else {

                                }
                            },
                            error: function(err) {
                                console.log(err)
                            },
                        });

                        _html += '<li deptName="' + tempArr[i].hospitalDept.dept.name + '" deptId="' + tempArr[i].hospitalDept.id + '" name="' + tempArr[i].id + '" class="doctorChunk">\
                            <div class="diamond"></div>\
                            <div class="message">\
                                <span class="mess_l username">' + tempArr[i].name + '</span>\
                                <span class="occupation" name="' + tempArr[i].occupation.id + '">' + tempArr[i].occupation.name + '</span>\
                                <p class="p1 hospital" hospitalImgPic="'+tempArr[i].hospitalDept.hospital.price+'" hospitalVideoPic="'+tempArr[i].hospitalDept.hospital.priceVideo+'" name="' + tempArr[i].hospitalDept.hospital.id + '">' + tempArr[i].hospitalDept.hospital.name + '</p>\
                                <p class="p2">' + tempArr[i].beGoodAt + '</p>\
                                <p medicalFeesVideo="' + tempArr[i].medicalFeesVideo + '" medicalFees="' + tempArr[i].medicalFees + '" class="p3 pric">图文&nbsp;' + tempArr[i].medicalFees + '元/视频&nbsp;' + tempArr[i].medicalFeesVideo + '元</p>\
                            </div>\
                            <div class="present">\
                                <h4>联系电话<span>' + tempArr[i].telephone + '</span></h4>\
                                <h4>擅长</h4>\
                                <p>' + tempArr[i].beGoodAt + '</p>\
                                <h4>病历要求</h4>\
                                <p>'
                        for (var j = 0; j < userCaseHistoryBeanList.length; j++) {
                            _html += userCaseHistoryBeanList[j].detialName + "、"
                        }
                        _html += '</p>\
                            </div>\
                        </li>'
                    }
                    $('.doctorUl').html(_html);
                } else if (data.status == 250) {
                    window.location = '/yilaiyiwang/login/login.html';
                } else {

                }
            },
            error: function(err) {
                console.log(err)
            },
        });
    }

    // 选医生鼠标移入展示详情
    $('.doctorUl').delegate('.doctorChunk', 'mouseover', function(event) {
        event.stopPropagation();
        $(".doctorChunk").css("border", "1px solid #efefef");
        $(this).css("border", "1px solid #F6C567");
        if (($(this).index() + 1) % 3 == 0) {
            $(this).children(".present").css({
                "top": "0",
                "left": "-462px"
            }).show();
        } else {
            $(this).children(".present").css({
                "top": "0",
                "right": "0"
            }).show();
        }
    });

    // 选医生鼠标移出收起详情
    $('.doctorUl').delegate('.doctorChunk', 'mouseleave', function(event) {
        $(this).find('.present').hide();
        $(this).css("border", "1px solid #efefef");
    });

    // 选择医生事件--添加
    $('.doctorUl').delegate('.doctorChunk', 'click', function(event) {
        if ($(this).hasClass('noDocter')) {
            // 点的不选医生
            favoriteArr = [];
              $('.imgPric').attr('imgPric', $('.hospitalItem.active').attr('imgpric'));
              $('.videoPric').attr('videoPric', $('.hospitalItem.active').attr('videopric'));
            favoriteHtml();
              noDocDeptId = $(this).find('.p1').attr('deptid');
        } else if (favoriteArr.length > 0 && $(this).find('.hospital').attr('name') != favoriteArr[0].hospitalId) {
            var _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 2000,
                content: _$('.operateBox'),
            });
            setTimeout(function () {
                $('.operateBox').hide();
            }, 2000)
        } else {
            // 点的某一个医生
            var flag = true;
            for (var i = 0; i < favoriteArr.length; i++) {
                if (favoriteArr[i].id == $(this).attr('name')) {
                    flag = false;
                }
            }
            if (flag) {
                favoriteArr.push({
                    id: $(this).attr('name'), // 医生id
                    hospitalName: $(this).find('.hospital').html(), // 医院名字
                    hospitalId: $(this).find('.hospital').attr('name'), // 医院id
                    hospitalImgPic: $(this).find('.hospital').attr('hospitalimgpic'), // 医院图文价格
                    hospitalVideoPic: $(this).find('.hospital').attr('hospitalvideopic'), // 医院视频价格
                    deptName: $(this).attr('deptName'), // 科室名字
                    deptId: $(this).attr('deptId'), // 科室id
                    name: $(this).find('.username').html(), // 医生名字
                    medicalFees: $(this).find('.pric').attr('medicalFees'), // 图文价格
                    medicalFeesVideo: $(this).find('.pric').attr('medicalFeesVideo'), // 视频价格
                    occupationName: $(this).find('.occupation').html(), // 职称名字
                    occupationId: $(this).find('.occupation').attr('name'), // 职称id
                });
            }
            favoriteHtml();
        }
    });
    // 选择医生事件--删除
    $('.favoriteUl').delegate('.delDocBtn', 'click', function() {
        favoriteArr.splice($(this).parent('li').index(), 1);
        favoriteHtml();
    })

    function scrollTo(x) {
        console.log(x)
        $('html, body').animate({
            scrollTop: x - 100,
        }, 300);
    };

    // 病历信息一级按钮
    $('.oneLevelUl').delegate('.oneLevelItem', 'click', function() {
        $(this).addClass('active').siblings('.oneLevelItem').removeClass('active');
        $(this).find('.twoLevelUl').stop(true).slideToggle();
        $(this).siblings('.oneLevelItem').find('.twoLevelUl').stop(true).slideUp();
         scrollTo($('.hosp').not('.hosp:hidden').eq($(this).index()).offset().top);
    });
    // 病历信息二级按钮
    $('.oneLevelUl').delegate('.twoLevelItem', 'click', function() {
        if ($(this).find('.threeLevelUl').css('display') == 'none') {
            $(this).addClass('active').siblings('.twoLevelItem').removeClass('active');
        } else {
            $(this).removeClass('active').siblings('.twoLevelItem').removeClass('active');
        }
        $(this).find('.threeLevelUl').stop(true, true).slideToggle();
        $(this).siblings('.twoLevelItem').find('.threeLevelUl').stop(true, true).slideUp();
        return false;
    });
    // 病历信息三级按钮
    $('.oneLevelUl').delegate('.threeLevelUl', 'click', function() {
        return false;
    });
    $('.oneLevelUl').delegate('.threeLevelItem', 'click', function() {
        $('.oneLevelUl').find('.threeLevelItem').removeClass('active');
        $(this).addClass('active');
        scrollTo($('#' + $(this).attr('name')).offset().top);
        return false;
    });




    /*  //textarea 标签随着文本的高度实现自适应 */
    $('.text-adaption').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight)+ 'px;overflow-y:hidden;');
    }).on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });


    //点击添加 添加病历图片
    var selectFileArr = []; // 某一块的图片展示数据
    $('.upfileUl').delegate('.fileInput', 'change', function() {
      
        // 某一块添加时获取到当前块的展示数据
        var caseTypeId = $(this).parents('.upfileItem').attr('id');
        var caseTypeName = $(this).parents('.upfileItem').attr('name');

        var objParent = $(this).parents('.fileContent');
        var uploadFile = $(this)[0].files; // 某一块添加时的原始数据
        var _html = '';
        var fileLength = 0;
        if (uploadFile.length > 0) {
              var reader = new FileReader();
        reader.readAsDataURL(uploadFile[fileLength]);
       
        reader.onload = function(e) {
            if (e.target.result) {
                if (fileAllArr.indexOf(uploadFile[fileLength].name) == -1) {
                    // 未查找到
                    var type = uploadFile[fileLength].type;
                    var name = uploadFile[fileLength].name;
                    var sort = fileAllArr.length;
                    var fb = new FormData();
                    fb.append('file', uploadFile[fileLength]);
                    fb.append('patientId', data.orderFormBean.patientId); // 患者id
                    fb.append('patientName', data.orderFormBean.name);
                    fb.append('sort', sort);
                    fb.append('caseTypeId', caseTypeId);
                    fb.append('caseTypeName', caseTypeName);
                    console.log(type)
                    console.log(name)
                    console.log(sort)
                      var fileend = name.substring(name.lastIndexOf("."));
                      console.log(fileend)
                       if (!/[png|jpg |pdf|dcm]$/gi.test(name)) {
                          layer.msg('请上传png/jpg/pdf/dcm类型的文件');
                          return false;
                      }else if(fileend != ".jpg" && fileend != ".png" && fileend != ".pdf" && fileend != ".dcm") {
                          layer.msg('请上传png/jpg/pdf/dcm类型的文件');
                          return false;
                      }
                    $.ajax({
                        type: 'POST',
                        url: IP + 'order/addCaseFile',
                        dataType: 'json',
                        data: fb,
                        processData: false,
                        contentType: false,
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        success: function(data) {
                            console.log(data)
                            if (data.status == 200) {
                                fileAllArr.push(name);
                                // 成功操作
                                if (/[png|jpg]$/gi.test(name)) {
                                    objParent.append(
                                        `<li class="fileItem fileNewItem" sort="${sort}" id="${data.patientCaseId}" filePath="${data.patientCaseUrl}">\
                                          <div style='background-image:url(${imgIp+data.patientCaseUrl});'></div>\
                                          <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/><p type="img" desc="" class="fileName">${name}</p></li>`
                                    );
                                } else if (/[pdf]$/gi.test(name)) {
                                    // console.log('是pdf类型')
                                    objParent.append(
                                        `<li class="fileItem fileNewItem" sort="${sort}" id="${data.patientCaseId}" filePath="${data.patientCaseUrl}">\
                                                        <div class="bgSize" style='background-image:url(/yilaiyiwang/images/pdf_icon.png);'></div>\
                                                        <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/><p type="pdf" desc="" class="fileName">${name}</p></li>`
                                    );
                                } else if (/[dcm]$/gi.test(name)) {
                                    objParent.append(
                                        `<li class="fileItem fileNewItem" sort="${sort}" id="${data.patientCaseId}" filePath="${data.patientCaseUrl}">\
                                                        <div class="bgSize" style='background-image:url(/yilaiyiwang/images/dcm_icon.png);'></div>\
                                                        <img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/><p type="dcm" desc="" class="fileName">${name}</p></li>`
                                    );
                                } else {
                                    layer.msg('请上传png/jpg/pdf/dcm类型的文件');
                                }
                                $('.sum').html(Number($('.sum').html()) + 1);
                            } else if (data.status == 250) {
                                window.location = '/yilaiyiwang/login/login.html';
                            } else {
                                // 其他操作
                            }
                        },
                        error: function(err) {
                            console.log(err);
                        },
                    })
                };
                fileLength++;
                if (fileLength < uploadFile.length) {
                    reader.readAsDataURL(uploadFile[fileLength]);
                } else {
                    // 拖拽排序
                    $(".fileContent").sortable({
                        items: "li:not(.fileAdd)"
                    });
                }
            }
        };
        }
      
    });

    // 删除文件
    $('.upfileUl').delegate('.delFileBtn', 'click', function() {
        var fileId = $(this).parents('.fileItem').attr('id');
        var filePath = $(this).parents('.fileItem').attr('filePath');
        var fileName = filePath.substr(filePath.lastIndexOf('/'), filePath.length)

        $.ajax({
            type: 'POST',
            url: IP + 'order/deleteFile',
            dataType: 'json',
            data: {
                "fileId": fileId,
                "filePath": filePath,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    // 成功操作
                    fileAllArr.splice(fileAllArr.splice(fileAllArr.indexOf(fileName),1));
                    $('.sum').html(Number($('.sum').html()) - 1);
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);
            },
        });
        $(this).parent('.fileItem').remove();
        return false;
    });


    // 图片点击查看大图
    var objParent = null; // 当前点击块的父级
    var fileArr = []; // 当前点击块的文件数据
    var indexFile = 0; // 当前点击的索引
    var ObjArr = []; //  当前点击块的文件对象
    $('.upfileUl').delegate('.fileItem', 'click', function() {
        var $ = layui.jquery;
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['1167px', '700px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: false,
            scrollbar:false,
            content: $('.bigImgContainer'),
        });
        // 整理一组图片展示数据
        objParent = $(this).parent('.fileContent');
        indexFile = $(this).index() - 1;
        ObjArr = $(this).parent('.fileContent').find('.fileItem');
        for (var i = 0; i < ObjArr.length; i++) {
            fileArr.push({
                'id': ObjArr.eq(i).attr('id'),
                'name': ObjArr.eq(i).find('p').html(),
                'type': ObjArr.eq(i).find('p').attr('type'),
                'src': ObjArr.eq(i).find('div').css('backgroundImage'),
                'desc': ObjArr.eq(i).find('p').attr('desc'),
                'filePath': ObjArr.eq(i).attr('filepath'),
            });
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        if (fileArr[indexFile].type != 'img') {
            // pdf dcm
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
                 $('.downlodeFile').hide();

            }else {
          $('.downlodeFile').show(); 
          $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
          $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html('');
            }
        } else {
            $('.downlodeFile').hide();
            $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html('');

        }
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);

         
    });
    // 备注保存
    $('.descText').blur(function() {
        fileArr[indexFile].desc = $(this).val();
        $.ajax({
            type: 'POST',
            url: IP + 'order/updateRemarks',
            dataType: 'json',
            data: {
                "patientCaseId": fileArr[indexFile].id,
                "remarks": fileArr[indexFile].desc,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    // 成功操作
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
    });
    // 上一个
    $('.switchBox .prev').click(function() {
        if (indexFile <= 0) {
            indexFile = 0;
        } else {
            indexFile--;
        }
        if (fileArr[indexFile].type != 'img') {
            // pdf dcm
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                // pdf 相关操作
                // 1、往 .bigImg 渲染pdf
                PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                 $('.downlodeFile').show();
                 $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
                 $('.bigImgContainer').find('.bigImg').addClass('bgSize').html('');
            }
        } else {
            // 图片的相关操作
           $('.downlodeFile').hide();          
           $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        scaleNum = 10;
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);
            
    })
    // 下一个
    $('.switchBox .next').click(function() {
        if (indexFile >= fileArr.length - 1) {
            indexFile = fileArr.length - 1;
        } else {
            indexFile++;
        }
        if (fileArr[indexFile].type != 'img') {
            $('.bigImgContainer').find('.bigImg').addClass('bgSize');
            if (fileArr[indexFile].type == 'pdf') {
                PDFObject.embed(imgIp + fileArr[indexFile].filePath, ".bigImg", {
                    page: "1"
                });
            } else {
                // dcm 相关操作
                // 1、显示下载按钮
                // 2、imgIp + fileArr[indexFile].filePath 下载路径
                // 3、清空 .bigImg 的内容，显示背景
                 $('.downlodeFile').show();
                 $('.downlodeFile').children('a').attr('href', imgIp + fileArr[indexFile].filePath);
                 $('.bigImgContainer').find('.bigImg').addClass('bgSize').html('');
            }
        } else {
           $('.downlodeFile').hide();          
           $('.bigImgContainer').find('.bigImg').removeClass('bgSize').html(' ');
        }
        $('.bigImgContainer').find('.bigImg').css({
            "top": 0,
            "left": 0,
            "transform": "scale(1)",
        })
        scaleNum = 10;
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);
           
    });
    // 关闭
    $('.closeBtn').click(function() {
        layer.closeAll();
        $('.bigImgContainer').hide();
        var _html = '<li class="fileAdd">\
            <a class="addfileBtn" href="javascript:;"></a>\
            <input class="fileInput" type="file" multiple>\
            <p class="fileName">添加文件</p>\
        </li>';
        for (var i = 0; i < fileArr.length; i++) {
            _html += `<li class="fileItem fileNewItem" id="${fileArr[i].id}" filePath="${fileArr[i].filePath}">`;
            if (fileArr[i].type != 'img') {
                _html += `<div class="bgSize" style='background-image:${fileArr[i].src};'></div>`
            } else {
                _html += `<div style='background-image:${fileArr[i].src};'></div>`
            }
            _html += `<img class="delFileBtn" src="/yilaiyiwang/images/delete_file.png"/>`;
            if (fileArr[i].desc == '') {
                _html += '<p type="' + fileArr[i].type + '" desc="" class="fileName">' + fileArr[i].name + '</p>';
            } else {
                _html += '<p type="' + fileArr[i].type + '" desc="' + fileArr[i].desc + '" class="fileName active">' + fileArr[i].name + '</p>';
            }
            _html += '</li>'
        }
        objParent.html(_html);
        selectFileArr = [];
        objParent = null; // 当前点击块的父级
        fileArr = []; // 当前点击块的文件数据
        indexFile = 0; // 当前点击的索引
        ObjArr = []; //  当前点击块的文件对象
    });

    // 图片缩放 拖拽
    $('.bigImgBox').on("mousewheel DOMMouseScroll", function(e) {
        if (!$('.bigImgBox .bigImg').hasClass('bgSize')) {
            var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox
            if (delta > 0) {
                // 向上滚
                if (scaleNum <= 50) {
                    scaleNum += 2
                }
            } else if (delta < 0) {
                // 向下滚
                if (scaleNum > 4) {
                    scaleNum -= 2
                }
            }
            $('.bigImg').css('transform', 'scale(' + scaleNum / 10 + ')')
        }
    });
    $('.bigImgBox').on('mousedown', function(e) {
        if (!$('.bigImgBox .bigImg').hasClass('bgSize')) {
            var x = e.clientX - parseInt($('.bigImg').css('left'));
            var y = e.clientY - parseInt($('.bigImg').css('top'));
            $('.bigImgBox').on('mousemove', function(e) {
                var newX = e.clientX;
                var newY = e.clientY;
                console.log(newY - y)
                $('.bigImg').css({
                    'top': newY - y + 'px',
                    'left': newX - x + 'px',
                });
            });
        }
    });
     $('.bigImgBox').on('mouseup', function (e) {
         $('.bigImgBox').unbind('mousemove');
     })
     $('.bigImgBox').on('mouseleave', function () {
         $('.bigImgBox').unbind('mousemove');
     });
 
    // 图片缩放 拖拽 结束




    // 保存草稿
    $('.ServeDrafts').click(function() {
        var data = new FormData();
        data.append('id', orderId);
        data.append('name', $('#username').val());
        data.append('idCard', $('#idCard').val());
        data.append('phone', $('#phone').val());
        data.append('address', $('#address').val());
        data.append('age', $('#age').val() + $('.choiceAge').val());
        data.append('high', $('#high').val());
        data.append('weight', $('#weight').val());
        data.append('sex', $('.sex > a.active').html());
        data.append('draft', '0'); //草稿(0是1不是)
        data.append('isUrgent', $('.urgent > a.active').attr('value')); //是否加急(1是0不是)
        data.append('diagnosis', $('#createCase_textDiagnose').val()); //初步诊断
        data.append('telemedicineTarget', $('#createCase_textGola').val()); //会诊目的


        // favoriteArr 医生医院相关数据
        if (favoriteArr.length > 0) {
            var doctorList = [];
            data.append('consultationHospitalId', favoriteArr[0].hospitalId); // 会诊医院id
            data.append('deptId', favoriteArr[0].deptId); // 主会诊科室id
            for (var i = 0; i < favoriteArr.length; i++) {
                doctorList.push({
                    "doctorId": favoriteArr[i].id,
                    "money": favoriteArr[i].medicalFees,
                });
            }
            data.append('doctorList', JSON.stringify(doctorList));
        }


        // 图片描述和类型
        var descArr = $('.upfileUl > li.upfileItem');
        var detailArr = [];
        var JSONStr = '{';
        var sortStr = '{';
        for (var i = 0; i < descArr.length; i++) {
            var fileLi = descArr.eq(i).find('.fileContent > li.fileItem');
            for (var j = 0; j < fileLi.length; j++) {
                JSONStr += '"' + fileLi.eq(j).find("p.fileName").html() + '":{detail:"' + fileLi.eq(j).find("p.fileName").attr("desc") + '",typeId:"' + descArr.eq(i).attr("id") + '",typeName:"' + descArr.eq(i).attr("name") + '"},';
                sortStr += '"' + fileLi.eq(j).attr("id") +'":{"sort":"'+(j+1)*(i+1)+'","remarks":"'+fileLi.eq(j).find("p.fileName").attr("desc")+'"},'
            }
        }
        JSONStr += '}';
        sortStr += '}';
        data.append('detailMap', JSONStr);
        data.append('fileIdAndSort', sortStr); // 文件排序顺序
        $.ajax({
            type: 'POST',
            url: IP + 'order/addDraft',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            processData: false,
            contentType: false,
            // cache: false,
            data: data,
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['300px', '80px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        skin: 'layui-layer-nobg', //没有背景色
                        time: 2000,
                        content: _$('.alertBox'),
                    });
                  
                    // window.location = '/yilaiyiwang/morkbench/morkbench.html';
                } else if (data.status == 250) {
                    window.location = '/yilaiyiwang/login/login.html';
                } else if (data.status == 502) {
                    layer.msg('保存失败')
                } else {

                }
            },
            error: function(err) {
                console.log(err)
            },
        });
    });

    // 图文会按钮、
       $('.graphicGroup').click(function () {
           console.log(noDocDeptId)
           /* 判断信息是否填写完整 */
           if ($('#username').val() == '' || $('#idCard').val() == '' || $('#phone').val() == '' || $('#address').val() == '' || $('#age').val() + $('.choiceAge').val() == '' || $('#high').val() == '' || $('#weight').val() == '' || $('.sex > a.active').html() == '' || $('#createCase_textDiagnose').val() == '' || $('#createCase_textGola').val() == '' || fileAllArr.length <= '0') {
               var _$ = layui.jquery;
               layer.open({
                   type: 1,
                   title: '',
                   area: ['300px', '80px'],
                   closeBtn: false,
                   shade: [0.1, '#000000'],
                   shadeClose: false,
                   time: 2000,
                   content: _$('.incomplete'),
               });
               setTimeout(function () {
                   $('.incomplete').hide();

               }, 2000);
           } else if (!RegExpObj.Reg_Name.test($('#username').val()) || !RegExpObj.Reg_IDCardNo.test($('#idCard').val()) || !RegExpObj.Reg_age.test($('#age').val()) || !RegExpObj.Reg_Number.test($('#high').val()) || !RegExpObj.Reg_Number.test($('#weight').val()) || !RegExpObj.Reg_isPhone.test($('#phone').val()) || !RegExpObj.Reg_address.test($('#address').val()) || $('#createCase_textDiagnose').val() == '' || $('#createCase_textGola').val() == '') {
               var _$ = layui.jquery;
               layer.open({
                   type: 1,
                   title: '',
                   area: ['300px', '80px'],
                   closeBtn: false,
                   shade: [0.1, '#000000'],
                   shadeClose: false,
                   time: 2000,
                   content: _$('.modifier'),
               });
               setTimeout(function () {
                   $('.modifier').hide();

               },2000);

           } 
        //    else if (favoriteArr.length = '0' && noDocDeptId == '') {
        //         layer.msg('请选择医生');
        //    } 
           else {
               //图文会诊确认弹窗
               var _$ = layui.jquery;
               layer.open({
                   type: 1,
                   title: '',
                   area: ['500px', '200px'],
                   closeBtn: false,
                   shade: [0.1, '#000000'],
                   shadeClose: false,
                   content: _$('.imgContent'),
               });
               $('.imgContent .submitText').html('您的病历将发送到' + hospitalName + '，请确认');
           }
       });
       $('.imagebtnBox .noBtn').click(function () {
           layer.closeAll();
           $('.imgContent').hide();
       });
    //    图文会诊确认弹窗的确定按钮
    $('.imagebtnBox .yesBtn').click(function () {
        var data = new FormData();
        data.append('id', orderId);
        data.append('name', $('#username').val());
        data.append('idCard', $('#idCard').val());
        data.append('phone', $('#phone').val());
        data.append('address', $('#address').val());
        data.append('age', $('#age').val() + $('.choiceAge').val());
        data.append('high', $('#high').val());
        data.append('weight', $('#weight').val());
        data.append('sex', $('.sex > a.active').html());
        data.append('draft', '1'); //草稿(0是1不是)
        data.append('isUrgent', $('.urgent > a.active').attr('value')); //是否加急(1是0不是)
        data.append('diagnosis', $('#createCase_textDiagnose').val()); //初步诊断
        data.append('telemedicineTarget', $('#createCase_textGola').val()); //会诊目的
        data.append('orderType', '0'); // 订单类型(0:会诊,1:转诊)
        data.append('money', $('.imgPric').html()); // 费用
        data.append('types', '0'); // 会诊类型(0:图文,1:视频)
        data.append('basePrice', $('.imgPric').attr('imgpric')); // 医院图文基本价格

        // favoriteArr 医生医院相关数据
        if (favoriteArr.length > 0) {
            var doctorList = [];
            data.append('consultationHospitalId', favoriteArr[0].hospitalId); // 会诊医院id
            data.append('deptId', favoriteArr[0].deptId); // 主会诊科室id
            for (var i = 0; i < favoriteArr.length; i++) {
                doctorList.push({
                    "doctorId": favoriteArr[i].id,
                    "money": favoriteArr[i].medicalFees,
                });
            }
            data.append('doctorList', JSON.stringify(doctorList));
        }else{
             data.append('consultationHospitalId', hospitalId);
             data.append('deptId', noDocDeptId);
        }
        // 图片描述和类型
        var descArr = $('.upfileUl > li.upfileItem');
        var detailArr = [];
        var JSONStr = '{';
        var sortStr = '{';
        for (var i = 0; i < descArr.length; i++) {
            var fileLi = descArr.eq(i).find('.fileContent > li.fileItem');
            for (var j = 0; j < fileLi.length; j++) {
                JSONStr += '"' + fileLi.eq(j).find("p.fileName").html() + '":{detail:"' + fileLi.eq(j).find("p.fileName").attr("desc") + '",typeId:"' + descArr.eq(i).attr("id") + '",typeName:"' + descArr.eq(i).attr("name") + '"},';
                sortStr += '"' + fileLi.eq(j).attr("id") + '":{"sort":"' + (j + 1) * (i + 1) + '","remarks":"' + fileLi.eq(j).find("p.fileName").attr("desc") + '"},'
            }
        }
        JSONStr += '}';
        sortStr += '}';
        data.append('detailMap', JSONStr);
        data.append('fileIdAndSort', sortStr); // 文件排序顺序
        $.ajax({
            type: 'POST',
            url: IP + 'order/sendOrder',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            processData: false,
            contentType: false,
            data: data,
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    sessionStorage.setItem('sendOrderData', JSON.stringify(data));
                    window.location = '/yilaiyiwang/writeCase/sendSuccess.html';
                } else if (data.status == 250) {
                    window.location = '/yilaiyiwang/login/login.html';
                } else if (data.status == 500) {
                      var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['300px', '80px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.incomplete'),
                    });
                } else {

                }
            },
            error: function(err) {
                layer.msg('订单发送失败！')
            },
        });
    });

    // 视频会诊
    $('.videoBtn').click(function() {
        if ($('#username').val() == '' || $('#idCard').val() == '' || $('#phone').val() == '' || $('#address').val() == '' || $('#age').val() + $('.choiceAge').val() == '' || $('#high').val() == '' || $('#weight').val() == '' || $('.sex > a.active').html() == '' || $('#createCase_textDiagnose').val() == '' || $('#createCase_textGola').val() == '' || fileAllArr.length <= '0') {
              var _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 2000,
                content: _$('.incomplete'),
            });
            setTimeout(function() {
                //  layer.closeAll();
                $('.incomplete').hide();
            }, 2000);

        } else if (!RegExpObj.Reg_Name.test($('#username').val()) || !RegExpObj.Reg_IDCardNo.test($('#idCard').val()) || !RegExpObj.Reg_age.test($('#age').val()) || !RegExpObj.Reg_Number.test($('#high').val()) || !RegExpObj.Reg_Number.test($('#weight').val()) || !RegExpObj.Reg_mobilePhone.test($('#phone').val()) || !RegExpObj.Reg_address.test($('#address').val()) || $('#createCase_textDiagnose').val() == '' || $('#createCase_textGola').val() == '') {
            var _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: false,
                time: 2000,
                content: _$('.modifier'),
            });
            setTimeout(function() {
                $('.modifier').hide();

            }, 2000);

        } else if (favoriteArr.length = '0' && noDocDeptId == '') {
            layer.msg('请选择医生')
        } else {
             var _$ = layui.jquery;
            layer.open({
                type: 1,
                content: _$('.selectTimeContainer'),
                title: '',
                area: ['1060px', '630px'],
                closeBtn: 0,
                skin: 'noBackground'
            });
        }

        var startMinute = 0; // 开始总分钟数
        var endMinute = 0; // 结束总分钟数
        var startHour = 0; // 开始小时数
        var endHour = 0; // 结束小时数
        var _html = '';
        for (var i = 0; i < 96; i++) {
            startMinute = i * 15;
            endMinute = (i + 1) * 15;
            startHour = parseInt(startMinute / 60);
            endHour = parseInt(endMinute / 60);
            var startM = startMinute %= 60; // 计算后的开始分钟数
            var endM = endMinute %= 60; // 计算后的开始分钟数
            if (endHour == 24) {
                _html += '<li endDate="23:59" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
            } else {
                _html += '<li endDate="' + double(endHour) + ':' + double(endM) + '" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
            }

        }
        $('.rightContent').html(_html)
    });

    var dateTempList = [];
    var myDate = new Date();
    var flag = true;
    var startIndex = 0;
    var endIndex = 0;
    var dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
    // 渲染日历控件
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#timeBox',
            position: 'static',
            showBottom: false,
            value: dateStr,
            change: function(value, date) { //监听日期被切换
                $('#timeUl > li').removeClass('active');
                dateStr = value;
                for (var i = 0; i < dateTempList.length; i++) {
                    if (dateStr == dateTempList[i].date) {
                        if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                            for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        } else {
                            for (var j = dateTempList[i].endIndex; j <= dateTempList[i].startIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        }
                    }
                }

            }
        });
    });
    // 分钟选择事件、
  $('#timeUl').delegate('li', 'click', function () {
      if (flag) {
          $(this).addClass('active').siblings('li').removeClass('active');
          flag = false;
          startIndex = $(this).attr('index');
      } else {
          $(this).addClass('active');
          flag = true;
          endIndex = $(this).attr('index');
          if (startIndex <= endIndex) {
              for (var i = startIndex; i < endIndex; i++) {
                  $('#timeUl > li').eq(i).addClass('active');
              }
          } else {
              for (var i = endIndex; i < startIndex; i++) {
                  $('#timeUl > li').eq(i).addClass('active');
              }
          }
          // var dateTempFlag = true;
          if (dateTempList.length == 0) {
              dateTempList.push({
                  "date": dateStr,
                  "startIndex": startIndex,
                  "endIndex": endIndex,
              });
          } else {
              for (var i = 0; i < dateTempList.length; i++) {
                  if (dateTempList[i].date == dateStr) {
                      dateTempList.splice(i, 1);
                  }
              }
              dateTempList.push({
                  "date": dateStr,
                  "startIndex": startIndex,
                  "endIndex": endIndex,
              });
          }
      }
  });
    // 关闭事件
    $('.closeBtnTime').click(function() {
        layer.closeAll();
        $('.selectTimeContainer').hide();
        dateTempList = [];
    });
    // 确定事件 == 发送视频会诊
     $('.selectTimeContainer .selectTimeContent .btnBox .yesBtn').click(function () {
         var _$ = layui.jquery;
         layer.open({
             type: 1,
             title: '',
             area: ['500px', '200px'],
             closeBtn: false,
             shade: [0.1, '#000000'],
             shadeClose: false,
             content: _$('.videoContent'),
         });
         $('.videoContent .submitText').html('您的病历将发送到' + hospitalName + '，请确认');
     });

     $('.videoContent .noBtn').click(function () {
         layer.closeAll();
         $('.videoContent').hide();
         $('.selectTimeContainer ').hide();
     });
    //  视频会诊确认弹窗确定按钮事件
    $('.videoContent .yesBtn').click(function () {
     
        var data = new FormData();
        data.append('id', orderId);
        data.append('name', $('#username').val());
        data.append('idCard', $('#idCard').val());
        data.append('phone', $('#phone').val());
        data.append('address', $('#address').val());
        data.append('age', $('#age').val() + $('.choiceAge').val());
        data.append('high', $('#high').val());
        data.append('weight', $('#weight').val());
        data.append('sex', $('.sex > a.active').html());
        data.append('draft', '1'); //草稿(0是1不是)
        data.append('isUrgent', $('.urgent > a.active').attr('value')); //是否加急(1是0不是)
        data.append('diagnosis', $('#createCase_textDiagnose').val()); //初步诊断
        data.append('telemedicineTarget', $('#createCase_textGola').val()); //会诊目的
        data.append('orderType', '0'); // 订单类型(0:会诊,1:转诊)
        data.append('money', $('.videoPric').html()); // 费用
        data.append('types', '1'); // 会诊类型(0:图文,1:视频)
        data.append('basePrice', $('.videoPric').attr('videopric')); // 会诊类型(0:图文,1:视频)

        // favoriteArr 医生医院相关数据
        if (favoriteArr.length > 0) {
            var doctorList = [];
            data.append('consultationHospitalId', favoriteArr[0].hospitalId); // 会诊医院id
            data.append('deptId', favoriteArr[0].deptId); // 主会诊科室id
            for (var i = 0; i < favoriteArr.length; i++) {
                doctorList.push({
                    "doctorId": favoriteArr[i].id,
                    "money": favoriteArr[i].medicalFees,
                });
            }
            data.append('doctorList', JSON.stringify(doctorList));
        } else {
            data.append('consultationHospitalId', hospitalId);
            data.append('deptId', noDocDeptId);
        }

        // 选择时间数组
        var dateList = []; // 选择的时间数据
        for (var i = 0; i < dateTempList.length; i++) {
            if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                dateList.push({
                    'startDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).html() + ':00',
                    'endDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).attr('enddate') + ':00'
                });
            } else {
                dateList.push({
                    'startDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).html() + ':00',
                    'endDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).attr('enddate') + ':00'
                });
            }
        }
        data.append('dateList', JSON.stringify(dateList));
         // 图片描述和类型
         var descArr = $('.upfileUl > li.upfileItem');
         var detailArr = [];
        var JSONStr = '{';
        var sortStr = "{";
        for (var i = 0; i < descArr.length; i++) {
            var fileLi = descArr.eq(i).find('.fileContent > li.fileItem');
            for (var j = 0; j < fileLi.length; j++) {
                JSONStr += '"' + fileLi.eq(j).find("p.fileName").html() + '":{detail:"' + fileLi.eq(j).find("p.fileName").attr("desc") + '",typeId:"' + descArr.eq(i).attr("id") + '",typeName:"' + descArr.eq(i).attr("name") + '"},';
                sortStr += '"' + fileLi.eq(j).attr("id") + '":{"sort":"' + (j + 1) * (i + 1) + '","remarks":"' + fileLi.eq(j).find("p.fileName").attr("desc") + '"},'
            }
        }
        JSONStr += '}';
        sortStr += '}';
        
         data.append('fileIdAndSort', sortStr); // 文件排序顺序
          data.append('detailMap', JSONStr);
        $.ajax({
            type: 'POST',
            url: IP + 'order/sendOrder',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            processData: false,
            contentType: false,
            data: data,
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    sessionStorage.setItem('sendOrderData', JSON.stringify(data));
                    window.location = '/yilaiyiwang/writeCase/sendSuccess.html';
                } else if (data.status == 250) {
                    window.location = '/yilaiyiwang/login/login.html';
                } else if (data.status == 500) {
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['300px', '80px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: false,
                        time: 2000,
                        content: _$('.incomplete'),
                    });
                } else {
                    layer.msg('发送失败！')
                }
            },
            error: function(err) {
                console.log(err)
            },
        });
    });


    $('.deleteBtn').click(function() {
        var _$ = layui.jquery;
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: false,
            scrollbar: false,
            content: _$('.deleteDraft'),
        });


    });
    $('.deleteBox .noBtn').click(function () {
        layer.closeAll();
        $('.deleteDraft').hide();
    });
    $('.deleteBox .yesBtn').click(function () {
        $.ajax({
            type: 'POST',
            url: IP + 'order/deleteDraft',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {
                "draftId": data.orderFormBean.id,
            },
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    window.location = '/yilaiyiwang/morkbench/morkbench.html';
                } else if (data.status == 250) {
                    window.location = '/yilaiyiwang/login/login.html';
                } else {}
            },
            error: function(err) {
                console.log(err)
            },
        });
    });


    // 底部取消按钮 
    $('.cancel').click(function(){
        window.history.back(-1);
    })
});

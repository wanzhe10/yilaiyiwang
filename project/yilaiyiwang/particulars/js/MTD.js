$(function() {
          var fileAllArr = []; //所有图片原始资源
          //   var fileArr = [];
          var scaleNum = 10; // 图片缩放倍数
    /* 动态创建进度条 */
    var statusArr = ['待收诊', '已排期', '会诊中', '待反馈', '已完成'];
    var str = '';
    for (var i = 0; i < statusArr.length; i++) {
        str += '<li>' + statusArr[i] + '</li>'
        $('.progressBar').html(str);
    }
     $('.progressBar li:first-child').addClass('libg');
    var fileAllArr = []; //所有图片原始资源
    // 选择的医生信息数组
    var favoriteArr = [];
    if (JSON.parse(sessionStorage.getItem('data'))) {
        var data = JSON.parse(sessionStorage.getItem('data'));
        console.log(data);
        // 清楚缓存数据
        // sessionStorage.removeItem('data');
        $('.money').html(data.orderFormBean.money)
        for (var i = 0; i < data.orderDoctorsList.length; i++) {
            if (data.orderDoctorsList.firstDoctor == 1) {
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
                })
            } else {
                favoriteArr.push({
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
                })
            }

        }
        favoriteHtml();
    }
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
                var _html = '';
                for (var i = 0; i < hospitalArr.length; i++) {
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
                    'height': $(window).height() - 230 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
                });
                // 医院价格 和 手机号 处理
                $('.hospitalTel').html(hospitalArr[0].phone);
                $('.imgPric').attr('imgPric', $('.hospitalItem').eq(0).attr('imgPric'));
                $('.videoPric').attr('videoPric', $('.hospitalItem').eq(0).attr('videopric'));
                favoriteHtml();
                // 获取默认科室的医生
                deptIdGetDoctors($('.hospitalUl').find('.deptItem').eq(0).attr('name'));
            } else if (data.status == 250) {
                window.location = '/yilaiyiwang/login/login.html';
            }
        }
    });


    // 遍历选择的医生信息
    // favoriteHtml();
    function favoriteHtml() {
        var _html = "";
        var imgPric = Number($('.imgPric').attr('imgPric'));
        var videoPric = Number($('.videoPric').attr('videoPric'));
        $('.doctorCount').html(favoriteArr.length);
        if (favoriteArr.length == 0) {
            _html = '<li class="clearfix"><span>主会诊人:未选择</span></li>';
            $('.imgPric').html($('.imgPric').attr('imgPric'));
            $('.videoPric').html($('.videoPric').attr('videoPric'));
        } else {
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

    $(window).scroll(function() {
        $('.hospitalUl').css({
            'width': '145px',
            'position': 'fixed',
        })
        if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
            $('.sectionUl').css({
                'height': $(window).height() - 280 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            })
        } else {
            $('.sectionUl').css({
                'height': $(window).height() - 230 - $('.hospitalUl .hospitalItem').length * $('.hospitalName').height(),
            })
        }
    });

    // 医院切换
    $('.hospitalUl').delegate('.hospitalItem', 'click', function() {
        $(this).addClass('active').siblings('.hospitalItem').removeClass('active');
        $(this).find('.sectionUl').stop(true).slideToggle();
        $(this).siblings('.hospitalItem').find('.sectionUl').stop(true).slideUp();
        $('.hospitalTel').html($(this).attr('phone'));
        $('.imgPric').attr('imgPric', $(this).attr('imgPric')).html($(this).attr('imgPric'));
        $('.videoPric').attr('videoPric', $(this).attr('videoPric')).html($(this).attr('videoPric'));
    })
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
    })
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
                    var _html = '';
                    var tempArr = data.userList;
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
                                <p class="p1 hospital" name="' + tempArr[i].hospitalDept.hospital.id + '">' + tempArr[i].hospitalDept.hospital.name + '</p>\
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
                    console.log($('.doctorUl').find('li').length)
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

    // 选医生鼠标移入
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
    })

    // 选医生鼠标移出、
    $('.doctorUl').delegate('.doctorChunk', 'mouseleave', function(event) {
        $(this).find('.present').hide();
        $(this).css("border", "1px solid #efefef");
    });

    // 选择医生事件--添加
    $('.doctorUl').delegate('.doctorChunk', 'click', function(event) {
        if ($(this).hasClass('noDocter')) {
            // 点的不选医生
            favoriteArr = [];
            favoriteHtml();
        } else if (favoriteArr.length > 0 && $(this).find('.hospital').attr('name') != favoriteArr[0].hospitalId) {
            var _$ = layui.jquery;
            layer.open({
                type: 1,
                title: '',
                area: ['300px', '80px'],
                closeBtn: false,
                shade: [0.1, '#000000'],
                shadeClose: true,
                time: 2000,
                content: _$('.promptText'),
            });
            setTimeout(function() {
                $('.promptText').hide();
            }, 2000)
        } else {
            // 点的某一个医生
            var flag = true;
            for (var i = 0; i < favoriteArr.length; i++) {
                if (favoriteArr[i].id == $(this).attr('name')) {
                    flag = false
                }
            }
            if (flag) {
                favoriteArr.push({
                    id: $(this).attr('name'), // 医生id
                    hospitalName: $(this).find('.hospital').html(), // 医院名字
                    hospitalId: $(this).find('.hospital').attr('name'), // 医院id
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

    $(window).scroll(function() {
        $('.oneLevelUl').css({
            'width': '145px',
            'position': 'fixed',
        })
        // if ($(document).scrollTop() >= $(document).height() - $(window).height() - $('.footer').height()) {
        //     $('.twoLevelUl').css({
        //         'height': $(window).height() - 300 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
        //     })
        // } else {
        //     $('.twoLevelUl').css({
        //         'height': $(window).height() - 230 - $('.oneLevelUl .oneLevelItem').length * $('.oneLevelName').height(),
        //     })
        // }
    });

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
    })
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
    })
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

    $('.getBack').click(function() {
        window.history.back(-1);
    })

    // 控制确认接收按钮和排期按钮
  if (data.orderFormBean.orderTypes == '0') {
      $('.mdt_BtnPic').show();
      $('.mdt_Btn').hide();
    }else{
         $('.mdt_BtnPic').hide();
         $('.mdt_Btn').show();
    }
    $('.mdt_BtnPic').click(function(){
          var _$ = layui.jquery;
          layer.open({
              type: 1,
              title: '',
              area: ['500px', '200px'],
              closeBtn: false,
              shade: [0.1, '#000000'],
              shadeClose: true,
              content: _$('.submitBoxPic'),
          });

    })
    // 确认接收取消按钮
     $('.submitBoxPic').find('.noBtn').click(function () {
         layer.closeAll();
     })

    // 下一步修改排期按钮
    $('.mdt_Btn').click(function() {
            // 视频
            var $ = layui.jquery;
            layer.open({
                type: 1,
                content: $('.selectTimeContainer'),
                title: '',
                area: ['1060px', '680px'],
                closeBtn: 0,
                skin: 'noBackground',
            })
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
      
       
    })
    var dateTempList = []; // 收集的时间段
    for (var i = 0; i < data.orderDateList.length; i++) {
        var date = data.orderDateList[i].startDate.split(' ')[0];
        var startDate = data.orderDateList[i].startDate.split(' ')[1];
        var hours = startDate.split(':')[0];
        var minute = startDate.split(':')[1];
        var startIndex = (hours * 60 + minute * 1) / 15;
        var endDate = data.orderDateList[i].endDate.split(' ')[1];
        var endHour = endDate.split(':')[0];
        var endMinute = endDate.split(':')[1];
        var endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
        dateTempList.push({
            "date": date,
            "startIndex": startIndex,
            "endIndex": endIndex - 1,
        })
    }
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

                for (var i = 0; i < dateTempList.length; i++) {
                    if (value == dateTempList[i].date) {
                        for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                            $('#timeUl > li').eq(j).addClass('active');
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
    })

    $('.selectTimeContainer').find('.yesBtn').click(function() {
        var _$ = layui.jquery;
        layer.open({
            type: 1,
            title: '',
            area: ['500px', '200px'],
            closeBtn: false,
            shade: [0.1, '#000000'],
            shadeClose: true,
            content: _$('.submitBox'),
        });


    })
    $('.submitBox').find('.noBtn').click(function() {
        layer.closeAll();
    })
    $('.submitBox').find('.yesBtn').click(function() {
        var startTime = '';
        var endTime = '';
        if (dateTempList[0].startIndex <= dateTempList[0].endIndex) {
            startTime = dateTempList[0].date + ' ' + $('#timeUl > li').eq(dateTempList[0].startIndex).html() + ':00';
            endTime = dateTempList[0].date + ' ' + $('#timeUl>li').eq(dateTempList[0].endIndex).attr('enddate') + ':00'
        } else {
            startTime = dateTempList[0].date + ' ' + $('#timeUl > li').eq(dateTempList[0].endIndex).html() + ':00';
            endTime = dateTempList[0].date + ' ' + $('#timeUl > li').eq(dateTempList[0].startIndex).attr('enddate') + ':00';
        }
        var doctorList = [];
        var price = Number(data.orderFormBean.basePrice);
        for (var i = 0; i < favoriteArr.length; i++) {
            doctorList.push({
                "doctorId": favoriteArr[i].id,
                "money": favoriteArr[i].medicalFees,
            });
            if (data.orderFormBean.orderTypes == 0) {
                // 图文
                price += Number(favoriteArr[i].medicalFees);
            } else {
                // 视频
                price += Number(favoriteArr[i].medicalFeesVideo);
            }
        }
        var doctorId = favoriteArr[0].id;
        $.ajax({
            type: 'POST',
            url: IP + 'order/mdt',
            dataType: 'json',
            data: {
                "orderId": data.orderFormBean.id,
                "startDate": startTime,
                "endDate": endTime,
                "orderStateId": data.orderFormBean.statesId,
                "doctorList": JSON.stringify(doctorList),
                "doctorId": doctorId,
                "totalPrice": price,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    // 成功操作
                    layer.closeAll();
                    $('.selectTimeContainer').hide();
                    window.location = '/yilaiyiwang/morkbench/morkbench.html';
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else if(data.status == 500){
                     layer.closeAll();
                    var _$ = layui.jquery;
                    layer.open({
                        type: 1,
                        title: '',
                        area: ['300px', '80px'],
                        closeBtn: false,
                        shade: [0.1, '#000000'],
                        shadeClose: true,
                        time: 2000,
                        content: _$('.MDTText'),
                    });
                    setTimeout(function () {
                        $('.MDTText').hide();
                        $('.operateContent').hide();
                                layer.closeAll();

                    },2000)
                }else{
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
    })
        //  确认接收确定按钮
        $('.submitBoxPic').find('.yesBtn').click(function () {
          
             var doctorList = [];
             var price = Number(data.orderFormBean.basePrice);
             for (var i = 0; i < favoriteArr.length; i++) {
                 doctorList.push({
                     "doctorId": favoriteArr[i].id,
                     "money": favoriteArr[i].medicalFees,
                 });
                 if (data.orderFormBean.orderTypes == 0) {
                     // 图文
                     price += Number(favoriteArr[i].medicalFees);
                 } else {
                     // 视频
                     price += Number(favoriteArr[i].medicalFeesVideo);
                 }
             }
             var doctorId = favoriteArr[0].id;
              $.ajax({
                  type: 'POST',
                  url: IP + 'order/mdtPic',
                  dataType: 'json',
                  data: {
                      "orderId": data.orderFormBean.id,
                      "orderStateId": data.orderFormBean.statesId,
                      "doctorList": JSON.stringify(doctorList),
                      "doctorId": doctorId,
                      "totalPrice": price,
                  },
                  xhrFields: {
                      withCredentials: true
                  },
                  crossDomain: true,
                  success: function (data) {
                      console.log(data)
                      if (data.status == 200) {
                          // 成功操作
                          layer.closeAll();
                          $('.selectTimeContainer').hide();
                          window.location = '/yilaiyiwang/morkbench/morkbench.html';
                      } else if (data.status == 250) {
                          // 未登录操作
                          window.location = '/yilaiyiwang/login/login.html';
                      } else if (data.status == 500) {
                          var _$ = layui.jquery;
                          layer.open({
                              type: 1,
                              title: '',
                              area: ['300px', '80px'],
                              closeBtn: false,
                              shade: [0.1, '#000000'],
                              shadeClose: true,
                              time: 2000,
                              content: _$('.MDTText'),
                          });
                          setTimeout(function () {
                              $('.MDTText').hide();
                                layer.closeAll();
                                 $('.operateContent').hide();
                          }, 2000)
                      } else {
                          // 其他操作
                      }
                  },
                  error: function (err) {
                      console.log(err);
                  },
              })
        })

})

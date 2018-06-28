$(function() {
    var pageNo = 1;
    var pageSize = 10;
    var count = 0;
    var draftsCount = 0;
    var orderStateId = '';

    /*日历点击显示隐藏 */
    $("#calender").animate({
        left: 300
    }, "slow");
    $(".small_button").click(function() {
        var div = $(".wrap");
        if (div.hasClass("dest")) {
            div.removeClass("dest").animate({
                right: -400
            }, "slow");
            $(".small_button span").html("工作日历表");
            $(this).css("height", "160px");

        } else {
            div.addClass("dest").animate({
                right: 0
            }, "slow");
            // $(".small_button").css(" height","200px", );
            $(".small_button span").html("收起");
            $(this).css({
                "height": "100px",
                "border-radius": "0 0 0 10px;"
            });
        }
    });
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#test-n1',
            position: 'static'
        });
    });

    // 查询草稿数量
    $.ajax({
        type: 'GET',
        url: IP + 'order/draftSize',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        crossDomain: true,
        global: false,
        success: function(data) {
            if (data.status == 200) {
                $('.unReadNum').html(data.size);
                draftsCount = data.size;
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

    /* 左边导航栏 医政受邀请列表 */
    $.ajax({
        type: 'POST',
        url: IP + 'doctorOrderStatus/findOrderStatus',
        dataType: 'json',
        data: {
            "type": '0', //(0:医政受邀列表,1:医政发出列表,2:医生受邀，3医生发出
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        success: function(data) {
            console.log(data)
            if (data.status == 200) {
                var tempArr = data.doctorOrderStatusList;
                var _html = '';
                for (var i = 0; i < tempArr.length; i++) {
                    if (i == 0) {
                        if (tempArr[i].unReadFlag == 0) {
                            _html += '<li name="' + tempArr[i].states.id + '" class="ulAct">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class=""></div>\
					</li>'
                        } else {
                            _html += '<li name="' + tempArr[i].states.id + '" class="ulAct">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class = "unRead" > '+tempArr[i].orderSize+' </div>\
					</li>'
                        }
                    } else {
                        if (tempArr[i].unReadFlag == 0) {
                            _html += '<li name="' + tempArr[i].states.id + '" class="">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class=""></div>\
					</li>'
                        } else {
                            _html += '<li name="' + tempArr[i].states.id + '" class="">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class = "unRead" > '+tempArr[i].orderSize+' </div>\
					</li>'
                        }
                    }
                }
                $('#inviteUl').html(_html);
                orderStateId = tempArr[0].states.id;
                getInvitedList(tempArr[0].states.id, pageNo, pageSize);
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
    /* 左边导航栏 医政发出列表 */
    $.ajax({
        type: 'POST',
        url: IP + 'doctorOrderStatus/findOrderStatus',
        dataType: 'json',
        data: {
            "type": '1', //(0:医政受邀列表,1:医政发出列表,2:医生受邀，3医生发出
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        success: function(data) {
            console.log(data)
            if (data.status == 200) {
                var tempArr = data.doctorOrderStatusList;
                var _html = '';
                for (var i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].unReadFlag == 0) {
                        _html += '<li name="' + tempArr[i].states.id + '" class="">\
						<span>' + tempArr[i].statesName + '</span>\
						<div class=""></div>\
					</li>'
                    } else {
                        _html += '<li name="' + tempArr[i].states.id + '" class="">\
						<span> ' + tempArr[i].statesName + ' </span>\
							<div class="unRead">'+tempArr[i].orderSize+'</div>\
					</li>'
                    }
                }
                $('#issueUl').html(_html);
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

    // 医政查看受邀列表
    function getInvitedList(orderStateId, pageNo, pageSize) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/receiveMedicalAdminList', //医政查看受邀列表
            dataType: 'json',
            data: {
                "orderStateId": orderStateId,
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    count = data.pageSize * pageSize;
                    var myDate = new Date();
                    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                    var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
                    var day = double(myDate.getDate()); //获取当前日(1-31)
                    var _html = '';
                    var tempArr = data.orderBeanList;
                    for (var i = 0; i < tempArr.length; i++) {
                        var timeStr = tempArr[i].time.split(' ')[0];
                        var time = tempArr[i].time.split(' ')[1];
                        var _year = timeStr.split('-')[0];
                        var _month = timeStr.split('-')[1];
                        var _day = timeStr.split('-')[2];

                        _html += '<tr applyFlag="' + tempArr[i].applyFlag + '" type="0" name="' + tempArr[i].id + '">\
                <td>'
                        if (tempArr[i].isurgent == 1) {
                            _html += '<img class="w14" src="/yilaiyiwang/images/light.png" />'
                        }
                        _html += '</td>'
                        if (tempArr[i].orderType == 0) {
                            _html += '<td class="tc">会诊</td>'
                        } else {
                            _html += '<td class="tc">转诊</td>'
                        }
                        _html += ' <td>\
                    <p class="overHidden3">***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p>\
                </td>\
                <td>\
                    <p class="overHidden1">\
                        <' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '>\
                    </p>\
                </td>\
                <td>\
                    <p class="overHidden2">\
                        <' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '>\
                    </p>\
                </td>'
                        if (tempArr[i].manner == 0) {
                            _html += '<td class="tc">图文</td>'
                        } else {
                            _html += '<td class="tc">视频</td>'
                        }
                        if (year == _year && month == _month && day == _day) {
                            _html += '<td class="tl2em">今天' + time + '</td>'
                        } else {
                            _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
                        }
                        _html += '</tr>'
                    }
                    $('#tabContent').html(_html);

                } else if (data.status == 250) {
                    // 未登录操作
                } else if (data.status == 205) {
                    // 其他操作
                    $('#tabContent').html('');
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
    }
    // 医政查看发出列表接口
    function getIssueList(orderStateId, pageNo, pageSize) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/applyMedicalAdminList', //医政查看发出列表接口
            dataType: 'json',
            data: {
                "orderStateId": orderStateId,
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    count = data.pageSize * pageSize;
                    var myDate = new Date();
                    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                    var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
                    var day = double(myDate.getDate()); //获取当前日(1-31)
                    var _html = '';
                    var tempArr = data.orderBeanList;
                    for (var i = 0; i < tempArr.length; i++) {
                        var timeStr = tempArr[i].time.split(' ')[0];
                        var time = tempArr[i].time.split(' ')[1];
                        var _year = timeStr.split('-')[0];
                        var _month = timeStr.split('-')[1];
                        var _day = timeStr.split('-')[2];
                        _html += '<tr applyFlag="' + tempArr[i].applyFlag + '" type="1" name="' + tempArr[i].id + '">\
                <td>'
                        if (tempArr[i].isurgent == 1) {
                            _html += '<img class="w14" src="/yilaiyiwang/images/light.png" />'
                        }
                        _html += '</td>'
                        if (tempArr[i].orderType == 0) {
                            _html += '<td class="tc">会诊</td>'
                        } else {
                            _html += '<td class="tc">转诊</td>'
                        }
                        _html += '<td>\
                    <p class="overHidden3">***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p>\
                </td>\
                <td>\
                    <p class="overHidden1" style=" width:280px;">\
                        <' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '>\
                    </p>\
                </td>\
                <td>\
                    <p class="overHidden2" style=" width:160px;">\
                        <' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '>\
                    </p>\
                </td>'
                        if (tempArr[i].manner == 0) {
                            _html += '<td class="tc">图文</td>'
                        } else {
                            _html += '<td class="tc">视频</td>'
                        }
                        if (year == _year && month == _month && day == _day) {
                            _html += '<td class="tl2em">今天' + time + '</td>'
                        } else {
                            _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
                        }
                        _html += '</tr>'
                    }
                    $('#tabContent').html(_html);

                } else if (data.status == 250) {
                    // 未登录操作
                } else if (data.status == 205) {
                    // 其他操作
                    $('#tabContent').html('');
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
    }
    // 草稿箱数据获取
    function getDrafts(pageNo, pageSize) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/queryDraft',
            dataType: 'json',
            data: {
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    var myDate = new Date();
                    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                    var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
                    var day = double(myDate.getDate()); //获取当前日(1-31)
                    var tempArr = data.draftOrderList;
                    var _html = '';
                    for (var i = 0; i < tempArr.length; i++) {
                        var timeStr = tempArr[i].time.split(' ')[0];
                        var time = tempArr[i].time.split(' ')[1];
                        var _year = timeStr.split('-')[0];
                        var _month = timeStr.split('-')[1];
                        var _day = timeStr.split('-')[2];
                        _html += '<tr name="' + tempArr[i].id + '">\
                    <td>\
                        <p class="w520">***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p>\
                    </td>'
                        if (year == _year && month == _month && day == _day) {
                            _html += '<td class="tl2em">今天' + time + '</td>'
                        } else {
                            _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
                        }
                        _html += '</tr>'
                    }
                    $('.drafts_tbody').html(_html);
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
    }


    // 列表的切换
    $('.leftNav').click(function() {
        var _index = $(this).index();
        $(this).addClass('active').siblings('div').removeClass('active');
        if (_index == 0) {
            // 医政受邀列表
            localStorage.setItem('orderType', '0');
            $('.drafts_table').css("display", 'none');
            $('.tables').css('display', 'block');
        } else if (_index == 1) {
            // 1:医政发出列表
            localStorage.setItem('orderType', '1');
            $('.drafts_table').css("display", 'none');
            $('.tables').css('display', 'block');
        } else if (_index == 2) {
            $('.drafts_table').css("display", 'block');
            $('.tables').css('display', 'none');
            getDrafts(pageNo, pageSize);
        }
    })

    // 草稿箱分页
    layui.use('laypage', function() {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'drafts',
            count: draftsCount,
            limit: pageSize,
            theme: '#f6c567',
            jump: function(obj, first) {
                getDrafts(obj.curr, pageSize);
            }
        });
    });
    // 列表分页 默认
    layui.use('laypage', function() {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'listBox',
            count: count,
            limit: pageSize,
            theme: '#f6c567',
            jump: function(obj, first) {
                getInvitedList(orderStateId, obj.curr, pageSize);
            }
        });
    });



    // 受邀ul切换
    $("#inviteUl").delegate('li', 'click', function() {
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        // $(this).children("div").removeClass("unRead");
        // if ($("#leftUL").children().find(".unRead").length == 0) {
        //     $("#leftTitle").next("div").removeClass("unRead");
        // }
        orderStateId = $(this).attr('name');
        var countNum = 0;
        $.ajax({
            type: 'POST',
            url: IP + 'order/receiveMedicalAdminList', //医政查看受邀列表
            dataType: 'json',
            data: {
                "orderStateId": orderStateId,
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            async: false,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    countNum = data.pageSize * pageSize; // 当前li Tab 下的总条数
                } else if (data.status == 250) {
                    // 未登录操作
                } else if (data.status == 205) {
                    // 其他操作
                    $('#tabContent').html('');
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
        layui.use('laypage', function() {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: countNum,
                limit: pageSize,
                theme: '#f6c567',
                jump: function(obj, first) {
                    getInvitedList(orderStateId, obj.curr, pageSize);
                }
            });
        });
    });
    // 发出ul切换

    $("#issueUl").delegate('li', 'click', function() {
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        // $(this).children("div").removeClass("unRead");
        // if ($("#leftUL").children().find(".unRead").length == 0) {
        //     $("#leftTitle").next("div").removeClass("unRead");
        // }
        orderStateId = $(this).attr('name');
        var countNum = 0;
        $.ajax({
            type: 'POST',
            url: IP + 'order/applyMedicalAdminList', //医政查看发出列表接口
            dataType: 'json',
            data: {
                "orderStateId": orderStateId,
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            async: false,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    countNum = data.pageSize * pageSize;
                } else if (data.status == 250) {
                    // 未登录操作
                } else if (data.status == 205) {
                    // 其他操作
                    $('#tabContent').html('');
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
        layui.use('laypage', function() {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: countNum,
                limit: pageSize,
                theme: '#f6c567',
                jump: function(obj, first) {
                    getIssueList(orderStateId, obj.curr, pageSize);
                }
            });
        });
    });


    // 发出列表详情
    $('#tabContent').delegate('tr', 'click', function() {
        selectOrderById($(this).attr('name'), $(this).attr('type'), $(this).attr('applyFlag'));
    })

    // 查看订单详情
    function selectOrderById(orderId, type, readFlag) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/selectOrderById',
            dataType: 'json',
            data: {
                "orderId": orderId,
                "type": type, //是那个列表的类型(0:医政受邀列表,1:医政发出列表,2:医生受邀列表,3:医生发出列表)
                "readFlag": readFlag,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    sessionStorage.setItem('data', JSON.stringify(data));
                    if (type == 0) {
                        // 会诊医政 受邀列表
                        if (data.orderFormBean.statesName == "首诊待审核") {

                        } else if (data.orderFormBean.statesName == "待收诊") {
                            window.location = '/yilaiyiwang/invitee/meetManageAudit.html';
                        } else if (data.orderFormBean.statesName == "专家协调") {
                            window.location = '/yilaiyiwang/invitee/expertCoordinate.html';
                        } else if (data.orderFormBean.statesName == "排期审核") {
                            window.location = '/yilaiyiwang/invitee/collectingClinical.html';
                        } else if (data.orderFormBean.statesName == "已排期") {
                            // 已排期
                            window.location = '/yilaiyiwang/invitee/schedule.html';
                        } else if (data.orderFormBean.statesName == "会诊中") {
                            window.location = '/yilaiyiwang/invitee/gConsultation.html';
                        } else if (data.orderFormBean.statesName == "待反馈") {
                            window.location = '/yilaiyiwang/invitee/feedback.html';
                        } else if (data.orderFormBean.statesName == "已结束") {
                            window.location = '/yilaiyiwang/invitee/meetOver.html';
                        } else if (data.orderFormBean.statesName == "会诊已拒收") {
                            window.location = '/yilaiyiwang/invitee/meetRejection.html'
                        }
                    } else if (type == 1) {
                        // --------------发出的-----
                        if (data.orderFormBean.statesName == "首诊待审核") {
                            localStorage.setItem('orderId', orderId);
                            window.location = '/yilaiyiwang/workbench/manageAudit.html';
                        } else if (data.orderFormBean.statesName == "待收诊" || data.orderFormBean.statesName == "排期审核" || data.orderFormBean.statesName == "专家协调") {
                            // 待收诊
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/workbench/collecting_doc.html';
                        } else if (data.orderFormBean.statesName == "已排期") {
                            window.location = '/yilaiyiwang/workbench/schedule.html';
                        } else if (data.orderFormBean.statesName == "会诊中") {
                            window.location = '/yilaiyiwang/workbench/consultation.html';
                        } else if (data.orderFormBean.statesName == "待反馈") {
                            // 待反馈
                            window.location = '/yilaiyiwang/workbench/meetfeedback.html'
                        } else if (data.orderFormBean.statesName == "已结束") {
                            window.location = '/yilaiyiwang/workbench/over.html';
                        } else if (data.orderFormBean.statesName == "会诊已拒收") {
                            // 已拒收
                            localStorage.setItem('orderId', orderId)
                            window.location = '/yilaiyiwang/workbench/rejection.html'
                        }
                    }
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
    }


    // 草稿箱详情
    $('.drafts_tbody').delegate('tr', 'click', function() {
        $.ajax({
            type: 'POST',
            url: IP + 'order/selectDraftsOrderById',
            dataType: 'json',
            data: {
                "orderId": $(this).attr('name'),
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    // 成功操作
                    sessionStorage.setItem('data', JSON.stringify(data));
                    window.location = '/yilaiyiwang/detailsDraft/detailsDraft.html';
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
    })

})

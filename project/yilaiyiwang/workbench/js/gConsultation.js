$(function () {
     /* 动态创建进度条 */
     var statusArr = ['待收诊', '已排期', '会诊中', '待反馈', '已完成'];
     var str = '';
     for (var i = 0; i < statusArr.length; i++) {
         str += '<li>' + statusArr[i] + '</li>'
         $('.progressBar').html(str);

     }
      $('.progressBar li:first-child').addClass('libg');
       $('.progressBar li:nth-child(2)').addClass('libg');
        $('.progressBar li:nth-child(3)').addClass('libg');
    /* 点击修改按钮收起显示 */
    // 患者基本信息essential_btn
    $('#cut').click(function () {
        $(this).toggleClass("foundBtn");
        $('.essentialInformation_modules').toggle(500);
    })
    //电子病历
    $('.modifier2').click(function () {
        
        $('.EMR_module').toggle(500);
        // console.log($('#cutEle').attr("class"))
        if ($('#cutEle').attr("class") == "chooseBtn") {
             $('#cutEle').addClass('foundBtn');
             $('#cutEle').removeClass('chooseBtn');
        }else{
             $('#cutEle').addClass('chooseBtn');
             $('#cutEle').removeClass(' foundBtn');
        }
         
    })
    //  收件医生
    $('#cutDoc').click(function () {
        $(this).toggleClass("foundBtn");
        $('.ReceiptDoctor_modules').toggle(500);
    })
    //  会诊排期
    $('#cutSch').click(function () {
        $(this).toggleClass("foundBtn");
        $('.schedule_modules').toggle(500);
    })

    // /*原诊费计算 */
    // var aggregate = 0;
    // $.each($('.yuan'), function (index, item) {
    //     //如果数字有小数点，就使用 parsetFloat()
    //     aggregate += parseInt($.trim($(item).text()));

    // });
    // $('.aggregate').text(aggregate);

    // $('.dynamicAggregate').val($('.dynamicAggregate').text(dynamicAggregate))

    // function dynamicAggregate() {
    //     var dynamicAggregate = 0;
    //     $.each($('.gai'), function (index, item) {
    //         dynamicAggregate += parseInt($.trim($(item).val()));
    //     });
    //     $('.dynamicAggregate').text(dynamicAggregate);
    // }
    // /* 修改诊费计算 */

    // $('.gai').keyup(function () {
    //     dynamicAggregate();
    // })



    var data = JSON.parse(sessionStorage.getItem('data'));
    // sessionStorage.removeItem('data');
    console.log(data)
    $('.patientName').html('***');
    $('.high').html(data.orderFormBean.high)
    $('.sex').html(data.orderFormBean.sex)
    $('.weight').html(data.orderFormBean.weight)
    $('.age').html(data.orderFormBean.age)
    $('.address').html(data.orderFormBean.address)
    if (data.orderFormBean.isurgent == 1) {
        $('.bThree_p').show();
    } else {
        $('.bThree_p').hide();
    }
    $('.tentative').html('初步诊断：' + data.orderFormBean.diagnosis);
    $('.telemedicineTarget').html('会/转诊目的：' + data.orderFormBean.telemedicineTarget);



    // TODO 电子病历附件
    var tempArr = data.patientCaseList;
    var _imgHtml = '';
    for (var i = 0; i < tempArr.length; i++) {
        if (tempArr.length == 0) {

        } else {
            _imgHtml += '<div class="small_img">\
                                <img src="' + imgIp + tempArr[i].filesUrl + '" alt="">\
                            </div>'
        }
    }
    $('.add_img').html(_imgHtml);
    /* 会诊排期 */
  var orderDateList = data.orderDateList;
  var _dateHtml = '';
  for (var i = 0; i < orderDateList.length; i++) {
      if (orderDateList[i].types == 1) {
          _dateHtml += ' <p>\
              <span class="startDate">从&nbsp;&nbsp;' + orderDateList[i].startDate + '</span> 到&nbsp;&nbsp;\
            <span class="endDate">' + orderDateList[i].endDate + '</span>\
                            </p>'
      }
  }
  $('.schedule_modules').html(_dateHtml);



      
        //订单编号
        $('.numbers').html(data.orderFormBean.numbers);
        //申请时间
        $('.applyDate').html(data.orderFormBean.applyDate);
    // 发件人信息
    $('.recipientsInfo').html(' <' + data.orderFormBean.doctorName + '/' + data.orderFormBean.doctorTitleName + '/' + data.orderFormBean.doctorDeptName +'/' + data.orderFormBean.doctorHospitalName + '>')
   
    // //   收件人信息
  var recipientsArr = data.orderDoctorsList;
    var _html = '';
    for (var i = 0; i < recipientsArr.length; i++) {
        _html += '<' + recipientsArr[i].name + '/' + recipientsArr[i].occupation + '/' + recipientsArr[i].deptName + '/' + recipientsArr[i].hospitalName + '>;'
    }
    $('.addresserInfo').html(_html)

    /* 诊费 */
    var _fees = '';
    for (var i = 0; i < recipientsArr.length; i++) {
        _fees += '<tr>\
                        <td>\
                            <' + recipientsArr[i].name + ' / ' + recipientsArr[i].occupation + ' / ' + recipientsArr[i].deptName + ' / ' + recipientsArr[i].hospitalName + ' > \
                        </td>'
        if (recipientsArr[i].orderType == 0) {
            _fees += '<td class = "yuan" >' + recipientsArr[i].picPrice + '</td>'
        } else {
            _fees += '<td class = "yuan" >' + recipientsArr[i].picPrice + '</td>'
        }
        _fees += '<td>'
        if (recipientsArr[i].orderType == 0) {
            _fees += '<input type="text" value="' + recipientsArr[i].picPrice + '" class="fees_input gai" readonly="readonly">'
        } else {
            _fees += '<input type="text" value="' + recipientsArr[i].picPrice + '" class="fees_input gai" readonly="readonly">'
        }
        _fees += '</td></tr>'
    }
    $('')
    $('.tbody_doc').html(_fees)
    $('.aggregate').html(data.orderFormBean.money)
    $('.dynamicAggregate').html(data.orderFormBean.money)

    var deptNumber = '';
    $.ajax({
        type: 'POST',
        url: IP + 'user/selectDeptNumberWithUserId',
        dataType: 'json',
        data: {
            "userId": data.orderFormBean.doctorId,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            console.log(data)
            if (data.status == 200) {
                deptNumber = data.deptNumber;
                // 成功操作
            } else if (data.status == 250) {
                // 未登录操作
                window.location = '/yilaiyiwang/login/login.html';
            } else {
                // 其他操作
            }
        },
        error: function (err) {
            console.log(err);

        },
    })
  /* 循环时间轴 orderStatesList*/
 var orderStatesList = data.orderStatesList;
 var _html = '';
 for (var i = 0; i < orderStatesList.length; i++) {
     _html += '<li class="layui-timeline-item">\
                                    <i class="layui-icon layui-timeline-axis">&#xe63f;</i>\
                                    <div class="layui-timeline-content layui-text">\
                                        <h3 class="layui-timeline-title">\
                                            <span class="fw">' + orderStatesList[i].time + '</span>\
                                            <span class = "fw pl30" > ' + orderStatesList[i].statesName + ' </span>\
                                        </h3>'
     if (orderStatesList[i].statesName == '已结束') {
         _html += ''
     } else {
         _html += '<p>操作人：' + orderStatesList[i].remarks + '</p>\
                                    </div>\
                                </li>'
     }
 }
 $('.layui-timeline').html(_html);






  /* 返回按钮 */
  $('.getBack').click(function(){
      window.location = '/yilaiyiwang/workbench/workbench.html'
  })
})
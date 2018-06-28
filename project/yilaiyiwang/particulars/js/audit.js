$(function(){
    /* 点击修改按钮收起显示 */
    // 患者基本信息essential_btn
    $('#cut').click(function () {
         $(this).toggleClass("foundBtn");
        $('.essentialInformation_modules').toggle(500);
    })
    //电子病历
     $('#cutEle').click(function () {
         $(this).toggleClass("foundBtn");
         $('.EMR_module').toggle(500);
     })
    //  收件医生
 $('#cutDoc').click(function () {
     $(this).toggleClass("foundBtn");
     $('.ReceiptDoctor_modules').toggle(500);
 })

/*原诊费计算 */
     var aggregate = 0;
     $.each($('.yuan'), function (index, item) {
         //如果数字有小数点，就使用 parsetFloat()
         aggregate += parseInt($.trim($(item).text()));

     });
       $('.aggregate').text(aggregate);

$('.dynamicAggregate').val($('.dynamicAggregate').text(dynamicAggregate))
       function dynamicAggregate() {
             var dynamicAggregate = 0;
             $.each($('.gai'), function (index, item) {
                 dynamicAggregate += parseInt($.trim($(item).val()));
             });
             $('.dynamicAggregate').text(dynamicAggregate);
       }
/* 修改诊费计算 */
     
     $('.gai').keyup(function () {
        dynamicAggregate();
     })









 



















})
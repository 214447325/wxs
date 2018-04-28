/**
 * invitesuccess.js
 * @author zyx
 * @return {[type]}       [description]
 */
$(function () {


    var $invitephone = $('.invitephone');

    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid') || param.uid;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;

    var ph = param.phone;
    if (ph != null && ph.length == 11) {
        var font = ph.substr(0, 3);
        var bak = ph.substr(7, 11);
        ph = font + '****' + bak;
    }
    $invitephone.html(ph);
    /* $('.Bonusrules').click(function(event) {
     $('.maskLayer').css('display','block');
     $('.redpackets').click(function(event) {
     $('.bunus').css('display', 'block');
     $('#center').removeClass('center').addClass('centerOpen');
     });

     $('.close').click(function(event) {
     $('.maskLayer').css('display','none');
     $('.bunus').css('display', 'none');
     $('#center').removeClass('centerOpen').addClass('center');
     })

     }); */

    $('.Bonusrules').click(function (event) {
        $('.maskLayer').css('display', 'block');


        $('#center').removeClass('center').addClass('centerOpen');


        $('.close').click(function (event) {
            $('.maskLayer').css('display', 'none');

            $('#center').removeClass('centerOpen').addClass('center');
        })

    });

//  if(!userId){
//    Common.toLogin();
//    return false;
//  }

//  var isWeiXin = Common.isWeiXin();


});


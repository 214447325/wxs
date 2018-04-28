/**
 * zyx 
 * 我的邀请主页
 **/
$(function(){
  var $rankinglist = $('.title');
    var nlist = '';
    var mlist = '';
    var cashBonusList = '';
  $.ajax({
      url: Setting.apiRoot1 + '/InviteFriendList.p2p',
      type: 'post',
      dataType: 'json'
    }).done(function(res){
      Common.ajaxDataFilter(res,function(){
        if(res.code == -1){
          alert('查询失败');
          return false;
        }
        
        nlist = res.data.inviteTotalNum; // 	邀请好友总数
        //var nn = nlist==null?0:nlist.length;
        mlist= res.data.awardTotalAmount;//邀请好友累计投资金额
        //var mm = mlist==null?0:mlist.length;

        cashBonusList = res.data.cashBonusList;//邀请好友累计分红排名列表
        var html = '';
        //var _invite = '';
        if(cashBonusList != undefined && cashBonusList != null && cashBonusList != '' && cashBonusList.length > 0) {
            html = "<tr class='inviteTr tr'><th class='nlist fen'>邀请总数（人）<div class='tbe'></div></th><th class='mlist fen'><p>奖励总额（元） </p></th><th class='cashBonusList fen'><p>分红总额（元） </p></th></tr> ";

        } else {
            html = "<tr class='inviteTr'><th class='nlist fen'>邀请总数（人）<div class='tbe'></div></th><th class='mlist fen'><p>奖励总额（元） </p></th></tr>";
        }

          html = html + '<tr class="listrank"></tr>';
        
        //for(var i=0;i<10;i++){
        //	if(nn<=i && mm<=i){
        //		break;
        //	}
        //	var nname = nlist[i].named==null?"--":nlist[i].named;
        //	var nnum = nlist[i].pcount==null?"--":nlist[i].pcount;
        //	var mname = mlist[i].named==null?"--":mlist[i].named;
        //	var mamount = mlist[i].amount==null?"--":mlist[i].amount;
        //	var order = i+1;
        //    var vite = '';
        //    if($('.inviteTr').hasClass('tr')) {
        //        vite = 'vite';
        //    } else {
        //        vite = '';
        //    }
        //
        //
        //	html +='<tr class="listrank">';
        //	html +='<td class="' + vite + '">';
        //	if(order<4){
        //		html +='<div class="ranking'+order+'">'+order+'</div>';
        //	}else{
        //		html +='<div class="ranking">'+order+'</div>';
        //	}
        //
        //	html +='<div class="listName">'+nname+'</div>';
        //	html +='<div class="listInvite">'+nnum+'</div>';
        //	html +='</td>  ';
        //	html +='<td class="' + vite + '">';
        //	//if(order<4){
        //	//	html +='<div class="ranking'+order+'">'+order+'';
        //	//}else{
        //	//	html +='<div class="ranking">'+order;
        //	//}
        //	//
        //	//html +='</div>';
        //	html +='<div class="listName">'+mname+'</div>';
        //	html +='<div class="listMoney">'+mamount+'</div>';
        //	html +='</td>';
        //    //if($('.inviteTr').hasClass('tr')) {
        //        html +='<td class="vite">';
        //        html +='<div class="listName">'+cashBonusList[i].named+'</div>';
        //        html +='<div class="listMoney">'+cashBonusList[i].amount+'</div>';
        //        html +='</td>';
        //    //}
        //	html +='</tr>';
        //}
        $rankinglist.html(html);
          var param = Common.getParam();
          var _page = param.page;
          $('.tbe').remove();
          $('.' + _page).append('<div class=tbe></div>');
          if(_page == "nlist") {
              appendData(_page,nlist);
          }

          if(_page == "mlist") {
              appendData(_page,mlist);
          }

          if(_page == "cashBonusList") {
              appendData(_page,cashBonusList);
          }

          //邀请总数
          $('.nlist').click(function() {
              $('.tbe').remove();
              $(this).append('<div class=tbe></div>');
              //console.log(JSON.stringify(nlist))
              appendData("nlist",nlist);
          });

          //奖励总额
          $('.mlist').click(function() {
              $('.tbe').remove();
              $(this).append('<div class=tbe></div>');
              appendData("mlist",mlist);
          });

          //分红总额
          $('.cashBonusList').click(function() {
              $('.tbe').remove();
              $(this).append('<div class=tbe></div>');
              appendData("cashBonusList",cashBonusList);
          });

          function appendData(dataType,dataList) {
              var _dataHtml = '';
              for(var i = 0; i < dataList.length; i++) {
                  _dataHtml = _dataHtml + '<tr><td>';
                  if(i < 3) {
                      _dataHtml = _dataHtml + '<div class="ranking' + ( i + 1 ) + '">' + ( i + 1 ) + '</div>';
                  } else {
                      _dataHtml = _dataHtml + '<div class="ranking">' + ( i + 1 ) + '</div>';
                  }
                  _dataHtml = _dataHtml + '<div class="listName">'+dataList[i].named+'</div>';

                  if(dataType == "nlist") {
                      _dataHtml = _dataHtml + '<div class="listInvite">'+dataList[i].pcount+'</div>';
                  };

                  if(dataType == "mlist" || dataType == "cashBonusList") {
                      _dataHtml = _dataHtml + '<div class="listInvite">'+dataList[i].amount+'</div>';
                  }

                  _dataHtml = _dataHtml + '</td></tr>';

            }

              $('.content').html(_dataHtml);
          }
      })
    }).fail(function(){
      alert('网络链接失败');
    });

});



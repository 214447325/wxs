/**
 * Created by User on 2016/9/5.
 */

$(function(){
    var $currentPortfolio = $('.currentPortfolio');// 投资后资产组合
    var $tabcon       = $('.current-portfolioList');
    var $hadShare= $('.hadShare'); //周周涨持有份额
    var $recordCount=$('.recordCount');//资产个数
    var $returnPage = $('.returnImg');//返回上一页

    var param = Common.getParam();
    var hadShare= param.hadShare;

    if(hadShare==0){
        document.getElementById("bgred").style.display='none';
        document.getElementById('current-portfolioList').innerHTML='<img class="null" src="../../../images/pages/my-account3.0/null3.0.png"/><p class="nullword">空空如也，赶快投资吧</p>';
    }else{

        //红包模板
        var setListData = doT.template([
            '{{~it :item:index}}',
            '<dl >',

            '<div class="item">',
            '<a class="title" href="regularPortfolioDetails3.0.html?hadShare='+hadShare+'&type=1&code={{=item.purposeCode}}">{{=item.loanPurpose}}',
            '<i  >({{=item.count}}个)</i>',
            '<i class="percent">占比:{{=item.eachPercent}}</i>',
            '</a>',
            '</div>',
            '</dl>',
            '{{~}}'
        ].join(''));


        //获取消息列表
        $.ajax({
            url:Setting.apiRoot1 + '/queryDebtInfo.p2p',
            type:"post",
            dataType:'json',
            data:{
                type:3

            }
        }).done(function(res){
            if(res.code==1){
                var data = res.data;
                $tabcon.html(setListData(data));
                $hadShare.text(Common.comdify(hadShare));
                $recordCount.text(res.recordCount);
            }else{
                alert(res.message);
                return false;
            }

        }).fail(function(){
            alert('网络链接失败');
            return false
        });

    }

    $returnPage.click(function() {
        window.location.href = '../../my-account/my-product.html';
    });
});

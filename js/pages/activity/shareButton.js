/**
 * Created by User on 2017/4/17.
 */
//回复
    
$(function() {
    //解析地址栏参数
    var param = Common.getParam();
    var userId = sessionStorage.getItem('uid') || param.uid;
    var loginToken = sessionStorage.getItem('loginToken') || param.loginToken;
    var postId = param.postId;
    var sharePostId = param.sharePostId;
    var islike = param.islike;
    var isfavorite = param.isfavorite;
    var readNum = param.readNum;
    var $body = $('body');
    var $wrapper = $('.wrapper');
    if(postId == undefined || postId == null || postId == '') {
        return false;
    }else{
        $('.wrapper').css({'overflow-x':'hidden','paddingBottom':0});
        $body.css({'overflow-x':'hidden'});
    }

    if(sharePostId == 1) {
        return false;
    }


    var _dian = '';
    //切换点赞图片
    if(islike == 1) {
        _dian = Setting.staticRoot +'/images/pages/message/dian1.png'
    } else {
        _dian = Setting.staticRoot +'/images/pages/message/dian.png';
    }

    var _shou = '';
    //切换收藏图片
    if(isfavorite == 1) {
        _shou = Setting.staticRoot + '/images/pages/message/shou1.png'
    } else {
        _shou = Setting.staticRoot +'/images/pages/message/shou.png';
    }

    //评论列表的样式
    var _community = '<div class="shareButton">' +
        '<div class="comments-div">发表评论....' +
        //'<input type="text" placeholder="发表评论...." disabled="true" class="commentsInput">' +
        '</div>' +
        '<div class="praise-div">' +
        '<img class="dian" src="' + _dian + '">' +
        '</div>' +
        '<div class="collection-div">' +
        '<img class="shou" src="' + _shou + '">' +
        '</div>' +
        '</div>';

    //加载评论按钮
    $body.append(_community);

    //加载评论和赞
    $wrapper.append('<div class="community"></div>');
    var $community = $('.community');//评论框
    getReload();

    var $sButton = $('.comments-div');//点击评论按钮

    //评论弹框spellcheck
    var _commentsBox = '';
    _commentsBox = '<div class="ui-alert backdrop" id="commentsBox">'+
                    '<div class="commentsBox">' +
                    '<div class="comment_box">' +
                    '<div class="comment_title">' +
                    '<div class="cancelA">取消</div>' +
                    '<div class="contentA">写评论</div>' +
                    '<div class="subA">发送</div>' +
                    '</div>' +
                    '<div class="comment_content">' +
                    ' <textarea class="text" style="background: #ffffff;resize : none; outline:none;-webkit-appearance: none;color: #333;border: 0.0266rem solid #E4E4E4;text-align:left;" maxlength="150" placeholder="评论一下..."></textarea>' +
                    '</div>' +
                    //'<div class="comment_button">' +
                    //'<div class="cancel">取消</div>' +
                    //'<div class="sub">确定</div>' +
                    //'</div>' +
                    ' </div>' +
                    ' </div>' +
                    '</div>';
    $body.append(_commentsBox);
    // var $commentsBox = $('.commentsBox');
    var $commentsBox = $('#commentsBox');
    //点击评论按钮
    $sButton.click(function() {
        if(!userId){
            Common.toLogin();
            return false;
        } else {
            $commentsBox.show();
        }
    });

    //点击取消按钮
    var $cancel = $('.cancelA');
    $cancel.click(function() {
        $commentsBox.hide();
    });
    // var $commentsBox = $('#commentsBoxId');
    $commentsBox.click(function(e) {
        var e = e ? e : window.event;
        var tar = e.target || e.srcElement;
        if(tar.id == 'commentsBox'){
            $commentsBox.hide();
        }
    });

    //点击确定按钮
    var $submit = $('.subA');
    $submit.click(function() {
        //输入内容的对话框
        var $text = $('textarea.text');
        //获取评论内容
        var _text = $.trim($text.val());
        //判断内容有没有输入
        if(_text == null || _text == '' || _text == undefined) {
            alert('您还未追加评论内容！');
            return false;
        }
        $.ajax({
            url:Setting.root + '/post/reply/u/submitReply.do',
            type:"GET",
            dataType:'json',
            data: {
                userId:userId,
                postId:postId,
                content:_text,
                threadStarter:userId,
                isLayer:1
            }
        }).done(function(res) {
            if(res.code != 1) {
                alert(res.message);
            };
        }).fail(function() {
            alert('查询失败！')
        });
        $commentsBox.hide(function() {
            $text.html(' ');
            getReload();
        });
    });

    function getReload() {
        $.ajax({
            url:Setting.root + '/post/reply/queryReply.do',
            type:"GET",
            dataType:'json',
            data: {
                postId:postId
            }
        }).done(function(res) {
            if(res.code == 1) {
                var _data = res.data;
                if(_data == undefined || _data == '' || _data  == null ) {
                    return false;
                }
                _data.lengths = _data.length;
                traverseLi(_data);
                $(".communities .comm_title .count").html(_data.length + '条');
                // 点击评论或删除
                // $('.userContetn').on('mousedown',function(){
                //     var that = $(this);
                //     if(!userId){
                //         Common.toLogin();
                //         return false;
                //     } else {
                //         var num = 0;
                //         var time = 3;
                //         flag = setInterval(function(){
                //             num ++;
                //             if(num >= time){
                //                 clearInterval(flag);
                //                 var deleteHtml = doT.template([
                //                     '<div class="ui-alert backdrop" id="deleteCommnets">',
                //                         '<div style="position:absolute;bottom:0;left:0;background:#EFEFEF;">',
                //                         '<div class="deleteComment">删除</div>',
                //                         '<div class="cancelComment">取消</div>',
                //                         '</div>',
                //                     '</div>',
                //                 ].join(''))
                //                 $('body').append(deleteHtml());
                //                 $deleteCommnets = $('#deleteCommnets');
                //                 $('.deleteComment,.cancelComment,#deleteCommnets').on('click',function(){
                //                     $deleteCommnets.remove();
                //                 })
                //             }
                //         },100);
                //        that.on('mouseup',function(){
                //             clearInterval(flag);
                //             if(num < time){
                //                 $commentsBox.show();
                //                 return;
                //             }
                //         });
                //     }  
                // })

            } else {
                alert(res.message);
            }
        }).fail(function() {
            alert('查询失败！')
        });
    }

    function traverseLi(_data){
        var _html = '';
        var date = new Date();//获取当前的时间
        var year = date.getFullYear();//当前时间的年
        var month = date.getMonth()+1;//当前的月
        var day = date.getDate();//当前的天数
        for(var i = 0; i < _data.length; i++) {
            var _createDate = '';
            //发帖时间
            var _createTime = new Date(_data[i].createTime);
            var _year = _createTime.getFullYear();//获取发帖时间的年
            var _month = _createTime.getMonth()+1;//获取发帖时间的月
            var _day = _createTime.getDate();//获取发帖时间的日
            if(_year == year && _month == month && _day == day) {
                var hours = _createTime.getHours() < 10 ? '0' + _createTime.getHours() : _createTime.getHours(); //获取发帖的时
                var minutes = _createTime.getMinutes() < 10 ? '0' + _createTime.getMinutes() : _createTime.getMinutes(); //获取发帖的分钟
                var seconds = _createTime.getSeconds() < 10 ? '0' + _createTime.getSeconds() : _createTime.getSeconds(); //获取发帖的秒
                _data[i].createTime = '今天 '+ hours + ':' + minutes + ':' + seconds;
            }


            //判断用户名
            if(_data[i].nickName == null || _data[i].nickName == undefined || _data[i].nickName == '') {
                _data[i].nickName = '';
            }
            //判断是否有头像
            if(_data[i].avatar == undefined || _data[i].avatar == null || _data[i].avatar == '') {
                _data[i].avatar = '../../images/pages/message/tou@3x.png';
            }
        }

        _html =doT.template([
            '<div class="communities" id="combox">',
            '<div class="comm_title"><a class="count">0条</a>评论</div>',
            '<div class="comm_content">',
            '<ul class="comm_ul">',
            '{{~it :item:index}}',
                '<li userId={{=item.userId}} id={{=item.id}} isLayer={{=item.isLayer}}>' ,
                '<div class="li_user">' ,
                '<div class="li_user_img" style="background-image:url({{=item.avatar}})">' ,
                '</div>' ,
                '<div class="li_title">' ,
                '<div class="li_name">',
                '<div style="float:left;">{{=item.nickName}}','</div>',
                // '<div class="vipClass"><i>V</i>6</div>',
                // '<div class="upNum">22</div>',
                // '<div class="upClick">',
                //     '<img src="',Setting.staticRoot +'/images/pages/message/dian.png" alt="" />',
                // '</div>',
                '</div>' ,
                '<div class="li_time">{{=item.createTime}}','</div>' ,
                '</div>' ,
                '</div>' ,
                '<div class="li_user_content">' ,
                 '<div class="userContetn">' ,
                '<p style="color: #000000">{{=item.content}}','</p>' ,
                '</div>' ,
                '</div>' ,
                '</li>',
            '{{~}}',

                '</ul>' ,
                '</div>' ,
                '</div>',
            ].join(''));
        $community.html(_html(_data))
        // return _html;
    }

    $('.text').keyup(function() {
        var _text = $(this).val().trim();
        var _length = _text.length;
        var $subA = $('.subA');
        if(_length > 0) {
            $subA.css({'color': 'rgb(0,0,0)'});
        } else {
            $subA.css({'color': 'rgb(170,170,170)'});
        }

    });

    //点赞按钮
    $('.dian').click(function() {
        if(userId == null || userId == '' || userId == undefined) {
            Common.toLogin();
            return false;
        } else {
            //islike为1说明已经点赞为0说明未点赞
            if(islike == 1) {
                islike = 0;
            } else {
                islike = 1;
            }
            $.ajax({
                url: Setting.root + '/u/post/likeHandler.do',
                type:"GET",
                dataType:'json',
                data: {
                    userId:userId,
                    postId:postId,
                    likeType: islike
                }
            }).done(function(res) {
                if(res.code ==1) {
                    var $dian = $('.dian');
                    if(islike == 1) {
                        $dian.attr({'src':Setting.staticRoot +'/images/pages/message/dian1.png'});
                    } else {
                        $dian.attr({'src':Setting.staticRoot +'/images/pages/message/dian.png'});
                    }
                }
            }).fail(function() {
                alert('服务器连接超时，请稍后重试')
            });
        }
    });

    //点赞按钮
    $('.shou').click(function() {
        if(userId == null || userId == '' || userId == undefined) {
            Common.toLogin();
            return false;
        } else {
            var $shou = $('.shou');
            if(isfavorite == 1) {
                $.ajax({
                    url: Setting.root + '/u/favorities/del.do',
                    type:"GET",
                    dataType:'json',
                    data: {
                        userId:userId,
                        postId:postId
                    }
                }).done(function(res) {
                    if(res.code ==1) {
                        isfavorite = 0;
                        $shou.attr({'src':Setting.staticRoot +'/images/pages/message/shou.png'});
                    } else {
                        alert(res.message)
                    }
                }).fail(function() {
                    alert('取消收藏失败！')
                });
            } else {
                $.ajax({
                    url: Setting.root + '/u/favorities/append.do',
                    type:"GET",
                    dataType:'json',
                    data: {
                        userId:userId,
                        postId:postId
                    }
                }).done(function(res) {
                    if(res.code ==1) {
                        isfavorite = 1;
                        $shou.attr({'src':Setting.staticRoot +'/images/pages/message/shou1.png'});
                    } else {
                        alert(res.message)
                    }
                }).fail(function() {
                    alert('收藏失败！')
                });
            }
        }
    });
   
});

/*
 * @Author: User
 * @Date:   2016-07-01 18:17:05
 * @Last Modified by:   User
 * @Last Modified time: 2016-07-01 18:17:26
 */

$(function () {

    var $problem = $('.problem');
    $('.item').on('click', '.title1', function () {
        var $this = $(this);
        $this.closest('.item').toggleClass('active');
    });

});
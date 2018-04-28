/**
 * problem.js
 * @author tangsj
 * @return {[type]}     [description]
 */
$(function () {

    var $problem = $('.problem');
    $('.item').on('click', '.title', function () {
        var $this = $(this);
        $this.closest('.item').toggleClass('active');
    });

});
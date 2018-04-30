$(function(){
    $('.right-panel .navbar-collapse').on('show.bs.collapse', function(e) {
        $('.right-panel .navbar-collapse').not(this).collapse('hide');
    });
});
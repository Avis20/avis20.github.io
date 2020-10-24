
$(document).on('keypress',function(e) {
    if(e.which == 13) {
        alert('Search is coming soon :)');
    }
});

$(document).ready(function() {
    categoryDisplay();
});

function categoryDisplay() {
    selectCategory();
    $('.categories-item').click(function() {
        window.location.hash = "#" + $(this).attr("cate");
        selectCategory();
    });
    $('.tag-item').click(function() {
        window.location.hash = "#" + $(this).attr("tag");
        selectCategory();
    });
}

function selectCategory(){
    var exclude = ["", undefined];
    var thisId = window.location.hash.substring(1);
    var allow = true;
    for (var i in exclude){
        if(thisId == exclude[i]){
            allow = false;
            break;
        }
    }

    if(allow){
        var cate = thisId;
        $("section[post-cate!='" + cate + "']").hide(200);
        $("section[post-cate='" + cate + "']").show(200);
        $("ul.tag-box .categories-item[cate!='" + cate + "']")
            .css('background-color', '#ed6b39')
            .css('border-color', '#ed6b39');
        $("ul.tag-box .categories-item[cate='" + cate + "']")
            .css('background-color', '#22b3eb')
            .css('border-color', '#22b3eb');
    } else {
        $("section[post-cate!='All']").hide();
        $("section[post-cate='All']").show();
        $("ul.tag-box .categories-item[cate!='All']")
            .css('background-color', '#ed6b39')
            .css('border-color', '#ed6b39');
        $("ul.tag-box .categories-item[cate='All']")
            .css('background-color', '#22b3eb')
            .css('border-color', '#22b3eb');
    }
}
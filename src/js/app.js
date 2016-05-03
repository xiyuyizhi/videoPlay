/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        'path':'http://v2.mukewang.com/f3bb55c2-87de-4487-90e5-1afbcd501655/L.mp4?auth_key=1462254415-0-0-7c863e225bf32a4f1847e07d4410a40b',
        'autoplay':true
    });
    player.init();
});

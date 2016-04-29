/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        //'path':'http://192.168.1.79:9000/rest/download/8fd8e560-f22b-4203-8a1f-1fac5686fb2f',
        'path':'1.mp4',
        'autoplay':false
    });
    player.init();
});

/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        //'path':'http://192.168.1.79:9000/rest/download/8fd8e560-f22b-4203-8a1f-1fac5686fb2f',
        'path':'http://v2.mukewang.com/740f398f-adf3-4b0d-9449-732e18222b91/L.mp4?auth_key=1461922906-0-0-3e05de658674272cb0f02b548cf8f988',
        //'path':'L.mp4',
        'autoplay':true
    });
    player.init();
});

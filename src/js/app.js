/**
 * Created by wangwei on 2016/4/28.
 */
$(function(){
    var player=new VideoPlay($('#video'),{
        //'path':'http://192.168.1.79:9000/rest/download/8fd8e560-f22b-4203-8a1f-1fac5686fb2f',
        'path':'http://v2.mukewang.com/d79a0b8f-144d-40f6-ac87-5ac2d1e5d6b7/L.mp4?auth_key=1461925505-0-0-83a19ffb08b9e232dcd43d1b5bea9db4',
        //'path':'L.mp4',
        'autoplay':true
    });
    player.init();
});

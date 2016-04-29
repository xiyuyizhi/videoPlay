/**
 * Created by wangwei on 2016/4/27.
 */
/***
 * 执行顺序
 * loadedmetadata
 * loadeddata
 * canplay
 * oncanplaythrough
 */
(function (w) {
    w.VideoPlay = VideoPlay;

    function VideoPlay($obj, op) {
        var options = {
            'autoplay': false,
            'volume': 0.5,
            'videoWidth': 600,
            'videoHeight': 350
        };
        this.options = $.extend(options, op);
        console.log(this.options);
        this.timer = null;
        this.store = {
            'duration': 0,
            'currentTime': 0
        };
        this.videoPlayer = $obj;
        this.videoWrap = $obj.parent();
        this.videoPath = this.options.path;
        this.unit = new Unit();
    }

    VideoPlay.prototype.init = function () {
        var objVideo = this.videoPlayer.get(0);
        this.videoPlayer.attr('src', this.videoPath);
        objVideo.volume = this.options.volume;
        objVideo.width = this.options.videoWidth;
        objVideo.height = this.options.videoHeight;
        this.videoWrap.width(this.options.videoWidth);
        if (this.options.autoplay) {//自动播放
            objVideo.autoplay = true;
            this.playing();
        }
        this.loadedMeta();
        this.processControl();
        this.eventHandle();
        this.end();
    };

    VideoPlay.prototype.loadedMeta = function () {
        var _this = this;
        this.videoPlayer.on('loadedmetadata', function (e) {
            console.log(e)
            var timeStr;
            _this.store['duration'] = e.target.duration;
            timeStr = _this.unit.formateTime(e.target.duration).join(':');
            _this.videoWrap.find('.totalTime').html(timeStr);
        })
    };
    VideoPlay.prototype.playing = function () {
        var _this = this;
        this.videoPlayer.on('playing', function (e) {
            console.log('playing');
            console.log(e.target.seekable)
            clearInterval(_this.timer);
            _this.timerFn();
        })
    };
    VideoPlay.prototype.end = function () {
        var _this = this;
        this.videoPlayer.on('ended', function (e) {
            console.log('ended');
            _this.store['currentTime'] = 0;
            clearInterval(_this.timer);
        });
    };

    VideoPlay.prototype.processControl=function(){
        var _this=this,
            originX,
            distance,//本次移动的距离
            originDistance=0,//保存上次移动的距离，下次移动时使用
            $process=this.videoWrap.find('.processBar_control'),
            $processBar_scrollPoint=_this.videoWrap.find('.processBar_scrollPoint');
        var process_up_x=0,
            document_up_x=0;
        $process.on('mousedown',function(e){
            originX=e.clientX;
            console.log('originX '+e.clientX);
            $(this).on('mousemove',movePoint);
            $process.on('mouseup',function(e){
                movePoint(e);
                console.log('process up clientX '+ e.clientX);
                process_up_x= e.clientX;
                originDistance+=e.clientX-originX;
                if(originDistance<=0){
                    originDistance=0;
                };
                if(originDistance>=_this.videoWrap.find('.processBar_bg').width()){
                    originDistance=_this.videoWrap.find('.processBar_bg').width();
                }
                console.log('originDistance '+originDistance);
                $process.off('mousemove',movePoint);
            });
        });

        $(document).on('mouseup',function(e){
            $process.off('mousemove',movePoint);
        })
        /*$(document).on('mouseup',function(e){
         console.log('document up clientX '+ e.clientX);
         document_up_x= e.clientX;
         if(document_up_x!==process_up_x && process_up_x!=0){
         if(document_up_x-135>_this.videoWrap.find('.processBar_bg').width()){
         document_up_x=_this.videoWrap.find('.processBar_bg').width()+135;
         }
         process_up_x=document_up_x;
         $processBar_scrollPoint.width(document_up_x-135);
         originDistance+=e.clientX-originX;
         if(originDistance<=0){
         originDistance=0;
         };
         if(originDistance>=_this.videoWrap.find('.processBar_bg').width()){
         originDistance=_this.videoWrap.find('.processBar_bg').width();
         }
         console.log('originDistance '+originDistance);
         }
         $process.off('mousemove',movePoint);

         });*/

        function movePoint(e){
            distance=e.clientX-originX;
            console.log('distance '+distance);
            $processBar_scrollPoint.width(originDistance+distance);
        }

    };

    VideoPlay.prototype.eventHandle = function () {
        var _this = this,
            $lessVoice = this.videoWrap.find('.less_voice'),
            $moreVoice = this.videoWrap.find('.more_voice'),
            $button = this.videoWrap.find('button');
        $button.on('click', function (e) {
            switch (e.target.className) {
                case 'btn_play':
                    console.log(_this.videoPlayer.get(0).seekable);
                    _this.videoPlayer.get(0).play();
                    clearInterval(_this.timer);
                    _this.timerFn();
                    break;
                case 'btn_pause':
                    _this.videoPlayer.get(0).pause();
                    clearInterval(_this.timer);
                    break;
                case 'btn_fullScreen':
                    if ($(this).text() == '全屏') {
                        _this.videoWrap.addClass('fullScreen');
                        _this.videoPlayer.addClass('fullScreen');
                        _this.videoWrap.css('width','100%');
                        $(this).text('还原');
                    }
                    else {
                        _this.videoWrap.removeClass('fullScreen');
                        _this.videoPlayer.removeClass('fullScreen');
                        _this.videoWrap.css('width',_this.options.videoWidth);
                        $(this).text('全屏')
                    }
                    break;
            }
        });
        //音量控制
        $lessVoice.on('click', function (e) {
            var volume = _this.videoPlayer.get(0).volume;
            _this.voiceControl(volume, 'less')
        });
        $moreVoice.on('click', function (e) {
            var volume = _this.videoPlayer.get(0).volume;
            _this.voiceControl(volume, 'more')
        })
    };
    VideoPlay.prototype.timerFn = function () {
        console.log(this);
        var _this = this;
        _this.timer = setInterval(function () {
            _this.store.currentTime++;
            if (_this.store.currentTime >= Math.ceil(_this.store.duration)) {
                clearInterval(this.timer);
            }
            _this.unit.scrollBarFn(_this.videoWrap, _this.store);
        }, 1000);

    };

    VideoPlay.prototype.voiceControl = function (v, type) {
        if (type == 'less') {
            v = (v - 0.1).toFixed(1);
            if (v <= 0) {
                v = 0;
            }
        } else {
            v = (v + 0.1).toFixed(1);
            if (v >= 1) {
                v = 1;
            }
        }
        this.videoPlayer.get(0).volume = v;
        this.videoWrap.find('.voice_control').height(this.videoWrap.find('.btn_voice').height() * v)
    }
})(window);


function Unit() {

}

//格式化视频时长
Unit.prototype.formateTime = function (second) {
    var timeArr = [];
    if (second > 3600) {
        if (second >= 3600 * 10) {
            timeArr.push(Math.floor(second / 3600))
        } else {
            timeArr.push('0' + Math.floor(second / 3600))
        }
        timeArr.push('00').push('00');
    } else if (second > 60) {
        timeArr.push('00');
        if (second >= 60 * 10) {
            timeArr.push(Math.floor(second / 60))
        } else {
            timeArr.push('0' + Math.floor(second / 60))
        }
        if ((second % 60) > 10) {
            timeArr.push(Math.ceil(second % 60))
        } else {
            timeArr.push('0' + Math.ceil(second % 60))
        }
    } else {
        timeArr.push('00');
        timeArr.push('00');
        timeArr.push(Math.ceil(second));
    }
    return timeArr;
};

//生成进度条
Unit.prototype.scrollBarFn = function ($obj, store) {
    var $scrollPoint = $obj.find('.processBar_scrollPoint'),
        $processBar_bg = $obj.find('.processBar_bg'),
        pointWidth = (store.currentTime / store.duration) * $processBar_bg.width();
    pointWidth = Math.ceil(pointWidth);
    $scrollPoint.css('width', pointWidth + 'px');
}
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
        this.load();
        this.processControl();
        this.eventHandle();
        this.end();
    };

    VideoPlay.prototype.load = function () {
        var _this = this;
        this.videoPlayer.on('loadedmetadata', function (e) {
            console.log(e);
            var timeStr;
            _this.store['duration'] = e.target.duration;
            timeStr = _this.unit.formateTime(e.target.duration).join(':');
            _this.videoWrap.find('.totalTime').html(timeStr);
        });
        this.videoPlayer.on('loadstart',function(e){
            console.log('loadstart');
        });
        this.videoPlayer.on('canplay',function(e){
            console.log('canplay');
            _this.videoWrap.find('.loading').addClass('active')
        });
        //当前播放时间
        this.videoPlayer.on('timeupdate',function(e){
            console.log(e.target.currentTime);
            _this.store.currentTime= e.target.currentTime.toFixed(2);
            _this.unit.scrollBarFn(_this.videoWrap, _this.store);
        })
    };
    VideoPlay.prototype.playing = function () {
        var _this = this;
        this.videoPlayer.on('playing', function (e) {
            console.log('playing');
        })
    };
    VideoPlay.prototype.end = function () {
        var _this = this;
        this.videoPlayer.on('ended', function (e) {
            console.log('ended');
            _this.store['currentTime'] = 0;
            _this.videoWrap.find('.over_time').html(_this.videoWrap.find('.totalTime').html())
        });
    };

    VideoPlay.prototype.processControl = function () {
        var _this = this,
            $processBar_bg = this.videoWrap.find('.processBar_bg'),
            $process = this.videoWrap.find('.processBar_control'),
            $processBar_scrollPoint = this.videoWrap.find('.processBar_scrollPoint');
        $process.on('mousedown', function (e) {
            if(_this.videoPlayer.get(0).seekable.end(0)==0){
                return false;
            }
            $(this).on('mousemove', movePoint);
        });

        $(document).on('mouseup', function (e) {
            console.log('document up');
            if(_this.videoPlayer.get(0).seekable.end(0)==0){
                return false;
            }
            if (e.target.className == 'processBar_bg' || e.target.className == 'processBar_scrollPoint') {
                movePoint(e);
            }
            $process.off('mousemove', movePoint);
        });

        function movePoint(e) {
            if (e.clientX - 135 <= 0) {
                e.clientX = 135;
            } else if (e.clientX - 135 > $processBar_bg.width()) {
                e.clientX = $processBar_bg.width() + 135;
            }
            var currentTime = Math.ceil(_this.store.duration * (e.clientX - 135) / $processBar_bg.width());
            _this.videoPlayer.get(0).currentTime = currentTime;
            _this.store.currentTime = parseInt(currentTime);
            $processBar_scrollPoint.width(e.clientX - 135);
        }

        //显示当前正在播放的时间
        $('.processBar_bg,.processBar_scrollPoint').on('mousemove',function(e){
            if (e.clientX - 135 <= 0) {
                e.clientX = 135;
            } else if (e.clientX - 135 > $processBar_bg.width()) {
                e.clientX = $processBar_bg.width() + 135;
            }
            var overTime = Math.ceil(_this.store.duration * (e.clientX - 135) / $processBar_bg.width()),
                time = _this.unit.formateTime(overTime).join(':');
            _this.videoWrap.find('.over_time')
                .css('left',e.clientX - 150)
                .addClass('active').html(time);
        }).on('mouseout',function(){
            _this.videoWrap.find('.over_time').removeClass('active');
        })
    };

    VideoPlay.prototype.eventHandle = function () {
        var _this = this,
            $lessVoice = this.videoWrap.find('.less_voice'),
            $moreVoice = this.videoWrap.find('.more_voice'),
            $button = this.videoWrap.find('button');
        $button.on('click', function (e) {
            switch (e.target.className) {
                case 'btn_play':
                    _this.videoPlayer.get(0).play();
                    break;
                case 'btn_pause':
                    _this.videoPlayer.get(0).pause();
                    break;
                case 'btn_fullScreen':
                    var percent=_this.store.currentTime/_this.store.duration;
                    if ($(this).text() == '全屏') {
                        _this.videoWrap.addClass('fullScreen');
                        _this.videoPlayer.addClass('fullScreen');
                        _this.videoWrap.css('width', '100%');
                        $(this).text('还原');
                    }
                    else {
                        _this.videoWrap.removeClass('fullScreen');
                        _this.videoPlayer.removeClass('fullScreen');
                        _this.videoWrap.css('width', _this.options.videoWidth);
                        $(this).text('全屏')
                    }
                    _this.videoWrap.find('.processBar_scrollPoint').width(percent*_this.videoWrap.find('.processBar_bg').width());
                    break;
            }
        });
        //seeking
        this.videoPlayer.on('seeking',function(e){
            _this.videoWrap.find('.loading').removeClass('active')
        })
        this.videoPlayer.on('seeked',function(e){
            _this.videoWrap.find('.loading').addClass('active')
        })
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
    } else if (second >= 60) {
        timeArr.push('00');
        if (second >= 60 * 10) {
            timeArr.push(Math.floor(second / 60))
        } else {
            timeArr.push('0' + Math.floor(second / 60))
        }
        if (Math.ceil(second % 60) >= 10) {
            timeArr.push(Math.ceil(second % 60))
        } else {
            timeArr.push('0' + Math.ceil(second % 60))
        }
    } else {
        timeArr.push('00');
        timeArr.push('00');
        timeArr.push(Math.ceil(second)>=10?Math.ceil(second):'0'+Math.ceil(second));
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
};
;(function() {
    var DHPlayer = function(){
        var _setting = {
            isIE: !!window.ActiveXObject || 'ActiveXObject' in window, //判断是否为IE
            videoClassName: 'DHVideoPlayer', //视频框默认容器
            videoId: 'DHVideoPlayer',
            width: 0,
            height: 0,
            connectSuccess: null, //初始化成功
            connectError: null, //初始化失败
            connectClose: null, //关闭
            callBack: {}, //回调函数
            option_id: {},
            heartCount: 0, //心跳失败计数
            ws: null, //socket
            heart: null, //心跳
            timer: null, //滚动条定时器
            failCount: 0,
            count: 0,
            browserType: 1,
            port: [8000, 8004],
            openPlayerFlag: false,
            version: 0,
            ession: 0,
            hwnd: 0, //窗口句柄
            snum: -1, //子窗口编号
            mount: true, //挂载方式 true 挂载为浏览器子窗口 false 独立窗口
            ismount: true, //是否手动选择挂载方式 true 手动设置 false 插件根据系统判断 win7 子系统 win10 独立窗口
            num: 1, //子窗口数
            failAgain: null, //socket失败定时器
            path: '', //视频url
            noCardPlayerFlag:false,
            t1:null
        }
        var se = null
        var self = null
        var _option = null

        //在Function的原型上自定义myBind()方法
        Function.prototype.myBind = function myBind(context) {
            //获取要操作的函数
            var _this = this
            //获取实参（context除外）
            var args = Array.prototype.slice.call(arguments, 1)

            //判断当前浏览器是否兼容bind()方法
            if ('bind' in Function.prototype) {
                //如果浏览器兼容bind()方法，则使用bind()方法，并返回bind()方法执行后的结果
                return _this.bind(context, args)
            }
            //如果不兼容bind()方法，则返回一个匿名函数
            return function() {
                _this.apply(context, args)
            }
        }

        if (!document.getElementsByClassName) {
            document.getElementsByClassName = function(className, element) {
                var children = (element || document).getElementsByTagName('*')
                var elements = new Array()
                for (var i = 0; i < children.length; i++) {
                    var child = children[i]
                    var classNames = child.className.split(' ')
                    for (var j = 0; j < classNames.length; j++) {
                        if (classNames[j] == className) {
                            elements.push(child)
                            break
                        }
                    }
                }
                return elements
            }
        }

        this.videoPlayer = function(option) {
            self = this
            if (!option) {
                throw new Error('请传入配置参数')
            }

            self.setting = $.extend(true, _setting, option)
            se = self.setting

            if (se.isIE) {
                $('.' + se.videoClassName).append('<object id="'+se.videoId+'" classid="clsid:1e68fa30-f1b5-4bbe-b483-8caaa2a3995a"></object>')
            } else {
                $('.' + se.videoClassName).append('<div id="'+se.videoId+'"></div>')
//                $('#DHVideoPlayer').css('border', '1px solid #333')
            }
            $('#'+se.videoId).width(se.width)
            $('#'+se.videoId).height(se.height)
        }
        this.videoPlayer.prototype = {
            domListener: {
                //浏览器关闭或者刷新
                onbeforeunload: function() {
                    self.event.destroy()
                    self.socket.socketClose()
                },
            },
            event: {
                // 创建视频窗口
                create: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd', 'ismount', 'mount', 'num', 'windowType'], option)
                    var rect = self.common.getRect(se.videoId)
                    var _info = $.extend(true, {}, rect)
                    //是否开始手动挂载
                    if (_option.ismount) {
                        // 是
                        _info['mount'] = _option.mount
                    } else {
                        _info['mount'] = self.common.getOsInfo() == 'Windows 10' ? false : true
                    }
                    _info['num'] = _option.num
                    _info['windowType'] = _option.windowType
                    _info['browserType'] = se.browserType
                    _info['clientAreaHeight'] = $(window).height()
                    _info['clientAreaWidth'] = $(window).width()

                    self.common.send(
                        {
                            method: 'window.create',
                            info: _info,
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                    self.event.windowShield(self.common.cover())
                },
                // 实时预览
                realmonitor: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd', 'snum', 'path'], option)
                    var _info = {}
                    _info.hwnd = _option.hwnd
                    _info.snum = _option.snum
                    _info.path = _option.path
                    _info['browserType'] = se.browserType
                    _info.redirect = true //重定向
                    self.common.send(
                        {
                            method: 'video.realmonitor',
                            info: _info,
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                    self.event.windowShield(self.common.cover())
                },
                // 关闭全部预览
                closeAll: function(option, callBack) {
                    self.common.send(
                        {
                            method: 'video.close',
                            info: {
                                hwnd:se.hwnd,
                                snum:0,
                                isAll:true
                            },
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                },
                // 录像回放
                playback: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd', 'snum', 'path', 'records'], option)
                    var _info = {}
                    _info.hwnd = _option.hwnd
                    _info.snum = _option.snum
                    _info.path = _option.path
                    _info.records = _option.records
                    _info.startTime = _option.startTime
                    _info.endTime = _option.endTime
                    _info.playStartTime = _option.playStartTime
                    _info.playEndTime = _option.playEndTime
                    _info.browserType = se.browserType
                    _info.redirect = true //重定向
                    self.common.send(
                        {
                            method: 'video.playback',
                            info: _info,
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                    self.event.windowShield(self.common.cover())
                },
                // 录像回放暂停
                PlayBackPause: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd', 'snum'], option)
                    var _info = {}
                    _info.hwnd = _option.hwnd
                    _info.snum = _option.snum
                    _info.state = 0
                    self.common.send(
                        {
                            method: 'video.playbackChangeState',
                            info: _info,
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                },
                // 录像回放继续
                PlayBackContinue: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd', 'snum'], option)
                    var _info = {}
                    _info.hwnd = _option.hwnd
                    _info.snum = _option.snum
                    _info.state = 1
                    self.common.send(
                        {
                            method: 'video.playbackChangeState',
                            info: _info,
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                },
                // 视频窗口位置发生变化，通知客户端调整
                resizePage: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd'], option)
                    var rect = self.common.getRect(se.videoId)
                    // self.common.setWndCover(self.common.getRect(se.videoId), option)
                    var _info = $.extend(true, {}, rect)
                    _info['hwnd'] = _option.hwnd
                    _info['browserType'] = se.browserType
                    self.common.send(
                        {
                            method: 'window.change',
                            info: _info,
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                    //窗口变化，可能会触发滚动
                    self.event.windowShield(self.common.cover())
                },
                // 隐藏视频
                hide: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd'], option)
                    self.common.send(
                        {
                            method: 'window.show',
                            info: {
                                hwnd: _option.hwnd,
                                show: false,
                                browserType: se.browserType,
                            },
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                    self.event.windowShield(self.common.cover())
                },
                //显示视频
                show: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd'], option)
                    self.common.send(
                        {
                            method: 'window.show',
                            info: {
                                hwnd: _option.hwnd,
                                show: true,
                                browserType: se.browserType,
                            },
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                    self.event.windowShield(self.common.cover())
                },
                // 视频被遮挡处理
                windowShield: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd'], option)
                    var _info = {}
                    _info.hwnd = _option.hwnd
                    _info['browserType'] = se.browserType
                    _info.region = self.common.getShieldRect(option)
                    _info['clientAreaHeight'] = $(window).height()
                    _info['clientAreaWidth'] = $(window).width()

                    self.common.send(
                        {
                            method: 'window.shield',
                            info: _info,
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                },
                //销毁视频窗口
                destroy: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd'], option)
                    self.common.send(
                        {
                            method: 'window.destroy',
                            info: {
                                hwnd: _option.hwnd,
                                browserType: se.browserType,
                            },
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                },
                // 进程被手动杀死或者没有主动启动时，js启动win进程
                openDHPlayer: function(option, callBack) {
                    var t = document.createElement('iframe')
                    ;(t.style.display = 'none'),
                        (t.src = 'DHPlayer://'),
                        document.body.appendChild(t),
                        setTimeout(function() {
                            document.body.removeChild(t)
                        }, 1000 * 3)
                },
                //心跳
                heartbeat: function(option, callBack) {
                    se.heart = window.setInterval(function() {
                        self.common.send(
                            {
                                method: 'common.heartbeat',
                                info: {},
                                id: se.count++,
                                session: se.session,
                            },
                            callBack
                        )
                    }, 30 * 1000)
                },
                // 视频插件版本号
                version: function(option, callBack) {
                    self.common.send(
                        {
                            method: 'common.version',
                            info: {},
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                },
                getWindowState: function(option, callBack) {
                    _option = self.common.extendOption(['hwnd'], option)
                    self.common.send(
                        {
                            method: 'window.getWindowState',
                            info: {
                                hwnd: _option.hwnd,
                            },
                            id: se.count++,
                            session: se.session,
                        },
                        callBack
                    )
                },
            },
            common: {
                cover: function() {
                    var rect = self.common.getRect(se.videoId)
                    var left = rect.left,
                        top = rect.top,
                        right = rect.right,
                        bottom = rect.bottom,
                        width = rect.width,
                        height = rect.height
                    var width_cover, height_cover, left_cover, top_cover

                    var arr = []
                    //判断左边
                    if (left < 0) {
                        width_cover = -left
                        arr.push(left, top, width_cover, height)
                    }
                    if (top < 0) {
                        height_cover = -top
                        arr.push(left, top, width, height_cover)
                    }
                    var win_width = $(window).width()
                    var win_height = $(window).height()
                    // 判断右边
                    if (win_width - right < 0) {
                        //页面太窄，显示不下视频的情况
                        left_cover = win_width
                        width_cover = right - left_cover
                        arr.push(left_cover, top, width_cover, height)
                    }

                    if (win_height - bottom < 0) {
                        //页面太低，显示不下视频的情况
                        height_cover = bottom - win_height
                        arr.push(left, win_height, width, height_cover)
                    }

                    //特殊情况 有重叠部分再传一遍
                    if (win_width - right < 0 && win_height - bottom < 0) {
                        //右下
                        width_cover = right - left_cover
                        height_cover = bottom - win_height
                        arr.push(win_width, win_height, width_cover, height_cover)
                    }
                    if (left < 0 && top < 0) {
                        // 左上
                        width_cover = Math.abs(left)
                        height_cover = Math.abs(top)
                        arr.push(left, top, width_cover, height_cover)
                    }
                    if (win_width - right < 0 && top < 0) {
                        //右上
                        left_cover = win_width
                        width_cover = right - left_cover
                        height_cover = -top
                        arr.push(left_cover, top, width_cover, height_cover)
                    }
                    if (left < 0 && win_height - bottom < 0) {
                        //左下
                        top_cover = win_height
                        width_cover = -left
                        height_cover = bottom - top_cover
                        arr.push(left, top_cover, width_cover, height_cover)
                    }
                    // console.log(arr)
                    return arr
                },
                // copy
                extendOption: function(ids, option) {
                    var map = {}
                    for (var i = 0; i < ids.length; i++) {
                        map[ids[i]] = se[ids[i]]
                    }
                    return $.extend(true, map, option)
                },
                //遮挡部分位置获取
                getShieldRect: function(option) {
                    if (!option.shieldClass) {
                        return option
                    }
                    if (option.shieldClass.length === 0) {
                        return []
                    }
                    var el,
                        rect,
                        arr = []
                    for (var i = 0; i < option.shieldClass.length; i++) {
                        if (document.getElementsByClassName(option.shieldClass[i]).length === 0) {
                            continue
                        }
                        el = document.getElementsByClassName(option.shieldClass[i])[0]
                        rect = el.getBoundingClientRect()
                        arr.push(rect.left, rect.top, rect.width, rect.height)
                    }
                    return arr
                },
                // 获取视频位置
                getRect: function() {
                    var el = document.getElementById(se.videoId)
                    var rect = el.getBoundingClientRect()
                    return {
                        left: rect.left,
                        top: rect.top,
                        right: rect.right,
                        bottom: rect.bottom,
                        width: rect.width,
                        height: rect.height,
                    }
                },
                //获取操作系统
                getOsInfo: function() {
                    var userAgent = window.navigator.userAgent.toLowerCase()
                    var version = ''
                    if (userAgent.indexOf('win') > -1) {
                        if (userAgent.indexOf('windows nt 5.0') > -1 || userAgent.indexOf('Windows 2000') > -1) {
                            version = 'Windows 2000'
                        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('Windows XP') > -1) {
                            version = 'Windows XP'
                        } else if (userAgent.indexOf('windows nt 5.2') > -1 || userAgent.indexOf('Windows 2003') > -1) {
                            version = 'Windows 2003'
                        } else if (userAgent.indexOf('windows nt 6.0') > -1 || userAgent.indexOf('Windows Vista') > -1) {
                            version = 'Windows Vista'
                        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
                            version = 'Windows 7'
                        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
                            version = 'Windows 8'
                        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
                            version = 'Windows 8.1'
                        } else if (userAgent.indexOf('windows nt 6.4') > -1 || userAgent.indexOf('windows nt 10') > -1) {
                            version = 'Windows 10'
                        } else {
                            version = 'Unknown'
                        }
                    } else if (userAgent.indexOf('iphone') > -1) {
                        version = 'Iphone'
                    } else if (userAgent.indexOf('mac') > -1) {
                        version = 'Mac'
                    } else if (
                        userAgent.indexOf('x11') > -1 ||
                        userAgent.indexOf('unix') > -1 ||
                        userAgent.indexOf('sunname') > -1 ||
                        userAgent.indexOf('bsd') > -1
                    ) {
                        version = 'Unix'
                    } else if (userAgent.indexOf('linux') > -1) {
                        if (userAgent.indexOf('android') > -1) {
                            version = 'Android'
                        } else {
                            version = 'Linux'
                        }
                    } else {
                        version = 'Unknown'
                    }
                    return version
                },
                //获取浏览器和对应浏览器版本
                broswerInfo: function() {
                    //前置条件
                    var _broswer = function() {
                        // 浏览器判断和版本号读取
                        var Sys = {}
                        var userAgent = navigator.userAgent.toLowerCase()
                        var s
                        ;(s = userAgent.match(/edge\/([\d.]+)/))
                            ? (Sys.edge = s[1])
                            : (s = userAgent.match(/rv:([\d.]+)\) like gecko/))
                                ? (Sys.ie = s[1])
                                : (s = userAgent.match(/msie ([\d.]+)/))
                                    ? (Sys.ie = s[1])
                                    : (s = userAgent.match(/firefox\/([\d.]+)/))
                                        ? (Sys.firefox = s[1])
                                        : (s = userAgent.match(/chrome\/([\d.]+)/))
                                            ? (Sys.chrome = s[1])
                                            : (s = userAgent.match(/opera.([\d.]+)/))
                                                ? (Sys.opera = s[1])
                                                : (s = userAgent.match(/version\/([\d.]+).*safari/))
                                                    ? (Sys.safari = s[1])
                                                    : 0

                        if (Sys.edge)
                            return {
                                broswer: 'Edge',
                                version: Sys.edge,
                            }
                        if (Sys.ie)
                            return {
                                broswer: 'IE',
                                version: Sys.ie,
                            }
                        if (Sys.firefox)
                            return {
                                broswer: 'Firefox',
                                version: Sys.firefox,
                            }
                        if (Sys.chrome)
                            return {
                                broswer: 'Chrome',
                                version: Sys.chrome,
                            }
                        if (Sys.opera)
                            return {
                                broswer: 'Opera',
                                version: Sys.opera,
                            }
                        if (Sys.safari)
                            return {
                                broswer: 'Safari',
                                version: Sys.safari,
                            }

                        return {
                            broswer: '',
                            version: '0',
                        }
                    }
                    var _version = _broswer()

                    if (_version.broswer == 'IE') {
                        return 0
                    } else if (_version.broswer == 'Chrome') {
                        return 1
                    } else if (_version.broswer == 'Firefox') {
                        return 2
                    } else {
                        return -1
                    }
                },
                send: function(option, callBack) {
                    if (callBack && 'function' === typeof callBack) {
                        se.callBack[option['id']] = callBack
                    }
                    if (se.isIE) {
                        self.ocx.MainCall(option)
                    } else {
                        self.socket.sendSocket(option)
                    }
                },
            },
            socket: {
                setTimeout_close:function(){
                    setTimeout(function(){
                        if(!sessionStorage.getItem('HikCentralWebControlPort')){
                            se.noCardPlayerFlag = true
                            se.connectClose()
                        }
                    },60 * 1000)
                },
                //socket连接
                socketPort: function() {
                    if(se.noCardPlayerFlag){
                        return
                    }
                    if (typeof WebSocket === 'undefined') {
                        alert('您的浏览器不支持socket')
                        return
                    }
                    if(sessionStorage.getItem('HikCentralWebControlPort')){
                        sessionStorage.removeItem('HikCentralWebControlPort')
                    }
                    var startIp = se.port[0]
                    var endIp = se.port[1]
                    var portList = []
                    for (var i = startIp; i <= endIp; i++) {
                        portList.push(i)
                    }
                    var len = portList.length
                    var map = {}
                    var eLen = 0
                    var id = 0
                    var setTimeoutFlag = false
                    se.t1 && window.clearTimeout(se.t1)

                    function ecallback(e) {
                        // console.log(e)
                        se.version = Number(e.data.ver)
                        var o = sessionStorage.getItem('HikCentralWebControlPort')
                        map['ws' + o].close()
                        setTimeoutFlag = true
                        self.socket.socketOpen()
                    }

                    function esuccess(evt) {
                        var port = evt.target.url.split(':').length == 3 ? evt.target.url.split(':')[2].replace('/', '') : '80'
                        var json = {
                            method: 'common.version',
                            info: {},
                            id: se.count++,
                            session: se.session,
                        }
                        id = json.id
                        map['ws' + port] && map['ws' + port].readyState == 1 && map['ws' + port].send(JSON.stringify(json))
                    }

                    function eerror(evt) {
                        eLen++
                        var port = evt.target.url.split(':').length == 3 ? evt.target.url.split(':')[2].replace('/', '') : '80'
                        map['ws' + port].close()
                        if (eLen == len) {
                            if(!se.openPlayerFlag){
                                se.openPlayerFlag = true
                                self.event.openDHPlayer()
                            }
                            self.socket.socketPort()
                        }
                    }

                    function emessage(evt) {
                        var data = evt && evt.data ? JSON.parse(evt.data) : {}
                        if (data.id == id) {
                            se.openPlayerFlag = true
                            var port = evt.target.url.split(':').length == 3 ? evt.target.url.split(':')[2].replace('/', '') : '80'
                            sessionStorage && sessionStorage.setItem('HikCentralWebControlPort', port)
                            ecallback(data)
                        } else {
                            eerror(evt)
                        }
                    }

                    for (var i = 0; i < portList.length; i++) {
                        map['ws' + portList[i]] = new WebSocket('ws://localhost:' + portList[i])
                        map['ws' + portList[i]].onopen = esuccess
                        map['ws' + portList[i]].onerror = eerror
                        map['ws' + portList[i]].onmessage = emessage
                    }
                    //如果端口被占用，状态不返回，主动去获取再判断
                    se.t1 = setTimeout(function() {
                        if(!setTimeoutFlag){
                            var count = 0
                            for (var i = 0; i < portList.length; i++) {
                                if (map['ws' + portList[i]].readyState != 1) {
                                    count++
                                }
                                if (count == portList.length) {
                                    if(!se.openPlayerFlag){
                                        se.openPlayerFlag = true
                                        self.event.openDHPlayer()
                                    }
                                    self.socket.socketPort()
                                }
                            }
                        }
                    }, 10 * 1000)

                },
                // socketError: function() {
                //     se.failCount++
                //     if (se.failCount < 2) {
                //         setTimeout(function() {
                //             if (!se.ws) {
                //                 se.openPlayerFlag = false
                //                 self.socket.socketPort()
                //             }
                //         }, 30 * 1000)
                //     } else {
                //         self.socket.socketClose()
                //         se.connectClose()
                //     }
                // },
                socketOpen: function() {
                    var o = sessionStorage.getItem('HikCentralWebControlPort')
                    se.ws = new WebSocket('ws:127.0.0.1:' + o)
                    se.ws.onopen = se.connectSuccess
                    se.ws.onerror = self.socket.socketOpen.myBind(self)
                    se.ws.onmessage = self.socket.socketmessage.myBind(self)
                    self.event.heartbeat()
                },
                // 连接成功，信息返回
                socketmessage: function(event, evt) {
                    se.heartCount = 0 // 心跳计数至为0
                    se.failCount = 0

                    if (evt.data == null || evt.data == '') {
                        return
                    }
                    var data = JSON.parse(evt.data)
                    if (data.code != 0) {
                        return
                    }
                    var option = se.option_id[data.id]
                    if (!option) {
                        return
                    }
                    // console.log('client', evt.data)
                    se.session = data.session
                    if(data.data && data.data.hwnd != null){
                        se.hwnd = data.data.hwnd
                    }
                    if ('function' == typeof se.callBack[data['id']]) {
                        //回调
                        se.callBack[data['id']](data)
                    }
                },
                //主动关闭socket
                socketClose: function() {
                    se.ws && se.ws.close()
                    se.ws = null
                    se.heart = null
                    // se.openPlayerFlag = false
                    // self.event.openDHPlayer()
                    // self.socket.setTimeout_close()
                },
                // socket /Oxc 选择
                sendSocket: function(option, callBack) {
                    //区分IE
                    // console.log('web', JSON.stringify(option))
                    if (option['method'] != 'common.heartbeat') {
                        se.option_id[option.id] = option
                    }

                    se.ws && se.ws.readyState == 1 && se.ws.send(JSON.stringify(option))
                },
            },
            ocx: {
                init: function() {
                    // if (DHVideoPlayer && 'function' === typeof DHVideoPlayer.MainCall) {
                    //初始化成功
                    se.connectSuccess()
                    // } else {
                    //   //失败
                    //   se.connectError()
                    // }
                },
                MainCall: function(option) {
                    if (option['method'] == 'common.heartbeat') {
                        se.heartCount++
                        if (se.heartCount >= 3) {
                            DHVideoPlayer = null
                            se.connectClose()
                            return
                        }
                    } else {
                        se.option_id[option.id] = option
                    }
                    DHVideoPlayer && DHVideoPlayer.MainCall(option.method, JSON.stringify(option))
                },
            },
            init: function() {
                // self = this
                if (se.isIE) {
                    self.ocx.init()
                } else {
                    self.socket.socketPort()
                    self.socket.setTimeout_close()
                    window.onbeforeunload = self.domListener.onbeforeunload.myBind(self)
                    document.addEventListener('visibilitychange', function() {
                        if (document.visibilityState == 'hidden') {
                            self.event.hide()
                        } else {
                            self.event.show()
                        }
                    })
                    window.onscroll = self.event.resizePage.myBind(self)
                    window.onresize = self.event.resizePage.myBind(self)
                }
                se.browserType = self.common.broswerInfo()
            },
        }
    }

    window.DHPlayer = window.DHPlayer || DHPlayer
})()

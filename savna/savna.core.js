var $avna;
(function ($avna) {
    //
    /* base classes */
    //
    var UniqueId = (function () {
        function UniqueId() {
        }
        UniqueId.GetId = function () {
            return UniqueId._id++;
        };
        return UniqueId;
    }());
    UniqueId._id = 0;
    // Loop Engine
    var LoopType;
    (function (LoopType) {
        LoopType[LoopType["Stopped"] = 0] = "Stopped";
        LoopType[LoopType["WindowFrames"] = 1] = "WindowFrames";
        LoopType[LoopType["Interval"] = 2] = "Interval";
    })(LoopType || (LoopType = {}));
    var LoopEngine = (function () {
        function LoopEngine() {
            var _this = this;
            this._currentState = LoopType.Stopped;
            this._interval_ms = 10;
            this.__last_time = 0;
            this._loop_windowFrame = function (time) {
                var now = Date.now();
                var term = (now - _this.__last_time) - _this._interval_ms;
                if ((term >= 0) && _this._currentState == LoopType.WindowFrames) {
                    _this.__last_time = now - term;
                    _this.tick();
                }
                window.requestAnimationFrame(_this._loop_windowFrame);
            };
        }
        LoopEngine.prototype.setCallback = function (cb) { this._callback = cb; };
        LoopEngine.prototype.isNowLooping = function () { return this._currentState != LoopType.Stopped; };
        LoopEngine.prototype.currentState = function () { return this._currentState; };
        LoopEngine.prototype.stop = function () {
            if (this._currentState == LoopType.Interval)
                clearInterval(this._handle_interval);
            this._currentState = LoopType.Stopped;
        };
        LoopEngine.prototype.tick = function () {
            if (this._callback)
                this._callback(this);
        };
        LoopEngine.prototype.loop = function (type, interval) {
            this.stop();
            this._currentState = type;
            this._interval_ms = interval;
            switch (type) {
                case LoopType.WindowFrames:
                    this.loopWindowFrame();
                    break;
                case LoopType.Interval:
                    this.loopInterval();
                    break;
                case LoopType.Stopped:
                    this.stop();
                    break;
            }
        };
        LoopEngine.prototype.loopWindowFrame = function () {
            this.__last_time = Date.now();
            this._loop_windowFrame(0);
        };
        LoopEngine.prototype.loopInterval = function () {
            var _this = this;
            this._handle_interval = setInterval(function () { _this.tick(); }, this._interval_ms);
        };
        return LoopEngine;
    }());
    var EventEmitter = (function () {
        function EventEmitter() {
            this._events = {};
        }
        EventEmitter.prototype.on = function (type, listener) {
            if (!this._events[type]) {
                this._events[type] = [listener];
            }
            else {
                this._events[type].push(listener);
            }
        };
        EventEmitter.prototype.emit = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.commonEmit(type, false, args);
        };
        EventEmitter.prototype.emitAsync = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.commonEmit(type, true, args);
        };
        EventEmitter.prototype.commonEmit = function (type, isAsync) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var _n_event = "on" + type;
            var evt = this._events[type];
            if (this[_n_event] && (typeof (this[_n_event]) === "function"))
                this.fire(this[_n_event], isAsync, args);
            if (evt) {
                for (var i = 0; i < evt.length; i++)
                    this.fire(evt[i], isAsync, args);
            }
        };
        EventEmitter.prototype.fire = function (event, isAsync) {
            var _this = this;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (isAsync)
                setTimeout(function () { event.apply(_this, args); }, 0);
            else
                event.apply(this, args);
        };
        return EventEmitter;
    }());
    $avna.EventEmitter = EventEmitter;
    var IntervalChecker = (function () {
        function IntervalChecker() {
            this._started = false;
            this._interval = 10;
        }
        IntervalChecker.prototype.start = function () {
            this._started = true;
            this._lastTime = Date.now();
        };
        IntervalChecker.prototype.stop = function () {
            this._started = false;
        };
        IntervalChecker.prototype.reset = function () {
            this._lastTime = Date.now();
        };
        IntervalChecker.prototype.checkTick = function () {
            if (!this._started)
                false;
            var now = Date.now();
            var term = this._lastTime - now - this._interval;
            if (term >= 0) {
                this._lastTime = now - term;
                return true;
            }
            return false;
        };
        IntervalChecker.prototype.setInterval = function (interval_ms) {
            this._interval = interval_ms;
        };
        return IntervalChecker;
    }());
    $avna.IntervalChecker = IntervalChecker;
    var TaskHanlder = (function () {
        function TaskHanlder() {
            this._tasks = [];
        }
        TaskHanlder.prototype.pushTask = function (task) { this._tasks.push(task); };
        TaskHanlder.prototype.clearTasks = function () { this._tasks = []; };
        TaskHanlder.prototype.processTasks = function () {
            var tasks = this.getTasksNClear();
            if (tasks == null)
                return;
            tasks.forEach(function (t, i, arr) { t(); });
        };
        TaskHanlder.prototype.processTasksAsync = function () {
            var tasks = this.getTasksNClear();
            if (tasks == null)
                return;
            setTimeout(function () {
                tasks.forEach(function (t, i, arr) { t(); });
            }, 0);
        };
        TaskHanlder.prototype.processEachTaskAsync = function () {
            var tasks = this.getTasksNClear();
            if (tasks == null)
                return;
            tasks.forEach(function (t, i, arr) {
                setTimeout(function () { t(); }, 0);
            });
        };
        TaskHanlder.prototype.getTasksNClear = function () {
            var temp = (this._tasks.length == 0) ? null : this._tasks;
            this.clearTasks();
            return temp;
        };
        return TaskHanlder;
    }());
    $avna.TaskHanlder = TaskHanlder;
    //
    /* */
    //
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    $avna.Point = Point;
    var Size = (function () {
        function Size(width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.width = width;
            this.height = height;
        }
        return Size;
    }());
    $avna.Size = Size;
    var Rect = (function () {
        function Rect(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        return Rect;
    }());
    $avna.Rect = Rect;
    var Color = (function () {
        function Color(r, g, b, a) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            if (a === void 0) { a = 0; }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        Color.prototype.set = function (r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        };
        Color.prototype.toString = function () {
            return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
        };
        Color.prototype.clone = function () {
            return new Color(this.r, this.g, this.b, this.a);
        };
        return Color;
    }());
    $avna.Color = Color;
    //
    /* event classes */
    //
    var UserPointType;
    (function (UserPointType) {
        UserPointType[UserPointType["MouseDown"] = 0] = "MouseDown";
        UserPointType[UserPointType["MouseMove"] = 1] = "MouseMove";
        UserPointType[UserPointType["MouseUp"] = 2] = "MouseUp";
        UserPointType[UserPointType["MouseOver"] = 3] = "MouseOver";
        UserPointType[UserPointType["MouseOut"] = 4] = "MouseOut";
        UserPointType[UserPointType["TouchStart"] = 5] = "TouchStart";
        UserPointType[UserPointType["TouchMove"] = 6] = "TouchMove";
        UserPointType[UserPointType["TouchEnd"] = 7] = "TouchEnd";
        UserPointType[UserPointType["TouchCancel"] = 8] = "TouchCancel";
    })(UserPointType = $avna.UserPointType || ($avna.UserPointType = {}));
    var UserMouseEventArg = (function () {
        function UserMouseEventArg(type, x, y, handle) {
            if (handle === void 0) { handle = null; }
            this.type = type;
            this.x = x;
            this.y = y;
            this.handle = handle;
        }
        return UserMouseEventArg;
    }());
    $avna.UserMouseEventArg = UserMouseEventArg;
    function CreateMouseEventArg(type, x, y, canvas) {
        var br = canvas.getBoundingClientRect();
        return new UserMouseEventArg(type, x * canvas.width / br.width, y * canvas.height / br.height);
    }
    //
    /* application */
    //
    var CanvasApp = (function () {
        function CanvasApp(canvasId, application) {
            this.canvasId = canvasId;
            this.application = application;
        }
        return CanvasApp;
    }());
    var Graphics = (function () {
        function Graphics(ctx, rect) {
            this.ctx = ctx;
            this.rect = rect;
        }
        Object.defineProperty(Graphics.prototype, "context", {
            get: function () { return this.ctx; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Graphics.prototype, "boundRect", {
            get: function () { return this.rect; },
            enumerable: true,
            configurable: true
        });
        return Graphics;
    }());
    $avna.Graphics = Graphics;
    // Internal Applications
    var ImpleApplication = (function () {
        function ImpleApplication() {
            this._started = false;
            this._canvasId = null;
        }
        /* no interface member */
        ImpleApplication.prototype.setCanvasId = function (id) { this._canvasId = id; };
        /* IApplication interface*/
        ImpleApplication.prototype.start = function () {
            var _this = this;
            if (this._started)
                return;
            if (this._canvasId == null)
                return; //throw?
            this._started = true;
            var init = function () {
                var canvas = document.getElementById(_this._canvasId);
                if (canvas == null)
                    return;
                // init graphics
                _this._graphics = new Graphics(canvas.getContext("2d"), new Rect());
                // mouse event
                canvas.addEventListener("mousedown", function (e) {
                    _this.mouseHandler(CreateMouseEventArg(UserPointType.MouseDown, e.clientX, e.clientY, canvas));
                });
                canvas.addEventListener("mousemove", function (e) {
                    _this.mouseHandler(CreateMouseEventArg(UserPointType.MouseMove, e.clientX, e.clientY, canvas));
                });
                canvas.addEventListener("mouseup", function (e) {
                    _this.mouseHandler(CreateMouseEventArg(UserPointType.MouseUp, e.clientX, e.clientY, canvas));
                });
                canvas.addEventListener("mouseover", function (e) {
                    _this.mouseHandler(CreateMouseEventArg(UserPointType.MouseOver, e.clientX, e.clientY, canvas));
                });
                canvas.addEventListener("mouseout", function (e) {
                    _this.mouseHandler(CreateMouseEventArg(UserPointType.MouseOut, e.clientX, e.clientY, canvas));
                });
                //TODO taskHandler -> 
                //TODO emit events
                //TODO looping render
            };
            if (document.readyState === "complete" || document.readyState === "loaded")
                init();
            else
                document.addEventListener('DOMContentLoaded', init);
        };
        ImpleApplication.prototype.mouseHandler = function (arg) {
            //TODO
        };
        ImpleApplication.prototype.requestRedraw = function () {
            //TODO
        };
        return ImpleApplication;
    }());
    var Application = (function () {
        function Application() {
        }
        Application.Initialize = function (canvasId) {
            var app = new ImpleApplication();
            var canvasApp = new CanvasApp(canvasId, app);
            var appid = "appid" + UniqueId.GetId();
            Application._apps[appid] = canvasApp;
            app.setCanvasId(canvasId);
            return appid;
        };
        Application.GetApplication = function (appId) {
            return Application._apps[appId].application;
        };
        return Application;
    }());
    Application._apps = {};
    $avna.Application = Application;
})($avna || ($avna = {}));
//# sourceMappingURL=savna.core.js.map
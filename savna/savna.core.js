var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $avna;
(function ($avna) {
    //
    /* base classes */
    //
    var AppErrorType;
    (function (AppErrorType) {
        AppErrorType[AppErrorType["NullCanvasId"] = 0] = "NullCanvasId";
        AppErrorType[AppErrorType["NotFoundCanvas"] = 1] = "NotFoundCanvas";
        AppErrorType[AppErrorType["AlreadyInitializedCanvasId"] = 2] = "AlreadyInitializedCanvasId";
    })(AppErrorType = $avna.AppErrorType || ($avna.AppErrorType = {}));
    var AppError = (function () {
        function AppError(errType) {
            this.errType = errType;
        }
        Object.defineProperty(AppError.prototype, "errorType", {
            get: function () { return this.errType; },
            enumerable: true,
            configurable: true
        });
        return AppError;
    }());
    $avna.AppError = AppError;
    // Unique Id generator
    var UniqueId = (function () {
        function UniqueId() {
        }
        UniqueId.GetId = function () {
            return UniqueId._id++;
        };
        return UniqueId;
    }());
    UniqueId._id = 0;
    var ManualTimer = (function () {
        function ManualTimer() {
            this._timer = 0;
            this._lastLap = 0;
        }
        ManualTimer.prototype.reset = function () { this._lastLap = this._timer = Date.now(); };
        ManualTimer.prototype.lap = function () {
            this._lastLap = Date.now();
            return this._lastLap - this._timer;
        };
        ManualTimer.prototype.sinceLastLap = function () {
            return Date.now() - this._lastLap;
        };
        return ManualTimer;
    }());
    $avna.ManualTimer = ManualTimer;
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
            var term = now - this._lastTime - this._interval;
            if (term >= 0) {
                this._lastTime = now - (term % this._interval);
                return true;
            }
            return false;
        };
        IntervalChecker.prototype.setInterval = function (interval_ms) {
            this._interval = interval_ms;
        };
        IntervalChecker.prototype.interval = function () {
            return this._interval;
        };
        return IntervalChecker;
    }());
    $avna.IntervalChecker = IntervalChecker;
    // LoopEngine
    var LoopType;
    (function (LoopType) {
        LoopType[LoopType["Stopped"] = 0] = "Stopped";
        LoopType[LoopType["WindowFrames"] = 1] = "WindowFrames";
        LoopType[LoopType["Interval"] = 2] = "Interval";
    })(LoopType = $avna.LoopType || ($avna.LoopType = {}));
    var LoopEngine = (function () {
        function LoopEngine() {
            var _this = this;
            this._intervalChecker = new IntervalChecker();
            this._currentState = LoopType.Stopped;
            this._loop_windowFrame = function (time) {
                if (_this._intervalChecker.checkTick()) {
                    _this.tick();
                }
                if (_this._currentState == LoopType.WindowFrames)
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
            if (interval === void 0) { interval = this._intervalChecker.interval(); }
            this.stop();
            this._currentState = type;
            this._intervalChecker.setInterval(interval);
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
        LoopEngine.prototype.intervalChecker = function () { return this._intervalChecker; };
        LoopEngine.prototype.loopWindowFrame = function () {
            this._intervalChecker.reset();
            this._loop_windowFrame(0);
        };
        LoopEngine.prototype.loopInterval = function () {
            var _this = this;
            this._handle_interval = setInterval(function () { _this.tick(); }, this._intervalChecker.interval());
        };
        return LoopEngine;
    }());
    $avna.LoopEngine = LoopEngine;
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
        Point.prototype.clone = function () { return new Point(this.x, this.y); };
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
        Size.prototype.clone = function () { return new Size(this.width, this.height); };
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
        Rect.prototype.clone = function () { return new Rect(this.x, this.y, this.width, this.height); };
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
    var Graphics = (function () {
        function Graphics(ctx, rect) {
            this.ctx = ctx;
            this.rect = rect;
            this._stepTime = 0;
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
        Object.defineProperty(Graphics.prototype, "stepTime", {
            get: function () { return this._stepTime; },
            set: function (time) { this._stepTime = time; },
            enumerable: true,
            configurable: true
        });
        return Graphics;
    }());
    $avna.Graphics = Graphics;
    //
    /* Core UIs */
    //
    var core;
    (function (core) {
        var VisualComponent = (function () {
            function VisualComponent() {
            }
            VisualComponent.prototype.draw = function (g) { };
            return VisualComponent;
        }());
        core.VisualComponent = VisualComponent;
        var UIComponent = (function (_super) {
            __extends(UIComponent, _super);
            function UIComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return UIComponent;
        }(VisualComponent));
        core.UIComponent = UIComponent;
        var StyleComponent = (function (_super) {
            __extends(StyleComponent, _super);
            function StyleComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return StyleComponent;
        }(UIComponent));
        core.StyleComponent = StyleComponent;
        var BaseStage = (function () {
            function BaseStage() {
                this.initializeUI();
            }
            BaseStage.prototype.draw = function (g) { };
            BaseStage.prototype.initializeUI = function () { };
            return BaseStage;
        }());
        core.BaseStage = BaseStage;
    })(core = $avna.core || ($avna.core = {}));
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
        UserMouseEventArg.prototype.toString = function () { return "[type:" + UserPointType[this.type] + "] x:" + this.x + ", y:" + this.y; };
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
    // Internal Applications
    var ImpleApplication = (function (_super) {
        __extends(ImpleApplication, _super);
        function ImpleApplication() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._initialized = false;
            _this._canvasId = null;
            _this._taskHandlers = new TaskHanlder();
            _this._loopEngine = new LoopEngine();
            /* states */
            _this._drawReqeusted = false;
            _this._looping = false;
            _this._step_timer = new ManualTimer();
            /* contents*/
            _this._content = null;
            return _this;
        }
        //
        /* no interface member */
        //
        ImpleApplication.prototype.setCanvasId = function (id) { this._canvasId = id; };
        ImpleApplication.prototype.initialize = function (appcb) {
            var _this = this;
            if (this._canvasId == null) {
                appcb(new AppError(AppErrorType.NullCanvasId), null);
                return;
            }
            this._initialized = true;
            // init
            this._loopEngine.setCallback(this.oninternalloop.bind(this));
            var init = function () {
                var canvas = document.getElementById(_this._canvasId);
                if (canvas == null) {
                    appcb(new AppError(AppErrorType.NotFoundCanvas), null);
                    return;
                }
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
                appcb(null, _this);
            };
            if (document.readyState === "complete" || document.readyState === "loaded")
                init();
            else
                document.addEventListener('DOMContentLoaded', init);
        };
        ImpleApplication.prototype.oninternalloop = function (loop) {
            // process tasks
            this._taskHandlers.processTasks();
            // check redraw and draw
            if (this._looping || this._drawReqeusted) {
                this._graphics.stepTime = this._step_timer.sinceLastLap();
                this._step_timer.lap();
                // draw content
                if (this._content) {
                    this._graphics.boundRect.x = this._graphics.boundRect.y = 0;
                    this._graphics.boundRect.width = this._graphics.context.canvas.width;
                    this._graphics.boundRect.height = this._graphics.context.canvas.height;
                    this._content.draw(this._graphics);
                }
                //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                this._drawReqeusted = false;
            }
        };
        //
        /* IApplication interface*/
        //
        ImpleApplication.prototype.isInitialized = function () { return this._initialized; };
        ImpleApplication.prototype.start = function () {
            this._step_timer.reset();
            // looping render
            this._loopEngine.loop(LoopType.WindowFrames);
        };
        ImpleApplication.prototype.mouseHandler = function (arg) {
            //TODO
            //console.log(arg.toString());
        };
        ImpleApplication.prototype.requestRedraw = function () {
            this._drawReqeusted = true;
        };
        ImpleApplication.prototype.setAnimating = function (animate) { this._looping = animate; };
        ImpleApplication.prototype.getAnimating = function () { return this._looping; };
        ImpleApplication.prototype.setLoopInterval = function (interval) {
            this._loopEngine.intervalChecker().setInterval(interval);
        };
        ImpleApplication.prototype.getLoopInterval = function () {
            return this._loopEngine.intervalChecker().interval();
        };
        ImpleApplication.prototype.setSize = function (width, height) {
            var _this = this;
            //let c = this._content; // may be PageNavigator
            console.log("" + width + "," + height);
            this._taskHandlers.pushTask(function () {
                _this._graphics.context.canvas.width = width;
                _this._graphics.context.canvas.height = height;
                //TODO layout ???may be PageNavigator
            });
            this._drawReqeusted = true;
        };
        ImpleApplication.prototype.setContent = function (content) {
            this._content = content;
        };
        ImpleApplication.prototype.getContent = function () {
            return this._content;
        };
        return ImpleApplication;
    }(EventEmitter));
    var Application = (function () {
        function Application() {
        }
        Application.Initialize = function (canvasId, appcb) {
            // check already has canvasid
            var appid = null;
            if ((appid = Application.GetAppId(canvasId)) != null) {
                appcb(new AppError(AppErrorType.AlreadyInitializedCanvasId), null);
                return appid;
            }
            var app = new ImpleApplication();
            var canvasApp = new CanvasApp(canvasId, app);
            appid = "appid" + UniqueId.GetId();
            Application._apps[appid] = canvasApp;
            app.setCanvasId(canvasId);
            app.initialize(appcb);
            return appid;
        };
        Application.GetAppId = function (canvasId) {
            for (var key in Application._apps) {
                if (Application._apps[key].canvasId == canvasId)
                    return key;
            }
            return null;
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
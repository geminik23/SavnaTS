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
    var Stack = (function () {
        function Stack() {
            this._data = new Array();
        }
        Stack.prototype.hasElement = function () {
            return this._data.length != 0;
        };
        Stack.prototype.size = function () { return this._data.length; };
        Stack.prototype.pop = function () {
            if (!this.hasElement())
                return null;
            var t = this._data[this._data.length - 1];
            this._data = this._data.slice(0, this._data.length - 1);
            return t;
        };
        Stack.prototype.push = function (element) {
            this._data.push(element);
        };
        Stack.prototype.peek = function () {
            if (!this.hasElement())
                return null;
            return this._data[this._data.length - 1];
        };
        return Stack;
    }());
    var LinkedList = (function () {
        function LinkedList() {
            this._beginNode = null;
            this._endNode = null;
            this._length = 0;
        }
        LinkedList.prototype.begin = function () { return this._beginNode; };
        LinkedList.prototype.end = function () { return this._endNode; };
        LinkedList.prototype.clear = function () {
            this._beginNode = null;
            this._endNode = null;
            this._length = 0;
        };
        LinkedList.prototype.pushBack = function (ele) {
            var node = { element: ele, next: null };
            if (this._length == 0) {
                this._beginNode = node;
                this._endNode = node;
            }
            else {
                this._endNode.next = node;
                this._endNode = node;
            }
            this._length++;
        };
        LinkedList.prototype.pushFront = function (ele) {
            var node = { element: ele, next: null };
            if (this._length == 0) {
                this._beginNode = node;
                this._endNode = node;
            }
            else {
                node.next = this._beginNode;
                this._beginNode = node;
            }
            this._length++;
        };
        LinkedList.prototype.popFront = function () {
            var result = null;
            if (this._length == 0)
                return result;
            result = this._beginNode.element;
            this._beginNode = this._beginNode.next;
            this._length--;
            return result;
        };
        LinkedList.prototype.popBack = function () {
            var result = null;
            if (this._length == 0)
                return result;
            if (this._length == 1) {
                result = this._beginNode.element;
                this.clear();
                return result;
            }
            var t = this.nodeAt(this._length - 2);
            result = t.next.element;
            this._endNode = t;
            t.next = null;
            this._length--;
            return result;
        };
        LinkedList.prototype.insert = function (ele, index) {
            var node = { element: ele, next: null };
            if (index == 0) {
                node.next = this._beginNode.next;
                this._beginNode = node;
                this._length++;
                return true;
            }
            if (index == this._length) {
                this.pushBack(ele);
                return true;
            }
            var pnode = this.nodeAt(index - 1);
            if (pnode == null)
                return false;
            node.next = pnode.next;
            pnode.next = node;
            this._length++;
            return true;
        };
        LinkedList.prototype.nodeAt = function (index) {
            if (index < 0 || index >= this._length)
                return null;
            if (index == this._length - 1)
                return this._endNode;
            var cur = this._beginNode;
            for (var i = 0; i < index; i++) {
                cur = cur.next;
            }
            return cur;
        };
        LinkedList.prototype.indexOf = function (ele) {
            var cur = this._beginNode;
            var idx = 0;
            while (cur != null) {
                if (cur.element === ele)
                    return idx;
                idx++;
                cur = cur.next;
            }
            return -1;
        };
        LinkedList.prototype.contains = function (element) {
            return this.indexOf(element) != -1;
        };
        LinkedList.prototype.remove = function (element) {
            var idx = this.indexOf(element);
            if (idx == -1)
                return false;
            this.removeAt(idx);
            return true;
        };
        LinkedList.prototype.removeAt = function (index) {
            if (index < 0 || index >= this._length)
                return null;
            if (index == this._length - 1)
                return this.popBack();
            if (index == 0)
                return this.popFront();
            var t = this.nodeAt(index - 1);
            var ele = t.element;
            t.next = t.next.next;
            this._length--;
            return ele;
        };
        LinkedList.prototype.elementAt = function (index) {
            var n = this.nodeAt(index);
            return (n == null) ? null : n.element;
        };
        LinkedList.prototype.size = function () { return this._length; };
        LinkedList.prototype.foreach = function (each) {
            var cur = this._beginNode;
            while (cur) {
                each(cur.element);
                cur = cur.next;
            }
        };
        return LinkedList;
    }());
    $avna.LinkedList = LinkedList;
    // PriorityQueue
    var PriorityItem = (function () {
        function PriorityItem() {
            this._items = new LinkedList();
        }
        Object.defineProperty(PriorityItem.prototype, "itemList", {
            get: function () { return this._items; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PriorityItem.prototype, "length", {
            get: function () { return this._items.size(); },
            enumerable: true,
            configurable: true
        });
        PriorityItem.prototype.contains = function (item) {
            return this._items.contains(item);
        };
        PriorityItem.prototype.removeItem = function (item) {
            this._items.remove(item);
        };
        PriorityItem.prototype.addItem = function (item) {
            this._items.pushBack(item);
        };
        return PriorityItem;
    }());
    //!!!! this priorityQueue method occur overhead if you use big | priority number |
    var PriorityQueue = (function () {
        function PriorityQueue() {
            this._queue = {};
            this._maxPriority = -1;
            this._minPriority = 0;
        }
        PriorityQueue.prototype.getMaxPriority = function () { return this._maxPriority; };
        PriorityQueue.prototype.getMinPriority = function () { return this._minPriority; };
        PriorityQueue.prototype.push = function (element, priority) {
            if (this._minPriority > this._maxPriority) {
                this._minPriority = priority;
                this._maxPriority = priority;
            }
            if (this._minPriority > priority)
                this._minPriority = priority;
            if (this._maxPriority < priority)
                this._maxPriority = priority;
            var items = this._queue[priority];
            if (!items) {
                items = new PriorityItem();
                this._queue[priority] = items;
            }
            items.addItem(element);
        };
        PriorityQueue.prototype.isEmpty = function () { return this._minPriority > this._maxPriority; };
        PriorityQueue.prototype.popMaxPriorityItem = function () {
            var item = null;
            if (this._minPriority <= this._maxPriority) {
                var items = this.updateMaxPriority();
                if (items)
                    item = items.itemList.popFront();
                this.updateMaxPriority();
            }
            this.refresh();
            return item;
        };
        PriorityQueue.prototype.popMinPriorityItem = function () {
            var item = null;
            var items = null;
            if (this._minPriority <= this._maxPriority) {
                var items_1 = this.updateMinPriority();
                if (items_1)
                    item = items_1.itemList.popFront();
                this.updateMinPriority();
            }
            this.refresh();
            return item;
        };
        PriorityQueue.prototype.updateMaxPriority = function () {
            var cur = this._queue[this._maxPriority];
            while (!cur || cur.length == 0) {
                this._maxPriority -= 1;
                if (this._maxPriority < this._minPriority) {
                    return null;
                }
                cur = this._queue[this._maxPriority];
            }
            return cur;
        };
        PriorityQueue.prototype.updateMinPriority = function () {
            var cur = this._queue[this._minPriority];
            while (!cur || cur.length == 0) {
                this._minPriority += 1;
                if (this._maxPriority < this._minPriority) {
                    return null;
                }
                cur = this._queue[this._minPriority];
            }
            return cur;
        };
        PriorityQueue.prototype.refresh = function () {
            if (this.isEmpty()) {
                this._maxPriority = -1;
                this._minPriority = 0;
            }
        };
        PriorityQueue.prototype.toArray = function () {
            var t = null;
            var arr = [];
            var max = this._maxPriority;
            var cur;
            while (max >= this._minPriority) {
                if (this._queue[max]) {
                    cur = this._queue[max].itemList.begin();
                    while (cur) {
                        arr.push(cur.element);
                        cur = cur.next;
                    }
                }
                max--;
            }
            return arr;
        };
        PriorityQueue.prototype.toString = function () {
            return this.toArray().toString();
        };
        return PriorityQueue;
    }());
    $avna.PriorityQueue = PriorityQueue;
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
    //export class Size implements IClonable<Size>{
    //	constructor(public width: number = 0, public height: number = 0) { }
    //	clone() { return new Size(this.width, this.height); }
    //}
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
    var BaseError = (function () {
        function BaseError(msg) {
            this._errorMsg = msg;
        }
        BaseError.prototype.getErrorMessage = function () { return this._errorMsg; };
        return BaseError;
    }());
    $avna.BaseError = BaseError;
    var ArgumentError = (function (_super) {
        __extends(ArgumentError, _super);
        function ArgumentError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ArgumentError;
    }(BaseError));
    $avna.ArgumentError = ArgumentError;
    //
    /* UserInterface */
    //
    var ui;
    (function (ui) {
        var core;
        (function (core) {
            var InvalidateType;
            (function (InvalidateType) {
                InvalidateType[InvalidateType["All"] = 0] = "All";
                InvalidateType[InvalidateType["Size"] = 1] = "Size";
                InvalidateType[InvalidateType["Position"] = 2] = "Position";
                InvalidateType[InvalidateType["State"] = 3] = "State";
            })(InvalidateType || (InvalidateType = {}));
            var VisualComponent = (function (_super) {
                __extends(VisualComponent, _super);
                function VisualComponent() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.appId = null;
                    _this._depthLevel = 0;
                    return _this;
                }
                VisualComponent.DepthLevel = function (obj) {
                    if (obj instanceof VisualComponent)
                        return obj.depthLevel;
                    return -1;
                };
                Object.defineProperty(VisualComponent.prototype, "x", {
                    get: function () { return this._x; },
                    set: function (nx) { this._x = nx; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(VisualComponent.prototype, "y", {
                    get: function () { return this._y; },
                    set: function (ny) { this._y = ny; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(VisualComponent.prototype, "depthLevel", {
                    get: function () { return this._depthLevel; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(VisualComponent.prototype, "currentAppId", {
                    get: function () { return this.appId; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(VisualComponent.prototype, "currentApplication", {
                    get: function () { return Application.GetApplication(this.appId); },
                    enumerable: true,
                    configurable: true
                });
                VisualComponent.prototype.setParent = function (parent) {
                    this.parent = parent;
                    if (parent != null) {
                        this._depthLevel = parent.depthLevel + 1;
                        this.appId = parent.currentAppId;
                    }
                };
                VisualComponent.prototype.measureRequest = function (availableSize) {
                    var s = this.measureOverride(availableSize);
                    if (s != null)
                        return s;
                    return this.internalMeasure(availableSize);
                };
                VisualComponent.prototype.measureOverride = function (available) { return null; };
                VisualComponent.prototype.internalMeasure = function (available) { return available; };
                VisualComponent.prototype.renderingRequest = function (g) {
                    if (this.drawOverride(g))
                        return;
                    this.internalDraw(g);
                };
                VisualComponent.prototype.internalDraw = function (g) { };
                VisualComponent.prototype.drawOverride = function (g) { return false; };
                return VisualComponent;
            }(EventEmitter));
            core.VisualComponent = VisualComponent;
            var UIComponent = (function (_super) {
                __extends(UIComponent, _super);
                function UIComponent() {
                    var _this = _super.call(this) || this;
                    _this._minWidth = 0;
                    _this._minHeight = 0;
                    _this._includeInLayout = true;
                    _this.displayListIsInvalid = false;
                    _this.propertiesAreInvalid = false;
                    _this.init();
                    return _this;
                }
                UIComponent.prototype.init = function () {
                };
                /* ::interface:: IInvalidate*/
                UIComponent.prototype.invalidateState = function () {
                    //TODO
                };
                UIComponent.prototype.invalidateLayout = function () {
                    //TODO
                };
                UIComponent.prototype.validateState = function () {
                    //TODO
                };
                UIComponent.prototype.validateLayout = function () {
                    //TODO
                };
                Object.defineProperty(UIComponent.prototype, "minWidth", {
                    get: function () { return this._minWidth; },
                    set: function (width) {
                        if (this._minWidth != width) {
                            this._minWidth = width;
                            this.notifyLayoutChangedToParents();
                        }
                        return;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIComponent.prototype, "minHeight", {
                    get: function () { return this._minHeight; },
                    set: function (height) {
                        if (this._minHeight != height) {
                            this._minHeight = height;
                            this.notifyLayoutChangedToParents();
                        }
                        return;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIComponent.prototype, "enabled", {
                    get: function () {
                        return this._enabled;
                    },
                    set: function (enable) {
                        if (enable == this._enabled) {
                            return;
                        }
                        this._enabled = enable;
                        this.stateChanged = true;
                        this.invalidateState();
                    },
                    enumerable: true,
                    configurable: true
                });
                UIComponent.prototype.setPosition = function (x, y) {
                    this.x = x;
                    this.y = y;
                    return;
                };
                UIComponent.prototype.setActualSize = function (width, height) {
                    if (this._width != width) {
                        this._width = height;
                        this.sizeChange = true;
                    }
                    if (this._height != height) {
                        this._height = height;
                        this.sizeChange = true;
                    }
                    if (this.sizeChange) {
                        this.invalidateState();
                        this.invalidateLayout();
                    }
                };
                UIComponent.prototype.childChanged = function (child) {
                    if (child === void 0) { child = null; }
                    return true;
                };
                UIComponent.prototype.notifyLayoutChangedToParents = function () {
                    if (!this.parent)
                        return;
                    var cur = this;
                    var p = null;
                    while (cur) {
                        p = cur.parent;
                        if (p && !p.childChanged(cur))
                            break;
                        cur = p;
                    }
                };
                UIComponent.prototype.notifyToParentLayoutChanged = function () {
                    if (!this.parent)
                        return;
                    var p = this.parent;
                    if (p && p.childChanged(null))
                        p.notifyLayoutChangedToParents();
                };
                UIComponent.prototype.flushCache = function () { return; };
                UIComponent.prototype.getWidth = function () { return this._width; };
                UIComponent.prototype.setWidth = function (w) {
                    if (this._explicitWidth != w) {
                        this._explicitWidth = w;
                    }
                    if (this._width != w) {
                        this._width = w;
                        this.sizeChange = true;
                        this.invalidateLayout();
                    }
                };
                UIComponent.prototype.getHeight = function () { return this._height; };
                UIComponent.prototype.setHeight = function (h) {
                    if (this._explicitHeight != h) {
                        this._explicitHeight = h;
                    }
                    if (this._height != h) {
                        this._height = h;
                        this.sizeChange = true;
                        this.invalidateLayout();
                    }
                };
                Object.defineProperty(UIComponent.prototype, "explicitWidth", {
                    get: function () { return this._explicitWidth; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIComponent.prototype, "explicitHeight", {
                    get: function () { return this._explicitHeight; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIComponent.prototype, "scaleX", {
                    get: function () { return this._width / this.startWidth; },
                    set: function (sx) { this._width = this.startWidth * sx; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIComponent.prototype, "scaleY", {
                    get: function () { return this._height / this.startHeight; },
                    set: function (sy) { this._height = this.startHeight * sy; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UIComponent.prototype, "includeInLayout", {
                    get: function () { return this._includeInLayout; },
                    set: function (i) {
                        if (i != this._includeInLayout) {
                            this._includeInLayout = i;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return UIComponent;
            }(VisualComponent));
            core.UIComponent = UIComponent;
            var Container = (function (_super) {
                __extends(Container, _super);
                function Container() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._childContainer = new LinkedList();
                    return _this;
                }
                Container.prototype.setAppId = function (appid) {
                    var _this = this;
                    this.appId = appid;
                    this._childContainer.foreach(function (ele) {
                        ele.setParent(_this);
                    });
                };
                Container.prototype.addChild = function (child) { this._childContainer.pushBack(child); child.setParent(this); this.structureChange(); return child; };
                Container.prototype.addChildAt = function (child, index) { this._childContainer.insert(child, index); child.setParent(this); this.structureChange(); return child; };
                Container.prototype.childAt = function (idx) { return this._childContainer.elementAt(idx); };
                Container.prototype.numOfChildren = function () { return this._childContainer.size(); };
                Container.prototype.removeChild = function (child) {
                    var r = this._childContainer.remove(child);
                    if (r) {
                        child.setParent(null);
                        this.structureChange();
                    }
                    return child;
                };
                Container.prototype.removeChildAt = function (idx) {
                    var r = this._childContainer.removeAt(idx);
                    if (r != null) {
                        r.setParent(null);
                        this.structureChange();
                    }
                    return r;
                };
                Container.prototype.moveToFront = function (child) {
                    if (this._childContainer.remove(child)) {
                        this._childContainer.pushFront(child);
                    }
                };
                Container.prototype.moveToBack = function (child) {
                    if (this._childContainer.remove(child)) {
                        this._childContainer.pushBack(child);
                    }
                };
                Container.prototype.getLayout = function () { return this._layout; };
                Container.prototype.setLayout = function (layout) {
                    if (layout == null) {
                        throw new ArgumentError("layout is null");
                    }
                    if (this._layout != layout) {
                        this._layout = layout;
                        this._layout.setTarget(this);
                        this.structureChange();
                    }
                };
                //it's real children's bound size
                Container.prototype.getContentWidth = function () {
                    return 0; //TODO
                };
                Container.prototype.getContentHeight = function () {
                    return 0; //TODO
                };
                /* overrides */
                Container.prototype.setHeight = function (h) {
                    if (this.getHeight() != h)
                        this._updateLayout = true;
                    _super.prototype.setHeight.call(this, h);
                    this.boundChanged();
                };
                Container.prototype.setWidth = function (w) {
                    if (this.getWidth() != w)
                        this._updateLayout = true;
                    _super.prototype.setWidth.call(this, w);
                    this.boundChanged();
                };
                Container.prototype.setActualSize = function (w, h) {
                    if (w != this.getWidth() || h != this.getHeight()) {
                        this._updateLayout = true;
                    }
                    _super.prototype.setActualSize.call(this, w, h);
                    this.boundChanged();
                };
                /* private methods */
                Container.prototype.boundChanged = function () {
                    //TODO
                };
                Container.prototype.structureChange = function () {
                    //TODO
                };
                return Container;
            }(UIComponent));
            core.Container = Container;
            var StyleComponent = (function (_super) {
                __extends(StyleComponent, _super);
                function StyleComponent() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return StyleComponent;
            }(UIComponent));
            core.StyleComponent = StyleComponent;
            var Page = (function (_super) {
                __extends(Page, _super);
                function Page() {
                    var _this = _super.call(this) || this;
                    _this.navigator = null;
                    _this.initializeUI();
                    return _this;
                }
                Page.prototype.setAppId = function (id) {
                    _super.prototype.setAppId.call(this, id);
                };
                Page.prototype.initializeUI = function () { };
                Page.prototype.setNavigator = function (navi) {
                    this.navigator = navi;
                };
                Page.prototype.navigated = function (arg) { };
                return Page;
            }(Container));
            core.Page = Page;
        })(core = ui.core || (ui.core = {}));
    })(ui = $avna.ui || ($avna.ui = {}));
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
    var InvalidationManager = (function () {
        function InvalidationManager() {
        }
        return InvalidationManager;
    }());
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
            _this._invalidationManager = new InvalidationManager();
            /* states */
            _this._drawReqeusted = false;
            _this._looping = false;
            _this._step_timer = new ManualTimer();
            /* contents*/
            _this._navigator = new PageNavigator();
            return _this;
        }
        //
        /* no interface member */
        //
        ImpleApplication.prototype.setAppId = function (appid) { this._appid = appid; this._navigator.setAppId(this._appid); };
        ImpleApplication.prototype.setCanvasId = function (id) { this._canvasId = id; };
        ImpleApplication.prototype.initialize = function (appcb) {
            var _this = this;
            if (this._canvasId == null) {
                appcb(new AppError(AppErrorType.NullCanvasId), null);
                return;
            }
            this._initialized = true;
            // init
            this._loopEngine.setCallback(this.internalLoop.bind(this));
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
        ImpleApplication.prototype.internalLoop = function (loop) {
            // process tasks
            this._taskHandlers.processTasks();
            // check redraw and draw
            if (this._looping || this._drawReqeusted) {
                this._graphics.stepTime = this._step_timer.sinceLastLap();
                this._step_timer.lap();
                // draw content
                var p = this._navigator.topPage();
                if (p != null) {
                    this._graphics.boundRect.x = this._graphics.boundRect.y = 0;
                    this._graphics.boundRect.width = this._graphics.context.canvas.width;
                    this._graphics.boundRect.height = this._graphics.context.canvas.height;
                    p.renderingRequest(this._graphics);
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
            this._taskHandlers.pushTask(function () {
                _this._graphics.context.canvas.width = width;
                _this._graphics.context.canvas.height = height;
                //TODO layout ???may be PageNavigator
            });
            this._drawReqeusted = true;
        };
        ImpleApplication.prototype.setInitialPage = function (typeOfPage) {
            this._navigator.initialPage(typeOfPage);
        };
        ImpleApplication.prototype.invalidationManager = function () { return this._invalidationManager; };
        return ImpleApplication;
    }(EventEmitter));
    var PageNavigator = (function () {
        function PageNavigator() {
            this._initialPage = null;
            this._pageStack = new Stack();
            this._appid = null;
        }
        PageNavigator.prototype.setAppId = function (appid) {
            this._appid = appid;
        };
        PageNavigator.prototype.initialPage = function (pageType) {
            var newPage = new pageType();
            if (!(newPage instanceof ui.core.Page))
                throw new ArgumentError("argument is not instance of Page");
            var ipage = newPage;
            this._initialPage = newPage;
            ipage.setNavigator(this);
            ipage.setAppId(this._appid);
            this._initialPage.navigated(null);
        };
        PageNavigator.prototype.navigate = function (pageType, argument) {
            var newPage = new pageType();
            if (!(newPage instanceof ui.core.Page))
                throw new ArgumentError("argument is not instance of Page");
            var ipage = newPage;
            ipage.setNavigator(this);
            ipage.setAppId(this._appid);
            this._pageStack.push(ipage);
            this._pageStack.peek().navigated(argument);
        };
        PageNavigator.prototype.hasPage = function () { return this._pageStack.size() != 0; };
        PageNavigator.prototype.hasInitialPage = function () { return this._initialPage != null; };
        PageNavigator.prototype.canGoBack = function () {
            if (this._pageStack.size() > 1)
                return true;
            if (this._pageStack.size() == 1 && this._initialPage != null) {
                return true;
            }
            return false;
        };
        PageNavigator.prototype.goBack = function () {
            var s = this._pageStack.size();
            if (s > 1 || (s == 1 && this._initialPage != null)) {
                this._pageStack.pop();
            }
        };
        PageNavigator.prototype.pageCount = function () { return this._pageStack.size(); };
        PageNavigator.prototype.topPage = function () {
            if (this._pageStack.size() == 0)
                return this._initialPage;
            return this._pageStack.peek();
        };
        return PageNavigator;
    }());
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
            app.setAppId(appid);
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
            if (appId == null)
                return null;
            return Application._apps[appId].application;
        };
        Application.GetInvalidationManager = function (appId) {
            var app = Application.GetApplication(appId);
            if (app)
                return app.invalidationManager();
            return null;
        };
        return Application;
    }());
    Application._apps = {};
    $avna.Application = Application;
})($avna || ($avna = {}));
//# sourceMappingURL=savna.core.js.map
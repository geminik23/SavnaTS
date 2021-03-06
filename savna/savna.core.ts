﻿namespace $avna {
	//
	/* base classes */
	//



	export enum AppErrorType {
		NullCanvasId,
		NotFoundCanvas,
		AlreadyInitializedCanvasId
	}

	export class AppError {
		constructor(private errType: AppErrorType) { }
		get errorType(): AppErrorType { return this.errType; }
	}


	// Stack
	interface IStack<T> {
		hasElement(): boolean;
		pop(): T;
		push(element: T): void;
		peek(): T;
		size(): number;
	}

	class Stack<T> implements IStack<T>{
		private _data: Array<T> = new Array<T>();

		hasElement(): boolean {
			return this._data.length != 0;
		}

		size(): number { return this._data.length; }

		pop(): T {
			if (!this.hasElement()) return null;
			let t = this._data[this._data.length - 1];
			this._data = this._data.slice(0, this._data.length - 1);
			return t;
		}

		push(element: T) {
			this._data.push(element);
		}

		peek(): T {
			if (!this.hasElement()) return null;
			return this._data[this._data.length - 1];
		}
	}

	// Linked List
	export interface IForEach<T> {
		(item: T): void;
	}

	export interface LinkedListNode<T> {
		element: T;
		next: LinkedListNode<T>;
	}

	export interface ILinkedList<T> {
		begin(): LinkedListNode<T>;
		end(): LinkedListNode<T>;
		clear(): void;
		pushBack(element: T);
		pushFront(element: T);
		popFront(): T;
		popBack(): T;
		insert(element: T, index: number): boolean;
		indexOf(element: T): number;
		contains(element: T): boolean;
		remove(element: T): boolean;
		removeAt(index: number): T;
		elementAt(index: number): T;
		size(): number;
		foreach(each: IForEach<T>): void;
	}

	export class LinkedList<T> implements ILinkedList<T>{
		private _beginNode: LinkedListNode<T> = null;
		private _endNode: LinkedListNode<T> = null;
		private _length: number = 0;

		constructor() { }

		begin(): LinkedListNode<T> { return this._beginNode; }

		end(): LinkedListNode<T> { return this._endNode; }

		clear(): void {
			this._beginNode = null;
			this._endNode = null;
			this._length = 0;
		}

		pushBack(ele: T) {
			const node = { element: ele, next: null };
			if (this._length == 0) {
				this._beginNode = node;
				this._endNode = node;
			} else {
				this._endNode.next = node;
				this._endNode = node;
			}
			this._length++;
		}

		pushFront(ele: T) {
			const node = { element: ele, next: null };
			if (this._length == 0) {
				this._beginNode = node;
				this._endNode = node;
			} else {
				node.next = this._beginNode;
				this._beginNode = node;
			}
			this._length++;
		}

		popFront(): T {
			let result: T = null;
			if (this._length == 0) return result;

			result = this._beginNode.element;
			this._beginNode = this._beginNode.next;

			this._length--;
			return result;

		}

		popBack(): T {
			let result: T = null;
			if (this._length == 0) return result;
			if (this._length == 1) {
				result = this._beginNode.element;
				this.clear();
				return result;
			}
			let t = this.nodeAt(this._length - 2);
			result = t.next.element;
			this._endNode = t;
			t.next = null;

			this._length--;
			return result;
		}

		insert(ele: T, index: number): boolean {
			const node = { element: ele, next: null };
			if (index == 0) {
				node.next = this._beginNode.next;
				this._beginNode = node;
				this._length++;
				return true;
			}
			if (index == this._length) {
				this.pushBack(ele); return true;
			}
			let pnode = this.nodeAt(index - 1);

			if (pnode == null) return false;
			node.next = pnode.next;
			pnode.next = node;
			this._length++;
			return true;
		}

		private nodeAt(index: number): LinkedListNode<T> {
			if (index < 0 || index >= this._length) return null;
			if (index == this._length - 1) return this._endNode;
			let cur = this._beginNode;
			for (let i = 0; i < index; i++) {
				cur = cur.next;
			}
			return cur;
		}

		indexOf(ele: T): number {
			let cur = this._beginNode;
			let idx = 0;
			while (cur != null) {
				if (cur.element === ele) return idx;
				idx++;
				cur = cur.next;
			}
			return -1;
		}

		contains(element: T): boolean {
			return this.indexOf(element) != -1;
		}

		remove(element: T): boolean {
			let idx = this.indexOf(element);
			if (idx == -1) return false;
			this.removeAt(idx);
			return true;
		}

		removeAt(index: number): T {
			if (index < 0 || index >= this._length) return null;
			if (index == this._length - 1) return this.popBack();
			if (index == 0) return this.popFront();
			let t = this.nodeAt(index - 1);
			let ele = t.element;
			t.next = t.next.next;
			this._length--;
			return ele;
		}

		elementAt(index: number): T {
			let n = this.nodeAt(index);
			return (n == null) ? null : n.element;
		}

		size(): number { return this._length; }

		foreach(each: IForEach<T>): void {
			let cur = this._beginNode;
			while (cur) {
				each(cur.element);
				cur = cur.next;
			}
		}
	}

	// PriorityQueue
	class PriorityItem<T> {
		private _items: LinkedList<T> = new LinkedList<T>();

		get itemList(): LinkedList<T> { return this._items; }
		get length(): number { return this._items.size(); }

		private contains(item: T): boolean {
			return this._items.contains(item);
		}

		removeItem(item: T) {
			this._items.remove(item);
		}

		addItem(item: T) {
			this._items.pushBack(item);
		}
	}

	type NumberKeyMap<T> = { [key: number]: T };
	type PriorityQueueContainer<T> = NumberKeyMap<PriorityItem<T>>;


	export interface IPriorityQueue<T> {
		getMaxPriority(): number;
		getMinPriority(): number;
		push(element: T, priority: number): void;
		popMaxPriorityItem(): T;
		popMinPriorityItem(): T;
		isEmpty(): boolean;
		toArray(): Array<T>;
		toString(): string;
	}


	//!!!! this priorityQueue method occur overhead if you use big | priority number |
	export class PriorityQueue<T> implements IPriorityQueue<T>{
		private _queue: PriorityQueueContainer<T>;
		private _maxPriority: number;
		private _minPriority: number;

		constructor() {
			this._queue = {};
			this._maxPriority = -1;
			this._minPriority = 0;
		}

		getMaxPriority(): number { return this._maxPriority; }
		getMinPriority(): number { return this._minPriority; }

		push(element: T, priority: number): void {
			if (this._minPriority > this._maxPriority) {
				this._minPriority = priority;
				this._maxPriority = priority;
			}
			if (this._minPriority > priority)
				this._minPriority = priority;
			if (this._maxPriority < priority)
				this._maxPriority = priority;
			let items = this._queue[priority];
			if (!items) {
				items = new PriorityItem<T>();
				this._queue[priority] = items;
			}
			items.addItem(element);
		}

		isEmpty(): boolean { return this._minPriority > this._maxPriority; }

		popMaxPriorityItem(): T {
			let item: T = null;
			if (this._minPriority <= this._maxPriority) {
				let items = this.updateMaxPriority();
				if (items)
					item = items.itemList.popFront();
				this.updateMaxPriority();
			}
			this.refresh();
			return item;
		}

		popMinPriorityItem(): T {
			let item: T = null;
			let items: PriorityItem<T> = null;
			if (this._minPriority <= this._maxPriority) {
				let items = this.updateMinPriority();
				if (items)
					item = items.itemList.popFront();
				this.updateMinPriority();
			}
			this.refresh();
			return item;
		}

		private updateMaxPriority(): PriorityItem<T> {
			let cur = this._queue[this._maxPriority];

			while (!cur || cur.length == 0) {
				this._maxPriority -= 1;
				if (this._maxPriority < this._minPriority) {
					return null;
				}
				cur = this._queue[this._maxPriority];
			}
			return cur;
		}

		private updateMinPriority(): PriorityItem<T> {
			let cur = this._queue[this._minPriority];

			while (!cur || cur.length == 0) {
				this._minPriority += 1;
				if (this._maxPriority < this._minPriority) {
					return null;
				}
				cur = this._queue[this._minPriority];
			}
			return cur;
		}

		private refresh() {
			if (this.isEmpty()) {
				this._maxPriority = -1;
				this._minPriority = 0;
			}
		}


		toArray(): Array<T> {
			let t: T = null;
			let arr: Array<T> = [];
			let max = this._maxPriority;

			let cur: LinkedListNode<T>;

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
		}

		toString(): string {
			return this.toArray().toString();
		}

	}



	// Unique Id generator
	class UniqueId {
		private static _id: number = 0;
		static GetId(): number {
			return UniqueId._id++;
		}
	}

	//Timer
	export interface IManualTimer {
		reset(): void;
		lap(): number;
		sinceLastLap(): number;
	}

	export class ManualTimer implements IManualTimer {
		private _timer: number = 0;
		private _lastLap: number = 0;

		reset(): void { this._lastLap = this._timer = Date.now(); }
		lap(): number {
			this._lastLap = Date.now();
			return this._lastLap - this._timer;
		}
		sinceLastLap(): number {
			return Date.now() - this._lastLap;
		}
	}



	//Interval Checker
	export interface IIntervalChecker {
		start(): void;
		stop(): void;
		reset(): void;
		checkTick(): boolean;
		setInterval(interval_ms: number): void;
		interval(): number;
	}

	export class IntervalChecker implements IIntervalChecker {
		private _lastTime: number;
		private _started: boolean = false;
		private _interval: number = 10;

		start(): void {
			this._started = true;
			this._lastTime = Date.now();
		}

		stop(): void {
			this._started = false;
		}

		reset(): void {
			this._lastTime = Date.now();
		}

		checkTick(): boolean {
			if (!this._started) false;
			let now = Date.now();
			let term = now - this._lastTime - this._interval;

			if (term >= 0) {
				this._lastTime = now - (term % this._interval);
				return true;
			}
			return false;
		}
		setInterval(interval_ms: number): void {
			this._interval = interval_ms;
		}

		interval(): number {
			return this._interval;
		}
	}


	// LoopEngine
	export enum LoopType {
		Stopped = 0, WindowFrames, Interval
	}


	export interface ILoopEngine {
		setCallback(cb: (engine: ILoopEngine) => void): void;
		currentState(): LoopType;
		isNowLooping(): boolean;
		loop(type: LoopType, interval: number): void;
		stop(): void;
		tick(): void;
		intervalChecker(): IIntervalChecker;
	}


	export class LoopEngine implements ILoopEngine {
		private _callback: (arg: any) => void; // callback

		private _loop_windowFrame: FrameRequestCallback;
		private _handle_interval: number;

		private _intervalChecker: IntervalChecker = new IntervalChecker();
		private _currentState: LoopType = LoopType.Stopped;

		constructor() {
			this._loop_windowFrame = (time: number) => {
				if (this._intervalChecker.checkTick()) {
					this.tick();
				}
				if (this._currentState == LoopType.WindowFrames) window.requestAnimationFrame(this._loop_windowFrame);
			};
		}

		setCallback(cb: (engine: ILoopEngine) => void): void { this._callback = cb; }
		isNowLooping(): boolean { return this._currentState != LoopType.Stopped; }
		currentState(): LoopType { return this._currentState; }
		stop(): void {
			if (this._currentState == LoopType.Interval) clearInterval(this._handle_interval);
			this._currentState = LoopType.Stopped;
		}
		tick(): void {
			if (this._callback) this._callback(this);
		}

		loop(type: LoopType, interval: number = this._intervalChecker.interval()): void {
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
		}

		intervalChecker(): IIntervalChecker { return this._intervalChecker; }

		private loopWindowFrame() {
			this._intervalChecker.reset();
			this._loop_windowFrame(0);
		}

		private loopInterval() {
			this._handle_interval = setInterval(() => { this.tick(); }, this._intervalChecker.interval());
		}


	}


	//Event Emitter
	export interface EventCallback {
		(...args: any[]): void;
	}
	export interface IEventEmitter {
		on(type: string, listener: EventCallback): void;
		emit(type: string, ...args: any[]): void;
		emitAsync(type: string, ...args: any[]): void;
	}

	export class EventEmitter implements IEventEmitter {
		private _events: any = {};


		on(type: string, listener: EventCallback) {
			if (!this._events[type]) {
				this._events[type] = [listener];
			} else {
				(this._events[type] as EventCallback[]).push(listener);
			}
		}

		emit(type: string, ...args: any[]) {
			this.commonEmit(type, false, args);
		}

		emitAsync(type: string, ...args: any[]) {
			this.commonEmit(type, true, args);
		}

		private commonEmit(type: string, isAsync: boolean, ...args: any[]) {
			var _n_event = "on" + type;
			var evt = this._events[type] as EventCallback[];
			if ((this as any)[_n_event] && (typeof ((this as any)[_n_event]) === "function"))
				this.fire(this[_n_event], isAsync, args);

			if (evt) {
				for (var i = 0; i < evt.length; i++) this.fire(evt[i], isAsync, args);
			}
		}

		private fire(event: EventCallback, isAsync: boolean, ...args: any[]) {
			if (isAsync) setTimeout(() => { event.apply(this, args); }, 0);
			else event.apply(this, args);
		}
	}





	// TaskHandler
	export interface Task {
		(): void;
	}

	export interface ITaskHandler {
		pushTask(task: Task): void;
		clearTasks(): void;
		processTasks(): void;
		processTasksAsync(): void;
		processEachTaskAsync(): void;
	}

	export class TaskHanlder implements ITaskHandler {
		private _tasks: Task[] = [];

		pushTask(task: Task): void { this._tasks.push(task); }
		clearTasks(): void { this._tasks = []; }

		processTasks(): void {
			let tasks = this.getTasksNClear();
			if (tasks == null) return;
			tasks.forEach((t: Task, i: number, arr: Task[]) => { t(); });
		}

		processTasksAsync(): void {
			let tasks = this.getTasksNClear();
			if (tasks == null) return;
			setTimeout(() => {
				tasks.forEach((t: Task, i: number, arr: Task[]) => { t(); });
			}, 0);
		}

		processEachTaskAsync(): void {
			let tasks = this.getTasksNClear();
			if (tasks == null) return;
			tasks.forEach((t: Task, i: number, arr: Task[]) => {
				setTimeout(() => { t(); }, 0);
			});
		}

		private getTasksNClear(): Task[] {
			let temp = (this._tasks.length == 0) ? null : this._tasks;
			this.clearTasks();
			return temp;
		}
	}


	//
	// Exported Interfaces
	//
	export interface IClonable<T> {
		clone(): T;
	}





	//
	/* */
	//
	export interface Size {
		width: number;
		height: number;
	}

	export class Point implements IClonable<Point>{
		constructor(public x: number = 0, public y: number = 0) { }
		clone() { return new Point(this.x, this.y); }
	}

	//export class Size implements IClonable<Size>{
	//	constructor(public width: number = 0, public height: number = 0) { }
	//	clone() { return new Size(this.width, this.height); }
	//}

	export class Rect implements IClonable<Rect>{
		constructor(public x: number = 0, public y: number = 0, public width: number = 0, public height: number = 0) { }
		clone() { return new Rect(this.x, this.y, this.width, this.height); }
	}

	export class Color implements IClonable<Color>{
		constructor(public r: number = 0, public g: number = 0, public b: number = 0, public a: number = 0) { }
		set(r, g, b, a) {
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a;
		}
		toString() {
			return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
		}
		clone() {
			return new Color(this.r, this.g, this.b, this.a);
		}
	}


	export class Graphics {
		private _stepTime: number = 0;
		constructor(private ctx: CanvasRenderingContext2D, private rect: Rect) { }
		get context() { return this.ctx; }
		get boundRect() { return this.rect; }
		get stepTime() { return this._stepTime; }
		set stepTime(time: number) { this._stepTime = time; }
	}


























	//
	/* ErrorExceptions */
	//
	export interface IError {
		getErrorMessage(): string;
	}
	export class BaseError implements IError {
		private _errorMsg: string;
		constructor(msg: string) { this._errorMsg = msg; }
		getErrorMessage(): string { return this._errorMsg; }
	}

	export class ArgumentError extends BaseError {

	}


	//
	/* UserInterface */
	//
	export namespace ui {


		export namespace layout {
			export interface ILayout {
				setTarget(obj: any): void;
				getTarget(): any;
			}
		}

		export namespace core {
			enum InvalidateType {
				All,
				Size,
				Position,
				State
			}


			export interface IInvalidate { // this is for InvalidationCenter //TODO
				invalidateState(): void;
				invalidateLayout(): void;
				validateState(): void;
				validateLayout(): void;
			}

			export interface IVisualComponent {
				measureRequest(availableSize: Size): Size;
				renderingRequest(g: Graphics): void;
			}

			export abstract class VisualComponent extends EventEmitter implements IVisualComponent, IInvalidate {
				static DepthLevel(obj: any): number {
					if (obj instanceof VisualComponent) return (obj as VisualComponent).depthLevel;
					return -1;
				}

				private _x: number;
				private _y: number;
				protected scaleX: number;
				protected scaleY: number;
				protected stage: Page;
				protected parent: VisualComponent;
				protected appId: string = null;
				private _depthLevel: number = 0;

				get x(): number { return this._x; }
				set x(nx: number) { this._x = nx; }
				get y(): number { return this._y; }
				set y(ny: number) { this._y = ny; }

				get depthLevel(): number { return this._depthLevel; }
				get currentAppId(): string { return this.appId; }
				get currentApplication(): IApplication { return Application.GetApplication(this.appId); }

				setParent(parent: VisualComponent): void {
					this.parent = parent;

					if (parent != null) {
						this._depthLevel = parent.depthLevel + 1;
						this.appId = parent.currentAppId;
					}
				}


				measureRequest(availableSize: Size): Size {
					let s = this.measureOverride(availableSize);
					if (s != null) return s;
					return this.internalMeasure(availableSize);
				}
				protected measureOverride(available: Size): Size { return null; }
				protected internalMeasure(available: Size): Size { return available; }

				renderingRequest(g: Graphics): void {
					if (this.drawOverride(g)) return;
					this.internalDraw(g);
				}
				protected internalDraw(g: Graphics): void { }
				protected drawOverride(g: Graphics): boolean { return false; }


				abstract invalidateState(): void;
				abstract invalidateLayout(): void;
				abstract validateState(): void;
				abstract validateLayout(): void;

			}



			export interface IContainer extends IVisualComponent {
				addChild(child: VisualComponent): VisualComponent;
				addChildAt(child: VisualComponent, index: number): VisualComponent;
				childAt(idx: number): VisualComponent;
				numOfChildren(): number;
				removeChild(child: VisualComponent): VisualComponent;
				removeChildAt(idx: number): VisualComponent;
				getLayout(): ui.layout.ILayout;
				setLayout(layout: ui.layout.ILayout): void;
				getContentWidth(): number;
				getContentHeight(): number;
				moveToFront(child: VisualComponent): void;
				moveToBack(child: VisualComponent): void;
			}

			export interface IPage extends IContainer {
				initializeUI(): void;
				setNavigator(navigator: IPageNavigator): void;
				setAppId(appid: string): void;
				navigated(arg: any): void;
			}

			export interface IPageNavigator {
				initialPage(pageType: any): void;
				navigate(pageType: any, argumnet: any): void;
				hasPage(): boolean;
				hasInitialPage(): boolean;
				canGoBack(): boolean;
				goBack(): void;
				pageCount(): number;
				topPage(): ui.core.IPage;
				setAppId(appid: string): void;
			}



			export class UIComponent extends VisualComponent {
				private _enabled: boolean;
				private _width: number;
				private _height: number;
				protected startWidth: number;
				protected startHeight: number;
				private _minWidth: number = 0;
				private _minHeight: number = 0;


				private _includeInLayout: boolean = true;

				private _explicitWidth: number;
				private _explicitHeight: number;

				protected layoutInvalid: Boolean = false;
				protected stateInvalid: Boolean = false;
				protected sizeChanged: Boolean;

				constructor() { super(); this.init(); }

				protected init() { }

				/* BEGIN ::interface:: IInvalidate*/
				invalidateState(): void {
					if (!this.stateInvalid && this.parent != null) {
						this.stateInvalid = true;
						this.currentApplication.invalidationManager().invalidState(this, this.depthLevel);
					}
				}
				invalidateLayout(): void {
					if (!this.layoutInvalid && this.parent != null) {
						this.layoutInvalid = true;
						this.currentApplication.invalidationManager().invalidLayout(this, this.depthLevel);
					}
				}
				validateState(): void {
					if (this.stateInvalid) {
						this.commitState();
						this.stateInvalid = false;
					}
				}
				validateLayout(): void {
					if (this.layoutInvalid) {
						this.updateLayout(this._width, this._height);
						this.layoutInvalid = false;
					}
				}

				protected commitState(): void {/* will implement in subclass */ }

				protected updateLayout(w: number, h: number): void {/* will implement in subclass */ }

				/* END ::interface:: IInvalidate */



				get minWidth(): number { return this._minWidth; }
				set minWidth(width: number) {
					if (this._minWidth != width) {
						this._minWidth = width;
						this.notifyLayoutInfoChangedToParents();
					}
					return;
				}

				get minHeight(): number { return this._minHeight; }
				set minHeight(height: number) {
					if (this._minHeight != height) {
						this._minHeight = height;
						this.notifyLayoutInfoChangedToParents();
					}
					return;
				}

				get enabled(): boolean {
					return this._enabled;
				}

				set enabled(enable: boolean) {
					if (enable == this._enabled) {
						return;
					}
					this._enabled = enable;
					this.stateInvalid = true;
					this.invalidateState();
				}


				setPosition(x: number, y: number): void {
					this.x = x;
					this.y = y;
					return;
				}

				setActualSize(width: number, height: number): void {
					if (this._width != width) {
						this._width = height;
						this.sizeChanged = true;
					}
					if (this._height != height) {
						this._height = height;
						this.sizeChanged = true;
					}
					if (this.sizeChanged) {
						this.invalidateState();
						this.invalidateLayout();
					}
				}


				childChanged(child: VisualComponent = null): boolean { return true; }

				protected notifyLayoutInfoChangedToParents(): void {
					if (!this.parent) return;
					let cur: UIComponent = this;
					let p: UIComponent = null;
					while (cur) {
						p = (cur.parent as UIComponent);
						if (p && !p.childChanged(cur)) break;
						cur = p;
					}
				}

				//protected notifyToParentLayoutChanged(): void {
				//	if (!this.parent) return;
				//	let p = this.parent as UIComponent;
				//	if (p && p.childChanged(null)) p.notifyLayoutInfoChangedToParents();
				//}

				protected flushCache(): void { return; }

				getWidth(): number { return this._width; }
				setWidth(w: number) {
					if (this._explicitWidth != w) {
						this._explicitWidth = w;
					}
					if (this._width != w) {
						this._width = w;
						this.sizeChanged = true;
						this.invalidateLayout();
					}
				}
				getHeight(): number { return this._height; }
				setHeight(h: number) {
					if (this._explicitHeight != h) {
						this._explicitHeight = h;
					}
					if (this._height != h) {
						this._height = h;
						this.sizeChanged = true;
						this.invalidateLayout();
					}
				}

				get explicitWidth(): number { return this._explicitWidth; }
				get explicitHeight(): number { return this._explicitHeight; }
				get scaleX(): number { return this._width / this.startWidth; }
				set scaleX(sx: number) { this._width = this.startWidth * sx; }
				get scaleY(): number { return this._height / this.startHeight; }
				set scaleY(sy: number) { this._height = this.startHeight * sy; }
				get includeInLayout(): boolean { return this._includeInLayout; }

				set includeInLayout(i: boolean) {
					if (i != this._includeInLayout) {
						this._includeInLayout = i;
						// parentStructuralChange();
					}
				}
			}



			export class Container extends UIComponent implements IContainer {
				private _childContainer: LinkedList<VisualComponent> = new LinkedList<VisualComponent>();
				private _layout: ui.layout.ILayout;
				private _updateLayout: boolean;


				protected setAppId(appid: string) {
					this.appId = appid;
					this._childContainer.foreach((ele: VisualComponent) => {
						ele.setParent(this);
					});
				}

				addChild(child: VisualComponent): VisualComponent { this._childContainer.pushBack(child); child.setParent(this); this.structureChange(); return child; }
				addChildAt(child: VisualComponent, index: number): VisualComponent { this._childContainer.insert(child, index); child.setParent(this); this.structureChange(); return child; }
				childAt(idx: number): VisualComponent { return this._childContainer.elementAt(idx); }
				numOfChildren(): number { return this._childContainer.size(); }
				removeChild(child: VisualComponent): VisualComponent {
					let r = this._childContainer.remove(child);
					if (r) {
						child.setParent(null);
						this.structureChange();
					}
					return child;
				}
				removeChildAt(idx: number): VisualComponent {
					let r = this._childContainer.removeAt(idx);
					if (r != null) {
						r.setParent(null);
						this.structureChange();
					}
					return r;
				}

				moveToFront(child: VisualComponent): void {
					if (this._childContainer.remove(child)) {
						this._childContainer.pushFront(child);
					}
				}
				moveToBack(child: VisualComponent): void {
					if (this._childContainer.remove(child)) {
						this._childContainer.pushBack(child);
					}
				}

				getLayout(): ui.layout.ILayout { return this._layout; }
				setLayout(layout: ui.layout.ILayout): void {
					if (layout == null) { throw new ArgumentError("layout is null"); }
					if (this._layout != layout) {
						this._layout = layout;
						this._layout.setTarget(this);
						this.structureChange();
					}
				}

				//it's real children's bound size
				getContentWidth(): number {
					return 0;//TODO
				}

				getContentHeight(): number {
					return 0;//TODO
				}

				/* overrides */
				setHeight(h: number): void {
					if (this.getHeight() != h) this._updateLayout = true;
					super.setHeight(h);
					this.boundChanged();
				}
				setWidth(w: number): void {
					if (this.getWidth() != w) this._updateLayout = true;
					super.setWidth(w);
					this.boundChanged();
				}

				setActualSize(w: number, h: number): void {
					if (w != this.getWidth() || h != this.getHeight()) {
						this._updateLayout = true;
					}
					super.setActualSize(w, h);
					this.boundChanged();
				}


				/* private methods */
				private boundChanged(): void {
					//TODO
				}

				private structureChange(): void {
					//TODO
				}


				protected internalMeasure(available: Size): Size {
					//TODO
					let p = this._childContainer.begin();
					while (p != null) {
						//TODO update bound

						p.element.measureRequest(available);
						p = p.next;
					}
					return available;
				}


				protected internalDraw(g: Graphics): void {
					//TODO
					let p = this._childContainer.begin();
					let ctx = g.context;
					while (p != null) {
						//TODO update bound
						ctx.save();
						ctx.translate(p.element.x, p.element.y);
						p.element.renderingRequest(g);
						ctx.restore();
						p = p.next;
					}
				}

			}

			export class StyleComponent extends UIComponent {

			}






			export class Page extends Container implements IPage {
				protected navigator: IPageNavigator = null;

				constructor() {
					super();
					this.initializeUI();
				}

				setAppId(id: string): void {
					super.setAppId(id);
				}

				initializeUI(): void { }

				setNavigator(navi: IPageNavigator): void {
					this.navigator = navi;
				}

				navigated(arg: any): void { }
			}

		}

	}
































	//
	/* event classes */
	//
	export enum UserPointType {
		MouseDown, MouseMove, MouseUp, MouseOver, MouseOut,
		TouchStart, TouchMove, TouchEnd, TouchCancel
	}

	export class UserMouseEventArg {
		constructor(public type: UserPointType, public x: number, public y: number, public handle: any = null) { }
		toString(): string { return "[type:" + UserPointType[this.type as number] + "] x:" + this.x + ", y:" + this.y; }
	}

	function CreateMouseEventArg(type: UserPointType, x: number, y: number, canvas: HTMLCanvasElement) {
		var br = canvas.getBoundingClientRect();
		return new UserMouseEventArg(type, x * canvas.width / br.width, y * canvas.height / br.height);
	}








	//
	/* InvalidationManager */
	//
	export interface IInvalidationManager {
		doFrame(): boolean;

		invalidLayout(ele: ui.core.IInvalidate, priority: number): void;
		invalidState(ele: ui.core.IInvalidate, priority: number): void;
		validateLayout(): void;
		validateState(): void;
	}

	class InvalidationManager implements IInvalidationManager {
		private _stateQueue: PriorityQueue<ui.core.VisualComponent>;
		private _viewQueue: PriorityQueue<ui.core.VisualComponent>;
		private _validating: boolean;
		private _appid: string;


		doFrame(): boolean {
			return this.doValidation();
		}

		private doValidation(): boolean {
			this._validating = true;
			let validated = !this._stateQueue.isEmpty() || !this._viewQueue.isEmpty();
			if (validated) {
				this.validateState();
				this.validateLayout();
			}

			this._validating = false;
			return validated;
		}

		invalidLayout(ele: ui.core.IInvalidate, priority: number): void {
			this._viewQueue.push(ele as ui.core.UIComponent, priority);
		}
		invalidState(ele: ui.core.IInvalidate, priority: number): void {
			this._stateQueue.push(ele as ui.core.UIComponent, priority);
		}

		validateLayout(): void {
			let item: ui.core.VisualComponent = null;
			while ((item = this._viewQueue.popMaxPriorityItem()) != null) {
				item.validateLayout();
			}
		}

		validateState(): void {
			let item: ui.core.VisualComponent = null;
			while ((item = this._viewQueue.popMaxPriorityItem()) != null) {
				item.validateState();
			}
		}

	}


	//
	/* application */
	//
	class CanvasApp {
		constructor(public canvasId: string, public application: IApplication) { }
	}

	type CanvasAppMap = { [key: string]: CanvasApp }; // [appid : CanvasApp]

	export interface IApplication extends IEventEmitter {
		start(): void;
		mouseHandler(arg: UserMouseEventArg): void;
		isInitialized(): boolean;
		setSize(width: number, height: number): void;
		setLoopInterval(interval: number): void;
		getLoopInterval(): number;
		setAnimating(animate: boolean): void;
		getAnimating(): boolean;
		setInitialPage(typeOfStage: any): void;
		invalidationManager(): IInvalidationManager;
	}

	export interface ApplicationIntializedCallback {
		(err: AppError, app: IApplication): void;
	}

	// Internal Applications
	class ImpleApplication extends EventEmitter implements IApplication {
		private _initialized: boolean = false;
		private _canvasId: string = null;
		private _graphics: Graphics;
		private _taskHandlers: TaskHanlder = new TaskHanlder();
		private _loopEngine: LoopEngine = new LoopEngine();
		private _appid: string;
		private _invalidationManager: IInvalidationManager = new InvalidationManager();


		/* states */
		private _looping: boolean = false;
		private _step_timer: ManualTimer = new ManualTimer();

		/* contents*/
		private _navigator: ui.core.IPageNavigator = new PageNavigator();


		//
		/* no interface member */
		//
		setAppId(appid: string) { this._appid = appid; this._navigator.setAppId(this._appid); }
		setCanvasId(id: string): void { this._canvasId = id; }
		initialize(appcb: ApplicationIntializedCallback): void {
			if (this._canvasId == null) { appcb(new AppError(AppErrorType.NullCanvasId), null); return; }
			this._initialized = true;

			// init
			this._loopEngine.setCallback(this.internalLoop.bind(this));

			let init = () => {
				let canvas = document.getElementById(this._canvasId) as HTMLCanvasElement;
				if (canvas == null) { appcb(new AppError(AppErrorType.NotFoundCanvas), null); return; }

				// init graphics
				this._graphics = new Graphics(canvas.getContext("2d"), new Rect());

				// mouse event
				canvas.addEventListener("mousedown", (e: Event) => {
					this.mouseHandler(CreateMouseEventArg(UserPointType.MouseDown, (e as MouseEvent).clientX, (e as MouseEvent).clientY, canvas));
				});
				canvas.addEventListener("mousemove", (e: Event) => {
					this.mouseHandler(CreateMouseEventArg(UserPointType.MouseMove, (e as MouseEvent).clientX, (e as MouseEvent).clientY, canvas));
				});
				canvas.addEventListener("mouseup", (e: Event) => {
					this.mouseHandler(CreateMouseEventArg(UserPointType.MouseUp, (e as MouseEvent).clientX, (e as MouseEvent).clientY, canvas));
				});
				canvas.addEventListener("mouseover", (e: Event) => {
					this.mouseHandler(CreateMouseEventArg(UserPointType.MouseOver, (e as MouseEvent).clientX, (e as MouseEvent).clientY, canvas));
				});
				canvas.addEventListener("mouseout", (e: Event) => {
					this.mouseHandler(CreateMouseEventArg(UserPointType.MouseOut, (e as MouseEvent).clientX, (e as MouseEvent).clientY, canvas));
				});

				appcb(null, this);
			};

			if (document.readyState === "complete" || document.readyState === "loaded") init();
			else document.addEventListener('DOMContentLoaded', init);
		}

		private internalLoop(loop: ILoopEngine) {
			// process tasks
			this._taskHandlers.processTasks();

			// check redraw and draw
			if (this._looping || this._invalidationManager.doFrame()) {
				this._graphics.stepTime = this._step_timer.sinceLastLap();
				this._step_timer.lap();


				// draw content
				let p = this._navigator.topPage();
				if (p != null) {
					this._graphics.boundRect.x = this._graphics.boundRect.y = 0;
					this._graphics.boundRect.width = this._graphics.context.canvas.width;
					this._graphics.boundRect.height = this._graphics.context.canvas.height;

					p.renderingRequest(this._graphics);
				}
			}
		}

		//
		/* IApplication interface*/
		//
		isInitialized(): boolean { return this._initialized; }

		start(): void {
			this._step_timer.reset();
			// looping render
			this._loopEngine.loop(LoopType.WindowFrames);
		}

		mouseHandler(arg: UserMouseEventArg): void {
			//TODO
			//console.log(arg.toString());
		}

		setAnimating(animate: boolean): void { this._looping = animate; }

		getAnimating(): boolean { return this._looping; }

		setLoopInterval(interval: number): void {
			this._loopEngine.intervalChecker().setInterval(interval);
		}

		getLoopInterval(): number {
			return this._loopEngine.intervalChecker().interval();
		}

		setSize(width: number, height: number): void {
			//let c = this._content; // may be PageNavigator
			this._taskHandlers.pushTask(() => {
				this._graphics.context.canvas.width = width;
				this._graphics.context.canvas.height = height;
				//TODO layout ???may be PageNavigator
			});
			this.invalidateSize();
		}

		setInitialPage(typeOfPage: any): void {
			this._navigator.initialPage(typeOfPage);
		}


		invalidationManager(): IInvalidationManager { return this._invalidationManager; }

		private invalidateSize() {
			let topPage = (this._navigator.topPage() as any);
			if (topPage) (topPage as ui.core.IInvalidate).invalidateLayout();
		}
	}



	class PageNavigator implements ui.core.IPageNavigator {
		private _initialPage: ui.core.IPage = null;
		private _pageStack: IStack<ui.core.IPage> = new Stack<ui.core.IPage>();
		private _appid: string = null;


		setAppId(appid: string): void {
			this._appid = appid;
		}

		initialPage(pageType: any): void {
			let newPage = new pageType();
			if (!(newPage instanceof ui.core.Page)) throw new ArgumentError("argument is not instance of Page");
			let ipage: ui.core.IPage = newPage as ui.core.IPage;

			this._initialPage = newPage as ui.core.IPage;
			ipage.setNavigator(this);
			ipage.setAppId(this._appid);
			this._initialPage.navigated(null);
		}

		navigate(pageType: any, argument: any): void {
			let newPage = new pageType();
			if (!(newPage instanceof ui.core.Page)) throw new ArgumentError("argument is not instance of Page");
			let ipage: ui.core.IPage = newPage as ui.core.IPage;

			ipage.setNavigator(this);
			ipage.setAppId(this._appid);
			this._pageStack.push(ipage);
			this._pageStack.peek().navigated(argument);
		}

		hasPage(): boolean { return this._pageStack.size() != 0; }
		hasInitialPage(): boolean { return this._initialPage != null; }
		canGoBack(): boolean {
			if (this._pageStack.size() > 1) return true;
			if (this._pageStack.size() == 1 && this._initialPage != null) {
				return true;
			}
			return false;
		}
		goBack(): void {
			let s = this._pageStack.size();
			if (s > 1 || (s == 1 && this._initialPage != null)) {
				this._pageStack.pop();
			}
		}

		pageCount(): number { return this._pageStack.size(); }
		topPage(): ui.core.IPage {
			if (this._pageStack.size() == 0)
				return this._initialPage;
			return this._pageStack.peek();
		}
	}


	export class Application {
		private static _apps: CanvasAppMap = {};

		static Initialize(canvasId: string, appcb: ApplicationIntializedCallback): string {
			// check already has canvasid
			let appid: string = null;
			if ((appid = Application.GetAppId(canvasId)) != null) {
				appcb(new AppError(AppErrorType.AlreadyInitializedCanvasId), null);
				return appid;
			}

			let app = new ImpleApplication();
			let canvasApp = new CanvasApp(canvasId, app);
			appid = "appid" + UniqueId.GetId();

			Application._apps[appid] = canvasApp;

			app.setCanvasId(canvasId);
			app.setAppId(appid);
			app.initialize(appcb);

			return appid;
		}

		static GetAppId(canvasId: string): string {
			for (let key in Application._apps) {
				if (Application._apps[key].canvasId == canvasId)
					return key;
			}
			return null;
		}

		static GetApplication(appId: string): IApplication {
			if (appId == null) return null;
			return Application._apps[appId].application;
		}


		static GetInvalidationManager(appId: string): IInvalidationManager {
			let app = Application.GetApplication(appId);
			if (app) return app.invalidationManager();
			return null;
		}

	}

}

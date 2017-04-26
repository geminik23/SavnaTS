namespace $avna {

	//
	/* base classes */
	//
	class UniqueId {
		private static _id: number = 0;
		static GetId(): number {
			return UniqueId._id++;
		}
	}

	// Loop Engine
	enum LoopType {
		Stopped = 0, WindowFrames, Interval
	}


	interface ILoopEngine {
		setCallback(cb: (engine: ILoopEngine) => void): void;
		currentState(): LoopType;
		isNowLooping(): boolean;
		loop(type: LoopType, interval: number): void;
		stop(): void;
		tick(): void;
	}


	class LoopEngine implements ILoopEngine {
		private _currentState: LoopType = LoopType.Stopped;
		private _interval_ms = 10;

		private _callback: (arg: any) => void;

		private _loop_windowFrame: FrameRequestCallback;
		private _handle_interval: number;

		private __last_time: number = 0;


		constructor() {
			this._loop_windowFrame = (time: number) => {
				let now = Date.now();
				var term = (now - this.__last_time) - this._interval_ms;

				if ((term >= 0) && this._currentState == LoopType.WindowFrames) {
					this.__last_time = now - term;
					this.tick();
				}

				window.requestAnimationFrame(this._loop_windowFrame);
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

		loop(type: LoopType, interval: number): void {
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
		}

		private loopWindowFrame() {
			this.__last_time = Date.now();
			this._loop_windowFrame(0);
		}

		private loopInterval() {
			this._handle_interval = setInterval(() => { this.tick(); }, this._interval_ms);
		}

	}


	//Event Emitter
	export interface EventCallback {
		(...args: any[]): void;
	}

	export class EventEmitter {
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



	//Interval Checker
	export interface IIntervalChecker {
		start(): void;
		stop(): void;
		reset(): void;
		checkTick(): boolean;
		setInterval(interval_ms: number): void;
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
			let term = this._lastTime - now - this._interval;

			if (term >= 0) {
				this._lastTime = now - term;
				return true;
			}
			return false;
		}
		setInterval(interval_ms: number): void {
			this._interval = interval_ms;
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
	/* */
	//


	export class Point {
		constructor(public x: number = 0, public y: number = 0) { }
	}
	export class Size {
		constructor(public width: number = 0, public height: number = 0) { }
	}
	export class Rect {
		constructor(public x: number = 0, public y: number = 0, public width: number = 0, public height: number = 0) { }
	}

	export class Color {
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





































	//
	/* event classes */
	//
	export enum UserPointType {
		MouseDown, MouseMove, MouseUp, MouseOver, MouseOut,
		TouchStart, TouchMove, TouchEnd, TouchCancel
	}
	export class UserMouseEventArg {
		constructor(public type: UserPointType, public x: number, public y: number, public handle: any = null) { }
	}

	function CreateMouseEventArg(type: UserPointType, x: number, y: number, canvas: HTMLCanvasElement) {
		var br = canvas.getBoundingClientRect();
		return new UserMouseEventArg(type, x * canvas.width / br.width, y * canvas.height / br.height);
	}


















	//
	/* application */
	//
	class CanvasApp {
		constructor(public canvasId: string, public application: IApplication) { }
	}
	type KeyMap = { [key: string]: CanvasApp };


	export class Graphics {
		constructor(private ctx: CanvasRenderingContext2D, private rect: Rect) { }
		get context() { return this.ctx; }
		get boundRect() { return this.rect; }
	}

	export interface IApplication {
		start(): void;
		mouseHandler(arg: UserMouseEventArg): void;
		requestRedraw(): void;
		//TODO
	}


	// Internal Applications
	class ImpleApplication implements IApplication {
		private _started: boolean = false;
		private _canvasId: string = null;
		private _graphics: Graphics;
		/* no interface member */
		setCanvasId(id: string): void { this._canvasId = id; }

		/* IApplication interface*/
		start(): void {
			if (this._started) return;
			if (this._canvasId == null) return; //throw?
			this._started = true;

			let init = () => {
				let canvas = document.getElementById(this._canvasId) as HTMLCanvasElement;
				if (canvas == null) return;

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



				//TODO taskHandler -> 
				//TODO emit events

				//TODO looping render
			};

			if (document.readyState === "complete" || document.readyState === "loaded") init();
			else document.addEventListener('DOMContentLoaded', init);
		}

		mouseHandler(arg: UserMouseEventArg): void {
			//TODO
		}
		requestRedraw(): void {
			//TODO
		}

	}






	export class Application {
		private static _apps: KeyMap = {};

		static Initialize(canvasId: string): string {
			let app = new ImpleApplication();
			let canvasApp = new CanvasApp(canvasId, app);
			let appid = "appid" + UniqueId.GetId();
			Application._apps[appid] = canvasApp;

			app.setCanvasId(canvasId);

			return appid;
		}

		static GetApplication(appId: string): IApplication {
			return Application._apps[appId].application;
		}
	}

}

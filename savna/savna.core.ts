namespace $avna {
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


	export class Point implements IClonable<Point>{
		constructor(public x: number = 0, public y: number = 0) { }
		clone() { return new Point(this.x, this.y); }
	}

	export class Size implements IClonable<Size>{
		constructor(public width: number = 0, public height: number = 0) { }
		clone() { return new Size(this.width, this.height); }
	}

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
	/* UserInterface */
	//
	export namespace ui {

		export namespace core {

			export interface IVisualComponent {
				draw(g: Graphics): void;
			}

			export interface IContainer extends IVisualComponent {

			}

			export interface IStage extends IContainer {
				initializeUI(): void;
			}

			export interface ILayout {

			}

			export class VisualComponent implements IVisualComponent {
				draw(g: Graphics): void { }
			}

			export class UIComponent extends VisualComponent {

			}

			export class StyleComponent extends UIComponent {

			}

			export class BaseStage implements IStage {
				constructor() {
					this.initializeUI();
				}

				draw(g: Graphics): void { }
				initializeUI(): void { }
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
	/* application */
	//
	class CanvasApp {
		constructor(public canvasId: string, public application: IApplication) { }
	}

	type CanvasAppMap = { [key: string]: CanvasApp }; // [appid : CanvasApp]

	export interface IApplication extends IEventEmitter {
		start(): void;
		mouseHandler(arg: UserMouseEventArg): void;
		requestRedraw(): void;
		isInitialized(): boolean;
		setSize(width: number, height: number): void;
		setLoopInterval(interval: number): void;
		getLoopInterval(): number;
		setAnimating(animate: boolean): void;
		getAnimating(): boolean;
		setContent(content: core.IVisualComponent): void;
		getContent(): core.IVisualComponent;

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

		/* states */
		private _drawReqeusted: boolean = false;
		private _looping: boolean = false;
		private _step_timer: ManualTimer = new ManualTimer();

		/* contents*/
		private _content: core.IVisualComponent = null;


		//
		/* no interface member */
		//
		setCanvasId(id: string): void { this._canvasId = id; }
		initialize(appcb: ApplicationIntializedCallback): void {
			if (this._canvasId == null) { appcb(new AppError(AppErrorType.NullCanvasId), null); return; }
			this._initialized = true;

			// init
			this._loopEngine.setCallback(this.oninternalloop.bind(this));

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

		private oninternalloop(loop: ILoopEngine) {
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

		requestRedraw(): void {
			this._drawReqeusted = true;
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
			console.log("" + width + "," + height);
			this._taskHandlers.pushTask(() => {
				this._graphics.context.canvas.width = width;
				this._graphics.context.canvas.height = height;
				//TODO layout ???may be PageNavigator
			});
			this._drawReqeusted = true;
		}

		setContent(content: core.IVisualComponent): void {
			this._content = content;
		}

		getContent(): core.IVisualComponent {
			return this._content;
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
			return Application._apps[appId].application;
		}
	}

}

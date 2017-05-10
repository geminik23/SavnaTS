declare namespace $avna {
    enum AppErrorType {
        NullCanvasId = 0,
        NotFoundCanvas = 1,
        AlreadyInitializedCanvasId = 2,
    }
    class AppError {
        private errType;
        constructor(errType: AppErrorType);
        readonly errorType: AppErrorType;
    }
    interface IForEach<T> {
        (item: T): void;
    }
    interface LinkedListNode<T> {
        element: T;
        next: LinkedListNode<T>;
    }
    interface ILinkedList<T> {
        begin(): LinkedListNode<T>;
        end(): LinkedListNode<T>;
        clear(): void;
        pushBack(element: T): any;
        pushFront(element: T): any;
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
    class LinkedList<T> implements ILinkedList<T> {
        private _beginNode;
        private _endNode;
        private _length;
        constructor();
        begin(): LinkedListNode<T>;
        end(): LinkedListNode<T>;
        clear(): void;
        pushBack(ele: T): void;
        pushFront(ele: T): void;
        popFront(): T;
        popBack(): T;
        insert(ele: T, index: number): boolean;
        private nodeAt(index);
        indexOf(ele: T): number;
        contains(element: T): boolean;
        remove(element: T): boolean;
        removeAt(index: number): T;
        elementAt(index: number): T;
        size(): number;
        foreach(each: IForEach<T>): void;
    }
    interface IPriorityQueue<T> {
        getMaxPriority(): number;
        getMinPriority(): number;
        push(element: T, priority: number): void;
        popMaxPriorityItem(): T;
        popMinPriorityItem(): T;
        isEmpty(): boolean;
        toArray(): Array<T>;
        toString(): string;
    }
    class PriorityQueue<T> implements IPriorityQueue<T> {
        private _queue;
        private _maxPriority;
        private _minPriority;
        constructor();
        getMaxPriority(): number;
        getMinPriority(): number;
        push(element: T, priority: number): void;
        isEmpty(): boolean;
        popMaxPriorityItem(): T;
        popMinPriorityItem(): T;
        private updateMaxPriority();
        private updateMinPriority();
        private refresh();
        toArray(): Array<T>;
        toString(): string;
    }
    interface IManualTimer {
        reset(): void;
        lap(): number;
        sinceLastLap(): number;
    }
    class ManualTimer implements IManualTimer {
        private _timer;
        private _lastLap;
        reset(): void;
        lap(): number;
        sinceLastLap(): number;
    }
    interface IIntervalChecker {
        start(): void;
        stop(): void;
        reset(): void;
        checkTick(): boolean;
        setInterval(interval_ms: number): void;
        interval(): number;
    }
    class IntervalChecker implements IIntervalChecker {
        private _lastTime;
        private _started;
        private _interval;
        start(): void;
        stop(): void;
        reset(): void;
        checkTick(): boolean;
        setInterval(interval_ms: number): void;
        interval(): number;
    }
    enum LoopType {
        Stopped = 0,
        WindowFrames = 1,
        Interval = 2,
    }
    interface ILoopEngine {
        setCallback(cb: (engine: ILoopEngine) => void): void;
        currentState(): LoopType;
        isNowLooping(): boolean;
        loop(type: LoopType, interval: number): void;
        stop(): void;
        tick(): void;
        intervalChecker(): IIntervalChecker;
    }
    class LoopEngine implements ILoopEngine {
        private _callback;
        private _loop_windowFrame;
        private _handle_interval;
        private _intervalChecker;
        private _currentState;
        constructor();
        setCallback(cb: (engine: ILoopEngine) => void): void;
        isNowLooping(): boolean;
        currentState(): LoopType;
        stop(): void;
        tick(): void;
        loop(type: LoopType, interval?: number): void;
        intervalChecker(): IIntervalChecker;
        private loopWindowFrame();
        private loopInterval();
    }
    interface EventCallback {
        (...args: any[]): void;
    }
    interface IEventEmitter {
        on(type: string, listener: EventCallback): void;
        emit(type: string, ...args: any[]): void;
        emitAsync(type: string, ...args: any[]): void;
    }
    class EventEmitter implements IEventEmitter {
        private _events;
        on(type: string, listener: EventCallback): void;
        emit(type: string, ...args: any[]): void;
        emitAsync(type: string, ...args: any[]): void;
        private commonEmit(type, isAsync, ...args);
        private fire(event, isAsync, ...args);
    }
    interface Task {
        (): void;
    }
    interface ITaskHandler {
        pushTask(task: Task): void;
        clearTasks(): void;
        processTasks(): void;
        processTasksAsync(): void;
        processEachTaskAsync(): void;
    }
    class TaskHanlder implements ITaskHandler {
        private _tasks;
        pushTask(task: Task): void;
        clearTasks(): void;
        processTasks(): void;
        processTasksAsync(): void;
        processEachTaskAsync(): void;
        private getTasksNClear();
    }
    interface IClonable<T> {
        clone(): T;
    }
    interface Size {
        width: number;
        height: number;
    }
    class Point implements IClonable<Point> {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        clone(): Point;
    }
    class Rect implements IClonable<Rect> {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        clone(): Rect;
    }
    class Color implements IClonable<Color> {
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(r?: number, g?: number, b?: number, a?: number);
        set(r: any, g: any, b: any, a: any): void;
        toString(): string;
        clone(): Color;
    }
    class Graphics {
        private ctx;
        private rect;
        private _stepTime;
        constructor(ctx: CanvasRenderingContext2D, rect: Rect);
        readonly context: CanvasRenderingContext2D;
        readonly boundRect: Rect;
        stepTime: number;
    }
    interface IError {
        getErrorMessage(): string;
    }
    class BaseError implements IError {
        private _errorMsg;
        constructor(msg: string);
        getErrorMessage(): string;
    }
    class ArgumentError extends BaseError {
    }
    namespace ui {
        namespace layout {
            interface ILayout {
                setTarget(obj: any): void;
                getTarget(): any;
            }
        }
        namespace core {
            interface IInvalidate {
                invalidateState(): void;
                invalidateLayout(): void;
                validateState(): void;
                validateLayout(): void;
            }
            interface IVisualComponent {
                measureRequest(availableSize: Size): Size;
                renderingRequest(g: Graphics): void;
            }
            abstract class VisualComponent extends EventEmitter implements IVisualComponent, IInvalidate {
                static DepthLevel(obj: any): number;
                private _x;
                private _y;
                protected scaleX: number;
                protected scaleY: number;
                protected stage: Page;
                protected parent: VisualComponent;
                protected appId: string;
                private _depthLevel;
                x: number;
                y: number;
                readonly depthLevel: number;
                readonly currentAppId: string;
                readonly currentApplication: IApplication;
                setParent(parent: VisualComponent): void;
                measureRequest(availableSize: Size): Size;
                protected measureOverride(available: Size): Size;
                protected internalMeasure(available: Size): Size;
                renderingRequest(g: Graphics): void;
                protected internalDraw(g: Graphics): void;
                protected drawOverride(g: Graphics): boolean;
                abstract invalidateState(): void;
                abstract invalidateLayout(): void;
                abstract validateState(): void;
                abstract validateLayout(): void;
            }
            interface IContainer extends IVisualComponent {
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
            interface IPage extends IContainer {
                initializeUI(): void;
                setNavigator(navigator: IPageNavigator): void;
                setAppId(appid: string): void;
                navigated(arg: any): void;
            }
            interface IPageNavigator {
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
            class UIComponent extends VisualComponent {
                private _enabled;
                private _width;
                private _height;
                protected startWidth: number;
                protected startHeight: number;
                private _minWidth;
                private _minHeight;
                private _includeInLayout;
                private _explicitWidth;
                private _explicitHeight;
                protected layoutInvalid: Boolean;
                protected stateInvalid: Boolean;
                protected sizeChanged: Boolean;
                constructor();
                protected init(): void;
                invalidateState(): void;
                invalidateLayout(): void;
                validateState(): void;
                validateLayout(): void;
                protected commitState(): void;
                protected updateLayout(w: number, h: number): void;
                minWidth: number;
                minHeight: number;
                enabled: boolean;
                setPosition(x: number, y: number): void;
                setActualSize(width: number, height: number): void;
                childChanged(child?: VisualComponent): boolean;
                protected notifyLayoutInfoChangedToParents(): void;
                protected flushCache(): void;
                getWidth(): number;
                setWidth(w: number): void;
                getHeight(): number;
                setHeight(h: number): void;
                readonly explicitWidth: number;
                readonly explicitHeight: number;
                scaleX: number;
                scaleY: number;
                includeInLayout: boolean;
            }
            class Container extends UIComponent implements IContainer {
                private _childContainer;
                private _layout;
                private _updateLayout;
                protected setAppId(appid: string): void;
                addChild(child: VisualComponent): VisualComponent;
                addChildAt(child: VisualComponent, index: number): VisualComponent;
                childAt(idx: number): VisualComponent;
                numOfChildren(): number;
                removeChild(child: VisualComponent): VisualComponent;
                removeChildAt(idx: number): VisualComponent;
                moveToFront(child: VisualComponent): void;
                moveToBack(child: VisualComponent): void;
                getLayout(): ui.layout.ILayout;
                setLayout(layout: ui.layout.ILayout): void;
                getContentWidth(): number;
                getContentHeight(): number;
                setHeight(h: number): void;
                setWidth(w: number): void;
                setActualSize(w: number, h: number): void;
                private boundChanged();
                private structureChange();
                protected internalMeasure(available: Size): Size;
                protected internalDraw(g: Graphics): void;
            }
            class StyleComponent extends UIComponent {
            }
            class Page extends Container implements IPage {
                protected navigator: IPageNavigator;
                constructor();
                setAppId(id: string): void;
                initializeUI(): void;
                setNavigator(navi: IPageNavigator): void;
                navigated(arg: any): void;
            }
        }
    }
    enum UserPointType {
        MouseDown = 0,
        MouseMove = 1,
        MouseUp = 2,
        MouseOver = 3,
        MouseOut = 4,
        TouchStart = 5,
        TouchMove = 6,
        TouchEnd = 7,
        TouchCancel = 8,
    }
    class UserMouseEventArg {
        type: UserPointType;
        x: number;
        y: number;
        handle: any;
        constructor(type: UserPointType, x: number, y: number, handle?: any);
        toString(): string;
    }
    interface IInvalidationManager {
        doFrame(): boolean;
        invalidLayout(ele: ui.core.IInvalidate, priority: number): void;
        invalidState(ele: ui.core.IInvalidate, priority: number): void;
        validateLayout(): void;
        validateState(): void;
    }
    interface IApplication extends IEventEmitter {
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
    interface ApplicationIntializedCallback {
        (err: AppError, app: IApplication): void;
    }
    class Application {
        private static _apps;
        static Initialize(canvasId: string, appcb: ApplicationIntializedCallback): string;
        static GetAppId(canvasId: string): string;
        static GetApplication(appId: string): IApplication;
        static GetInvalidationManager(appId: string): IInvalidationManager;
    }
}

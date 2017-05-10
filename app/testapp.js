var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TestApp;
(function (TestApp) {
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Rectangle.prototype.drawOverride = function (g) {
            var ctx = g.context;
            var rect = g.boundRect;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(rect.x, rect.y, 100, 100);
            return false;
        };
        return Rectangle;
    }($avna.ui.core.UIComponent));
    TestApp.Rectangle = Rectangle;
    var MainPage = (function (_super) {
        __extends(MainPage, _super);
        function MainPage() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainPage.prototype.initializeUI = function () {
            var rect = new Rectangle();
            rect.x = 100;
            rect.y = 200;
            this.addChild(rect);
        };
        MainPage.prototype.drawOverride = function (g) {
            var ctx = g.context;
            var rect = g.boundRect;
            ctx.fillStyle = "#000000";
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            return false;
        };
        return MainPage;
    }($avna.ui.core.Page));
    TestApp.MainPage = MainPage;
})(TestApp || (TestApp = {}));
//# sourceMappingURL=testapp.js.map
declare namespace TestApp {
    class Rectangle extends $avna.ui.core.UIComponent {
        protected internalDraw(g: $avna.Graphics): void;
    }
    class MainPage extends $avna.ui.core.Page {
        initializeUI(): void;
        drawOverride(g: $avna.Graphics): boolean;
    }
}

declare namespace TestApp {
    class Rectangle extends $avna.ui.core.UIComponent {
        protected drawOverride(g: $avna.Graphics): boolean;
    }
    class MainPage extends $avna.ui.core.Page {
        initializeUI(): void;
        drawOverride(g: $avna.Graphics): boolean;
    }
}

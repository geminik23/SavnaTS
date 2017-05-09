namespace TestApp {

	export class Rectangle extends $avna.ui.core.UIComponent {
		protected internalDraw(g: $avna.Graphics): void {

			let ctx = g.context;
			let rect = g.boundRect;
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(rect.x, rect.y, 100,100);
		}
	}

	export class MainPage extends $avna.ui.core.Page {
		
		initializeUI(): void {
			this.addChild(new Rectangle());
		}

		drawOverride(g: $avna.Graphics): boolean {
			let ctx = g.context;
			let rect = g.boundRect;
			ctx.fillStyle = "#000000";
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
			
			return true;
		}
	}
}
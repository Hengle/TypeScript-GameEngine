﻿namespace TSE {
    /**
     * 游戏引擎类
     */
    export class Engine {
        /**
         * 构造函数
         */
        public constructor() {
            console.log("Hello World");
        }

        private _count: number = 0;
        private _canvas: HTMLCanvasElement;

        /**
         * Start up 函数
         */
        public start(): void {
            this._canvas = GLUtilities.initialize();
            gl.clearColor(1,0,0,1);  // 设置红色

            this.loop();
        }

        /**
         * 游戏主循环 
         */
        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);  // 使用颜色缓冲区中的颜色，每次刷新

            requestAnimationFrame(this.loop.bind(this));
        }

        /**
         * Resizes the canvas to fit the window.
         * */
        public resize(): void {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
        }
    }
}
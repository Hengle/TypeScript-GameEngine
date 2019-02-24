﻿namespace TSE {

    /**
     * Represents a 2-dimensional sprite which is drawn on the screen.
     * */
    export class Sprite {

        protected _name: string;
        protected _width: number;
        protected _height: number;

        protected _origin: Vector3 = new Vector3(0, 0, 0);

        protected _buffer: GLBuffer;
        protected _materialName:string;
        protected  _material:Material;

        protected _vertices: Vertex[] = [];

        /**
         * Creates a new sprite.
         * @param name The name of this sprite.
         * @param materialName The name of the material to use with this sprite.
         * @param width The width of this sprite.
         * @param height The height of this sprite.
         */
        public constructor(name: string, materialName:string,  width: number = 100, height: number = 100) {
            this._name = name;
            this._materialName = materialName;
            this._material = MaterialManager.getMaterial(materialName);
            this._width = width;
            this._height = height;
        }

        public get origin(): Vector3 {
            return this._origin;
        }

        public set origin(value: Vector3) {
            this._origin = value;
            this.recalculateVertices();
        }

        public get width(): number {
            return this._width;
        }

        public get height(): number {
            return this._height;
        }

        /**
         * 生成顶点和UV数据，应用
         */
        protected calculateVertices(): void {
            let minX = -(this._width * this._origin.x);
            let maxX = this._width * (1.0 - this._origin.x);

            let minY = -(this._height * this._origin.y);
            let maxY = this._height * (1.0 - this._origin.y);

            this._vertices = [

                // x,y,z   ,u, v
                new Vertex(minX, minY, 0, 0, 0),
                new Vertex(minX, maxY, 0, 0, 1.0),
                new Vertex(maxX, maxY, 0, 1.0, 1.0),

                new Vertex(maxX, maxY, 0, 1.0, 1.0),
                new Vertex(maxX, minY, 0, 1.0, 0),
                new Vertex(minX, minY, 0, 0, 0)
            ];

            for (let v of this._vertices) {
                this._buffer.pushBackData(v.toArray());
            }

            this._buffer.upload();
            this._buffer.unbind();
        }

        /**
         * 只是更改顶点，uv不用改变
         */
        protected recalculateVertices(): void {

            let minX = -(this._width * this._origin.x);
            let maxX = this._width * (1.0 - this._origin.x);

            let minY = -(this._height * this._origin.y);
            let maxY = this._height * (1.0 - this._origin.y);

            this._vertices[0].position.set(minX, minY);
            this._vertices[1].position.set(minX, maxY);
            this._vertices[2].position.set(maxX, maxY);

            this._vertices[3].position.set(maxX, maxY);
            this._vertices[4].position.set(maxX, minY);
            this._vertices[5].position.set(minX, minY);

            this._buffer.clearData();
            for (let v of this._vertices) {
                this._buffer.pushBackData(v.toArray());
            }

            this._buffer.upload();
            this._buffer.unbind();
        }


        public get name(): string {
            return this._name;
        }

        public destroy(): void {
            this._buffer.destroy();
            MaterialManager.releaseMaterial(this._materialName);
            this._material = undefined;
            this._materialName = undefined;
        }

        /**
         * Performs loading routines on this sprite.
         * */
        public load(): void {    // 把 engine.ts 中的 craeteBuffer 函数内容拷贝过来。 
            this._buffer = new GLBuffer();
            let positionArribute = new AttributeInfo();
            positionArribute.location = 0//this._shader.getAttributeLocation("a_position");
            positionArribute.offset = 0;
            positionArribute.size = 3;
            this._buffer.addAttributeLocation(positionArribute);

            let texCoordArribute = new AttributeInfo();
            texCoordArribute.location = 1//this._shader.getAttributeLocation("a_position");
            texCoordArribute.offset = 3;
            texCoordArribute.size = 2;
            this._buffer.addAttributeLocation(texCoordArribute);

            this.calculateVertices();
        }

        /**
         * Performs update routines on this sprite.
         * @param time The delta time in milliseconds since the last update call.
         */
        public update(time: number): void {

        }

        /** Draws this sprite. */
        public draw(shader: Shader, model: Matrix4x4): void {
            // set uniform 
            let colorPosition = shader.getUniformLocation("u_tint");
            //gl.uniform4f(colorPosition, 1, 1, 1, 1);
            gl.uniform4fv(colorPosition, this._material.tint.toFloat32Array());

            let modelPosition = shader.getUniformLocation("u_model");
            gl.uniformMatrix4fv(modelPosition, false, model.toFloat32Array());

            if (this._material.diffuseTexture !== undefined) {
                this._material.diffuseTexture.activateAndBind(0);
                let diffuseLocation = shader.getUniformLocation("u_diffuse");
                gl.uniform1i(diffuseLocation, 0);
            }

            this._buffer.bind();
            this._buffer.draw();
        }
    }
}
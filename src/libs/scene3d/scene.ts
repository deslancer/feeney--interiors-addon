import { Color4, Engine, Scene, Vector3 } from 'babylonjs';
import { Singleton } from '../../decorators/singleton';

@Singleton
export class AppScene {
  private _scene: Scene | null = null;

  public create(engine: Engine) {
    if (!this._scene) {
      this._scene = new Scene(engine);
      this._scene.clearColor = new Color4(1.0, 1.0, 1.0, 1);
      this._scene.gravity = new Vector3(0, -0.982, 0);
      this._scene.collisionsEnabled = true;
    }
  }

  public get scene() {
    if (this._scene) {
      return this._scene;
    } else {
      console.log('Error: Scene is not created');
      return;
    }
  }

  public clear() {
    if (this._scene) {
      this._scene.meshes.map((mesh) => mesh.dispose());
      this._scene.cameras.map((camera) => camera.dispose());
      this._scene.lights.map((lights) => lights.dispose());
      //this._scene.materials.map((material) => material.dispose());
      //this._scene.textures.map((texture) => texture.dispose());
      console.info('Scene has been disposed');
    } else {
      console.warn('No Scene for dispose');
    }
  }
}

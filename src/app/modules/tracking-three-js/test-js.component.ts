import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AfterViewInit } from "@angular/core";

export class TrackingThreeJsComponent implements AfterViewInit {
  // @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private controls!: OrbitControls;

  constructor() {}

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.loadModel();
    this.animate();
  }

  private initThreeJS() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff); // Set background to white

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({
      // canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.z = 5;

    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;

    // Optional: Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    this.scene.add(light);
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load("assets/models/scene.gltf", (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);

      // Traverse the model and change the color dynamically
      this.model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;

          // Check for a specific part by name (optional)
          if (mesh.name === "PartName") {
            // Change material color dynamically
            (mesh.material as THREE.MeshStandardMaterial).color.set(0xff0000); // Set to red, or dynamically change color here
          }
        }
      });
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    if (this.model) {
      // Example: Rotate the model
      // this.model.rotation.y += 0.01;
    }
    this.renderer.render(this.scene, this.camera);
  }

  // Dynamic color update based on external value
  public updateModelColor(partName: string, color: string) {
    this.model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name === partName) {
          (mesh.material as THREE.MeshStandardMaterial).color.set(color);
        }
      }
    });
  }
}

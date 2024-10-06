import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

@Component({
  selector: "app-tracking-three-js",
  standalone: true,
  imports: [],
  templateUrl: "./tracking-three-js.component.html",
  styleUrl: "./tracking-three-js.component.scss",
})
export class TrackingThreeJsComponent implements AfterViewInit {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private controls!: OrbitControls; // Declare controls
  flag: boolean = false;
  flag1: boolean = false;
  intervalId: any;
  intervalId1: any;
  intervalld: any;
  trackingData: any;
  fur1: boolean;
  fur2: boolean;
  fur3: boolean;
  fur4: boolean;

  constructor() {}

  ngAfterViewInit(): void {
    this.intervalId = setInterval(() => {
      this.toggleFlag();
    }, 2000); // 2000 milliseconds = 2 seconds
    this.intervalId1 = setInterval(() => {
      this.toggleFlag1();
    }, 5000); // 2000 milliseconds = 2 seconds
    this.initThreeJS();
    this.loadModel();
    this.animate();
    window.addEventListener("resize", this.onWindowResize.bind(this), false); // Add resize listener
  }
  ngOnDestroy(): void {
    window.removeEventListener("resize", this.onWindowResize.bind(this)); // Clean up listener
  }

  toggleFlag(): void {
    this.flag = !this.flag; // Toggle the flag's value
  }
  toggleFlag1(): void {
    this.flag1 = !this.flag1; // Toggle the flag's value
  }
  private initThreeJS() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(window.innerWidth - 10, window.innerHeight - 40);
    this.camera.position.z = 5;

    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
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

      this.model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;

          // Check for a specific part by name (optional)
          if (mesh.name == "Furnace1" && this.flag == true) {
            // console.log(mesh.name);

            // Change material color dynamically
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x00ff00); // Set to red, or dynamically change color here
          }
        }
      });
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    // Update model parameters dynamically here if needed
    this.updateModelColor();
    this.controls.update();
    if (this.model) {
      // Example: Rotate the model
      // this.model.rotation.y += 0.01;
    }
    this.renderer.render(this.scene, this.camera);
  }
  private onWindowResize() {
    // Update camera aspect ratio and renderer size
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public updateModelColor() {
    this.model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        if (mesh.name === "Furnace1") {
          if (this.flag == true) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0xff773d);
            // mesh.rotation.y += 0.1;
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0xb0b0b0);
          }
        }
        if (mesh.name === "R2UpB") {
          if (this.flag1 == true) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0xff773d);
            mesh.rotation.y += 0.01;
            // mesh.rotation.x += 0.1;
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0xb0b0b0);
          }
        }
      }
    });
  }
}

// Belt
// Furnace1
// Furnace2
// Furnace3
// Furnace4
// R1Plate
// R1L
// R1Down
// R1Up
// R1R

// R2L
// R2R
// R2DownS
// R2DownB
// R2UpB
// R2UpS

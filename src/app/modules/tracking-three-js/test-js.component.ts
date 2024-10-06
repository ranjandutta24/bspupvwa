import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: "app-tracking-three-js",
  template: "<canvas #canvas></canvas>",
  styleUrls: ["./tracking-three-js.component.css"],
})
export class TrackingThreeJsComponent implements AfterViewInit {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private selectedPartName: string = ""; // Store the selected component's name
  private ctx!: CanvasRenderingContext2D;

  constructor() {}

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.loadModel();
    this.animate();

    // Add click event listener to the canvas element
    this.canvasRef.nativeElement.addEventListener(
      "click",
      this.onMouseClick.bind(this),
      false
    );
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
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement, // Use the canvas element
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;

    // Get the 2D context from the canvas
    this.ctx = this.canvasRef.nativeElement.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    this.scene.add(light);
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load("assets/models/scene.gltf", (gltf) => {
      this.model = gltf.scene;

      // Traverse the model and log names, assign default names if missing
      this.model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (!mesh.name) {
            mesh.name = "UnnamedMesh"; // Assign default name if missing
          }
          console.log("Loaded Mesh Name:", mesh.name);
        }
      });

      this.scene.add(this.model);
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    // Clear 2D canvas context to avoid overlapping
    this.clearTextOverlay();

    // Update controls and render the scene
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    // Draw the selected part name
    if (this.selectedPartName) {
      this.drawTextOnCanvas(this.selectedPartName);
    }
  }

  private onMouseClick(event: MouseEvent) {
    console.log("click");

    // Convert mouse position to normalized device coordinates (-1 to +1) for raycasting
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x =
      ((event.clientX - rect.left) / this.canvasRef.nativeElement.clientWidth) *
        2 -
      1;
    this.mouse.y =
      -(
        (event.clientY - rect.top) /
        this.canvasRef.nativeElement.clientHeight
      ) *
        2 +
      1;

    // Perform raycasting to find intersected objects
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object as THREE.Mesh;

      // Display the name of the clicked object
      this.selectedPartName = intersectedObject.name;
      console.log("Clicked part:", this.selectedPartName);
    } else {
      console.log("No part was clicked.");
    }
  }

  // Clear the 2D canvas before drawing the new text
  private clearTextOverlay() {
    this.ctx.clearRect(
      0,
      0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );
  }

  // Draw text on canvas
  private drawTextOnCanvas(text: string) {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(text, 10, 30); // Display at top-left of the canvas
  }
}

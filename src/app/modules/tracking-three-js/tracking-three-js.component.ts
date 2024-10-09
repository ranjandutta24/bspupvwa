import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonService } from "app/services/common.service";
import { ReportService } from "app/services/report.service";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-tracking-three-js",
  standalone: true,

  templateUrl: "./tracking-three-js.component.html",
  // template: "<canvas #canvas></canvas>",
  styleUrl: "./tracking-three-js.component.scss",
  imports: [CommonModule], // Import CommonModule here
})
export class TrackingThreeJsComponent implements AfterViewInit {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("canvas2D") canvas2DRef!: ElementRef<HTMLCanvasElement>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private controls!: OrbitControls; // Declare controls

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  selectedPartName: string = ""; // Store the selected component's name
  isColapsed: boolean = true;
  flag: boolean = false;
  flag1: boolean = false;
  intervalId: any;
  intervalId1: any;
  intervalld: any;
  trackingData: any;
  fur1: boolean = false;
  fur2: boolean = false;
  fur3: boolean = false;
  fur4: boolean = false;
  item = "no";
  items = new Map([
    ["no", "No item selected"],
    ["Belt", "Track"],
    ["Furnace1", "Furnace 1"],
    ["Furnace2", "Furnace 2"],
    ["Furnace3", "Furnace 3"],
    ["Furnace4", "Furnace 4"],
    ["R1Up", "R1"],
    ["R1Down", "R1"],
    ["R2UpB", "R2"],
    ["R2UpS", "R2"],
    ["R2DownB", "R2"],
    ["R2DownS", "R2"],
    ["R2Plate", "R2 Plate"],
    ["oranges", ""],
  ]);
  rollingseq = [];
  loading = true;
  status = "";

  constructor(
    private reportService: ReportService,
    private commonService: CommonService
  ) {}

  ngAfterViewInit(): void {
    this.intervalId = setInterval(() => {
      this.toggleFlag();
    }, 2000); // 2000 milliseconds = 2 seconds
    this.intervalId1 = setInterval(() => {
      this.toggleFlag1();
    }, 5000); // 2000 milliseconds = 2 seconds
    this.initThreeJS();
    this.intervalld = setInterval(() => {
      this.callTrackingapi();
    }, 3000); // 2000 milliseconds = 2 seconds

    this.loadModel();
    this.animate();

    window.addEventListener("resize", this.onWindowResize.bind(this), false); // Add resize listener

    this.canvasRef.nativeElement.addEventListener(
      "click",
      this.onMouseClick.bind(this),
      false
    );
  }
  ngOnDestroy(): void {
    console.log("Component destroyed");
    window.removeEventListener("resize", this.onWindowResize.bind(this)); // Clean up listener
    if (this.intervalld) {
      clearInterval(this.intervalld);
    }
  }

  toggleFlag(): void {
    this.flag = !this.flag; // Toggle the flag's value
  }
  toggleFlag1(): void {
    this.flag1 = !this.flag1; // Toggle the flag's value
  }

  // Handle click event to display the object's name
  private onMouseClick(event: MouseEvent) {
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

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object as THREE.Mesh;
      this.selectedPartName = intersectedObject.name;
      // this.drawTextOnCanvas(`Clicked part: ${this.selectedPartName}`);
      this.item = this.selectedPartName;
    } else {
      // this.drawTextOnCanvas('No part was clicked.');
    }
  }
  private initThreeJS() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(window.innerWidth - 2, window.innerHeight - 40);
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
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-5, -5, -5).normalize();
    this.scene.add(light2);
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load("assets/models/scene (5).gltf", (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);
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

  colapse() {
    this.isColapsed = !this.isColapsed;
  }
  private onWindowResize() {
    // Update camera aspect ratio and renderer size
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public updateModelColor() {
    if (!this.model) {
      // console.error("Model not loaded yet!");
      return;
    }
    this.model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        if (mesh.name === "Furnace4") {
          if (this.fur4 == true) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0xffffff);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x6666fa);
          }
        }
        if (mesh.name === "Furnace3") {
          if (this.fur3 == true) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0xffffff);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x6666fa);
          }
        }
        if (mesh.name === "Furnace2") {
          if (this.fur2 == true) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0xffffff);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x6666fa);
          }
        }
        if (mesh.name === "Furnace1") {
          if (this.fur1 == true) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0xffffff);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x6666fa);
          }
        }

        if (mesh.name === "R2Plate") {
          if (this.flag1 == true) {
            // (mesh.material as THREE.MeshStandardMaterial).color.set(0xff773d);
            mesh.visible = true;
            // mesh.rotation.x += 0.1;
          } else {
            mesh.visible = false;
          }
        }
        if (mesh.name === "R3Plate") {
          if (this.flag1 == false) {
            mesh.visible = true;
          } else {
            mesh.visible = false;
          }
        }

        if (this.flag1 == true) {
          if (mesh.name === "R2UpB" || mesh.name === "R2UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "R2DownB" || mesh.name === "R2DownS") {
            mesh.rotation.y -= 0.03;
          }
        }
        if (this.flag1 == false) {
          if (mesh.name === "R1Up") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "R1Down") {
            mesh.rotation.y -= 0.03;
          }
        }
      }
    });
  }

  callTrackingapi() {
    this.reportService.tracking({}).subscribe(
      (response) => {
        let data = JSON.parse(JSON.stringify(response));
        this.trackingData = data[0];
        this.trackingData.FUR1STATUS == "0"
          ? (this.fur1 = false)
          : (this.fur1 = true);
        this.trackingData.FUR2STATUS == "0"
          ? (this.fur2 = false)
          : (this.fur2 = true);
        this.trackingData.FUR3STATUS == "0"
          ? (this.fur3 = false)
          : (this.fur3 = true);
        this.trackingData.FUR4STATUS == "0"
          ? (this.fur4 = false)
          : (this.fur4 = true);

        if (this.trackingData.ROLLINGSEQ != "") {
          this.rollingseq = this.trackingData.ROLLINGSEQ.split("|");
        } else {
          this.rollingseq = Array(20).fill("__");
        }

        if (this.trackingData.MILLSTATUS == 6) {
          this.status = "Production L3";
        } else if (this.trackingData.MILLSTATUS == 3) {
          this.status = "FM Roll Change";
        } else if (this.trackingData.MILLSTATUS == 2) {
          this.status = "FM Caliberation";
        } else {
          this.status = "Maintenance";
        }

        this.loading = false;
      },
      (respError) => {
        // this.loading = false;
        this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );
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

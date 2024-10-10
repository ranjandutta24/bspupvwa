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
  dischargedPlate: string = "";
  r1Plate: string = "";
  r2Plate: string = "";
  r3Plate: string = "";
  r4Plate: string = "";
  r5Plate: string = "";
  d1Plate: string = "";
  d2Plate: string = "";
  shearPlate: string = "";
  f6Plate: string = "";
  f7Plate: string = "";
  f8Plate: string = "";
  f9Plate: string = "";
  f10Plate: string = "";
  f11Plate: string = "";
  f12Plate: string = "";
  c1Plate: string = "";
  c2Plate: string = "";
  c3Plate: string = "";
  coil1Plate: string = "";
  coil2Plate: string = "";
  coil3Plate: string = "";
  coil4Plate: string = "";
  coil1: string = "";
  coil2: string = "";
  coil3: string = "";
  coil4: string = "";
  stand6Status = "1";
  stand7Status = "1";
  stand8Status = "1";
  stand9Status = "1";
  stand10Status = "1";
  stand11Status = "1";
  stand12Status = "1";
  stansStatus = [];

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
  millsStandStatus = "";

  constructor(
    private reportService: ReportService,
    private commonService: CommonService
  ) {}

  ngAfterViewInit(): void {
    // this.intervalId = setInterval(() => {
    //   this.toggleFlag();
    // }, 2000); // 2000 milliseconds = 2 seconds
    // this.intervalId1 = setInterval(() => {
    //   this.toggleFlag1();
    // }, 5000); // 2000 milliseconds = 2 seconds
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

  // toggleFlag(): void {
  //   this.flag = !this.flag; // Toggle the flag's value
  // }
  // toggleFlag1(): void {
  //   this.flag1 = !this.flag1; // Toggle the flag's value
  // }

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
    this.camera.position.z = 5.690522470597121;
    this.camera.position.x = 1.0053592648786294;
    this.camera.position.y = 6.805748555764769;
    // {x: 2.6215825537250534, y: 5.757049781132278, z: 5.6704628060047595}
    // {x: 1.0053592648786294, y: 6.805748555764769, z: 5.690522470597121}

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
  resetCamera() {
    this.camera.position.z = 5.690522470597121;
    this.camera.position.x = 1.0053592648786294;
    this.camera.position.y = 6.805748555764769;
    this.controls.target.set(0, 0, 0); // Reset target to origin (or any point you want)

    // Notify the controls that they should update their internal state
    this.controls.update();
  }
  private loadModel() {
    const loader = new GLTFLoader();
    loader.load("assets/models/scene (9).gltf", (gltf) => {
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
    console.log(this.camera.position);

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
        // # UPDATE FURNACE
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
        // #UPDATE PLATES

        if (mesh.name === "Discharged") {
          this.dischargedPlate == "" || this.dischargedPlate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "R1Plate") {
          this.r1Plate == "" || this.r1Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "R2Plate") {
          this.r2Plate == "" || this.r2Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "R3Plate") {
          this.r3Plate == "" || this.r3Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "R4Plate") {
          this.r4Plate == "" || this.r4Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "R5Plate") {
          this.r5Plate == "" || this.r5Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "Delay1") {
          this.d1Plate == "" || this.d1Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "Delay2") {
          this.d2Plate == "" || this.d2Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "ShearPlate") {
          this.shearPlate == "" || this.shearPlate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "F6Plate") {
          this.f6Plate == "" || this.f6Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "F7Plate") {
          this.f7Plate == "" || this.f7Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "F8Plate") {
          this.f8Plate == "" || this.f8Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "F9Plate") {
          this.f9Plate == "" || this.f9Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "F10Plate") {
          this.f10Plate == "" || this.f10Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "F11Plate") {
          this.f11Plate == "" || this.f11Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "F12Plate") {
          this.f12Plate == "" || this.f12Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "C1Plate") {
          this.c1Plate == "" || this.c1Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "C2Plate") {
          this.c2Plate == "" || this.c2Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "C3Plate") {
          this.c3Plate == "" || this.c3Plate == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }
        if (mesh.name === "Coil1Plate") {
          if (this.coil1 || this.coil2 || this.coil3 || this.coil4) {
            mesh.visible = true;
          } else {
            mesh.visible = false;
          }
        }
        if (mesh.name === "Coil2Plate") {
          if (this.coil2 || this.coil3 || this.coil4) {
            mesh.visible = true;
          } else {
            mesh.visible = false;
          }
        }
        if (mesh.name === "Coil3Plate") {
          if (this.coil3 || this.coil4) {
            mesh.visible = true;
          } else {
            mesh.visible = false;
          }
        }
        if (mesh.name === "Coil4Plate") {
          this.coil4 == "" || this.coil4 == null
            ? (mesh.visible = false)
            : (mesh.visible = true);
        }

        // # UPDATE COIL

        if (mesh.name === "Coil1") {
          this.coil1 == "" || this.coil1 == null
            ? (mesh.visible = false)
            : ((mesh.visible = true), (mesh.rotation.y -= 0.3));
        }
        if (mesh.name === "Coil2") {
          this.coil2 == "" || this.coil2 == null
            ? (mesh.visible = false)
            : ((mesh.visible = true), (mesh.rotation.y -= 0.3));
        }
        if (mesh.name === "Coil3") {
          this.coil3 == "" || this.coil3 == null
            ? (mesh.visible = false)
            : ((mesh.visible = true), (mesh.rotation.y -= 0.3));
        }
        if (mesh.name === "Coil4") {
          this.coil4 == "" || this.coil4 == null
            ? (mesh.visible = false)
            : ((mesh.visible = true), (mesh.rotation.y -= 0.3));
        }

        // # UPDATE Roller
        if (this.r2Plate) {
          if (mesh.name === "R2UpB" || mesh.name === "R2UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "R2DownB" || mesh.name === "R2DownS") {
            mesh.rotation.y -= 0.03;
          }
        }
        if (this.r3Plate) {
          if (mesh.name === "R3UpB" || mesh.name === "R3UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "R3DownB" || mesh.name === "R3DownS") {
            mesh.rotation.y -= 0.03;
          }
        }
        if (this.r4Plate) {
          if (mesh.name === "R4UpB" || mesh.name === "R4UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "R4DownB" || mesh.name === "R4DownS") {
            mesh.rotation.y -= 0.03;
          }
        }

        if (this.r5Plate) {
          if (mesh.name === "R5UpB" || mesh.name === "R5UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "R5DownB" || mesh.name === "R5DownS") {
            mesh.rotation.y -= 0.03;
          }
        }
        if (this.f6Plate && this.stand6Status == "1") {
          if (mesh.name === "F6UpB" || mesh.name === "F6UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "F6DownB" || mesh.name === "F6DownS") {
            mesh.rotation.y -= 0.03;
          }
        }
        if (this.f7Plate && this.stand7Status == "1") {
          if (mesh.name === "F7UpB" || mesh.name === "F7UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "F7DownB" || mesh.name === "F7DownS") {
            mesh.rotation.y -= 0.03;
          }
        }
        if (this.f8Plate && this.stand8Status == "1") {
          if (mesh.name === "F8UpB" || mesh.name === "F8UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "F8DownB" || mesh.name === "F8DownS") {
            mesh.rotation.y -= 0.03;
          }
        }
        if (this.f9Plate && this.stand9Status == "1") {
          if (mesh.name === "F9UpB" || mesh.name === "F9UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "F9DownB" || mesh.name === "F9DownS") {
            mesh.rotation.y -= 0.03;
          }
        }
        if (this.f10Plate && this.stand10Status == "1") {
          if (mesh.name === "F10UpB" || mesh.name === "F10UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "F10DownB" || mesh.name === "F10DownS") {
            mesh.rotation.y -= 0.03;
          }
        }
        if (this.f11Plate && this.stand11Status == "1") {
          if (mesh.name === "F11UpB" || mesh.name === "F11UpS") {
            mesh.rotation.y += 0.03;
          } else if (mesh.name === "F11DownB" || mesh.name === "F11DownS") {
            mesh.rotation.y -= 0.03;
          }
        }
        if (this.f12Plate && this.stand12Status == "1") {
          if (mesh.name === "F12UpB" || mesh.name === "F12UpS") {
            mesh.rotation.y += 0.3;
          } else if (mesh.name === "F12DownB" || mesh.name === "F12DownS") {
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

        this.dischargedPlate = this.trackingData.POS8;
        this.r1Plate = this.trackingData.POS9;
        this.r2Plate = this.trackingData.POS10;
        this.r3Plate = this.trackingData.POS11;
        this.r4Plate = this.trackingData.POS12;
        this.r5Plate = this.trackingData.POS13;
        this.d1Plate = this.trackingData.POS14;
        this.d2Plate = this.trackingData.POS15;
        this.millsStandStatus = this.trackingData.MILLSTANDSTATUS;
        this.shearPlate = this.trackingData.POS16;
        this.f6Plate = this.trackingData.POS17;
        this.f7Plate = this.trackingData.POS18;
        this.f8Plate = this.trackingData.POS19;
        this.f9Plate = this.trackingData.POS20;
        this.f10Plate = this.trackingData.POS21;
        this.f11Plate = this.trackingData.POS22;
        this.f12Plate = this.trackingData.POS23;
        this.c1Plate = this.trackingData.POS24;
        this.c2Plate = this.trackingData.POS25;
        this.c3Plate = this.trackingData.POS26;
        this.coil1 = this.trackingData.POS27;
        this.coil2 = this.trackingData.POS28;
        this.coil3 = this.trackingData.POS29;
        this.coil4 = this.trackingData.POS30;
        this.millsStandStatus = this.trackingData.POS30;

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

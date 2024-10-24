// http://192.168.10.101:8077/Hotmill
// http://192.168.10.101:8082/api/hsmcc/hsm
// ranjan
// bsl@123
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

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { CdkDropListGroup } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-tracking-three-js",
  standalone: true,
  templateUrl: "./tracking-three-js.component.html",
  styleUrl: "./tracking-three-js.component.scss",
  imports: [CommonModule],
})
export class TrackingThreeJsComponent implements AfterViewInit {
  @ViewChild("canvas") canvasRef!: ElementRef<HTMLCanvasElement>;
  private labels: CSS2DObject[] = [];
  private zoomlabels: CSS2DObject[] = [];
  private scene!: THREE.Scene;
  private orcamera!: THREE.OrthographicCamera;
  private camera!: THREE.PerspectiveCamera;
  private currentCamera: THREE.Camera; // Variable to hold the current camera
  private useOrthographic: boolean = false;
  private renderer!: THREE.WebGLRenderer;
  labelRenderer = new CSS2DRenderer();
  private model!: THREE.Group;
  private controls!: OrbitControls; // Declare controls

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  selectedPartName: string = ""; // Store the selected component's name
  isColapsed: boolean = true;
  updateTag: any;
  updateZoomTag: any;
  tag: boolean = false;
  zoom: boolean = false;
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
  coiler1Strapper: string = "";
  coiler1Tilter: string = "";
  coiler2Strapper: string = "";
  coiler2Tilter: string = "";
  coiler3Strapper: string = "";
  coiler3Tilter: string = "";
  coiler4Strapper: string = "";
  coiler4Tilter: string = "";
  coilFinal1: string = "";
  coilFinal2: string = "";
  coilFinal3: string = "";
  coilFinal4: string = "";
  coilFinal5: string = "";
  coilFinal6: string = "";
  coilFinal7: string = "";
  coilFinal8: string = "";
  coilFinal9: string = "";
  coilFinal10: string = "";
  coilFinal11: string = "";
  coilFinal12: string = "";
  coilFinal13: string = "";
  coilFinal14: string = "";
  coilFinal15: string = "";
  coilFinal16: string = "";
  coilFinal17: string = "";
  coilFinal18: string = "";
  coilFinal19: string = "";
  stand6Status = "1";
  stand7Status = "1";
  stand8Status = "1";
  stand9Status = "1";
  stand10Status = "1";
  stand11Status = "1";
  stand12Status = "1";

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
  rollingseqModify = [];
  loading = true;
  status = "";
  millsStandStatus = "";
  ltc = "";
  shearTemp = "";
  coilTemp = "";
  imt = "";
  rt_w = [];
  ft_th = [];

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

    // window.addEventListener("resize", this.onWindowResize.bind(this), false); // Add resize listener

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
    if (this.tag) {
      this.showTag();
    }
  }

  toggleFlag(): void {
    this.flag = !this.flag; // Toggle the flag's value
  }
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
      const intersectionPoint = intersects[0].point;
      this.selectedPartName = intersectedObject.name;
      // console.log(intersectedObject);
      console.log("Click Position in 3D Space:", intersectionPoint);
      // this.drawTextOnCanvas(`Clicked part: ${this.selectedPartName}`);
      this.item = this.selectedPartName;
    } else {
      // this.drawTextOnCanvas('No part was clicked.');
    }
  }

  private initCameras() {
    // Initialize Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(
      1.0053592648786294,
      6.805748555764769,
      5.690522470597121
    );

    // Initialize Orthographic Camera
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 10; // Adjust this value to change the size of the view frustum
    this.orcamera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2, // left
      (frustumSize * aspect) / 2, // right
      frustumSize / 2, // top
      frustumSize / -2, // bottom
      0.1, // near plane
      1000 // far plane
    );
    this.orcamera.position.set(
      1.0053592648786294,
      6.805748555764769,
      5.690522470597121
    );

    // Set the initial active camera
    this.currentCamera = this.camera;
  }

  private toggleCamera() {
    this.resetCamera();
    this.useOrthographic = !this.useOrthographic;
    this.currentCamera = this.useOrthographic ? this.orcamera : this.camera;
    this.controls.object = this.currentCamera;
  }

  private initThreeJS() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    // this.scene.background = new THREE.Color(0x111111);
    // this.scene.background = null;
    this.initCameras();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(window.innerWidth - 2, window.innerHeight - 40);
    this.renderer.setPixelRatio(window.devicePixelRatio); // Handle high DPI screens

    // Handle resizing the window dynamically
    window.addEventListener("resize", () => this.onWindowResize());

    // Initialize the CSS2DRenderer for labels
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth - 2, window.innerHeight - 40);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    this.labelRenderer.domElement.style.pointerEvents = "none";
    document.body.appendChild(this.labelRenderer.domElement);

    // // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.update(); // Ensure controls are updated for damping

    // Add yellow directional light
    const yellowLight = new THREE.DirectionalLight(0xffff00, 1); // Yellow color (hex code: #ffff00)
    yellowLight.position.set(-5, 5, 5);
    this.scene.add(yellowLight);

    // const whiteLight = new THREE.DirectionalLight(0xffffff, 2); // Yellow color (hex code: #ffff00)
    // whiteLight.position.set(5, 2, -1);
    // this.scene.add(whiteLight);

    // Add orange directional light
    const orangeLight = new THREE.DirectionalLight(0xffa500, 1); // Orange color (hex code: #ffa500)
    orangeLight.position.set(5, -5, 5);
    this.scene.add(orangeLight);

    // Add an ambient light for overall soft lighting (light blue color)
    const ambientLight = new THREE.AmbientLight(0xadd8e6, 0.5); // Light blue (hex code: #add8e6)
    this.scene.add(ambientLight);
  }
  resetCamera() {
    this.camera.position.z = 5.4415139840108715;
    this.camera.position.x = 5.80241900127863;
    this.camera.position.y = 4.575380122497185;

    this.orcamera.position.set(
      7.985137535537665,
      3.4136345801138646,
      5.76447500418364
    );

    this.controls.target.set(
      2.8224093597773567,
      -2.082825686254486e-16,
      -0.24810180529617526
    );
    this.orcamera.zoom = 1.2277376631548256;

    this.orcamera.updateProjectionMatrix();
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }
  zoomView() {
    this.zoom = !this.zoom;

    if (this.zoom) {
      if (this.updateTag) {
        clearInterval(this.updateTag);
      }
      this.orcamera.position.set(
        11.203138293576298,
        4.229356214298246,
        4.332292258372877
      );
      this.orcamera.zoom = 2;
      this.controls.target.set(
        5.779865143071354,
        3.025351412851267e-17,
        -2.839618980379983
      );

      this.orcamera.updateProjectionMatrix();
      this.controls.update();
      if (this.tag) {
        this.labels.forEach((label) => {
          this.scene.remove(label);
        });
        if (this.updateTag) {
          clearInterval(this.updateTag);
        }
        this.showZoomdTag();
      }
    } else {
      if (this.tag) {
        this.zoomlabels.forEach((label) => {
          this.scene.remove(label);
        });
        if (this.updateZoomTag) {
          clearInterval(this.updateZoomTag);
        }
        this.showNormalTag();
      }
      this.resetCamera();
    }
  }
  log() {
    // console.log(this.orcamera.position);
    // console.log(this.orcamera.zoom);
    // console.log(this.controls.target);
    console.log(this.rollingseqModify)
    // console.log(this.camera.position);
    // console.log(this.camera.zoom);
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load("assets/models/scene.gltf", (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);
    });
    this.toggleCamera();
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
    this.renderer.render(this.scene, this.currentCamera);
    this.labelRenderer.render(this.scene, this.camera);
  }
  showTag() {
    // this.resetCamera();
    this.tag = !this.tag;

    if (this.tag) {
      this.controls.enabled = false;
      this.controls.update();
      if (this.zoom) {
        this.orcamera.position.set(
          11.203138293576298,
          4.229356214298246,
          4.332292258372877
        );
        this.orcamera.zoom = 2;
        this.controls.target.set(
          5.779865143071354,
          3.025351412851267e-17,
          -2.839618980379983
        );

        this.orcamera.updateProjectionMatrix();
        this.controls.update();

        this.showZoomdTag();
      } else {
        this.resetCamera();
        this.showNormalTag();
      }
    } else {
      this.labels.forEach((label) => {
        this.scene.remove(label);
      });
      this.zoomlabels.forEach((label) => {
        this.scene.remove(label);
      });
      if (this.updateTag) {
        clearInterval(this.updateTag);
      }
      if (this.updateZoomTag) {
        clearInterval(this.updateZoomTag);
      }

      this.controls.enabled = true;
      // this.controls.enableRotate = true;
      this.controls.update();
    }
  }

  showNormalTag() {
    const createDiv = (text, className) => {
      const div = document.createElement("div");
      div.className = className;
      div.textContent = text;
      div.style.color = "blue";
      return div;
    };

    const createDynamicDiv = (
      text: string,
      className: string,
      part: boolean,
      color = "green"
    ): HTMLDivElement => {
      const div = document.createElement("div");
      div.className = className;

      if (text) {
        part == true
          ? (div.innerHTML = text.replace(/-/g, "-<br>"))
          : (div.innerHTML = text);
      }
      div.style.color = color;
      div.style.fontWeight = "bold"; // Make text bold
      return div;
    };

    const material = new THREE.LineBasicMaterial({ color: 0x333333 }); // Red color

    const createLine = (start, end) => {
      const points = [];
      points.push(new THREE.Vector3(...start)); // Start point of the line (origin)
      points.push(new THREE.Vector3(...end)); // End point of the line
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      return line;
    };

    // Create an HTML label and attach it to the cube
    const div = createDiv("F6", "label");
    const div1 = createDiv("F7", "label");
    const div2 = createDiv("F8", "label");
    const div3 = createDiv("F9", "label");
    const div4 = createDiv("F10", "label");
    const div5 = createDiv("F11", "label");
    const div6 = createDiv("F12", "label");
    const div7 = createDiv("DS1", "label");
    const div8 = createDiv("RR2", "label");
    const div9 = createDiv("R3", "label");
    const div10 = createDiv("R4", "label");
    const div11 = createDiv("R5", "label");
    const div12 = createDiv("C1", "label");
    const div13 = createDiv("C2", "label");
    const div14 = createDiv("C3", "label");
    const div15 = createDiv("C4", "label");

    const div16 = createDynamicDiv(this.dischargedPlate, "label_dynamic", true);
    let secondPlate =
      this.r2Plate ||
      this.r2Plate ||
      this.r3Plate ||
      this.r4Plate ||
      this.r5Plate ||
      " ";
    let thirdPlate =
      this.d1Plate ||
      this.d2Plate ||
      this.shearPlate ||
      this.f6Plate ||
      this.f7Plate ||
      this.f8Plate ||
      this.f9Plate ||
      this.f10Plate ||
      this.f11Plate ||
      this.f12Plate ||
      " ";

    const div17 = createDynamicDiv(secondPlate, "label_dynamic", false);
    const div18 = createDynamicDiv(thirdPlate, "label_dynamic", false);

    const div19 = createDynamicDiv(
      this.ltc == "0" || this.ltc == null ? "" : "LCT " + this.ltc,
      "label_dynamic",
      false,
      "red"
    );
    const div20 = createDynamicDiv(
      this.shearTemp == "0" || this.shearTemp == null
        ? ""
        : "ST " + this.shearTemp,
      "label_dynamic",
      false,
      "red"
    );
    const div21 = createDynamicDiv(
      this.coilTemp == "0" || this.coilTemp == null
        ? ""
        : "CT " + this.coilTemp,
      "label_dynamic",
      false,
      "red"
    );
    const div22 = createDynamicDiv(
      this.imt == "0" || this.imt == null ? "" : "IMT " + this.imt,
      "label_dynamic",
      false,
      "red"
    );
    const div23 = createDynamicDiv(
      this.ft_th[0] == "0" || this.imt == null
        ? ""
        : "FT " + this.ft_th[0] + " | TH" + this.ft_th[1],
      "label_dynamic",
      false,
      "red"
    );
    const div24 = createDynamicDiv(
      this.rt_w[0] == "0" || this.imt == null
        ? ""
        : "RT " + this.rt_w[0] + " | W" + this.rt_w[1],
      "label_dynamic",
      false,
      "red"
    );
    this.updateTag = setInterval(() => {
      div16.innerHTML = this.dischargedPlate
        ? this.dischargedPlate.replace(/-/g, "-<br>")
        : "";
      div17.innerHTML =
        this.r2Plate ||
        this.r2Plate ||
        this.r3Plate ||
        this.r4Plate ||
        this.r5Plate ||
        " ";
      div18.innerHTML =
        this.d1Plate ||
        this.d2Plate ||
        this.shearPlate ||
        this.f6Plate ||
        this.f7Plate ||
        this.f8Plate ||
        this.f9Plate ||
        this.f10Plate ||
        this.f11Plate ||
        this.f12Plate ||
        " ";
      div19.innerHTML =
        this.ltc == "0" || this.ltc == null ? "" : "LCT " + this.ltc;
      div20.innerHTML =
        this.shearTemp == "0" || this.shearTemp == null
          ? ""
          : "ST " + this.shearTemp;
      div21.innerHTML =
        this.coilTemp == "0" || this.coilTemp == null
          ? ""
          : "CT " + this.coilTemp;
      div22.innerHTML =
        this.imt == "0" || this.imt == null ? "" : "IMT " + this.imt;
      div23.innerHTML =
        this.ft_th[0] == "0" || this.imt == null
          ? ""
          : "FT " + this.ft_th[0] + " | TH" + this.ft_th[1];
      div24.innerHTML =
        this.rt_w[0] == "0" || this.imt == null
          ? ""
          : "RT " + this.rt_w[0] + " | W" + this.rt_w[1];
    }, 3000);

    const label1 = new CSS2DObject(div);
    label1.position.set(-1.3, 1, -0.35);
    const label2 = new CSS2DObject(div1);
    label2.position.set(-1.6, -2, 0.369);
    const label3 = new CSS2DObject(div2);
    label3.position.set(0.091, 0.88, -0.34);
    const label4 = new CSS2DObject(div3);
    label4.position.set(0, -1.99, 0.36);
    const label5 = new CSS2DObject(div4);
    label5.position.set(1.25, 0.88, -0.35);
    const label6 = new CSS2DObject(div5);
    label6.position.set(1.45, -1.83, 0.36);
    const label7 = new CSS2DObject(div6);
    label7.position.set(2.4, 0.75, -0.35);

    const label8 = new CSS2DObject(div7);
    label8.position.set(-13.65, -2.8, 0.35);
    const label9 = new CSS2DObject(div8);
    label9.position.set(-11.5, -2.8, 0.36);
    const label10 = new CSS2DObject(div9);
    label10.position.set(-9.5, -2.6, 0.36);
    const label11 = new CSS2DObject(div10);
    label11.position.set(-5.5, 1.3, -0.35);
    const label12 = new CSS2DObject(div11);
    label12.position.set(-4.5, 1.2, -0.35);
    const label13 = new CSS2DObject(div12);
    label13.position.set(3.6, -0.98, 0.49);
    const label14 = new CSS2DObject(div13);
    label14.position.set(4.1, -0.98, 0.49);
    const label15 = new CSS2DObject(div14);
    label15.position.set(4.7, -0.98, 0.49);
    const label16 = new CSS2DObject(div15);
    label16.position.set(6.3, -0.8, 0.49);

    const label17 = new CSS2DObject(div16);
    label17.position.set(-16, -2, 0.49);
    const label18 = new CSS2DObject(div17);
    label18.position.set(-12.2, -4, 0.49);
    const label19 = new CSS2DObject(div18);
    label19.position.set(0.18, 2, 0.49);
    const label20 = new CSS2DObject(div19); // LCT
    label20.position.set(3.7, 1, 0.49);
    const label21 = new CSS2DObject(div20); // ST
    label21.position.set(-1.6, 1.1, 0.49);
    const label22 = new CSS2DObject(div21); // CT
    label22.position.set(5.3, -0.89, 0.49);
    const label23 = new CSS2DObject(div22); // IMT
    label23.position.set(3.3, 1.2, 0.49);
    const label24 = new CSS2DObject(div23); //FT|TH
    label24.position.set(3, 1.6, 0.49);
    const label25 = new CSS2DObject(div24); //RT|W
    label25.position.set(-1.6, 2, 0.49);

    const line = createLine([-1.03, 0.47, -0.35], [-1.03, 0.87, -0.35]);
    const line1 = createLine([-0.48, -0.413, 0.369], [-0.48, -0.813, 0.369]);
    const line2 = createLine([0.091, 0.48, -0.34], [0.091, 0.88, -0.34]);
    const line3 = createLine([0.65, -0.42, 0.36], [0.65, -0.82, 0.36]);
    const line4 = createLine([1.19, 0.48, -0.35], [1.19, 0.88, -0.35]);
    const line5 = createLine([1.74, -0.43, 0.36], [1.74, -0.83, 0.36]);
    const line6 = createLine([2.29, 0.48, -0.35], [2.29, 0.88, -0.35]);
    const line7 = createLine([-5.65, -0, 0.35], [-5.65, -0.76, 0.35]); //ds1
    const line8 = createLine([-5.01, -0.42, 0.36], [-5.01, -0.82, 0.36]);
    const line9 = createLine([-4.41, -0.43, 0.36], [-4.41, -0.83, 0.36]);
    const line10 = createLine([-3.8, 0.48, -0.35], [-3.8, 0.88, -0.35]);
    const line11 = createLine([-3.19, 0.48, -0.35], [-3.19, 0.88, -0.35]);

    const labels = Array.from({ length: 25 }, (_, i) => eval(`label${i + 1}`));

    const lines = [
      line,
      line1,
      line2,
      line3,
      line4,
      line5,
      line6,
      line7,
      line8,
      line9,
      line10,
      line11,
    ];

    labels.forEach((label) => {
      this.scene.add(label);
      this.labels.push(label);
    });

    lines.forEach((line) => {
      this.scene.add(line);
      this.labels.push(line);
    });
  }
  showZoomdTag() {
    const createDynamicDiv = (
      text: string,
      className: string,
      part: boolean,
      color = "green"
    ): HTMLDivElement => {
      const div = document.createElement("div");
      div.className = className;

      if (text) {
        part == true
          ? (div.innerHTML = text.replace(/-/g, "-<br>"))
          : (div.innerHTML = text);
      }
      div.style.color = color;
      div.style.fontWeight = "bold"; // Make text bold
      div.style.textAlign = "start";
      div.style.marginLeft = "105px";
      return div;
    };
    const material = new THREE.LineBasicMaterial({ color: 0x999999 }); // Red color
    const createLine = (start, end) => {
      const points = [];
      points.push(new THREE.Vector3(...start)); // Start point of the line (origin)
      points.push(new THREE.Vector3(...end)); // End point of the line
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      return line;
    };
    const line1 = createLine([3.65, 0.3, -1.32], [3.65, 2.4, -1.32]);
    const div1 = createDynamicDiv(this.coilFinal1, "label_dynamic", false);
    const label1 = new CSS2DObject(div1);
    label1.position.set(-4.3, 2.7, -1.32);

    const line2 = createLine([3.9, 0.3, -1.32], [3.9, 2.3, -1.32]);
    const div2 = createDynamicDiv(this.coilFinal2, "label_dynamic", false);
    const label2 = new CSS2DObject(div2);
    label2.position.set(-3.7, 2.5, -1.32);

    const line3 = createLine([4.12, 0.3, -1.32], [4.12, 2.3, -1.32]);
    const div3 = createDynamicDiv(this.coilFinal3, "label_dynamic", false);
    const label3 = new CSS2DObject(div3);
    label3.position.set(-3.3, 2.3, -1.32);

    const line4 = createLine([4.3, 0.3, -1.32], [4.3, 2.2, -1.32]);
    const div4 = createDynamicDiv(this.coilFinal4, "label_dynamic", false);
    const label4 = new CSS2DObject(div4);
    label4.position.set(-2.9, 2.1, -1.32);

    const line5 = createLine([4.5, 0.3, -1.32], [4.5, 2.1, -1.32]);
    const div5 = createDynamicDiv(this.coilFinal5, "label_dynamic", false);
    const label5 = new CSS2DObject(div5);
    label5.position.set(-2.5, 1.9, -1.32);

    const line6 = createLine([4.7, 0.3, -1.32], [4.7, 2, -1.32]);
    const div6 = createDynamicDiv(this.coilFinal6, "label_dynamic", false);
    const label6 = new CSS2DObject(div6);
    label6.position.set(-2.2, 1.7, -1.32);

    const line7 = createLine([4.9, 0.3, -1.32], [4.9, 1.9, -1.32]);
    const div7 = createDynamicDiv(this.coilFinal7, "label_dynamic", false);
    const label7 = new CSS2DObject(div7);
    label7.position.set(-1.8, 1.5, -1.32);

    const line8 = createLine([5.1, 0.3, -1.32], [5.1, 1.86, -1.32]);
    const div8 = createDynamicDiv(this.coilFinal8, "label_dynamic", false);
    const label8 = new CSS2DObject(div8);
    label8.position.set(-1.4, 1.3, -1.32);

    const line9 = createLine([5.3, 0.3, -1.32], [5.3, 1.8, -1.32]);
    const div9 = createDynamicDiv(this.coilFinal9, "label_dynamic", false);
    const label9 = new CSS2DObject(div9);
    label9.position.set(-0.9, 1.1, -1.32);

    const line10 = createLine([5.5, 0.3, -1.32], [5.5, 1.7, -1.32]);
    const div10 = createDynamicDiv(this.coilFinal10, "label_dynamic", false);
    const label10 = new CSS2DObject(div10);
    label10.position.set(-0.5, 0.9, -1.32);

    const line11 = createLine([5.7, 0.3, -1.32], [5.7, 1.6, -1.32]);
    const div11 = createDynamicDiv(this.coilFinal11, "label_dynamic", false);
    const label11 = new CSS2DObject(div11);
    label11.position.set(-0.1, 0.7, -1.32);

    const line12 = createLine([5.9, 0.3, -1.32], [5.9, 1.54, -1.32]);
    const div12 = createDynamicDiv(this.coilFinal12, "label_dynamic", false);
    const label12 = new CSS2DObject(div12);
    label12.position.set(0.25, 0.55, -1.32);

    const line13 = createLine([6.1, 0.3, -1.32], [6.1, 1.52, -1.32]);
    const div13 = createDynamicDiv(this.coilFinal13, "label_dynamic", false);
    const label13 = new CSS2DObject(div13);
    label13.position.set(0.65, 0.4, -1.32);

    const line14 = createLine([6.3, 0.3, -1.32], [6.3, 1.5, -1.32]);
    const div14 = createDynamicDiv(this.coilFinal14, "label_dynamic", false);
    const label14 = new CSS2DObject(div14);
    label14.position.set(1.1, 0.28, -1.32);

    const line15 = createLine([6.7, 0.3, -1.32], [6.7, 1.42, -1.32]);
    const div15 = createDynamicDiv(this.coilFinal15, "label_dynamic", false);
    const label15 = new CSS2DObject(div15);
    label15.position.set(1.9, 0.19, -1.32);

    const line16 = createLine([6.95, 0.3, -1.32], [6.95, 1.42, -1.32]);
    const div16 = createDynamicDiv(this.coilFinal16, "label_dynamic", false);
    const label16 = new CSS2DObject(div16);
    label16.position.set(2.3, 0.1, -1.32);

    const line17 = createLine([7.15, 0.3, -1.32], [7.15, 1.42, -1.32]);
    const div17 = createDynamicDiv(this.coilFinal17, "label_dynamic", false);
    const label17 = new CSS2DObject(div17);
    label17.position.set(2.69, 0.02, -1.32);

    const line18 = createLine([7.35, 0.3, -1.32], [7.35, 1.42, -1.32]);
    const div18 = createDynamicDiv(this.coilFinal18, "label_dynamic", false);
    const label18 = new CSS2DObject(div18);
    label18.position.set(3, -0.1, -1.32);

    const line19 = createLine([0, 0, 0], [0, 0, 0]);
    const div19 = createDynamicDiv(
      this.coil1 || this.coil2 || this.coil3 || this.coil4,
      "label_dynamic",
      false
    );
    const label19 = new CSS2DObject(div19);
    label19.position.set(-6, -8, 2);

    const line20 = createLine([6.7, -0.5, -1.32], [8, -0.5, -1.32]);
    const div20 = createDynamicDiv(
      this.coiler4Strapper,
      "label_dynamic",
      false
    );
    const label20 = new CSS2DObject(div20);
    label20.position.set(5, -5.5, -1.32);

    const line21 = createLine([6.9, -0.3, -1.32], [8.1, -0.3, -1.32]);
    const div21 = createDynamicDiv(this.coiler4Tilter, "label_dynamic", false);
    const label21 = new CSS2DObject(div21);
    label21.position.set(5, -4.9, -1.32);

    const line22 = createLine([5.2, 0.1, -0.8], [6, 0.8, -0.8]);
    const div22 = createDynamicDiv(this.coiler3Tilter, "label_dynamic", false);
    const label22 = new CSS2DObject(div22);
    label22.position.set(-0.6, -2.45, -1.32);

    const line23 = createLine([5, 0, -0.4], [6.2, 1.1, -0.4]);
    const div23 = createDynamicDiv(
      this.coiler3Strapper,
      "label_dynamic",
      false
    );
    const label23 = new CSS2DObject(div23);
    label23.position.set(-0.7, -2.1, -1.32);

    const line24 = createLine([5, 0.4, -0.4], [5.7, 1.2, -0.4]);
    const div24 = createDynamicDiv(this.coiler2Tilter, "label_dynamic", false);
    const label24 = new CSS2DObject(div24);
    label24.position.set(-2.2, -1.9, -1.32);

    const line25 = createLine([4.56, 0.19, -0.4], [5.6, 1.4, -0.4]);
    const div25 = createDynamicDiv(
      this.coiler2Strapper,
      "label_dynamic",
      false
    );
    const label25 = new CSS2DObject(div25);
    label25.position.set(-2.5, -1.6, -1.32);

    const line26 = createLine([4, 0.19, -0.4], [4.7, 1.6, -0.4]);
    const div26 = createDynamicDiv(
      this.coiler1Strapper,
      "label_dynamic",
      false
    );
    const label26 = new CSS2DObject(div26);
    label26.position.set(-4.5, -0.6, -1.32);

    const line27 = createLine([4.35, 0.3, -0.4], [4.9, 1.53, -0.4]);
    const div27 = createDynamicDiv(this.coiler1Tilter, "label_dynamic", false);
    const label27 = new CSS2DObject(div27);
    label27.position.set(-4.1, -0.8, -1.32);

    this.updateZoomTag = setInterval(() => {
      if (this.coilFinal1) {
        div1.innerHTML = this.coilFinal1;
        if (!this.zoomlabels.includes(label1)) {
          this.zoomlabels.push(label1, line1);
          this.scene.add(label1, line1);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label1 || line1
        );
        this.scene.remove(label1, line1);
      }
      if (this.coilFinal2) {
        div2.innerHTML = this.coilFinal2;
        if (!this.zoomlabels.includes(label2)) {
          this.zoomlabels.push(label2, line2);
          this.scene.add(label2, line2);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label2 || line2
        );
        this.scene.remove(label2, line2);
      }
      if (this.coilFinal3) {
        div3.innerHTML = this.coilFinal3;
        if (!this.zoomlabels.includes(label3)) {
          this.zoomlabels.push(label3, line3);
          this.scene.add(label3, line3);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label3 || line3
        );
        this.scene.remove(label3, line3);
      }
      if (this.coilFinal4) {
        div4.innerHTML = this.coilFinal4;
        if (!this.zoomlabels.includes(label4)) {
          this.zoomlabels.push(label4, line4);
          this.scene.add(label4, line4);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label4 || line4
        );
        this.scene.remove(label4, line4);
      }
      if (this.coilFinal5) {
        div5.innerHTML = this.coilFinal5;
        if (!this.zoomlabels.includes(label5)) {
          this.zoomlabels.push(label5, line5);
          this.scene.add(label5, line5);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label5 || line5
        );
        this.scene.remove(label5, line5);
      }
      if (this.coilFinal6) {
        div6.innerHTML = this.coilFinal6;
        if (!this.zoomlabels.includes(label6)) {
          this.zoomlabels.push(label6, line6);
          this.scene.add(label6, line6);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label6 || line6
        );
        this.scene.remove(label6, line6);
      }
      if (this.coilFinal7) {
        div7.innerHTML = this.coilFinal7;
        if (!this.zoomlabels.includes(label7)) {
          this.zoomlabels.push(label7, line7);
          this.scene.add(label7, line7);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label7 || line7
        );
        this.scene.remove(label7, line7);
      }
      if (this.coilFinal8) {
        div8.innerHTML = this.coilFinal8;
        if (!this.zoomlabels.includes(label8)) {
          this.zoomlabels.push(label8, line8);
          this.scene.add(label8, line8);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label8 || line8
        );
        this.scene.remove(label8, line8);
      }
      if (this.coilFinal9) {
        div9.innerHTML = this.coilFinal9;
        if (!this.zoomlabels.includes(label9)) {
          this.zoomlabels.push(label9, line9);
          this.scene.add(label9, line9);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label9 || line9
        );
        this.scene.remove(label9, line9);
      }
      if (this.coilFinal10) {
        div10.innerHTML = this.coilFinal10;
        if (!this.zoomlabels.includes(label10)) {
          this.zoomlabels.push(label10, line10);
          this.scene.add(label10, line10);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label10 || line10
        );
        this.scene.remove(label10, line10);
      }
      if (this.coilFinal11) {
        div11.innerHTML = this.coilFinal11;
        if (!this.zoomlabels.includes(label11)) {
          this.zoomlabels.push(label11, line11);
          this.scene.add(label11, line11);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label11 || line11
        );
        this.scene.remove(label11, line11);
      }
      if (this.coilFinal12) {
        div12.innerHTML = this.coilFinal12;
        if (!this.zoomlabels.includes(label12)) {
          this.zoomlabels.push(label12, line12);
          this.scene.add(label12, line12);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label12 || line12
        );
        this.scene.remove(label12, line12);
      }
      if (this.coilFinal13) {
        div13.innerHTML = this.coilFinal13;
        if (!this.zoomlabels.includes(label13)) {
          this.zoomlabels.push(label13, line13);
          this.scene.add(label13, line13);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label13 || line13
        );
        this.scene.remove(label13, line13);
      }
      if (this.coilFinal14) {
        div14.innerHTML = this.coilFinal14;
        if (!this.zoomlabels.includes(label14)) {
          this.zoomlabels.push(label14, line14);
          this.scene.add(label14, line14);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label14 || line14
        );
        this.scene.remove(label14, line14);
      }
      if (this.coilFinal15) {
        div15.innerHTML = this.coilFinal15;
        if (!this.zoomlabels.includes(label15)) {
          this.zoomlabels.push(label15, line15);
          this.scene.add(label15, line15);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label15 || line15
        );
        this.scene.remove(label15, line15);
      }
      if (this.coilFinal16) {
        div16.innerHTML = this.coilFinal16;
        if (!this.zoomlabels.includes(label16)) {
          this.zoomlabels.push(label16, line16);
          this.scene.add(label16, line16);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label16 || line16
        );
        this.scene.remove(label16, line16);
      }
      if (this.coilFinal17) {
        div17.innerHTML = this.coilFinal17;
        if (!this.zoomlabels.includes(label17)) {
          this.zoomlabels.push(label17, line17);
          this.scene.add(label17, line17);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label17 || line17
        );
        this.scene.remove(label17, line17);
      }
      if (this.coilFinal18) {
        div18.innerHTML = this.coilFinal18;
        if (!this.zoomlabels.includes(label18)) {
          this.zoomlabels.push(label18, line18);
          this.scene.add(label18, line18);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label18 || line18
        );
        this.scene.remove(label18, line18);
      }
      if (this.coiler4Strapper) {
        div20.innerHTML = this.coiler4Strapper;
        if (!this.zoomlabels.includes(label20)) {
          this.zoomlabels.push(label20, line20);
          this.scene.add(label20, line20);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label20 || line20
        );
        this.scene.remove(label20, line20);
      }
      if (this.coiler4Tilter) {
        div21.innerHTML = this.coiler4Tilter;
        if (!this.zoomlabels.includes(label21)) {
          this.zoomlabels.push(label21, line21);
          this.scene.add(label21, line21);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label21 || line21
        );
        this.scene.remove(label21, line21);
      }
      if (this.coiler3Tilter) {
        div22.innerHTML = this.coiler3Tilter;
        if (!this.zoomlabels.includes(label22)) {
          this.zoomlabels.push(label22, line22);
          this.scene.add(label22, line22);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label22 || line22
        );
        this.scene.remove(label22, line22);
      }
      if (this.coiler3Strapper) {
        div23.innerHTML = this.coiler3Strapper;
        if (!this.zoomlabels.includes(label23)) {
          this.zoomlabels.push(label23, line23);
          this.scene.add(label23, line23);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label23 || line23
        );
        this.scene.remove(label23, line23);
      }
      if (this.coiler2Tilter) {
        div24.innerHTML = this.coiler2Tilter;
        if (!this.zoomlabels.includes(label24)) {
          this.zoomlabels.push(label24, line24);
          this.scene.add(label24, line24);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label24 || line24
        );
        this.scene.remove(label24, line24);
      }
      if (this.coiler2Strapper) {
        div25.innerHTML = this.coiler2Strapper;
        if (!this.zoomlabels.includes(label25)) {
          this.zoomlabels.push(label25, line25);
          this.scene.add(label25, line25);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label25 || line25
        );
        this.scene.remove(label25, line25);
      }
      if (this.coiler1Strapper) {
        div26.innerHTML = this.coiler1Strapper;
        if (!this.zoomlabels.includes(label26)) {
          this.zoomlabels.push(label26, line26);
          this.scene.add(label26, line26);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label26 || line26
        );
        this.scene.remove(label26, line26);
      }
      if (this.coiler1Tilter) {
        div27.innerHTML = this.coiler1Tilter;
        if (!this.zoomlabels.includes(label27)) {
          this.zoomlabels.push(label27, line27);
          this.scene.add(label27, line27);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label27 || line27
        );
        this.scene.remove(label27, line27);
      }

      if (this.coil1 || this.coil2 || this.coil3 || this.coil4) {
        div19.innerHTML = this.coil1 || this.coil2 || this.coil3 || this.coil4;
        if (!this.zoomlabels.includes(label19)) {
          this.zoomlabels.push(label19, line19);
          this.scene.add(label19, line19);
        }
      } else {
        this.zoomlabels = this.zoomlabels.filter(
          (item) => item !== label19 || line19
        );
        this.scene.remove(label19, line19);
      }

      //  loopadd
    }, 1000);

    const coilFinals = [
      { coil: this.coilFinal1, label: label1, line: line1 },
      { coil: this.coilFinal2, label: label2, line: line2 },
      { coil: this.coilFinal3, label: label3, line: line3 },
      { coil: this.coilFinal4, label: label4, line: line4 },
      { coil: this.coilFinal5, label: label5, line: line5 },
      { coil: this.coilFinal6, label: label6, line: line6 },
      { coil: this.coilFinal7, label: label7, line: line7 },
      { coil: this.coilFinal8, label: label8, line: line8 },
      { coil: this.coilFinal9, label: label9, line: line9 },
      { coil: this.coilFinal10, label: label10, line: line10 },
      { coil: this.coilFinal11, label: label11, line: line11 },
      { coil: this.coilFinal12, label: label12, line: line12 },
      { coil: this.coilFinal13, label: label13, line: line13 },
      { coil: this.coilFinal14, label: label14, line: line14 },
      { coil: this.coilFinal15, label: label15, line: line15 },
      { coil: this.coilFinal16, label: label16, line: line16 },
      { coil: this.coilFinal17, label: label17, line: line17 },
      { coil: this.coilFinal18, label: label18, line: line18 },
      {
        coil: this.coil1 || this.coil2 || this.coil3 || this.coil4,
        label: label19,
        line: line19,
      },
      { coil: this.coiler4Strapper, label: label20, line: line20 },
      { coil: this.coiler4Tilter, label: label21, line: line21 },
      { coil: this.coiler3Tilter, label: label22, line: line22 },
      { coil: this.coiler3Strapper, label: label23, line: line23 },
      { coil: this.coiler2Tilter, label: label24, line: line24 },
      { coil: this.coiler2Strapper, label: label25, line: line25 },
      { coil: this.coiler1Strapper, label: label26, line: line26 },
      { coil: this.coiler1Tilter, label: label27, line: line27 },
    ];

    coilFinals.forEach(({ coil, label, line }) => {
      if (coil) {
        this.zoomlabels.push(label, line);
        this.scene.add(label, line);
      }
    });
  }

  colapse() {
    this.isColapsed = !this.isColapsed;
    console.log(this.status, this.loading);
  }
  private onWindowResize() {
    // Update camera aspect ratio and renderer size
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth - 2, window.innerHeight - 40);

    // If you are using a CSS2DRenderer for labels, update its size as well
    if (this.labelRenderer) {
      this.labelRenderer.setSize(
        window.innerWidth - 2,
        window.innerHeight - 40
      );
    }
  }

  updateEndCoil(mesh, meshName, meshCore, flag) {
    if (mesh.name == meshName) {
      if (flag) {
        mesh.visible = true;
        let parts = flag.split("-");
        if (parts[parts.length - 1][0] == "C") {
          (mesh.material as THREE.MeshStandardMaterial).color.set(0xbd4115);
        } else {
          (mesh.material as THREE.MeshStandardMaterial).color.set(0x1768ab);
        }
      } else {
        mesh.visible = false;
      }
    }
    if (mesh.name == meshCore) {
      if (flag) {
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    }
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
        const furnaceStatuses = {
          Furnace1: this.fur1,
          Furnace2: this.fur2,
          Furnace3: this.fur3,
          Furnace4: this.fur4,
        };

        const updateFurnaceMaterial = (
          mesh,
          status,
          activeColor,
          inactiveColor
        ) => {
          (mesh.material as THREE.MeshStandardMaterial).color.set(
            status ? activeColor : inactiveColor
          );
        };

        if (furnaceStatuses[mesh.name] !== undefined) {
          updateFurnaceMaterial(
            mesh,
            furnaceStatuses[mesh.name],
            0xffffff,
            0x6666fa
          );
        }
        // # UPDATE PLATES
        const plateStatuses = {
          Discharged: this.dischargedPlate,
          R1Plate: this.r1Plate,
          R2Plate: this.r2Plate,
          R3Plate: this.r3Plate,
          R4Plate: this.r4Plate,
          R5Plate: this.r5Plate,
          Delay1: this.d1Plate,
          Delay2: this.d2Plate,
          ShearPlate: this.shearPlate,
          F6Plate: this.f6Plate,
          F7Plate: this.f7Plate,
          F8Plate: this.f8Plate,
          F9Plate: this.f9Plate,
          F10Plate: this.f10Plate,
          F11Plate: this.f11Plate,
          F12Plate: this.f12Plate,
          C1Plate: this.c1Plate,
          C2Plate: this.c2Plate,
          C3Plate: this.c3Plate,
        };

        // Iterate through the plate statuses and set mesh visibility
        if (plateStatuses[mesh.name] !== undefined) {
          mesh.visible = !(
            plateStatuses[mesh.name] == "" || plateStatuses[mesh.name] == null
          );
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

        // if (mesh.name === "baseroler") {
        //   mesh.rotation.y -= 0.3;
        // }

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

        this.updateEndCoil(mesh, "coilend1A", "Core1A", this.coiler1Strapper);
        this.updateEndCoil(mesh, "coilend1B", "Core1B", this.coiler1Tilter);
        this.updateEndCoil(mesh, "coilend2A", "Core2A", this.coiler2Strapper);
        this.updateEndCoil(mesh, "coilend2B", "Core2B", this.coiler2Tilter);
        this.updateEndCoil(mesh, "coilend3A", "Core3A", this.coiler3Strapper);
        this.updateEndCoil(mesh, "coilend3B", "Core3B", this.coiler3Tilter);
        this.updateEndCoil(mesh, "coilend4A", "Core4A", this.coiler4Strapper);
        this.updateEndCoil(mesh, "coilend4B", "Core4B", this.coiler4Tilter);
        this.updateEndCoil(mesh, "finalcoil1", "finalCore1", this.coilFinal1);
        this.updateEndCoil(mesh, "finalcoil2", "finalCore2", this.coilFinal2);
        this.updateEndCoil(mesh, "finalcoil3", "finalCore3", this.coilFinal3);
        this.updateEndCoil(mesh, "finalcoil4", "finalCore4", this.coilFinal4);
        this.updateEndCoil(mesh, "finalcoil5", "finalCore5", this.coilFinal5);
        this.updateEndCoil(mesh, "finalcoil6", "finalCore6", this.coilFinal6);
        this.updateEndCoil(mesh, "finalcoil7", "finalCore7", this.coilFinal7);
        this.updateEndCoil(mesh, "finalcoil8", "finalCore8", this.coilFinal8);
        this.updateEndCoil(mesh, "finalcoil9", "finalCore9", this.coilFinal9);
        this.updateEndCoil(
          mesh,
          "finalcoil10",
          "finalCore10",
          this.coilFinal10
        );
        this.updateEndCoil(
          mesh,
          "finalcoil11",
          "finalCore11",
          this.coilFinal11
        );
        this.updateEndCoil(
          mesh,
          "finalcoil12",
          "finalCore12",
          this.coilFinal12
        );
        this.updateEndCoil(
          mesh,
          "finalcoil13",
          "finalCore13",
          this.coilFinal13
        );
        this.updateEndCoil(
          mesh,
          "finalcoil14",
          "finalCore14",
          this.coilFinal14
        );
        this.updateEndCoil(
          mesh,
          "finalcoil15",
          "finalCore15",
          this.coilFinal15
        );
        this.updateEndCoil(
          mesh,
          "finalcoil16",
          "finalCore16",
          this.coilFinal16
        );
        this.updateEndCoil(
          mesh,
          "finalcoil17",
          "finalCore17",
          this.coilFinal17
        );
        this.updateEndCoil(
          mesh,
          "finalcoil18",
          "finalCore18",
          this.coilFinal18
        );
        this.updateEndCoil(
          mesh,
          "finalcoil19",
          "finalCore19",
          this.coilFinal19
        );

        const speed = 0.15;
        // # UPDATE Roller
        if (this.r2Plate) {
          if (mesh.name === "R2UpB" || mesh.name === "R2UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "R2DownB" || mesh.name === "R2DownS") {
            mesh.rotation.y -= speed;
          }
        }
        if (this.r3Plate) {
          if (mesh.name === "R3UpB" || mesh.name === "R3UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "R3DownB" || mesh.name === "R3DownS") {
            mesh.rotation.y -= speed;
          }
        }
        if (this.r4Plate) {
          if (mesh.name === "R4UpB" || mesh.name === "R4UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "R4DownB" || mesh.name === "R4DownS") {
            mesh.rotation.y -= speed;
          }
        }

        if (this.r5Plate) {
          if (mesh.name === "R5UpB" || mesh.name === "R5UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "R5DownB" || mesh.name === "R5DownS") {
            mesh.rotation.y -= speed;
          }
        }
        if (this.f6Plate && this.stand6Status == "1") {
          if (mesh.name === "F6UpB" || mesh.name === "F6UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "F6DownB" || mesh.name === "F6DownS") {
            mesh.rotation.y -= speed;
          }
        }
        if (this.f7Plate && this.stand7Status == "1") {
          if (mesh.name === "F7UpB" || mesh.name === "F7UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "F7DownB" || mesh.name === "F7DownS") {
            mesh.rotation.y -= speed;
          }
        }
        if (this.f8Plate && this.stand8Status == "1") {
          if (mesh.name === "F8UpB" || mesh.name === "F8UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "F8DownB" || mesh.name === "F8DownS") {
            mesh.rotation.y -= speed;
          }
        }
        if (this.f9Plate && this.stand9Status == "1") {
          if (mesh.name === "F9UpB" || mesh.name === "F9UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "F9DownB" || mesh.name === "F9DownS") {
            mesh.rotation.y -= speed;
          }
        }
        if (this.f10Plate && this.stand10Status == "1") {
          if (mesh.name === "F10UpB" || mesh.name === "F10UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "F10DownB" || mesh.name === "F10DownS") {
            mesh.rotation.y -= speed;
          }
        }
        if (this.f11Plate && this.stand11Status == "1") {
          if (mesh.name === "F11UpB" || mesh.name === "F11UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "F11DownB" || mesh.name === "F11DownS") {
            mesh.rotation.y -= speed;
          }
        }
        if (this.f12Plate && this.stand12Status == "1") {
          if (mesh.name === "F12UpB" || mesh.name === "F12UpS") {
            mesh.rotation.y += speed;
          } else if (mesh.name === "F12DownB" || mesh.name === "F12DownS") {
            mesh.rotation.y -= speed;
          }
        }

        const updateRoughMaterial = (
          mesh,
          plateStatus,
          onColor = 0xfb9e14,
          offColor = 0x00458f
        ) => {
          mesh.material = (mesh.material as THREE.MeshStandardMaterial).clone();
          (mesh.material as THREE.MeshStandardMaterial).color.set(
            plateStatus ? onColor : offColor
          );
        };
        if (mesh.name === "R2R" || mesh.name === "R2L") {
          updateRoughMaterial(mesh, this.r2Plate);
        }
        if (mesh.name === "R3R" || mesh.name === "R3L") {
          updateRoughMaterial(mesh, this.r3Plate);
        }
        if (mesh.name === "R4R" || mesh.name === "R4L") {
          updateRoughMaterial(mesh, this.r4Plate);
        }
        if (mesh.name === "R5R" || mesh.name === "R5L") {
          updateRoughMaterial(mesh, this.r5Plate);
        }

        const updateStandMaterial = (
          mesh,
          standStatus,
          plateStatus,
          onColor = 0xfb9e14,
          offColor = 0x00458f,
          downColor = 0x222222
        ) => {
          if (standStatus == "0") {
            (mesh.material as THREE.MeshStandardMaterial).color.set(downColor);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(
              plateStatus ? onColor : offColor
            );
          }
        };

        if (mesh.name === "F6R") {
          updateStandMaterial(mesh, this.stand6Status, this.f6Plate);
        }
        if (mesh.name === "F7R") {
          updateStandMaterial(mesh, this.stand7Status, this.f7Plate);
        }
        if (mesh.name === "F8R") {
          updateStandMaterial(mesh, this.stand8Status, this.f8Plate);
        }
        if (mesh.name === "F9R") {
          updateStandMaterial(mesh, this.stand9Status, this.f9Plate);
        }
        if (mesh.name === "F10R") {
          updateStandMaterial(mesh, this.stand10Status, this.f10Plate);
        }
        if (mesh.name === "F11R") {
          updateStandMaterial(mesh, this.stand11Status, this.f11Plate);
        }
        if (mesh.name === "F12R") {
          updateStandMaterial(mesh, this.stand12Status, this.f12Plate);
        }

        if (mesh.name === "coilend") {
          const textureLoader = new THREE.TextureLoader();
          let texture;

          // Load the appropriate texture based on the condition
          if (this.flag) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load("assets/models/r.jpg", (newTexture) => {
              // Apply the new texture to the material
              (mesh.material as THREE.MeshStandardMaterial).map = newTexture;
              (mesh.material as THREE.MeshStandardMaterial).metalnessMap =
                newTexture;

              // Ensure the material is updated with the new texture
              (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
            });
          } else {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load("assets/models/b1.jpg", (newTexture) => {
              // Apply the new texture to the material
              (mesh.material as THREE.MeshStandardMaterial).map = newTexture;
              (mesh.material as THREE.MeshStandardMaterial).metalnessMap =
                newTexture;

              // Ensure the material is updated with the new texture
              (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
            });
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
        this.trackingData.FUR1STATUS == "0" ||
        this.trackingData.FUR1STATUS == null
          ? (this.fur1 = false)
          : (this.fur1 = true);
        this.trackingData.FUR2STATUS == "0" ||
        this.trackingData.FUR2STATUS == null
          ? (this.fur2 = false)
          : (this.fur2 = true);
        this.trackingData.FUR3STATUS == "0" ||
        this.trackingData.FUR3STATUS == null
          ? (this.fur3 = false)
          : (this.fur3 = true);
        this.trackingData.FUR4STATUS == "0" ||
        this.trackingData.FUR4STATUS == null
          ? (this.fur4 = false)
          : (this.fur4 = true);

        if (
          this.trackingData.ROLLINGSEQ == "" ||
          this.trackingData.ROLLINGSEQ == null
        ) {
          this.rollingseq = Array(20).fill("_-_-_-_-");
          this.rollingseqModify = this.rollingseq.map(item => {
            const [id, thick, width, dest, fur] = item.split('-');
            return { id: parseInt(id), thick: parseFloat(thick), width: parseInt(width), dest, fur: parseInt(fur) };
          });
        } else {
          this.rollingseq = this.trackingData.ROLLINGSEQ.split("|");
          this.rollingseqModify = this.rollingseq.map(item => {
            const [id, thick, width, grade, fur] = item.split('-');
            return { id: parseInt(id), thick: parseFloat(thick), width: parseInt(width), grade, fur: parseInt(fur) };
          });
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
        // this.dischargedPlate = "1084250-3.45-1280-PCR1K";
        this.r1Plate = this.trackingData.POS9;
        // this.r2Plate = "1084250-3.45-1280-PCR1K";
        this.r2Plate = this.trackingData.POS10;
        this.r3Plate = this.trackingData.POS11;
        this.r4Plate = this.trackingData.POS12;
        this.r5Plate = this.trackingData.POS13;
        this.d1Plate = this.trackingData.POS14;
        this.d2Plate = this.trackingData.POS15;
        // this.millsStandStatus = this.trackingData.MILLSTANDSTATUS;
        this.stand6Status = this.trackingData.MILLSTANDSTATUS[0];
        this.stand7Status = this.trackingData.MILLSTANDSTATUS[1];
        this.stand8Status = this.trackingData.MILLSTANDSTATUS[2];
        this.stand9Status = this.trackingData.MILLSTANDSTATUS[3];
        this.stand10Status = this.trackingData.MILLSTANDSTATUS[4];
        this.stand11Status = this.trackingData.MILLSTANDSTATUS[5];
        this.stand12Status = this.trackingData.MILLSTANDSTATUS[6];
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
        // this.coiler1Strapper = "1087102-2.70-1030-P3CR2K/DCR";
        // this.coiler1Tilter = "1087102-2.70-1030-P3CR2K/DCR";
        // this.coiler2Strapper = "1087102-2.70-1030-P3CR2K/DCR";
        // this.coiler2Tilter = "1087102-2.70-1030-P3CR2K/DCR";
        // this.coiler3Strapper = "1087102-2.70-1030-P3CR2K/DCR";
        // this.coiler3Tilter = "1087102-2.70-1030-P3CR2K/DCR";
        // this.coiler4Strapper = "1087102-2.70-1030-P3CR2K/DCR";
        // this.coiler4Tilter = "1087102-2.70-1030-P3CR2K/DCR";
        this.coiler1Strapper = this.trackingData.POS32;
        this.coiler1Tilter = this.trackingData.POS33;
        this.coiler2Strapper = this.trackingData.POS34;
        this.coiler2Tilter = this.trackingData.POS35;
        this.coiler3Strapper = this.trackingData.POS36;
        this.coiler3Tilter = this.trackingData.POS37;
        this.coiler4Strapper = this.trackingData.POS38;
        this.coiler4Tilter = this.trackingData.POS39;
        this.millsStandStatus = this.trackingData.POS3;
        // this.ltc = "44";
        // this.shearTemp = "23";
        // this.coilTemp = "134";
        // this.imt = "36";
        this.ltc = this.trackingData.CT;
        this.shearTemp = this.trackingData.SHEAR;
        this.coilTemp = this.trackingData.DCT;
        this.imt = this.trackingData.FIN2;
        this.ft_th[0] = this.trackingData.FIN1;
        this.ft_th[1] = this.trackingData.FMEXTHICK;
        this.rt_w[0] = this.trackingData.R5EXIT;
        this.rt_w[1] = this.trackingData.R5EXITWID;

        for (let i = 1; i <= 18; i++) {
          this[`coilFinal${i}`] = this.trackingData[`POS${39 + i}`];
          // this[`coilFinal${i}`] = "all";
        }
        this.coilFinal19 = this.trackingData.ttc4;
        if (this.loading == true) {
          this.showTag();
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

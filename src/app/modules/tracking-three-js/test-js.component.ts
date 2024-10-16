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
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { CdkDropListGroup } from "@angular/cdk/drag-drop";


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
  private ctx!: CanvasRenderingContext2D;
  private scene!: THREE.Scene;
  private orcamera!: THREE.OrthographicCamera;
  private camera!: THREE.PerspectiveCamera;
  private currentCamera: THREE.Camera; // Variable to hold the current camera
  private useOrthographic: boolean = false;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Group;
  private controls!: OrbitControls; // Declare controls

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  selectedPartName: string = ""; // Store the selected component's name
  isColapsed: boolean = true;
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
  stand6Status = "0";
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
  loading = true;
  status = "";
  millsStandStatus = "";

  constructor(
    private reportService: ReportService,
    private commonService: CommonService
  ) { }



  ngAfterViewInit(): void {
    this.intervalId = setInterval(() => {
      this.toggleFlag();
    }, 2000); // 2000 milliseconds = 2 seconds
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
      this.selectedPartName = intersectedObject.name;
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
    this.camera.position.set(1.0053592648786294, 6.805748555764769, 5.690522470597121);
    
    // Initialize Orthographic Camera
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 10; // Adjust this value to change the size of the view frustum
    this.orcamera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2, // left
        frustumSize * aspect / 2,  // right
        frustumSize / 2,           // top
        frustumSize / -2,          // bottom
        0.1,                       // near plane
        1000                       // far plane
    );
    this.orcamera.position.set(1.0053592648786294, 6.805748555764769, 5.690522470597121);
    
    // Set the initial active camera
    this.currentCamera = this.camera; 
}

private toggleCamera() {
    this.useOrthographic = !this.useOrthographic; // Toggle the flag

    // Set the current camera based on the flag
    this.currentCamera = this.useOrthographic ? this.orcamera : this.camera;

    // If needed, adjust the controls to work with the current camera
    this.controls.object = this.currentCamera;
}



  private initThreeJS() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    // this.scene.background = null;
    this.initCameras()



    
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvasRef.nativeElement,
        });
        this.renderer.setSize(window.innerWidth - 2, window.innerHeight - 40);


       
            // // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;


    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        const textGeometry = new TextGeometry("Hello, Three.js!", {
          font: font,
          size: 0.1, // Increase size to make it more visible
          height: 0.01,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.001,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        // Create a material
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        // Create a mesh
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Set the position of the text
        textMesh.position.set(1, 1, 0); // Center the text

        // Add text to the scene
        this.scene.add(textMesh);
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the font:", error);
      }
    );


    // Add yellow directional light
    const yellowLight = new THREE.DirectionalLight(0xffff00, 1); // Yellow color (hex code: #ffff00)
    yellowLight.position.set(-5, 5, 5);
    this.scene.add(yellowLight);

    // Add orange directional light
    const orangeLight = new THREE.DirectionalLight(0xffa500, 2); // Orange color (hex code: #ffa500)
    orangeLight.position.set(5, -5, 5);
    this.scene.add(orangeLight);

    // Add an ambient light for overall soft lighting (light blue color)
    const ambientLight = new THREE.AmbientLight(0xadd8e6, 0.5); // Light blue (hex code: #add8e6)
    this.scene.add(ambientLight);


  
  
  }
  resetCamera() {
    this.camera.position.z = 5.690522470597121;
    this.camera.position.x = 1.0053592648786294;
    this.camera.position.y = 6.805748555764769;
    this.orcamera.position.set(1.7747427605749255, 7.387531416655268, 3.711868119160359);
    this.controls.target.set(-0.028482466462984878, 1.2318590585064277e-17, -1.0884730652746188); 
    if (this.orcamera instanceof THREE.OrthographicCamera) {
      const aspect = window.innerWidth / window.innerHeight;
      const frustumSize = 10; // Base size
      // Adjust frustum size based on the zoom factor
      this.orcamera.left = (frustumSize * aspect / -2) ;
      this.orcamera.right = (frustumSize * aspect / 2) ;
      this.orcamera.top = frustumSize / 2 ;
      this.orcamera.bottom = frustumSize / -2 ;
      this.orcamera.zoom=1;
      this.orcamera.updateProjectionMatrix(); 
  }
    this.controls.update();
  }
  zoomView(){

    this.orcamera.position.set( 8.40194719278616,  7.862986526100946, 3.9672717138291755);
    this.orcamera.zoom=2;
    this.controls.target.set( 5.84282973405875,  4.0861666065376056e-17, -1.542720771805631); 
    this.orcamera.updateProjectionMatrix(); 
    this.controls.update();
  }



  private loadModel() {
    const loader = new GLTFLoader();
    loader.load("assets/models/scenee.gltf", (gltf) => {
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
    this.renderer.render(this.scene, this.currentCamera);
  }
  showTag() {
    this.tag = !this.tag;
    // console.log(this.orcamera,this.controls);
    if(this.tag){
      this.resetCamera()
      this.controls.enabled = false;
      this.controls.update();
    }else{
      this.controls.enabled = true;
      this.controls.update();
    }



  
  }

  colapse() {

    this.isColapsed = !this.isColapsed;
    console.log(this.status,this.loading)
  }
  private onWindowResize() {
    // Update camera aspect ratio and renderer size
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateEndCoil(mesh, meshName, meshCore, flag) {
    if (mesh.name == meshName) {
      if (flag) {
        mesh.visible = true;
        let parts = flag.split("-");
        if (parts[parts.length - 1][0] == "C") {
          (mesh.material as THREE.MeshStandardMaterial).color.set(0xC64D00);
        } else {
          (mesh.material as THREE.MeshStandardMaterial).color.set(0x1E69B1);
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

        if (mesh.name === "F6R") {
          if (this.stand6Status == "0") {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x888888);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x00458f);
          }
        }
        if (mesh.name === "F7R") {
          if (this.stand7Status == "0") {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x888888);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x00458f);
          }
        }
        if (mesh.name === "F8R") {
          if (this.stand8Status == "0") {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x888888);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x00458f);
          }
        }
        if (mesh.name === "F9R") {
          if (this.stand9Status == "0") {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x888888);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x00458f);
          }
        }
        if (mesh.name === "F10R") {
          if (this.stand10Status == "0") {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x888888);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x00458f);
          }
        }
        if (mesh.name === "F11R") {
          if (this.stand11Status == "0") {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x888888);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x00458f);
          }
        }
        if (mesh.name === "F12R") {
          if (this.stand12Status == "0") {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x888888);
          } else {
            (mesh.material as THREE.MeshStandardMaterial).color.set(0x00458f);
          }
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

        if (this.trackingData.ROLLINGSEQ == "" || this.trackingData.ROLLINGSEQ == null ) {
          this.rollingseq = Array(20).fill("__");
        } else {
          this.rollingseq = this.trackingData.ROLLINGSEQ.split("|");
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
        this.coiler1Strapper = this.trackingData.POS32;
        this.coiler1Tilter = this.trackingData.POS33;
        this.coiler2Strapper = this.trackingData.POS34;
        this.coiler2Tilter = this.trackingData.POS35;
        this.coiler3Strapper = this.trackingData.POS36;
        this.coiler3Tilter = this.trackingData.POS37;
        this.coiler4Strapper = this.trackingData.POS38;
        this.coiler4Tilter = this.trackingData.POS39;
        this.millsStandStatus = this.trackingData.POS3;
        this.coilFinal1 = this.trackingData.POS40;
        this.coilFinal2 = this.trackingData.POS41;
        this.coilFinal3 = this.trackingData.POS42;
        this.coilFinal4 = this.trackingData.POS43;
        this.coilFinal5 = this.trackingData.POS44;
        this.coilFinal6 = this.trackingData.POS45;
        this.coilFinal7 = this.trackingData.POS46;
        this.coilFinal8 = this.trackingData.POS47;
        this.coilFinal9 = this.trackingData.POS48;
        this.coilFinal10 = this.trackingData.POS49;
        this.coilFinal11 = this.trackingData.POS50;
        this.coilFinal12 = this.trackingData.POS51;
        this.coilFinal13 = this.trackingData.POS52;
        this.coilFinal14 = this.trackingData.POS53;
        this.coilFinal15 = this.trackingData.POS54;
        this.coilFinal16 = this.trackingData.POS55;
        this.coilFinal17 = this.trackingData.POS56;
        this.coilFinal18 = this.trackingData.POS57;
        this.coilFinal19 = this.trackingData.ttc4;

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

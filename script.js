import Lenis from "https://esm.sh/@studio-freight/lenis";
import * as THREE from "https://esm.sh/three@0.136.0";
import { GLTFLoader } from "https://esm.sh/three@0.136.0/examples/jsm/loaders/GLTFLoader";
import { gsap } from "https://esm.sh/gsap@3.12.5";
import { ScrollTrigger } from "https://esm.sh/gsap@3.12.5/ScrollTrigger";
import { SplitText } from "https://esm.sh/gsap/SplitText";





document.addEventListener("DOMContentLoaded",()=>{
gsap.registerPlugin(ScrollTrigger, SplitText);

});
let CurrentScroll = 0;


// ✅ Smooth scroll setup with Lenis

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

lenis.on("scroll", (e) => {
  CurrentScroll = e.scroll;
  // now we are storing this scroll position
  // but what does it exactally return?
});

const header1Split = new SplitText(".header1 h1",{
  type: "chars",
  // create an array of each characters so each header one chanracter will now lie in a char div
  charsClass:"char",
  // this will be the class name of each div .char for storing each letter
  // but we also need to to put them in spans for more control on the text we do that later
});

const titleSplits= new SplitText(".tooltip .title h2",{
  type: "lines",
  linesClass:"line",
});
const descriptionSplits = new SplitText (".tooltip .description p",{
  type:"lines",
  linesClass:"line"
});
header1Split.chars.forEach(
  (char)=>(char.innerHTML=`<span>${char.innerHTML}</span>`)
);
[...titleSplits.lines , ...descriptionSplits.lines].forEach(
  (line)=>(line.innerHTML= `<span>${line.innerHTML}</span>`)
)
// This is JavaScript's spread operator, and it's used to “unpack” the values inside arrays.

// So here’s what’s happening:
// If you did: [titleSplits.lines, descriptionSplits.lines]
// [
//   [line1, line2],  // ← an array of title lines
//   [line3, line4]   // ← an array of description lines
// ]
// With ...
// [
//   line1, line2, line3, line4
// ]
// .forEach((line) => (line.innerHTML = `<span>${line.innerHTML}</span>`))




const animOptions = {duration:1,ease:"power3.out", stagger:0.025}

const tooltipSelectors=[{
  trigger:0.65,
  //when the scroll reaches around 65% i want to animate icon titles lines and description lines
  elements:[
    ".tooltip:nth-child(1) .icon ion-icon",
    ".tooltip:nth-child(1) .title .line >span",
    ".tooltip:nth-child(1) .description .line >span"
  ]
},{
  // then around 85% i want to animate some other things and those we store here
  trigger:0.85,
  elements:[
    ".tooltip:nth-child(2) .icon ion-icon",
    ".tooltip:nth-child(2) .title .line >span",
    ".tooltip:nth-child(2) .description .line >span"
  ]
  // we can easily loop over these groups later and animate each set based on scroll progress
}];







ScrollTrigger.create({
  trigger:".Product-overview",
  start:"75% bottom",
  // means the trigger starts when the .product is when the .product is 75% complete and there is 25% left for product to hit the bottom of the view port
  onEnter:()=>{
    // on enter we are animating all the span wrapped characters inside the first header by sliding them up into view from below
    gsap.to(".header1 h1 .char>span",{
      y:"0%",
      duration:1,
      ease:"Power3.out",
      // there is power3 what is it?
      stagger:0.25
      // stagger is so that each character come one after the other  
    });   
  },
  onLeaveBack:()=>{
    gsap.to(".header1 h1 .char>span",{
      y:"100%",
      duration:1,
      ease:"Power3.out",
      // there is power3 what is it?
      stagger:0.25
      // what is stagger?
      //this is the smooth letter by letter rolling effect we saw earlier
    }); 
  }
});

let model;
let currentRotation=0;
let modelSize;
const scene= new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
);

const renderer= new THREE.WebGLRenderer({antialias:true, alpha:true});
// renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// the below chat gpt game and and its awesome
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// the below is a bit different

renderer.toneMAppingExposure=1.0;
document.querySelector(".model-container").appendChild(renderer.domElement);


scene.add(new THREE.AmbientLight(0xffffff,0.7));


// Lighting
const mainLight=new THREE.DirectionalLight(0xffffff,1);
mainLight.position.set(1,2,3);
mainLight.castShadow=true;
mainLight.shadow.bias= -0.001;
mainLight.shadow.mapSize.width=1024;
mainLight.shadow.mapSize.height=1024;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffffff,1);
fillLight.position.set(-2,0,-2);
scene.add(fillLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);




// this funciton is amazing hehe
function setupModel(){
  if(!model||!modelSize){
    return;
  }
  const isMobile= window.innerWidth<1000;
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.set(
  isMobile? center.x +modelSize.x*1:-center.x-modelSize.x*0.1,
  // you can chnage the multipliers as per the model
  -center.y+modelSize.y*0.015,
  

  -center.z

);
model.rotation.z= isMobile ? 0:THREE.MathUtils.degToRad(-125);
const cameraDistance = isMobile?2:1.25;

camera.position.set(0,0,Math.max(modelSize.x,modelSize.y,modelSize.z));
camera.lookAt(0,0,0);
}



const loader= new GLTFLoader();

loader.load("assets/orbital_camera.glb",
  function(gltf){
  model=gltf.scene;
    model.traverse((node)=>{
      if(node.isMesh && node.material){
        Object.assign(node.material,{
          metalness:0.5,
          roughness: 0.4,
        });
      }
    });
    const box = new THREE.Box3().setFromObject(model);
    const size= box.getSize(new THREE.Vector3());
    modelSize= size;
    scene.add(model);
    setupModel();
    // we call our setup model function to position it correctly
},function(xhr){},function(error){
  console.log(error);
});


function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
}
animate();


// This is how to chnage the model based on the window size , as we dont use normal things to do this like @meadia of something no

window.addEventListener("resize",()=>{

  // we will update the cameras aspect ration and projection matrix, resize the renender adn rerun setup model function so the model always stays properly framed
  camera.aspect= window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  // now that we update that we can rerun the setup model function
  renderer.setSize(window.innerWidth,window.innerHeight);
  // we also need to resize the renenderer so that it renders on the correct place
  setupModel();
});

// now we connect everything to the scroll time line and animate the model and the UI
const scrollLength = window.innerHeight * 10;
// we have extended the section to 10 full viewpot height below
ScrollTrigger.create({

  trigger: ".Product-overview",
  start: "top top",
  end: '+='+scrollLength,
  //this is like the sticky height
  pin: true,
  pinSpacing:true,
  //to maintian flow
  scrub:1,
  // scrub will like the progeress to the scroll so everythig moves in sync with how fast or slow the user scrolls
  onUpdate:({progress})=>{
    // alright here we revieve a progress value this value ranges from 0 to 1 and tell me exactally how far we are from the scroll timeline
    const headerProgress= Math.max(0,Math.min(1,(progress-0.05)/0.3));
    // now i start animating based on the scroll progress
    gsap.to(".header1",{
      xPercent:
      progress<0.05?0:progress >0.35?-100:-100 * headerProgress,
      // i want this page to scroll from right to left if the progress of the page is <0.5 meaing we are not there yet we wont scroll, if its not less that 0.5 now we cheak if it greater than 0.35 then fully we are on the other page of header2 so -100 otherwise whatever percent is there
      //ultimatly till 0.5 no scrolling required from 0.5 to 0.35 that is the entire header1 we scroll need to scroll in the hearder is (1 to 0.35) but we 
      // only scroll if above 0.5 , then we scroll based on the percentage of headerprogress as you saw we multiplied by 100,
      // as soon as its above 0.35 we are done with header1 page
      // the reason we wrote this
      // const headerProgress= Math.max(0,Math.min(1(progress-0.05)/0.3));
      // so that header remains between 0 to 1 like if its 0.56 then 56% of the page we are on
      // is because of the fact that w
      // he says we will normalise the scroll rage from 5 % to 35%
      // here we want the TEXT to scroll form right to left
      // this is i belive the entire concept you can use for horizantal scrolling its just plane gsap
      
    });
    //OUT OF THE FIRST GSAP
    // WE ALSO SAW THE CIRCULAR MASK COMMING IN NOW 
    // NOTICE : NOW "as" WE MOVE Ahead we want it to come so that can also be achieved based ont he scroll progress
    // the scroll heeader is outside gsap so till 0.35 we had header 1 now we will have header2 then the circular mask
    // even the size of the mask we can calculate based on where we are in that specific range
    // below 20% the mask stays hidden about 30 percent its fully epanded
  //  const maskSize = progress<0.7?0:progress>0.9?100:100*((progress-0.7)/0.2);
    //   OKAY I FIGURED SOMETHING OUT that 0.7 is the starting percent so 70% that 0.9 the ending so like 90% its fully grown , that 0.7 is what we have to subtract as then we will get values again from 0.7-0.7 to 0.75 to 0.75 when in the section between 0.7 to 0.9 we can get till 0.9-0.7 that is 0.2 so this section was for 20% of the entire , note we are not changing the "prgress" as it represent the whole progress we are just using it

    const maskSize = progress<0.2?0:progress>0.3?100:100*((progress-0.2)/0.1);
     gsap.to(".circular-mask",{
      clipPath: `circle(${maskSize}% at 50% 50%)`
      // we scale it proportonaly using linear interpolation
     });
      // for the header two he said to map it between 15% and 50% sp 50-15 =35% 
      const header2Position= (progress-0.15)/0.35;
      console.log(header2Position);
            //I JUST NOTICED THINK header2Position LIKE THE DISTANCE TRAVELLED IN HEADER2 / FULL HEADER2
      const header2Xpercent= progress <0.35 ?100 :progress>0.5 ? -200 :100-300*header2Position;
      // so the header starts completely off screan to the right at 100 % 
      // by the mid point it moves across and exits to the left at -200%
      //if <0.15 no motion it stays at 100, if between 0.15 to 0.5 then then from that (100) that was where it starts we subtract 300*header2position i am not sure why are we doing 300 here 
      gsap.to(".header2",{
        xPercent:header2Xpercent,
        // as for the continious motion it follows we calc in
        // now this xpercent is an interpolated vaule 
      });

      const scaleX=progress<0.45?0:progress>0.65?100:100*((progress-0.45)/0.2);
      gsap.to(".tooltip .divider",{
        scaleX:`${scaleX}`, ...animOptions
      });

      // now we loop over the tool tip selector array efined earlier
      tooltipSelectors.forEach(({trigger,elements})=>{
        gsap.to(elements,{
          y:progress>=trigger?"0%":"125%",
          ...animOptions
          // if they have reached that point so for tooltip1 we we will put the tool tip to 0% of y that is there respetive positioin otherwise i put them outside by 125% down
        
        });
      });

      // now we rotate the model
      if(model && progress>=0.05){
        const rotationProgress = (progress -0.05)/0.95;
        // ew make it scroll between 5% to 100 %
        // thats our scroll range
        const targetRotation=Math.PI *3*4* rotationProgress;
        // so like 6 rounds with within the whole scroll progress
        // its says 3 full roations done 4 time for a total of 12 full spins
        const rotationDiff= targetRotation-currentRotation;
        if(Math.abs(rotationDiff)>0.001){
          model.rotateOnAxis(new THREE.Vector3(0,1,0),rotationDiff);
          // notice the rotate on axis
          currentRotation=targetRotation;
        }
      }
  }

});
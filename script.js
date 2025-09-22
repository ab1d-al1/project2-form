// ----------------- Supabase -----------------
const SUPABASE_URL = "https://uixkuiofypivrsghkehn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpeGt1aW9meXBpdnJzZ2hrZWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NjQzODMsImV4cCI6MjA3NDA0MDM4M30.2Ircydm6-V11Qmv8FthJNpleu23HxLUteqZzH1YJZlE";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Form submission
document.getElementById('waitlist-form').addEventListener('submit', async e=>{
  e.preventDefault();
  const inputs = e.target.querySelectorAll(".form-input");
  const name = inputs[0].value;
  const email = inputs[1].value;
  const subject = inputs[2].value;

  const { error } = await supabase.from("leads").insert([{ name, email, subject }]);
  if(error){
    alert("❌ Error: " + error.message);
  } else {
    alert("✅ Thank you! Your data was saved.");
    e.target.reset();
  }
});

// ----------------- Three.js -----------------
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.z = 50;

  renderer = new THREE.WebGLRenderer({canvas:document.getElementById('three-canvas'), alpha:true, antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Particles
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const colors = [];
  for(let i=0;i<600;i++){
    vertices.push((Math.random()-0.5)*200,(Math.random()-0.5)*200,(Math.random()-0.5)*200);
    const silver = Math.random();
    colors.push(0.7+silver*0.3,0.7+silver*0.3,0.7+silver*0.3);
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices),3));
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors),3));
  particles = new THREE.Points(geometry, new THREE.PointsMaterial({size:2, vertexColors:true, transparent:true, opacity:0.8, blending:THREE.AdditiveBlending}));
  scene.add(particles);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff,0.3));
  const pointLight = new THREE.PointLight(0xffffff,0.8,100);
  pointLight.position.set(0,0,20);
  scene.add(pointLight);

  // Floating shapes
  for(let i=0;i<5;i++){
    let shape;
    switch(Math.floor(Math.random()*3)){
      case 0: shape = new THREE.Mesh(new THREE.OctahedronGeometry(2), new THREE.MeshPhongMaterial({color:0xc0c0c0, wireframe:true, transparent:true, opacity:0.3})); break;
      case 1: shape = new THREE.Mesh(new THREE.TetrahedronGeometry(2), new THREE.MeshPhongMaterial({color:0xffffff, wireframe:true, transparent:true, opacity:0.2})); break;
      case 2: shape = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5), new THREE.MeshPhongMaterial({color:0x808080, wireframe:true, transparent:true, opacity:0.4})); break;
    }
    shape.position.set((Math.random()-0.5)*100,(Math.random()-0.5)*100,(Math.random()-0.5)*50);
    shape.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    scene.add(shape);
  }

  animate();
}

function animate(){
  requestAnimationFrame(animate);
  const time = Date.now()*0.0005;

  if(particles && particles.rotation){ particles.rotation.x = time*0.1; particles.rotation.y = time*0.2; }

  camera.position.x += (mouseX - camera.position.x)*0.05;
  camera.position.y += (-mouseY - camera.position.y)*0.05;
  camera.lookAt(scene.position);

  scene.children.forEach((child,index)=>{
    if(child instanceof THREE.Mesh && child.rotation){
      child.rotation.x += 0.005;
      child.rotation.y += 0.01;
      child.position.y += Math.sin(time+index)*0.1;
    }
  });

  renderer.render(scene,camera);
}

document.addEventListener('mousemove', e=>{
  mouseX = (e.clientX - window.innerWidth/2)*0.01;
  mouseY = (e.clientY - window.innerHeight/2)*0.01;
});

window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Custom Fluid Shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = vUv;
    uv -= 0.5;
    float dist = length(uv - uMouse * 0.5);
    uv += sin(uv * 10.0 + uTime) * 0.05 * (1.0 - dist);
    float d = length(uv);
    vec3 color = palette(d + uTime * 0.2);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function FluidBackground({ mouse }) {
  const mesh = useRef();
  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  });

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.elapsedTime;
    uniforms.current.uMouse.value.lerp(mouse.current, 0.1);
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[10, 10, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        wireframe={false}
      />
    </mesh>
  );
}

function Hero() {
  const mouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className="h-screen relative">
      <Canvas>
        <FluidBackground mouse={mouse} />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h1 className="text-8xl font-bold mix-blend-difference text-white">Your Name</h1>
          <p className="text-4xl mt-4 mix-blend-difference">Creative Developer</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const aboutRef = useRef();

  useEffect(() => {
    const lenis = new Lenis({ smooth: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));

    gsap.fromTo(aboutRef.current.children, 
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, stagger: 0.3, duration: 1.5, scrollTrigger: { trigger: aboutRef.current, start: 'top 80%' } }
    );

    return () => lenis.destroy();
  }, []);

  return (
    <>
      <Hero />
      <section ref={aboutRef} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-purple-900/20">
        <div className="max-w-4xl text-center px-8">
          <h2 className="text-6xl font-bold mb-12">About Me</h2>
          <p className="text-2xl leading-relaxed">
            Crafting surreal digital experiences with shaders, animations, and modern web tech.
          </p>
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="text-xl">React</div>
            <div className="text-xl">WebGL/Shaders</div>
            <div className="text-xl">GSAP</div>
          </div>
        </div>
      </section>

      {/* Add Projects/Contact sections similarly with more GSAP effects */}

      <footer className="py-12 text-center">
        <p>&copy; 2025 Your Name</p>
      </footer>
    </>
  );
}
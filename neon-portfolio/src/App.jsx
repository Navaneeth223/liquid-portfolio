import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Particles from 'particles.js';

gsap.registerPlugin(ScrollTrigger);

function CustomCursor() {
  const cursorRef = useRef();
  const trailRef = useRef([]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trails = trailRef.current;

    const moveCursor = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
      trails.forEach((trail, i) => {
        gsap.to(trail, { x: e.clientX, y: e.clientY, duration: 0.3 + i * 0.05, delay: i * 0.02 });
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Simple trail dots
    for (let i = 0; i < 10; i++) {
      const dot = document.createElement('div');
      dot.className = 'fixed w-4 h-4 bg-cyan-400 rounded-full pointer-events-none mix-blend-difference opacity-70';
      dot.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(dot);
      trails.push(dot);
    }

    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div ref={cursorRef} className="fixed w-8 h-8 bg-purple-500 rounded-full pointer-events-none mix-blend-screen z-50 translate-x-[-50%] translate-y-[-50%]" />
  );
}

export default function App() {
  useEffect(() => {
    gsap.from('.hero-text', { opacity: 0, y: 100, duration: 1.5, stagger: 0.3 });

    gsap.to('.section', {
      opacity: 1,
      y: 0,
      scrollTrigger: { trigger: '.section', start: 'top 80%' },
      stagger: 0.2,
    });
  }, []);

  return (
    <>
      <CustomCursor />
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="text-center z-10">
          <h1 className="hero-text text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Your Name</h1>
          <p className="hero-text text-4xl mt-8">Interactive Developer</p>
          <p className="hero-text text-2xl mt-4">Hover & Scroll to Feel the Magic</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20" />
      </section>

      <section className="section min-h-screen flex items-center justify-center opacity-0 translate-y-20">
        <div className="grid grid-cols-3 gap-8 max-w-5xl">
          {[1,2,3,4,5,6].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)' }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center cursor-pointer"
            >
              <h3 className="text-2xl mb-4">Project {i}</h3>
              <p>Interactive card with neon glow</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section min-h-screen flex items-center justify-center opacity-0 translate-y-20 bg-gradient-to-t from-cyan-900/20">
        <div className="text-center max-w-3xl">
          <h2 className="text-6xl font-bold mb-12">About Me</h2>
          <p className="text-2xl">Building playful, interactive web experiences with modern tools like Framer Motion & GSAP.</p>
        </div>
      </section>

      <footer className="py-12 text-center">
        <p>&copy; 2025 Your Name</p>
      </footer>
    </>
  );
}
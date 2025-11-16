'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LoadingPageProps {
  onComplete: () => void;
}

export function LoadingPage({ onComplete }: LoadingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTitle, setShowTitle] = useState(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x3d4464);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create text bubbles
    const bubbles: THREE.Mesh[] = [];
    const bubbleCount = 20;
    
    const bubbleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const bubbleMaterial = new THREE.MeshBasicMaterial({
      color: 0x5a6088,
      transparent: true,
      opacity: 0.8,
      wireframe: false,
    });

    // Create speech bubble shape for center bubble
    const centerBubbleGeometry = new THREE.Group();
    
    // Use rounded rectangle by creating a shape with rounded corners
    const bubbleShape = new THREE.Shape();
    const width = 1.4; // Smaller to fit inside circle
    const height = 1.0; // Smaller to fit inside circle
    const radius = 0.2; // Corner radius
    
    bubbleShape.moveTo(-width/2 + radius, -height/2);
    bubbleShape.lineTo(width/2 - radius, -height/2);
    bubbleShape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius);
    bubbleShape.lineTo(width/2, height/2 - radius);
    bubbleShape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2);
    bubbleShape.lineTo(-width/2 + radius, height/2);
    bubbleShape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius);
    bubbleShape.lineTo(-width/2, -height/2 + radius);
    bubbleShape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2);
    
    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: false
    };
    
    const bubbleGeom = new THREE.ExtrudeGeometry(bubbleShape, extrudeSettings);
    const mainBubble = new THREE.Mesh(
      bubbleGeom,
      new THREE.MeshBasicMaterial({ color: 0xa8c5db, transparent: true, opacity: 0.9 })
    );
    mainBubble.position.set(0, 0.2, -0.15);
    
    const tailGeometry = new THREE.ConeGeometry(0.2, 0.4, 3);
    const tail = new THREE.Mesh(
      tailGeometry,
      new THREE.MeshBasicMaterial({ color: 0xa8c5db, transparent: true, opacity: 0.9 })
    );
    tail.rotation.z = Math.PI;
    tail.position.set(-0.4, -0.65, 0);
    
    centerBubbleGeometry.add(mainBubble);
    centerBubbleGeometry.add(tail);
    centerBubbleGeometry.position.set(0, 0, 0);
    scene.add(centerBubbleGeometry);

    // Add dots inside center bubble
    const dotGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x5a6088 });
    
    const dot1 = new THREE.Mesh(dotGeometry, dotMaterial);
    dot1.position.set(-0.4, 0.2, 0.2);
    centerBubbleGeometry.add(dot1);
    
    const dot2 = new THREE.Mesh(dotGeometry, dotMaterial);
    dot2.position.set(0, 0.2, 0.2);
    centerBubbleGeometry.add(dot2);
    
    const dot3 = new THREE.Mesh(dotGeometry, dotMaterial);
    dot3.position.set(0.4, 0.2, 0.2);
    centerBubbleGeometry.add(dot3);

    // Create surrounding bubbles
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial.clone());
      
      // Random position around the scene
      const angle = (i / bubbleCount) * Math.PI * 2;
      const radius = 5 + Math.random() * 5;
      bubble.position.x = Math.cos(angle) * radius;
      bubble.position.y = Math.sin(angle) * radius;
      bubble.position.z = -5 + Math.random() * 10;
      
      // Random scale
      const scale = 0.3 + Math.random() * 0.7;
      bubble.scale.set(scale, scale, scale);
      
      // Store velocity for animation
      bubble.userData = {
        velocityX: (Math.random() - 0.5) * 0.02,
        velocityY: (Math.random() - 0.5) * 0.02,
        velocityZ: (Math.random() - 0.5) * 0.01,
      };
      
      bubbles.push(bubble);
      scene.add(bubble);
    }

    // Create magnifying glass
    const magnifyingGlass = new THREE.Group();
    
    // Glass circle
    const glassGeometry = new THREE.RingGeometry(1.5, 1.7, 64);
    const glassMaterial = new THREE.MeshBasicMaterial({
      color: 0xa8c5db,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    magnifyingGlass.add(glass);
    
    // Handle - positioned to start from circle edge
    const handleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.8, 32);
    const handleMaterial = new THREE.MeshBasicMaterial({
      color: 0xa8c5db,
      transparent: true,
      opacity: 0,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(1.8, -1.8, 0);
    handle.rotation.z = Math.PI / 4;
    magnifyingGlass.add(handle);
    
    magnifyingGlass.position.set(0, 0, 10);
    magnifyingGlass.scale.set(0.1, 0.1, 0.1);
    scene.add(magnifyingGlass);

    // Animation variables
    let animationPhase = 0;
    const animationDuration = 4000; // Reduced animation time
    const startTime = Date.now();

    // Animation loop
    let animationFrameId: number;
    function animate() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Phase 1: Bubbles floating (0-0.4)
      if (progress < 0.4) {
        bubbles.forEach((bubble) => {
          bubble.position.x += bubble.userData.velocityX;
          bubble.position.y += bubble.userData.velocityY;
          bubble.position.z += bubble.userData.velocityZ;
          
          bubble.rotation.x += 0.01;
          bubble.rotation.y += 0.01;

          // Bounce at boundaries
          if (Math.abs(bubble.position.x) > 10) bubble.userData.velocityX *= -1;
          if (Math.abs(bubble.position.y) > 10) bubble.userData.velocityY *= -1;
          if (bubble.position.z > 5 || bubble.position.z < -5) bubble.userData.velocityZ *= -1;
        });

        centerBubbleGeometry.rotation.y += 0.005;
      }

      // Phase 2: Magnifying glass zoom in (0.4-0.65)
      if (progress >= 0.4 && progress < 0.65) {
        const zoomProgress = (progress - 0.4) / 0.25;
        const easeProgress = 1 - Math.pow(1 - zoomProgress, 3);
        
        // Fade in magnifying glass
        glassMaterial.opacity = easeProgress;
        handleMaterial.opacity = easeProgress;
        
        // Move magnifying glass forward and scale up
        magnifyingGlass.position.z = 10 - easeProgress * 10;
        const scale = 0.1 + easeProgress * 1.9;
        magnifyingGlass.scale.set(scale, scale, scale);
        
        // Fade out other bubbles
        bubbles.forEach((bubble) => {
          (bubble.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - easeProgress);
        });
        
        // Scale up center bubble
        const centerScale = 1 + easeProgress * 1.5;
        centerBubbleGeometry.scale.set(centerScale, centerScale, centerScale);
      }

      // Phase 3: Keep magnifying glass and bubble, show title (0.65-1.0)
      if (progress >= 0.65) {
        // Keep magnifying glass and bubble at full opacity
        glassMaterial.opacity = 1;
        handleMaterial.opacity = 1;
        mainBubble.material.opacity = 0.9;
        tail.material.opacity = 0.9;
        
        // Show title at the end
        if (progress >= 0.7 && !showTitle) {
          setShowTitle(true);
        }
      }

      renderer.render(scene, camera);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Animation complete, transition to main page
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }

    animate();

    // Handle window resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      hasAnimatedRef.current = false;
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bubbleGeometry.dispose();
      bubbleMaterial.dispose();
      glassGeometry.dispose();
      glassMaterial.dispose();
      handleGeometry.dispose();
      handleMaterial.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
    };
  }, [onComplete]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Title overlay - positioned below the magnifying glass and bubble */}
      <div className={`absolute inset-0 flex items-center justify-center pb-80 transition-opacity duration-1000 ${showTitle ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-7xl font-light tracking-wider bg-gradient-to-br from-[hsl(271_81%_56%)] to-[hsl(197_71%_73%)] bg-clip-text text-transparent">
          ToneLens
        </h1>
      </div>
    </div>
  );
}

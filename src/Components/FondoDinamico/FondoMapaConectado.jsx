import React, { useRef, useEffect } from 'react';

const FondoMapaConectado = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 }); 
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    let rotation = 0;
    const points = [];
    const bgParticles = []; 
    
    // CONFIGURACIÓN GENERAL
    const settings = {
      // baseRadius: Tamaño DESEADO en pantallas grandes.
      baseRadius: 420,          
      pointCount: 500,          
      rotationSpeed: 0.0015,    
      connectionDist: 50,       
      pingChance: 0.05,         
      globeRadius: 0, // Se calcula dinámicamente
      bgParticleCount: 150,     
    };

    // PALETAS DE COLORES (RGB Strings)
    const THEMES = {
      dark: {
        baseColor: '6, 182, 212',    // Cian Tech
        bgColorCenter: '20, 50, 70', // Azul Oscuro Profundo
        bgColorEdge: '10, 15, 30',   // Casi Negro
      },
light: {
      baseColor: '37, 99, 235',    // Azul Real fuerte (se mantiene igual)
      // Antes: 248, 250, 252 (Blanco) -> Ahora: Gris claro
      bgColorCenter: '206, 212, 220', 
      // Antes: 203, 213, 225 (Gris muy claro) -> Ahora: Gris medio
      bgColorEdge: '128, 143, 164',   
    }
    };

    // --- CLASES ---
    class BgParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.05; 
            this.vy = (Math.random() - 0.5) * 0.05;
            this.size = Math.random() * 1.5 + 0.5;
            this.baseAlpha = Math.random() * 0.3 + 0.1;
            this.alphaPhase = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = width; else if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height; else if (this.y > height) this.y = 0;
            this.alphaPhase += 0.01;
        }
        draw(color) {
            const currentAlpha = this.baseAlpha + Math.sin(this.alphaPhase) * 0.05;
            ctx.beginPath();
            ctx.fillStyle = `rgba(${color}, ${currentAlpha})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.fill();
        }
    }

    // --- SETUP ---
    const initGlobe = () => {
      points.length = 0; 
      const phi = Math.PI * (3 - Math.sqrt(5)); 
      for (let i = 0; i < settings.pointCount; i++) {
        const y = 1 - (i / (settings.pointCount - 1)) * 2; 
        const radius = Math.sqrt(1 - y * y); 
        const theta = phi * i; 
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        points.push({
          x: x * settings.globeRadius, y: y * settings.globeRadius, z: z * settings.globeRadius,
          originX: x * settings.globeRadius, originZ: z * settings.globeRadius,
          pulse: 0, 
        });
      }
    };

    const initBg = () => {
        bgParticles.length = 0;
        for(let i=0; i < settings.bgParticleCount; i++) {
            bgParticles.push(new BgParticle());
        }
    }

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      // --- CORRECCIÓN PARA MOBILE/F12 ---
      // Encontramos la dimensión más pequeña de la pantalla
      const minDimension = Math.min(width, height);
      
      // El radio será el menor valor entre:
      // 1. El radio base deseado (420px)
      // 2. El 45% de la dimensión más pequeña de la pantalla.
      // Esto asegura que siempre entre y deje margen.
      settings.globeRadius = Math.min(settings.baseRadius, minDimension * 0.45);

      initGlobe();
      initBg();
    };

    // --- ANIMACIÓN ---
    const animate = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const colors = isDark ? THEMES.dark : THEMES.light;
      const cx = width / 2;
      const cy = height / 2;

      // Fondo
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height));
      gradient.addColorStop(0, `rgb(${colors.bgColorCenter})`); 
      gradient.addColorStop(1, `rgb(${colors.bgColorEdge})`);   
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Polvo
      bgParticles.forEach(p => { p.update(); p.draw(colors.baseColor); });

      // Globo
      const mouseSpeed = (mouseRef.current.x - width / 2) * 0.00005;
      rotation += settings.rotationSpeed + mouseSpeed;

      const projectedPoints = points.map(p => {
        const rotX = p.originX * Math.cos(rotation) - p.originZ * Math.sin(rotation);
        const rotZ = p.originX * Math.sin(rotation) + p.originZ * Math.cos(rotation);
        // Ajustamos la escala de perspectiva según el tamaño del globo
        const depth = settings.globeRadius * 4; 
        const scale = depth / (depth - rotZ); 
        return { x: cx + rotX * scale, y: cy + p.y * scale, z: rotZ, scale: scale, original: p };
      });

      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < projectedPoints.length; i++) {
        const p1 = projectedPoints[i];
        if (p1.z < -settings.globeRadius * 0.2) continue; // Culling más suave

        if (p1.original.pulse > 0) p1.original.pulse -= 0.02; 
        else if (Math.random() < settings.pingChance && p1.z > 50) p1.original.pulse = 1; 

        const alpha = ((p1.z + settings.globeRadius) / (settings.globeRadius * 2)); 
        const isPulsing = p1.original.pulse > 0;
        
        ctx.beginPath();
        const pulseColor = isDark ? '255, 255, 255' : '0, 0, 0';
        ctx.fillStyle = isPulsing 
            ? `rgba(${pulseColor}, ${p1.original.pulse})` 
            : `rgba(${colors.baseColor}, ${alpha})`;
            
        const size = (isPulsing ? 2.5 : 1.5) * p1.scale;
        ctx.arc(p1.x, p1.y, size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < Math.min(i + 15, projectedPoints.length); j++) {
          const p2 = projectedPoints[j];
          if (p2.z < -settings.globeRadius * 0.2) continue;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < settings.connectionDist * p1.scale) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${colors.baseColor}, ${0.15 * alpha})`;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 transition-colors duration-700" />
  );
};

export default FondoMapaConectado;
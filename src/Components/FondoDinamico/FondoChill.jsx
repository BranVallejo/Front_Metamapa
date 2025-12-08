import React, { useRef, useEffect } from 'react';

const FondoChill = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  // Usamos el mouse para influir sutilmente en la corriente
  const mouseRef = useRef({ x: window.innerWidth/2, y: window.innerHeight/2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    
    const nodes = [];
    const bgParticles = [];

    // CONFIGURACIÓN "CHILL"
    const settings = {
      nodeCount: 70,           // Cantidad de nodos (menos que el globo para que sea limpio)
      connectionDist: 130,     // Distancia de conexión
      bgParticleCount: 100,    // Polvo de fondo
      nodeSpeedBase: 0.2,      // Velocidad base lenta
    };

    // PALETAS (Iguales al otro fondo para consistencia)
    const THEMES = {
      dark: {
        baseColor: '6, 182, 212',    // Cian Tech
        bgColorCenter: '20, 50, 70', // Azul Oscuro Profundo
        bgColorEdge: '10, 15, 30',   // Casi Negro
      },
      light: {
        baseColor: '37, 99, 235',    // Azul Real fuerte
        bgColorCenter: '248, 250, 252', // Slate-50
        bgColorEdge: '203, 213, 225',   // Slate-300
      }
    };

    // --- CLASE NODO FLOTANTE ORGANICO ---
    class FloatingNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        
        // Variables para movimiento orgánico (senoidal)
        this.angleX = Math.random() * Math.PI * 2;
        this.angleY = Math.random() * Math.PI * 2;
        this.speedX = Math.random() * settings.nodeSpeedBase + 0.1;
        this.speedY = Math.random() * settings.nodeSpeedBase + 0.1;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        // El movimiento es una combinación de deriva constante y una oscilación suave
        this.angleX += this.wobbleSpeed;
        this.angleY += this.wobbleSpeed;
        
        // Influencia sutil del mouse en la dirección general
        const driftX = (mouseRef.current.x - width/2) * 0.0001;
        const driftY = (mouseRef.current.y - height/2) * 0.0001;

        this.x += this.speedX * Math.cos(this.angleX) + driftX;
        this.y += this.speedY * Math.sin(this.angleY) + driftY;

        // Wrap around (aparecer del otro lado)
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
      }

      draw(color) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color}, 0.6)`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- CLASE POLVO DE FONDO (Igual que antes) ---
    class BgParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.05; this.vy = (Math.random() - 0.5) * 0.05;
            this.size = Math.random() * 1.5 + 0.5;
            this.baseAlpha = Math.random() * 0.2 + 0.05;
            this.alphaPhase = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
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
    const init = () => {
        nodes.length = 0;
        bgParticles.length = 0;
        for(let i=0; i < settings.nodeCount; i++) nodes.push(new FloatingNode());
        for(let i=0; i < settings.bgParticleCount; i++) bgParticles.push(new BgParticle());
    }

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    // --- ANIMACIÓN ---
    const animate = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const colors = isDark ? THEMES.dark : THEMES.light;
      const cx = width / 2; const cy = height / 2;

      // 1. Fondo Gradiente Atmosférico
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height));
      gradient.addColorStop(0, `rgb(${colors.bgColorCenter})`); 
      gradient.addColorStop(1, `rgb(${colors.bgColorEdge})`);   
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Polvo distante
      bgParticles.forEach(p => { p.update(); p.draw(colors.baseColor); });

      // 3. Nodos y Conexiones
      ctx.lineWidth = 0.5;
      nodes.forEach((node, i) => {
        node.update();
        node.draw(colors.baseColor);

        // Conectar con nodos cercanos
        for (let j = i + 1; j < nodes.length; j++) {
           const other = nodes[j];
           const dx = node.x - other.x;
           const dy = node.y - other.y;
           const dist = Math.sqrt(dx*dx + dy*dy);

           if (dist < settings.connectionDist) {
             const opacity = 1 - (dist / settings.connectionDist);
             ctx.beginPath();
             ctx.strokeStyle = `rgba(${colors.baseColor}, ${opacity * 0.2})`; // Líneas muy sutiles
             ctx.moveTo(node.x, node.y);
             ctx.lineTo(other.x, other.y);
             ctx.stroke();
           }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
        // Suavizamos el movimiento del mouse para que la influencia sea sutil
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };

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

export default FondoChill;
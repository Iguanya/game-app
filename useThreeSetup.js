function useThreeSetup(containerRef) {
    const container = useRef(containerRef.current || document.createElement('div'));
    const canvasRef = useRef();
  
    useEffect(() => {
      const container = container.current;
      const canvas = canvasRef.current;
  
      // Set up the scene
      const scene = new THREE.Scene();
  
      // Set up the camera
      const fov = 75;
      const aspect = canvas.clientWidth / canvas.clientHeight;
      const near = 0.1;
      const far = 1000;
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.z = 1;
  
      // Set up the renderer
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  
      // Add the container to the document body
      document.body.appendChild(container.current);
  
      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        // ...rest of the animation code...
      }
  
      animate();
    }, []);
  
    return {
      container: container.current,
      canvas: canvasRef.current,
    };
  }
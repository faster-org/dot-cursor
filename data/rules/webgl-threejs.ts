import { Rule } from "../types";

export const rule: Rule = {
	id: "webgl-threejs",
	slug: "webgl-threejs",
	title: "WebGL & Three.js Development",
	description: "Create immersive 3D web experiences using WebGL and Three.js library",
	content: `# Webgl Threejs

This document provides comprehensive guidelines for webgl threejs development and best practices.

---

## Three.js Fundamentals

1. **Scene,**
   - Scene, Camera, and Renderer architecture
   - Implement proper scene, camera, and renderer architecture
   - Follow best practices for optimal results

2. **Mesh**
   - Mesh creation with Geometry and Material
   - Implement proper mesh creation with geometry and material
   - Follow best practices for optimal results

3. **Lighting**
   - Lighting systems (Ambient, Directional, Point, Spot)
   - Implement proper lighting systems (ambient, directional, point, spot)
   - Follow best practices for optimal results

4. **Animation**
   - Animation loops and frame timing
   - Implement proper animation loops and frame timing
   - Follow best practices for optimal results

5. **Object**
   - Object hierarchy and transformations
   - Implement proper object hierarchy and transformations
   - Follow best practices for optimal results

---

## Geometry & Meshes

6. **Built-in**
   - Built-in geometries (Box, Sphere, Plane, Cylinder)
   - Implement proper built-in geometries (box, sphere, plane, cylinder)
   - Follow best practices for optimal results

7. **Custom**
   - Custom geometry creation with BufferGeometry
   - Implement proper custom geometry creation with buffergeometry
   - Follow best practices for optimal results

8. **Vertex**
   - Vertex positions, normals, and UV coordinates
   - Implement proper vertex positions, normals, and uv coordinates
   - Follow best practices for optimal results

9. **Geometry**
   - Geometry merging and optimization
   - Implement proper geometry merging and optimization
   - Follow best practices for optimal results

10. **Instanced**
   - Instanced rendering for performance
   - Implement proper instanced rendering for performance
   - Follow best practices for optimal results

---

## Materials & Shaders

11. **Material**
   - Material types (Basic, Lambert, Phong, Standard, Physical)
   - Implement proper material types (basic, lambert, phong, standard, physical)
   - Follow best practices for optimal results

12. **Texture**
   - Texture mapping and UV coordinates
   - Implement proper texture mapping and uv coordinates
   - Follow best practices for optimal results

13. **Custom**
   - Custom shader development with GLSL
   - Implement proper custom shader development with glsl
   - Follow best practices for optimal results

14. **Shader**
   - Shader uniforms and attributes
   - Implement proper shader uniforms and attributes
   - Follow best practices for optimal results

15. **Post-processing**
   - Post-processing effects
   - Implement proper post-processing effects
   - Follow best practices for optimal results

---

## Camera Control

16. **Perspective**
   - Perspective and Orthographic cameras
   - Implement proper perspective and orthographic cameras
   - Follow best practices for optimal results

17. **Camera**
   - Camera movements and animations
   - Implement proper camera movements and animations
   - Follow best practices for optimal results

18. **OrbitControls**
   - OrbitControls for user interaction
   - Implement proper orbitcontrols for user interaction
   - Follow best practices for optimal results

19. **FirstPersonControls**
   - FirstPersonControls for navigation
   - Implement proper firstpersoncontrols for navigation
   - Follow best practices for optimal results

20. **Custom**
   - Custom camera behavior implementation
   - Implement proper custom camera behavior implementation
   - Follow best practices for optimal results

---

## Animation Systems

21. **Object**
   - Object transformation animations
   - Implement proper object transformation animations
   - Follow best practices for optimal results

22. **Skeletal**
   - Skeletal animation with bones
   - Implement proper skeletal animation with bones
   - Follow best practices for optimal results

23. **Morph**
   - Morph target animations
   - Implement proper morph target animations
   - Follow best practices for optimal results

24. **Animation**
   - Animation mixers and actions
   - Implement proper animation mixers and actions
   - Follow best practices for optimal results

25. **Tween**
   - Tween libraries integration (GSAP, Tween.js)
   - Implement proper tween libraries integration (gsap, tween.js)
   - Follow best practices for optimal results

---

## Lighting & Shadows

26. **Shadow**
   - Shadow mapping setup and optimization
   - Implement proper shadow mapping setup and optimization
   - Follow best practices for optimal results

27. **Light**
   - Light types and properties
   - Implement proper light types and properties
   - Follow best practices for optimal results

28. **Global**
   - Global illumination techniques
   - Implement proper global illumination techniques
   - Follow best practices for optimal results

29. **Environment**
   - Environment mapping and HDR
   - Implement proper environment mapping and hdr
   - Follow best practices for optimal results

30. **Tone**
   - Tone mapping and exposure
   - Implement proper tone mapping and exposure
   - Follow best practices for optimal results

---

## Performance Optimization

31. **Level**
   - Level of Detail (LOD) systems
   - Implement proper level of detail (lod) systems
   - Follow best practices for optimal results

32. **Frustum**
   - Frustum culling and occlusion
   - Implement proper frustum culling and occlusion
   - Follow best practices for optimal results

33. **Texture**
   - Texture optimization and compression
   - Implement proper texture optimization and compression
   - Follow best practices for optimal results

34. **Draw**
   - Draw call reduction techniques
   - Implement proper draw call reduction techniques
   - Follow best practices for optimal results

35. **Memory**
   - Memory management best practices
   - Implement proper memory management best practices
   - Follow best practices for optimal results

---

## Interaction & Physics

36. **Raycasting**
   - Raycasting for object picking
   - Implement proper raycasting for object picking
   - Follow best practices for optimal results

37. **Mouse**
   - Mouse and touch interaction handling
   - Implement proper mouse and touch interaction handling
   - Follow best practices for optimal results

38. **Physics**
   - Physics engine integration (Cannon.js, Ammo.js)
   - Implement proper physics engine integration (cannon.js, ammo.js)
   - Follow best practices for optimal results

39. **Collision**
   - Collision detection systems
   - Implement proper collision detection systems
   - Follow best practices for optimal results

40. **Interactive**
   - Interactive 3D UI elements
   - Implement proper interactive 3d ui elements
   - Follow best practices for optimal results

---

## Loading & Assets

41. **3D**
   - 3D model loading (GLTF, OBJ, FBX)
   - Implement proper 3d model loading (gltf, obj, fbx)
   - Follow best practices for optimal results

42. **Texture**
   - Texture loading and management
   - Implement proper texture loading and management
   - Follow best practices for optimal results

43. **Progress**
   - Progress tracking for large assets
   - Implement proper progress tracking for large assets
   - Follow best practices for optimal results

44. **Asset**
   - Asset compression and optimization
   - Implement proper asset compression and optimization
   - Follow best practices for optimal results

45. **CDN**
   - CDN integration for performance
   - Implement proper cdn integration for performance
   - Follow best practices for optimal results

---

## Advanced Features

46. **Particle**
   - Particle systems and effects
   - Implement proper particle systems and effects
   - Follow best practices for optimal results

47. **Water**
   - Water and fluid simulations
   - Implement proper water and fluid simulations
   - Follow best practices for optimal results

48. **Terrain**
   - Terrain generation and rendering
   - Implement proper terrain generation and rendering
   - Follow best practices for optimal results

49. **Virtual**
   - Virtual and Augmented Reality (WebXR)
   - Implement proper virtual and augmented reality (webxr)
   - Follow best practices for optimal results

50. **Procedural**
   - Procedural generation techniques
   - Implement proper procedural generation techniques
   - Follow best practices for optimal results

---

## Integration

51. **React**
   - React Three Fiber for React integration
   - Implement proper react three fiber for react integration
   - Follow best practices for optimal results

52. **A-Frame**
   - A-Frame for declarative VR/AR
   - Implement proper a-frame for declarative vr/ar
   - Follow best practices for optimal results

53. **Babylon.js**
   - Babylon.js as alternative framework
   - Implement proper babylon.js as alternative framework
   - Follow best practices for optimal results

54. **Integration**
   - Integration with frontend frameworks
   - Implement proper integration with frontend frameworks
   - Follow best practices for optimal results

55. **Backend**
   - Backend integration for multiplayer
   - Implement proper backend integration for multiplayer
   - Follow best practices for optimal results

---

## Deployment

56. **Bundle**
   - Bundle optimization for web
   - Implement proper bundle optimization for web
   - Follow best practices for optimal results

57. **Progressive**
   - Progressive loading strategies
   - Implement proper progressive loading strategies
   - Follow best practices for optimal results

58. **Mobile**
   - Mobile device optimization
   - Implement proper mobile device optimization
   - Follow best practices for optimal results

59. **WebGL**
   - WebGL compatibility checking
   - Implement proper webgl compatibility checking
   - Follow best practices for optimal results

60. **Cross-browser**
   - Cross-browser testing
   - Implement proper cross-browser testing
   - Follow best practices for optimal results

---

## Summary Checklist

- [ ] Core principles implemented
- [ ] Best practices followed
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Testing strategy implemented
- [ ] Documentation completed
- [ ] Monitoring configured
- [ ] Production deployment ready

---

Follow these comprehensive guidelines for successful webgl threejs implementation.`,
	categories: ["webgl", "threejs", "3d-graphics", "frontend"],
	tags: ["webgl", "threejs", "3d-graphics", "shaders", "animation"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};

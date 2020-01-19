/**
 * @fileoverview
 * This is our custom A-Frame component.
 * It is responsible for adding the outer wireframe mesh
 * and nodes to its vertices.
 */

AFRAME.registerComponent("lowpoly", {
  schema: {
    color: { type: "string", default: "#FFF" },
    nodes: { type: "boolean", default: false },
    opacity: { type: "number", default: 1.0 },
    wireframe: { type: "boolean", default: false }
  },

  init: function() {
    // Get the ref of the object to which the component is attached
    const obj = this.el.getObject3D("mesh");

    // Grab the reference to the main WebGL scene
    const scene = document.querySelector("a-scene").object3D;

    obj.material = new THREE.MeshPhongMaterial({
      color: this.data.color,
      shading: THREE.FlatShading
    });

    const frameGeom = new THREE.OctahedronGeometry(2.5, 2);

    const frameMat = new THREE.MeshPhongMaterial({
      color: "#FFFFFF",
      opacity: this.data.opacity,
      wireframe: true,
      transparent: true
    });

    const icosFrame = new THREE.Mesh(frameGeom, frameMat);

    const { x, y, z } = obj.parent.position;
    icosFrame.position.set(x, y, z);

    if (this.data.wireframe) {
      scene.add(icosFrame);
    }

    if (this.data.nodes) {
      let spheres = new THREE.Group();
      let vertices = icosFrame.geometry.vertices;

      // Traverse the vertices of the wireframe and attach small spheres
      for (var i in vertices) {
        // Create a basic sphere
        let geometry = new THREE.SphereGeometry(0.045, 16, 16);
        let material = new THREE.MeshBasicMaterial({
          color: "#FFFFFF",
          opacity: this.data.opacity,
          shading: THREE.FlatShading,
          transparent: true
        });

        let sphere = new THREE.Mesh(geometry, material);
        // Reposition them correctly
        sphere.position.set(
          vertices[i].x,
          vertices[i].y + 4,
          vertices[i].z + -10.0
        );

        spheres.add(sphere);
      }
      scene.add(spheres);
    }
  },

  update: function() {
    // Get the ref of the object to which the component is attached
    const obj = this.el.getObject3D("mesh");

    // Modify the color of the material during runtime
    obj.material.color = new THREE.Color(this.data.color);
  }
});

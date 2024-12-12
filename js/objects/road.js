export function createPath() {
    const pathGroup = new THREE.Group();
    
    // Create a winding path through the forest
    const curve = new THREE.CurvePath();
    
    // Create a more natural, winding path
    const points = [
        new THREE.Vector3(-30, 0, 20),
        new THREE.Vector3(-15, 0, 10),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(15, 0, -5),
        new THREE.Vector3(25, 0, -15)
    ];

    // Create natural curves between points
    for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];
        
        // Create control points for natural curves
        const midX = (start.x + end.x) / 2;
        const midZ = (start.z + end.z) / 2;
        const offset = 5 * (Math.random() - 0.5);
        
        const control1 = new THREE.Vector3(
            start.x + (midX - start.x) * 0.5 + offset,
            0,
            start.z + (midZ - start.z) * 0.5 + offset
        );
        
        const control2 = new THREE.Vector3(
            midX + (end.x - midX) * 0.5 + offset,
            0,
            midZ + (end.z - midZ) * 0.5 + offset
        );

        const curve1 = new THREE.CubicBezierCurve3(start, control1, control2, end);
        curve.add(curve1);
    }

    const pathPoints = curve.getPoints(100);
    
    // Create dirt path segments
    pathPoints.forEach((point, i) => {
        if (i < pathPoints.length - 1) {
            // Vary path width slightly for natural look
            const width = 2 + Math.random() * 0.5;
            const pathSegGeo = new THREE.PlaneGeometry(
                width,
                point.distanceTo(pathPoints[i + 1])
            );
            
            // Create dirt material with some variation
            const pathSegMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0x3b2d1d).multiplyScalar(0.8 + Math.random() * 0.4),
                roughness: 0.9,
                metalness: 0.1
            });
            
            const pathSeg = new THREE.Mesh(pathSegGeo, pathSegMat);
            
            // Position and orient path segment
            pathSeg.position.set(
                (point.x + pathPoints[i + 1].x) / 2,
                0.01, // Slightly above ground to prevent z-fighting
                (point.z + pathPoints[i + 1].z) / 2
            );
            
            pathSeg.lookAt(pathPoints[i + 1].x, 0.01, pathPoints[i + 1].z);
            pathSeg.rotateX(-Math.PI / 2);
            
            // Add some random rotation for more natural look
            pathSeg.rotation.z += (Math.random() - 0.5) * 0.1;
            
            pathGroup.add(pathSeg);
        }
    });

    return { pathGroup, pathPoints };
}

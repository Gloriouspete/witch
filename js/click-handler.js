import * as THREE from 'three';

export function setupClickHandler(camera, renderer, witchHouse) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHovering = false;
    let hoveringObject = null;
    let outlineMesh = null;

    function createOutline(object) {
        // Remove any existing outline
        if (outlineMesh) {
            scene.remove(outlineMesh);
        }

        // Create a box that encompasses the building
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Create slightly larger outline box
        const outlineGeo = new THREE.BoxGeometry(size.x * 1.05, size.y * 1.05, size.z * 1.05);
        const outlineMat = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
        outlineMesh.position.copy(center);
        outlineMesh.rotation.copy(object.rotation);
        scene.add(outlineMesh);
    }

    // Hover effect
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(window.scene.children, true);

        // Find hit object
        let hitObject = null;
        if (intersects.length > 0) {
            let obj = intersects[0].object;
            while (obj.parent && !(obj.type === 'Group' && (obj === witchHouse || obj.userData.isAlchemyBuilding || obj.userData.isExperimentLab))) {
                obj = obj.parent;
            }
            if (obj === witchHouse || obj.userData.isAlchemyBuilding || obj.userData.isExperimentLab) {
                hitObject = obj;
            }
        }

        // Reset hover if no hit or different object
        if (hoveringObject && (!hitObject || hitObject !== hoveringObject)) {
            if (outlineMesh) {
                scene.remove(outlineMesh);
                outlineMesh = null;
            }
            hoveringObject = null;
            isHovering = false;
            document.body.style.cursor = 'default';
        }

        // Set new hover state
        if (hitObject && (!isHovering || hoveringObject !== hitObject)) {
            document.body.style.cursor = 'pointer';
            createOutline(hitObject);
            isHovering = true;
            hoveringObject = hitObject;
        }
    });

    // Click handler
    window.addEventListener('click', async (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(window.scene.children, true);

        // Find hit object
        let hitObject = null;
        if (intersects.length > 0) {
            let obj = intersects[0].object;
            while (obj.parent && !(obj.type === 'Group' && (obj === witchHouse || obj.userData.isAlchemyBuilding || obj.userData.isExperimentLab))) {
                obj = obj.parent;
            }
            if (obj === witchHouse || obj.userData.isAlchemyBuilding || obj.userData.isExperimentLab) {
                hitObject = obj;
            }
        }

        if (hitObject) {
            // Flash effect
            const box = new THREE.Box3().setFromObject(hitObject);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            const flashGeo = new THREE.BoxGeometry(size.x * 1.05, size.y * 1.05, size.z * 1.05);
            const flashMat = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                transparent: true,
                opacity: 0.5,
                side: THREE.BackSide
            });
            const flash = new THREE.Mesh(flashGeo, flashMat);
            flash.position.copy(center);
            flash.rotation.copy(hitObject.rotation);
            scene.add(flash);

            setTimeout(() => {
                scene.remove(flash);
                
                if (hitObject === witchHouse) {
                    window.location.href = 'interior.html';
                } else if (hitObject.userData.isAlchemyBuilding) {
                    window.location.href = 'alchemy.html';
                } else if (hitObject.userData.isExperimentLab) {
                    window.location.href = 'dungeon.html';
                }
            }, 200);
        }
    });
}

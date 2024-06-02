import * as THREE from 'three';
import { MOVEMENT_SPEED } from './main.js'; // Ensure the extension is correct

export function moveCharacter(characterMesh, direction) {
    if (!characterMesh) return;

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(characterMesh.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(characterMesh.quaternion);

    switch (direction) {
        case 'forward':
            characterMesh.position.add(forward.clone().multiplyScalar(MOVEMENT_SPEED));
            break;
        case 'backward':
            characterMesh.position.add(forward.clone().multiplyScalar(-MOVEMENT_SPEED));
            break;
        case 'left':
            characterMesh.position.add(right.clone().multiplyScalar(-MOVEMENT_SPEED));
            break;
        case 'right':
            characterMesh.position.add(right.clone().multiplyScalar(MOVEMENT_SPEED));
            break;
        default:
            break;
    }
}

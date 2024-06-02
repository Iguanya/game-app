import * as THREE from 'three';
import { MOVEMENT_SPEED } from './main.js';

export function moveCharacter(characterMesh, direction, camera) {
    if (!characterMesh || !camera) return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up);

    const position = characterMesh.position.clone();

    switch (direction) {
        case 'forward':
            position.add(forward.clone().multiplyScalar(MOVEMENT_SPEED));
            break;
        case 'backward':
            position.add(forward.clone().multiplyScalar(-MOVEMENT_SPEED));
            break;
        case 'left':
            position.add(right.clone().multiplyScalar(-MOVEMENT_SPEED));
            break;
        case 'right':
            position.add(right.clone().multiplyScalar(MOVEMENT_SPEED));
            break;
        default:
            break;
    }

    // Ensure the character does not move below the ground
    if (position.y < 1) { // Adjust the minimum y position according to the character's new height
        position.y = 1;
    }

    characterMesh.position.copy(position);
}

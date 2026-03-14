import * as THREE from 'three';

/**
 * Checks for collision between player and obstacles
 * @param {THREE.Group} player - The player object
 * @param {Array} obstacles - Array of obstacle objects
 * @returns {boolean} - True if collision detected
 */
export function checkCollision(player, obstacles) {
    const playerBox = new THREE.Box3().setFromObject(player);

    for (let obstacle of obstacles) {
        if (obstacle.mesh && obstacle.mesh.parent) {
            const obstacleBox = new THREE.Box3().setFromObject(obstacle.mesh);

            if (playerBox.intersectsBox(obstacleBox)) {
                return true;
            }
        }
    }
    return false;
}

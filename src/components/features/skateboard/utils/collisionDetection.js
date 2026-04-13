import * as THREE from 'three';

const _playerBox = new THREE.Box3();
const _obstacleBox = new THREE.Box3();

/**
 * Checks for collision between player and obstacles
 * @param {THREE.Group} player - The player object
 * @param {Array} obstacles - Array of obstacle objects
 * @returns {boolean} - True if collision detected
 */
export function checkCollision(player, obstacles) {
    _playerBox.setFromObject(player);

    for (let obstacle of obstacles) {
        if (obstacle.mesh && obstacle.mesh.parent) {
            _obstacleBox.setFromObject(obstacle.mesh);
            if (_playerBox.intersectsBox(_obstacleBox)) {
                return true;
            }
        }
    }
    return false;
}

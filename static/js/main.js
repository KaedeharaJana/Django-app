import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { XYZLoader } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/loaders/XYZLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, clock, points, controls;

function init() {
    const container = document.getElementById('three-container'); // Новый контейнер

    if (!container) return; // Если контейнера нет, выходим

    // Удаляем старый рендерер (если есть)
    if (renderer) {
        renderer.dispose();
        container.innerHTML = '';
    }

    camera = new THREE.PerspectiveCamera(7, container.offsetWidth / container.offsetHeight, 0.1, 100);
    camera.position.set(10, 7, 10);

    scene = new THREE.Scene();
    scene.add(camera);
    scene.background = new THREE.Color(0x1a0a7a); // Задаем фон сцены

    camera.lookAt(scene.position);

    clock = new THREE.Clock();

    // Используем XYZLoader для загрузки .xyz файла
    const loader = new XYZLoader();
    loader.load('../model/helix_201.xyz', function (geometry) {
        // Центрируем геометрию
        geometry.center();

        // Проверяем наличие атрибута 'color' в геометрии (если есть, добавляем цвета)
        const vertexColors = geometry.hasAttribute('color');

        // Создаем материал для точек
        const material = new THREE.PointsMaterial({
            size: 0.3, // Размер точек
            vertexColors: vertexColors, // Если в геометрии есть цвета, используем их
            color: 0xff0000 // Цвет материала, если цвета в геометрии нет
        });

        // Создаем объект точек и добавляем в сцену
        points = new THREE.Points(geometry, material);
        scene.add(points);
    });

    // Инициализируем рендерер
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement); // Добавляем рендер в контейнер

    // Настроим OrbitControls для управления камерой
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;  // Плавное затухание вращения
    controls.dampingFactor = 0.05;  // Коэффициент затухания
    controls.enableZoom = false;    // Отключаем масштабирование

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const container = document.getElementById('three-container');
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight); // Обновляем размер рендера
}

function animate() {
    const delta = clock.getDelta();
    if (points) {
        points.rotation.x += delta * 0.2; // Поворот точек по оси X
        points.rotation.y += delta * 0.3; // Поворот точек по оси Y

        controls.update();  // Обновляем управление камерой в каждом кадре
    }
    renderer.render(scene, camera);
}

// Инициализация сцены после загрузки DOM
document.addEventListener('DOMContentLoaded', init);

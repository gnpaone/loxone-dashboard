import React, { useEffect, useState, useRef } from 'react';
import * as THREE from "three";
import styled from 'styled-components';

const Dashboard = () => {
    const [lightStatus, setLightStatus] = useState(false);
    const [ws, setWs] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const CamRef = useRef();
    const RenderRef = useRef();
    const SceneRef = useRef();
    const GroupRef = useRef();

    const [intensity, setIntensity] = useState(0);

    useEffect(() => {
        window.addEventListener("resize", updateDimensions);

        SceneRef.current = new THREE.Scene();
        // SceneRef.current.background = new THREE.Color(0xcce0ff);
        CamRef.current = new THREE.PerspectiveCamera(
            30,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );
        CamRef.current.position.set(0, 4.25, 15);
        SceneRef.current.add(CamRef.current);

        const canvas = document.querySelector("#c");
        RenderRef.current = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            aplpha: false,
        });
        RenderRef.current.setSize(window.innerWidth, window.innerHeight);
        RenderRef.current.shadowMap.enabled = true;
        RenderRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
        RenderRef.current.setClearColor(0xcce0ff, 0.5);
        RenderRef.current.gammaInput = true;
        RenderRef.current.gammaOutput = true;

        const groundGeo = new THREE.PlaneGeometry(100, 100);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.05,
        });
        groundMat.color.setHex(0xe81b05);
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        SceneRef.current.add(ground);

        ground.receiveShadow = true;

        GroupRef.current = new THREE.Group();
        // var intensity = 1;

        // Main bulb
        const bulbGeometry = new THREE.SphereGeometry(1, 32, 32);
        const bulbLight = new THREE.PointLight(0xffee88, intensity, 100, 2);
        const bulbMat = new THREE.MeshStandardMaterial({
            emissive: 0xffffee,
            emissiveIntensity: intensity,
            color: 0xffffee,
            metalness: 0.1,
            roughness: intensity + 0.1,
        });

        bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
        bulbLight.position.set(0, 2, 0);
        bulbLight.castShadow = true;

        var d = 200;
        bulbLight.shadow.camera.left = -d;
        bulbLight.shadow.camera.right = d;
        bulbLight.shadow.camera.top = d;
        bulbLight.shadow.camera.bottom = -d;
        bulbLight.shadow.camera.far = 100;

        // Stem
        const bulbStem = new THREE.CylinderGeometry(0.5, 0.65, 0.55, 32);
        const stemMat = new THREE.MeshStandardMaterial({
            color: 0xffffee,
            emissive: 0xffffee,
            emissiveIntensity: intensity,
            metalness: 0.1,
            roughness: intensity + 0.1,
        });

        const bStem = new THREE.Mesh(bulbStem, stemMat);
        bStem.position.set(0, 1, 0);
        bulbLight.add(bStem);

        // Plug main
        const bulbPlug = new THREE.CylinderGeometry(0.52, 0.52, 1.2, 32);
        const plugMat = new THREE.MeshStandardMaterial({
            color: 0x807d7a,
            metalness: 0.4,
            roughness: 0.2,
        });
        const plug = new THREE.Mesh(bulbPlug, plugMat);
        plug.position.set(0, 3.2, 0);
        plug.receiveShadow = true;
        plug.castShadow = true;

        // Plug top
        const topGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.2, 32);
        const topMat = new THREE.MeshStandardMaterial({
            color: 0x807d7a,
            metalness: 0.4,
            roughness: 0.2,
        });
        const plugTop = new THREE.Mesh(topGeo, topMat);
        plugTop.position.set(0, 3.75, 0);
        plugTop.receiveShadow = true;
        plugTop.castShadow = true;

        // Plug rings
        const ringGeo = new THREE.TorusGeometry(0.52, 0.04, 4, 100);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0x807d7a,
            metalness: 0.4,
            roughness: 0.2,
        });

        var ringY = 3.33;
        for (let i = 0; i < 3; i++) {
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.set(0, ringY, 0);
            GroupRef.current.add(ring);
            ringY += 0.15;
        }

        // Top ring
        const topRingGeo = new THREE.TorusGeometry(0.49, 0.05, 16, 100);
        const topRing = new THREE.Mesh(topRingGeo, ringMat);
        topRing.position.set(0, 3.75, 0);
        topRing.rotation.x = -Math.PI / 2;

        // Bottom ring
        const botRingGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
        const botRing = new THREE.Mesh(botRingGeo, ringMat);
        botRing.position.set(0, 3.15, 0);
        botRing.rotation.x = -Math.PI / 2;

        // Twisted wire curve
        class TwistedWireCurve extends THREE.Curve {
            constructor(scale = 1) {
                super();
                this.scale = scale;
            }

            getPoint(t) {
                const radius = 0.1;
                const length = 5;
                const twists = 10;

                const angle = twists * 2 * Math.PI * t;
                const x = radius * Math.cos(angle);
                const y = t * length;
                const z = radius * Math.sin(angle);

                return new THREE.Vector3(x, y, z).multiplyScalar(this.scale);
            }
        }

        // Create twisted wire
        const wireCurve = new TwistedWireCurve();
        const wireGeometry = new THREE.TubeGeometry(wireCurve, 200, 0.05, 8, false);
        const wireMaterial = new THREE.MeshStandardMaterial({
            color: 0x807d7a,
            metalness: 0.4,
            roughness: 0.2,
        });
        const twistedWire = new THREE.Mesh(wireGeometry, wireMaterial);
        twistedWire.position.set(0, 3.85, 0);
        twistedWire.castShadow = true;
        twistedWire.receiveShadow = true;

        // Add to group
        // GroupRef.current.add(bStem);
        GroupRef.current.add(bulbLight);
        GroupRef.current.add(plug);
        GroupRef.current.add(plugTop);
        GroupRef.current.add(botRing);
        GroupRef.current.add(topRing);
        GroupRef.current.add(twistedWire);

        SceneRef.current.add(GroupRef.current);

        GroupRef.current.position.y = 0;
        GroupRef.current.position.z = 0;
        GroupRef.current.position.x = 0;

        // Directional light for highlighting
        const light = new THREE.DirectionalLight(0xffffff, 0.1);
        light.position.set(1, 1, 1).normalize();
        SceneRef.current.add(light);

        CamRef.current.lookAt(new THREE.Vector3(0, 2, 0));
        animate(); // Start animation loop
    }, []);

    useEffect(() => {
        // Update light properties on intensity change without re-rendering the entire scene
        const bulbLight = GroupRef.current.children.find(
            (child) => child instanceof THREE.PointLight
        );
        if (bulbLight) {
            bulbLight.intensity = intensity;
            bulbLight.children[0].material.emissiveIntensity = intensity + 0.1;
            bulbLight.children[0].material.roughness = intensity + 0.1;
            bulbLight.children[1].material.emissiveIntensity = intensity + 0.1;
            bulbLight.children[1].material.roughness = intensity + 0.1;
        }
    }, [intensity]);

    useEffect(() => {
        // Create WebSocket connection
        const socket = new WebSocket(process.env.REACT_APP_WS_URL);
        setWs(socket);

        // Connection opened
        socket.onopen = () => {
            console.log('WebSocket connection opened');
            setIsConnecting(false);
        };

        // Listen for messages
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.lightStatus !== undefined) {
                setIsLoading(false);
                setLightStatus(data.lightStatus);
            }
            // setIntensity(lightStatus ? 1 : 0);
            console.log(data);
            console.log(data.lightStatus);
            // console.log(intensity);
        };

        // Connection closed
        socket.onclose = (event) => {
            console.log('WebSocket connection closed', event.reason);
            setIsConnecting(true); // Optionally try to reconnect
        };

        // Error occurred
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnecting(true); // Optionally handle error state
        };

        // Clean up on component unmount
        return () => {
            socket.close();
            console.log('WebSocket connection closed during cleanup');
        };
    }, []);

    useEffect(() => {
        setIntensity(lightStatus ? 1 : 0);
    }, [lightStatus]);

    var velocity = 0.001,
        angle = (Math.PI * 90) / 100,
        g = 10,
        step = 5 / 1000;

    const animate = () => {
        RenderRef.current.render(SceneRef.current, CamRef.current);

        var accel = g * Math.sin(angle);
        velocity += accel * step;
        angle += velocity * step;

        GroupRef.current.position.x = -2.98 + angle;
        GroupRef.current.position.y = Math.cos(angle) + 0.75;

        requestAnimationFrame(animate);
    };

    const toggleLight = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            setIsLoading(true);
            ws.send('toggleLight');
        } else {
            console.warn('WebSocket is not connected');
        }
    };

    const updateDimensions = () => {
        CamRef.current.aspect = window.innerWidth / window.innerHeight;
        RenderRef.current.setSize(window.innerWidth, window.innerHeight);
        CamRef.current.updateProjectionMatrix();
        //console.log("TESTING");
    };

    return (
        <Container>
            <Title>Loxone Dashboard</Title>
            <Canvas id="c" />
            <Status lightStatus={lightStatus}>Light is {lightStatus ? 'On' : 'Off'}</Status>
            <ToggleButton onClick={toggleLight} disabled={isConnecting || isLoading}>
                {isConnecting ? 'Connecting...' : (isLoading ? 'Loading...' : 'Toggle Light')}
            </ToggleButton>
        </Container>
    );
};

export default Dashboard;

// Styled Components
const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    z-index: -10;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const Title = styled.h1`
    position: absolute;
    top: 0;
    font-size: 2.5em;
    color: #cde;
    margin-bottom: 20px;
`;
const Status = styled.p`
    position: absolute;
    bottom: 80px;
    font-size: 1.5em;
    font-weight: bold;
    color: ${props => (props.lightStatus ? '#4caf50' : '#f44336')};
    margin-bottom: 20px;
`;

const ToggleButton = styled.button`
    position: absolute;
    bottom: 40px;
    padding: 10px 20px;
    font-size: 1em;
    color: white;
    background-color: ${props => (props.disabled ? '#aaa' : '#781818')};
    border: none;
    border-radius: 5px;
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props => (props.disabled ? '#aaa' : '#6e0e0e')};
    }
`;

import { useThree } from '@react-three/fiber';

const CameraController = () => {
    const { camera } = useThree();

    camera.position.set(0, 3, 2.5);

    
    return null;
};

export default CameraController;
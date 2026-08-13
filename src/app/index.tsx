import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MedievalCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  
  // แก้ Error 1: กำหนด Type เป็น 'back' หรือ 'front' ให้ชัดเจน
  const [facing, setFacing] = useState<CameraType>('back');
  const [activeFilter, setActiveFilter] = useState('normal');
  
  // แก้ Error 2: ใส่ Type <CameraView> ให้ useRef เพื่อให้มันรู้จักคำสั่ง takePictureAsync
  const cameraRef = useRef<CameraView>(null);

  const filters = [
    { id: 'normal', name: 'Mortal\n(ปกติ)', overlayColor: 'transparent' },
    { id: 'bw', name: 'Noir\n(ขาวดำ)', overlayColor: 'rgba(20, 20, 20, 0.75)' }, 
    { id: 'vivid', name: 'Enchanted\n(สดใส)', overlayColor: 'rgba(255, 180, 50, 0.25)' }, 
  ];

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.titleText}>Ye Olde Camera</Text>
        <Text style={styles.permissionText}>Halt! Thy must grant permission to use the magic mirror (camera).</Text>
        <TouchableOpacity style={styles.scrollButton} onPress={requestPermission}>
          <Text style={styles.scrollButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        // TypeScript อาจจะฟ้องนิดหน่อยเรื่อง photo.uri เลยต้องเช็คก่อน
        if (photo && photo.uri) {
            Alert.alert('Portrait Captured!', `Thy visage is saved:\n${photo.uri}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const currentFilter = filters.find(f => f.id === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C1A0D" />
      
      <View style={styles.topBar}>
        <Text style={styles.titleText}>Ye Olde Camera</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View 
            style={[styles.overlay, { backgroundColor: currentFilter?.overlayColor }]} 
            pointerEvents="none" 
          />
        </CameraView>
        <View style={styles.innerFrame} pointerEvents="none" />
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.parchmentButton,
                activeFilter === filter.id && styles.parchmentButtonActive
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={[
                styles.parchmentText,
                activeFilter === filter.id && styles.parchmentTextActive
              ]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.brassButton} onPress={toggleCameraFacing}>
            <Text style={styles.brassButtonText}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButtonOuter} onPress={takePicture}>
            <View style={styles.captureButtonInner}>
              <View style={styles.captureButtonCore} />
            </View>
          </TouchableOpacity>

          <View style={[styles.brassButton, { opacity: 0 }]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1005', 
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#1a1005',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topBar: {
    paddingVertical: 15,
    backgroundColor: '#2C1A0D', 
    borderBottomWidth: 3,
    borderColor: '#8B6508', 
    alignItems: 'center',
  },
  titleText: {
    color: '#D4AF37', 
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif', 
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  cameraContainer: {
    flex: 1,
    borderWidth: 5,
    borderColor: '#4A2511', 
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  // แก้ Error 3: เปลี่ยน absoluteFillObject เป็น absoluteFill (ตามที่ VS Code แนะนำ)
  overlay: {
    ...StyleSheet.absoluteFill as any, 
  },
  innerFrame: {
    ...StyleSheet.absoluteFill as any,
    borderWidth: 2,
    borderColor: '#D4AF37', 
    opacity: 0.5,
  },
  controlsContainer: {
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: '#2C1A0D', 
    borderTopWidth: 4,
    borderColor: '#8B6508',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  parchmentButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#D2B48C', 
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#5C4033', 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  parchmentButtonActive: {
    backgroundColor: '#F5DEB3', 
    borderColor: '#8B0000', 
    borderWidth: 3,
  },
  parchmentText: {
    color: '#3E2723',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  parchmentTextActive: {
    color: '#8B0000', 
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  brassButton: {
    width: 65,
    height: 45,
    backgroundColor: '#8B6508',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  brassButtonText: {
    color: '#F5DEB3',
    fontFamily: 'serif',
    fontWeight: 'bold',
    fontSize: 14,
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A2511', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1a1005',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#8B6508', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonCore: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B0000', 
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  permissionText: {
    color: '#D2B48C',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    fontFamily: 'serif',
    paddingHorizontal: 20,
  },
  scrollButton: {
    backgroundColor: '#8B6508',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 5,
  },
  scrollButtonText: {
    color: '#F5DEB3',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'serif',
  }
});
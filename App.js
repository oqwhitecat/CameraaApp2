import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [activeFilter, setActiveFilter] = useState('normal');
  const cameraRef = useRef(null);

  // ข้อมูลฟิลเตอร์ 3 แบบ (ใช้วิธีวางแผ่นสีทับเพื่อทำเอฟเฟกต์)
  const filters = [
    { id: 'normal', name: 'ปกติ', overlayColor: 'transparent' },
    { id: 'bw', name: 'ขาวดำ', overlayColor: 'rgba(128, 128, 128, 0.7)' }, // จำลองขาวดำด้วยฟิล์มเทา
    { id: 'vivid', name: 'สดใส', overlayColor: 'rgba(255, 165, 0, 0.15)' }, // จำลองความสดใสด้วยฟิล์มอุ่นๆ (ส้ม)
  ];

  // ถ้ายังโหลดสิทธิ์การเข้าถึงกล้องไม่เสร็จ
  if (!permission) {
    return <View style={styles.container} />;
  }

  // ถ้ายังไม่ได้รับอนุญาตให้ใช้กล้อง
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>เราต้องการสิทธิ์ในการใช้งานกล้องของคุณ</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>อนุญาตใช้งานกล้อง</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ฟังก์ชันสลับกล้องหน้า-หลัง
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // ฟังก์ชันถ่ายรูป
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        Alert.alert('ถ่ายรูปสำเร็จ!', `รูปถูกบันทึกชั่วคราวที่:\n${photo.uri}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // หาค่าของฟิลเตอร์ปัจจุบันที่เลือกอยู่
  const currentFilter = filters.find(f => f.id === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        
        {/* Layer สำหรับทำฟิลเตอร์สีทับกล้อง (Overlay) */}
        <View 
          style={[styles.overlay, { backgroundColor: currentFilter.overlayColor }]} 
          pointerEvents="none" // ทำให้ทะลุการกดไปที่กล้องได้
        />

        {/* ส่วนควบคุม UI ด้านล่าง */}
        <View style={styles.controlsContainer}>
          
          {/* แถบเลือกฟิลเตอร์ */}
          <View style={styles.filterContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  activeFilter === filter.id && styles.filterButtonActive
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive
                ]}>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ปุ่มสลับกล้องและปุ่มถ่ายรูป */}
          <View style={styles.actionRow}>
            {/* ปุ่มหลอกเพื่อจัด Layout ให้อยู่ตรงกลาง */}
            <View style={styles.sideButton} /> 

            {/* ปุ่มถ่ายรูป (Shutter) */}
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            {/* ปุ่มสลับกล้อง */}
            <TouchableOpacity style={styles.sideButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse-outline" size={32} color="white" />
            </TouchableOpacity>
          </View>

        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // พื้นหลังโปร่งแสงให้ดูสวยงาม
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterButtonActive: {
    backgroundColor: '#FFD700', // สีเหลืองทองตอนกดเลือก
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#000',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sideButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
  },
  permissionText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 50,
  },
  permissionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
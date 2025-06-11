import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import styles from './App.module.css';

const App: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);
  const [loadingDevices, setLoadingDevices] = useState<boolean>(true);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'));
      setLoadingDevices(false);
    },
    [setDevices, setLoadingDevices]
  );

  useEffect(() => {
    setLoadingDevices(true);
    setDeviceError(null);
    navigator.mediaDevices.enumerateDevices()
      .then(handleDevices)
      .catch(err => {
        console.error("Error enumerating devices:", err);
        setDeviceError(`Failed to enumerate devices: ${err.message}`);
        setLoadingDevices(false);
      });
  }, [handleDevices]);

  const capture = useCallback((): void => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef, setImgSrc]);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(event.target.value);
  };

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <h1>Webcam Capture</h1>
        <div className={styles.webcamContainer}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ deviceId: selectedDevice }}
            className={styles.webcam}
          />
          <div className={styles.controls}>
            {loadingDevices && <p>Loading cameras...</p>}
            {deviceError && <p style={{ color: 'red' }}>{deviceError}</p>}
            {!loadingDevices && !deviceError && devices.length > 0 && (
              <select onChange={handleDeviceChange} value={selectedDevice} className={styles.deviceSelect}>
                <option value="">Select Camera</option>
                {devices.map((device, key) => (
                  <option key={key} value={device.deviceId}>
                    {device.label || `Device ${key + 1}`}
                  </option>
                ))}
              </select>
            )}
            {!loadingDevices && !deviceError && devices.length === 0 && <p>No cameras found.</p>}
            <button onClick={capture} className={styles.captureButton} disabled={loadingDevices || !!deviceError}>Capture photo</button>
          </div>
        </div>
        {imgSrc && (
          <div className={styles.screenshotContainer}>
            <h2>Screenshot</h2>
            <img src={imgSrc} alt="Screenshot" className={styles.screenshotImage} />
            <button onClick={() => setImgSrc(null)} style={{ marginTop: '10px' }}>Clear Screenshot</button>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;

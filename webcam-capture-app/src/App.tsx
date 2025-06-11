import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import './App.css';

const App: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput')),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const capture = useCallback(()
    : void => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef, setImgSrc]);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Webcam Capture</h1>
        <div className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ deviceId: selectedDevice }}
            className="webcam"
          />
          <div className="controls">
            {devices.length > 0 && (
              <select onChange={handleDeviceChange} value={selectedDevice} className="device-select">
                <option value="">Select Camera</option>
                {devices.map((device, key) => (
                  <option key={key} value={device.deviceId}>
                    {device.label || `Device ${key + 1}`}
                  </option>
                ))}
              </select>
            )}
            <button onClick={capture} className="capture-button">Capture photo</button>
          </div>
        </div>
        {imgSrc && (
          <div className="screenshot-container">
            <h2>Screenshot</h2>
            <img src={imgSrc} alt="Screenshot" className="screenshot-image" />
          </div>
        )}
      </header>
    </div>
  );
};

export default App;

import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import {
  useSuperblocksContext,
  useSuperblocksWidgetSize,
} from "@superblocksteam/custom-components";
import { type Props, type EventTriggers } from "./types";
import { Button, Select, Empty, Col } from "antd";
import {
  VideoCameraAddOutlined,
  StopOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import Confetti from "react-confetti";
import ReactDOM from "react-dom";
const { Option } = Select;

const VIDEO_HEIGHT_OFFSET = 60;

export default function Component({ rainConfettiOnCapture }: Props) {
  const [isShowVideo, setIsShowVideo] = useState<boolean>(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDevice, setActiveDevice] = useState<string>("");

  const videoElement = useRef<Webcam | null>(null);

  const { widthPx, heightPx } = useSuperblocksWidgetSize();

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices],
  );

  // call useSuperblocksContext() to get the updateProperties method and event triggers
  const {
    updateProperties,
    events: { onImageCapture },
  } = useSuperblocksContext<Props, EventTriggers>();

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(handleDevices)
      .catch((error) => console.error("Error enumerating devices: ", error));
  }, [handleDevices]);

  const videoHeight = heightPx - VIDEO_HEIGHT_OFFSET;

  const videoConstraints = {
    height: videoHeight,
    facingMode: "user",
    deviceId: activeDevice,
  };

  const startCam = () => setIsShowVideo(true);

  const stopCam = () => {
    // Add more type safety here, if applicable.
    const stream = videoElement.current?.stream;
    stream?.getTracks().forEach((track) => track.stop());
    setIsShowVideo(false);
  };

  // Handle showing confetti

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let confettiRoot: HTMLDivElement;
    if (showConfetti && rainConfettiOnCapture) {
      confettiRoot = document.createElement("div");
      confettiRoot.style.position = "fixed";
      confettiRoot.style.top = "0";
      confettiRoot.style.left = "0";
      confettiRoot.style.width = "100vw";
      confettiRoot.style.height = "100vh";
      confettiRoot.style.zIndex = "9999";
      confettiRoot.style.pointerEvents = "none";
      document.body.appendChild(confettiRoot);
    }

    return () => {
      if (confettiRoot) {
        document.body.removeChild(confettiRoot);
      }
    };
  }, [rainConfettiOnCapture, showConfetti]);

  const handleConfettiShow = () => {
    if (rainConfettiOnCapture) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5500); // Hide confetti after 5.5 seconds
    }
  };

  const handleCapture = () => {
    const imageSrc = videoElement.current?.getScreenshot({
      width: 1920,
      height: 1080,
    });
    if (imageSrc) {
      updateProperties({ image: imageSrc });
      onImageCapture();
    }
    handleConfettiShow();
  };

  const handleDeviceChange = (value: { value: string; label: string }) => {
    console.log(value);
    setActiveDevice(value);
  };

  return (
    <div>
      {showConfetti &&
        rainConfettiOnCapture &&
        ReactDOM.createPortal(
          <Confetti
            initialVelocityX={50}
            width={window.innerWidth}
            height={window.innerHeight}
          />,
          document.body,
        )}
      <div
        className="camera-container"
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        <div style={{ height: videoHeight, width: widthPx }}>
          <div className="camView" style={{ height: "100%", width: "100%" }}>
            {isShowVideo && (
              <Webcam
                screenshotFormat="image/jpeg"
                audio={false}
                ref={videoElement}
                videoConstraints={videoConstraints}
                width={widthPx}
                height={videoHeight}
              />
            )}
            {!isShowVideo && (
              <Empty
                imageStyle={{ width: widthPx, height: videoHeight }}
                description={false}
              />
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "3px" }}>
          {isShowVideo && (
            <>
              <Button onClick={stopCam} icon={<StopOutlined />}>
                Stop Video
              </Button>
              <Button onClick={handleCapture} icon={<VideoCameraAddOutlined />}>
                Take Screenshot
              </Button>
            </>
          )}
          {!isShowVideo && (
            <Button onClick={startCam} icon={<CameraOutlined />}>
              Start Video
            </Button>
          )}
          {devices.length > 1 && (
            <Select
              id="deviceList"
              defaultActiveFirstOption={true}
              onChange={handleDeviceChange}
            >
              {devices.map((device, key) => (
                <Option value={device.deviceId}>{device.label}</Option>
              ))}
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}

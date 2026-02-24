// src/pages/SpiralTestPage.jsx
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  FaWhatsapp,
  FaSave,
  FaVolumeUp,
  FaUpload,
  FaDrawPolygon,
  FaRedo,
  FaBrain,
  FaShareAlt,
  FaHistory,
} from "react-icons/fa";
import { GiSpiralBottle } from "react-icons/gi";

const SpiralTestPage = () => {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saved, setSaved] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [strokeColor, setStrokeColor] = useState("#2563eb");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Stop any previous speech when component unmounts
  useEffect(() => {
    return () => {
      if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
      }
    };
  }, []);

  // Text-to-speech with nice female voice
  const speak = (text) => {
    if (!("speechSynthesis" in window) || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    if (i18n.language === "si") {
      const sinhalaVoice =
        voices.find((v) => v.lang.startsWith("si") && v.name.toLowerCase().includes("female")) ||
        voices.find((v) => v.lang.startsWith("si"));
      if (sinhalaVoice) utterance.voice = sinhalaVoice;
      utterance.lang = "si-LK";
    } else if (i18n.language === "ta") {
      const tamilVoice =
        voices.find((v) => v.lang.startsWith("ta") && v.name.toLowerCase().includes("female")) ||
        voices.find((v) => v.lang.startsWith("ta"));
      if (tamilVoice) utterance.voice = tamilVoice;
      utterance.lang = "ta-IN";
    } else {
      const englishVoice =
        voices.find((v) => v.name.includes("Samantha")) ||
        voices.find((v) => v.name.includes("Aria")) ||
        voices.find((v) => v.name.includes("Jenny")) ||
        voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));

      if (englishVoice) utterance.voice = englishVoice;
      utterance.lang = "en-US";
    }

    window.speechSynthesis.speak(utterance);
  };


  // ── Drawing Handlers ────────────────────────────────────────
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (e.touches) e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);

    setDrawingHistory((prev) => [...prev, { type: "start", x: canvasX, y: canvasY }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (e.touches) e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    ctx.lineWidth = isMobile ? 3 : 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineTo(canvasX, canvasY);
    ctx.stroke();

    setDrawingHistory((prev) => [...prev, { type: "draw", x: canvasX, y: canvasY }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setDrawingHistory((prev) => [...prev, { type: "end" }]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setResult(null);
    setPreviewUrl(null);
    setSaved(false);
    setDrawingHistory([]);
  };

  // ── Analysis & Upload ───────────────────────────────────────
  const analyzeImage = async (imageFile) => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axios.post("http://localhost:5001/predict", formData);
      setResult(res.data);
    } catch (err) {
      alert("AI server not running! Please run: python app.py");
    }
    setLoading(false);
  };

  const checkDrawnSpiral = () => {
    canvasRef.current.toBlob((blob) => analyzeImage(blob));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    analyzeImage(file);
  };

  // ── Save & Share ─────────────────────────────────────────────
  const saveToHistory = () => {
    if (!result) return;
    const history = JSON.parse(localStorage.getItem("spiralHistory") || "[]");
    history.unshift({
      date: new Date().toLocaleString(),
      prediction: result.prediction,
      confidence: result.confidence,
      image: previewUrl || canvasRef.current.toDataURL(),
      hasParkinson: result.hasParkinson,
    });
    localStorage.setItem("spiralHistory", JSON.stringify(history));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const shareOnWhatsApp = () => {
    if (!result) return;
    const text = encodeURIComponent(
      `${i18n.language === "si"
        ? "සර්පිල පරීක්ෂණ ප්‍රතිඵලය"
        : i18n.language === "ta"
          ? "சுருள் சோதனை முடிவு"
          : "Spiral Test Result"
      }\n\n${result.prediction}\nConfidence: ${result.confidence}%\n\nParkinSense`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // ── Color Picker Component ──────────────────────────────────
  const StrokeColorSelector = () => (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "15px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
        <button
          key={color}
          onClick={() => setStrokeColor(color)}
          style={{
            width: isMobile ? "28px" : "32px",
            height: isMobile ? "28px" : "32px",
            borderRadius: "50%",
            backgroundColor: color,
            border: strokeColor === color ? "3px solid #1e293b" : "2px solid #cbd5e1",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      ))}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: isMobile ? "20px 10px" : "40px 20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "20px" : "40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "30px" : "60px",
            paddingBottom: isMobile ? "20px" : "30px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isMobile ? "10px" : "20px",
              marginBottom: isMobile ? "10px" : "20px",
              flexWrap: "wrap",
            }}
          >
            <GiSpiralBottle size={isMobile ? 40 : 60} style={{ color: "#3b82f6" }} />
            <h1
              style={{
                fontSize: isMobile ? "2rem" : "3.5rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              {t("spiral_test")}
            </h1>
          </div>

          <p
            style={{
              fontSize: isMobile ? "1rem" : "1.25rem",
              color: "#64748b",
              marginTop: "10px",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
              padding: isMobile ? "0 10px" : "0",
            }}
          >
            {t("draw_spiral_instruction")}
          </p>
        </div>

        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "40px" : "60px",
            alignItems: "start",
          }}
        >
          {/* Left Panel – Drawing / Upload */}
          <div
            style={{
              background: "white",
              borderRadius: isMobile ? "16px" : "24px",
              padding: isMobile ? "20px" : "40px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e2e8f0",
              order: isMobile ? 1 : "initial",
            }}
          >
            {/* Draw / Upload Toggle */}
            <div
              style={{
                display: "flex",
                background: "#f1f5f9",
                borderRadius: "12px",
                padding: "6px",
                marginBottom: isMobile ? "30px" : "40px",
                width: "fit-content",
                margin: "0 auto 30px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => {
                  setUploadMode(false);
                  clearCanvas();
                }}
                style={{
                  padding: isMobile ? "12px 20px" : "16px 32px",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  fontWeight: "600",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  background: !uploadMode ? "white" : "transparent",
                  color: !uploadMode ? "#3b82f6" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: !uploadMode ? "0 2px 10px rgba(59, 130, 246, 0.15)" : "none",
                  transition: "all 0.3s ease",
                  flex: isMobile ? 1 : "none",
                }}
              >
                <FaDrawPolygon size={isMobile ? 14 : 16} /> Draw
              </button>

              <button
                onClick={() => {
                  setUploadMode(true);
                  setResult(null);
                  setPreviewUrl(null);
                }}
                style={{
                  padding: isMobile ? "12px 20px" : "16px 32px",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  fontWeight: "600",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  background: uploadMode ? "white" : "transparent",
                  color: uploadMode ? "#3b82f6" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: uploadMode ? "0 2px 10px rgba(59, 130, 246, 0.15)" : "none",
                  transition: "all 0.3s ease",
                  flex: isMobile ? 1 : "none",
                }}
              >
                <FaUpload size={isMobile ? 14 : 16} /> Upload
              </button>
            </div>

            {/* DRAWING MODE */}
            {!uploadMode ? (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginBottom: "20px",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={isMobile ? 300 : 400}
                    height={isMobile ? 300 : 400}
                    style={{
                      width: isMobile ? "100%" : "400px",
                      height: isMobile ? "300px" : "400px",
                      maxWidth: "100%",
                      border: "2px solid #e2e8f0",
                      borderRadius: "16px",
                      background: "white",
                      boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.05)",
                      cursor: "crosshair",
                      touchAction: "none",
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />

                  <button
                    onClick={() => speak(t("draw_spiral_instruction"))}
                    style={{
                      position: "absolute",
                      top: isMobile ? "10px" : "16px",
                      right: isMobile ? "10px" : "16px",
                      background: "white",
                      padding: isMobile ? "8px" : "12px",
                      borderRadius: "50%",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      color: "#3b82f6",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                    }}
                  >
                    <FaVolumeUp size={isMobile ? 16 : 20} />
                  </button>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      color: "#64748b",
                      marginBottom: "10px",
                      fontSize: isMobile ? "0.85rem" : "0.95rem",
                    }}
                  >
                    Select stroke color:
                  </p>
                  <StrokeColorSelector />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: isMobile ? "12px" : "16px",
                    justifyContent: "center",
                    flexWrap: isMobile ? "wrap" : "nowrap",
                  }}
                >
                  <button
                    onClick={clearCanvas}
                    style={{
                      padding: isMobile ? "12px 20px" : "14px 28px",
                      background: "white",
                      color: "#64748b",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      fontWeight: "600",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                      flex: isMobile ? 1 : "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fef2f2";
                      e.currentTarget.style.color = "#dc2626";
                      e.currentTarget.style.borderColor = "#fecaca";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#64748b";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    <FaRedo size={isMobile ? 14 : 16} /> Clear
                  </button>

                  <button
                    onClick={checkDrawnSpiral}
                    disabled={loading}
                    style={{
                      padding: isMobile ? "14px 24px" : "16px 36px",
                      background: loading
                        ? "#94a3b8"
                        : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      color: "white",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "10px",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s",
                      boxShadow: loading ? "none" : "0 4px 15px rgba(59, 130, 246, 0.3)",
                      flex: isMobile ? 1 : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(59, 130, 246, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 15px rgba(59, 130, 246, 0.3)";
                      }
                    }}
                  >
                    <FaBrain size={isMobile ? 14 : 16} />{" "}
                    {loading ? "Analyzing..." : "Analyze"}
                  </button>
                </div>
              </div>
            ) : (
              /* ── UPLOAD MODE ──────────────────────────────────────────────── */
              <div style={{ textAlign: "center", padding: isMobile ? "30px 10px" : "60px 20px" }}>
                {!previewUrl ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <div
                      onClick={() => fileInputRef.current.click()}
                      style={{
                        padding: isMobile ? "40px 20px" : "60px 40px",
                        background: "white",
                        border: "2px dashed #cbd5e1",
                        borderRadius: isMobile ? "16px" : "20px",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        color: "#64748b",
                        margin: "0 auto",
                        maxWidth: "600px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#3b82f6";
                        e.currentTarget.style.background = "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      <FaUpload
                        size={isMobile ? 32 : 48}
                        style={{ marginBottom: "15px", color: "#94a3b8" }}
                      />
                      <p
                        style={{
                          fontSize: isMobile ? "1.1rem" : "1.25rem",
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: "#334155",
                        }}
                      >
                        Upload Spiral Image
                      </p>
                      <p style={{ fontSize: isMobile ? "0.85rem" : "0.95rem", color: "#94a3b8" }}>
                        Click to browse or drag and drop
                      </p>
                      <p
                        style={{
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          color: "#cbd5e1",
                          marginTop: "8px",
                        }}
                      >
                        Supports PNG, JPG, JPEG
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px",
                        flexWrap: "wrap",
                      }}
                    >
                      <p
                        style={{
                          fontSize: isMobile ? "1rem" : "1.125rem",
                          color: "#334155",
                          fontWeight: "600",
                        }}
                      >
                        Preview
                      </p>
                      <button
                        onClick={() => fileInputRef.current.click()}
                        style={{
                          padding: "8px 16px",
                          background: "#f1f5f9",
                          color: "#64748b",
                          fontSize: isMobile ? "0.8rem" : "0.875rem",
                          fontWeight: "500",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          marginTop: isMobile ? "5px" : "0",
                        }}
                      >
                        Change Image
                      </button>
                    </div>

                    <img
                      src={previewUrl}
                      alt="Spiral"
                      style={{
                        width: "100%",
                        height: isMobile ? "250px" : "300px",
                        maxHeight: "400px",
                        objectFit: "contain",
                        border: "1px solid #e2e8f0",
                        borderRadius: isMobile ? "12px" : "16px",
                        background: "white",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel – Results */}
          <div
            style={{
              order: isMobile ? 0 : "initial",
              marginBottom: isMobile ? "20px" : "0",
            }}
          >
            {loading ? (
              <div
                style={{
                  background: "white",
                  borderRadius: isMobile ? "16px" : "24px",
                  padding: isMobile ? "40px 20px" : "60px 40px",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: isMobile ? "50px" : "60px",
                    height: isMobile ? "50px" : "60px",
                    border: "4px solid #f1f5f9",
                    borderTopColor: "#3b82f6",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 20px",
                  }}
                ></div>
                <p
                  style={{
                    fontSize: isMobile ? "1.1rem" : "1.25rem",
                    color: "#334155",
                    fontWeight: "600",
                  }}
                >
                  Analyzing Spiral Pattern
                </p>
                <p
                  style={{
                    color: "#94a3b8",
                    marginTop: "8px",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  Our AI is examining the drawing...
                </p>
              </div>
            ) : result ? (
              <div
                style={{
                  background: "white",
                  borderRadius: isMobile ? "16px" : "24px",
                  padding: isMobile ? "25px" : "40px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "10px" : "15px",
                    marginBottom: isMobile ? "20px" : "30px",
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? "8px" : "12px",
                      height: isMobile ? "30px" : "40px",
                      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      borderRadius: "4px",
                    }}
                  />
                  <h2
                    style={{
                      fontSize: isMobile ? "1.25rem" : "1.5rem",
                      fontWeight: "700",
                      color: "#1e293b",
                    }}
                  >
                    Analysis Results
                  </h2>
                </div>

                <div
                  style={{
                    background: result.hasParkinson ? "#fef2f2" : "#f0fdf4",
                    borderRadius: isMobile ? "12px" : "16px",
                    padding: isMobile ? "20px" : "30px",
                    textAlign: "center",
                    marginBottom: isMobile ? "20px" : "30px",
                    border: `1px solid ${result.hasParkinson ? "#fecaca" : "#bbf7d0"}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: isMobile ? "1.5rem" : "2rem",
                      fontWeight: "700",
                      color: result.hasParkinson ? "#dc2626" : "#059669",
                      marginBottom: isMobile ? "10px" : "15px",
                      lineHeight: 1.2,
                    }}
                  >
                    {result.prediction}
                  </h3>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      background: "white",
                      padding: isMobile ? "10px 16px" : "12px 24px",
                      borderRadius: isMobile ? "8px" : "12px",
                      marginBottom: isMobile ? "15px" : "20px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <span
                      style={{
                        color: "#64748b",
                        marginRight: "6px",
                        fontSize: isMobile ? "0.9rem" : "1rem",
                      }}
                    >
                      Confidence:
                    </span>
                    <span
                      style={{
                        fontSize: isMobile ? "1.1rem" : "1.25rem",
                        fontWeight: "700",
                        color: result.hasParkinson ? "#dc2626" : "#059669",
                      }}
                    >
                      {result.confidence}%
                    </span>
                  </div>

                  <p
                    style={{
                      color: result.hasParkinson ? "#7f1d1d" : "#064e3b",
                      lineHeight: "1.6",
                      fontSize: isMobile ? "0.95rem" : "1.1rem",
                    }}
                  >
                    {result.hasParkinson ? t("result_parkinson") : t("result_healthy")}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? "12px" : "16px",
                    marginTop: isMobile ? "20px" : "30px",
                  }}
                >
                  <button
                    onClick={saveToHistory}
                    style={{
                      padding: isMobile ? "14px" : "16px",
                      background: saved ? "#10b981" : "#f8fafc",
                      color: saved ? "white" : "#334155",
                      fontSize: isMobile ? "0.9rem" : "0.95rem",
                      fontWeight: "600",
                      border: `1px solid ${saved ? "#10b981" : "#e2e8f0"}`,
                      borderRadius: isMobile ? "10px" : "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!saved) {
                        e.currentTarget.style.background = "#3b82f6";
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.borderColor = "#3b82f6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!saved) {
                        e.currentTarget.style.background = "#f8fafc";
                        e.currentTarget.style.color = "#334155";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }
                    }}
                  >
                    <FaSave size={isMobile ? 14 : 16} /> {saved ? "Saved!" : "Save Report"}
                  </button>

                  <button
                    onClick={shareOnWhatsApp}
                    style={{
                      padding: isMobile ? "14px" : "16px",
                      background: "#f0fdf4",
                      color: "#059669",
                      fontSize: isMobile ? "0.9rem" : "0.95rem",
                      fontWeight: "600",
                      border: "1px solid #bbf7d0",
                      borderRadius: isMobile ? "10px" : "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#059669";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f0fdf4";
                      e.currentTarget.style.color = "#059669";
                    }}
                  >
                    <FaWhatsapp size={isMobile ? 14 : 16} /> Share Result
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "white",
                  borderRadius: isMobile ? "16px" : "24px",
                  padding: isMobile ? "40px 20px" : "60px 40px",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e2e8f0",
                  color: "#94a3b8",
                }}
              >
                <FaHistory size={isMobile ? 36 : 48} style={{ marginBottom: "15px", opacity: 0.5 }} />
                <h3
                  style={{
                    color: "#64748b",
                    marginBottom: "8px",
                    fontWeight: "600",
                    fontSize: isMobile ? "1.1rem" : "1.25rem",
                  }}
                >
                  Results Will Appear Here
                </h3>
                <p style={{ fontSize: isMobile ? "0.85rem" : "0.95rem" }}>
                  Draw or upload a spiral image to see the AI analysis results
                </p>
              </div>
            )}
          </div>
        </div>

        {/* About the Test Section */}
        <div
          style={{
            marginTop: isMobile ? "40px" : "60px",
            background: "white",
            borderRadius: isMobile ? "16px" : "24px",
            padding: isMobile ? "25px" : "40px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? "1.1rem" : "1.25rem",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: isMobile ? "15px" : "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <GiSpiralBottle size={isMobile ? 18 : 24} /> About the Spiral Test
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
              gap: isMobile ? "20px" : "30px",
            }}
          >
            <div>
              <h4
                style={{
                  color: "#3b82f6",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                How It Works
              </h4>
              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  fontSize: isMobile ? "0.85rem" : "0.95rem",
                }}
              >
                The spiral drawing test is a non-invasive method to assess motor control.
                Our AI analyzes tremors, pressure, and smoothness to detect Parkinson's disease indicators.
              </p>
            </div>

            <div>
              <h4
                style={{
                  color: "#3b82f6",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Instructions
              </h4>
              <ul
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  fontSize: isMobile ? "0.85rem" : "0.95rem",
                  paddingLeft: "18px",
                }}
              >
                <li>Draw a continuous spiral from center outward</li>
                <li>Use smooth, steady movements</li>
                <li>Complete the drawing in one attempt</li>
                <li>Ensure good lighting for uploaded images</li>
              </ul>
            </div>

            <div>
              <h4
                style={{
                  color: "#3b82f6",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Disclaimer
              </h4>
              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  fontSize: isMobile ? "0.85rem" : "0.95rem",
                }}
              >
                This tool provides preliminary screening only. Always consult with a healthcare professional
                for proper diagnosis and treatment recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        canvas {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        @media (max-width: 768px) {
          button, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }

          input[type="file"] {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SpiralTestPage;
// src/pages/VoiceTestPage.jsx
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaSave, FaVolumeUp, FaUpload, FaMicrophone, FaRedo, FaBrain, FaStop, FaHistory } from "react-icons/fa";
import { GiSoundWaves } from "react-icons/gi";

const VoiceTestPage = () => {
  const { t, i18n } = useTranslation();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saved, setSaved] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Stop any previous audio playback on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // BEAUTIFUL FEMALE VOICE — English, Sinhala, Tamil
  const speak = (text) => {
    if (!("speechSynthesis" in window) || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    if (i18n.language === "si") {
      const sinhalaVoice = voices.find(v => v.lang.startsWith("si") && v.name.toLowerCase().includes("female"))
        || voices.find(v => v.lang.startsWith("si"));
      if (sinhalaVoice) utterance.voice = sinhalaVoice;
      utterance.lang = "si-LK";
    } else if (i18n.language === "ta") {
      const tamilVoice = voices.find(v => v.lang.startsWith("ta") && v.name.toLowerCase().includes("female"))
        || voices.find(v => v.lang.startsWith("ta"));
      if (tamilVoice) utterance.voice = tamilVoice;
      utterance.lang = "ta-IN";
    } else {
      const englishVoice =
        voices.find(v => v.name.includes("Samantha") || v.name.includes("Aria") || v.name.includes("Jenny")) ||
        voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));
      if (englishVoice) utterance.voice = englishVoice;
      utterance.lang = "en-US";
    }

    window.speechSynthesis.speak(utterance);
  };


  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const getSupportedMimeType = () => {
        const types = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg", "audio/mp4", "audio/aac"];
        for (const type of types) {
          if (MediaRecorder.isTypeSupported(type)) return type;
        }
        return "";
      };

      const mimeType = getSupportedMimeType();
      console.log("Using MIME type:", mimeType);

      mediaRecorderRef.current = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType || "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        analyzeAudio(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeAudio = async (audioFile) => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("audio", audioFile, "voice.webm");

    const ML_SERVER_URL = `http://${window.location.hostname}:5005/predict_voice`;
    try {
      const res = await axios.post(ML_SERVER_URL, formData);
      setResult(res.data);
    } catch (err) {
      alert("Error connecting to backend or AI server!");
      console.error(err);
    }
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAudioBlob(file);
    analyzeAudio(file);
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setPreviewUrl(null);
    setResult(null);
    setSaved(false);
    setRecordingTime(0);
  };

  const saveToHistory = () => {
    if (!result) return;
    const history = JSON.parse(localStorage.getItem("voiceHistory") || "[]");
    history.unshift({
      date: new Date().toLocaleString(),
      prediction: result.prediction,
      confidence: result.confidence,
      audio: previewUrl,
      hasParkinson: result.hasParkinson,
    });
    localStorage.setItem("voiceHistory", JSON.stringify(history));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const shareOnWhatsApp = () => {
    if (!result) return;
    const text = encodeURIComponent(
      `${i18n.language === "si" ? "වාචික පරීක්ෂණ ප්‍රතිඵලය" : i18n.language === "ta" ? "குரல் சோதனை முடிவு" : "Voice Test Result"}\n\n${result.prediction}\nConfidence: ${result.confidence}%\n\nParkinSense`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      padding: isMobile ? "20px 10px" : "40px 20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflowX: 'hidden'
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "20px" : "40px" }}>

        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: isMobile ? "30px" : "60px",
          paddingBottom: isMobile ? "20px" : "30px",
          borderBottom: "1px solid #e2e8f0"
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '10px' : '20px',
            marginBottom: isMobile ? '10px' : '20px',
            flexWrap: 'wrap'
          }}>
            <GiSoundWaves size={isMobile ? 40 : 60} style={{ color: '#3b82f6' }} />
            <h1 style={{
              fontSize: isMobile ? "2rem" : "3.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
              lineHeight: 1.2
            }}>
              {t("Voice Test")}
            </h1>
          </div>
          <p style={{
            fontSize: isMobile ? "1rem" : "1.25rem",
            color: "#64748b",
            marginTop: "10px",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
            padding: isMobile ? "0 10px" : "0"
          }}>
            {t("voice_instruction")}
          </p>
        </div>

        {/* Main Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "40px" : "60px",
          alignItems: "start"
        }}>

          {/* Left Panel - Recording/Upload Area */}
          <div style={{
            background: "white",
            borderRadius: isMobile ? "16px" : "24px",
            padding: isMobile ? "20px" : "40px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
            order: isMobile ? 1 : 'initial'
          }}>

            {/* Mode Toggle */}
            <div style={{
              display: "flex",
              background: "#f1f5f9",
              borderRadius: isMobile ? "12px" : "16px",
              padding: "6px",
              marginBottom: isMobile ? "30px" : "40px",
              width: "fit-content",
              margin: "0 auto 30px",
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => { setUploadMode(false); clearRecording(); }}
                style={{
                  padding: isMobile ? "12px 20px" : "16px 32px",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  fontWeight: "600",
                  borderRadius: isMobile ? "10px" : "12px",
                  border: "none",
                  cursor: "pointer",
                  background: !uploadMode ? "white" : "transparent",
                  color: !uploadMode ? "#3b82f6" : "#64748b",
                  boxShadow: !uploadMode ? "0 2px 10px rgba(59, 130, 246, 0.15)" : "none",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: isMobile ? 1 : 'none'
                }}
              >
                <FaMicrophone size={isMobile ? 14 : 16} /> Record
              </button>
              <button
                onClick={() => { setUploadMode(true); setResult(null); setPreviewUrl(null); }}
                style={{
                  padding: isMobile ? "12px 20px" : "16px 32px",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  fontWeight: "600",
                  borderRadius: isMobile ? "10px" : "12px",
                  border: "none",
                  cursor: "pointer",
                  background: uploadMode ? "white" : "transparent",
                  color: uploadMode ? "#3b82f6" : "#64748b",
                  boxShadow: uploadMode ? "0 2px 10px rgba(59, 130, 246, 0.15)" : "none",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: isMobile ? 1 : 'none'
                }}
              >
                <FaUpload size={isMobile ? 14 : 16} /> Upload
              </button>
            </div>

            {/* Recording / Upload Area */}
            {!uploadMode ? (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  marginBottom: "30px",
                  padding: isMobile ? "30px 20px" : "40px",
                  background: isRecording ? "#fef2f2" : "#f8fafc",
                  borderRadius: isMobile ? "16px" : "20px",
                  border: `2px solid ${isRecording ? "#dc2626" : "#e2e8f0"}`,
                  transition: "all 0.3s"
                }}>
                  <div style={{
                    fontSize: isMobile ? "2.5rem" : "3rem",
                    color: isRecording ? "#dc2626" : "#3b82f6",
                    marginBottom: "10px"
                  }}>
                    {isRecording ? <FaStop /> : <FaMicrophone />}
                  </div>
                  <p style={{
                    fontSize: isMobile ? "1.25rem" : "1.5rem",
                    fontWeight: "600",
                    color: isRecording ? "#dc2626" : "#334155",
                    marginBottom: isMobile ? "5px" : "10px"
                  }}>
                    {isRecording ? `${recordingTime}s` : "Ready to Record"}
                  </p>
                  {isRecording && <p style={{ color: "#dc2626", fontSize: isMobile ? "0.85rem" : "0.95rem" }}>Recording in progress...</p>}

                  {!isRecording && (
                    <button
                      onClick={() => speak(t("voice_instruction"))}
                      style={{
                        marginTop: "15px",
                        padding: isMobile ? "8px 16px" : "10px 20px",
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        color: "#3b82f6",
                        fontSize: isMobile ? "0.85rem" : "0.95rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <FaVolumeUp size={isMobile ? 12 : 14} /> Hear Instructions
                    </button>
                  )}
                </div>

                <div style={{
                  display: "flex",
                  gap: isMobile ? "12px" : "16px",
                  justifyContent: "center",
                  flexWrap: isMobile ? "wrap" : "nowrap"
                }}>
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      style={{
                        padding: isMobile ? "14px 24px" : "16px 36px",
                        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                        color: "white",
                        fontSize: isMobile ? "0.9rem" : "1rem",
                        fontWeight: "600",
                        border: "none",
                        borderRadius: isMobile ? "10px" : "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                        flex: isMobile ? 1 : 'none'
                      }}
                    >
                      <FaMicrophone size={isMobile ? 14 : 16} /> Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      style={{
                        padding: isMobile ? "14px 24px" : "16px 36px",
                        background: "#dc2626",
                        color: "white",
                        fontSize: isMobile ? "0.9rem" : "1rem",
                        fontWeight: "600",
                        border: "none",
                        borderRadius: isMobile ? "10px" : "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flex: isMobile ? 1 : 'none'
                      }}
                    >
                      <FaStop size={isMobile ? 14 : 16} /> Stop & Analyze
                    </button>
                  )}

                  <button onClick={clearRecording} style={{
                    padding: isMobile ? "12px 20px" : "14px 28px",
                    background: "white",
                    color: "#64748b",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    fontWeight: "600",
                    border: "1px solid #e2e8f0",
                    borderRadius: isMobile ? "10px" : "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: isMobile ? 1 : 'none'
                  }}>
                    <FaRedo size={isMobile ? 14 : 16} /> Clear
                  </button>
                </div>

                {previewUrl && (
                  <div style={{ marginTop: "20px" }}>
                    <audio
                      controls
                      src={previewUrl}
                      style={{ width: "100%" }}
                      ref={audioRef}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: isMobile ? "30px 10px" : "60px 20px" }}>
                {!previewUrl ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                      id="voiceUpload"
                    />
                    <label
                      htmlFor="voiceUpload"
                      style={{
                        padding: isMobile ? "40px 20px" : "60px 40px",
                        background: "white",
                        border: "2px dashed #cbd5e1",
                        borderRadius: isMobile ? "16px" : "20px",
                        cursor: "pointer",
                        display: "block",
                        transition: "all 0.3s"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "#3b82f6";
                        e.currentTarget.style.background = "#f8fafc";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      <FaUpload size={isMobile ? 32 : 48} style={{ marginBottom: "15px", color: "#94a3b8" }} />
                      <p style={{
                        fontSize: isMobile ? "1.1rem" : "1.25rem",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: "#334155"
                      }}>
                        Upload Voice Recording
                      </p>
                      <p style={{ fontSize: isMobile ? "0.85rem" : "0.95rem", color: "#94a3b8" }}>
                        Click to browse or drag and drop
                      </p>
                      <p style={{ fontSize: isMobile ? "0.75rem" : "0.875rem", color: "#cbd5e1", marginTop: "8px" }}>
                        Supports MP3, WAV, WEBM
                      </p>
                    </label>
                  </>
                ) : (
                  <div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "15px",
                      flexWrap: 'wrap'
                    }}>
                      <p style={{
                        fontSize: isMobile ? "1rem" : "1.125rem",
                        color: "#334155",
                        fontWeight: "600"
                      }}>
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
                          marginTop: isMobile ? "5px" : "0"
                        }}
                      >
                        Change Audio
                      </button>
                    </div>
                    <audio
                      controls
                      src={previewUrl}
                      style={{ width: "100%", marginBottom: "20px" }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div style={{
            order: isMobile ? 0 : 'initial',
            marginBottom: isMobile ? "20px" : "0"
          }}>
            {loading ? (
              <div style={{
                background: "white",
                borderRadius: isMobile ? "16px" : "24px",
                padding: isMobile ? "40px 20px" : "60px 40px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e2e8f0"
              }}>
                <div style={{
                  width: isMobile ? "50px" : "60px",
                  height: isMobile ? "50px" : "60px",
                  border: "4px solid #f1f5f9",
                  borderTopColor: "#3b82f6",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 20px"
                }}></div>
                <p style={{
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                  color: "#334155",
                  fontWeight: "600"
                }}>
                  Analyzing Voice Pattern
                </p>
                <p style={{
                  color: "#94a3b8",
                  marginTop: "8px",
                  fontSize: isMobile ? "0.9rem" : "1rem"
                }}>
                  Our AI is examining speech for Parkinson's indicators...
                </p>
              </div>
            ) : result ? (
              <div style={{
                background: "white",
                borderRadius: isMobile ? "16px" : "24px",
                padding: isMobile ? "25px" : "40px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e2e8f0"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "10px" : "15px",
                  marginBottom: isMobile ? "20px" : "30px"
                }}>
                  <div style={{
                    width: isMobile ? "8px" : "12px",
                    height: isMobile ? "30px" : "40px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    borderRadius: "4px"
                  }} />
                  <h2 style={{
                    fontSize: isMobile ? "1.25rem" : "1.5rem",
                    fontWeight: "700",
                    color: "#1e293b"
                  }}>
                    Analysis Results
                  </h2>
                </div>

                <div style={{
                  background: result.hasParkinson ? "#fef2f2" : "#f0fdf4",
                  borderRadius: isMobile ? "12px" : "16px",
                  padding: isMobile ? "20px" : "30px",
                  textAlign: "center",
                  marginBottom: isMobile ? "20px" : "30px",
                  border: `1px solid ${result.hasParkinson ? "#fecaca" : "#bbf7d0"}`
                }}>
                  <h3 style={{
                    fontSize: isMobile ? "1.5rem" : "2rem",
                    fontWeight: "700",
                    color: result.hasParkinson ? "#dc2626" : "#059669",
                    marginBottom: isMobile ? "10px" : "15px",
                    lineHeight: 1.2
                  }}>
                    {result.prediction}
                  </h3>

                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: "white",
                    padding: isMobile ? "10px 16px" : "12px 24px",
                    borderRadius: isMobile ? "8px" : "12px",
                    marginBottom: isMobile ? "15px" : "20px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <span style={{
                      color: "#64748b",
                      marginRight: "6px",
                      fontSize: isMobile ? "0.9rem" : "1rem"
                    }}>
                      Confidence:
                    </span>
                    <span style={{
                      fontSize: isMobile ? "1.1rem" : "1.25rem",
                      fontWeight: "700",
                      color: result.hasParkinson ? "#dc2626" : "#059669"
                    }}>
                      {result.confidence}%
                    </span>
                  </div>

                  <p style={{
                    color: result.hasParkinson ? "#7f1d1d" : "#064e3b",
                    lineHeight: "1.6",
                    fontSize: isMobile ? "0.95rem" : "1.1rem"
                  }}>
                    {result.hasParkinson ? t("voice_result_parkinson") : t("voice_result_healthy")}
                  </p>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isMobile ? "12px" : "16px",
                  marginTop: isMobile ? "20px" : "30px"
                }}>
                  <button onClick={saveToHistory} style={{
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
                    transition: "all 0.2s"
                  }}
                    onMouseEnter={e => {
                      if (!saved) {
                        e.currentTarget.style.background = "#3b82f6";
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.borderColor = "#3b82f6";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!saved) {
                        e.currentTarget.style.background = "#f8fafc";
                        e.currentTarget.style.color = "#334155";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }
                    }}
                  >
                    <FaSave size={isMobile ? 14 : 16} /> {saved ? "Saved!" : "Save Report"}
                  </button>

                  <button onClick={shareOnWhatsApp} style={{
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
                    transition: "all 0.2s"
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "#059669";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "#f0fdf4";
                      e.currentTarget.style.color = "#059669";
                    }}
                  >
                    <FaWhatsapp size={isMobile ? 14 : 16} /> Share Result
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: "white",
                borderRadius: isMobile ? "16px" : "24px",
                padding: isMobile ? "40px 20px" : "60px 40px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e2e8f0",
                color: "#94a3b8"
              }}>
                <FaHistory size={isMobile ? 36 : 48} style={{ marginBottom: "15px", opacity: 0.5 }} />
                <h3 style={{
                  color: "#64748b",
                  marginBottom: "8px",
                  fontWeight: "600",
                  fontSize: isMobile ? "1.1rem" : "1.25rem"
                }}>
                  Results Will Appear Here
                </h3>
                <p style={{ fontSize: isMobile ? "0.85rem" : "0.95rem" }}>
                  Record or upload voice to see the AI analysis results
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div style={{
          marginTop: isMobile ? "40px" : "60px",
          background: "white",
          borderRadius: isMobile ? "16px" : "24px",
          padding: isMobile ? "25px" : "40px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{
            fontSize: isMobile ? "1.1rem" : "1.25rem",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: isMobile ? "15px" : "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <GiSoundWaves size={isMobile ? 18 : 24} /> About the Voice Test
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
            gap: isMobile ? "20px" : "30px"
          }}>
            <div>
              <h4 style={{
                color: "#3b82f6",
                fontSize: isMobile ? "0.9rem" : "1rem",
                fontWeight: "600",
                marginBottom: "8px"
              }}>
                How It Works
              </h4>
              <p style={{
                color: "#64748b",
                lineHeight: "1.6",
                fontSize: isMobile ? "0.85rem" : "0.95rem"
              }}>
                Voice analysis detects subtle changes in speech (tremor, volume, pauses) using AI to identify early Parkinson's indicators.
              </p>
            </div>
            <div>
              <h4 style={{
                color: "#3b82f6",
                fontSize: isMobile ? "0.9rem" : "1rem",
                fontWeight: "600",
                marginBottom: "8px"
              }}>
                Instructions
              </h4>
              <ul style={{
                color: "#64748b",
                lineHeight: "1.6",
                fontSize: isMobile ? "0.85rem" : "0.95rem",
                paddingLeft: "18px"
              }}>
                <li>Speak clearly for 10–20 seconds (e.g., read a sentence)</li>
                <li>Use a quiet environment</li>
                <li>Allow microphone access</li>
                <li>Keep device close to mouth</li>
              </ul>
            </div>
            <div>
              <h4 style={{
                color: "#3b82f6",
                fontSize: isMobile ? "0.9rem" : "1rem",
                fontWeight: "600",
                marginBottom: "8px"
              }}>
                Disclaimer
              </h4>
              <p style={{
                color: "#64748b",
                lineHeight: "1.6",
                fontSize: isMobile ? "0.85rem" : "0.95rem"
              }}>
                This is a preliminary screening tool only. Always consult a healthcare professional for diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Better touch interactions for mobile */
        @media (max-width: 768px) {
          button, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
          
          audio {
            width: 100%;
          }
        }
        
        /* iOS specific fixes */
        @supports (-webkit-touch-callout: none) {
          audio {
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceTestPage;
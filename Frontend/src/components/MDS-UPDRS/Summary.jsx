// src/components/MDS-UPDRS/Summary.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaFileMedicalAlt, 
  FaChartLine, 
  FaUserMd, 
  FaCalendarAlt,
  FaPrint,
  FaPaperPlane,
  FaChevronLeft,
  FaClipboardList,
  FaBrain,
  FaHandsHelping,
  FaWalking,
  FaChartBar,
  FaFilePdf,
  FaFlagCheckered,
  FaTrophy,
  FaAward,
  FaWhatsapp
} from "react-icons/fa";
import { GiHospitalCross, GiMedicalPack } from "react-icons/gi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Summary = ({ formData, location, onSubmit, loading, onPrev }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const printRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const calc = (map) => Array.from(map.values()).reduce((a, b) => a + b, 0);
  const p1 = calc(formData.part1);
  const p2 = calc(formData.part2);
  const p3 = calc(formData.part3);
  const p4 = calc(formData.part4);
  const total = p1 + p2 + p3 + p4;

  const p1Percent = Math.round((p1 / 52) * 100);
  const p2Percent = Math.round((p2 / 52) * 100);
  const p3Percent = Math.round((p3 / 132) * 100);
  const p4Percent = Math.round((p4 / 24) * 100);
  const totalPercent = Math.round((total / 260) * 100);

  const generateReportId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `MDS-${timestamp}-${random}`;
  };

  const reportId = formData.reportId || generateReportId();

  const getStageInfo = () => {
    if (total <= 30) {
      return {
        stage: "Early Stage",
        severity: "Mild",
        color: "#10B981",
        description: "Hoehn & Yahr Stage 1-2: Minimal functional impairment",
        icon: <FaTrophy className="text-green-600" />,
        clinicalImplications: [
          "Maintain current medication regimen",
          "Regular exercise program recommended",
          "Annual follow-up assessments",
          "Monitor for non-motor symptoms"
        ]
      };
    } else if (total <= 60) {
      return {
        stage: "Moderate Stage",
        severity: "Moderate",
        color: "#F59E0B",
        description: "Hoehn & Yahr Stage 3: Significant disability but still physically independent",
        icon: <FaAward className="text-yellow-600" />,
        clinicalImplications: [
          "Consider medication adjustment",
          "Physical therapy recommended",
          "Quarterly follow-up assessments",
          "Evaluate for motor fluctuations"
        ]
      };
    } else {
      return {
        stage: "Advanced Stage",
        severity: "Severe",
        color: "#EF4444",
        description: "Hoehn & Yahr Stage 4-5: Severe disability, requiring assistance",
        icon: <FaFlagCheckered className="text-red-600" />,
        clinicalImplications: [
          "Immediate treatment review needed",
          "Multidisciplinary care team required",
          "Monthly monitoring recommended",
          "Consider advanced therapies"
        ]
      };
    }
  };

  const stageInfo = getStageInfo();

  const handleSubmit = async () => {
    if (!formData.consent) {
      alert("Patient consent is required to proceed with the assessment.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        part1: Object.fromEntries(formData.part1),
        part2: Object.fromEntries(formData.part2),
        part3: Object.fromEntries(formData.part3),
        part4: Object.fromEntries(formData.part4),
        totalScore: total,
        stage: stageInfo.stage,
        severity: stageInfo.severity,
        reportId: reportId,
        assessmentDate: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await axios.post("http://localhost:5000/api/assessments", payload);
      const assessmentId = res.data.data.id;


      
      alert("✅ Assessment successfully submitted! Generating personalized recommendations...");
      
      navigate(`/recommendations/${assessmentId}`);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Failed to submit assessment. Please check your connection and try again.";
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MDS-UPDRS Report - ${reportId}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 5mm;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              font-size: 10pt;
              line-height: 1.3;
              color: #000;
              background: white;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              width: 210mm;
              min-height: 297mm;
              padding: 15mm;
              box-sizing: border-box;
            }
            
            .printable-report {
              width: 100%;
              min-height: 100%;
            }
            
            /* Header */
            .print-header {
              border-bottom: 2px solid #2c3e50;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            
            .report-title {
              margin: 0 0 5px 0;
              color: #2c3e50;
              font-size: 20pt;
              font-weight: bold;
            }
            
            .report-subtitle {
              margin: 0 0 8px 0;
              color: #7f8c8d;
              font-size: 9pt;
            }
            
            /* Tables */
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 9pt;
            }
            
            th {
              background-color: #2c3e50;
              color: white;
              padding: 8px;
              text-align: left;
            }
            
            td {
              padding: 8px;
              border: 1px solid #dee2e6;
            }
            
            /* Progress bars */
            .progress-container {
              height: 6px;
              background-color: #e9ecef;
              border-radius: 3px;
              overflow: hidden;
            }
            
            .progress-fill {
              height: 100%;
              border-radius: 3px;
            }
            
            /* Sections */
            .section {
              margin-bottom: 15px;
              page-break-inside: avoid;
            }
            
            .section-title {
              margin: 0 0 10px 0;
              color: #2c3e50;
              font-size: 12pt;
              border-bottom: 1px solid #ced4da;
              padding-bottom: 5px;
            }
            
            /* Stage card */
            .stage-card {
              padding: 12px;
              border-radius: 6px;
              border: 2px solid ${stageInfo.color};
              background-color: ${stageInfo.color}15;
            }
            
            /* Footer */
            .footer {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #dee2e6;
              font-size: 8pt;
              color: #6c757d;
            }
            
            @media print {
              body {
                width: 210mm;
                height: 297mm;
              }
            }
          </style>
        </head>
        <body>
          ${generatePrintableReportHTML()}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const generatePrintableReportHTML = () => {
    const formatDateShort = (date) => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return `
      <div class="printable-report">
        <!-- Header -->
        <div class="print-header">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h1 class="report-title">MDS-UPDRS ASSESSMENT REPORT</h1>
              <p class="report-subtitle">Movement Disorder Society - Unified Parkinson's Disease Rating Scale</p>
              <p style="margin: 0; color: #95a5a6; font-size: 8pt">Version 2.0 | Professional Medical Assessment Tool</p>
            </div>
            
            <div style="text-align: right;">
              <div style="background-color: #ecf0f1; padding: 8px 12px; border-radius: 4px; margin-bottom: 8px">
                <strong style="font-size: 9pt; color: #2c3e50">Report ID:</strong><br/>
                <span style="font-size: 10pt; font-weight: bold; color: #3498db">${reportId}</span>
              </div>
              <div style="font-size: 8pt; color: #7f8c8d">
                <strong>Generated:</strong> ${formatDateShort(currentDateTime)}
              </div>
            </div>
          </div>
        </div>

        <!-- Patient Information -->
        <div class="section">
          <h2 class="section-title">PATIENT INFORMATION</h2>
          
          <table>
            <tbody>
              <tr>
                <td style="width: 25%; font-weight: bold; color: #495057">Patient Name:</td>
                <td style="width: 25%; border-right: 1px solid #dee2e6">${formData.patientName || "Not provided"}</td>
                <td style="width: 25%; font-weight: bold; color: #495057">Patient ID:</td>
                <td style="width: 25%">${formData.patientId || "Not provided"}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #495057">Physician:</td>
                <td style="border-right: 1px solid #dee2e6">${formData.doctorName || "Not provided"}</td>
                <td style="font-weight: bold; color: #495057">Medical Facility:</td>
                <td>${formData.clinicName || "Not specified"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Assessment Scores -->
        <div class="section">
          <h2 class="section-title">ASSESSMENT SCORES</h2>
          
          <table>
            <thead>
              <tr style="background-color: #2c3e50; color: white;">
                <th style="width: 25%">Section</th>
                <th style="width: 15%; text-align: center">Score</th>
                <th style="width: 15%; text-align: center">Maximum</th>
                <th style="width: 15%; text-align: center">Percentage</th>
                <th style="width: 30%">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: bold">Part I: Non-Motor Symptoms</td>
                <td style="text-align: center; font-weight: bold; color: #3b82f6">${p1}</td>
                <td style="text-align: center; color: #6c757d">52</td>
                <td style="text-align: center">
                  <div style="display: inline-block; padding: 2px 8px; background-color: #e9ecef; border-radius: 4px">
                    ${p1Percent}%
                  </div>
                </td>
                <td>
                  <div class="progress-container">
                    <div class="progress-fill" style="width: ${p1Percent}%; background-color: #3b82f6"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold">Part II: Motor Experiences</td>
                <td style="text-align: center; font-weight: bold; color: #10b981">${p2}</td>
                <td style="text-align: center; color: #6c757d">52</td>
                <td style="text-align: center">
                  <div style="display: inline-block; padding: 2px 8px; background-color: #e9ecef; border-radius: 4px">
                    ${p2Percent}%
                  </div>
                </td>
                <td>
                  <div class="progress-container">
                    <div class="progress-fill" style="width: ${p2Percent}%; background-color: #10b981"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold">Part III: Motor Examination</td>
                <td style="text-align: center; font-weight: bold; color: #f59e0b">${p3}</td>
                <td style="text-align: center; color: #6c757d">132</td>
                <td style="text-align: center">
                  <div style="display: inline-block; padding: 2px 8px; background-color: #e9ecef; border-radius: 4px">
                    ${p3Percent}%
                  </div>
                </td>
                <td>
                  <div class="progress-container">
                    <div class="progress-fill" style="width: ${p3Percent}%; background-color: #f59e0b"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="font-weight: bold">Part IV: Motor Complications</td>
                <td style="text-align: center; font-weight: bold; color: #ef4444">${p4}</td>
                <td style="text-align: center; color: #6c757d">24</td>
                <td style="text-align: center">
                  <div style="display: inline-block; padding: 2px 8px; background-color: #e9ecef; border-radius: 4px">
                    ${p4Percent}%
                  </div>
                </td>
                <td>
                  <div class="progress-container">
                    <div class="progress-fill" style="width: ${p4Percent}%; background-color: #ef4444"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Total Score Summary -->
          <div style="background-color: #f8f9fa; padding: 12px; border-radius: 6px; border: 1px solid #dee2e6; margin-top: 15px">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px">
              <div>
                <h3 style="margin: 0; font-size: 11pt; color: #2c3e50">TOTAL MDS-UPDRS SCORE</h3>
                <p style="margin: 5px 0 0 0; font-size: 8pt; color: #6c757d">Maximum possible score: 260 points</p>
              </div>
              <div style="font-size: 18pt; font-weight: bold; color: ${stageInfo.color}; text-align: right">
                ${total}
                <span style="font-size: 12pt; color: #6c757d">/260</span>
                <div style="font-size: 9pt; color: #6c757d; margin-top: 2px">(${totalPercent}%)</div>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div style="position: relative; margin-top: 10px">
              <div style="height: 8px; background-color: #e9ecef; border-radius: 4px; overflow: hidden; position: relative">
                <div style="width: ${totalPercent}%; height: 100%; background-color: ${stageInfo.color}; border-radius: 4px"></div>
                <div style="position: absolute; top: 0; left: 11.5%; width: 1px; height: 100%; background-color: #10b981"></div>
                <div style="position: absolute; top: 0; left: 23%; width: 1px; height: 100%; background-color: #f59e0b"></div>
              </div>
              
              <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 7pt; color: #6c757d">
                <span>0 (Mild)</span>
                <span>30 (Moderate)</span>
                <span>60 (Severe)</span>
                <span>260</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Clinical Assessment Summary -->
        <div class="stage-card">
          <h2 style="margin: 0 0 10px 0; color: ${stageInfo.color}; font-size: 12pt; border-bottom: 1px solid ${stageInfo.color}40; padding-bottom: 5px">
            CLINICAL ASSESSMENT SUMMARY
          </h2>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
            <div>
              <h3 style="margin: 0 0 5px 0; font-size: 11pt; color: ${stageInfo.color}; font-weight: bold">
                ${stageInfo.stage} - ${stageInfo.severity} SEVERITY
              </h3>
              <p style="margin: 0; font-size: 9pt; color: #495057">
                ${stageInfo.description}
              </p>
            </div>
            
            <div style="background-color: ${stageInfo.color}; color: white; padding: 8px 12px; border-radius: 4px; text-align: center; min-width: 80px">
              <div style="font-size: 10pt; font-weight: bold">H&Y Stage</div>
              <div style="font-size: 14pt; font-weight: bold; margin-top: 2px">
                ${stageInfo.severity === 'Mild' ? '1-2' : stageInfo.severity === 'Moderate' ? '3' : '4-5'}
              </div>
            </div>
          </div>
          
          <!-- Key Metrics -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 12px; font-size: 9pt">
            <div style="background-color: white; padding: 6px; border-radius: 4px; border: 1px solid #dee2e6">
              <strong style="color: #495057">Score Range:</strong><br/>
              ${stageInfo.severity === 'Mild' ? '0-30' : stageInfo.severity === 'Moderate' ? '31-60' : '61-260'}
            </div>
            <div style="background-color: white; padding: 6px; border-radius: 4px; border: 1px solid #dee2e6">
              <strong style="color: #495057">Follow-up Frequency:</strong><br/>
              ${stageInfo.severity === 'Mild' ? '6-12 months' : stageInfo.severity === 'Moderate' ? '3-6 months' : '1-3 months'}
            </div>
            <div style="background-color: white; padding: 6px; border-radius: 4px; border: 1px solid #dee2e6">
              <strong style="color: #495057">Treatment Priority:</strong><br/>
              ${stageInfo.severity === 'Mild' ? 'Standard' : stageInfo.severity === 'Moderate' ? 'Moderate' : 'High'}
            </div>
            <div style="background-color: white; padding: 6px; border-radius: 4px; border: 1px solid #dee2e6">
              <strong style="color: #495057">Clinical Urgency:</strong><br/>
              ${stageInfo.severity === 'Mild' ? 'Routine' : stageInfo.severity === 'Moderate' ? 'Monitor' : 'Immediate'}
            </div>
          </div>
          
          <!-- Clinical Recommendations in Two Columns -->
          <div>
            <h4 style="margin: 0 0 8px 0; font-size: 10pt; color: ${stageInfo.color}; border-bottom: 1px solid #dee2e6; padding-bottom: 4px">
              CLINICAL RECOMMENDATIONS:
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px">
              <div>
                <ul style="margin: 0; padding-left: 15px; font-size: 9pt; color: #495057">
                  ${stageInfo.clinicalImplications.slice(0, 2).map(item => `<li style="margin-bottom: 8px">${item}</li>`).join('')}
                </ul>
              </div>
              <div>
                <ul style="margin: 0; padding-left: 15px; font-size: 9pt; color: #495057">
                  ${stageInfo.clinicalImplications.slice(2, 4).map(item => `<li style="margin-bottom: 8px">${item}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div style="display: flex; justify-content: space-between; align-items: flex-end">
            <div style="width: 60%">
              <p style="margin: 0 0 5px 0">
                <strong>Disclaimer:</strong> This report is generated automatically based on the MDS-UPDRS assessment. 
                It is intended for clinical reference only and should be reviewed by a qualified healthcare professional.
                All interpretations are based on standardized clinical guidelines.
              </p>
              <p style="margin: 0">
                © ${new Date().getFullYear()} Movement Disorder Society. MDS-UPDRS Version 2.0. All rights reserved.
              </p>
            </div>
            
            <div style="text-align: center; min-width: 120px">
              <div style="margin-bottom: 5px; padding: 4px 8px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6; font-size: 7pt">
                <strong>Verified By:</strong><br/>
                _________________________
              </div>
              <div style="font-size: 7pt">
                <strong>Digital ID:</strong> ${reportId}<br/>
                <strong>Timestamp:</strong> ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 15px; padding: 6px; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6; font-size: 7pt">
            CONFIDENTIAL MEDICAL REPORT - For authorized clinical use only | Unauthorized distribution prohibited
          </div>
        </div>
      </div>
    `;
  };

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Create a hidden iframe for PDF generation
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = '210mm';
      iframe.style.height = '297mm';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentWindow.document;
      
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>MDS-UPDRS Report - ${reportId}</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 15mm;
              }
              
              body {
                margin: 0;
                padding: 0;
                font-family: 'Arial', sans-serif;
                font-size: 10pt;
                line-height: 1.3;
                color: #000;
                background: white;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
                width: 210mm;
                min-height: 297mm;
                padding: 15mm;
                box-sizing: border-box;
              }
              
              .printable-report {
                width: 100%;
                min-height: 100%;
              }
              
              /* Header */
              .print-header {
                border-bottom: 2px solid #2c3e50;
                padding-bottom: 10px;
                margin-bottom: 15px;
              }
              
              .report-title {
                margin: 0 0 5px 0;
                color: #2c3e50;
                font-size: 20pt;
                font-weight: bold;
              }
              
              .report-subtitle {
                margin: 0 0 8px 0;
                color: #7f8c8d;
                font-size: 9pt;
              }
              
              /* Tables */
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 9pt;
              }
              
              th {
                background-color: #2c3e50;
                color: white;
                padding: 8px;
                text-align: left;
              }
              
              td {
                padding: 8px;
                border: 1px solid #dee2e6;
              }
              
              /* Progress bars */
              .progress-container {
                height: 6px;
                background-color: #e9ecef;
                border-radius: 3px;
                overflow: hidden;
              }
              
              .progress-fill {
                height: 100%;
                border-radius: 3px;
              }
              
              /* Sections */
              .section {
                margin-bottom: 15px;
              }
              
              .section-title {
                margin: 0 0 10px 0;
                color: #2c3e50;
                font-size: 12pt;
                border-bottom: 1px solid #ced4da;
                padding-bottom: 5px;
              }
              
              /* Stage card */
              .stage-card {
                padding: 12px;
                border-radius: 6px;
                border: 2px solid ${stageInfo.color};
                background-color: ${stageInfo.color}15;
              }
              
              /* Footer */
              .footer {
                margin-top: 20px;
                padding-top: 10px;
                border-top: 1px solid #dee2e6;
                font-size: 8pt;
                color: #6c757d;
              }
            </style>
          </head>
          <body>
            ${generatePrintableReportHTML()}
          </body>
        </html>
      `);
      iframeDoc.close();
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate PDF from iframe
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 210 * 3.78, // Convert mm to pixels
        height: 297 * 3.78, // Convert mm to pixels
        windowWidth: 210 * 3.78,
        windowHeight: 297 * 3.78
      });
      
      document.body.removeChild(iframe);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      pdf.save(`MDS-UPDRS_Report_${reportId}.pdf`);
      
      alert("✅ PDF report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("❌ Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareWhatsApp = () => {
    const patientName = formData.patientName || "Patient";
    const totalScore = total;
    const stage = stageInfo.stage;
    const severity = stageInfo.severity;
    
    const message = `📋 *MDS-UPDRS Assessment Report*\n\n` +
                    `*Patient:* ${patientName}\n` +
                    `*Report ID:* ${reportId}\n` +
                    `*Total Score:* ${totalScore}/260\n` +
                    `*Stage:* ${stage}\n` +
                    `*Severity:* ${severity}\n` +
                    `*Assessment Date:* ${formatDate(currentDateTime)}\n\n` +
                    `*Summary:*\n` +
                    `Part I (Non-Motor): ${p1}/52\n` +
                    `Part II (Motor Experiences): ${p2}/52\n` +
                    `Part III (Motor Exam): ${p3}/132\n` +
                    `Part IV (Complications): ${p4}/24\n\n` +
                    `*Clinical Stage:* ${stageInfo.description}\n\n` +
                    `This is an automated report generated by the MDS-UPDRS Assessment System.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="summary-container">
      {/* Report Header */}
      <div className="report-header">
        <div className="header-left">
          <GiHospitalCross className="hospital-logo" />
          <div>
            <h1 className="report-title">MDS-UPDRS Assessment Report</h1>
            <p className="report-subtitle">Movement Disorder Society - Clinical Evaluation</p>
          </div>
        </div>
        <div className="header-right">
          <div className="report-id">
            <span className="id-label">Report ID:</span>
            <span className="id-value">{reportId}</span>
          </div>
          <div className="report-date">
            <FaCalendarAlt className="date-icon" />
            <span>{formatDate(currentDateTime)}</span>
          </div>
        </div>
      </div>

      {/* Patient Information Card - Location Removed */}
      <div className="patient-info-card">
        <div className="card-header">
          <FaUserMd className="header-icon" />
          <h2>Patient Information</h2>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Patient Name</span>
            <span className="info-value">{formData.patientName || "Not provided"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Patient ID</span>
            <span className="info-value">{formData.patientId || "Not provided"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Physician</span>
            <span className="info-value">{formData.doctorName || "Not provided"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Medical Facility</span>
            <span className="info-value">{formData.clinicName || "Not specified"}</span>
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="score-overview">
        <div className="overview-header">
          <FaClipboardList className="header-icon" />
          <h2>Assessment Scores Overview</h2>
        </div>
        
        <div className="score-cards-grid">
          <div className="score-card part1">
            <div className="card-icon">
              <FaBrain />
            </div>
            <div className="card-content">
              <h3>Part I</h3>
              <p className="card-subtitle">Non-Motor Symptoms</p>
              <div className="score-display">
                <span className="score-value">{p1}</span>
                <span className="score-max">/52</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${p1Percent}%`, background: stageInfo.color }}
                />
              </div>
              <div className="score-percentage">{p1Percent}%</div>
            </div>
          </div>

          <div className="score-card part2">
            <div className="card-icon">
              <FaHandsHelping />
            </div>
            <div className="card-content">
              <h3>Part II</h3>
              <p className="card-subtitle">Motor Experiences</p>
              <div className="score-display">
                <span className="score-value">{p2}</span>
                <span className="score-max">/52</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${p2Percent}%`, background: stageInfo.color }}
                />
              </div>
              <div className="score-percentage">{p2Percent}%</div>
            </div>
          </div>

          <div className="score-card part3">
            <div className="card-icon">
              <FaWalking />
            </div>
            <div className="card-content">
              <h3>Part III</h3>
              <p className="card-subtitle">Motor Examination</p>
              <div className="score-display">
                <span className="score-value">{p3}</span>
                <span className="score-max">/132</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${p3Percent}%`, background: stageInfo.color }}
                />
              </div>
              <div className="score-percentage">{p3Percent}%</div>
            </div>
          </div>

          <div className="score-card part4">
            <div className="card-icon">
              <FaChartBar />
            </div>
            <div className="card-content">
              <h3>Part IV</h3>
              <p className="card-subtitle">Motor Complications</p>
              <div className="score-display">
                <span className="score-value">{p4}</span>
                <span className="score-max">/24</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${p4Percent}%`, background: stageInfo.color }}
                />
              </div>
              <div className="score-percentage">{p4Percent}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Score & Stage Assessment */}
      <div className="stage-assessment">
        <div className="assessment-header">
          <FaChartLine className="header-icon" />
          <h2>Clinical Assessment Summary</h2>
        </div>
        
        <div className="assessment-content">
          <div className="total-score-card">
            <div className="total-score-header">
              <h3>Total MDS-UPDRS Score</h3>
              <div className="score-badge" style={{ background: stageInfo.color }}>
                {total}/260
              </div>
            </div>
            
            <div className="total-progress">
              <div className="progress-container">
                <div className="progress-track">
                  <div 
                    className="total-progress-fill" 
                    style={{ width: `${totalPercent}%`, background: stageInfo.color }}
                  />
                  
                  <div className="severity-markers">
                    <div 
                      className="severity-marker mild-marker" 
                      style={{ 
                        left: '0%', 
                        width: '11.5%',
                        background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.4))'
                      }}
                    ></div>
                    <div 
                      className="severity-marker moderate-marker" 
                      style={{ 
                        left: '11.5%', 
                        width: '11.5%',
                        background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.4))'
                      }}
                    ></div>
                    <div 
                      className="severity-marker severe-marker" 
                      style={{ 
                        left: '23%', 
                        width: '77%',
                        background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.4))'
                      }}
                    ></div>
                  </div>
                  
                  <div 
                    className="score-indicator" 
                    style={{ left: `${totalPercent}%`, background: stageInfo.color }}
                  >
                    <div className="indicator-line"></div>
                    <div className="indicator-value">{total}</div>
                  </div>
                  
                  <div className="threshold-markers">
                    <div className="threshold-marker" style={{ left: '11.5%', background: '#10B981' }}></div>
                    <div className="threshold-marker" style={{ left: '23%', background: '#F59E0B' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="progress-labels">
                <span>0</span>
                <span>130</span>
                <span>260</span>
              </div>
              
              <div className="severity-labels">
                <div className="severity-label" style={{ left: '5.75%' }}>
                  <span className="label-text mild">Mild</span>
                  <span className="label-range">0-30</span>
                </div>
                <div className="severity-label" style={{ left: '17.25%' }}>
                  <span className="label-text moderate">Moderate</span>
                  <span className="label-range">31-60</span>
                </div>
                <div className="severity-label" style={{ left: '50%' }}>
                  <span className="label-text severe">Severe</span>
                  <span className="label-range">61-260</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stage-card" style={{ borderColor: stageInfo.color }}>
            <div className="stage-header">
              {stageInfo.icon}
              <div>
                <h3 style={{ color: stageInfo.color }}>{stageInfo.stage}</h3>
                <p className="stage-subtitle">{stageInfo.severity} Severity</p>
              </div>
            </div>
            <p className="stage-description">{stageInfo.description}</p>
            <div className="stage-details">
              <div className="detail-item">
                <span className="detail-label">Hoehn & Yahr Stage:</span>
                <span className="detail-value">{stageInfo.severity === 'Mild' ? '1-2' : stageInfo.severity === 'Moderate' ? '3' : '4-5'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Score Range:</span>
                <span className="detail-value">
                  {stageInfo.severity === 'Mild' ? '0-30' : stageInfo.severity === 'Moderate' ? '31-60' : '61-260'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Clinical Recommendation:</span>
                <span className="detail-value">
                  {stageInfo.severity === 'Mild' 
                    ? 'Routine monitoring & lifestyle adjustments' 
                    : stageInfo.severity === 'Moderate' 
                    ? 'Therapy adjustments & regular follow-ups' 
                    : 'Intensive management & multidisciplinary care'}
                </span>
              </div>
            </div>
            
            {/* Clinical Recommendations in Two Columns */}
            <div className="clinical-recommendations">
              <h4 style={{ color: stageInfo.color, marginBottom: '12px', borderBottom: `1px solid ${stageInfo.color}40`, paddingBottom: '6px' }}>
                Clinical Recommendations:
              </h4>
              <div className="recommendations-grid">
                <div className="recommendations-column">
                  <ul>
                    {stageInfo.clinicalImplications.slice(0, 2).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="recommendations-column">
                  <ul>
                    {stageInfo.clinicalImplications.slice(2, 4).map((item, index) => (
                      <li key={index + 2}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <div className="top-row">
          <div className="top-row-buttons">
            <button onClick={handlePrint} className="action-button print">
              <FaPrint />
              <span>Print Report</span>
            </button>
            <button onClick={handleExportPDF} disabled={isGeneratingPDF} className="action-button export">
              {isGeneratingPDF ? (
                <>
                  <div className="spinner"></div>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FaFilePdf />
                  <span>Export PDF</span>
                </>
              )}
            </button>
            <button onClick={handleShareWhatsApp} className="action-button share whatsapp">
              <FaWhatsapp />
              <span>Share via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="report-footer">
        <div className="footer-content">
          <div className="footer-left">
            <FaFileMedicalAlt />
            <span>© 2008 Movement Disorder Society. All rights reserved.</span>
          </div>
          <div className="footer-center">
            <GiMedicalPack />
            <span>MDS-UPDRS Version 2.0 - Certified Assessment Tool</span>
          </div>
          <div className="footer-right">
            <span className="confidential">CONFIDENTIAL MEDICAL REPORT</span>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .summary-container {
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: white;
        }

        .report-header {
          background: white;
          border-radius: 20px 20px 0 0;
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .hospital-logo {
          font-size: 48px;
          color: #3b82f6;
        }

        .report-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .report-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .header-right {
          text-align: right;
        }

        .report-id {
          margin-bottom: 12px;
        }

        .id-label {
          font-size: 14px;
          color: #6b7280;
          margin-right: 8px;
        }

        .id-value {
          font-size: 16px;
          font-weight: 600;
          color: #3b82f6;
          background: #eff6ff;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .report-date {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .date-icon {
          color: #8b5cf6;
        }

        .patient-info-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .header-icon {
          font-size: 24px;
          color: #3b82f6;
        }

        .card-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .info-value {
          font-size: 16px;
          color: #1f2937;
          font-weight: 500;
        }

        .score-overview {
          background: white;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .overview-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .score-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          width: 100%;
        }

        @media (max-width: 1200px) {
          .score-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .score-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .score-card {
          background: #f9fafb;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .score-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .score-card.part1 {
          border-top: 4px solid #3b82f6;
        }

        .score-card.part2 {
          border-top: 4px solid #10b981;
        }

        .score-card.part3 {
          border-top: 4px solid #f59e0b;
        }

        .score-card.part4 {
          border-top: 4px solid #ef4444;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 16px;
          border: 1px solid #e5e7eb;
        }

        .score-card.part1 .card-icon {
          color: #3b82f6;
          border-color: #3b82f6;
        }

        .score-card.part2 .card-icon {
          color: #10b981;
          border-color: #10b981;
        }

        .score-card.part3 .card-icon {
          color: #f59e0b;
          border-color: #f59e0b;
        }

        .score-card.part4 .card-icon {
          color: #ef4444;
          border-color: #ef4444;
        }

        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .card-content h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px;
        }

        .card-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 16px;
        }

        .score-display {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 12px;
        }

        .score-value {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .score-max {
          font-size: 18px;
          color: #6b7280;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
          width: 100%;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1s ease;
        }

        .score-percentage {
          font-size: 14px;
          color: #6b7280;
          text-align: right;
          margin-top: auto;
        }

        .stage-assessment {
          background: white;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .assessment-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .assessment-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        @media (max-width: 1024px) {
          .assessment-content {
            grid-template-columns: 1fr;
          }
        }

        .total-score-card {
          background: #f9fafb;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
        }

        .total-score-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 50px;
        }

        .total-score-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .score-badge {
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 18px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .total-progress {
          margin-bottom: 32px;
        }

        .progress-container {
          position: relative;
          height: 12px;
          background: #e5e7eb;
          border-radius: 6px;
          overflow: visible;
          margin-bottom: 12px;
        }

        .progress-track {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .total-progress-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 1s ease;
          position: relative;
          z-index: 5;
        }

        .severity-markers {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .severity-marker {
          position: absolute;
          top: 0;
          height: 100%;
          border-radius: 6px;
          opacity: 0.3;
          z-index: 1;
        }

        .threshold-markers {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 6;
        }

        .threshold-marker {
          position: absolute;
          top: -4px;
          width: 2px;
          height: 20px;
          border-radius: 1px;
        }

        .score-indicator {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
        }

        .indicator-line {
          width: 2px;
          height: 30px;
          background: inherit;
          margin: 0 auto;
        }

        .indicator-value {
          position: absolute;
          top: -45px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          color: #1f2937;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid;
          border-color: inherit;
          white-space: nowrap;
          z-index: 20;
        }

        .indicator-value:after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid;
          border-top-color: inherit;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
          margin-top: 8px;
          margin-bottom: 40px;
        }

        .severity-labels {
          position: relative;
          height: 40px;
        }

        .severity-label {
          position: absolute;
          top: 0;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
        }

        .label-text {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 2px;
          white-space: nowrap;
        }

        .label-range {
          font-size: 10px;
          color: #6b7280;
        }

        .severity-label .label-text.mild {
          color: #10b981;
        }

        .severity-label .label-text.moderate {
          color: #f59e0b;
        }

        .severity-label .label-text.severe {
          color: #ef4444;
        }

        .stage-card {
          background: #f9fafb;
          border-radius: 16px;
          padding: 24px;
          border: 2px solid;
        }

        .stage-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .stage-header svg {
          font-size: 32px;
        }

        .stage-header h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px;
        }

        .stage-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .stage-description {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .stage-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .detail-value {
          font-size: 14px;
          color: #1f2937;
          font-weight: 500;
          text-align: left;
          max-width: 400px;
        }

        .clinical-recommendations {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .recommendations-column ul {
          margin: 0;
          padding-left: 20px;
          font-size: 14px;
          color: #4b5563;
        }

        .recommendations-column li {
          margin-bottom: 10px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .recommendations-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .action-buttons {
          background: white;
          border-radius: 16px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .top-row {
          background: #f9fafb;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .top-row-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .bottom-row {
          padding: 24px;
        }

        .bottom-row-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 180px;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .action-button.print {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: 1px solid #1d4ed8;
        }

        .action-button.print:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.35);
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }

        .action-button.export {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: 1px solid #047857;
        }

        .action-button.export:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.35);
          background: linear-gradient(135deg, #059669, #047857);
        }

        .action-button.share.whatsapp {
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white;
          border: 1px solid #075E54;
        }

        .action-button.share.whatsapp:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.35);
          background: linear-gradient(135deg, #128C7E, #075E54);
        }

        .action-button.back {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: 1px solid #b45309;
        }

        .action-button.back:hover {
          transform: translateX(-4px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.35);
          background: linear-gradient(135deg, #d97706, #b45309);
        }

        .action-button.submit {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: 1px solid #b91c1c;
        }

        .action-button.submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.35);
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        .report-footer {
          background: white;
          border-radius: 0 0 20px 20px;
          padding: 20px 32px;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #6b7280;
        }

        .footer-left, .footer-center {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-right .confidential {
          background: #fee2e2;
          color: #991b1b;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .top-row-buttons,
          .bottom-row-buttons {
            flex-direction: column;
            gap: 16px;
          }
          
          .action-button {
            width: 100%;
            min-width: auto;
            padding: 16px 24px;
          }
          
          .bottom-row-buttons {
            flex-direction: column;
          }
          
          .action-button.back,
          .action-button.submit {
            width: 100%;
          }
          
          .report-header {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          
          .header-left {
            flex-direction: column;
            text-align: center;
          }
          
          .header-right {
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .top-row,
          .bottom-row {
            padding: 20px;
          }
          
          .action-button {
            padding: 14px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Summary;
import React from "react";
import { motion } from "framer-motion";
import { FaCheck, FaInfoCircle } from "react-icons/fa";

const PartForm = ({ part, items, scores, onUpdate }) => {
  const partNames = { part1: "I", part2: "II", part3: "III", part4: "IV" };

  // Always ensure we have a Map
  const scoresMap = scores instanceof Map ? scores : new Map(Object.entries(scores || {}));

  const getScoreColor = (score) => {
    switch(score) {
      case 0: return "#10B981"; // Normal - Green
      case 1: return "#84CC16"; // Slight - Lime
      case 2: return "#F59E0B"; // Mild - Amber
      case 3: return "#EF4444"; // Moderate - Red
      case 4: return "#DC2626"; // Severe - Dark Red
      default: return "#9CA3AF"; // Default - Gray
    }
  };

  const getScoreLabel = (score) => {
    const labels = ["Normal", "Slight", "Mild", "Moderate", "Severe"];
    return labels[score] || score;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="part-form-container"
    >
      <div className="step-title">
        Part {partNames[part]}: {items[0]?.type === "rater" ? "Clinician-Rated" : "Patient Questionnaire"}
      </div>

      {/* Scoring Guide */}
      <div className="scoring-guide">
        <div className="guide-header">
          <FaInfoCircle />
          <span>Scoring Guide: Click a number to rate severity (0-4)</span>
        </div>
        <div className="guide-scale">
          {[0, 1, 2, 3, 4].map((score) => (
            <div key={score} className="guide-item">
              <div className="guide-score" style={{ background: getScoreColor(score) }}>
                {score}
              </div>
              <span className="guide-label">{getScoreLabel(score)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-container">
        {items.map((item) => {
          const isSelected = scoresMap.has(item.id);
          const selectedScore = scoresMap.get(item.id);

          return (
            <motion.div 
              key={item.id}
              className={`question-card ${isSelected ? 'scored' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: items.indexOf(item) * 0.05 }}
            >
              {/* Question Header */}
              <div className="question-header">
                <div className="question-number">{item.id}</div>
                <div className="question-content">
                  <h3 className="question-title">{item.question || item.title}</h3>
                  {item.description && (
                    <p className="question-description">{item.description}</p>
                  )}
                </div>
                <div className="question-status">
                  {isSelected ? (
                    <div className="status-badge scored">
                      <FaCheck />
                      <span>Scored: {selectedScore}</span>
                    </div>
                  ) : (
                    <div className="status-badge pending">Not Scored</div>
                  )}
                </div>
              </div>

              {/* FIXED: 5 Rating Options in One Line */}
              <div className="rating-scale">
                <div className="scale-numbers">
                  {[0, 1, 2, 3, 4].map((score) => {
                    const isScoreSelected = selectedScore === score;
                    
                    return (
                      <div
                        key={score}
                        className={`scale-number ${isScoreSelected ? 'selected' : ''}`}
                        onClick={() => onUpdate(part, item.id, score)}
                        style={{
                          background: isScoreSelected ? getScoreColor(score) : 'white',
                          borderColor: isScoreSelected ? getScoreColor(score) : '#E5E7EB',
                          color: isScoreSelected ? 'white' : '#374151'
                        }}
                      >
                        <span className="number">{score}</span>
                        {isScoreSelected && (
                          <motion.div 
                            className="selection-indicator"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <FaCheck />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Labels under the numbers */}
                <div className="scale-labels">
                  {[0, 1, 2, 3, 4].map((score) => (
                    <div key={score} className="scale-label">
                      <span className="label-text">{getScoreLabel(score)}</span>
                    </div>
                  ))}
                </div>

                {/* Clear Button */}
                {isSelected && (
                  <div className="clear-container">
                    <button 
                      className="clear-button"
                      onClick={() => onUpdate(part, item.id, null)}
                    >
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add CSS Styles */}
      <style jsx>{`
        .part-form-container {
          padding: 20px;
        }

        .step-title {
          font-size: 24px;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #E5E7EB;
        }

        /* Scoring Guide */
        .scoring-guide {
          background: #F8FAFC;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid #E5E7EB;
        }

        .guide-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          color: #3B82F6;
          font-weight: 600;
        }

        .guide-scale {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .guide-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          flex: 1;
        }

        .guide-score {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .guide-label {
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Question Cards */
        .questions-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .question-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #E5E7EB;
          transition: all 0.3s ease;
        }

        .question-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .question-card.scored {
          border-color: #3B82F6;
          background: #F8FAFC;
        }

        .question-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .question-number {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .question-content {
          flex: 1;
        }

        .question-title {
          font-size: 18px;
          font-weight: 600;
          color: #1F2937;
          margin: 0 0 8px;
          line-height: 1.4;
        }

        .question-description {
          font-size: 14px;
          color: #6B7280;
          margin: 0;
          line-height: 1.5;
        }

        .question-status {
          flex-shrink: 0;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.scored {
          background: #D1FAE5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .status-badge.pending {
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #FDE68A;
        }

        /* FIXED: Rating Scale - 5 items in one line */
        .rating-scale {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .scale-numbers {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .scale-number {
          height: 60px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          user-select: none;
        }

        .scale-number:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          border-color: #3B82F6;
        }

        .scale-number.selected {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .scale-number .number {
          z-index: 2;
          position: relative;
        }

        .selection-indicator {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #10B981;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          z-index: 3;
        }

        .scale-labels {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          text-align: center;
        }

        .scale-label {
          font-size: 12px;
          color: #6B7280;
          font-weight: 500;
          padding: 0 4px;
        }

        .label-text {
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Clear Button */
        .clear-container {
          display: flex;
          justify-content: center;
          margin-top: 16px;
        }

        .clear-button {
          padding: 8px 20px;
          background: #F3F4F6;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          color: #6B7280;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-button:hover {
          background: #E5E7EB;
          color: #374151;
        }

        /* Option Descriptions */
        .option-descriptions {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px dashed #E5E7EB;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          padding: 8px;
          background: #F8FAFC;
          border-radius: 8px;
        }

        .option-item:last-child {
          margin-bottom: 0;
        }

        .option-number {
          width: 24px;
          height: 24px;
          background: #3B82F6;
          color: white;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 12px;
          flex-shrink: 0;
        }

        .option-text {
          font-size: 13px;
          color: #4B5563;
          line-height: 1.4;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .scale-numbers {
            gap: 8px;
          }

          .scale-number {
            height: 50px;
            font-size: 20px;
          }

          .scale-labels {
            gap: 8px;
          }

          .label-text {
            font-size: 10px;
          }

          .question-header {
            flex-direction: column;
            gap: 12px;
          }

          .question-status {
            align-self: flex-start;
          }

          .guide-scale {
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          }

          .guide-item {
            flex: 0 0 calc(50% - 8px);
          }
        }

        @media (max-width: 480px) {
          .scale-numbers {
            grid-template-columns: repeat(5, 1fr);
            gap: 6px;
          }

          .scale-number {
            height: 45px;
            font-size: 18px;
          }

          .scale-labels {
            display: none; /* Hide labels on very small screens */
          }

          .question-card {
            padding: 16px;
          }

          .guide-item {
            flex: 0 0 100%;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default PartForm;
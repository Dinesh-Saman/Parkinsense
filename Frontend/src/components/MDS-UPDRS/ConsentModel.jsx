import React from "react";
import { motion } from "framer-motion";

const ConsentModal = ({ onAgree }) => {
  return (
    <motion.div
      className="consent-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="consent-box"
        initial={{ scale: 0.8, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h2>Informed Consent</h2>
        <p>
          I consent to this MDS-UPDRS assessment for evaluating Parkinson's disease severity. 
          I understand that my responses will be used to generate a clinical score and stage prediction. 
          All data is stored securely in compliance with HIPAA and GDPR standards. 
          Results are for medical evaluation only and will be reviewed by a qualified clinician.
        </p>
        <div style={{ textAlign: "right" }}>
          <button className="btn btn-success" onClick={onAgree}>
            I Agree & Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConsentModal;
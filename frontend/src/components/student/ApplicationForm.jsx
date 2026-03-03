import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applicationService } from "../../services/api";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    seniorHighSchoolName: "",
    chosenTrack: "",
    graduationYear: "",
    gpa: "",
    intendedMajor: "",
    extracurricularActivities: "",
    personalStatement: "",
  });

  // File uploads
  const [grade11Transcript, setGrade11Transcript] = useState(null);
  const [grade12Transcript, setGrade12Transcript] = useState(null);
  const [moralCertificate, setMoralCertificate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleFileChange = (e, setter, fieldName) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 5MB" });
      return;
    }
    setter(file);
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: false });
    }
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    console.log("=== FORM DATA ===");
    console.log(formData);
    console.log("=== FILES ===", {
      grade11Transcript,
      grade12Transcript,
      moralCertificate,
    });

    // Required text fields
    if (!formData.fullName.trim()) newErrors.fullName = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.phone.trim()) newErrors.phone = true;
    if (!formData.dateOfBirth) newErrors.dateOfBirth = true;
    if (!formData.address.trim()) newErrors.address = true;
    if (!formData.seniorHighSchoolName.trim())
      newErrors.seniorHighSchoolName = true;
    if (!formData.chosenTrack) newErrors.chosenTrack = true;
    if (!formData.graduationYear) newErrors.graduationYear = true;
    if (!formData.gpa) newErrors.gpa = true;
    if (!formData.intendedMajor) newErrors.intendedMajor = true;

    // Required files
    if (!grade11Transcript) newErrors.grade11Transcript = true;
    if (!grade12Transcript) newErrors.grade12Transcript = true;
    if (!moralCertificate) newErrors.moralCertificate = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate form
    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields and upload all required documents.",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare application data
      const applicationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        highSchoolName: formData.seniorHighSchoolName,
        highSchoolGpa: parseFloat(formData.gpa), // Use the GPA from form
        graduationYear: parseInt(formData.graduationYear), // Convert to number
        intendedMajor: formData.intendedMajor,
        extracurricularActivities: formData.extracurricularActivities || null,
        personalStatement: formData.personalStatement || null,
        seniorHighTrack: formData.chosenTrack,
      };

      const response =
        await applicationService.createApplication(applicationData);
      const applicationId = response.data.application.id;

      // Upload documents
      const uploadPromises = [
        uploadDocument(applicationId, grade11Transcript, "Grade 11 Transcript"),
        uploadDocument(applicationId, grade12Transcript, "Grade 12 Transcript"),
        uploadDocument(
          applicationId,
          moralCertificate,
          "Good Moral Certificate",
        ),
      ];

      await Promise.all(uploadPromises);

      setMessage({
        type: "success",
        text: "Application and documents submitted successfully!",
      });
      setTimeout(() => navigate("/student/applications"), 2000);
    } catch (error) {
      console.error("Submit error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to submit application",
      });
      setLoading(false);
    }
  };

  const uploadDocument = async (applicationId, file, documentType) => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("applicationId", applicationId);
    formData.append("documentType", documentType);

    const response = await fetch("http://localhost:5000/api/documents/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${documentType}`);
    }

    return response.json();
  };

  // Modern input styles
  const getInputStyle = (fieldName, hasError = false) => ({
    width: "100%",
    padding: "14px 16px",
    border: hasError 
      ? "2px solid #ef4444" 
      : errors[fieldName] 
        ? "2px solid #ef4444" 
        : "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "1rem",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    transition: "all 0.2s ease",
    backgroundColor: "#fff",
    outline: "none",
    boxSizing: "border-box",
  });

  // Focus handler for input styles
  const handleFocus = (e) => {
    e.target.style.borderColor = "#5182ec";
    e.target.style.boxShadow = "0 0 0 4px rgba(81, 130, 236, 0.15)";
    e.target.style.transform = "scale(1.01)";
  };

  const handleBlur = (e, fieldName) => {
    const hasError = errors[fieldName];
    e.target.style.borderColor = hasError ? "#ef4444" : "#e5e7eb";
    e.target.style.boxShadow = "none";
    e.target.style.transform = "scale(1)";
  };

  // Styles
  const styles = {
    pageContainer: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)",
      padding: "2rem",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    formContainer: {
      maxWidth: "900px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    headerIcon: {
      width: "80px",
      height: "80px",
      background: "linear-gradient(135deg, #5182ec 0%, #3b6fd4 100%)",
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1rem",
      boxShadow: "0 8px 24px rgba(81, 130, 236, 0.35)",
      fontSize: "2.5rem",
    },
    headerTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "0.5rem",
    },
    headerSubtitle: {
      color: "#64748b",
      fontSize: "1rem",
    },
    progressIndicator: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginTop: "1.5rem",
    },
    progressStep: (active, completed) => ({
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.5rem 1rem",
      background: active || completed 
        ? "linear-gradient(135deg, #5182ec 0%, #3b6fd4 100%)" 
        : "#e2e8f0",
      color: active || completed ? "white" : "#64748b",
      borderRadius: "20px",
      fontSize: "0.875rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
    }),
    card: {
      background: "white",
      borderRadius: "20px",
      padding: "2rem",
      marginBottom: "1.5rem",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      border: "1px solid #f1f5f9",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1.5rem",
      paddingBottom: "1rem",
      borderBottom: "2px solid #f1f5f9",
    },
    cardIcon: {
      width: "48px",
      height: "48px",
      background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "700",
      color: "#1e293b",
      margin: 0,
    },
    cardDescription: {
      fontSize: "0.875rem",
      color: "#64748b",
      marginTop: "0.25rem",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.25rem",
    },
    formGroup: {
      marginBottom: "0",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "600",
      color: "#374151",
      fontSize: "0.9rem",
    },
    required: {
      color: "#ef4444",
      marginLeft: "2px",
    },
    errorText: {
      color: "#ef4444",
      fontSize: "0.8rem",
      marginTop: "0.25rem",
      fontWeight: "500",
    },
    hint: {
      color: "#9ca3af",
      fontSize: "0.8rem",
      marginTop: "0.25rem",
    },
    textarea: {
      resize: "vertical",
      minHeight: "100px",
    },
    fileUploadSection: {
      background: "#f8fafc",
      borderRadius: "16px",
      padding: "1.5rem",
      border: "2px dashed #e2e8f0",
      transition: "all 0.3s ease",
    },
    fileUploadTitle: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#475569",
      marginBottom: "1rem",
      textAlign: "center",
    },
    fileUploadGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "1rem",
    },
    fileUploadBox: (fieldName, hasFile) => ({
      position: "relative",
      border: hasFile 
        ? "2px solid #10b981" 
        : errors[fieldName] 
          ? "2px dashed #ef4444" 
          : "2px dashed #cbd5e1",
      borderRadius: "16px",
      padding: "1.5rem",
      textAlign: "center",
      background: hasFile 
        ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)" 
        : "white",
      cursor: "pointer",
      transition: "all 0.3s ease",
      hover: {
        borderColor: "#5182ec",
        background: "#f0f7ff",
      },
    }),
    fileUploadIcon: {
      fontSize: "2.5rem",
      marginBottom: "0.75rem",
    },
    fileUploadLabel: {
      fontWeight: "600",
      color: "#374151",
      fontSize: "0.9rem",
      marginBottom: "0.25rem",
    },
    fileUploadHint: {
      fontSize: "0.75rem",
      color: "#9ca3af",
    },
    fileName: {
      marginTop: "0.75rem",
      padding: "0.5rem 0.75rem",
      background: "white",
      borderRadius: "8px",
      fontSize: "0.85rem",
      color: "#10b981",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      justifyContent: "flex-end",
      marginTop: "2rem",
      paddingTop: "1.5rem",
      borderTop: "2px solid #f1f5f9",
    },
    submitButton: {
      padding: "14px 32px",
      background: "linear-gradient(135deg, #5182ec 0%, #3b6fd4 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 16px rgba(81, 130, 236, 0.35)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    cancelButton: {
      padding: "14px 32px",
      background: "white",
      color: "#64748b",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    alert: (type) => ({
      padding: "1rem 1.5rem",
      borderRadius: "12px",
      marginBottom: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      fontSize: "0.95rem",
      fontWeight: "500",
      background: type === "success" 
        ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)" 
        : "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
      color: type === "success" ? "#065f46" : "#991b1b",
      border: `1px solid ${type === "success" ? "#a7f3d0" : "#fecaca"}`,
    }),
    selectArrow: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      backgroundSize: "20px",
      appearance: "none",
      paddingRight: "40px",
    },
  };

  const renderInput = (name, label, type = "text", required = true, placeholder = "", hint = "") => {
    const hasError = errors[name];
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, name)}
          placeholder={placeholder}
          style={{...getInputStyle(name, hasError), ...styles.selectArrow}}
        />
        {hasError && <div style={styles.errorText}>This field is required</div>}
        {hint && !hasError && <div style={styles.hint}>{hint}</div>}
      </div>
    );
  };

  const renderSelect = (name, label, options, required = true) => {
    const hasError = errors[name];
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, name)}
          style={{...getInputStyle(name, hasError), ...styles.selectArrow}}
        >
          {options}
        </select>
        {hasError && <div style={styles.errorText}>Please select an option</div>}
      </div>
    );
  };

  const renderTextarea = (name, label, required = true, placeholder = "", rows = 4) => {
    const hasError = errors[name];
    return (
      <div style={{...styles.formGroup, gridColumn: "1 / -1"}}>
        <label style={styles.label}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, name)}
          placeholder={placeholder}
          rows={rows}
          style={{...getInputStyle(name, hasError), ...styles.textarea}}
        />
        {!required && !hasError && <div style={styles.hint}>Optional</div>}
      </div>
    );
  };

  const renderFileUpload = (fieldName, label, file, setFile, accept = ".pdf,.jpg,.jpeg,.png") => {
    const hasFile = file !== null;
    const hasError = errors[fieldName];
    
    return (
      <div 
        style={styles.fileUploadBox(fieldName, hasFile)}
        onClick={() => document.getElementById(fieldName).click()}
      >
        <input
          type="file"
          id={fieldName}
          onChange={(e) => handleFileChange(e, setFile, fieldName)}
          accept={accept}
          style={{ display: "none" }}
        />
        <div style={styles.fileUploadIcon}>
          {hasFile ? "✅" : "📄"}
        </div>
        <div style={styles.fileUploadLabel}>{label}</div>
        <div style={styles.fileUploadHint}>
          {hasFile ? "Click to change file" : "Click to upload"}
        </div>
        {hasFile && (
          <div style={styles.fileName}>
            ✓ {file.name}
          </div>
        )}
        {hasError && !hasFile && (
          <div style={{...styles.errorText, marginTop: "0.5rem"}}>Required</div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>🎓</div>
          <h1 style={styles.headerTitle}>Submit Your Application</h1>
          <p style={styles.headerSubtitle}>
            Complete all sections below to apply for admission
          </p>
          
          {/* Progress Steps */}
          <div style={styles.progressIndicator}>
            <div style={styles.progressStep(true, true)}>
              <span>1</span> Personal Info
            </div>
            <div style={styles.progressStep(true, true)}>
              <span>2</span> Education
            </div>
            <div style={styles.progressStep(true, true)}>
              <span>3</span> Documents
            </div>
            <div style={styles.progressStep(true, false)}>
              <span>4</span> Review & Submit
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div style={styles.alert(message.type)}>
            {message.type === "success" ? "🎉" : "⚠️"} {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Information Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>👤</div>
              <div>
                <h3 style={styles.cardTitle}>Personal Information</h3>
                <p style={styles.cardDescription}>Tell us about yourself</p>
              </div>
            </div>
            
            <div style={styles.formGrid}>
              {renderInput("fullName", "Full Name", "text", true, "Enter your full name")}
              {renderInput("email", "Email Address", "email", true, "your.email@example.com")}
              {renderInput("phone", "Phone Number", "tel", true, "+1 (555) 000-0000")}
              {renderInput("dateOfBirth", "Date of Birth", "date", true)}
              <div style={{...styles.formGroup, gridColumn: "1 / -1"}}>
                <label style={styles.label}>
                  Address <span style={styles.required}>*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, "address")}
                  rows="3"
                  placeholder="Enter your complete address"
                  style={getInputStyle("address", errors.address)}
                />
                {errors.address && <div style={styles.errorText}>This field is required</div>}
              </div>
            </div>
          </div>

          {/* Senior High School Information Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>🏫</div>
              <div>
                <h3 style={styles.cardTitle}>Senior High School Information</h3>
                <p style={styles.cardDescription}>Your academic background</p>
              </div>
            </div>
            
            <div style={styles.formGrid}>
              {renderInput("seniorHighSchoolName", "Senior High School Name", "text", true, "Name of your school")}
              {renderSelect(
                "chosenTrack", 
                "Chosen Track", 
                <>
                  <option value="">Select Track</option>
                  <option value="STEM">STEM (Science, Technology, Engineering, Mathematics)</option>
                  <option value="ABM">ABM (Accountancy, Business, Management)</option>
                  <option value="HUMSS">HUMSS (Humanities and Social Sciences)</option>
                  <option value="GAS">GAS (General Academic Strand)</option>
                  <option value="TVL">TVL (Technical-Vocational-Livelihood)</option>
                  <option value="Arts and Design">Arts and Design</option>
                  <option value="Sports">Sports</option>
                </>,
                true
              )}
              {renderInput("graduationYear", "Graduation Year", "number", true, "2024", "Enter year (e.g., 2024)")}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  General Average / GPA <span style={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  name="gpa"
                  min="75"
                  max="100"
                  step="0.01"
                  value={formData.gpa}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={(e) => handleBlur(e, "gpa")}
                  placeholder="e.g., 95.5"
                  style={getInputStyle("gpa", errors.gpa)}
                />
                {errors.gpa && <div style={styles.errorText}>This field is required</div>}
                {!errors.gpa && <div style={styles.hint}>Enter your General Average (75-100 scale)</div>}
              </div>
            </div>
          </div>

          {/* Required Documents Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>📎</div>
              <div>
                <h3 style={styles.cardTitle}>Required Documents</h3>
                <p style={styles.cardDescription}>Upload your academic records</p>
              </div>
            </div>
            
            <div style={styles.fileUploadSection}>
              <p style={styles.fileUploadTitle}>
                Please upload the following required documents (Max 5MB each)
              </p>
              <div style={styles.fileUploadGrid}>
                {renderFileUpload("grade11Transcript", "Grade 11 Transcript", grade11Transcript, setGrade11Transcript)}
                {renderFileUpload("grade12Transcript", "Grade 12 Transcript", grade12Transcript, setGrade12Transcript)}
                {renderFileUpload("moralCertificate", "Good Moral Certificate", moralCertificate, setMoralCertificate)}
              </div>
            </div>
          </div>

          {/* College Information Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>🎯</div>
              <div>
                <h3 style={styles.cardTitle}>College Information</h3>
                <p style={styles.cardDescription}>Your intended program of study</p>
              </div>
            </div>
            
            <div style={styles.formGrid}>
              {renderSelect(
                "intendedMajor", 
                "Intended Major/Program", 
                <>
                  <option value="">Select Program</option>
                  <optgroup label="Engineering">
                    <option value="BS Computer Engineering">BS Computer Engineering</option>
                    <option value="BS Electrical Engineering">BS Electrical Engineering</option>
                    <option value="BS Mechanical Engineering">BS Mechanical Engineering</option>
                    <option value="BS Civil Engineering">BS Civil Engineering</option>
                    <option value="BS Industrial Engineering">BS Industrial Engineering</option>
                  </optgroup>
                  <optgroup label="Computer Science & IT">
                    <option value="BS Computer Science">BS Computer Science</option>
                    <option value="BS Information Technology">BS Information Technology</option>
                    <option value="BS Information Systems">BS Information Systems</option>
                  </optgroup>
                  <optgroup label="Business">
                    <option value="BS Business Administration">BS Business Administration</option>
                    <option value="BS Accountancy">BS Accountancy</option>
                    <option value="BS Marketing Management">BS Marketing Management</option>
                    <option value="BS Entrepreneurship">BS Entrepreneurship</option>
                  </optgroup>
                  <optgroup label="Arts & Sciences">
                    <option value="BA Communication">BA Communication</option>
                    <option value="BS Psychology">BS Psychology</option>
                    <option value="BA Political Science">BA Political Science</option>
                    <option value="BS Biology">BS Biology</option>
                    <option value="BS Mathematics">BS Mathematics</option>
                  </optgroup>
                  <optgroup label="Architecture & Design">
                    <option value="BS Architecture">BS Architecture</option>
                    <option value="BS Interior Design">BS Interior Design</option>
                    <option value="BS Multimedia Arts">BS Multimedia Arts</option>
                  </optgroup>
                </>,
                true
              )}
            </div>
          </div>

          {/* Additional Information Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIcon}>✨</div>
              <div>
                <h3 style={styles.cardTitle}>Additional Information</h3>
                <p style={styles.cardDescription}>Optional details that can strengthen your application</p>
              </div>
            </div>
            
            <div style={styles.formGrid}>
              {renderTextarea(
                "extracurricularActivities", 
                "Extracurricular Activities", 
                false, 
                "List your clubs, sports, volunteer work, leadership roles, etc.",
                4
              )}
              {renderTextarea(
                "personalStatement", 
                "Personal Statement", 
                false, 
                "Tell us about yourself, your goals, and why you want to attend our university.",
                6
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/student/dashboard")}
              style={styles.cancelButton}
              onMouseOver={(e) => {
                e.target.style.borderColor = "#5182ec";
                e.target.style.color = "#5182ec";
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.color = "#64748b";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 24px rgba(81, 130, 236, 0.45)";
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 16px rgba(81, 130, 236, 0.35)";
              }}
            >
              {loading ? "⏳ Submitting..." : "🚀 Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;

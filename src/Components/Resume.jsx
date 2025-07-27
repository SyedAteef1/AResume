import React from 'react';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import jsPDF from 'jspdf';

const Resume = () => {
  const location = useLocation();
  const resumedata = location.state;
  const resumeRef = useRef();
  
  if (!resumedata) {
    return <div>No Resume Data Found. Please enter the resume data.</div>;
  }

  console.log(resumedata);

  

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredSpace = 20) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Helper function to add text with word wrapping
    const addText = (text, fontSize = 10, isBold = false, isCenter = false) => {
      checkPageBreak(fontSize * 2);
      
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }
      
      if (isCenter) {
        const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
        const textX = (pageWidth - textWidth) / 2;
        doc.text(text, textX, yPosition);
      } else {
        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * (fontSize * 0.4);
      }
      yPosition += fontSize * 0.6;
    };

    // Helper function to add a line
    const addLine = () => {
      checkPageBreak(10);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
    };

    // Header
    addText(resumedata.personal_information.name, 16, true, true);
    
    // Contact info
    let contactInfo = `${resumedata.personal_information.phone} | ${resumedata.personal_information.email}`;
    if (resumedata.personal_information.portfolio_link) {
      contactInfo += ` | ${resumedata.personal_information.portfolio_link}`;
    }
    if (resumedata.personal_information.linkedin) {
      contactInfo += ` | ${resumedata.personal_information.linkedin}`;
    }
    if (resumedata.personal_information.location) {
      contactInfo += ` | ${resumedata.personal_information.location}`;
    }
    addText(contactInfo, 10, false, true);
    yPosition += 5;

    // Technical Skills
    addLine();
    addText('TECHNICAL SKILLS', 12, true);
    addText(resumedata.technical_skills.join(', '), 10);
    yPosition += 5;

    // Objective/Summary
    if (resumedata.objective) {
      addText('OBJECTIVE', 12, true);
      addText(resumedata.objective, 10);
      yPosition += 5;
    }

    // Experience
    if (resumedata.experience && resumedata.experience.length > 0) {
      addText('EXPERIENCE', 12, true);
      addLine();
      
      resumedata.experience.forEach((exp) => {
        if (exp.company_name) {
          addText(`${exp.company_name} - ${exp.role}`, 11, true);
          addText(`${exp.duration}${exp.location ? ' | ' + exp.location : ''}`, 10);
          
          if (exp.description && Array.isArray(exp.description)) {
            exp.description.forEach((desc) => {
              addText(`• ${desc}`, 10);
            });
          }
          yPosition += 3;
        }
      });
    }

    // Projects
    if (resumedata.projects && resumedata.projects.length > 0) {
      addText('PROJECTS', 12, true);
      addLine();
      
      resumedata.projects.forEach((proj) => {
        if (proj.project_name) {
          addText(`${proj.project_name}`, 11, true);
          if (proj.technologies) {
            addText(`Technologies: ${proj.technologies}`, 10);
          }
          if (proj.duration) {
            addText(`Duration: ${proj.duration}`, 10);
          }
          
          if (proj.description && Array.isArray(proj.description)) {
            proj.description.forEach((desc) => {
              addText(`• ${desc}`, 10);
            });
          }
          yPosition += 3;
        }
      });
    }

    // Education
    if (resumedata.education && resumedata.education.length > 0) {
      addText('EDUCATION', 12, true);
      addLine();
      
      resumedata.education.forEach((edu) => {
        if (edu.college_name) {
          addText(`${edu.college_name}`, 11, true);
          addText(`${edu.degree_name}${edu.branch ? ' in ' + edu.branch : ''}`, 10);
          addText(`${edu.duration}${edu.location ? ' | ' + edu.location : ''}${edu.cgpa ? ' | CGPA: ' + edu.cgpa : ''}`, 10);
          yPosition += 3;
        }
      });
    }

    // Certifications
    if (resumedata.certifications && resumedata.certifications.length > 0) {
      addText('CERTIFICATIONS', 12, true);
      addLine();
      resumedata.certifications.forEach((cert) => {
        addText(`• ${cert}`, 10);
      });
      yPosition += 5;
    }

    // Awards
    if (resumedata.awards && resumedata.awards.length > 0) {
      addText('AWARDS & ACHIEVEMENTS', 12, true);
      addLine();
      resumedata.awards.forEach((award) => {
        addText(`• ${award}`, 10);
      });
    }

    // Save the PDF
    doc.save(`${resumedata.personal_information.name}_Resume.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white font-sans text-black">
      {/* Download button - outside of PDF content */}
      <div className="text-right mb-4">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>

      {/* PDF Content - everything inside this div will be included in PDF */}
      <div ref={resumeRef} className="bg-white p-6">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-2">
            {resumedata.personal_information.name}
            {resumedata.personal_information.years_of_experience && 
              ` (${resumedata.personal_information.years_of_experience}+ years exp)`
            }
          </h1>
          <div className="text-sm space-y-1">
            <p>
              {resumedata.personal_information.phone} | {resumedata.personal_information.email}
              {resumedata.personal_information.location && ` | ${resumedata.personal_information.location}`}
            </p>
            {(resumedata.personal_information.portfolio_link || resumedata.personal_information.linkedin || resumedata.personal_information.github) && (
              <p>
                {resumedata.personal_information.portfolio_link && `Portfolio: ${resumedata.personal_information.portfolio_link}`}
                {resumedata.personal_information.linkedin && ` | LinkedIn: ${resumedata.personal_information.linkedin}`}
                {resumedata.personal_information.github && ` | GitHub: ${resumedata.personal_information.github}`}
              </p>
            )}
          </div>
        </div>

        {/* Objective Section */}
        {resumedata.objective && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">OBJECTIVE</h2>
            <hr className="border-black border-t-2 mb-3" />
            <p className="text-sm">{resumedata.objective}</p>
          </div>
        )}

        {/* Technical Skills Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">TECHNICAL SKILLS</h2>
          <hr className="border-black border-t-2 mb-3" />
          <p className="text-sm">{resumedata.technical_skills.join(', ')}</p>
        </div>

        {/* Soft Skills Section */}
        {resumedata.soft_skills && resumedata.soft_skills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">SOFT SKILLS</h2>
            <hr className="border-black border-t-2 mb-3" />
            <p className="text-sm">{resumedata.soft_skills.join(', ')}</p>
          </div>
        )}

        {/* Experience Section */}
        {resumedata.experience && resumedata.experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">EXPERIENCE</h2>
            <hr className="border-black border-t-2 mb-3" />
            {resumedata.experience.map((exp, index) => (
              exp.company_name && (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm">{exp.company_name}</h3>
                    <span className="text-sm">{exp.duration}</span>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="italic text-sm">{exp.role}</p>
                    {exp.location && <span className="text-sm">{exp.location}</span>}
                  </div>
                  {exp.description && Array.isArray(exp.description) && exp.description.map((desc, i) => (
                    <p key={i} className="text-sm mb-1">• {desc}</p>
                  ))}
                </div>
              )
            ))}
          </div>
        )}

        {/* Projects Section */}
        {resumedata.projects && resumedata.projects.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">PROJECTS</h2>
            <hr className="border-black border-t-2 mb-3" />
            {resumedata.projects.map((proj, index) => (
              proj.project_name && (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm">{proj.project_name}</h3>
                    {proj.duration && <span className="text-sm">{proj.duration}</span>}
                  </div>
                  {proj.technologies && (
                    <p className="text-sm mb-1"><strong>Technologies:</strong> {proj.technologies}</p>
                  )}
                  {proj.github_link && (
                    <p className="text-sm mb-1"><strong>GitHub:</strong> {proj.github_link}</p>
                  )}
                  {proj.live_link && (
                    <p className="text-sm mb-1"><strong>Live Demo:</strong> {proj.live_link}</p>
                  )}
                  {proj.description && Array.isArray(proj.description) && proj.description.map((desc, i) => (
                    <p key={i} className="text-sm mb-1">• {desc}</p>
                  ))}
                </div>
              )
            ))}
          </div>
        )}

        {/* Education Section */}
        {resumedata.education && resumedata.education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">EDUCATION</h2>
            <hr className="border-black border-t-2 mb-3" />
            {resumedata.education.map((edu, index) => (
              edu.college_name && (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm">{edu.college_name}</h3>
                    {edu.duration && <span className="text-sm">{edu.duration}</span>}
                  </div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="italic text-sm">
                      {edu.degree_name}{edu.branch && ` in ${edu.branch}`}
                    </p>
                    {edu.location && <span className="text-sm">{edu.location}</span>}
                  </div>
                  {edu.cgpa && (
                    <p className="text-sm mb-1"><strong>CGPA:</strong> {edu.cgpa}</p>
                  )}
                  {edu.relevant_coursework && (
                    <p className="text-sm mb-1"><strong>Relevant Coursework:</strong> {edu.relevant_coursework}</p>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* Certifications Section */}
        {resumedata.certifications && resumedata.certifications.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">CERTIFICATIONS</h2>
            <hr className="border-black border-t-2 mb-3" />
            {resumedata.certifications.map((cert, index) => (
              <p key={index} className="text-sm mb-1">• {cert}</p>
            ))}
          </div>
        )}

        {/* Awards Section */}
        {resumedata.awards && resumedata.awards.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">AWARDS & ACHIEVEMENTS</h2>
            <hr className="border-black border-t-2 mb-3" />
            {resumedata.awards.map((award, index) => (
              <p key={index} className="text-sm mb-1">• {award}</p>
            ))}
          </div>
        )}

        {/* Languages Section */}
        {resumedata.languages && resumedata.languages.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">LANGUAGES</h2>
            <hr className="border-black border-t-2 mb-3" />
            <p className="text-sm">{resumedata.languages.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
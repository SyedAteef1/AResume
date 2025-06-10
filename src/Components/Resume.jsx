import React from 'react';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';

const Resume = () => {
  const location = useLocation();
  const resumedata = location.state;
  const resumeRef = useRef();
  
  if (!resumedata) {
    return <div>No Resume Data Found. Please enter the resume data.</div>;
  }

  console.log(resumedata);

  

  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin: 0.3,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
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
            {resumedata.personal_info.name} (exp: 1.5+ years)
          </h1>
          <p>
            Phone: {resumedata.personal_info.phone} | 
            Email: {resumedata.personal_info.email} | 
            Portfolio: {resumedata.personal_info.portfolio_link}
          </p>
        </div>

        {/* Technical Skills Section */}
        <div className="mb-6">
          
          <p className="mb-2">
            <strong>Technical skills:-</strong> {resumedata.technical_skills.join(', ')}
          </p>
        </div>


        {/* Summary Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-center items-center">Summary</h2>
          <p className="mb-2 text-center">{resumedata.summary}</p>
        </div>

        {/* Experience Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1">EXPERIENCE/PROJECTS</h2>
          <hr className="border-black border-t-2 mb-3" />
          {resumedata.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold">{exp.company_name}</h3>
                <span>{exp.duration}</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <p className="italic">{exp.role}</p>
                <span>Remote/Ballari, India</span>
              </div>
              {exp.description.map((des, i) => (
                <p key={i}>• {des}</p>
              ))}
            </div>
          ))}
        </div>

 {resumedata.certifications && (
          <div className="mb-6">
          <h2 className="text-lg font-bold mb-1">Certificate</h2>
          <hr className="border-black border-t-2 mb-3" />
         {resumedata.certifications.map((certificate)=>{
              
         return <p>• {certificate}</p>
          })}
        </div>
        )}
        {/* Awards Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1">AWARDS</h2>
          <hr className="border-black border-t-2 mb-3" />
          {resumedata.awards.map((award)=>{
            return <p>• {award}</p>
          })}
          <p></p>
        </div>


        {/* Education Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1">EDUCATION</h2>
          <hr className="border-black border-t-2 mb-3" />
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold">{resumedata.education.college_name}</h3>
            <span>{resumedata.education.duration}</span>
          </div>
          <div className="flex justify-between items-start">
            <p className="italic">{resumedata.education.degree_name}</p>
            <span>Ballari, Karnataka</span>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default Resume;
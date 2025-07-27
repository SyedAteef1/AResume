import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import {GoogleGenAI} from '@google/genai'
import { useEffect } from 'react';

export default function HomePage() {

    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        portfolio_link: '',
        linkedin: '',
        github: '',
        location: '',
        experiences: [
            { company_name: '', role: '', duration: '', description: '', location: '' },
            { company_name: '', role: '', duration: '', description: '', location: '' },
            { company_name: '', role: '', duration: '', description: '', location: '' }
        ],
        projects: [
            { project_name: '', technologies: '', duration: '', description: '', github_link: '', live_link: '' },
            { project_name: '', technologies: '', duration: '', description: '', github_link: '', live_link: '' }
        ],
        education: [
            { 
                college_name: '', 
                degree_name: '', 
                duration: '', 
                branch: '', 
                location: '', 
                cgpa: '', 
                relevant_coursework: '' 
            }
        ],
        certifications: '',
        languages: '',
        soft_skills: '',
        awards: '',
        mode: '',
        objective: '',
        years_of_experience: ''
    })

    const technologies = [
        // Frontend
        "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Svelte", "Next.js",
        // Backend
        "Node.js", "Express.js", "Django", "Flask", "Ruby on Rails", "Spring Boot", "Laravel", "ASP.NET",
        // Databases
        "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Redis", "Cassandra", "Oracle DB", "Firebase",
        // Mobile
        "React Native", "Flutter", "Swift", "Kotlin", "Java (Android)", "Xamarin",
        // Cloud & DevOps
        "AWS", "Azure", "Google Cloud", "Heroku", "Vercel", "Netlify", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins",
        // Programming Languages
        "Python", "Java", "C", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "R", "Swift", "Scala", "Perl",
        // Machine Learning / Data Science
        "TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "Keras", "OpenCV", "MATLAB",
        // Testing
        "Jest", "Mocha", "Chai", "Cypress", "Selenium", "JUnit",
        // Tools & Others
        "Git", "Webpack", "Babel", "ESLint", "Prettier", "Postman", "Figma", "Visual Studio Code", "JIRA", "Trello"
    ];

    const [selectedTech, setSelectedTech] = useState([])
    const [step, setStep] = useState(1)
    const [result,setResult]=useState('')
    const navigate= useNavigate();
   const handleSubmit = async () => {
  console.log("hey this is the fetch");

  const completed = {
    ...formData,
    selectedTech: selectedTech
  };

  const stringifyCompleted = JSON.stringify(completed);

  console.log("completed object:", completed);
const api="AIzaSyBORb99_kIhY-muw0nzmGZzhelg5YmzJlw"
console.log(api)
   const ai = new GoogleGenAI({
    apiKey: api
  });

  async function main() {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate a professional resume in JSON format based on the provided user data.

REQUIRED JSON SCHEMA:
{
  "personal_information": {
    "name": "string",
    "phone": "string", 
    "email": "string",
    "portfolio_link": "string",
    "linkedin": "string",
    "github": "string",
    "location": "string"
  },
  "objective": "string (2-3 sentences)",
  "technical_skills": ["array of strings from selectedTech only"],
  "soft_skills": ["array of 4-6 relevant soft skills"],
  "experience": [
    {
      "company_name": "string",
      "role": "string", 
      "duration": "string",
      "location": "string",
      "description": ["array of 4-5 professional bullet points"]
    }
  ],
  "projects": [
    {
      "project_name": "string",
      "technologies": "string",
      "duration": "string", 
      "github_link": "string",
      "live_link": "string",
      "description": ["array of 3-4 bullet points"]
    }
  ],
  "education": [
    {
      "college_name": "string",
      "degree_name": "string",
      "branch": "string",
      "duration": "string",
      "location": "string",
      "cgpa": "string"
    }
  ],
  "certifications": ["array of 3-4 relevant certifications"],
  "languages": ["array of languages"],
  "awards": ["array of 3-4 achievements"]
}

RULES:
- Use ONLY selectedTech for technical_skills
- Generate realistic, professional content
- Keep descriptions concise and impactful
- Return ONLY valid JSON, no markdown formatting

USER DATA: ${stringifyCompleted}`
            }
          ]
        }
      ]
    });

    const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanedResponse = aiResponse
      .replace(/^```json/, '')
      .replace(/```$/, '')
      .trim();

    console.log("this is the cleaned response",cleanedResponse );

    try {
      
      setResult(JSON.parse(cleanedResponse)); 
      const textinput=JSON.parse(cleanedResponse)
      console.log("this is result",result,"this is cleaned one",JSON.parse(cleanedResponse))// store structured data
      navigate('/resume', { state: textinput }); // pass parsed JSON to next page
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
    }
  }

  await main(); // ensure it's awaited

  console.log("this is the handlesubmit", formData, completed);
};
        
        
    
    
    const handleNext = () => {
        if (step < 6) {
            setStep(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }
    console.log(formData,selectedTech)

    const handleTechToggle = (tech) => {
        if (selectedTech.includes(tech)) {
            setSelectedTech(selectedTech.filter(t => t !== tech))
        } else {
            setSelectedTech([...selectedTech, tech])
        }
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleExperienceChange = (index, field, value) => {
        const updatedExperiences = [...formData.experiences]
        updatedExperiences[index][field] = value
        setFormData({
            ...formData,
            experiences: updatedExperiences
        })
    }

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...formData.projects]
        updatedProjects[index][field] = value
        setFormData({
            ...formData,
            projects: updatedProjects
        })
    }

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...formData.education]
        updatedEducation[index][field] = value
        setFormData({
            ...formData,
            education: updatedEducation
        })
    }

    const isStepComplete = (stepNum) => {
        switch(stepNum) {
            case 1: return formData.name && formData.phone && formData.email
            case 2: return selectedTech.length > 0
            case 3: return formData.experiences.some(exp => exp.company_name && exp.role && exp.description)
            case 4: return formData.projects.some(proj => proj.project_name && proj.description)
            case 5: return formData.education.some(edu => edu.college_name && edu.degree_name)
            case 6: return true // Optional step
            default: return false
        }
    }

    const canProceed = isStepComplete(step)

    const stepItems = [
        { num: 1, title: "Personal Info", desc: "Basic details & contact" },
        { num: 2, title: "Technical Skills", desc: "Technologies you know" },
        { num: 3, title: "Experience", desc: "Work history" },
        { num: 4, title: "Projects", desc: "Personal projects" },
        { num: 5, title: "Education", desc: "Academic background" },
        { num: 6, title: "Additional Info", desc: "Awards, certifications" }
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Mobile Progress Header */}
                    <div className="block lg:hidden bg-gray-900 text-white p-4">
                        <h2 className="text-lg font-bold mb-4">Resume Builder</h2>
                        <div className="flex justify-between items-center">
                            {stepItems.map((item, index) => (
                                <div key={item.num} className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-1 ${
                                        step > item.num || (step === item.num && isStepComplete(item.num))
                                            ? 'bg-green-500 text-white'
                                            : step === item.num
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-600 text-gray-300'
                                    }`}>
                                        {step > item.num || (step === item.num && isStepComplete(item.num)) ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        ) : (
                                            item.num
                                        )}
                                    </div>
                                    <span className={`text-xs text-center ${step === item.num ? 'text-white' : 'text-gray-300'}`}>
                                        {item.title.split(' ')[0]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* Desktop Sidebar */}
                        <div className="hidden lg:block w-80 bg-gray-900 text-white p-6">
                            <h2 className="text-xl font-bold mb-8">Resume Builder</h2>
                            <ol className="relative space-y-8">
                                {stepItems.map((item, index) => (
                                    <li key={item.num} className="flex items-start">
                                        <div className="flex-shrink-0 mr-4">
                                            {step > item.num || (step === item.num && isStepComplete(item.num)) ? (
                                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                            ) : step === item.num ? (
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold">{item.num}</span>
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                                    <span className="text-gray-300 font-semibold">{item.num}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${step === item.num ? 'text-white' : 'text-gray-300'}`}>
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-4 sm:p-6 lg:p-8">
                            <div className="max-w-2xl mx-auto">
                                {/* Step 1: Personal Info */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-6 sm:mb-8">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Information</h2>
                                            <p className="text-gray-600 mt-2 text-sm sm:text-base">Let's start with your basic details</p>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your full name"
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        placeholder="+91 98765-43210"
                                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="your.email@example.com"
                                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    placeholder="City, State, Country"
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                                                    <input
                                                        type="url"
                                                        name="linkedin"
                                                        value={formData.linkedin}
                                                        onChange={handleInputChange}
                                                        placeholder="https://linkedin.com/in/yourprofile"
                                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                                                    <input
                                                        type="url"
                                                        name="github"
                                                        value={formData.github}
                                                        onChange={handleInputChange}
                                                        placeholder="https://github.com/yourusername"
                                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
                                                    <input
                                                        type="url"
                                                        name="portfolio_link"
                                                        value={formData.portfolio_link}
                                                        onChange={handleInputChange}
                                                        placeholder="https://yourportfolio.com"
                                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                                                    <select
                                                        name="years_of_experience"
                                                        value={formData.years_of_experience}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                                    >
                                                        <option value="">Select experience</option>
                                                        <option value="0">Fresher</option>
                                                        <option value="0.5">6 months</option>
                                                        <option value="1">1 year</option>
                                                        <option value="1.5">1.5 years</option>
                                                        <option value="2">2 years</option>
                                                        <option value="3">3 years</option>
                                                        <option value="4">4 years</option>
                                                        <option value="5+">5+ years</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Career Objective (Optional)</label>
                                                <textarea
                                                    name="objective"
                                                    value={formData.objective}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    placeholder="Brief description of your career goals and what you're looking for..."
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Technical Skills */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-6 sm:mb-8">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Skills</h2>
                                            <p className="text-gray-600 mt-2 text-sm sm:text-base">Select your technical skills and add soft skills</p>
                                        </div>
                                        
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-4">
                                                Selected: {selectedTech.length} technologies
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 max-h-80 sm:max-h-96 overflow-y-auto">
                                                {technologies.map((tech) => (
                                                    <button
                                                        key={tech}
                                                        type="button"
                                                        onClick={() => handleTechToggle(tech)}
                                                        className={`p-2 sm:p-3 text-xs sm:text-sm font-medium rounded-lg border-2 transition-all ${
                                                            selectedTech.includes(tech)
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        {tech}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
                                            <textarea
                                                name="soft_skills"
                                                value={formData.soft_skills}
                                                onChange={handleInputChange}
                                                rows="3"
                                                placeholder="e.g., Leadership, Communication, Problem Solving, Team Collaboration, Time Management, Critical Thinking"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">
                                                List your soft skills separated by commas
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                                            <input
                                                type="text"
                                                name="languages"
                                                value={formData.languages}
                                                onChange={handleInputChange}
                                                placeholder="e.g., English (Fluent), Hindi (Native), Spanish (Intermediate)"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Experience */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-6 sm:mb-8">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Work Experience</h2>
                                            <p className="text-gray-600 mt-2 text-sm sm:text-base">Add up to 3 work experiences</p>
                                        </div>
                                        
                                        <div className="space-y-6 sm:space-y-8">
                                            {formData.experiences.map((experience, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                                            Company {index + 1}
                                                        </h3>
                                                        {index > 0 && (
                                                            <span className="text-sm text-gray-500">(Optional)</span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Company Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={experience.company_name}
                                                                    onChange={(e) => handleExperienceChange(index, 'company_name', e.target.value)}
                                                                    placeholder="Company Name"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>
                                                            
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Role/Position
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={experience.role}
                                                                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                                                                    placeholder="Your Role"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Duration
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={experience.duration}
                                                                    onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                                                    placeholder="Jan 2023 - Present"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Location
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={experience.location}
                                                                    onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                                                                    placeholder="City, State / Remote"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Experience Description
                                                            </label>
                                                            <textarea
                                                                value={experience.description}
                                                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                                                rows="6"
                                                                placeholder="Write about your experience in your own words - AI will help format it perfectly for your resume!&#10;&#10;Example: I worked as a software developer where I built websites using React and Node.js. I also helped my team with project planning and made our application faster. I worked with different departments and helped new developers learn coding."
                                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none text-sm sm:text-base"
                                                            />
                                                            <div className="mt-2">
                                                                <p className="text-xs text-blue-600 font-medium">
                                                                    💡 Pro Tip: Write in your own sentences - AI will take care of formatting it professionally!
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Projects */}
                                {step === 4 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-6 sm:mb-8">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Projects</h2>
                                            <p className="text-gray-600 mt-2 text-sm sm:text-base">Add up to 2 personal or academic projects</p>
                                        </div>
                                        
                                        <div className="space-y-6 sm:space-y-8">
                                            {formData.projects.map((project, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                                                        Project {index + 1} {index === 0 ? '(Required)' : '(Optional)'}
                                                    </h3>
                                                    
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Project Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={project.project_name}
                                                                    onChange={(e) => handleProjectChange(index, 'project_name', e.target.value)}
                                                                    placeholder="Project Name"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Technologies Used
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={project.technologies}
                                                                    onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                                                                    placeholder="React, Node.js, MongoDB"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Duration
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={project.duration}
                                                                    onChange={(e) => handleProjectChange(index, 'duration', e.target.value)}
                                                                    placeholder="Jan 2024 - Mar 2024"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    GitHub Link
                                                                </label>
                                                                <input
                                                                    type="url"
                                                                    value={project.github_link}
                                                                    onChange={(e) => handleProjectChange(index, 'github_link', e.target.value)}
                                                                    placeholder="https://github.com/..."
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Live Demo Link
                                                                </label>
                                                                <input
                                                                    type="url"
                                                                    value={project.live_link}
                                                                    onChange={(e) => handleProjectChange(index, 'live_link', e.target.value)}
                                                                    placeholder="https://yourproject.com"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Project Description
                                                            </label>
                                                            <textarea
                                                                value={project.description}
                                                                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                                                rows="4"
                                                                placeholder="Describe your project, what it does, key features, and your role in building it..."
                                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none text-sm sm:text-base"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Education */}
                                {step === 5 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-6 sm:mb-8">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Education</h2>
                                            <p className="text-gray-600 mt-2 text-sm sm:text-base">Your academic background</p>
                                        </div>
                                        
                                        <div className="space-y-6 sm:space-y-8">
                                            {formData.education.map((edu, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-gray-50">
                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                                                        Education {index + 1} {index === 0 ? '(Required)' : '(Optional)'}
                                                    </h3>
                                                    
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    College/University
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={edu.college_name}
                                                                    onChange={(e) => handleEducationChange(index, 'college_name', e.target.value)}
                                                                    placeholder="Institution Name"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Degree
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={edu.degree_name}
                                                                    onChange={(e) => handleEducationChange(index, 'degree_name', e.target.value)}
                                                                    placeholder="B.Tech, B.Sc, M.Tech, etc."
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Branch/Specialization
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={edu.branch}
                                                                    onChange={(e) => handleEducationChange(index, 'branch', e.target.value)}
                                                                    placeholder="Computer Science, Electronics, etc."
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Duration
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={edu.duration}
                                                                    onChange={(e) => handleEducationChange(index, 'duration', e.target.value)}
                                                                    placeholder="Aug 2020 - May 2024"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Location
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={edu.location}
                                                                    onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                                                                    placeholder="City, State"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    CGPA/Percentage
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={edu.cgpa}
                                                                    onChange={(e) => handleEducationChange(index, 'cgpa', e.target.value)}
                                                                    placeholder="8.5/10 or 85%"
                                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Relevant Coursework (Optional)
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={edu.relevant_coursework}
                                                                onChange={(e) => handleEducationChange(index, 'relevant_coursework', e.target.value)}
                                                                placeholder="Data Structures, Algorithms, Database Systems, Machine Learning"
                                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm sm:text-base"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Work Mode</label>
                                                <select
                                                    name="mode"
                                                    value={formData.mode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                                >
                                                    <option value="">Select preference</option>
                                                    <option value="remote">Remote</option>
                                                    <option value="onsite">On-site</option>
                                                    <option value="hybrid">Hybrid</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 6: Additional Info */}
                                {step === 6 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-6 sm:mb-8">
                                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Additional Information</h2>
                                            <p className="text-gray-600 mt-2 text-sm sm:text-base">Awards, certifications, and achievements</p>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Awards & Achievements</label>
                                                <textarea
                                                    name="awards"
                                                    value={formData.awards}
                                                    onChange={handleInputChange}
                                                    rows="4"
                                                    placeholder="• Finalist in Smart India Hackathon 2023&#10;• Employee of the Month - March 2023&#10;• Published research paper on Machine Learning applications&#10;• Led team of 5 developers in successful product launch"
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Include hackathons, recognitions, publications, or any notable achievements.
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                                                <textarea
                                                    name="certifications"
                                                    value={formData.certifications}
                                                    onChange={handleInputChange}
                                                    rows="4"
                                                    placeholder="• AWS Certified Solutions Architect&#10;• Google Cloud Professional Developer&#10;• Microsoft Azure Fundamentals&#10;• Oracle Java SE 11 Developer"
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    List your professional certifications and courses completed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 sm:mt-12 pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
                                    <button
                                        onClick={handlePrev}
                                        disabled={step === 1}
                                        className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                                            step === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        ← Previous
                                    </button>
                                    
                                    <div className="text-sm text-gray-500 order-first sm:order-none">
                                        Step {step} of 6
                                    </div>
                                    
                                    <button
                                        onClick={step===6 ?handleSubmit:handleNext}
                                        disabled={!canProceed}
                                        className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                                            canProceed
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {step === 6 ? 'Create Resume' : 'Next →'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='text-ceter  items-baseline justify-center w-[100%] mt-10  flex'> <h1 className='text-center font-semibold'>Made By Syed Ateef with 💙</h1></div>

        </div>
    )
}
'use client'

interface ReportContentProps {
  content: string;
}

export default function ReportContent({ content }: ReportContentProps) {
  const parseMarkdown = (markdown: string) => {
    // Extract the patient info from first heading
    const patientInfoMatch = markdown.match(/## Patient of (\d+) years old, (\w+)/);
    const patientInfo = patientInfoMatch ? {
      age: patientInfoMatch[1],
      gender: patientInfoMatch[2]
    } : { age: 'Unknown', gender: 'Unknown' };

    // Extract sections
    const sections: Record<string, string[]> = {};
    let currentSection = '';
    
    // Split by lines and process
    const lines = markdown.split('\n');
    
    for (const line of lines) {
      // Skip the patient info line as we've already extracted it
      if (line.startsWith('## Patient')) continue;
      
      // Check if this is a section header
      if (line.startsWith('- **') && line.endsWith(':**')) {
        currentSection = line.replace(/- \*\*(.*?):\*\*/, '$1').trim();
        sections[currentSection] = [];
      } 
      // If we're in a section and this is a list item, add it
      else if (currentSection && line.trim().startsWith('-')) {
        const itemContent = line.replace(/^\s*-\s*/, '').trim();
        if (itemContent) {
          sections[currentSection].push(itemContent);
        }
      }
    }

    return { patientInfo, sections };
  };

  const { patientInfo, sections } = parseMarkdown(content);

  return (
    <div className="bg-white max-w-4xl mx-auto w-full">
      {/* Patient Header */}
      <div className="bg-blue-600 text-white rounded-lg p-5 mb-6">
        <div className="flex items-center">
          <div className="bg-blue-500 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm opacity-80">Patient</p>
            <p className="font-medium">{patientInfo.age} years old, {patientInfo.gender}</p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {Object.entries(sections).map(([sectionTitle, items], index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4">
            <div className="flex items-center mb-3">
              {/* Section-specific icons */}
              <div className="mr-3 text-blue-600">
                {sectionTitle.includes('Symptoms') && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {sectionTitle.includes('Medications') && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                {sectionTitle.includes('History') && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                )}
                {sectionTitle.includes('Allergies') && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {sectionTitle.includes('Review') && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {sectionTitle.includes('Treatments') && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
                {sectionTitle.includes('Abnormalities') && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                )}
                {sectionTitle.includes('Assumption') && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
                {sectionTitle.includes('Family') && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
              </div>
              <h2 className="text-lg font-medium text-gray-800">{sectionTitle}</h2>
            </div>
            
            {/* Section Content */}
            <div className="pl-8 space-y-1">
              {items.map((item, itemIndex) => {
                // Check if this is a differential diagnosis section
                if (item.includes('Differential diagnoses:')) {
                  return null; // Skip this line, we'll handle differentials separately
                }
                
                if (sectionTitle === "Assumption based upon past cases" && itemIndex === 0) {
                  // For the first assumption item, show it normally
                  return (
                    <div key={itemIndex} className="py-1 text-gray-700">
                      {item}
                      
                      {/* If we're in the Assumption section, add differential diagnoses */}
                      {items.some(i => i.includes('Differential diagnoses:')) && (
                        <div className="mt-3">
                          <h4 className="font-medium text-gray-800 mb-2">Differential Diagnoses:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {items
                              .filter(i => i.includes('- ') && !i.includes('Differential diagnoses:'))
                              .map((diagnosis, diagIndex) => {
                                const diagnosisClean = diagnosis.replace(/^\s*-\s*/, '');
                                return (
                                  <li key={diagIndex} className="text-gray-700">
                                    {diagnosisClean}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                } else if (!item.startsWith('-')) {
                  // Regular items
                  return (
                    <div key={itemIndex} className="py-1 flex items-start">
                      <span className="mr-2 text-blue-600">•</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
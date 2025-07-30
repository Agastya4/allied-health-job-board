import { SEO } from '@/components/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function ResumeGuidePage() {
  return (
    <>
      <SEO 
        title="How to Write a Winning Allied Health Resume in 2024"
        description="Learn the essential tips and tricks to create a resume that stands out in the competitive allied health job market. Expert advice for physiotherapists, occupational therapists, speech pathologists, and other healthcare professionals."
        keywords={[
          'allied health resume',
          'physiotherapy resume',
          'occupational therapy resume',
          'speech pathology resume',
          'healthcare resume tips',
          'allied health job application',
          'healthcare professional resume',
          'therapy resume examples'
        ]}
        url="/blog/how-to-write-winning-allied-health-resume-2024"
        type="article"
        articleData={{
          title: "How to Write a Winning Allied Health Resume in 2024",
          description: "Learn the essential tips and tricks to create a resume that stands out in the competitive allied health job market.",
          author: "AlliedHealthJobs.au Team",
          publishedTime: "2024-01-15T00:00:00Z",
          section: "Career Advice",
          tags: ["resume", "career advice", "allied health", "job application"]
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 px-3 py-1 rounded-full text-xs font-medium">
                Career Advice
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>January 15, 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>AlliedHealthJobs.au Team</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How to Write a Winning Allied Health Resume in 2024
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              In the competitive allied health job market, your resume is often the first impression you make on potential employers. Learn the essential strategies to create a resume that stands out and gets you interviews for physiotherapy, occupational therapy, speech pathology, and other allied health positions.
            </p>
          </div>

          {/* Table of Contents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><a href="#formatting" className="text-violet-600 dark:text-violet-400 hover:underline">1. Professional Formatting</a></li>
                <li><a href="#contact" className="text-violet-600 dark:text-violet-400 hover:underline">2. Contact Information</a></li>
                <li><a href="#summary" className="text-violet-600 dark:text-violet-400 hover:underline">3. Professional Summary</a></li>
                <li><a href="#experience" className="text-violet-600 dark:text-violet-400 hover:underline">4. Work Experience</a></li>
                <li><a href="#education" className="text-violet-600 dark:text-violet-400 hover:underline">5. Education & Certifications</a></li>
                <li><a href="#skills" className="text-violet-600 dark:text-violet-400 hover:underline">6. Skills & Competencies</a></li>
                <li><a href="#keywords" className="text-violet-600 dark:text-violet-400 hover:underline">7. ATS Optimization</a></li>
                <li><a href="#common-mistakes" className="text-violet-600 dark:text-violet-400 hover:underline">8. Common Mistakes to Avoid</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            <section id="formatting">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                1. Professional Formatting
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your resume's visual presentation is crucial. In 2024, allied health employers expect clean, professional formatting that's easy to scan quickly.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      Do's
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Use clean, professional fonts (Arial, Calibri, Times New Roman)</li>
                      <li>• Keep consistent formatting throughout</li>
                      <li>• Use bullet points for easy scanning</li>
                      <li>• Limit to 2 pages maximum</li>
                      <li>• Use white space effectively</li>
                      <li>• Save as PDF for consistency</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      Don'ts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Avoid fancy fonts or colors</li>
                      <li>• Don't use templates with graphics</li>
                      <li>• Avoid inconsistent formatting</li>
                      <li>• Don't exceed 2 pages</li>
                      <li>• Avoid dense text blocks</li>
                      <li>• Don't send Word documents</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="contact">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                2. Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Make it easy for employers to contact you. Include all necessary information clearly at the top of your resume.
              </p>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Essential Contact Information:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• <strong>Full Name:</strong> Use your legal name as it appears on your qualifications</li>
                    <li>• <strong>Professional Email:</strong> Use a professional email address (avoid nicknames)</li>
                    <li>• <strong>Phone Number:</strong> Include your mobile number</li>
                    <li>• <strong>Location:</strong> City and state (no need for full address)</li>
                    <li>• <strong>LinkedIn Profile:</strong> Include your professional LinkedIn URL</li>
                    <li>• <strong>AHPRA Number:</strong> Include your registration number if applicable</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="summary">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                3. Professional Summary
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your professional summary is your elevator pitch. It should immediately tell employers who you are and what value you bring.
              </p>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Example Professional Summary:</h3>
                  <blockquote className="border-l-4 border-violet-500 pl-4 italic text-gray-600 dark:text-gray-300">
                    "Experienced Physiotherapist with 5+ years specializing in musculoskeletal rehabilitation and sports injury management. Proven track record of developing personalized treatment plans and achieving positive patient outcomes. Skilled in manual therapy, exercise prescription, and patient education. Passionate about evidence-based practice and continuing professional development."
                  </blockquote>
                </CardContent>
              </Card>
            </section>

            <section id="experience">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                4. Work Experience
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your work experience section should demonstrate your impact and achievements, not just list your responsibilities.
              </p>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Format for Each Position:</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Senior Physiotherapist | ABC Sports Clinic | 2022-Present</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Led a team of 3 junior physiotherapists, improving patient satisfaction scores by 25%</li>
                        <li>• Developed and implemented evidence-based treatment protocols for sports injuries</li>
                        <li>• Managed caseload of 40+ patients weekly with 95% positive outcome rate</li>
                        <li>• Conducted staff training sessions on new treatment techniques</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="education">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                5. Education & Certifications
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                List your qualifications in reverse chronological order, including relevant certifications and continuing education.
              </p>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Education Section Example:</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Master of Physiotherapy | University of Sydney | 2019</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">GPA: 6.8/7.0 | Dean's List</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Bachelor of Exercise Science | University of Queensland | 2017</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Major in Sports Science</p>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 mt-6">Certifications:</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• AHPRA Registration: PHY000123456</li>
                    <li>• Sports Physiotherapy Level 1 | Australian Physiotherapy Association</li>
                        <li>• Dry Needling Certification | Australian Physiotherapy Association</li>
                        <li>• First Aid & CPR Certification | St John Ambulance</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="skills">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                6. Skills & Competencies
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Organize your skills into categories that are relevant to your specific allied health profession.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Clinical Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <li>• Manual Therapy Techniques</li>
                      <li>• Exercise Prescription</li>
                      <li>• Patient Assessment</li>
                      <li>• Treatment Planning</li>
                      <li>• Progress Evaluation</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Technical Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <li>• Electronic Health Records</li>
                      <li>• Microsoft Office Suite</li>
                      <li>• Clinical Documentation</li>
                      <li>• Data Analysis</li>
                      <li>• Telehealth Platforms</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="keywords">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                7. ATS Optimization (Applicant Tracking Systems)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Many employers use ATS software to screen resumes. Optimize your resume to pass through these systems.
              </p>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">ATS Optimization Tips:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• <strong>Keyword Matching:</strong> Include job-specific keywords from the job description</li>
                    <li>• <strong>Simple Formatting:</strong> Avoid tables, graphics, or complex layouts</li>
                    <li>• <strong>Standard Headings:</strong> Use common section headings like "Experience," "Education," "Skills"</li>
                    <li>• <strong>File Format:</strong> Save as PDF to preserve formatting</li>
                    <li>• <strong>Spelling:</strong> Ensure perfect spelling and grammar</li>
                    <li>• <strong>Relevant Keywords:</strong> Include industry-specific terms and certifications</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="common-mistakes">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                8. Common Mistakes to Avoid
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Avoid these common resume mistakes that can cost you interviews in the allied health field.
              </p>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li>• <strong>Generic Content:</strong> Tailor your resume for each specific job application</li>
                    <li>• <strong>Missing Quantifiable Results:</strong> Include specific numbers and achievements</li>
                    <li>• <strong>Outdated Information:</strong> Remove irrelevant or outdated experience</li>
                    <li>• <strong>Poor Grammar:</strong> Proofread thoroughly or use professional editing</li>
                    <li>• <strong>Missing Keywords:</strong> Research and include relevant industry keywords</li>
                    <li>• <strong>Inconsistent Formatting:</strong> Maintain consistent style throughout</li>
                    <li>• <strong>Too Much Information:</strong> Focus on relevant experience only</li>
                    <li>• <strong>Missing Contact Information:</strong> Ensure all contact details are current</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white mt-12">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Find Your Next Allied Health Job?
                </h3>
                <p className="text-violet-100 mb-6">
                  Browse thousands of allied health positions across Australia and apply with your newly optimized resume.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/jobs">
                    <Button variant="secondary" size="lg" className="group">
                      Browse Jobs
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/resources">
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-violet-600">
                      More Career Resources
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
} 
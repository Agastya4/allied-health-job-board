"use client"

import { useParams } from "next/navigation";
import { useMemo } from "react";

const placeholderPosts = [
  {
    id: 1,
    title: "Cut These 15 Words from Your Allied Health Resume (They're Killing Your Chances)",
    coverUrl: "/placeholder.jpg",
    author: "Allied Health Careers Editorial Team",
    date: "01 August, 2025",
    article: `Recruiters and hiring managers see hundreds of resumes every week. What separates a strong allied health resume from a forgettable one? Often, it’s the words you choose. Some phrases are so overused that they’ve lost all meaning—and worse, they can make you sound generic or unoriginal. Here are 15 words and phrases you should cut from your resume right now, and what to use instead.\n\n1. Excellent communication skills\n2. Team player\n3. Hard worker\n4. Results-oriented\n5. Detail-oriented\n6. Self-starter\n7. Go-getter\n8. Fast learner\n9. Responsible for\n10. Motivated\n11. Passionate\n12. Dynamic\n13. Problem solver\n14. Works well under pressure\n15. References available upon request\n\n**Why These Words Hurt Your Resume**\nThese phrases are so common that they don’t tell the employer anything specific about you. Instead, focus on concrete achievements and measurable outcomes. For example, instead of “excellent communication skills,” write “Educated 50+ patients per week on post-discharge care, resulting in a 20% reduction in readmissions.”\n\n**What to Say Instead**\n- Use action verbs: Led, implemented, developed, improved, facilitated, coordinated.\n- Quantify your impact: “Reduced patient wait times by 30% through process redesign.”\n- Highlight unique skills: “Certified in advanced manual therapy techniques.”\n\n**Final Tip**\nBefore submitting your resume, read it aloud. If you spot any of these 15 phrases, replace them with specific, value-driven statements. Your resume will instantly stand out.`,
  },
  {
    id: 2,
    title: "The 5-Second Rule: What Hiring Managers Actually Look for in Allied Health CVs",
    coverUrl: "/placeholder.jpg",
    author: "Allied Health Careers Editorial Team",
    date: "01 August, 2025",
    article: `Did you know the average recruiter spends just 5-7 seconds scanning a CV before deciding if it’s worth a closer look? Here’s what they notice first—and how you can make your allied health CV pass the test.\n\n**1. Layout and Readability**\nA cluttered, dense CV is an instant turn-off. Use clear headings, bullet points, and plenty of white space.\n\n**2. Job Titles and Employers**\nRecruiters look for relevant roles and reputable organisations. Make sure your job titles are clear and your employment history is easy to scan.\n\n**3. Key Skills and Certifications**\nHighlight your most relevant skills and any specialist certifications (e.g., APA, AHPRA, Speech Pathology Australia).\n\n**4. Achievements, Not Duties**\nInstead of listing tasks, focus on what you accomplished. “Implemented a new patient intake process, reducing admin time by 25%.”\n\n**5. Typos and Red Flags**\nErrors or unexplained gaps can get your CV tossed. Proofread carefully and address any career breaks.\n\n**Quick Fixes**\n- Use a professional font and consistent formatting.\n- Put your most impressive achievements near the top.\n- Ask a colleague to review your CV for clarity.\n\nRemember: Your CV’s first impression is everything. Make those 5 seconds count!`,
  },
  {
    id: 3,
    title: "LinkedIn Mistakes That Are Costing Allied Health Professionals Job Opportunities",
    coverUrl: "/placeholder.jpg",
    author: "Allied Health Careers Editorial Team",
    date: "01 August, 2025",
    article: `LinkedIn is a powerful tool for allied health professionals, but common mistakes can limit your visibility and cost you job opportunities. Here’s what to avoid—and how to fix it.\n\n**1. Incomplete Profiles**\nA half-finished profile looks unprofessional. Fill out every section, including your summary, experience, and skills.\n\n**2. No Profile Photo**\nProfiles with photos get up to 21x more views. Use a clear, professional headshot.\n\n**3. Weak Headlines**\nYour headline should be more than just your job title. Try “Paediatric Occupational Therapist | Sensory Integration Specialist.”\n\n**4. Ignoring Recommendations**\nAsk colleagues and supervisors for recommendations to boost your credibility.\n\n**5. Poor Networking Habits**\nDon’t just connect—engage. Comment on posts, share articles, and join relevant groups.\n\n**6. Not Showcasing Achievements**\nUse the ‘Featured’ section to highlight projects, presentations, or publications.\n\n**7. Failing to Use Keywords**\nRecruiters search by keywords. Make sure your profile includes terms relevant to your specialty.\n\n**8. Not Updating Regularly**\nKeep your profile current with new skills, roles, and achievements.\n\n**Take Action**\nAudit your LinkedIn profile today and fix these mistakes to unlock more job opportunities.`,
  },
  {
    id: 4,
    title: "How to Beat Tall Poppy Syndrome in Australian Allied Health Workplaces",
    coverUrl: "/placeholder.jpg",
    author: "Allied Health Careers Editorial Team",
    date: "01 August, 2025",
    article: `Tall poppy syndrome—where high achievers are “cut down” by peers—can be especially tough in allied health workplaces. Here’s how to thrive, even when others resent your success.\n\n**1. Celebrate Others**\nMake a habit of recognising your colleagues’ achievements. This builds goodwill and reduces jealousy.\n\n**2. Stay Humble, But Don’t Downplay Success**\nAcknowledge your wins without bragging. Share credit with your team.\n\n**3. Build a Support Network**\nFind mentors and allies who encourage your growth.\n\n**4. Address Negativity Directly**\nIf you’re targeted, address it calmly and professionally. Document incidents if needed.\n\n**5. Focus on Your Purpose**\nRemember why you do your work. Let your passion and patient outcomes drive you, not others’ opinions.\n\n**6. Seek Organisational Support**\nIf tall poppy syndrome is affecting your wellbeing, talk to HR or a trusted leader.\n\n**Final Thought**\nYou deserve to succeed. Don’t let workplace jealousy hold you back.`,
  },
  {
    id: 5,
    title: "8 Things You Didn't Know Could Get You Fired as an Allied Health Professional",
    coverUrl: "/placeholder.jpg",
    author: "Allied Health Careers Editorial Team",
    date: "01 August, 2025",
    article: `Most allied health professionals know the obvious reasons for termination—gross misconduct, fraud, or patient harm. But there are lesser-known risks that can end your career.\n\n**1. Inappropriate Social Media Posts**\nEven private posts can be screenshotted and shared. Avoid posting anything that could be seen as unprofessional.\n\n**2. Breaching Patient Confidentiality**\nDiscussing cases in public or online—even without names—can violate privacy laws.\n\n**3. Documentation Errors**\nIncomplete or inaccurate records can have legal and employment consequences.\n\n**4. Boundary Violations**\nOverstepping professional boundaries with patients or colleagues is a serious offence.\n\n**5. Failing to Report Incidents**\nNot reporting errors or near-misses can be grounds for dismissal.\n\n**6. Substance Misuse**\nBeing under the influence at work is a clear violation.\n\n**7. Unauthorised Absences**\nRepeatedly missing work without approval can lead to termination.\n\n**8. Poor Digital Security**\nSharing passwords or leaving records unsecured puts patient data at risk.\n\n**Protect Your Career**\nStay informed about your obligations and always act professionally—online and offline.`,
  },
  {
    id: 6,
    title: "The Politics of Allied Health: Navigating Workplace Hierarchies Without Losing Your Soul",
    coverUrl: "/placeholder.jpg",
    author: "Allied Health Careers Editorial Team",
    date: "01 August, 2025",
    article: `Workplace politics are a reality in every field, but allied health can be especially complex. Here’s how to navigate hierarchies and build positive relationships—without losing your integrity.\n\n**1. Understand the Unwritten Rules**\nEvery workplace has its own culture. Observe how decisions are made and who holds influence.\n\n**2. Manage Up Effectively**\nKeep your manager informed, anticipate their needs, and communicate proactively.\n\n**3. Build Strategic Relationships**\nNetwork across departments and disciplines. Allies can help you solve problems and advance your career.\n\n**4. Handle Difficult Colleagues**\nStay professional, set boundaries, and don’t get drawn into gossip.\n\n**5. Advocate for Yourself**\nSpeak up for your needs and achievements, but do so respectfully.\n\n**6. Stay True to Your Values**\nDon’t compromise your ethics for short-term gain.\n\n**Final Thought**\nYou can succeed in workplace politics without losing your soul—by staying authentic and building genuine connections.`,
  },
  {
    id: 7,
    title: "How to Beat FOBO: The Fear of Becoming Obsolete in Allied Health",
    coverUrl: "/placeholder.jpg",
    author: "Allied Health Careers Editorial Team",
    date: "01 August, 2025",
    article: `Technology and healthcare are evolving fast. It’s normal to worry about becoming obsolete, but you can take action to stay relevant.\n\n**1. Embrace Lifelong Learning**\nCommit to ongoing education—courses, workshops, and conferences.\n\n**2. Upskill in Technology**\nLearn to use new tools and platforms relevant to your field.\n\n**3. Stay Informed**\nFollow industry news and research to anticipate changes.\n\n**4. Network with Innovators**\nConnect with colleagues who are early adopters.\n\n**5. Focus on Transferable Skills**\nSkills like communication, critical thinking, and adaptability never go out of style.\n\n**6. Manage Anxiety**\nAcknowledge your fears and talk to mentors or peers.\n\n**Final Tip**\nThe best way to beat FOBO is to take action. Every new skill you learn is an investment in your future.`,
  },
  {
    id: 8,
    title: "Imposter Syndrome is Ruining Your Allied Health Career (Here's How to Fix It)",
    coverUrl: "/placeholder.jpg",
    author: "Allied Health Careers Editorial Team",
    date: "01 August, 2025",
    article: `Imposter syndrome—the feeling that you’re not as competent as others think—affects many allied health professionals. Here’s how to overcome it.\n\n**1. Recognise the Signs**\nSelf-doubt, perfectionism, and fear of being “found out” are common symptoms.\n\n**2. Talk About It**\nShare your feelings with trusted colleagues or mentors. You’re not alone.\n\n**3. Track Your Achievements**\nKeep a record of positive feedback and accomplishments.\n\n**4. Reframe Negative Thoughts**\nChallenge self-doubt with evidence of your skills and successes.\n\n**5. Seek Professional Support**\nIf imposter syndrome is affecting your wellbeing, consider talking to a psychologist.\n\n**6. Celebrate Progress**\nAcknowledge your growth and give yourself credit for learning.\n\n**Final Thought**\nYou earned your place. Don’t let imposter syndrome hold you back from a fulfilling career.`,
  },
  {
    id: 9,
    title: "The Salary Conversation: What to Say When Asked About Money (Script Included)",
    coverUrl: "/placeholder.jpg",
    author: "Allied Health Careers Editorial Team",
    date: "01 August, 2025",
    article: `Talking about salary can be uncomfortable, but it’s a crucial skill. Here’s how to handle money questions with confidence.\n\n**1. Do Your Research**\nKnow the typical salary range for your role and location.\n\n**2. Practice Your Script**\nWhen asked about salary expectations, try: “Based on my research and experience, I believe a fair range is $X–$Y. I’m open to discussing what’s appropriate for this role.”\n\n**3. Don’t Undersell Yourself**\nAvoid giving a number that’s too low. Focus on your value.\n\n**4. Be Ready for Pushback**\nIf pressed, repeat your range and express flexibility.\n\n**5. Salary in Performance Reviews**\nPrepare evidence of your achievements and market data.\n\n**Sample Script**\n“I’ve contributed to improved patient outcomes and taken on additional responsibilities. Based on industry benchmarks, I’d like to discuss a salary adjustment.”\n\n**Final Tip**\nPractice your responses so you’re ready for any salary conversation.`,
  },
  {
    id: 10,
    title: "Side Hustles for Allied Health Professionals: 7 Ways to Boost Your Income",
    coverUrl: "/placeholder.jpg",
    author: "Allied Health Careers Editorial Team",
    date: "01 August, 2025",
    article: `Looking to supplement your income? Here are seven legitimate side hustles for allied health professionals.\n\n**1. Telehealth Consulting**\nOffer remote consultations to clients in your specialty.\n\n**2. Training Delivery**\nDevelop and deliver workshops or courses for other professionals.\n\n**3. Freelance Assessments**\nProvide independent assessments for NDIS, insurance, or legal cases.\n\n**4. Content Creation**\nWrite articles, create videos, or start a podcast on allied health topics.\n\n**5. Private Practice**\nStart a part-time private clinic or mobile service.\n\n**6. Product Reviews**\nTest and review new allied health products or technology.\n\n**7. Mentoring**\nOffer coaching or mentoring to students and early-career professionals.\n\n**Final Thought**\nA side hustle can boost your income and expand your skills—just be sure to manage your time and avoid conflicts of interest.`,
  },
];

export default function BlogDetailPage() {
  const params = useParams();
  const postId = Number(params.id);
  const post = useMemo(() => placeholderPosts.find(p => p.id === postId), [postId]);

  if (!post) {
    return <div className="max-w-2xl mx-auto py-12 px-4 text-center text-gray-500">Blog post not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-6">
        <a href="/resources" className="text-sm text-violet-700 hover:underline">&larr; Back to Resources</a>
      </div>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <img src={post.coverUrl} alt={post.title} className="w-full h-64 object-cover rounded mb-6" />
      <div className="text-gray-500 text-sm mb-4">{post.author} &ndash; updated on {post.date}</div>
      <article className="prose prose-lg dark:prose-invert">
        {post.article.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>
    </div>
  );
} 
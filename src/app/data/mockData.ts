// Mock data for the Score Synth application

export interface Student {
  student_id: number;
  roll_number: string;
  name: string;
  email: string;
  academic_year: string;
  division: string;
}

export interface Subject {
  subject_id: number;
  subject_name: string;
  credits: number;
  year: string;
}

export interface Exam {
  exam_id: number;
  exam_type: string;
  academic_year: string;
  semester: string;
}

export interface Mark {
  mark_id: number;
  student_id: number;
  subject_id: number;
  exam_id: number;
  marks: number;
  max_marks: number;
}

export interface ReportCard {
  report_id: number;
  student_id: number;
  exam_id: number;
  total_marks: number;
  max_total_marks: number;
  percentage: number;
  grade: string;
  rank: number;
  pass_status: string;
  sgpa?: number;
}

export interface Grievance {
  grievance_id: number;
  student_id: number;
  subject: string;
  message: string;
  status: string;
  submitted_date: string;
}

// Grade calculation function
export const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'O';
  if (percentage >= 80) return 'A+';
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'B+';
  if (percentage >= 50) return 'B';
  if (percentage >= 40) return 'P';
  return 'F';
};

// Grade point mapping
export const gradeToPoint: { [key: string]: number } = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'P': 5,
  'F': 0,
};

// Mock Students Data
export const students: Student[] = [
  { student_id: 1, roll_number: 'B24CE1050', name: 'Parth Chaudhari', email: 'parth@example.com', academic_year: 'SY', division: 'SY BTech I' },
  { student_id: 2, roll_number: 'TE-002', name: 'Animish Deo', email: 'animish@example.com', academic_year: 'TE', division: 'A' },
  { student_id: 3, roll_number: 'TE-003', name: 'Niraj Fegade', email: 'niraj@example.com', academic_year: 'TE', division: 'A' },
  { student_id: 4, roll_number: 'TE-004', name: 'Khilesh Chaudhari', email: 'khilesh@example.com', academic_year: 'TE', division: 'A' },
  { student_id: 5, roll_number: 'TE-005', name: 'Priya Sharma', email: 'priya@example.com', academic_year: 'TE', division: 'A' },
  { student_id: 6, roll_number: 'TE-006', name: 'Rahul Verma', email: 'rahul@example.com', academic_year: 'TE', division: 'A' },
  { student_id: 7, roll_number: 'TE-007', name: 'Sneha Patel', email: 'sneha@example.com', academic_year: 'TE', division: 'A' },
  { student_id: 8, roll_number: 'TE-008', name: 'Amit Kumar', email: 'amit@example.com', academic_year: 'TE', division: 'A' },
  { student_id: 9, roll_number: 'TE-009', name: 'Divya Singh', email: 'divya@example.com', academic_year: 'TE', division: 'A' },
  { student_id: 10, roll_number: 'TE-010', name: 'Rohan Joshi', email: 'rohan@example.com', academic_year: 'TE', division: 'A' },
];

// Mock Subjects Data
export const subjects: Subject[] = [
  { subject_id: 1, subject_name: 'Data Structures', credits: 4, year: 'TE' },
  { subject_id: 2, subject_name: 'Database Management', credits: 4, year: 'TE' },
  { subject_id: 3, subject_name: 'Computer Networks', credits: 3, year: 'TE' },
  { subject_id: 4, subject_name: 'Operating Systems', credits: 4, year: 'TE' },
  { subject_id: 5, subject_name: 'Software Engineering', credits: 3, year: 'TE' },
];

// Mock Exams Data
export const exams: Exam[] = [
  { exam_id: 1, exam_type: 'Unit Test 1', academic_year: 'TE', semester: 'Semester 5' },
  { exam_id: 2, exam_type: 'CIE 1', academic_year: 'TE', semester: 'Semester 5' },
  { exam_id: 3, exam_type: 'Unit Test 2', academic_year: 'TE', semester: 'Semester 5' },
];

// Mock Marks Data (for Unit Test 1)
export const marks: Mark[] = [
  // Student 1 - Parth
  { mark_id: 1, student_id: 1, subject_id: 1, exam_id: 1, marks: 48, max_marks: 50 },
  { mark_id: 2, student_id: 1, subject_id: 2, exam_id: 1, marks: 45, max_marks: 50 },
  { mark_id: 3, student_id: 1, subject_id: 3, exam_id: 1, marks: 47, max_marks: 50 },
  { mark_id: 4, student_id: 1, subject_id: 4, exam_id: 1, marks: 46, max_marks: 50 },
  { mark_id: 5, student_id: 1, subject_id: 5, exam_id: 1, marks: 49, max_marks: 50 },
  
  // Student 2 - Animish
  { mark_id: 6, student_id: 2, subject_id: 1, exam_id: 1, marks: 46, max_marks: 50 },
  { mark_id: 7, student_id: 2, subject_id: 2, exam_id: 1, marks: 47, max_marks: 50 },
  { mark_id: 8, student_id: 2, subject_id: 3, exam_id: 1, marks: 45, max_marks: 50 },
  { mark_id: 9, student_id: 2, subject_id: 4, exam_id: 1, marks: 48, max_marks: 50 },
  { mark_id: 10, student_id: 2, subject_id: 5, exam_id: 1, marks: 46, max_marks: 50 },
  
  // Student 3 - Niraj
  { mark_id: 11, student_id: 3, subject_id: 1, exam_id: 1, marks: 44, max_marks: 50 },
  { mark_id: 12, student_id: 3, subject_id: 2, exam_id: 1, marks: 43, max_marks: 50 },
  { mark_id: 13, student_id: 3, subject_id: 3, exam_id: 1, marks: 46, max_marks: 50 },
  { mark_id: 14, student_id: 3, subject_id: 4, exam_id: 1, marks: 45, max_marks: 50 },
  { mark_id: 15, student_id: 3, subject_id: 5, exam_id: 1, marks: 47, max_marks: 50 },
  
  // Student 4 - Khilesh
  { mark_id: 16, student_id: 4, subject_id: 1, exam_id: 1, marks: 42, max_marks: 50 },
  { mark_id: 17, student_id: 4, subject_id: 2, exam_id: 1, marks: 44, max_marks: 50 },
  { mark_id: 18, student_id: 4, subject_id: 3, exam_id: 1, marks: 43, max_marks: 50 },
  { mark_id: 19, student_id: 4, subject_id: 4, exam_id: 1, marks: 45, max_marks: 50 },
  { mark_id: 20, student_id: 4, subject_id: 5, exam_id: 1, marks: 44, max_marks: 50 },
  
  // Student 5
  { mark_id: 21, student_id: 5, subject_id: 1, exam_id: 1, marks: 40, max_marks: 50 },
  { mark_id: 22, student_id: 5, subject_id: 2, exam_id: 1, marks: 42, max_marks: 50 },
  { mark_id: 23, student_id: 5, subject_id: 3, exam_id: 1, marks: 41, max_marks: 50 },
  { mark_id: 24, student_id: 5, subject_id: 4, exam_id: 1, marks: 43, max_marks: 50 },
  { mark_id: 25, student_id: 5, subject_id: 5, exam_id: 1, marks: 42, max_marks: 50 },
  
  // Student 6
  { mark_id: 26, student_id: 6, subject_id: 1, exam_id: 1, marks: 38, max_marks: 50 },
  { mark_id: 27, student_id: 6, subject_id: 2, exam_id: 1, marks: 40, max_marks: 50 },
  { mark_id: 28, student_id: 6, subject_id: 3, exam_id: 1, marks: 39, max_marks: 50 },
  { mark_id: 29, student_id: 6, subject_id: 4, exam_id: 1, marks: 41, max_marks: 50 },
  { mark_id: 30, student_id: 6, subject_id: 5, exam_id: 1, marks: 40, max_marks: 50 },
  
  // Student 7
  { mark_id: 31, student_id: 7, subject_id: 1, exam_id: 1, marks: 45, max_marks: 50 },
  { mark_id: 32, student_id: 7, subject_id: 2, exam_id: 1, marks: 46, max_marks: 50 },
  { mark_id: 33, student_id: 7, subject_id: 3, exam_id: 1, marks: 44, max_marks: 50 },
  { mark_id: 34, student_id: 7, subject_id: 4, exam_id: 1, marks: 47, max_marks: 50 },
  { mark_id: 35, student_id: 7, subject_id: 5, exam_id: 1, marks: 45, max_marks: 50 },
  
  // Student 8
  { mark_id: 36, student_id: 8, subject_id: 1, exam_id: 1, marks: 37, max_marks: 50 },
  { mark_id: 37, student_id: 8, subject_id: 2, exam_id: 1, marks: 39, max_marks: 50 },
  { mark_id: 38, student_id: 8, subject_id: 3, exam_id: 1, marks: 38, max_marks: 50 },
  { mark_id: 39, student_id: 8, subject_id: 4, exam_id: 1, marks: 40, max_marks: 50 },
  { mark_id: 40, student_id: 8, subject_id: 5, exam_id: 1, marks: 39, max_marks: 50 },
  
  // Student 9
  { mark_id: 41, student_id: 9, subject_id: 1, exam_id: 1, marks: 43, max_marks: 50 },
  { mark_id: 42, student_id: 9, subject_id: 2, exam_id: 1, marks: 44, max_marks: 50 },
  { mark_id: 43, student_id: 9, subject_id: 3, exam_id: 1, marks: 42, max_marks: 50 },
  { mark_id: 44, student_id: 9, subject_id: 4, exam_id: 1, marks: 45, max_marks: 50 },
  { mark_id: 45, student_id: 9, subject_id: 5, exam_id: 1, marks: 43, max_marks: 50 },
  
  // Student 10
  { mark_id: 46, student_id: 10, subject_id: 1, exam_id: 1, marks: 41, max_marks: 50 },
  { mark_id: 47, student_id: 10, subject_id: 2, exam_id: 1, marks: 42, max_marks: 50 },
  { mark_id: 48, student_id: 10, subject_id: 3, exam_id: 1, marks: 40, max_marks: 50 },
  { mark_id: 49, student_id: 10, subject_id: 4, exam_id: 1, marks: 43, max_marks: 50 },
  { mark_id: 50, student_id: 10, subject_id: 5, exam_id: 1, marks: 41, max_marks: 50 },
];

// Calculate report cards based on marks
export const calculateReportCards = (examId: number): ReportCard[] => {
  const reportCards: ReportCard[] = [];
  
  students.forEach(student => {
    const studentMarks = marks.filter(m => m.student_id === student.student_id && m.exam_id === examId);
    const totalMarks = studentMarks.reduce((sum, m) => sum + m.marks, 0);
    const maxTotalMarks = studentMarks.reduce((sum, m) => sum + m.max_marks, 0);
    const percentage = (totalMarks / maxTotalMarks) * 100;
    const grade = calculateGrade(percentage);
    const passStatus = percentage >= 40 ? 'PASS' : 'FAIL';
    
    reportCards.push({
      report_id: student.student_id,
      student_id: student.student_id,
      exam_id: examId,
      total_marks: totalMarks,
      max_total_marks: maxTotalMarks,
      percentage,
      grade,
      rank: 0, // Will be calculated after sorting
      pass_status: passStatus,
    });
  });
  
  // Calculate ranks
  reportCards.sort((a, b) => b.total_marks - a.total_marks);
  reportCards.forEach((rc, index) => {
    rc.rank = index + 1;
  });
  
  return reportCards;
};

export const reportCards: ReportCard[] = calculateReportCards(1);

// Mock Grievances Data
export const grievances: Grievance[] = [
  {
    grievance_id: 1,
    student_id: 5,
    subject: 'Data Structures marks discrepancy',
    message: 'I believe there is an error in my Data Structures marks calculation. Expected higher score.',
    status: 'Pending',
    submitted_date: '2026-03-08',
  },
  {
    grievance_id: 2,
    student_id: 8,
    subject: 'Database Management evaluation',
    message: 'Request re-evaluation of my Database Management answer sheet.',
    status: 'In Progress',
    submitted_date: '2026-03-09',
  },
  {
    grievance_id: 3,
    student_id: 3,
    subject: 'Computer Networks marks',
    message: 'Marks entered do not match my answer sheet.',
    status: 'Resolved',
    submitted_date: '2026-03-07',
  },
];

// Academic Calendar Events
export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: 'unit-test' | 'cie' | 'end-sem' | 'result' | 'other';
  description: string;
}

export const calendarEvents: CalendarEvent[] = [
  { id: 1, title: 'SY B.Tech Semester IV Commencement', date: '2026-01-05', type: 'other', description: 'Commencement of Semester IV for SY B.Tech' },
  { id: 2, title: 'FY End Term Exam (Regular & Backlog)', date: '2026-02-09', type: 'end-sem', description: 'FY B.Tech, MBA, M.Tech End Term Examination starts' },
  { id: 3, title: 'First Year B.Tech Conclusion of Sem II', date: '2026-05-07', type: 'result', description: 'Conclusion of Semester II for First Year B.Tech' },
  { id: 4, title: 'SY B.Tech End Term Exam Start', date: '2026-05-07', type: 'end-sem', description: 'SY B.Tech, MBA, M.Tech End Term Examination (Regular & Backlog ETE) begins' },
  { id: 5, title: 'T.E. / B.E. Audit II', date: '2026-02-02', type: 'other', description: 'Display of Final Detention List for SY, B.Tech/M.Tech/MBA' },
  { id: 6, title: 'FY End Term Exam (Regular & Backlog) End', date: '2026-05-23', type: 'end-sem', description: 'FY, SY B.Tech End Term Examination concludes' },
  { id: 7, title: 'SY B.Tech End Term Exam End', date: '2026-05-18', type: 'end-sem', description: 'SY B.Tech End Term Examination (Regular & Backlog ETE) concludes' },
  { id: 8, title: 'TE/BE Conclusion of Semester VI/VIII', date: '2026-05-19', type: 'result', description: 'Conclusion of Semester for TE and BE students' },
  { id: 9, title: 'SY B.Tech Conclusion of Semester IV', date: '2026-04-30', type: 'result', description: 'Second Year B.Tech/M.Tech/MBA Conclusion of Semester IV' },
  { id: 10, title: 'FY Exam Form Filling for Re-ETE', date: '2026-01-26', type: 'other', description: 'FY B.Tech, M.Tech Exam Form Filling for Re-ETE Start' },
  { id: 11, title: 'SY B.Tech Result after Re-ETE', date: '2026-02-16', type: 'result', description: 'FY B.Tech, M.Tech Result after Re-ETE' },
];

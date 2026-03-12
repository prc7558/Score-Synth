import { Link } from "react-router";
import { ArrowLeft, FileText, Calculator, MessageSquare, Calendar, Award, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ModeToggle } from "../components/mode-toggle";
import { students, reportCards, marks, subjects, calculateGrade } from "../data/mockData";

export function StudentDashboard() {
  // For demo purposes, show student 1 (Parth Chaudhari)
  const currentStudent = students[0];
  const studentReportCard = reportCards.find(rc => rc.student_id === currentStudent.student_id);
  const studentMarks = marks.filter(m => m.student_id === currentStudent.student_id);

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
                <p className="text-sm text-muted-foreground">{currentStudent.name} - {currentStudent.roll_number}</p>
              </div>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700 dark:text-blue-300 font-medium">Current Rank</CardDescription>
              <CardTitle className="text-4xl text-blue-900 dark:text-blue-100">#{studentReportCard?.rank}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 dark:text-blue-400">Out of {students.length} students</p>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-emerald-700 dark:text-emerald-300 font-medium">Percentage</CardDescription>
              <CardTitle className="text-4xl text-emerald-900 dark:text-emerald-100">{studentReportCard?.percentage.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Overall performance</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700 dark:text-purple-300 font-medium">Grade</CardDescription>
              <CardTitle className="text-4xl text-purple-900 dark:text-purple-100">{studentReportCard?.grade}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-600 dark:text-purple-400">Current grade</p>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-amber-700 dark:text-amber-300 font-medium">Status</CardDescription>
              <CardTitle className="text-2xl text-amber-900 dark:text-amber-100">{studentReportCard?.pass_status}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-600 dark:text-amber-400">Unit Test 1</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800/30 hover:shadow-md transition-all hover:-translate-y-1 duration-300">
            <Link to="/student-reports">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">View Reports</CardTitle>
                    <CardDescription className="text-muted-foreground">Access report cards</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Download your detailed report cards for all exams
                </p>
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-teal-50/50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-800/30 hover:shadow-md transition-all hover:-translate-y-1 duration-300">
            <Link to="/sgpa-predictor">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-lg">
                    <Calculator className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">SGPA Predictor</CardTitle>
                    <CardDescription className="text-muted-foreground">Calculate predicted grades</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Predict your SGPA and CGPA based on expected marks
                </p>
                <Button className="w-full" variant="outline">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate SGPA
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/30 hover:shadow-md transition-all hover:-translate-y-1 duration-300">
            <Link to="/grievances">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 dark:bg-pink-900/40 p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Submit Grievance</CardTitle>
                    <CardDescription className="text-muted-foreground">Report issues</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Submit queries regarding marks or result discrepancies
                </p>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Submit Query
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-violet-50/50 dark:bg-violet-900/10 border-violet-100 dark:border-violet-800/30 hover:shadow-md transition-all hover:-translate-y-1 duration-300">
            <Link to="/calendar">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Academic Calendar</CardTitle>
                    <CardDescription className="text-muted-foreground">Exam schedules</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View upcoming exams and result declaration dates
                </p>
                <Button className="w-full" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-sky-50/50 dark:bg-sky-900/10 border-sky-100 dark:border-sky-800/30 hover:shadow-md transition-all hover:-translate-y-1 duration-300">
            <Link to="/student-analytics">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/40 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Performance Analytics</CardTitle>
                    <CardDescription className="text-muted-foreground">Track your progress</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyze your performance across subjects and exams
                </p>
                <Button className="w-full" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Subject-wise Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
            <CardDescription>Semester 4 - Recent Results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Database Management Systems', type: 'Theory', marks: 80, max: 100, gp: 8, grade: 'A', credits: 3 },
                { name: 'Principles of Programming Languages', type: 'Theory', marks: 70, max: 100, gp: 7, grade: 'B+', credits: 3 },
                { name: 'Software Engineering', type: 'Theory', marks: 85, max: 100, gp: 9, grade: 'A+', credits: 3 },
                { name: 'Open Elective', type: 'Theory', marks: 75, max: 100, gp: 8, grade: 'A', credits: 3 },
                { name: 'DBMS Lab', type: 'Practical', marks: 42, max: 50, gp: 9, grade: 'A+', credits: 1 },
                { name: 'PPL Lab', type: 'Practical', marks: 38, max: 50, gp: 8, grade: 'A', credits: 1 },
                { name: 'Web Technology', type: 'Practical', marks: 45, max: 50, gp: 9, grade: 'A+', credits: 2 },
                { name: 'Operating Systems Workshop', type: 'Practical', marks: 40, max: 50, gp: 8, grade: 'A', credits: 2 },
                { name: 'PCPD', type: 'Practical', marks: 48, max: 50, gp: 10, grade: 'O', credits: 2 }
              ].map((subject, idx) => {
                const percentage = (subject.marks / subject.max) * 100;
                
                return (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{subject.name}</h4>
                        <Badge variant={subject.grade === 'O' || subject.grade.startsWith('A') ? "default" : subject.grade.startsWith('B') ? "secondary" : "outline"}>
                          {subject.grade}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Credits: {subject.credits} • {subject.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{subject.marks}</p>
                      <p className="text-sm text-muted-foreground">out of {subject.max}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-primary">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Updates and announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Unit Test 1 Results Published</p>
                  <p className="text-sm text-gray-600">Your report card is now available for download</p>
                  <p className="text-xs text-gray-500 mt-1">March 11, 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">CIE 1 Scheduled</p>
                  <p className="text-sm text-gray-600">Continuous Internal Evaluation on March 10, 2026</p>
                  <p className="text-xs text-gray-500 mt-1">March 8, 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Term Work Submission Reminder</p>
                  <p className="text-sm text-gray-600">Submit all pending term work by April 20, 2026</p>
                  <p className="text-xs text-gray-500 mt-1">March 7, 2026</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

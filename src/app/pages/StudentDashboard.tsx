import { Link } from "react-router";
import { ArrowLeft, FileText, Calculator, MessageSquare, Calendar, Award, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { students, reportCards, marks, subjects, calculateGrade } from "../data/mockData";

export function StudentDashboard() {
  // For demo purposes, show student 1 (Parth Chaudhari)
  const currentStudent = students[0];
  const studentReportCard = reportCards.find(rc => rc.student_id === currentStudent.student_id);
  const studentMarks = marks.filter(m => m.student_id === currentStudent.student_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">{currentStudent.name} - {currentStudent.roll_number}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-100">Current Rank</CardDescription>
              <CardTitle className="text-4xl">#{studentReportCard?.rank}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-100">Out of {students.length} students</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-100">Percentage</CardDescription>
              <CardTitle className="text-4xl">{studentReportCard?.percentage.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-100">Overall performance</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-100">Grade</CardDescription>
              <CardTitle className="text-4xl">{studentReportCard?.grade}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-100">Current grade</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-100">Status</CardDescription>
              <CardTitle className="text-2xl">{studentReportCard?.pass_status}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-100">Unit Test 1</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <Link to="/reports">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>View Reports</CardTitle>
                    <CardDescription>Access report cards</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Download your detailed report cards for all exams
                </p>
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Link to="/sgpa-predictor">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Calculator className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>SGPA Predictor</CardTitle>
                    <CardDescription>Calculate predicted grades</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Predict your SGPA and CGPA based on expected marks
                </p>
                <Button className="w-full" variant="outline">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate SGPA
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Link to="/grievances">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle>Submit Grievance</CardTitle>
                    <CardDescription>Report issues</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Submit queries regarding marks or result discrepancies
                </p>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Submit Query
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Link to="/calendar">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Academic Calendar</CardTitle>
                    <CardDescription>Exam schedules</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  View upcoming exams and result declaration dates
                </p>
                <Button className="w-full" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Link to="/analytics">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Performance Analytics</CardTitle>
                    <CardDescription>Track your progress</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
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
            <CardDescription>Unit Test 1 Results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentMarks.map((mark) => {
                const subject = subjects.find(s => s.subject_id === mark.subject_id);
                const percentage = (mark.marks / mark.max_marks) * 100;
                const grade = calculateGrade(percentage);
                
                return (
                  <div key={mark.mark_id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{subject?.subject_name}</h4>
                        <Badge variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "outline"}>
                          {grade}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Credits: {subject?.credits}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{mark.marks}</p>
                      <p className="text-sm text-gray-600">out of {mark.max_marks}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-blue-600">{percentage.toFixed(1)}%</p>
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

import { Link } from "react-router";
import { ArrowLeft, FileText, Calculator, MessageSquare, Calendar, Award, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { students, reportCards } from "../data/mockData";

export function StudentDashboard() {
  const currentStudent = students[0];
  const studentReportCard = reportCards.find(rc => rc.student_id === currentStudent.student_id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-xl font-semibold">Student Dashboard</h1>
              <p className="text-sm text-muted-foreground">{currentStudent.name} - {currentStudent.roll_number}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription>Rank</CardDescription>
              <CardTitle className="text-3xl">#{studentReportCard?.rank}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Out of {students.length}</p></CardContent>
          </Card>
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription>Percentage</CardDescription>
              <CardTitle className="text-3xl">{studentReportCard?.percentage.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Overall</p></CardContent>
          </Card>
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription>Grade</CardDescription>
              <CardTitle className="text-3xl">{studentReportCard?.grade}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Current</p></CardContent>
          </Card>
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription>Status</CardDescription>
              <CardTitle className="text-2xl">{studentReportCard?.pass_status}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Unit Test 1</p></CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {[
            { to: "/grievances", icon: MessageSquare, title: "Submit Grievance", desc: "Report mark issues", btn: "Submit Query" },
            { to: "/calendar", icon: Calendar, title: "Academic Calendar", desc: "Exam schedules", btn: "View Calendar" },
            { to: "/sgpa-predictor", icon: Calculator, title: "SGPA Predictor", desc: "Calculate predicted grades", btn: "Calculate" },
            { to: "/student-analytics", icon: TrendingUp, title: "Analytics", desc: "Track your progress", btn: "View Analytics" },
            { to: "/student-reports", icon: FileText, title: "View Reports", desc: "Download report cards", btn: "View Reports" },
          ].map((item, i) => (
            <Card key={i} className="border hover:border-primary/40 transition-colors">
              <Link to={item.to}>
                <CardHeader>
                  <div className="flex flex-row items-start gap-3">
                    <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="mt-1">{item.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full"><item.icon className="mr-2 h-4 w-4" />{item.btn}</Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <Card className="border mb-8">
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Semester 4</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
              ].map((sub, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium">{sub.name}</span>
                      <Badge variant="outline">{sub.grade}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{sub.credits} credits • {sub.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold">{sub.marks}<span className="text-sm text-muted-foreground">/{sub.max}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Unit Test 1 Results Published</p>
                  <p className="text-sm text-muted-foreground">Report card available for download</p>
                  <p className="text-xs text-muted-foreground mt-1">March 11, 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">CIE 1 Scheduled</p>
                  <p className="text-sm text-muted-foreground">Continuous Internal Evaluation on March 10, 2026</p>
                  <p className="text-xs text-muted-foreground mt-1">March 8, 2026</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Term Work Submission Reminder</p>
                  <p className="text-sm text-muted-foreground">Submit all pending term work by April 20, 2026</p>
                  <p className="text-xs text-muted-foreground mt-1">March 7, 2026</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

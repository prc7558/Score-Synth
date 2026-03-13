import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const studentData = {
  name: "Parth Chaudhari",
  rollNo: "B24CE1050",
  division: "SY BTech I",
  academicYear: "Second Year (Sem 4)"
};

const allSemesters = {
  "Sem 1": [
    { name: 'Applied Physics', type: 'Theory', credits: 3, gp: 8, pt: 24, grade: 'A' },
    { name: 'Applied Physics', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Engineering Mathematics I', type: 'Theory', credits: 3, gp: 10, pt: 30, grade: 'O' },
    { name: 'Engineering Mathematics I', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Basics of Electrical Technology', type: 'Theory', credits: 2, gp: 9, pt: 18, grade: 'A+' },
    { name: 'Basics of Electrical Technology', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Engineering Graphics', type: 'Theory', credits: 2, gp: 10, pt: 20, grade: 'O' },
    { name: 'Engineering Graphics', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Fundamentals of Programming', type: 'Theory', credits: 2, gp: 10, pt: 20, grade: 'O' },
    { name: 'Fundamentals of Programming', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Engineering Exploration Lab - I', type: 'Term Work', credits: 2, gp: 10, pt: 20, grade: 'O' },
    { name: 'Indian Culture & Civilization', type: 'Term Work', credits: 2, gp: 9, pt: 18, grade: 'A+' },
    { name: 'Performing Arts', type: 'Term Work', credits: 1, gp: 9, pt: 9, grade: 'A+' }
  ],
  "Sem 2": [
    { name: 'Applied Chemistry', type: 'Theory', credits: 3, gp: 10, pt: 30, grade: 'O' },
    { name: 'Applied Chemistry', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Engineering Mathematics II', type: 'Theory', credits: 3, gp: 9, pt: 27, grade: 'A+' },
    { name: 'Engineering Mathematics II', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Basics of Electronics Technology', type: 'Theory', credits: 2, gp: 9, pt: 18, grade: 'A+' },
    { name: 'Basics of Electronics Technology', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Geomatics', type: 'Theory', credits: 2, gp: 10, pt: 20, grade: 'O' },
    { name: 'Geomatics', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Foundation of AI', type: 'Theory', credits: 2, gp: 10, pt: 20, grade: 'O' },
    { name: 'Foundation of AI', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Engineering Exploration Lab - II', type: 'Term Work', credits: 2, gp: 10, pt: 20, grade: 'O' },
    { name: 'Communication Skills', type: 'Term Work', credits: 2, gp: 9, pt: 18, grade: 'A+' },
    { name: 'Yoga and Meditation', type: 'Term Work', credits: 1, gp: 9, pt: 9, grade: 'A+' }
  ],
  "Sem 3": [
    { name: 'Data Structures', type: 'Theory', credits: 3, gp: 10, pt: 30, grade: 'O' },
    { name: 'Object Oriented Programming', type: 'Theory', credits: 3, gp: 9, pt: 27, grade: 'A+' },
    { name: 'Digital Electronics & Computer Org', type: 'Theory', credits: 3, gp: 9, pt: 27, grade: 'A+' },
    { name: 'Maths Foundation for GenAI', type: 'Theory', credits: 2, gp: 10, pt: 20, grade: 'O' },
    { name: 'Data Structures Lab', type: 'Practical', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'OOP Lab', type: 'Practical', credits: 1, gp: 9, pt: 9, grade: 'A+' },
    { name: 'Maths GenAI Lab', type: 'Term Work', credits: 1, gp: 10, pt: 10, grade: 'O' },
    { name: 'Project based Learning', type: 'Term Work', credits: 2, gp: 9, pt: 18, grade: 'A+' },
    { name: 'Human Values and Ethics', type: 'Term Work', credits: 2, gp: 10, pt: 20, grade: 'O' },
    { name: 'Environment Sustainability', type: 'Term Work', credits: 2, gp: 10, pt: 20, grade: 'O' }
  ],
  "Sem 4": [
    { name: 'Database Management Systems', type: 'Theory', pt: 24, gp: 8, grade: 'A', credits: 3 },
    { name: 'Principles of Programming Languages', type: 'Theory', pt: 21, gp: 7, grade: 'B+', credits: 3 },
    { name: 'Software Engineering', type: 'Theory', pt: 27, gp: 9, grade: 'A+', credits: 3 },
    { name: 'Open Elective', type: 'Theory', pt: 24, gp: 8, grade: 'A', credits: 3 },
    { name: 'DBMS Lab', type: 'Practical', pt: 9, gp: 9, grade: 'A+', credits: 1 },
    { name: 'PPL Lab', type: 'Practical', pt: 8, gp: 8, grade: 'A', credits: 1 },
    { name: 'Web Technology', type: 'Practical', pt: 18, gp: 9, grade: 'A+', credits: 2 },
    { name: 'Operating Systems Workshop', type: 'Practical', pt: 16, gp: 8, grade: 'A', credits: 2 },
    { name: 'PCPD', type: 'Practical', pt: 20, gp: 10, grade: 'O', credits: 2 }
  ]
};

export function StudentReports() {
  const [activeSem, setActiveSem] = useState<keyof typeof allSemesters>("Sem 4");

  const handlePrint = () => {
    try {
      fetch('http://localhost/scoresynth/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'log_activity', action_type: 'Report_Downloaded', details: `Downloaded/Printed report for ${activeSem}` })
      }).catch(e => console.error("XAMPP log_activity failed:", e));
    } catch (e) {
      console.error("XAMPP log_activity error:", e);
    }
    window.print();
  };

  const getReportData = (sem: keyof typeof allSemesters) => {
    const subjects = allSemesters[sem];
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const totalEarned = subjects.reduce((sum, s) => sum + s.pt, 0);
    const sgpa = (totalEarned / totalCredits).toFixed(2);
    return { subjects, totalCredits, totalEarned, sgpa };
  };

  const currentReport = getReportData(activeSem);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card print-hide">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/student"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-xl font-semibold">Report Cards</h1>
              <p className="text-sm text-muted-foreground">View and print</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" /> Print</Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="print-area">
          <Card className="border mb-6">
            <CardHeader className="border-b pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle className="text-2xl">Report Card</CardTitle>
                  <CardDescription className="text-base">Semester {activeSem.replace('Sem ', '')}</CardDescription>
                </div>
                <div className="mt-3 md:mt-0 text-left md:text-right">
                  <p className="font-semibold">{studentData.name}</p>
                  <p className="text-sm text-muted-foreground">PICT • Roll: {studentData.rollNo} • Div: {studentData.division}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Course</th>
                      <th className="px-4 py-3 text-center">Type</th>
                      <th className="px-4 py-3 text-center">Credits</th>
                      <th className="px-4 py-3 text-center">GP</th>
                      <th className="px-4 py-3 text-center">Points</th>
                      <th className="px-4 py-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentReport.subjects.map((sub, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-medium">{sub.name}</td>
                        <td className="px-4 py-3 text-center"><Badge variant="outline" className="text-xs">{sub.type}</Badge></td>
                        <td className="px-4 py-3 text-center">{sub.credits}</td>
                        <td className="px-4 py-3 text-center font-medium text-primary">{sub.gp}</td>
                        <td className="px-4 py-3 text-center">{sub.pt}</td>
                        <td className="px-4 py-3 text-center"><Badge variant="outline">{sub.grade}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 flex flex-col md:flex-row justify-between items-center border-t bg-muted/20">
                <div className="space-y-1 text-sm mb-3 md:mb-0">
                  <p>Credits: <strong>{currentReport.totalCredits}</strong></p>
                  <p>Points: <strong>{currentReport.totalEarned}</strong></p>
                  <p>Status: <strong className="text-green-600">PASS</strong></p>
                </div>
                <div className="text-center bg-card p-4 rounded-xl border">
                  <p className="text-xs text-muted-foreground uppercase mb-1">SGPA</p>
                  <p className="text-4xl font-bold text-primary">{currentReport.sgpa}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-lg font-semibold mb-4 print-hide">All Semesters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print-hide">
          {(Object.keys(allSemesters) as Array<keyof typeof allSemesters>).map((sem) => (
            <Card
              key={sem}
              onClick={() => setActiveSem(sem)}
              className={`cursor-pointer border transition-colors ${activeSem === sem ? 'border-primary bg-primary/5' : 'hover:border-primary/30'}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{sem}</CardTitle>
                  <Badge variant={activeSem === sem ? "default" : "outline"}>{getReportData(sem).sgpa}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-start px-0 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mr-2" /> {activeSem === sem ? 'Viewing' : 'View'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

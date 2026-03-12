import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ModeToggle } from "../components/mode-toggle";

const studentData = {
  name: "Parth Chaudhari",
  rollNo: "TE-001",
  division: "A",
  academicYear: "Second Year (Sem 4)"
};

// Historical Data Sets
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
    // Log to XAMPP formally
    try {
      fetch('http://localhost/scoresynth/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log_activity',
          action_type: 'Report_Downloaded',
          details: `Downloaded/Printed report for ${activeSem}`
        })
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
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      <header className="bg-card shadow-sm border-b print-hide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/student">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Report Cards</h1>
              <p className="text-sm text-muted-foreground">View, download, and track your history.</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <ModeToggle />
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" /> Print / PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Printable Area Starts */}
        <div className="print-area">
          <Card className="mb-8 overflow-hidden shadow-lg border-t-4 border-t-primary">
            <CardHeader className="bg-card border-b pb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight">Report Card</CardTitle>
                  <CardDescription className="text-lg font-medium text-primary mt-1">
                    Semester {activeSem.replace('Sem ', '')}
                  </CardDescription>
                </div>
                <div className="mt-4 md:mt-0 text-left md:text-right bg-muted/50 p-4 rounded-xl border border-border">
                  <p className="font-bold text-lg">{studentData.name}</p>
                  <p className="text-sm text-muted-foreground mb-1">Pune Institute of Computer Technology</p>
                  <div className="flex gap-2 justify-end mt-2">
                     <Badge variant="outline">Roll: {studentData.rollNo}</Badge>
                     <Badge variant="outline">Div: {studentData.division}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg">Course Name</th>
                      <th className="px-6 py-4 text-center">Type</th>
                      <th className="px-6 py-4 text-center">Credits</th>
                      <th className="px-6 py-4 text-center">Grade Point</th>
                      <th className="px-6 py-4 text-center">Credit Points</th>
                      <th className="px-6 py-4 text-center rounded-tr-lg">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {currentReport.subjects.map((sub, idx) => (
                      <tr key={idx} className="bg-card hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">{sub.name}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={sub.type === 'Theory' ? 'outline' : 'secondary'} className="font-normal text-xs">{sub.type}</Badge>
                        </td>
                        <td className="px-6 py-4 text-center font-medium">{sub.credits}</td>
                        <td className="px-6 py-4 text-center text-primary font-bold">{sub.gp}</td>
                        <td className="px-6 py-4 text-center font-medium">{sub.pt}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge className={
                            sub.grade === 'O' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200' :
                            sub.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200'
                          }>{sub.grade}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-muted/30 p-8 flex flex-col md:flex-row justify-between items-center border-t">
                <div className="mb-4 md:mb-0 space-y-2">
                  <p className="text-base text-muted-foreground">Total Earned Credits: <strong className="text-foreground">{currentReport.totalCredits}</strong></p>
                  <p className="text-base text-muted-foreground">Total Earned Points: <strong className="text-foreground">{currentReport.totalEarned}</strong></p>
                  <p className="text-base text-muted-foreground">Result Status: <strong className="text-green-600 dark:text-green-400">PASS</strong></p>
                </div>
                <div className="text-right bg-card p-6 rounded-2xl shadow-sm border border-border">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">SGPA</p>
                  <p className="text-5xl font-black text-primary">{currentReport.sgpa}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Printable Area Ends */}

        {/* Previous Reports Placeholder */}
        <h3 className="text-2xl font-bold mb-6 text-foreground print-hide">All Semesters</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 print-hide">
          {(Object.keys(allSemesters) as Array<keyof typeof allSemesters>).map((sem) => (
             <Card 
               key={sem} 
               onClick={() => setActiveSem(sem)}
               className={`cursor-pointer transition-all hover:shadow-md ${activeSem === sem ? 'bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/50 border-primary/50 shadow-md' : 'bg-card hover:bg-muted/50 opacity-80 hover:opacity-100'}`}
             >
               <CardHeader className="pb-4">
                 <div className="flex justify-between items-center">
                   <CardTitle className="text-lg">{sem}</CardTitle>
                   <Badge variant={activeSem === sem ? "default" : "outline"} className="font-bold">
                     {getReportData(sem).sgpa}
                   </Badge>
                 </div>
               </CardHeader>
               <CardContent>
                 <Button variant="ghost" className="w-full justify-start px-0 text-muted-foreground hover:text-primary">
                    <FileText className="h-4 w-4 mr-2" /> 
                    {activeSem === sem ? 'Currently Viewing' : 'View Report'}
                 </Button>
               </CardContent>
             </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

// Hardcoded student data based on new Sem 4 subjects
const studentData = {
  name: "Parth Chaudhari",
  rollNo: "TE-001",
  division: "A",
  academicYear: "Second Year (Sem 4)"
};

const subjects = [
  { name: 'Database Management Systems', type: 'Theory', cie: 32, ete: 48, max: 100, gp: 8, grade: 'A', credits: 3 },
  { name: 'Principles of Programming Languages', type: 'Theory', cie: 28, ete: 42, max: 100, gp: 7, grade: 'B+', credits: 3 },
  { name: 'Software Engineering', type: 'Theory', cie: 35, ete: 50, max: 100, gp: 9, grade: 'A+', credits: 3 },
  { name: 'Open Elective', type: 'Theory', cie: 30, ete: 45, max: 100, gp: 8, grade: 'A', credits: 3 },
  { name: 'DBMS Lab', type: 'Practical', marks: 42, max: 50, gp: 9, grade: 'A+', credits: 1 },
  { name: 'PPL Lab', type: 'Practical', marks: 38, max: 50, gp: 8, grade: 'A', credits: 1 },
  { name: 'Web Technology', type: 'Practical', marks: 45, max: 50, gp: 9, grade: 'A+', credits: 2 },
  { name: 'Operating Systems Workshop', type: 'Practical', marks: 40, max: 50, gp: 8, grade: 'A', credits: 2 },
  { name: 'PCPD', type: 'Practical', marks: 48, max: 50, gp: 10, grade: 'O', credits: 2 }
];

export function StudentReports() {
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const totalEarned = subjects.reduce((sum, s) => sum + (s.gp * s.credits), 0);
  const currentSgpa = (totalEarned / totalCredits).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/student">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Report Cards</h1>
              <p className="text-sm text-gray-600">View and download your academic reports</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Printer className="h-4 w-4 mr-2" /> Print</Button>
            <Button><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 overflow-hidden shadow-lg border-t-4 border-t-blue-600">
          <CardHeader className="bg-white border-b pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle className="text-2xl">Semester 4 Report Card</CardTitle>
                <CardDescription>Academic Year 2025-26</CardDescription>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="font-semibold text-lg">{studentData.name}</p>
                <p className="text-sm text-gray-600">Roll No: {studentData.rollNo} | Div: {studentData.division}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase">
                  <tr>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4 text-center">Type</th>
                    <th className="px-6 py-4 text-center">Credits</th>
                    <th className="px-6 py-4 text-center">Marks</th>
                    <th className="px-6 py-4 text-center">Max</th>
                    <th className="px-6 py-4 text-center">Grade Point</th>
                    <th className="px-6 py-4 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subjects.map((sub, idx) => {
                    const totalMarks = sub.type === 'Theory' ? (sub.cie! + sub.ete!) : sub.marks!;
                    return (
                      <tr key={idx} className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{sub.name}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={sub.type === 'Theory' ? 'outline' : 'secondary'}>{sub.type}</Badge>
                        </td>
                        <td className="px-6 py-4 text-center">{sub.credits}</td>
                        <td className="px-6 py-4 text-center font-semibold">{totalMarks}</td>
                        <td className="px-6 py-4 text-center text-gray-500">{sub.max}</td>
                        <td className="px-6 py-4 text-center text-blue-600 font-bold">{sub.gp}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge className={
                            sub.grade === 'O' ? 'bg-purple-600' :
                            sub.grade.startsWith('A') ? 'bg-green-600' :
                            'bg-blue-600'
                          }>{sub.grade}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gray-100 p-6 flex flex-col md:flex-row justify-between items-center border-t">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-600">Total Credits: <strong>{totalCredits}</strong></p>
                <p className="text-sm text-gray-600">Result Status: <strong className="text-green-600">PASS</strong></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Semester 4 SGPA</p>
                <p className="text-4xl font-bold text-blue-600">{currentSgpa}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Reports Placeholder */}
        <h3 className="text-xl font-bold mb-4">Previous Semesters</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="opacity-75">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Semester 3</CardTitle>
                <Badge variant="outline">SGPA: 8.42</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0"><FileText className="h-4 w-4 mr-2" /> View Report Card</Button>
            </CardContent>
          </Card>
          <Card className="opacity-75">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Semester 2</CardTitle>
                <Badge variant="outline">SGPA: 8.10</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0"><FileText className="h-4 w-4 mr-2" /> View Report Card</Button>
            </CardContent>
          </Card>
          <Card className="opacity-75">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Semester 1</CardTitle>
                <Badge variant="outline">SGPA: 7.95</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0"><FileText className="h-4 w-4 mr-2" /> View Report Card</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

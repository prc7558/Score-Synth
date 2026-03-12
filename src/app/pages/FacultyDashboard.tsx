import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Upload, FileSpreadsheet, BarChart3, FileText, MessageSquare, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { reportCards, students, subjects, marks } from "../data/mockData";

const availableTemplates = [
  { year: "BE", div: "1", sem: "8", file: "BE1 Sem 8.xlsx" },
  { year: "BE", div: "2", sem: "8", file: "BE2 Sem 8.xlsx" },
  { year: "FY", div: "1", sem: "1", file: "FY1 Sem 1.xlsx" },
  { year: "FY", div: "2", sem: "1", file: "FY2 Sem 1.xlsx" },
  { year: "FY", div: "3", sem: "1", file: "FY3 Sem 1.xlsx" },
  { year: "IT", div: "All", sem: "4", file: "IT Sem 4.xlsx" },
  { year: "SY", div: "1", sem: "3", file: "SY1 Sem 3.xlsx" },
  { year: "SY", div: "1", sem: "4", file: "SY1 Sem 4.xlsx" },
  { year: "SY", div: "2", sem: "3", file: "SY2 Sem 3.xlsx" },
  { year: "SY", div: "2", sem: "4", file: "SY2 Sem 4.xlsx" },
  { year: "TE", div: "1", sem: "6", file: "TE1 Sem 6.xlsx" },
  { year: "TE", div: "2", sem: "6", file: "TE2 Sem 6.xlsx" },
];

export function FacultyDashboard() {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDiv, setSelectedDiv] = useState("");
  const [selectedSem, setSelectedSem] = useState("");

  const years = Array.from(new Set(availableTemplates.map(t => t.year)));
  const divisions = Array.from(new Set(availableTemplates.filter(t => t.year === selectedYear).map(t => t.div)));
  const semesters = availableTemplates.filter(t => t.year === selectedYear && t.div === selectedDiv).map(t => t.sem);

  const matchedTemplate = availableTemplates.find(t => t.year === selectedYear && t.div === selectedDiv && t.sem === selectedSem);

  const handleDownloadSubmit = () => {
    if (matchedTemplate) {
      window.open(`/templates/${matchedTemplate.file}`, "_blank");
      setIsDownloadOpen(false);
      setSelectedYear("");
      setSelectedDiv("");
      setSelectedSem("");
    }
  };

  // Calculate statistics
  const totalStudents = students.length;
  const passCount = reportCards.filter(rc => rc.pass_status === 'PASS').length;
  const passPercentage = ((passCount / totalStudents) * 100).toFixed(1);
  const avgPercentage = (reportCards.reduce((sum, rc) => sum + rc.percentage, 0) / totalStudents).toFixed(2);
  const topRank = reportCards.find(rc => rc.rank === 1);
  const topStudent = students.find(s => s.student_id === topRank?.student_id);

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
                <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
                <p className="text-sm text-gray-600">Manage academic results and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Students</CardDescription>
              <CardTitle className="text-3xl">{totalStudents}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pass Percentage</CardDescription>
              <CardTitle className="text-3xl text-green-600">{passPercentage}%</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Class Average</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{avgPercentage}%</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Top Scorer</CardDescription>
              <CardTitle className="text-xl">{topStudent?.name}</CardTitle>
              <p className="text-sm text-gray-600">{topRank?.percentage.toFixed(2)}%</p>
            </CardHeader>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Download Template</DialogTitle>
                <DialogDescription>
                  Select the Year, Division, and Semester to download the correct Excel template.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="year">Year / Grade</Label>
                  <Select value={selectedYear} onValueChange={(val) => { setSelectedYear(val); setSelectedDiv(""); setSelectedSem(""); }}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(y => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedYear && (
                  <div className="grid gap-2">
                    <Label htmlFor="division">Division</Label>
                    <Select value={selectedDiv} onValueChange={(val) => { setSelectedDiv(val); setSelectedSem(""); }}>
                      <SelectTrigger id="division">
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedYear && selectedDiv && (
                  <div className="grid gap-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={selectedSem} onValueChange={setSelectedSem}>
                      <SelectTrigger id="semester">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map(s => (
                          <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button disabled={!matchedTemplate} onClick={handleDownloadSubmit}>
                  Download
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsDownloadOpen(true)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Download Template</CardTitle>
                  <CardDescription>Excel marks entry template</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Download standardized Excel template for entering student marks
              </p>
              <Button className="w-full" onClick={(e) => { e.stopPropagation(); setIsDownloadOpen(true); }}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Download Excel Template
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Link to="/upload-marks">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Upload Marks</CardTitle>
                    <CardDescription>Process exam results</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Upload completed Excel file to process results and generate reports
                </p>
                <Button className="w-full" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Excel File
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
                    <CardTitle>Grievances</CardTitle>
                    <CardDescription>Student queries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Review and respond to student grievances about results
                </p>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Grievances
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Upload className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Unit Test 1 marks uploaded</p>
                  <p className="text-sm text-gray-600">All subjects processed successfully</p>
                </div>
                <span className="text-sm text-gray-500">March 11, 2026</span>
              </div>

              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Report cards generated</p>
                  <p className="text-sm text-gray-600">{totalStudents} PDF reports created</p>
                </div>
                <span className="text-sm text-gray-500">March 11, 2026</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New grievance submitted</p>
                  <p className="text-sm text-gray-600">Data Structures marks query</p>
                </div>
                <span className="text-sm text-gray-500">March 9, 2026</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

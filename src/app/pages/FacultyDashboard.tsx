import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Upload, FileSpreadsheet, BarChart3, FileText, MessageSquare, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { ModeToggle } from "../components/mode-toggle";
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
                <h1 className="text-2xl font-bold text-foreground">Faculty Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage academic results and analytics</p>
              </div>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-800 dark:text-blue-200">Total Students</CardDescription>
              <CardTitle className="text-3xl text-blue-950 dark:text-blue-50">{totalStudents}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-emerald-800 dark:text-emerald-200">Pass Percentage</CardDescription>
              <CardTitle className="text-3xl text-emerald-950 dark:text-emerald-50">{passPercentage}%</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-indigo-100 dark:bg-indigo-900/40 border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-indigo-800 dark:text-indigo-200">Class Average</CardDescription>
              <CardTitle className="text-3xl text-indigo-950 dark:text-indigo-50">{avgPercentage}%</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-purple-100 dark:bg-purple-900/40 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-800 dark:text-purple-200">Top Scorer</CardDescription>
              <CardTitle className="text-xl text-purple-950 dark:text-purple-50">{topStudent?.name}</CardTitle>
              <p className="text-sm text-purple-800 dark:text-purple-200/80">{topRank?.percentage.toFixed(2)}%</p>
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

          <Card className="bg-teal-100 dark:bg-teal-900/40 border-2 border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer group" onClick={() => setIsDownloadOpen(true)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-teal-200 dark:bg-teal-800 p-3 rounded-lg group-hover:bg-teal-300 dark:group-hover:bg-teal-700 transition-colors">
                  <Download className="h-6 w-6 text-teal-700 dark:text-teal-200" />
                </div>
                <div>
                  <CardTitle className="text-teal-950 dark:text-teal-50">Download Template</CardTitle>
                  <CardDescription className="text-teal-800 dark:text-teal-200">Excel marks entry template</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-teal-900 dark:text-teal-100/80 mb-4">
                Download standardized Excel template for entering student marks
              </p>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white border-0" onClick={(e) => { e.stopPropagation(); setIsDownloadOpen(true); }}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Download Excel Template
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-sky-100 dark:bg-sky-900/40 border-2 border-sky-200 dark:border-sky-800 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-lg transition-all cursor-pointer group">
            <Link to="/upload-marks" className="block h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-sky-200 dark:bg-sky-800 p-3 rounded-lg group-hover:bg-sky-300 dark:group-hover:bg-sky-700 transition-colors">
                    <Upload className="h-6 w-6 text-sky-700 dark:text-sky-200" />
                  </div>
                  <div>
                    <CardTitle className="text-sky-950 dark:text-sky-50">Upload Marks</CardTitle>
                    <CardDescription className="text-sky-800 dark:text-sky-200">Process exam results</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-sky-900 dark:text-sky-100/80 mb-4">
                  Upload completed Excel file to process results and generate reports
                </p>
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white border-0">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Excel File
                </Button>
              </CardContent>
            </Link>
          </Card>



          <Card className="bg-pink-100 dark:bg-pink-900/40 border-2 border-pink-200 dark:border-pink-800 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-lg transition-all cursor-pointer group">
            <Link to="/grievances" className="block h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-pink-200 dark:bg-pink-800 p-3 rounded-lg group-hover:bg-pink-300 dark:group-hover:bg-pink-700 transition-colors">
                    <MessageSquare className="h-6 w-6 text-pink-700 dark:text-pink-200" />
                  </div>
                  <div>
                    <CardTitle className="text-pink-950 dark:text-pink-50">Grievances</CardTitle>
                    <CardDescription className="text-pink-800 dark:text-pink-200">Student queries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-pink-900 dark:text-pink-100/80 mb-4">
                  Review and respond to student grievances about results
                </p>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white border-0">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Grievances
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card shadow-sm border-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="bg-emerald-200 dark:bg-emerald-800/50 p-2 rounded-lg">
                  <Upload className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Unit Test 1 marks uploaded</p>
                  <p className="text-sm text-muted-foreground">All subjects processed successfully</p>
                </div>
                <span className="text-sm text-muted-foreground">March 11, 2026</span>
              </div>

              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="bg-blue-200 dark:bg-blue-800/50 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Report cards generated</p>
                  <p className="text-sm text-muted-foreground">{totalStudents} PDF reports created</p>
                </div>
                <span className="text-sm text-muted-foreground">March 11, 2026</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-purple-200 dark:bg-purple-800/50 p-2 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">New grievance submitted</p>
                  <p className="text-sm text-muted-foreground">Data Structures marks query</p>
                </div>
                <span className="text-sm text-muted-foreground">March 9, 2026</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Upload, FileSpreadsheet, FileText, MessageSquare, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { reportCards, students } from "../data/mockData";

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

  const totalStudents = students.length;
  const passCount = reportCards.filter(rc => rc.pass_status === 'PASS').length;
  const passPercentage = ((passCount / totalStudents) * 100).toFixed(1);
  const avgPercentage = (reportCards.reduce((sum, rc) => sum + rc.percentage, 0) / totalStudents).toFixed(2);
  const topRank = reportCards.find(rc => rc.rank === 1);
  const topStudent = students.find(s => s.student_id === topRank?.student_id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-xl font-semibold">Faculty Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage academic results</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border"><CardHeader className="pb-2"><CardDescription>Students</CardDescription><CardTitle className="text-2xl">{totalStudents}</CardTitle></CardHeader></Card>
          <Card className="border"><CardHeader className="pb-2"><CardDescription>Pass Rate</CardDescription><CardTitle className="text-2xl">{passPercentage}%</CardTitle></CardHeader></Card>
          <Card className="border"><CardHeader className="pb-2"><CardDescription>Class Avg</CardDescription><CardTitle className="text-2xl">{avgPercentage}%</CardTitle></CardHeader></Card>
          <Card className="border"><CardHeader className="pb-2"><CardDescription>Top Scorer</CardDescription><CardTitle className="text-lg">{topStudent?.name}</CardTitle><p className="text-sm text-muted-foreground">{topRank?.percentage.toFixed(2)}%</p></CardHeader></Card>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Download Template</DialogTitle>
                <DialogDescription>Select Year, Division, and Semester</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Year</Label>
                  <Select value={selectedYear} onValueChange={(val) => { setSelectedYear(val); setSelectedDiv(""); setSelectedSem(""); }}>
                    <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                    <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {selectedYear && (
                  <div className="grid gap-2">
                    <Label>Division</Label>
                    <Select value={selectedDiv} onValueChange={(val) => { setSelectedDiv(val); setSelectedSem(""); }}>
                      <SelectTrigger><SelectValue placeholder="Select Division" /></SelectTrigger>
                      <SelectContent>{divisions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                {selectedYear && selectedDiv && (
                  <div className="grid gap-2">
                    <Label>Semester</Label>
                    <Select value={selectedSem} onValueChange={setSelectedSem}>
                      <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
                      <SelectContent>{semesters.map(s => <SelectItem key={s} value={s}>Semester {s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter><Button disabled={!matchedTemplate} onClick={handleDownloadSubmit}>Download</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <Card className="border cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setIsDownloadOpen(true)}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Download Template</CardTitle>
              </div>
              <CardDescription>Get Excel marks entry template</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={(e) => { e.stopPropagation(); setIsDownloadOpen(true); }}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Get Template
              </Button>
            </CardContent>
          </Card>

          <Card className="border hover:border-primary/40 transition-colors">
            <Link to="/upload-marks" className="block h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Upload Marks</CardTitle>
                </div>
                <CardDescription>Process exam results</CardDescription>
              </CardHeader>
              <br></br>
              <CardContent>
                <Button className="w-full"><Upload className="mr-2 h-4 w-4" /> Upload File</Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="border hover:border-primary/40 transition-colors">
            <Link to="/faculty-grievances" className="block h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Grievances</CardTitle>
                </div>
                <CardDescription>Student queries</CardDescription>
              </CardHeader>
              <br></br>
              <CardContent>
                <Button className="w-full"><MessageSquare className="mr-2 h-4 w-4" /> View All</Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        <Card className="border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Unit Test 1 marks uploaded</p>
                  <p className="text-sm text-muted-foreground">All subjects processed</p>
                </div>
                <span className="text-sm text-muted-foreground">Mar 11</span>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Report cards generated</p>
                  <p className="text-sm text-muted-foreground">{totalStudents} PDF reports created</p>
                </div>
                <span className="text-sm text-muted-foreground">Mar 11</span>
              </div>
              <div className="flex items-center gap-4">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">New grievance submitted</p>
                  <p className="text-sm text-muted-foreground">Data Structures marks query</p>
                </div>
                <span className="text-sm text-muted-foreground">Mar 9</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

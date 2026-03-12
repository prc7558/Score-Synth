import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { ModeToggle } from "../components/mode-toggle";

const theorySubjects = [
  { id: 'dbms', name: 'Database Management Systems', credits: 3 },
  { id: 'ppl', name: 'Principles of Programming Languages', credits: 3 },
  { id: 'se', name: 'Software Engineering', credits: 3 },
  { id: 'oe', name: 'Open Elective', credits: 3 },
];

const practicalSubjects = [
  { id: 'dbms_lab', name: 'DBMS Lab', credits: 1 },
  { id: 'ppl_lab', name: 'PPL Lab', credits: 1 },
  { id: 'wt', name: 'Web Technology', credits: 2 },
  { id: 'os', name: 'Operating Systems Workshop', credits: 2 },
  { id: 'pcpd', name: 'PCPD', credits: 2 },
];

const marksToGradePoint = (marks: number, maxMarks: number) => {
  return Math.ceil((marks / maxMarks) * 10);
};

const gradeFromPoint = (point: number) => {
  if (point >= 10) return "O";
  if (point === 9) return "A+";
  if (point === 8) return "A";
  if (point === 7) return "B+";
  if (point === 6) return "B";
  if (point === 5) return "P";
  return "F";
};

export function SGPAPredictor() {
  const [theoryMarks, setTheoryMarks] = useState<Record<string, { cie: number, ete: number }>>({});
  const [practicalMarks, setPracticalMarks] = useState<Record<string, number>>({});
  const [fyCgpa, setFyCgpa] = useState<string>("");
  const [sem3Sgpa, setSem3Sgpa] = useState<string>("");
  
  const [calculatedSGPA, setCalculatedSGPA] = useState<number | null>(null);
  const [calculatedCGPA, setCalculatedCGPA] = useState<number | null>(null);
  const [resultsData, setResultsData] = useState<any[]>([]);

  const handleTheoryChange = (id: string, field: 'cie' | 'ete', val: number) => {
    setTheoryMarks(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: val }
    }));
  };

  const handlePracticalChange = (id: string, val: number) => {
    setPracticalMarks(prev => ({ ...prev, [id]: val }));
  };

  const calculateSGPA = () => {
    let totalPoints = 0;
    let totalCredits = 20;
    const finalResults: { name: string; credits: number; marks: number; maxMarks: number; gp: number; grade: string; }[] = [];

    // Calculate Theory
    theorySubjects.forEach(sub => {
      const marks = theoryMarks[sub.id] || { cie: 0, ete: 0 };
      const totalParamsMarks = (Number(marks.cie) || 0) + (Number(marks.ete) || 0);
      const gp = marksToGradePoint(totalParamsMarks, 100);
      totalPoints += (gp * sub.credits);
      
      finalResults.push({
        name: sub.name,
        credits: sub.credits,
        marks: totalParamsMarks,
        maxMarks: 100,
        gp: gp,
        grade: gradeFromPoint(gp)
      });
    });

    // Calculate Practicals
    practicalSubjects.forEach(sub => {
      const marks = Number(practicalMarks[sub.id]) || 0;
      const gp = marksToGradePoint(marks, 50);
      totalPoints += (gp * sub.credits);

      finalResults.push({
        name: sub.name,
        credits: sub.credits,
        marks: marks,
        maxMarks: 50,
        gp: gp,
        grade: gradeFromPoint(gp)
      });
    });

    const sgpa = totalPoints / totalCredits;
    setCalculatedSGPA(sgpa);
    setResultsData(finalResults);

    // Calculate CGPA
    const fy = Number(fyCgpa) || 0;
    const sem3 = Number(sem3Sgpa) || 0;
    
    if (fy > 0 && sem3 > 0) {
      const overall = ((fy * 44) + (sem3 * 20) + (sgpa * 20)) / 84;
      setCalculatedCGPA(overall);
    } else {
      setCalculatedCGPA(null);
    }

    // Log to XAMPP formally
    try {
      fetch('http://localhost/scoresynth/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log_activity',
          action_type: 'SGPA_Prediction',
          details: `Calculated SGPA: ${sgpa.toFixed(2)}`
        })
      }).catch(e => console.error("XAMPP log_activity failed:", e));
    } catch (e) {
      console.error("XAMPP log_activity error:", e);
    }
  };

  const allMarksEntered = 
    theorySubjects.every(t => theoryMarks[t.id]?.cie !== undefined && theoryMarks[t.id]?.ete !== undefined) &&
    practicalSubjects.every(p => practicalMarks[p.id] !== undefined);

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/student">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sem 4 SGPA & CGPA Calculator</h1>
                <p className="text-sm text-muted-foreground">Calculate your predicted semester grades based on the new pattern</p>
              </div>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">1.</span>
                  <span>Theory marks are out of 100 (CIE 40 + ETE 60)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">2.</span>
                  <span>Practical/Term Work marks are out of 50</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">3.</span>
                  <span>Formula: GradePoint = Math.ceil((Marks / MaxMarks) * 10)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">4.</span>
                  <span>Enter First Year CGPA and Sem 3 SGPA for overall CGPA tracking</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grading System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><Badge>O (10)</Badge></div>
                <div className="flex items-center gap-2"><Badge>A+ (9)</Badge></div>
                <div className="flex items-center gap-2"><Badge>A (8)</Badge></div>
                <div className="flex items-center gap-2"><Badge>B+ (7)</Badge></div>
                <div className="flex items-center gap-2"><Badge>B (6)</Badge></div>
                <div className="flex items-center gap-2"><Badge>P (5)</Badge></div>
                <div className="flex items-center gap-2 col-span-2"><Badge variant="destructive">F (Fail)</Badge></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marks Entry */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Theory Subjects</CardTitle>
            <CardDescription>Enter CIE out of 40 and ETE out of 60</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {theorySubjects.map((subject) => (
                <div key={subject.id} className="grid md:grid-cols-4 gap-4 items-end p-4 bg-muted/40 rounded-lg border border-border">
                  <div className="md:col-span-2">
                    <Label className="text-foreground">{subject.name}</Label>
                    <p className="text-xs text-muted-foreground mt-1">Credits: {subject.credits}</p>
                  </div>
                  <div>
                    <Label>CIE (Max 40)</Label>
                    <Input
                      type="number"
                      min="0" max="40" placeholder="0-40"
                      value={theoryMarks[subject.id]?.cie ?? ''}
                      onChange={(e) => handleTheoryChange(subject.id, 'cie', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>ETE (Max 60)</Label>
                    <Input
                      type="number"
                      min="0" max="60" placeholder="0-60"
                      value={theoryMarks[subject.id]?.ete ?? ''}
                      onChange={(e) => handleTheoryChange(subject.id, 'ete', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Practicals / Term Work</CardTitle>
            <CardDescription>Enter marks out of 50</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {practicalSubjects.map((subject) => (
                <div key={subject.id} className="grid md:grid-cols-4 gap-4 items-end p-4 bg-muted/40 rounded-lg border border-border">
                  <div className="md:col-span-3">
                    <Label className="text-foreground">{subject.name}</Label>
                    <p className="text-xs text-muted-foreground mt-1">Credits: {subject.credits}</p>
                  </div>
                  <div>
                    <Label>Marks (Max 50)</Label>
                    <Input
                      type="number"
                      min="0" max="50" placeholder="0-50"
                      value={practicalMarks[subject.id] ?? ''}
                      onChange={(e) => handlePracticalChange(subject.id, parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Previous Results (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>First Year CGPA</Label>
                <Input type="number" step="0.01" placeholder="e.g 8.5" value={fyCgpa} onChange={(e) => setFyCgpa(e.target.value)} />
              </div>
              <div>
                <Label>Sem 3 SGPA</Label>
                <Input type="number" step="0.01" placeholder="e.g 8.2" value={sem3Sgpa} onChange={(e) => setSem3Sgpa(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <Button onClick={calculateSGPA} size="lg" className="w-full md:w-auto">
            <Calculator className="mr-2 h-5 w-5" />
            Calculate Final Output
          </Button>
        </div>

        {calculatedSGPA !== null && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                    <CardDescription className="text-blue-700 dark:text-blue-300 font-medium">Semester 4 SGPA</CardDescription>
                  </div>
                  <CardTitle className="text-5xl text-blue-900 dark:text-blue-100">{calculatedSGPA.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Semester Grade Point Average</p>
                </CardContent>
              </Card>

              {calculatedCGPA !== null && (
                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                      <CardDescription className="text-purple-700 dark:text-purple-300 font-medium">Overall CGPA</CardDescription>
                    </div>
                    <CardTitle className="text-5xl text-purple-900 dark:text-purple-100">{calculatedCGPA.toFixed(2)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Cumulative Grade Point Average</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Grade Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resultsData.map((res: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border border-border gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{res.name}</p>
                        <p className="text-sm text-muted-foreground">Credits: {res.credits}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-xl font-bold text-foreground">{res.marks}</p>
                        <p className="text-xs text-muted-foreground">/{res.maxMarks}</p>
                      </div>
                      <div className="text-center px-4">
                        <Badge variant={res.grade === 'F' ? 'destructive' : 'default'}>{res.grade}</Badge>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-xl font-bold text-primary">{res.gp}</p>
                        <p className="text-xs text-muted-foreground">GP</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">{(res.gp * res.credits).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Weighted</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary/20 mt-4 gap-4">
                    <div>
                      <p className="font-bold text-lg text-foreground">Total</p>
                      <p className="text-sm text-muted-foreground">Credits: 20</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">SGPA: {calculatedSGPA.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

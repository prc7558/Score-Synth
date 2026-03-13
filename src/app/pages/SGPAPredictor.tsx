import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";

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
    setTheoryMarks(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  };

  const handlePracticalChange = (id: string, val: number) => {
    setPracticalMarks(prev => ({ ...prev, [id]: val }));
  };

  const calculateSGPA = () => {
    let totalPoints = 0;
    let totalCredits = 20;
    const finalResults: { name: string; credits: number; marks: number; maxMarks: number; gp: number; grade: string; }[] = [];

    theorySubjects.forEach(sub => {
      const marks = theoryMarks[sub.id] || { cie: 0, ete: 0 };
      const totalParamsMarks = (Number(marks.cie) || 0) + (Number(marks.ete) || 0);
      const gp = marksToGradePoint(totalParamsMarks, 100);
      totalPoints += (gp * sub.credits);
      finalResults.push({ name: sub.name, credits: sub.credits, marks: totalParamsMarks, maxMarks: 100, gp, grade: gradeFromPoint(gp) });
    });

    practicalSubjects.forEach(sub => {
      const marks = Number(practicalMarks[sub.id]) || 0;
      const gp = marksToGradePoint(marks, 50);
      totalPoints += (gp * sub.credits);
      finalResults.push({ name: sub.name, credits: sub.credits, marks, maxMarks: 50, gp, grade: gradeFromPoint(gp) });
    });

    const sgpa = totalPoints / totalCredits;
    setCalculatedSGPA(sgpa);
    setResultsData(finalResults);

    const fy = Number(fyCgpa) || 0;
    const sem3 = Number(sem3Sgpa) || 0;
    if (fy > 0 && sem3 > 0) {
      setCalculatedCGPA(((fy * 44) + (sem3 * 20) + (sgpa * 20)) / 84);
    } else {
      setCalculatedCGPA(null);
    }

    try {
      fetch('http://localhost/scoresynth/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'log_activity', action_type: 'SGPA_Prediction', details: `Calculated SGPA: ${sgpa.toFixed(2)}` })
      }).catch(e => console.error("XAMPP log_activity failed:", e));
    } catch (e) {
      console.error("XAMPP log_activity error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/student"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-xl font-semibold">SGPA & CGPA Calculator</h1>
              <p className="text-sm text-muted-foreground">Semester 4 grade prediction</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <Card className="border">
            <CardHeader><CardTitle className="text-base">How It Works</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-1.5 text-sm text-muted-foreground">
                <li>1. Theory: CIE (40) + ETE (60) = 100</li>
                <li>2. Practicals: out of 50</li>
                <li>3. GP = ceil((Marks / Max) × 10)</li>
                <li>4. Enter FY CGPA + Sem 3 SGPA for cumulative</li>
              </ol>
            </CardContent>
          </Card>
          <Card className="border">
            <CardHeader><CardTitle className="text-base">Grading Scale</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <Badge variant="outline">O (10)</Badge>
                <Badge variant="outline">A+ (9)</Badge>
                <Badge variant="outline">A (8)</Badge>
                <Badge variant="outline">B+ (7)</Badge>
                <Badge variant="outline">B (6)</Badge>
                <Badge variant="outline">P (5)</Badge>
                <Badge variant="destructive">F</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border mb-5">
          <CardHeader>
            <CardTitle className="text-base">Theory Subjects</CardTitle>
            <CardDescription>CIE out of 40, ETE out of 60</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {theorySubjects.map((sub) => (
                <div key={sub.id} className="grid md:grid-cols-4 gap-3 items-end p-3 bg-muted/20 rounded-lg border">
                  <div className="md:col-span-2">
                    <Label>{sub.name}</Label>
                    <p className="text-xs text-muted-foreground">{sub.credits} credits</p>
                  </div>
                  <div>
                    <Label>CIE (40)</Label>
                    <Input type="number" min="0" max="40" placeholder="0-40" value={theoryMarks[sub.id]?.cie ?? ''} onChange={(e) => handleTheoryChange(sub.id, 'cie', parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <Label>ETE (60)</Label>
                    <Input type="number" min="0" max="60" placeholder="0-60" value={theoryMarks[sub.id]?.ete ?? ''} onChange={(e) => handleTheoryChange(sub.id, 'ete', parseFloat(e.target.value))} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border mb-5">
          <CardHeader>
            <CardTitle className="text-base">Practicals</CardTitle>
            <CardDescription>Out of 50</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {practicalSubjects.map((sub) => (
                <div key={sub.id} className="grid md:grid-cols-4 gap-3 items-end p-3 bg-muted/20 rounded-lg border">
                  <div className="md:col-span-3">
                    <Label>{sub.name}</Label>
                    <p className="text-xs text-muted-foreground">{sub.credits} credits</p>
                  </div>
                  <div>
                    <Label>Marks (50)</Label>
                    <Input type="number" min="0" max="50" placeholder="0-50" value={practicalMarks[sub.id] ?? ''} onChange={(e) => handlePracticalChange(sub.id, parseFloat(e.target.value))} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border mb-5">
          <CardHeader><CardTitle className="text-base">Previous Results (Optional)</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>FY CGPA</Label><Input type="number" step="0.01" placeholder="e.g 8.5" value={fyCgpa} onChange={(e) => setFyCgpa(e.target.value)} /></div>
              <div><Label>Sem 3 SGPA</Label><Input type="number" step="0.01" placeholder="e.g 8.2" value={sem3Sgpa} onChange={(e) => setSem3Sgpa(e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={calculateSGPA} size="lg" className="mb-6">
          <Calculator className="mr-2 h-5 w-5" /> Calculate
        </Button>

        {calculatedSGPA !== null && (
          <>
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              <Card className="border">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-primary" /><CardDescription>Sem 4 SGPA</CardDescription></div>
                  <CardTitle className="text-4xl">{calculatedSGPA.toFixed(2)}</CardTitle>
                </CardHeader>
              </Card>
              {calculatedCGPA !== null && (
                <Card className="border">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-primary" /><CardDescription>Overall CGPA</CardDescription></div>
                    <CardTitle className="text-4xl">{calculatedCGPA.toFixed(2)}</CardTitle>
                  </CardHeader>
                </Card>
              )}
            </div>

            <Card className="border">
              <CardHeader><CardTitle className="text-base">Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {resultsData.map((res: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium">{res.name}</p>
                        <p className="text-xs text-muted-foreground">{res.credits} credits</p>
                      </div>
                      <span className="text-sm px-3">{res.marks}/{res.maxMarks}</span>
                      <Badge variant={res.grade === 'F' ? 'destructive' : 'outline'} className="mx-2">{res.grade}</Badge>
                      <span className="font-semibold text-primary w-8 text-center">{res.gp}</span>
                      <span className="text-sm text-muted-foreground w-12 text-right">{(res.gp * res.credits).toFixed(0)} pts</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border mt-2">
                    <p className="font-semibold">Total (20 credits)</p>
                    <p className="text-xl font-bold text-primary">SGPA: {calculatedSGPA.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { ArrowLeft, TrendingUp, Users, Award, AlertCircle, Loader2, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

interface SubjectStat {
  name: string;
  average: string;
  highest: number;
  lowest: number;
  passRate: string;
}

interface TopStudent {
  rank: number;
  rollNumber: string;
  name: string;
  percentage: string;
  grade: string;
}

interface ParsedData {
  totalStudents: number;
  passCount: number;
  failCount: number;
  classAverage: number;
  topScore: number;
  subjectStats: SubjectStat[];
  gradeData: { grade: string; count: number }[];
  topStudents: TopStudent[];
}

const COLORS = ['#4a6fa5', '#6b9080', '#a37a74', '#8e7cc3', '#c4956a', '#7a8b99'];

export function Analytics() {
  const [searchParams] = useSearchParams();
  const sheetId = searchParams.get("sheetId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!sheetId) { setError("No Google Sheet ID provided."); setLoading(false); return; }
      const gasUrl = import.meta.env.VITE_GAS_WEB_APP_URL;
      if (!gasUrl) { setError("Missing VITE_GAS_WEB_APP_URL."); setLoading(false); return; }

      try {
        const response = await fetch(`${gasUrl}?sheetId=${sheetId}`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const json = await response.json();
        if (json.status !== "success") throw new Error(json.message || "Error from GAS.");
        parseSheetData(json.data as any[][]);
      } catch (err: any) {
        console.error("Error fetching analytics:", err);
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sheetId]);

  const parseSheetData = (fullData: any[][]) => {
    try {
      const headerRowIdx = 10;
      const dataStartIdx = 11;
      if (fullData.length <= dataStartIdx) throw new Error("Sheet contains no data.");

      const headers = fullData[headerRowIdx];
      let subjectStartIndex = 3;
      let emailIdx = headers.findIndex(h => typeof h === 'string' && h.toLowerCase().includes("email"));
      let subjectEndIndex = emailIdx === -1 ? headers.length : emailIdx;

      const studentRows = [];
      for (let i = dataStartIdx; i < fullData.length; i++) {
        if (fullData[i][0] === "") break;
        studentRows.push(fullData[i]);
      }

      const totalStudents = studentRows.length;
      if (totalStudents === 0) throw new Error("No students found.");

      const calcStartIdx = headers.findIndex(h => h === "Total");
      if (calcStartIdx === -1) throw new Error("Calculated columns not found.");

      const percentageIdx = calcStartIdx + 1;
      const gradeIdx = calcStartIdx + 2;
      const rankIdx = calcStartIdx + 3;

      let passCount = 0, failCount = 0, sumPercentage = 0, topScore = 0;
      const gradeDistribution: Record<string, number> = {};
      const topStudentsList: TopStudent[] = [];

      studentRows.forEach(row => {
        const grade = String(row[gradeIdx]);
        if (grade === "F" || grade === "ABSENT") failCount++; else passCount++;
        gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
        const perc = Number(row[percentageIdx]) || 0;
        sumPercentage += perc;
        if (perc > topScore) topScore = perc;
        topStudentsList.push({ rank: Number(row[rankIdx]) || 0, rollNumber: String(row[1]), name: String(row[2]), percentage: perc.toFixed(2), grade });
      });

      const classAverage = sumPercentage / totalStudents;
      const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({ grade, count }));
      topStudentsList.sort((a, b) => a.rank - b.rank);

      let summaryStartIdx = -1;
      for (let i = fullData.length - 1; i > dataStartIdx; i--) {
        if (fullData[i][0] === "Avg Marks") { summaryStartIdx = i; break; }
      }

      const subjectStats: SubjectStat[] = [];
      const numSubjects = subjectEndIndex - subjectStartIndex;

      if (summaryStartIdx !== -1) {
        for (let s = 0; s < numSubjects; s++) {
          const col = subjectStartIndex + s;
          const passCnt = Number(fullData[summaryStartIdx + 1][col]) || 0;
          const failCnt = Number(fullData[summaryStartIdx + 2][col]) || 0;
          const total = passCnt + failCnt;
          subjectStats.push({
            name: String(headers[col]),
            average: Number(fullData[summaryStartIdx][col]).toFixed(1),
            highest: Number(fullData[summaryStartIdx + 3][col]) || 0,
            lowest: Number(fullData[summaryStartIdx + 5][col]) || 0,
            passRate: total > 0 ? ((passCnt / total) * 100).toFixed(1) : "0.0"
          });
        }
      }

      setParsedData({ totalStudents, passCount, failCount, classAverage, topScore, subjectStats, gradeData, topStudents: topStudentsList.slice(0, 10) });
    } catch (e: any) {
      console.error("Parse error:", e);
      setError("Failed to parse data: " + e.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !parsedData) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Link to="/faculty" className="mb-6 inline-block"><Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button></Link>
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-12">
          <AlertCircle className="h-5 w-5" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/faculty"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-xl font-semibold">Analytics</h1>
              <p className="text-sm text-muted-foreground">Live data from Google Sheets</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => window.print()} title="Print this page"><Printer className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border"><CardHeader className="pb-2"><CardDescription className="flex items-center gap-1"><Users className="h-4 w-4" /> Students</CardDescription><CardTitle className="text-2xl">{parsedData.totalStudents}</CardTitle></CardHeader></Card>
          <Card className="border"><CardHeader className="pb-2"><CardDescription className="flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Pass Rate</CardDescription><CardTitle className="text-2xl">{((parsedData.passCount / parsedData.totalStudents) * 100).toFixed(1)}%</CardTitle></CardHeader></Card>
          <Card className="border"><CardHeader className="pb-2"><CardDescription>Class Avg</CardDescription><CardTitle className="text-2xl">{parsedData.classAverage.toFixed(1)}%</CardTitle></CardHeader></Card>
          <Card className="border"><CardHeader className="pb-2"><CardDescription className="flex items-center gap-1"><Award className="h-4 w-4" /> Top Score</CardDescription><CardTitle className="text-2xl">{parsedData.topScore.toFixed(1)}%</CardTitle></CardHeader></Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          <Card className="border">
            <CardHeader><CardTitle className="text-base">Subject Averages</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={parsedData.subjectStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={70} />
                  <YAxis /><Tooltip /><Legend />
                  <Bar dataKey="average" name="Avg %" fill="var(--primary)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader><CardTitle className="text-base">Grade Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={parsedData.gradeData} cx="50%" cy="50%" labelLine={false} label={({ grade, count }) => `${grade}: ${count}`} outerRadius={90} dataKey="count">
                    {parsedData.gradeData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Pass/Fail</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div><p className="text-sm text-muted-foreground">Passed</p><p className="text-2xl font-bold">{parsedData.passCount}</p></div>
                    <Badge>{((parsedData.passCount / parsedData.totalStudents) * 100).toFixed(1)}%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div><p className="text-sm text-muted-foreground">Failed</p><p className="text-2xl font-bold">{parsedData.failCount}</p></div>
                    <Badge variant="destructive">{((parsedData.failCount / parsedData.totalStudents) * 100).toFixed(1)}%</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Subject Pass Rates</p>
                  <div className="border rounded-lg">
                    {parsedData.subjectStats.map((sub, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 border-b last:border-0">
                        <span className="text-sm">{sub.name}</span>
                        <Badge variant="outline">{sub.passRate}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border mb-6">
          <CardHeader><CardTitle className="text-base">Top Students</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">%</TableHead>
                <TableHead className="text-right">Grade</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {parsedData.topStudents.map((s) => (
                  <TableRow key={s.rank}>
                    <TableCell className="font-semibold">
                      {s.rank === 1 && "🥇"}{s.rank === 2 && "🥈"}{s.rank === 3 && "🥉"}{s.rank > 3 && `#${s.rank}`}
                    </TableCell>
                    <TableCell>{s.rollNumber}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-right">{s.percentage}%</TableCell>
                    <TableCell className="text-right"><Badge variant="outline">{s.grade}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader><CardTitle className="text-base">Subject Statistics</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Avg</TableHead>
                <TableHead className="text-right">Highest</TableHead>
                <TableHead className="text-right">Lowest</TableHead>
                <TableHead className="text-right">Pass Rate</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {parsedData.subjectStats.map((sub, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell className="text-right">{sub.average}</TableCell>
                    <TableCell className="text-right">{sub.highest}</TableCell>
                    <TableCell className="text-right">{sub.lowest}</TableCell>
                    <TableCell className="text-right"><Badge variant={parseFloat(sub.passRate) >= 80 ? "default" : "secondary"}>{sub.passRate}%</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

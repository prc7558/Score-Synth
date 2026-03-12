import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { ArrowLeft, TrendingUp, Users, Award, AlertCircle, Loader2 } from "lucide-react";
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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Analytics() {
  const [searchParams] = useSearchParams();
  const sheetId = searchParams.get("sheetId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!sheetId) {
        setError("No Google Sheet ID provided in the URL.");
        setLoading(false);
        return;
      }

      const gasUrl = import.meta.env.VITE_GAS_WEB_APP_URL;
      if (!gasUrl) {
        setError("Missing VITE_GAS_WEB_APP_URL configuration.");
        setLoading(false);
        return;
      }

      try {
        const fetchUrl = `${gasUrl}?sheetId=${sheetId}`;
        const response = await fetch(fetchUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const json = await response.json();

        if (json.status !== "success") {
          throw new Error(json.message || "Unknown error from Google Apps Script.");
        }

        const data2D = json.data as any[][];
        parseSheetData(data2D);
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
      const headerRowIdx = 10; // Row 11
      const dataStartIdx = 11; // Row 12

      if (fullData.length <= dataStartIdx) throw new Error("Sheet contains no record data.");

      const headers = fullData[headerRowIdx];

      // Identify bounds
      let subjectStartIndex = 3; // Col D (index 3)
      let emailIdx = headers.findIndex(h => typeof h === 'string' && h.toLowerCase().includes("email"));
      let subjectEndIndex = emailIdx === -1 ? headers.length : emailIdx;

      // Extract Student Rows
      const studentRows = [];
      for (let i = dataStartIdx; i < fullData.length; i++) {
        if (fullData[i][0] === "") break; // End of student records
        studentRows.push(fullData[i]);
      }

      const totalStudents = studentRows.length;
      if (totalStudents === 0) throw new Error("No students found in the dataset.");

      // The structure from standard analyzeScores: Total, Percentage, Grade, Rank are appended at the end
      const calcStartIdx = headers.findIndex(h => h === "Total");
      if (calcStartIdx === -1) throw new Error("Calculated columns (Total, Percentage) not found in header.");

      const percentageIdx = calcStartIdx + 1;
      const gradeIdx = calcStartIdx + 2;
      const rankIdx = calcStartIdx + 3;

      // Aggregate basic stats
      let passCount = 0;
      let failCount = 0;
      let sumPercentage = 0;
      let topScore = 0;
      const gradeDistribution: Record<string, number> = {};
      const topStudentsList: TopStudent[] = [];

      studentRows.forEach(row => {
        // Grades/PassFail
        const grade = String(row[gradeIdx]);
        if (grade === "F") failCount++;
        else passCount++;

        gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;

        // Averages
        const perc = Number(row[percentageIdx]) || 0;
        sumPercentage += perc;
        if (perc > topScore) topScore = perc;

        // Collect for top 10
        topStudentsList.push({
          rank: Number(row[rankIdx]) || 0,
          rollNumber: String(row[1]),
          name: String(row[2]),
          percentage: perc.toFixed(2),
          grade: grade
        });
      });

      const classAverage = sumPercentage / totalStudents;
      const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({ grade, count }));

      // Sort and slice top 10
      topStudentsList.sort((a, b) => a.rank - b.rank);
      const top10 = topStudentsList.slice(0, 10);

      // Parse Summary Stats block from the bottom
      // Locating the Transposed Summary
      let summaryStartIdx = -1;
      for (let i = fullData.length - 1; i > dataStartIdx; i--) {
        if (fullData[i][0] === "Avg Marks") {
          summaryStartIdx = i;
          break;
        }
      }

      const subjectStats: SubjectStat[] = [];
      const numSubjects = subjectEndIndex - subjectStartIndex;

      if (summaryStartIdx !== -1) {
        // Row 0: Avg Marks, 1: Pass, 2: Fail, 3: Max, 4: Max Student, 5: Min, 6: Min Student
        for (let s = 0; s < numSubjects; s++) {
          const col = subjectStartIndex + s;
          const passCnt = Number(fullData[summaryStartIdx + 1][col]) || 0;
          const failCnt = Number(fullData[summaryStartIdx + 2][col]) || 0;
          const total = passCnt + failCnt;
          const passRate = total > 0 ? ((passCnt / total) * 100).toFixed(1) : "0.0";

          subjectStats.push({
            name: String(headers[col]),
            average: Number(fullData[summaryStartIdx][col]).toFixed(1),
            highest: Number(fullData[summaryStartIdx + 3][col]) || 0,
            lowest: Number(fullData[summaryStartIdx + 5][col]) || 0,
            passRate: passRate
          });
        }
      }

      setParsedData({
        totalStudents,
        passCount,
        failCount,
        classAverage,
        topScore,
        subjectStats,
        gradeData,
        topStudents: top10
      });

    } catch (e: any) {
      console.error("Parse error:", e);
      setError("Failed to parse sheet data. Is the format correct? " + e.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Analytics...</h2>
          <p className="text-gray-500">Fetching live data from Google Sheets.</p>
        </div>
      </div>
    );
  }

  if (error || !parsedData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Link to="/faculty" className="mb-6 inline-block">
          <Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
        </Link>
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-12 bg-white">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error Loading Analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/faculty">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
              <p className="text-sm text-gray-600">Live data from Google Sheets</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Students
              </CardDescription>
              <CardTitle className="text-3xl">{parsedData.totalStudents}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                Pass Rate
              </CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {((parsedData.passCount / parsedData.totalStudents) * 100).toFixed(1)}%
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Class Average</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {parsedData.classAverage.toFixed(1)}%
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-purple-600">
                <Award className="h-4 w-4" />
                Top Score
              </CardDescription>
              <CardTitle className="text-3xl text-purple-600">
                {parsedData.topScore.toFixed(1)}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Subject-wise Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Average Performance</CardTitle>
              <CardDescription>Average marks across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={parsedData.subjectStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#3b82f6" name="Average %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Number of students in each grade</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={parsedData.gradeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ grade, count }) => `${grade}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {parsedData.gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pass/Fail Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Pass/Fail Analysis</CardTitle>
              <CardDescription>Overall result distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Passed Students</p>
                      <p className="text-3xl font-bold text-green-600">{parsedData.passCount}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-600 text-white">
                        {((parsedData.passCount / parsedData.totalStudents) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Failed Students</p>
                      <p className="text-3xl font-bold text-red-600">{parsedData.failCount}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">
                        {((parsedData.failCount / parsedData.totalStudents) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium mb-2 text-gray-700">Subject-wise Pass Rate</p>
                  <div className="bg-white border rounded-md overflow-hidden pt-2 px-4 pb-2">
                    {parsedData.subjectStats.map((subject, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-gray-50">
                        <span className="text-sm font-medium">{subject.name}</span>
                        <Badge variant="outline">{subject.passRate}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 Students Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Students</CardTitle>
            <CardDescription>Class rank list based on overall performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Rank</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedData.topStudents.map((student) => (
                  <TableRow key={student.rank}>
                    <TableCell className="font-bold">
                      {student.rank === 1 && <span className="text-yellow-600 text-lg">🥇</span>}
                      {student.rank === 2 && <span className="text-gray-400 text-lg">🥈</span>}
                      {student.rank === 3 && <span className="text-orange-600 text-lg">🥉</span>}
                      {student.rank > 3 && <span>#{student.rank}</span>}
                    </TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-right font-semibold">{student.percentage}%</TableCell>
                    <TableCell className="text-right">
                      <Badge>{student.grade}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Subject Statistics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Detailed Statistics</CardTitle>
            <CardDescription>Comprehensive performance metrics for each subject</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Average Marks</TableHead>
                  <TableHead className="text-right">Highest Marks</TableHead>
                  <TableHead className="text-right">Lowest Marks</TableHead>
                  <TableHead className="text-right">Pass Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedData.subjectStats.map((subject, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell className="text-right">{subject.average}</TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">{subject.highest}</TableCell>
                    <TableCell className="text-right text-red-600">{subject.lowest}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={parseFloat(subject.passRate) >= 80 ? "default" : "secondary"}>
                        {subject.passRate}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { ArrowLeft, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { students, reportCards, subjects, marks, calculateGrade } from "../data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export function Analytics() {
  // Calculate subject-wise statistics
  const subjectStats = subjects.map(subject => {
    const subjectMarks = marks.filter(m => m.subject_id === subject.subject_id);
    const totalMarks = subjectMarks.reduce((sum, m) => sum + m.marks, 0);
    const avgMarks = totalMarks / subjectMarks.length;
    const avgPercentage = (avgMarks / 50) * 100;
    const maxMarks = Math.max(...subjectMarks.map(m => m.marks));
    const minMarks = Math.min(...subjectMarks.map(m => m.marks));
    const passCount = subjectMarks.filter(m => (m.marks / m.max_marks) * 100 >= 40).length;
    const passPercentage = (passCount / subjectMarks.length) * 100;

    return {
      name: subject.subject_name,
      average: avgPercentage.toFixed(1),
      highest: maxMarks,
      lowest: minMarks,
      passRate: passPercentage.toFixed(1),
    };
  });

  // Grade distribution
  const gradeDistribution = reportCards.reduce((acc, rc) => {
    acc[rc.grade] = (acc[rc.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Top 10 students
  const topStudents = reportCards
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)
    .map(rc => {
      const student = students.find(s => s.student_id === rc.student_id);
      return {
        rank: rc.rank,
        name: student?.name || '',
        rollNumber: student?.roll_number || '',
        percentage: rc.percentage.toFixed(2),
        grade: rc.grade,
      };
    });

  // Performance trend data (mock data for demonstration)
  const trendData = [
    { exam: 'UT1', average: 87.2 },
    { exam: 'CIE1', average: 85.5 },
    { exam: 'UT2', average: 88.9 },
  ];

  const passCount = reportCards.filter(rc => rc.pass_status === 'PASS').length;
  const failCount = reportCards.filter(rc => rc.pass_status === 'FAIL').length;

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
              <p className="text-sm text-gray-600">Comprehensive class performance insights</p>
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
              <CardTitle className="text-3xl">{students.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                Pass Rate
              </CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {((passCount / students.length) * 100).toFixed(1)}%
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Class Average</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {(reportCards.reduce((sum, rc) => sum + rc.percentage, 0) / reportCards.length).toFixed(1)}%
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
                {Math.max(...reportCards.map(rc => rc.percentage)).toFixed(1)}%
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
                <BarChart data={subjectStats}>
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
                    data={gradeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ grade, count }) => `${grade}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>Class average across exams</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exam" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="average" stroke="#10b981" strokeWidth={2} name="Class Average %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pass/Fail Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Pass/Fail Analysis</CardTitle>
              <CardDescription>Overall result distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Passed Students</p>
                    <p className="text-3xl font-bold text-green-600">{passCount}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-600 text-white">
                      {((passCount / students.length) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Failed Students</p>
                    <p className="text-3xl font-bold text-red-600">{failCount}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">
                      {((failCount / students.length) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-sm font-medium mb-2">Subject-wise Pass Rate</p>
                  {subjectStats.map((subject, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm">{subject.name}</span>
                      <Badge variant="outline">{subject.passRate}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 Students Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top 10 Students</CardTitle>
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
                {topStudents.map((student) => (
                  <TableRow key={student.rank}>
                    <TableCell className="font-bold">
                      {student.rank === 1 && <span className="text-yellow-600">🥇</span>}
                      {student.rank === 2 && <span className="text-gray-400">🥈</span>}
                      {student.rank === 3 && <span className="text-orange-600">🥉</span>}
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
                  <TableHead className="text-right">Average %</TableHead>
                  <TableHead className="text-right">Highest</TableHead>
                  <TableHead className="text-right">Lowest</TableHead>
                  <TableHead className="text-right">Pass Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectStats.map((subject, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell className="text-right">{subject.average}%</TableCell>
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

import { Link } from "react-router";
import { ArrowLeft, Download, Mail, FileText, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { students, reportCards, marks, subjects, exams } from "../data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useState } from "react";
import { toast } from "sonner";

export function ReportCards() {
  const [searchQuery, setSearchQuery] = useState("");

  // Combine student and report card data
  const reportData = reportCards.map(rc => {
    const student = students.find(s => s.student_id === rc.student_id);
    return {
      ...rc,
      student,
    };
  }).filter(data => 
    data.student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.student?.roll_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadReport = (studentName: string) => {
    toast.success(`Downloading report card for ${studentName}`);
  };

  const handleEmailReport = (studentName: string, email: string) => {
    toast.success(`Report card sent to ${email}`);
  };

  const handleEmailAll = () => {
    toast.success(`Sending report cards to all ${students.length} students...`);
  };

  const handleDownloadAll = () => {
    toast.success(`Downloading all ${students.length} report cards...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/faculty">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Report Cards</h1>
                <p className="text-sm text-gray-600">Generate and distribute student reports</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exam Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Exam Type:</span>
                  <span className="font-semibold">Unit Test 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Academic Year:</span>
                  <span className="font-semibold">TE (Third Year)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Students:</span>
                  <span className="font-semibold">{students.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleDownloadAll}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Download All</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Download all report cards as a ZIP file
              </p>
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download All PDFs
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleEmailAll}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Email All</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Send report cards to all students via email
              </p>
              <Button className="w-full" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Send All Emails
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Report Cards Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Report Cards</CardTitle>
            <CardDescription>Individual report card management</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Marks</TableHead>
                  <TableHead className="text-right">%</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((data) => {
                  const studentMarks = marks.filter(m => m.student_id === data.student_id);
                  const totalObtained = studentMarks.reduce((sum, m) => sum + m.marks, 0);
                  const totalMax = studentMarks.reduce((sum, m) => sum + m.max_marks, 0);

                  return (
                    <TableRow key={data.report_id}>
                      <TableCell className="font-bold">
                        {data.rank === 1 && <span>🥇</span>}
                        {data.rank === 2 && <span>🥈</span>}
                        {data.rank === 3 && <span>🥉</span>}
                        {data.rank > 3 && <span>#{data.rank}</span>}
                      </TableCell>
                      <TableCell>{data.student?.roll_number}</TableCell>
                      <TableCell className="font-medium">{data.student?.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">{data.student?.email}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold">{totalObtained}</span>
                        <span className="text-gray-500">/{totalMax}</span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{data.percentage.toFixed(1)}%</TableCell>
                      <TableCell className="text-center">
                        <Badge>{data.grade}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={data.pass_status === 'PASS' ? 'default' : 'destructive'}>
                          {data.pass_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDownloadReport(data.student?.name || '')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEmailReport(data.student?.name || '', data.student?.email || '')}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Report Template Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Report Card Template</CardTitle>
            <CardDescription>Preview of generated PDF report cards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white">
              <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 pb-4 border-b-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Score Synth</h2>
                  <p className="text-sm text-gray-600">Academic Report Card</p>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Student Name</p>
                    <p className="font-semibold">Parth Chaudhari</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Roll Number</p>
                    <p className="font-semibold">TE-001</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Academic Year</p>
                    <p className="font-semibold">Third Year (TE)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Exam Type</p>
                    <p className="font-semibold">Unit Test 1</p>
                  </div>
                </div>

                {/* Marks Table */}
                <div className="mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-2">Subject</th>
                        <th className="text-right p-2">Marks Obtained</th>
                        <th className="text-right p-2">Max Marks</th>
                        <th className="text-right p-2">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.slice(0, 3).map((subject) => (
                        <tr key={subject.subject_id} className="border-b">
                          <td className="p-2">{subject.subject_name}</td>
                          <td className="text-right p-2">48</td>
                          <td className="text-right p-2">50</td>
                          <td className="text-right p-2">O</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Total Marks</p>
                    <p className="text-lg font-bold">235/250</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Percentage</p>
                    <p className="text-lg font-bold text-blue-600">94.0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Grade</p>
                    <p className="text-lg font-bold text-green-600">O</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Rank</p>
                    <p className="text-lg font-bold text-purple-600">#1</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
                  Generated on March 11, 2026 | PANK Nexus
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

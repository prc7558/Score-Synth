import { ModeToggle } from "../components/mode-toggle";
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { ArrowLeft, Download, Mail, Search, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { toast } from "sonner";

interface StudentReport {
  rank: number;
  rollNumber: string;
  name: string;
  email: string;
  totalObtained: number;
  totalMax: number;
  percentage: string;
  grade: string;
  passStatus: string;
}

export function ReportCards() {
  const [searchParams] = useSearchParams();
  const sheetId = searchParams.get("sheetId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Data State
  const [reportData, setReportData] = useState<StudentReport[]>([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [examTypeInfo, setExamTypeInfo] = useState("Not specified in sheet");

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

        parseSheetData(json.data);
      } catch (err: any) {
        console.error("Error fetching report cards:", err);
        setError(err.message || "Failed to load report cards.");
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

      // Try to extract some global Exam Type info from cell C3 if it exists in standard template
      if (fullData[2] && fullData[2][2]) {
        setExamTypeInfo(fullData[2][2].toString());
      }

      const headers = fullData[headerRowIdx];

      // Identify bounds
      let subjectStartIndex = 3; // Col D (index 3)
      let emailIdx = headers.findIndex(h => typeof h === 'string' && h.toLowerCase().includes("email"));
      let subjectEndIndex = emailIdx === -1 ? headers.length : emailIdx;
      const numSubjects = subjectEndIndex - subjectStartIndex;
      const totalMaxMarks = numSubjects * 16; // 4 subjects * 16 marks = 64

      // Calc columns
      const calcStartIdx = headers.findIndex(h => h === "Total");
      if (calcStartIdx === -1) throw new Error("Calculated columns (Total, Percentage) not found in header.");

      const totalIdx = calcStartIdx;
      const percentageIdx = calcStartIdx + 1;
      const gradeIdx = calcStartIdx + 2;
      const rankIdx = calcStartIdx + 3;

      const parsedReports: StudentReport[] = [];

      for (let i = dataStartIdx; i < fullData.length; i++) {
        if (fullData[i][0] === "") break; // End of records

        const row = fullData[i];
        const grade = String(row[gradeIdx]);
        const passStatus = grade === "F" ? "FAIL" : "PASS";

        parsedReports.push({
          rank: Number(row[rankIdx]) || 0,
          rollNumber: String(row[1]),
          name: String(row[2]),
          email: emailIdx !== -1 ? String(row[emailIdx]) : "No Email",
          totalObtained: Number(row[totalIdx]) || 0,
          totalMax: totalMaxMarks,
          percentage: Number(row[percentageIdx]).toFixed(1),
          grade: grade,
          passStatus: passStatus
        });
      }

      parsedReports.sort((a, b) => a.rank - b.rank);
      setReportData(parsedReports);

    } catch (e: any) {
      console.error("Parse error:", e);
      setError("Failed to parse sheet data. Is the format correct? " + e.message);
    }
  };

  const executeSendEmails = async (targetRollNo?: string) => {
    const gasUrl = import.meta.env.VITE_GAS_WEB_APP_URL;
    if (!gasUrl) {
      toast.error("GAS URL not configured.");
      return;
    }

    setSendingEmail(true);
    const toastId = toast.loading(targetRollNo ? "Sending individual email..." : "Sending all emails in bulk...");

    try {
      const payload: any = {
        action: "sendEmails",
        sheetId: sheetId
      };
      if (targetRollNo) {
        payload.studentRollNo = targetRollNo;
      }

      const response = await fetch(gasUrl, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (json.status === "success") {
        toast.success(`Successfully sent ${json.sentCount} email(s)!`, { id: toastId });
      } else {
        throw new Error(json.message || "Failed to send emails via GAS.");
      }
    } catch (err: any) {
      console.error("Email error:", err);
      toast.error(`Email delivery failed: ${err.message}`, { id: toastId });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleEmailReport = (rollNumber: string, studentName: string) => {
    executeSendEmails(rollNumber);
  };

  const handleEmailAll = () => {
    executeSendEmails();
  };

  const handleDownloadAll = () => {
    toast.success(`Downloading visual report cards locally is a premium feature currently in development.`);
  };

  const handleDownloadReport = (studentName: string) => {
    toast.success(`Downloading PDF report for ${studentName} is in development.`);
  };

  // Filter 
  const filteredData = reportData.filter(data =>
    data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 dark:bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Student Reports...</h2>
          <p className="text-muted-foreground">Fetching live data from Google Sheets.</p>
        </div>
      </div>
    );
  }

  if (error || reportData.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 dark:bg-background p-8">
        <Link to="/faculty" className="mb-6 inline-block">
          <Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
        </Link>
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-12 bg-card">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error Loading Reports</AlertTitle>
          <AlertDescription>{error || "No student data found."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/faculty">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Report Cards</h1>
                <p className="text-sm text-muted-foreground">Generate and distribute student reports directly via Google Sheets</p>
              </div>
            </div>
          <ModeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Database Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exam Type:</span>
                  <span className="font-semibold">{examTypeInfo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Students:</span>
                  <span className="font-semibold">{reportData.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-70" onClick={handleDownloadAll}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Download All</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Download all visual report cards (Coming Soon)
              </p>
              <Button className="w-full" variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Download All PDFs
              </Button>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-lg transition-shadow ${sendingEmail ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} onClick={!sendingEmail ? handleEmailAll : undefined}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Email All</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Send report cards to all students via automated GAS emails
              </p>
              <Button className="w-full" variant="outline" disabled={sendingEmail}>
                {sendingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                {sendingEmail ? "Sending Setup..." : "Send All Emails"}
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
            <CardDescription>Individual report tracking and distribution</CardDescription>
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
                {filteredData.map((data) => {
                  return (
                    <TableRow key={data.rollNumber}>
                      <TableCell className="font-bold">
                        {data.rank === 1 && <span className="text-yellow-600">🥇</span>}
                        {data.rank === 2 && <span className="text-gray-400">🥈</span>}
                        {data.rank === 3 && <span className="text-orange-600">🥉</span>}
                        {data.rank > 3 && <span>#{data.rank}</span>}
                      </TableCell>
                      <TableCell>{data.rollNumber}</TableCell>
                      <TableCell className="font-medium">{data.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{data.email}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold">{data.totalObtained}</span>
                        <span className="text-muted-foreground">/{data.totalMax}</span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{data.percentage}%</TableCell>
                      <TableCell className="text-center">
                        <Badge>{data.grade}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={data.passStatus === 'PASS' ? 'default' : 'destructive'}>
                          {data.passStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            title="Coming Soon - Feature in Development."
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadReport(data.name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            title={`Send email directly to ${data.email}`}
                            size="sm"
                            variant="ghost"
                            disabled={sendingEmail}
                            onClick={() => handleEmailReport(data.rollNumber, data.name)}
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
      </div>
    </div>
  );
}

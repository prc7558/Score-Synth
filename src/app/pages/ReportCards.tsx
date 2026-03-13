import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { ArrowLeft, Download, Mail, Search, AlertCircle, Loader2, Printer } from "lucide-react";
import JSZip from "jszip";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Progress } from "../components/ui/progress";
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
  const [reportData, setReportData] = useState<StudentReport[]>([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailProgress, setEmailProgress] = useState(0);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [examTypeInfo, setExamTypeInfo] = useState("Not specified");

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
        parseSheetData(json.data);
      } catch (err: any) {
        console.error("Error fetching reports:", err);
        setError(err.message || "Failed to load.");
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
      if (fullData.length <= dataStartIdx) throw new Error("No data in sheet.");

      if (fullData[2] && fullData[2][2]) setExamTypeInfo(fullData[2][2].toString());

      const headers = fullData[headerRowIdx];
      let subjectStartIndex = 3;
      let emailIdx = headers.findIndex(h => typeof h === 'string' && h.toLowerCase().includes("email"));
      let subjectEndIndex = emailIdx === -1 ? headers.length : emailIdx;
      const numSubjects = subjectEndIndex - subjectStartIndex;
      const totalMaxMarks = numSubjects * 16;

      const calcStartIdx = headers.findIndex(h => h === "Total");
      if (calcStartIdx === -1) throw new Error("Calculated columns not found.");

      const totalIdx = calcStartIdx;
      const percentageIdx = calcStartIdx + 1;
      const gradeIdx = calcStartIdx + 2;
      const rankIdx = calcStartIdx + 3;

      const parsed: StudentReport[] = [];
      for (let i = dataStartIdx; i < fullData.length; i++) {
        if (fullData[i][0] === "") break;
        const row = fullData[i];
        const grade = String(row[gradeIdx]);
        parsed.push({
          rank: Number(row[rankIdx]) || 0,
          rollNumber: String(row[1]),
          name: String(row[2]),
          email: emailIdx !== -1 ? String(row[emailIdx]) : "N/A",
          totalObtained: Number(row[totalIdx]) || 0,
          totalMax: totalMaxMarks,
          percentage: Number(row[percentageIdx]).toFixed(1),
          grade,
          passStatus: grade === "F" ? "FAIL" : grade === "ABSENT" ? "ABSENT" : "PASS"
        });
      }
      parsed.sort((a, b) => a.rank - b.rank);
      setReportData(parsed);
    } catch (e: any) {
      console.error("Parse error:", e);
      setError("Parse failed: " + e.message);
    }
  };

  const executeSendEmails = async (targetRollNo?: string) => {
    const gasUrl = import.meta.env.VITE_GAS_WEB_APP_URL;
    if (!gasUrl) { toast.error("GAS URL not configured."); return; }

    setSendingEmail(true);
    setEmailProgress(0);

    const totalTarget = targetRollNo ? 1 : reportData.length;
    const interval = setInterval(() => {
      setEmailProgress(prev => {
        const next = prev + Math.max(1, Math.floor(90 / totalTarget));
        return next > 90 ? 90 : next;
      });
    }, 800);

    try {
      const payload: any = { action: "sendEmails", sheetId };
      if (targetRollNo) payload.studentRollNo = targetRollNo;

      const response = await fetch(gasUrl, { method: "POST", body: JSON.stringify(payload) });
      const json = await response.json();

      clearInterval(interval);
      setEmailProgress(100);

      if (json.status === "success") {
        toast.success(`Sent ${json.sentCount} email(s)!`);
      } else {
        throw new Error(json.message || "Failed to send.");
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error("Email error:", err);
      toast.error(`Failed: ${err.message}`);
    } finally {
      setTimeout(() => { setSendingEmail(false); setEmailProgress(0); }, 1500);
    }
  };

  const downloadPDF = async (rollNo: string, name: string) => {
    const gasUrl = import.meta.env.VITE_GAS_WEB_APP_URL;
    if (!gasUrl) { toast.error("GAS URL not configured."); return null; }

    setDownloading(rollNo);
    try {
      const response = await fetch(gasUrl, {
        method: "POST",
        body: JSON.stringify({ action: "downloadPDF", sheetId, studentRollNo: rollNo })
      });
      const json = await response.json();
      if (json.status !== "success" || !json.pdf) throw new Error(json.message || "Failed");

      const byteChars = atob(json.pdf);
      const byteArray = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}_Result.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${name}'s report`);
      return byteArray;
    } catch (err: any) {
      toast.error(`Download failed: ${err.message}`);
      return null;
    } finally {
      setDownloading(null);
    }
  };

  const downloadAllPDFs = async () => {
    const gasUrl = import.meta.env.VITE_GAS_WEB_APP_URL;
    if (!gasUrl) { toast.error("GAS URL not configured."); return; }

    setDownloadingAll(true);
    setDownloadProgress(0);
    const zip = new JSZip();
    let completed = 0;

    for (const student of reportData) {
      try {
        const response = await fetch(gasUrl, {
          method: "POST",
          body: JSON.stringify({ action: "downloadPDF", sheetId, studentRollNo: student.rollNumber })
        });
        const json = await response.json();
        if (json.status === "success" && json.pdf) {
          const byteChars = atob(json.pdf);
          const byteArray = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
          zip.file(`${student.name}_Result.pdf`, byteArray);
        }
      } catch (e) {
        console.error(`Failed for ${student.name}:`, e);
      }
      completed++;
      setDownloadProgress(Math.round((completed / reportData.length) * 100));
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "All_Report_Cards.zip";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${completed} report cards as ZIP`);
    setDownloadingAll(false);
    setDownloadProgress(0);
  };

  const filteredData = reportData.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error || reportData.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Link to="/faculty" className="mb-6 inline-block"><Button variant="ghost"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button></Link>
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-12">
          <AlertCircle className="h-5 w-5" /><AlertTitle>Error</AlertTitle><AlertDescription>{error || "No data found."}</AlertDescription>
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
              <h1 className="text-xl font-semibold">Report Cards</h1>
              <p className="text-sm text-muted-foreground">Manage and distribute</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => window.print()} title="Print this page"><Printer className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="border">
            <CardHeader><CardTitle className="text-base">Info</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Exam:</span><span className="font-medium">{examTypeInfo}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Students:</span><span className="font-medium">{reportData.length}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2"><Download className="h-4 w-4 text-primary" /><CardTitle className="text-base">Download All</CardTitle></div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">PDFs as ZIP</p>
              <Button className="w-full" variant="outline" disabled={downloadingAll} onClick={downloadAllPDFs}>
                {downloadingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {downloadingAll ? `${downloadProgress}%` : "Download"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><CardTitle className="text-base">Email All</CardTitle></div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Send reports via email</p>
              <Button className="w-full" variant="outline" disabled={sendingEmail} onClick={() => executeSendEmails()}>
                {sendingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                {sendingEmail ? "Sending..." : "Send All"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {sendingEmail && (
          <Card className="border mb-5">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm font-medium">Sending emails... {emailProgress}%</p>
              </div>
              <Progress value={emailProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Processing {reportData.length} students. Please don't close this page.</p>
            </CardContent>
          </Card>
        )}

        <Card className="border mb-5">
          <CardContent className="pt-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or roll number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base">Student Reports</CardTitle>
            <CardDescription>{filteredData.length} students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">Rank</TableHead>
                  <TableHead>Roll</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Marks</TableHead>
                  <TableHead className="text-right">%</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((d) => (
                  <TableRow key={d.rollNumber}>
                    <TableCell className="font-semibold">
                      {d.rank === 1 && "🥇"}{d.rank === 2 && "🥈"}{d.rank === 3 && "🥉"}{d.rank > 3 && `#${d.rank}`}
                    </TableCell>
                    <TableCell>{d.rollNumber}</TableCell>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.email}</TableCell>
                    <TableCell className="text-right"><span className="font-medium">{d.totalObtained}</span><span className="text-muted-foreground">/{d.totalMax}</span></TableCell>
                    <TableCell className="text-right font-medium">{d.percentage}%</TableCell>
                    <TableCell className="text-center"><Badge variant="outline">{d.grade}</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant={d.passStatus === 'PASS' ? 'default' : 'destructive'}>{d.passStatus}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" disabled={downloading === d.rollNumber} onClick={() => downloadPDF(d.rollNumber, d.name)}>
                          {downloading === d.rollNumber ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" disabled={sendingEmail} onClick={() => executeSendEmails(d.rollNumber)}><Mail className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

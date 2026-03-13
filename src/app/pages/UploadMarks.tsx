import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";

export function UploadMarks() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examType, setExamType] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedFileUrl, setGeneratedFileUrl] = useState("");
  const [generatedFileId, setGeneratedFileId] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !examType || !academicYear) {
      setErrorMessage("Please ensure all fields (Exam Type, Academic Year, and File) are filled.");
      setUploadStatus("error");
      return;
    }

    const gasUrl = import.meta.env.VITE_GAS_WEB_APP_URL;

    if (!gasUrl || gasUrl === 'YOUR_URL_HERE') {
      setErrorMessage("Please configure VITE_GAS_WEB_APP_URL in your .env file before uploading.");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("processing");
    setErrorMessage("");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress > 90) progress = 90;
      setUploadProgress(progress);
    }, 200);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        
        const payload = {
          filename: selectedFile.name,
          mimeType: selectedFile.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          base64: base64Data,
          examType,
          academicYear
        };

        const response = await fetch(gasUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        clearInterval(interval);
        
        if (response.ok) {
           const jsonResponse = await response.json();
           
           if (jsonResponse.status === 'success') {
             setGeneratedFileUrl(jsonResponse.fileUrl || "");
             setGeneratedFileId(jsonResponse.fileId || "");
             setUploadProgress(100);
             setUploadStatus("success");
             
             try {
               const gasDataResponse = await fetch(`${gasUrl}?sheetId=${jsonResponse.fileId}`);
               if (gasDataResponse.ok) {
                 const gasJson = await gasDataResponse.json();
                 if (gasJson.status === 'success' && gasJson.data) {
                   const fullData = gasJson.data;
                   const headerRowIdx = 10;
                   const dataStartIdx = 11;
                   
                   let marksToSave: any[] = [];
                   if (fullData.length > dataStartIdx && fullData[headerRowIdx]) {
                     const headers = fullData[headerRowIdx];
                     const calcStartIdx = headers.findIndex((h: any) => h === "Total");
                     
                     if(calcStartIdx !== -1) {
                         const totalIdx = calcStartIdx;
                         const percentageIdx = calcStartIdx + 1;
                         const gradeIdx = calcStartIdx + 2;
                         
                         for (let i = dataStartIdx; i < fullData.length; i++) {
                           if (fullData[i][0] === "") break;
                           const row = fullData[i];
                           if(row[1]) {
                               marksToSave.push({
                                 rollNo: String(row[1]),
                                 name: String(row[2]),
                                 sub1: Number(row[3]) || 0,
                                 sub2: Number(row[4]) || 0,
                                 sub3: Number(row[5]) || 0,
                                 sub4: Number(row[6]) || 0,
                                 total: Number(row[totalIdx]) || 0,
                                 percentage: Number(row[percentageIdx]) || 0,
                                 grade: String(row[gradeIdx]) || ''
                               });
                           }
                         }
                     }
                   }

                   fetch('http://localhost/scoresynth/api.php', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       action: 'save_upload',
                       filename: selectedFile.name,
                       status: 'Success',
                       marks: marksToSave
                     })
                   }).catch(e => console.error("XAMPP save_upload failed:", e));
                 }
               }
             } catch (e) {
               console.error("XAMPP save_upload error:", e);
             }

           } else {
             setErrorMessage(jsonResponse.message || "Apps script reported an internal error.");
             setUploadStatus("error");
           }
        } else {
           setErrorMessage(`Upload request failed with status: ${response.status}`);
           setUploadStatus("error");
        }
      } catch (error: any) {
        clearInterval(interval);
        console.error("Upload failed", error);
        setErrorMessage(error.message || "Failed to connect to Google Apps Script. Check network or CORS.");
        setUploadStatus("error");
      }
    };
    reader.onerror = () => {
       clearInterval(interval);
       setErrorMessage("Failed to read the selected file.");
       setUploadStatus("error");
    };
    
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/faculty"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-xl font-semibold">Upload Marks</h1>
              <p className="text-sm text-muted-foreground">Process student exam results</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Download Excel template from Faculty Dashboard</li>
                <li>2. Fill in student marks for all subjects</li>
                <li>3. Verify all data is accurate</li>
                <li>4. Save file in .xlsx format</li>
                <li>5. Select exam type and year below</li>
                <li>6. Upload the file</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base">Required Columns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {["Roll Number", "Student Name", "Email ID", "Subject Columns (marks)"].map((col, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    <span>{col}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {uploadStatus === "success" ? (
          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle>Processing Complete</CardTitle>
                  <CardDescription>Marks have been analyzed and saved</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {generatedFileUrl && (
                  <Button className="flex-1" onClick={() => window.open(generatedFileUrl, "_blank")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Open Sheet
                  </Button>
                )}
                <a href={`/analytics?sheetId=${generatedFileId}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full">View Analytics</Button>
                </a>
                <a href={`/reports?sheetId=${generatedFileId}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full">Manage Reports</Button>
                </a>
              </div>
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => { setUploadStatus("idle"); setSelectedFile(null); }}>
                Upload Another File
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border">
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Select exam details and upload Excel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger><SelectValue placeholder="Select exam type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit-test-1">Unit Test 1</SelectItem>
                    <SelectItem value="unit-test-2">Unit Test 2</SelectItem>
                    <SelectItem value="cie-1">CIE 1</SelectItem>
                    <SelectItem value="cie-2">CIE 2</SelectItem>
                    <SelectItem value="cie-3">CIE 3</SelectItem>
                    <SelectItem value="term-work">Term Work</SelectItem>
                    <SelectItem value="end-sem">End Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FY">First Year (FY)</SelectItem>
                    <SelectItem value="SY">Second Year (SY)</SelectItem>
                    <SelectItem value="TE">Third Year (TE)</SelectItem>
                    <SelectItem value="BE">Final Year (BE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Excel File</Label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-muted file:text-foreground"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {uploadStatus === "processing" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {uploadStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Upload Failed</AlertTitle>
                  <AlertDescription>{errorMessage || "Please check all fields and try again."}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button onClick={handleUpload} disabled={!selectedFile || !examType || !academicYear || uploadStatus === "processing"} className="flex-1">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
                <Link to="/faculty" className="flex-1">
                  <Button variant="outline" className="w-full">Cancel</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border mt-5">
          <CardHeader>
            <CardTitle className="text-base">After Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                "File is validated for format and integrity",
                "Totals, percentages, grades, and ranks are calculated",
                "Data is stored in the database",
                "PDF report cards are generated",
                "Reports are emailed to students"
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="bg-muted text-muted-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

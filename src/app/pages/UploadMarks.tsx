import { ModeToggle } from "../components/mode-toggle";
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
    // Start a fake progress while the file uploads
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress > 90) progress = 90; // cap at 90% until done
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
             
             // Fetch parsed marks from GAS and log to XAMPP formally
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

                   // Ping XAMPP with full data packet
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
    
    // Read the file as a data URL (base64)
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/faculty">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Upload Marks</h1>
              <p className="text-sm text-muted-foreground">Process student exam results</p>
            </div>
          </div>
        <ModeToggle />
          </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Instructions</CardTitle>
              <CardDescription>Follow these steps to upload marks</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">1.</span>
                  <span>Download the Excel template from the Faculty Dashboard</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">2.</span>
                  <span>Fill in student marks for all subjects</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">3.</span>
                  <span>Verify all data is accurate and complete</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">4.</span>
                  <span>Save the file in .xlsx format</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">5.</span>
                  <span>Select exam type and academic year</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">6.</span>
                  <span>Upload the file using the form</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle>Template Format</CardTitle>
              <CardDescription>Required columns in Excel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Roll Number</p>
                    <p className="text-xs text-muted-foreground">Student roll number</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Student Name</p>
                    <p className="text-xs text-muted-foreground">Full name</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Email ID</p>
                    <p className="text-xs text-muted-foreground">For report delivery</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 dark:bg-muted/20 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Subject Columns</p>
                    <p className="text-xs text-muted-foreground">Marks for each subject</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Form or Success View */}
        {uploadStatus === "success" ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <CardTitle>Processing Complete!</CardTitle>
                  <CardDescription>Marks have been successfully analyzed and saved.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 text-green-800 p-4 rounded-lg">
                <p className="text-sm font-medium">Next Steps Available:</p>
                <p className="text-sm mt-1">
                  You can now safely view the Google Sheet, explore the interactive analytics dashboard, or proceed to manage report cards.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {generatedFileUrl && (
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => window.open(generatedFileUrl, "_blank")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Open Analysis Sheet
                  </Button>
                )}
                <a href={`/analytics?sheetId=${generatedFileId}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50 hover:text-purple-700">
                    <AlertCircle className="mr-2 h-4 w-4" /> {/* Replacing BarChart placeholder */}
                    View Analytics
                  </Button>
                </a>
                <a href={`/reports?sheetId=${generatedFileId}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    <FileSpreadsheet className="mr-2 h-4 w-4" /> {/* Replacing FileText placeholder */}
                    Manage Reports
                  </Button>
                </a>
              </div>

              <div className="pt-4 border-t">
                 <Button variant="ghost" onClick={() => {
                   setUploadStatus("idle");
                   setSelectedFile(null);
                 }} className="w-full text-muted-foreground">
                   Upload Another File
                 </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Upload Marks File</CardTitle>
              <CardDescription>Select exam details and upload the Excel file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exam Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="exam-type">Exam Type</Label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger id="exam-type">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
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

              {/* Academic Year Selection */}
              <div className="space-y-2">
                <Label htmlFor="academic-year">Academic Year</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger id="academic-year">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FY">First Year (FY)</SelectItem>
                    <SelectItem value="SY">Second Year (SY)</SelectItem>
                    <SelectItem value="TE">Third Year (TE)</SelectItem>
                    <SelectItem value="BE">Final Year (BE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">Excel File</Label>
                <div className="flex items-center gap-4">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="flex-1 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Upload Progress */}
              {uploadStatus === "processing" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {uploadStatus === "error" && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Upload Failed</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {errorMessage || "Please ensure all fields are filled and a valid Excel file is selected."}
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !examType || !academicYear || uploadStatus === "processing"}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload and Process
                </Button>
                <Link to="/faculty" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>What Happens After Upload?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">File Validation</p>
                  <p className="text-muted-foreground">Excel file is validated for format and data integrity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">Result Calculation</p>
                  <p className="text-muted-foreground">Total marks, percentage, grades, and ranks are calculated</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Database Storage</p>
                  <p className="text-muted-foreground">All data is securely stored in the database</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="font-medium">Report Generation</p>
                  <p className="text-muted-foreground">PDF report cards are generated for each student</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <p className="font-medium">Email Distribution</p>
                  <p className="text-muted-foreground">Report cards are automatically sent to student email addresses</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

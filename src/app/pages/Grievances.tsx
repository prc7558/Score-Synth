import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

export function Grievances() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmitGrievance = () => {
    if (!subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubject("");
    setMessage("");
    toast.success("Grievance submitted successfully!");

    try {
      fetch('http://localhost/scoresynth/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_grievance', subject, message })
      }).catch(e => console.error("XAMPP save_grievance failed:", e));
    } catch (e) {
      console.error("XAMPP save_grievance error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/student"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-xl font-semibold">Submit Grievance</h1>
              <p className="text-sm text-muted-foreground">Report result discrepancies</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Card className="border">
          <CardHeader>
            <CardTitle>New Grievance</CardTitle>
            <CardDescription>Describe the issue with your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="e.g., Data Structures marks discrepancy" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Describe the issue in detail..." rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
              <p className="text-xs text-muted-foreground">Include exam name, subject, and specific concerns</p>
            </div>
            <Button onClick={handleSubmitGrievance}><Send className="mr-2 h-4 w-4" /> Submit</Button>
          </CardContent>
        </Card>

        <Card className="border mt-5">
          <CardHeader><CardTitle className="text-base">Guidelines</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Mention exam type and subject name</li>
              <li>• Provide specific details about the discrepancy</li>
              <li>• Include expected vs. received marks</li>
              <li>• Be professional in communication</li>
              <li>• Reviews typically take 3-5 working days</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

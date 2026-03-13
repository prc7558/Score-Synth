import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { grievances as initialGrievances, students } from "../data/mockData";
import { toast } from "sonner";

export function FacultyGrievances() {
  const [grievances, setGrievances] = useState(initialGrievances);

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setGrievances(prev => prev.map(g =>
      g.grievance_id === id ? { ...g, status: newStatus } : g
    ));
    toast.success(`Status updated to ${newStatus}`);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    if (status === 'In Progress') return 'default';
    if (status === 'Resolved') return 'outline';
    return 'secondary';
  };

  const pendingCount = grievances.filter(g => g.status === 'Pending').length;
  const inProgressCount = grievances.filter(g => g.status === 'In Progress').length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/faculty"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-xl font-semibold">Student Grievances</h1>
              <p className="text-sm text-muted-foreground">Review and manage queries</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1"><Clock className="h-4 w-4" /> Pending</CardDescription>
              <CardTitle className="text-2xl">{pendingCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1"><AlertCircle className="h-4 w-4" /> In Progress</CardDescription>
              <CardTitle className="text-2xl">{inProgressCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Resolved</CardDescription>
              <CardTitle className="text-2xl">{resolvedCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="border">
          <CardHeader>
            <CardTitle>All Grievances</CardTitle>
            <CardDescription>Track and manage student submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {grievances.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No grievances submitted</p>
                </div>
              ) : (
                grievances.map((g) => {
                  const student = students.find(s => s.student_id === g.student_id);
                  return (
                    <Card key={g.grievance_id} className="border">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">{g.subject}</CardTitle>
                              <Badge variant={getStatusVariant(g.status)}>{g.status}</Badge>
                            </div>
                            <CardDescription>{student?.name} ({student?.roll_number}) • {g.submitted_date}</CardDescription>
                          </div>
                          <Select value={g.status} onValueChange={(val) => handleUpdateStatus(g.grievance_id, val)}>
                            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{g.message}</p>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

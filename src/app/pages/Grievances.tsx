import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, MessageSquare, Send, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { grievances as initialGrievances, students } from "../data/mockData";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function Grievances() {
  const [grievances, setGrievances] = useState(initialGrievances);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmitGrievance = () => {
    if (!subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    const newGrievance = {
      grievance_id: grievances.length + 1,
      student_id: 1, // Current student (Parth)
      subject,
      message,
      status: 'Pending',
      submitted_date: new Date().toISOString().split('T')[0],
    };

    setGrievances([newGrievance, ...grievances]);
    setSubject("");
    setMessage("");
    toast.success("Grievance submitted successfully!");
  };

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setGrievances(prev => prev.map(g => 
      g.grievance_id === id ? { ...g, status: newStatus } : g
    ));
    toast.success(`Grievance status updated to ${newStatus}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'In Progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'In Progress':
        return 'default';
      case 'Resolved':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const pendingCount = grievances.filter(g => g.status === 'Pending').length;
  const inProgressCount = grievances.filter(g => g.status === 'In Progress').length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/student">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grievance System</h1>
              <p className="text-sm text-gray-600">Submit and track result queries</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                Pending
              </CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{pendingCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                In Progress
              </CardDescription>
              <CardTitle className="text-3xl text-blue-600">{inProgressCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Resolved
              </CardDescription>
              <CardTitle className="text-3xl text-green-600">{resolvedCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="submit">Submit Grievance</TabsTrigger>
            <TabsTrigger value="view">View All Grievances</TabsTrigger>
          </TabsList>

          {/* Submit Grievance Tab */}
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Grievance</CardTitle>
                <CardDescription>Report any discrepancies or issues with your results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="grievance-subject">Subject / Title</Label>
                  <Input
                    id="grievance-subject"
                    placeholder="e.g., Data Structures marks discrepancy"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grievance-message">Detailed Message</Label>
                  <Textarea
                    id="grievance-message"
                    placeholder="Describe the issue in detail. Include exam name, subject, and specific concerns..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Be specific and include all relevant details for faster resolution
                  </p>
                </div>

                <Button onClick={handleSubmitGrievance} size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Grievance
                </Button>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Grievance Submission Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Clearly mention the exam type and subject name</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Provide specific details about the discrepancy</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Include your expected marks vs. received marks</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Be respectful and professional in your communication</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Grievances are typically reviewed within 3-5 working days</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* View Grievances Tab */}
          <TabsContent value="view">
            <Card>
              <CardHeader>
                <CardTitle>All Grievances</CardTitle>
                <CardDescription>Track the status of submitted grievances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grievances.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No grievances submitted yet</p>
                    </div>
                  ) : (
                    grievances.map((grievance) => {
                      const student = students.find(s => s.student_id === grievance.student_id);
                      return (
                        <Card key={grievance.grievance_id} className="border-l-4 border-l-blue-500">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <CardTitle className="text-lg">{grievance.subject}</CardTitle>
                                  <Badge 
                                    variant={getStatusVariant(grievance.status)}
                                    className="flex items-center gap-1"
                                  >
                                    {getStatusIcon(grievance.status)}
                                    {grievance.status}
                                  </Badge>
                                </div>
                                <CardDescription>
                                  Submitted by {student?.name} ({student?.roll_number}) on {grievance.submitted_date}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Select
                                  value={grievance.status}
                                  onValueChange={(value) => handleUpdateStatus(grievance.grievance_id, value)}
                                >
                                  <SelectTrigger className="w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{grievance.message}</p>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Faculty Response Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">Grievance Received</p>
                  <p className="text-gray-600">Your grievance is logged in the system with "Pending" status</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">Faculty Review</p>
                  <p className="text-gray-600">Faculty reviews your submission and updates status to "In Progress"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Verification</p>
                  <p className="text-gray-600">Your answer sheet is re-evaluated or marks are verified</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="font-medium">Resolution</p>
                  <p className="text-gray-600">Status is updated to "Resolved" and you'll be notified via email</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { GraduationCap, Users, BarChart3, FileText, Calendar, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Score Synth</h1>
                <p className="text-sm text-gray-600">Automated Academic Report Generation & Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Academic Result Processing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automate result processing, generate report cards, and gain valuable insights
            with our comprehensive academic management platform.
          </p>
        </div>

        {/* Portal Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-500">
            <Link to="/faculty">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Faculty Portal</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Upload marks, generate reports, and view comprehensive analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Upload student marks via Excel</li>
                  <li>• Generate and distribute report cards</li>
                  <li>• View class performance analytics</li>
                  <li>• Manage grievances</li>
                </ul>
                <Button className="w-full mt-4" size="lg">
                  Access Faculty Dashboard
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-500">
            <Link to="/student">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <GraduationCap className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Student Portal</CardTitle>
                </div>
                <CardDescription className="text-base">
                  View report cards, predict SGPA/CGPA, and submit grievances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• View your report cards</li>
                  <li>• Predict SGPA and CGPA</li>
                  <li>• Submit result grievances</li>
                  <li>• Check academic calendar</li>
                </ul>
                <Button className="w-full mt-4" size="lg" variant="outline">
                  Access Student Dashboard
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Platform Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Report Generation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Automated PDF report card generation with grades, ranks, and performance metrics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Comprehensive performance analytics with subject-wise statistics and trends
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-pink-600" />
                  </div>
                  <CardTitle>Grievance System</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Students can submit result discrepancies and track resolution status
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <Calendar className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>Academic Calendar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Track exam schedules, result declarations, and important academic dates
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>SGPA/CGPA Predictor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Students can predict their semester and cumulative grade point averages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Multi-Exam Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Support for Unit Tests, CIE, Term Work, and End Semester examinations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Developed by PANK Nexus</h3>
          <div className="flex flex-wrap justify-center gap-6 text-gray-700">
            <span>Parth Chaudhari</span>
            <span>•</span>
            <span>Animish Deo</span>
            <span>•</span>
            <span>Niraj Fegade</span>
            <span>•</span>
            <span>Khilesh Chaudhari</span>
          </div>
          <p className="text-sm text-gray-600 mt-4">March 11, 2026</p>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router";
import { GraduationCap, Users, BarChart3, FileText, Calendar, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ModeToggle } from "../components/mode-toggle";

export function Home() {
  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Score Synth</h1>
              <p className="text-sm text-muted-foreground">Automated Academic Report Generation & Analytics</p>
            </div>
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Transform Academic Result Processing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Automate result processing, generate report cards, and gain valuable insights
            with our comprehensive academic management platform.
          </p>
        </div>

        {/* Portal Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group">
            <Link to="/faculty" className="block h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-200 dark:bg-blue-800 p-3 rounded-lg group-hover:bg-blue-300 dark:group-hover:bg-blue-700 transition-colors">
                    <Users className="h-8 w-8 text-blue-700 dark:text-blue-200" />
                  </div>
                  <CardTitle className="text-2xl text-blue-950 dark:text-blue-50">Faculty Portal</CardTitle>
                </div>
                <CardDescription className="text-base text-blue-800 dark:text-blue-200">
                  Upload marks, generate reports, and view comprehensive analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-900 dark:text-blue-100/80">
                  <li>• Upload student marks via Excel</li>
                  <li>• Generate and distribute report cards</li>
                  <li>• View class performance analytics</li>
                  <li>• Manage grievances</li>
                </ul>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white border-0" size="lg">
                  Access Faculty Dashboard
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group">
            <Link to="/student" className="block h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-emerald-200 dark:bg-emerald-800 p-3 rounded-lg group-hover:bg-emerald-300 dark:group-hover:bg-emerald-700 transition-colors">
                    <GraduationCap className="h-8 w-8 text-emerald-700 dark:text-emerald-200" />
                  </div>
                  <CardTitle className="text-2xl text-emerald-950 dark:text-emerald-50">Student Portal</CardTitle>
                </div>
                <CardDescription className="text-base text-emerald-800 dark:text-emerald-200">
                  View report cards, predict SGPA/CGPA, and submit grievances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-emerald-900 dark:text-emerald-100/80">
                  <li>• View your report cards</li>
                  <li>• Predict SGPA and CGPA</li>
                  <li>• Submit result grievances</li>
                  <li>• Check academic calendar</li>
                </ul>
                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white border-0" size="lg">
                  Access Student Dashboard
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Platform Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-200 dark:bg-purple-800 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                  </div>
                  <CardTitle className="text-purple-950 dark:text-purple-100">Report Generation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-800 dark:text-purple-200/80">
                  Automated PDF report card generation with grades, ranks, and performance metrics
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-200 dark:bg-orange-800 p-2 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-orange-700 dark:text-orange-300" />
                  </div>
                  <CardTitle className="text-orange-950 dark:text-orange-100">Analytics Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-800 dark:text-orange-200/80">
                  Comprehensive performance analytics with subject-wise statistics and trends
                </p>
              </CardContent>
            </Card>

            <Card className="bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-pink-200 dark:bg-pink-800 p-2 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-pink-700 dark:text-pink-300" />
                  </div>
                  <CardTitle className="text-pink-950 dark:text-pink-100">Grievance System</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-pink-800 dark:text-pink-200/80">
                  Students can submit result discrepancies and track resolution status
                </p>
              </CardContent>
            </Card>

            <Card className="bg-teal-100 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-teal-200 dark:bg-teal-800 p-2 rounded-lg">
                    <Calendar className="h-6 w-6 text-teal-700 dark:text-teal-300" />
                  </div>
                  <CardTitle className="text-teal-950 dark:text-teal-100">Academic Calendar</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-teal-800 dark:text-teal-200/80">
                  Track exam schedules, result declarations, and important academic dates
                </p>
              </CardContent>
            </Card>

            <Card className="bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-200 dark:bg-indigo-800 p-2 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
                  </div>
                  <CardTitle className="text-indigo-950 dark:text-indigo-100">SGPA/CGPA Predictor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-indigo-800 dark:text-indigo-200/80">
                  Students can predict their semester and cumulative grade point averages
                </p>
              </CardContent>
            </Card>

            <Card className="bg-sky-100 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-sky-200 dark:bg-sky-800 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-sky-700 dark:text-sky-300" />
                  </div>
                  <CardTitle className="text-sky-950 dark:text-sky-100">Multi-Exam Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-sky-800 dark:text-sky-200/80">
                  Support for Unit Tests, CIE, Term Work, and End Semester examinations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-card rounded-xl shadow-lg border border-border p-8 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-4">Developed by PANK Nexus</h3>
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground font-medium">
            <span>Parth Chaudhari</span>
            <span className="opacity-50">•</span>
            <span>Animish Deo</span>
            <span className="opacity-50">•</span>
            <span>Niraj Fegade</span>
            <span className="opacity-50">•</span>
            <span>Khilesh Chaudhari</span>
          </div>
          <p className="text-sm text-muted-foreground/80 mt-6">March 2026</p>
        </div>
      </section>
    </div>
  );
}

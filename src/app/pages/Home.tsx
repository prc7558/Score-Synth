import { Link } from "react-router";
import { GraduationCap, Users, BarChart3, FileText, Calendar, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function Home() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/mmcoe_logo.png" alt="MMCOE" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h1 className="text-lg font-semibold text-foreground leading-tight">Score Synth</h1>
              <p className="text-xs text-muted-foreground">MMCOE Academic Report System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-5 text-sm">
            <button onClick={() => scrollTo('about')} className="text-muted-foreground hover:text-foreground transition-colors">About</button>
            <button onClick={() => scrollTo('features')} className="text-muted-foreground hover:text-foreground transition-colors">Features</button>
            <button onClick={() => scrollTo('portals')} className="text-muted-foreground hover:text-foreground transition-colors">Portals</button>
            <button onClick={() => scrollTo('team')} className="text-muted-foreground hover:text-foreground transition-colors">Team</button>
          </div>
        </div>
      </nav>

      <section
        id="about"
        style={{
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          backgroundImage: 'url(/hero_academic.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '350px',
          border: '1.7px solid #092a8fff',
        }}
        className="relative flex items-center justify-center"
      >
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-2 tracking-tight drop-shadow-md">
            <span style={{ color: '#CD1C18' }}>Score</span>{' '}
            <span style={{ color: '#13518e' }}>Synth</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 drop-shadow-sm">Academic Result Processing</h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Upload marks, generate reports, view analytics & manage academic results - all in one place.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6">

        <section id="features" className="py-10">
          <h3 className="text-xl font-semibold text-center text-foreground mb-6">Features</h3>
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              { icon: FileText, title: "Report Generation", desc: "Auto-generate PDF report cards with grades and ranks" },
              { icon: BarChart3, title: "Analytics", desc: "Subject-wise performance statistics and visualizations" },
              { icon: MessageSquare, title: "Grievance System", desc: "Submit and track result discrepancies" },
              { icon: Calendar, title: "Academic Calendar", desc: "Exam schedules and important dates" },
              { icon: GraduationCap, title: "SGPA Predictor", desc: "Calculate predicted semester grades" },
              { icon: Users, title: "Multi-Exam Support", desc: "Unit tests, CIE, term work, and end semester exams" },
            ].map((f, i) => (
              <Card key={i} className="border">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <f.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{f.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="portals" className="py-10">
          <h3 className="text-xl font-semibold text-center text-foreground mb-6">Choose Your Portal</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="border hover:border-primary/40 transition-colors">
              <Link to="/faculty" className="block h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <Users className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">Faculty Portal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
                    <li>   </li><li>   </li><li>   </li>
                    <li>Upload student marks via Excel</li>
                    <li>Generate and email report cards</li>
                    <li>View class performance analytics</li>
                  </ul>
                  <Button className="w-full" size="lg">Open Faculty Dashboard</Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="border hover:border-primary/40 transition-colors">
              <Link to="/student" className="block h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">Student Portal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
                    <li>   </li><li>   </li><li>   </li>
                    <li>View your report cards</li>
                    <li>Predict SGPA and CGPA</li>
                    <li>Submit result grievances</li>
                  </ul>
                  <Button className="w-full" size="lg">Open Student Dashboard</Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </section>

        <section id="team" className="pb-14">
          <div className="bg-card border rounded-xl p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-3">Developed by PANK Nexus</h3>
            <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
              <span>Parth Chaudhari</span>
              <span className="opacity-40">•</span>
              <span>Animish Deo</span>
              <span className="opacity-40">•</span>
              <span>Niraj Fegade</span>
              <span className="opacity-40">•</span>
              <span>Khilesh Chaudhari</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">Marathwada Mitra Mandal's College of Engineering, Pune</p>
            <p className="text-sm text-muted-foreground mt-1">March 2026</p>
          </div>
        </section>
      </main>
    </div>
  );
}

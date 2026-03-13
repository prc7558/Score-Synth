import { Link } from "react-router";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, AreaChart, Area
} from "recharts";

const staticSubjectsData = [
  { name: 'DBMS', full: 'Database Management', type: 'Theory', marks: 80, max: 100, classAvg: 72 },
  { name: 'PPL', full: 'Principles of Programming', type: 'Theory', marks: 70, max: 100, classAvg: 68 },
  { name: 'SE', full: 'Software Engineering', type: 'Theory', marks: 85, max: 100, classAvg: 75 },
  { name: 'OE', full: 'Open Elective', type: 'Theory', marks: 75, max: 100, classAvg: 78 },
  { name: 'DBMS L', full: 'DBMS Lab', type: 'Practical', marks: 84, max: 100, classAvg: 80 },
  { name: 'PPL L', full: 'PPL Lab', type: 'Practical', marks: 76, max: 100, classAvg: 75 },
  { name: 'WT', full: 'Web Technology', type: 'Practical', marks: 90, max: 100, classAvg: 85 },
  { name: 'OS', full: 'Operating Systems', type: 'Practical', marks: 80, max: 100, classAvg: 82 },
  { name: 'PCPD', full: 'PCPD', type: 'Practical', marks: 96, max: 100, classAvg: 88 }
];

const historicalTrend = [
  { semester: 'Sem 1', sgpa: 7.95, cgpa: 7.95 },
  { semester: 'Sem 2', sgpa: 8.10, cgpa: 8.02 },
  { semester: 'Sem 3', sgpa: 8.42, cgpa: 8.15 },
  { semester: 'Sem 4', sgpa: 8.55, cgpa: 8.25 },
];

export function StudentAnalytics() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/student"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-xl font-semibold">Performance Analytics</h1>
              <p className="text-sm text-muted-foreground">Academic progress overview</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription>CGPA</CardDescription>
              <CardTitle className="text-3xl">8.25</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +0.10</p></CardContent>
          </Card>
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription>Rank</CardDescription>
              <CardTitle className="text-3xl">12<span className="text-lg text-muted-foreground">/60</span></CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Top 20%</p></CardContent>
          </Card>
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription>Best Subject</CardDescription>
              <CardTitle className="text-xl">PCPD</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">O (10 GP)</p></CardContent>
          </Card>
          <Card className="border">
            <CardHeader className="pb-2">
              <CardDescription>Needs Work</CardDescription>
              <CardTitle className="text-xl">PPL</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">B+ (7 GP)</p></CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base">Marks vs Class Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staticSubjectsData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="marks" name="You" fill="var(--primary)" radius={[3, 3, 0, 0]} barSize={16} />
                    <Bar dataKey="classAvg" name="Class Avg" fill="var(--border)" radius={[3, 3, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base">SGPA / CGPA Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="semester" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} domain={['dataMin - 0.5', 10]} />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="sgpa" name="SGPA" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} strokeWidth={2} />
                    <Line type="monotone" dataKey="cgpa" name="CGPA" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-base">Skill Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={staticSubjectsData.filter(s => s.type === 'Theory')}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="marks" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Subject Mastery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staticSubjectsData.slice(0, 5).map((sub, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-28 truncate text-sm font-medium" title={sub.full}>{sub.full}</div>
                    <div className="flex-1 ml-3">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${sub.marks}%` }}></div>
                      </div>
                    </div>
                    <div className="w-12 text-right ml-3 text-sm text-muted-foreground">{sub.marks}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

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
  { name: 'DBMS L', full: 'DBMS Lab', type: 'Practical', marks: 84, max: 100, classAvg: 80 }, // normalized to 100
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/student">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
              <p className="text-sm text-gray-600">Visual breakdown of your academic journey</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardDescription className="text-indigo-100 font-medium">Current CGPA</CardDescription>
              <CardTitle className="text-4xl">8.25</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-indigo-100 flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1"/> +0.10 from last sem
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-500 font-medium">Rank in Class</CardDescription>
              <CardTitle className="text-4xl text-gray-900">12<span className="text-2xl text-gray-400">/60</span></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600 flex items-center mt-2 font-medium">
                Top 20%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-500 font-medium">Strongest Subject</CardDescription>
              <CardTitle className="text-2xl text-gray-900 truncate">PCPD</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mt-2">
                Grade: O (10 GP)
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-500 font-medium">Needs Attention</CardDescription>
              <CardTitle className="text-2xl text-gray-900 truncate">PPL</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mt-2">
                Grade: B+ (7 GP)
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Marks vs Class Average (Bar) */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Subject Performance vs Class Average</CardTitle>
              <CardDescription>Normalized out of 100 for comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staticSubjectsData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                    <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend wrapperStyle={{paddingTop: '20px'}} />
                    <Bar dataKey="marks" name="Your Marks (%)" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="classAvg" name="Class Avg (%)" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* SGPA/CGPA Historical Trend (Area/Line) */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Historical Academic Trend</CardTitle>
              <CardDescription>SGPA and CGPA progression across semesters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="semester" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} domain={['dataMin - 0.5', 10]} />
                    <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend wrapperStyle={{paddingTop: '10px'}} />
                    <Area type="monotone" dataKey="sgpa" name="SGPA" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSgpa)" />
                    <Line type="monotone" dataKey="cgpa" name="CGPA" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Skill Radar */}
          <Card className="shadow-sm lg:col-span-1">
            <CardHeader>
              <CardTitle>Skill Matrix</CardTitle>
              <CardDescription>Strength in different domains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={staticSubjectsData.filter(s => s.type === 'Theory')}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Student" dataKey="marks" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Performance Table */}
          <Card className="shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Subject Mastery</CardTitle>
              <CardDescription>Detailed breakdown of your individual subject strengths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staticSubjectsData.slice(0, 5).map((sub, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-32 truncate font-medium text-sm text-gray-900" title={sub.full}>{sub.full}</div>
                    <div className="flex-1 ml-4">
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${sub.marks >= 85 ? 'bg-green-500' : sub.marks >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                          style={{ width: `${sub.marks}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right ml-4 text-sm font-semibold text-gray-700">{sub.marks}%</div>
                  </div>
                ))}
                <p className="text-center text-sm text-gray-500 mt-4 pt-4 border-t">Showing top 5 subjects. Keep up the good work!</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

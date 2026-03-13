import { Link } from "react-router";
import { ArrowLeft, Calendar as CalendarIcon, Clock, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { calendarEvents } from "../data/mockData";

export function AcademicCalendar() {
  const getEventIcon = (type: string) => {
    if (type === 'result') return <Clock className="h-4 w-4" />;
    if (type === 'unit-test' || type === 'cie' || type === 'end-sem') return <FileText className="h-4 w-4" />;
    return <CalendarIcon className="h-4 w-4" />;
  };

  const getEventTypeLabel = (type: string) => {
    if (type === 'unit-test') return 'Unit Test';
    if (type === 'cie') return 'CIE';
    if (type === 'end-sem') return 'End Semester';
    if (type === 'result') return 'Result';
    return 'Event';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  };

  const upcomingEvents = calendarEvents.filter(e => isUpcoming(e.date));
  const pastEvents = calendarEvents.filter(e => !isUpcoming(e.date));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/student"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-xl font-semibold">Academic Calendar</h1>
              <p className="text-sm text-muted-foreground">Exam schedules and dates</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border"><CardHeader className="pb-2"><CardDescription>Total</CardDescription><CardTitle className="text-2xl">{calendarEvents.length}</CardTitle></CardHeader></Card>
          <Card className="border"><CardHeader className="pb-2"><CardDescription>Upcoming</CardDescription><CardTitle className="text-2xl">{upcomingEvents.length}</CardTitle></CardHeader></Card>
          <Card className="border"><CardHeader className="pb-2"><CardDescription>Unit Tests</CardDescription><CardTitle className="text-2xl">{calendarEvents.filter(e => e.type === 'unit-test').length}</CardTitle></CardHeader></Card>
          <Card className="border"><CardHeader className="pb-2"><CardDescription>CIE Exams</CardDescription><CardTitle className="text-2xl">{calendarEvents.filter(e => e.type === 'cie').length}</CardTitle></CardHeader></Card>
        </div>

        <Card className="border mb-6">
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                        </div>
                        <Badge variant="outline">{getEventTypeLabel(event.type)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border mb-6">
          <CardHeader>
            <CardTitle>Past Events</CardTitle>
          </CardHeader>
          <CardContent>
            {pastEvents.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">No past events</p>
            ) : (
              <div className="space-y-3">
                {pastEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border opacity-60">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                        </div>
                        <Badge variant="outline">{getEventTypeLabel(event.type)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Arrive 15 minutes before scheduled exam time</li>
              <li>• Carry student ID card for all exams</li>
              <li>• Results declared 10-15 days after exam</li>
              <li>• Check email for updates and notifications</li>
              <li>• Grievances can be submitted within 7 days of results</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

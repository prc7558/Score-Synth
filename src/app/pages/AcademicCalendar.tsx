import { ModeToggle } from "../components/mode-toggle";
import { Link } from "react-router";
import { ArrowLeft, Calendar as CalendarIcon, Clock, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { calendarEvents } from "../data/mockData";

export function AcademicCalendar() {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'unit-test':
      case 'cie':
      case 'end-sem':
        return <FileText className="h-5 w-5" />;
      case 'result':
        return <Clock className="h-5 w-5" />;
      default:
        return <CalendarIcon className="h-5 w-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'unit-test':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cie':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'end-sem':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'result':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-muted text-gray-700 border-border';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'unit-test':
        return 'Unit Test';
      case 'cie':
        return 'CIE';
      case 'end-sem':
        return 'End Semester';
      case 'result':
        return 'Result Declaration';
      default:
        return 'Event';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  const upcomingEvents = calendarEvents.filter(e => isUpcoming(e.date));
  const pastEvents = calendarEvents.filter(e => !isUpcoming(e.date));

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/student">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Academic Calendar</h1>
              <p className="text-sm text-muted-foreground">Exam schedules and important dates</p>
            </div>
          </div>
        <ModeToggle />
          </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="text-2xl">{calendarEvents.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Upcoming</CardDescription>
              <CardTitle className="text-2xl text-blue-600">{upcomingEvents.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Unit Tests</CardDescription>
              <CardTitle className="text-2xl text-purple-600">
                {calendarEvents.filter(e => e.type === 'unit-test').length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>CIE Exams</CardDescription>
              <CardTitle className="text-2xl text-orange-600">
                {calendarEvents.filter(e => e.type === 'cie').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Important dates and examination schedules</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming events scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${getEventColor(event.type)}`}
                  >
                    <div className={`p-3 rounded-lg ${getEventColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-sm opacity-80">{formatDate(event.date)}</p>
                        </div>
                        <Badge variant="outline">
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      <p className="text-sm">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Events */}
        <Card>
          <CardHeader>
            <CardTitle>Past Events</CardTitle>
            <CardDescription>Completed examinations and results</CardDescription>
          </CardHeader>
          <CardContent>
            {pastEvents.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No past events</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-muted/50 dark:bg-muted/20 opacity-75"
                  >
                    <div className="p-3 rounded-lg bg-secondary text-muted-foreground">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                        </div>
                        <Badge variant="outline" className="bg-card">
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span className="text-sm">Unit Test</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500"></div>
                <span className="text-sm">CIE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-sm">End Semester</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-sm">Results</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted/50 dark:bg-muted/200"></div>
                <span className="text-sm">Other</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Please arrive 15 minutes before the scheduled exam time</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Carry your student ID card for all examinations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Results are typically declared 10-15 days after the examination</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Check your email regularly for updates and notifications</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Grievances can be submitted within 7 days of result declaration</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

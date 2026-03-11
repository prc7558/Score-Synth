import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { subjects, gradeToPoint } from "../data/mockData";

interface SubjectGrade {
  subject_id: number;
  predicted_marks: number;
  grade: string;
  grade_point: number;
}

export function SGPAPredictor() {
  const [subjectGrades, setSubjectGrades] = useState<SubjectGrade[]>(
    subjects.map(s => ({
      subject_id: s.subject_id,
      predicted_marks: 0,
      grade: '',
      grade_point: 0,
    }))
  );
  const [previousSGPA, setPreviousSGPA] = useState<string>("");
  const [calculatedSGPA, setCalculatedSGPA] = useState<number | null>(null);
  const [calculatedCGPA, setCalculatedCGPA] = useState<number | null>(null);

  const calculateGradeFromMarks = (marks: number): string => {
    const percentage = marks; // Assuming marks are out of 100
    if (percentage >= 90) return 'O';
    if (percentage >= 80) return 'A+';
    if (percentage >= 70) return 'A';
    if (percentage >= 60) return 'B+';
    if (percentage >= 50) return 'B';
    if (percentage >= 40) return 'P';
    return 'F';
  };

  const handleMarksChange = (subjectId: number, marks: number) => {
    setSubjectGrades(prev => prev.map(sg => {
      if (sg.subject_id === subjectId) {
        const grade = calculateGradeFromMarks(marks);
        const gradePoint = gradeToPoint[grade] || 0;
        return {
          ...sg,
          predicted_marks: marks,
          grade,
          grade_point: gradePoint,
        };
      }
      return sg;
    }));
  };

  const calculateSGPA = () => {
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const weightedSum = subjectGrades.reduce((sum, sg) => {
      const subject = subjects.find(s => s.subject_id === sg.subject_id);
      return sum + (sg.grade_point * (subject?.credits || 0));
    }, 0);

    const sgpa = weightedSum / totalCredits;
    setCalculatedSGPA(sgpa);

    // Calculate CGPA if previous SGPA is provided
    if (previousSGPA) {
      const prevSGPA = parseFloat(previousSGPA);
      const cgpa = (prevSGPA + sgpa) / 2; // Simplified CGPA calculation
      setCalculatedCGPA(cgpa);
    }
  };

  const allMarksEntered = subjectGrades.every(sg => sg.predicted_marks > 0);

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
              <h1 className="text-2xl font-bold text-gray-900">SGPA/CGPA Predictor</h1>
              <p className="text-sm text-gray-600">Calculate your predicted semester grades</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">1.</span>
                  <span>Enter your predicted marks for End Semester exams (out of 100)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">2.</span>
                  <span>System calculates grade for each subject</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">3.</span>
                  <span>SGPA is calculated using: ΣSGPA = (Credit × Grade Point) / Total Credits</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600">4.</span>
                  <span>Enter previous semester SGPA to calculate CGPA</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grading System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge>O (10)</Badge>
                  <span className="text-gray-600">90-100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>A+ (9)</Badge>
                  <span className="text-gray-600">80-89%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>A (8)</Badge>
                  <span className="text-gray-600">70-79%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>B+ (7)</Badge>
                  <span className="text-gray-600">60-69%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>B (6)</Badge>
                  <span className="text-gray-600">50-59%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>P (5)</Badge>
                  <span className="text-gray-600">40-49%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">F (0)</Badge>
                  <span className="text-gray-600">Below 40%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marks Entry */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Enter Predicted End Semester Marks</CardTitle>
            <CardDescription>Enter expected marks out of 100 for each subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject) => {
                const sg = subjectGrades.find(s => s.subject_id === subject.subject_id);
                return (
                  <div key={subject.subject_id} className="grid md:grid-cols-5 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                    <div className="md:col-span-2">
                      <Label>{subject.subject_name}</Label>
                      <p className="text-xs text-gray-600">Credits: {subject.credits}</p>
                    </div>
                    <div>
                      <Label htmlFor={`marks-${subject.subject_id}`}>Predicted Marks</Label>
                      <Input
                        id={`marks-${subject.subject_id}`}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={sg?.predicted_marks || ''}
                        onChange={(e) => handleMarksChange(subject.subject_id, parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Grade</Label>
                      <div className="h-10 flex items-center">
                        {sg?.grade && (
                          <Badge variant={sg.grade === 'F' ? 'destructive' : 'default'}>
                            {sg.grade}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Grade Point</Label>
                      <div className="h-10 flex items-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {sg?.grade_point || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Previous SGPA Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Previous Semester SGPA (Optional)</CardTitle>
            <CardDescription>Enter your previous semester SGPA to calculate CGPA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Label htmlFor="previous-sgpa">Previous SGPA</Label>
              <Input
                id="previous-sgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="0.00 - 10.00"
                value={previousSGPA}
                onChange={(e) => setPreviousSGPA(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Calculate Button */}
        <div className="mb-6">
          <Button
            onClick={calculateSGPA}
            disabled={!allMarksEntered}
            size="lg"
            className="w-full md:w-auto"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calculate SGPA/CGPA
          </Button>
        </div>

        {/* Results */}
        {calculatedSGPA !== null && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <CardDescription className="text-blue-100">Predicted SGPA</CardDescription>
                </div>
                <CardTitle className="text-5xl">{calculatedSGPA.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-100">Semester Grade Point Average</p>
              </CardContent>
            </Card>

            {calculatedCGPA !== null && (
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <CardDescription className="text-purple-100">Predicted CGPA</CardDescription>
                  </div>
                  <CardTitle className="text-5xl">{calculatedCGPA.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-100">Cumulative Grade Point Average</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Subject-wise Breakdown */}
        {calculatedSGPA !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Grade Breakdown</CardTitle>
              <CardDescription>Detailed analysis of your predicted performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subjects.map((subject) => {
                  const sg = subjectGrades.find(s => s.subject_id === subject.subject_id);
                  return (
                    <div key={subject.subject_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{subject.subject_name}</p>
                        <p className="text-sm text-gray-600">Credits: {subject.credits}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-2xl font-bold">{sg?.predicted_marks}</p>
                        <p className="text-xs text-gray-600">Marks</p>
                      </div>
                      <div className="text-center px-4">
                        <Badge variant={sg?.grade === 'F' ? 'destructive' : 'default'}>
                          {sg?.grade}
                        </Badge>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-xl font-bold text-blue-600">{sg?.grade_point}</p>
                        <p className="text-xs text-gray-600">GP</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {((sg?.grade_point || 0) * subject.credits).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600">Weighted</p>
                      </div>
                    </div>
                  );
                })}
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div>
                    <p className="font-bold text-lg">Total</p>
                    <p className="text-sm text-gray-600">Total Credits: {subjects.reduce((sum, s) => sum + s.credits, 0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      SGPA: {calculatedSGPA.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

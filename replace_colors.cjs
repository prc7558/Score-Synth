const fs = require('fs');
const path = require('path');
const files = ['UploadMarks.tsx', 'ReportCards.tsx', 'Grievances.tsx', 'Analytics.tsx', 'AcademicCalendar.tsx'];

files.forEach(file => {
  const p = path.join('src/app/pages', file);
  let c = fs.readFileSync(p, 'utf8');
  
  c = c.replace(/min-h-screen bg-gray-50/g, 'min-h-screen bg-muted/30 dark:bg-background');
  c = c.replace(/bg-white/g, 'bg-card');
  c = c.replace(/text-gray-900/g, 'text-foreground');
  c = c.replace(/text-gray-800/g, 'text-foreground');
  c = c.replace(/text-gray-600/g, 'text-muted-foreground');
  c = c.replace(/text-gray-500/g, 'text-muted-foreground');
  c = c.replace(/bg-gray-50/g, 'bg-muted/50 dark:bg-muted/20');
  c = c.replace(/bg-gray-100/g, 'bg-muted');
  c = c.replace(/bg-gray-200/g, 'bg-secondary');
  c = c.replace(/border-gray-200/g, 'border-border');
  c = c.replace(/border-gray-100/g, 'border-border/50');
  
  if(!c.includes('ModeToggle')) {
    c = 'import { ModeToggle } from "../components/mode-toggle";\n' + c;
  }
  
  c = c.replace(/<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">/g, '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">');
  
  // Target the div holding <p className="text-sm text-muted-foreground">...</p></div></div> to insert ModeToggle.
  c = c.replace(/(<p className="text-sm text-muted-foreground">.*?<\/p>\s*<\/div>\s*<\/div>\s*)/g, '$1<ModeToggle />\n          ');
  
  fs.writeFileSync(p, c);
});
console.log('Cards converted');

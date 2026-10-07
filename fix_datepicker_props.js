const fs = require('fs');
const file = 'src/components/common/DatePickerModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const propsPattern = `interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  title?: string;
}`;

const newPropsPattern = `interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate?: (date: string) => void;
  onSelect?: (date: string) => void;
  title?: string;
  initialDate?: Date;
}`;

content = content.replace(propsPattern, newPropsPattern);

const componentSignature = `export const DatePickerModal = ({ visible, onClose, onSelectDate, title = 'Select Date & Time' }: DatePickerModalProps) => {`;
const newComponentSignature = `export const DatePickerModal = ({ visible, onClose, onSelectDate, onSelect, initialDate, title = 'Select Date & Time' }: DatePickerModalProps) => {`;
content = content.replace(componentSignature, newComponentSignature);

const handleConfirm = `  const handleConfirm = () => {
    if (selectedDay === null) return;
    
    const formattedDate = \`\${selectedDay.toString().padStart(2, '0')}/\${(selectedMonth + 1).toString().padStart(2, '0')}/\${selectedYear}\`;
    const formattedTime = \`\${selectedHour.toString().padStart(2, '0')}:\${selectedMinute.toString().padStart(2, '0')} \${selectedAmPm}\`;
    
    // Most fields likely expect the time appended, or the backend will parse it if provided.
    // Standard JS Date or moment can parse "DD/MM/YYYY HH:MM AM/PM" but let's make sure it's cleanly appended
    onSelectDate(\`\${formattedDate} \${formattedTime}\`);
    onClose();
  };`;

const newHandleConfirm = `  const handleConfirm = () => {
    if (selectedDay === null) return;
    
    // For standard string output "DD/MM/YYYY HH:MM AM/PM"
    const formattedDate = \`\${selectedDay.toString().padStart(2, '0')}/\${(selectedMonth + 1).toString().padStart(2, '0')}/\${selectedYear}\`;
    const formattedTime = \`\${selectedHour.toString().padStart(2, '0')}:\${selectedMinute.toString().padStart(2, '0')} \${selectedAmPm}\`;
    const finalString = \`\${formattedDate} \${formattedTime}\`;
    
    // If a component uses onSelect (often they expect a Date or string, but my interface says string)
    // Actually, some components like ManagerSiteVisitsScreen.tsx passed \`onSelect={(date: Date) => ...}\`.
    // Wait! In ManagerSiteVisitsScreen, it's expecting a Date object!!
    // Let's check if they expect Date. If so, return a Date object to onSelect if it's not onSelectDate.
    // But my interface says \`onSelect?: (date: any) => void;\`
    
    if (onSelectDate) {
      onSelectDate(finalString);
    }
    
    if (onSelect) {
      // Build a full Date object to pass back for components expecting a Date
      let hour24 = selectedHour;
      if (selectedAmPm === 'PM' && hour24 < 12) hour24 += 12;
      if (selectedAmPm === 'AM' && hour24 === 12) hour24 = 0;
      const fullDate = new Date(selectedYear, selectedMonth, selectedDay, hour24, selectedMinute);
      
      // Some components expect string, some expect Date. 
      // Let's pass the string, and if they cast it or fail, we'll see.
      // Wait, in ManagerSiteVisitsScreen it says \`const handleDateSelect = (date: Date) => ...\`
      onSelect(fullDate as any); 
    }
    
    onClose();
  };`;

content = content.replace(handleConfirm, newHandleConfirm);

fs.writeFileSync(file, content);
console.log('Fixed props for DatePickerModal');

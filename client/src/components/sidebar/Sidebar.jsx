import { useLocation } from "react-router-dom";

const steps = [
  { label: "บริการ", path: "/Selectservice" },
  { label: "วันและเวลา", path: "/Selectdatetime" },
  { label: "ข้อมูล", path: "/Userfrom" },
  { label: "สรุปข้อมูล", path: "/Summary" },
];

const StepperSidebar = () => {
  const location = useLocation();
  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );

  return (
    <div
      className="md:w-1/4 bg-blue-900 text-white p-6 
     rounded-b-3xl md:rounded-r-3xl md:rounded-b-none 
     md:min-h-screen h-auto"
    >
      <h2 className="text-xl font-bold mb-8 text-center">นัดหมายกับคลินิก</h2>

      <ol className="space-y-6">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <li key={step.path} className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-200
                  ${
                    isActive
                      ? "bg-white text-blue-900 border-white"
                      : isCompleted
                      ? "bg-green-500 text-white border-green-500"
                      : "border-white text-white"
                  }`}
              >
                {isCompleted ? "✔" : index + 1}
              </div>

              <span
                className={`text-sm md:text-base transition-all duration-200 
                  ${isActive ? "font-bold text-white" : "text-white/70"}`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default StepperSidebar;

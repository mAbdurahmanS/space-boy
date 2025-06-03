import { useState } from "react";

export default function Tooltip({ children, content }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 
                        px-3 py-2 text-xs text-[#F8EDFF] bg-[#1B1A55] 
                        border border-[#F8E559] rounded shadow-lg max-w-[200px] text-center whitespace-pre-line"
        >
          {content}
        </div>
      )}
    </div>
  );
}

import React from 'react';

interface DialogProps {
  title: string;
  message: string;
  onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
      <div className="relative mx-auto my-6 w-auto max-w-sm">
        <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
            <h3 className="text-3xl font-semibold">{title}</h3>
            <button
              className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <div className="relative flex-auto p-6">
            <p className="my-4 text-lg leading-relaxed text-slate-500">{message}</p>
          </div>
          <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
            <button
              className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
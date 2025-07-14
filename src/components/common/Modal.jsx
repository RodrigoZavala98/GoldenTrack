import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 diff bg-base-100 aspect-16/9 z-50 flex justify-center items-center p-4">
            <div className="bg-base-300 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="btn btn-ghost btn-square btn-sm">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
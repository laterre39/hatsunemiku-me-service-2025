"use client";

import { useState, type ReactNode } from 'react';

interface InfoModalProps {
  children: ReactNode;
  title: string;
  content: string;
  tooltipText: string;
  modalClassName?: string;
  tailClassName?: string;
  className?: string;
}

export function InfoModal({
  children,
  title,
  content,
  tooltipText,
  modalClassName = "absolute bottom-full mb-2 w-64 bg-white p-4 rounded-lg shadow-lg text-gray-800 z-50",
  tailClassName = "absolute top-full left-3 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white",
  className
}: InfoModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsTooltipVisible(false); // 모달이 열리면 툴팁을 숨깁니다.
  };

  return (
    <div className={`relative self-start ${className || ''}`}>
      <div
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onClick={toggleModal}
        className="cursor-pointer rounded-full p-0.5 hover:bg-white/30 hover:text-miku-dark-blue transition-colors"
      >
        {children}
      </div>

      {/* Custom Tooltip */}
      {isTooltipVisible && !isModalOpen && (
        <div className="absolute bottom-full ml-2 mb-2 whitespace-nowrap rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm z-10">
          {tooltipText}
        </div>
      )}

      {/* Main Modal */}
      {isModalOpen && (
        <div className={modalClassName}>
          <button
            onClick={toggleModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          />
          <h2 className="text-lg font-bold mb-2">{title}</h2>
          <p className="text-sm">{content}</p>
          <div className={tailClassName} />
        </div>
      )}
    </div>
  );
}
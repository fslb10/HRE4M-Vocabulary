import React from 'react'

export default function ResetModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-8 max-w-sm w-full">
        <h2 className="font-serif text-2xl mb-3">Reset All Progress?</h2>
        <p className="text-[#8a8480] text-sm mb-6">
          This will clear all known and learning marks across every unit. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded bg-red-900/60 hover:bg-red-800/80 text-red-200 text-sm font-medium transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded bg-[#2a2a2a] hover:bg-[#333] text-[#f0ece4] text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

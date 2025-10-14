// components/LabelSheet.js
import React, { forwardRef } from 'react';
import Label from './Label';

export default forwardRef(function LabelSheet({ items = [], batchNumbers = {} }, ref) {
  // Convert mm to inches (1mm = 0.0393701in)
  const mmToIn = (mm) => `${mm * 0.0393701}in`;

  // Page dimensions
  const pageWidth = 210; // mm
  const pageHeight = 297; // mm
  const pagePadding = {
    top: 12, // mm
    right: 5, // mm
    bottom: 12, // mm
    left: 5, // mm
  };

  // Label dimensions
  const labelWidth = 102; // mm
  const labelHeight = 68; // mm

  // Ensure we have exactly 8 labels (fill with empty if needed)
  const labels = [...items];
  while (labels.length < 8) {
    labels.push({});
  }

  // Calculate available space for labels
  const availableWidth = pageWidth - pagePadding.left - pagePadding.right;
  const availableHeight = pageHeight - pagePadding.top - pagePadding.bottom;

  // Calculate gaps between labels
  const gapX = (availableWidth - (2 * labelWidth)); // No gap, just padding
  const gapY = (availableHeight - (4 * labelHeight)) / 3; // 3 gaps between 4 rows

  return (
    <div
      ref={ref}
      className="print-section"
      style={{
        width: mmToIn(pageWidth),
        height: mmToIn(pageHeight),
        padding: `${mmToIn(pagePadding.top)} ${mmToIn(pagePadding.right)} ${mmToIn(pagePadding.bottom)} ${mmToIn(pagePadding.left)}`,
        display: 'grid',
        gridTemplateColumns: `repeat(2, ${mmToIn(labelWidth)})`,
        gridAutoRows: mmToIn(labelHeight),
        gap: `${mmToIn(gapY)} ${mmToIn(gapX)}`,
        backgroundColor: 'white',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      {labels.map((item, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #eee',
            overflow: 'hidden',
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          {item.name ? (
            <Label
              item={item}
              batchNumber={batchNumbers[item.name] || item.batchNumber}
              dimensions={{
                width: labelWidth - 2, // Account for border
                height: labelHeight - 2 // Account for border
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              border: '1px dashed #ccc',
              borderRadius: '2px'
            }} />
          )}
        </div>
      ))}
    </div>
  );
})
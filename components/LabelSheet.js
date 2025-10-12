// components/LabelSheet.js
import Label from './Label';

export default function LabelSheet({ items = [], batchNumber }) {
  // Ensure we have exactly 8 labels (fill with empty if needed)
  const labels = [...items];
  while (labels.length < 8) {
    labels.push({});
  }

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
  const labelPadding = {
    top: 4, // mm
    right: 3, // mm
    bottom: 4, // mm
    left: 3, // mm
  };

  // Calculate available space for labels
  const availableWidth = pageWidth - pagePadding.left - pagePadding.right;
  const availableHeight = pageHeight - pagePadding.top - pagePadding.bottom;

  // Calculate gaps between labels
  const gapX = (availableWidth - (2 * labelWidth)) / 1; // 1 gap between 2 columns
  const gapY = (availableHeight - (4 * labelHeight)) / 3; // 3 gaps between 4 rows

  return (
    <div 
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
      {labels.slice(0, 8).map((item, index) => (
        <div 
          key={index} 
          style={{
            padding: `${mmToIn(labelPadding.top)} ${mmToIn(labelPadding.right)} ${mmToIn(labelPadding.bottom)} ${mmToIn(labelPadding.left)}`,
            boxSizing: 'border-box',
            border: '1px solid #eee',
            overflow: 'hidden',
          }}
        >
          {item.name ? (
            <Label 
              item={item} 
              batchNumber={item.batchNumber || batchNumber} 
              dimensions={{
                width: labelWidth - labelPadding.left - labelPadding.right,
                height: labelHeight - labelPadding.top - labelPadding.bottom
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
}
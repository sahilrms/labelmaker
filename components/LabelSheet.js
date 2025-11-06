// components/LabelSheet.js
import Label from './Label';

export default function LabelSheet({ items = [], batchNumbers = {} }) {
  const mmToIn = (mm) => `${mm * 0.0393701}in`;

  const pageWidth = 210; // mm
  const pageHeight = 297; // mm
  const pagePadding = {
    top: 12,
    right: 5,
    bottom: 12,
    left: 0, // Set to exactly 5mm as requested
  };

  const labelWidth = 102; // mm
  const labelHeight = 70; // mm
  const columnGap = 5; // 5mm gap between columns

  const labels = [...items];
  while (labels.length < 8) labels.push({});

  const availableWidth = pageWidth - pagePadding.left - pagePadding.right - columnGap;
  
  // Calculate row-specific margins
  const getRowMargin = (index) => {
    const row = Math.floor(index / 2); // 0-3 for 4 rows
    switch(row) {
      case 0: return mmToIn(-5);  // 1st row: reduce top margin by 5mm
      case 1: return '0';         // 2nd row: no change
      case 2: return mmToIn(10);  // 3rd row: add 10mm top margin
      case 3: return mmToIn(15);  // 4th row: add 15mm top margin
      default: return '0';
    }
  };

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
        columnGap: mmToIn(columnGap), // Use the columnGap constant we defined
        backgroundColor: 'white',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      {labels.map((item, index) => {
        const row = Math.floor(index / 2);
        return (
          <div
            key={index}
            style={{
              border: '1px solid #eee',
              overflow: 'hidden',
              position: 'relative',
              boxSizing: 'border-box',
              marginTop: getRowMargin(index),
              marginBottom: row < 3 ? '0' : mmToIn(5), // Add bottom margin only for last row
            }}
          >
            {item.name ? (
              <Label
                item={item}
                batchNumber={batchNumbers[item.name] || item.batchNumber}
                dimensions={{
                  width: labelWidth - 2,
                  height: labelHeight - 2,
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                border: '1px dashed #ccc',
                borderRadius: '2px',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

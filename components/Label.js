// // components/Label.js
// export default function Label({ item, batchNumber }) {
//     const data = {
//         shopName: "M S Dar General & Provision Store",
//         shopAddress: "6 Sadar Bazar B B Cantt Srinagar",
//     };

//     return (
//         <div style={{fontFamily: "Arial, sans-serif", backgroundColor: "#fff", margin: 0, padding: 20 }}>
//             <div style={{ border: "2px solid #000", padding: 20, width: 700, margin: "auto" }}>
//                 {/* Header */}
//                 <h2 style={{ textAlign: "center", color: "#1a237e", fontSize: 22, marginBottom: 0 }}>
//                     {data.shopName}
//                 </h2>
//                 <p style={{ textAlign: "center", color: "#1a237e", fontSize: 16, marginTop: 5 }}>
//                     {data.shopAddress}
//                 </p>
//                 <hr style={{ border: "1px solid #1a237e", marginBottom: 20 }} />

//                 {/* Content Row */}
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                     {/* Left image */}
//                     <div style={{ width: "48%", position: "relative" }}>
//                         <img
//                             src="./imgg.png"
//                             alt="Product"
//                             style={{ width: "100%", borderRadius: 5 }}
//                         />
//                         <p
//                             style={{
//                                 position: "absolute",
//                                 bottom: 100,
//                                 left: "60%",
//                                 transform: "translateX(-50%)",
//                                 backgroundColor: "white",
//                                 color: "black",
//                                 padding: "2px 6px",
//                                 borderRadius: 3,
//                                 fontSize: 16,
//                                 textAlign: "center",
//                                 fontWeight: "bold",
//                                 width: "150px",
//                             }}
//                         >
//                             {item.name} {/* You can append percentage here if needed: {item.name} - {item.percentage}% */}
//                         </p>
//                     </div>


//                     {/* Table */}
//                     <div style={{ width: "48%" }}>
//                         <table style={{ width: "100%", borderCollapse: "collapse", border: "2px solid #a0522d" }}>
//                             <tbody>
//                                 <tr>
//                                     <td style={cellStyle}>Net Content</td>
//                                     <td style={cellStyleVal}>{item.netContent}</td>
//                                 </tr>
//                                 <tr>
//                                     <td style={cellStyle}>Batch No</td>
//                                     <td style={cellStyleVal}>{batchNumber}</td>
//                                 </tr>
//                                 <tr>
//                                     <td style={cellStyle}>Month of Packing</td>
//                                     <td style={cellStyleVal}>{formatDate(item.packingDate)}</td>
//                                 </tr>
//                                 <tr>
//                                     <td style={cellStyle}>Best Before</td>
//                                     <td style={cellStyleVal}>{formatDate(item.expiryDate)}</td>
//                                 </tr>
//                                 <tr>
//                                     <td style={cellStyle}>Max Retail Price</td>
//                                     <td style={cellStyleVal}>₹{parseFloat(item.mrp || 0).toFixed(2)}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
//                     <div style={{ textAlign: "center" }}>
//                         <h3 style={{ fontStyle: "italic", color: "#2e7d32", margin: 0, fontSize: 18 }}>FSSAI</h3>
//                         <p style={{ margin: 0, color: "#000", fontWeight: "bold", fontSize: 16 }}>LIC No: 21025411000401</p>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }

// // Common table cell style
// const cellStyle = {
//     border: "1px solid #a0522d",
//     padding: 8,
//     fontWeight: "bold",
//     color: "#6b3e1e",
// };
// const cellStyleVal = {
//     border: "1px solid #a0522d",
//     padding: 8,
//     fontWeight: "normal",
//     color: "#6b3e1e",
// };

// // Helper function to format date as DD/MM/YYYY
// function formatDate(dateString) {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date
//         .toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//         })
//         .replace(/\//g, "/");
// }
// components/Label.js
import { useEffect, useRef } from 'react';

export default function Label({ item, batchNumber, dimensions }) {
    const data = {
        shopName: "M S Dar General & Provision Store",
        shopAddress: "6 Sadar Bazar B B Cantt Srinagar",
    };

    // Convert mm to pixels (1mm ≈ 3.77953 pixels at 96dpi)
    const mmToPx = (mm) => mm * 3.77953;
    const width = dimensions?.width ? mmToPx(dimensions.width) : '100%';
    const height = dimensions?.height ? mmToPx(dimensions.height) : 'auto';

    // Format date as DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).replace(/\//g, '/');
    };

    // Table cell styles
    const cellStyle = {
        border: "1px solid #a0522d",
        padding: "2px 4px",
        fontWeight: "bold",
        fontSize: '9px',
        color: "#6b3e1e",
        width: '50%'
    };

    const cellStyleVal = {
        ...cellStyle,
        fontWeight: "normal",
        textAlign: 'center'
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#fff",
            boxSizing: 'border-box',
            border: '1px solid #000',
            padding: '5px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                textAlign: "center",
                marginBottom: '5px',
                borderBottom: '1px solid #1a237e',
                paddingBottom: '3px'
            }}>
                <h2 style={{
                    color: "#1a237e",
                    fontSize: "14px",
                    margin: '2px 0',
                    fontWeight: 'bold',
                    lineHeight: '1.2'
                }}>
                    {data.shopName}
                </h2>
                <p style={{
                    color: "#1a237e",
                    fontSize: "10px",
                    margin: '2px 0',
                    lineHeight: '1.1'
                }}>
                    {data.shopAddress}
                </p>
            </div>

            {/* Content */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                flex: 1,
                gap: '5px'
            }}>
                {/* Left side - Image */}
                <div
                    style={{
                        width: "45%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #ddd",
                        borderRadius: "3px",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <img
                        src={item.image || "./imgg.png"} // replace with your image path
                        alt={item.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            // objectFit: "cover",
                            borderRadius: "3px",
                        }}
                    />

                    {item.name && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "50%",
                                left: "60%",
                                transform: "translateX(-50%)",
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                padding: "2px 8px",
                                borderRadius: "3px",
                                fontSize: "10px",
                                fontWeight: "bold",
                                border: "1px solid #ddd",
                                whiteSpace: "nowrap",
                                maxWidth: "90%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textAlign: "center",
                            }}
                        >
                            {item.name}
                        </div>
                    )}
                </div>

                {/* Right side - Details */}
                <div style={{
                    width: "55%",
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        flex: 1
                    }}>
                        <tbody>
                            <tr>
                                <td style={cellStyle}>Net Content</td>
                                <td style={cellStyleVal}>{item.netContent || '-'}</td>
                            </tr>
                            <tr>
                                <td style={cellStyle}>Batch No</td>
                                <td style={cellStyleVal}>{batchNumber || '-'}</td>
                            </tr>
                            <tr>
                                <td style={cellStyle}>Pkg Date</td>
                                <td style={cellStyleVal}>{formatDate(item.packingDate) || '-'}</td>
                            </tr>
                            <tr>
                                <td style={cellStyle}>Exp. Date</td>
                                <td style={cellStyleVal}>{formatDate(item.expiryDate) || '-'}</td>
                            </tr>
                            <tr>
                                <td style={cellStyle}>MRP</td>
                                <td style={{
                                    ...cellStyleVal,
                                    fontWeight: 'bold',
                                    fontSize: '10px'
                                }}>₹{item.mrp ? parseFloat(item.mrp).toFixed(2) : '0.00'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: '3px',
                paddingTop: '2px',
                borderTop: '1px solid #1a237e'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    <span style={{
                        fontStyle: "italic",
                        color: "#2e7d32",
                        fontSize: '10px',
                        fontWeight: 'bold'
                    }}>FSSAI</span>
                    <span style={{
                        fontSize: '8px',
                        color: "#000",
                        fontWeight: "bold"
                    }}>
                        LIC No: 21025411000401
                    </span>
                </div>
            </div>
        </div>
    );
}
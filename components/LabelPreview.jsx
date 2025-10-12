const LabelPreview = ({ formData = {} }) => {
    const formatDate = (dateString) => {
      if (!dateString) return '--/--/----';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN');
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Label Preview</h2>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">
              {formData.productName || 'Product Name'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-left">
              <div>Qty: <span className="font-medium">{formData.quantity || '--'}</span></div>
              <div>Batch: <span className="font-medium">{formData.batchNumber || '--'}</span></div>
              <div>Packed: <span className="font-medium">
                {formData.monthYear ? new Date(formData.monthYear).toLocaleDateString('en-IN', { 
                  month: 'short', 
                  year: 'numeric' 
                }) : '--'}
              </span></div>
              <div>Expiry: <span className="font-medium">
                {formData.expiryDate ? formatDate(formData.expiryDate) : '--'}
              </span></div>
              <div className="col-span-2">Price: <span className="font-medium">
                {formData.price ? `₹${parseFloat(formData.price).toFixed(2)}` : '--'}
              </span></div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>This is a preview of how your label will look.</p>
        </div>
      </div>
    );
  };
  
  export default LabelPreview;
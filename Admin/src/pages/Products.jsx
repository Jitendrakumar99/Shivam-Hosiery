import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct, createProductsBulk } from '../store/slices/productSlice';
import ProductModal from '../components/Modal/ProductModal';
import * as XLSX from 'xlsx';

const Products = () => {
  const { products, loading, pagination } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  // Handle Excel file upload (images will be added later)
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      const json = XLSX.utils.sheet_to_json(ws);
      console.log('Excel data parsed:', json);
      
      try {
        const formattedProducts = json.map((row) => {
          const price = parseFloat(row.price || row.Price || 0);
          const compareAtPrice = parseFloat(row.compareAtPrice || row['Compare At Price'] || 0);
          const moq = parseInt(row.minOrderQuantity || row['Min Order Quantity'] || row.moq || row.MOQ || 0);

          return {
            title: row.title || row.Title || row.name || row.Name || 'Unnamed Product',
            description: row.description || row.Description || 'No description provided.',
            shortDescription: row.shortDescription || row['Short Description'] || '',
            pricing: {
              price: isNaN(price) ? 0 : price,
              compareAtPrice: isNaN(compareAtPrice) ? 0 : compareAtPrice,
              currency: row.currency || row.Currency || 'INR',
            },
            sku: (row.sku || row.SKU || '').toString().toUpperCase(),
            category: {
              name: row.category || row.Category || 'Uncategorized'
            },
            attributes: {
              gender: row.gender || row.Gender || 'Unisex',
              fabric: row.fabric || row.Fabric || '',
              length: row.length || row.Length || '',
              sleeve: row.sleeve || row.Sleeve || ''
            },
            seo: {
              title: row.seoTitle || row['SEO Title'] || row.title || '',
              description: row.seoDescription || row['SEO Description'] || row.description || '',
              keywords: (row.seoKeywords || row['SEO Keywords'] || '').toString().split(',').map(k => k.trim()).filter(Boolean)
            },
            minOrderQuantity: isNaN(moq) ? 0 : moq,
            status: (row.status || row.Status || 'active').toString().toLowerCase()
          };
        });

        if (formattedProducts.length > 0) {
          dispatch(createProductsBulk(formattedProducts))
            .unwrap()
            .then(() => {
              alert(`Successfully imported ${formattedProducts.length} products!`);
              // Reset file input
              document.getElementById('excelUpload').value = '';
            })
            .catch((err) => {
              alert(`Failed to import products: ${err}`);
              document.getElementById('excelUpload').value = '';
            });
        }
      } catch (error) {
        console.error("Error formatting products:", error);
        alert("Failed to parse Excel file. Please ensure columns match the required format.");
        document.getElementById('excelUpload').value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };


  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const IMAGE_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage products displayed on your website</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
        <input type="file" accept=".xlsx,.xls" id="excelUpload" style={{ display: 'none' }} onChange={handleExcelUpload} />
        <label htmlFor="excelUpload" className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="hidden sm:inline">Upload Excel</span>
          <span className="sm:hidden">Upload</span>
        </label>  
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found. Add your first product!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <div key={product._id || product.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
            {/* Top section: Image and product details */}
            <div className="p-3 sm:p-4 flex gap-3 sm:gap-4">
              {/* Small square image with rounded corners */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 min-w-20 sm:min-w-24 shrink-0">
                <img
                  src={
                    product.images?.[0]?.startsWith('/') 
                      ? `${IMAGE_BASE_URL}${product.images[0]}` 
                      : (product.images?.[0] || product.image || 'https://via.placeholder.com/150')
                  }
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Product details */}
              <div className="flex-1 min-w-0">
                <div className="mb-1.5 sm:mb-2">
                  <span className="bg-orange-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold inline-block">
                    {product.category?.name || product.category}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>

                <p className="text-lg sm:text-xl font-bold text-orange-500">₹{product.pricing?.price?.toFixed(2) || product.price?.toFixed(2) || '0.00'}</p>
              </div>
            </div>

            {/* Bottom section: Description and actions */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex-1 flex flex-col">
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 flex-1 line-clamp-3">{product.description}</p>

              <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition text-xs sm:text-sm"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id || product.id)}
                  className="p-1.5 sm:p-2 border border-gray-300 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-800">{(pagination.currentPage - 1) * 50 + 1}</span> to <span className="font-semibold text-gray-800">{Math.min(pagination.currentPage * 50, pagination.totalItems)}</span> of <span className="font-semibold text-gray-800">{pagination.totalItems}</span> products
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    pagination.currentPage === i + 1
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        mode={modalMode}
        onSuccess={() => {
          dispatch(fetchProducts());
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default Products;


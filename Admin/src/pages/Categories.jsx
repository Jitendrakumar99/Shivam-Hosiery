import { useSelector, useDispatch } from 'react-redux';
import { useState, useMemo, useEffect } from 'react';
import { deleteCategory, fetchCategories } from '../store/slices/categorySlice';
import CategoryModal from '../components/Modal/CategoryModal';

const Categories = () => {
  const { categories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [defaultParent, setDefaultParent] = useState('');
  const [activeTab, setActiveTab] = useState('parents'); // 'parents' | 'all'

  useEffect(() => {
    // Fetch categories with populated children for hierarchical display
    dispatch(fetchCategories({ populateChildren: 'true' }));
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id)).then(() => {
        // Refresh list to ensure parent relations and populated fields are up-to-date
        dispatch(fetchCategories({ populateChildren: 'true' }));
      });
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setModalMode('add');
    setDefaultParent('');
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setDefaultParent('');
    setIsModalOpen(true);
  };

  const handleAddSubCategory = (parentId) => {
    setSelectedCategory(null);
    setModalMode('add');
    setDefaultParent(parentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const parents = useMemo(() => (categories || []).filter(c => !c.parent), [categories]);
  const childrenByParent = useMemo(() => {
    const map = {};
    // If categories have populated children, use them directly
    (categories || []).forEach(parent => {
      if (parent.children && Array.isArray(parent.children)) {
        map[parent._id || parent.id] = parent.children;
      }
    });
    // Fallback: manual grouping for any missing relationships
    (categories || []).forEach(c => {
      const pid = c.parent?._id || c.parent || null;
      if (pid) {
        if (!map[pid]) map[pid] = [];
        map[pid].push(c);
      }
    });
    return map;
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Category Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage product categories and sub-categories.</p>
        </div>
        <button
          onClick={handleAddCategory}
          className="bg-[#1a1a2e] hover:bg-[#16213e] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Parent Category</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-4 sm:gap-6 overflow-x-auto pb-px">
          <button
            className={`py-2 px-1 text-sm font-medium whitespace-nowrap ${activeTab === 'parents' ? 'text-[#1a1a2e] border-b-2 border-[#1a1a2e]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('parents')}
          >
            Parent Categories
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium whitespace-nowrap ${activeTab === 'all' ? 'text-[#1a1a2e] border-b-2 border-[#1a1a2e]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Categories
          </button>
        </nav>
      </div>

      {activeTab === 'parents' ? (
        <div className="space-y-6">
          {parents.map(parent => (
            <div key={parent._id || parent.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {parent.image && (
                  <img src={parent.image} alt={parent.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{parent.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${parent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{parent.status}</span>
                        <span className="text-sm text-gray-500">{(childrenByParent[parent._id || parent.id]?.length || 0)} sub-categories</span>
                      </div>
                      {parent.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2 sm:line-clamp-none">{parent.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
                      <button
                        onClick={() => handleAddSubCategory(parent._id || parent.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 text-sm w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        <span className="hidden sm:inline">Add Sub Category</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleEditCategory(parent)}
                          className="flex-1 sm:flex-initial px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(parent._id || parent.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {(childrenByParent[parent._id || parent.id]?.length || 0) > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {childrenByParent[parent._id || parent.id].map(child => (
                        <div key={child._id || child.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col gap-3">
                            <div>
                              <h4 className="font-semibold text-gray-800 flex flex-wrap items-center gap-2">
                                {child.name}
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${child.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{child.status}</span>
                              </h4>
                              {child.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{child.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditCategory(child)}
                                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(child._id || child.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {(categories || []).filter(c => !!c.parent).map((category) => (
            <div key={category._id || category.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="p-4">
                {/* Sub-categories do not have images by design */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">{category.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Parent: {category.parent?.name || 'Unknown'}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{category.status}</span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(category._id || category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
        mode={modalMode}
        defaultParent={defaultParent}
      />
    </div>
  );
};

export default Categories;


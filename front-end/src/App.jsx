import React, { useState, useEffect } from 'react';

const App = () => {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const BASE_URL = 'http://localhost:8080';

  // Mengambil data dari backend saat aplikasi dimuat
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/items`);
        if (!response.ok) {
          throw new Error('Gagal mengambil item');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchItems();
  }, []);

  // Fungsi untuk mengubah status "completed" pada item melalui API
  const handleChecklistToggle = async (id) => {
    const itemToUpdate = items.find(item => item.id === id);
    if (!itemToUpdate) return;

    const updatedData = { ...itemToUpdate, completed: !itemToUpdate.completed };

    try {
      const response = await fetch(`${BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Gagal memperbarui item');
      }
      const updatedItem = await response.json();
      setItems(prevItems => prevItems.map(i => (i.id === updatedItem.id ? updatedItem : i)));
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Fungsi untuk menambah item baru melalui API
  const handleAddItem = async (title, description) => {
    const newItem = {
      title: title.trim(),
      description: description.trim(),
      completed: false,
    };
    try {
      const response = await fetch(`${BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error('Gagal menambahkan item');
      }
      const createdItem = await response.json();
      setItems(prevItems => [...prevItems, createdItem]);
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  // Fungsi untuk memperbarui item melalui API
  const handleUpdateItem = async (id, newTitle, newDescription) => {
    const itemToUpdate = items.find(item => item.id === id);
    if (!itemToUpdate) return;

    const updatedData = {
      ...itemToUpdate,
      title: newTitle.trim(),
      description: newDescription.trim(),
    };

    try {
      const response = await fetch(`${BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Gagal memperbarui item');
      }
      const updatedItem = await response.json();
      setItems(prevItems => prevItems.map(i => (i.id === updatedItem.id ? updatedItem : i)));
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi penghapusan
  const handleDeleteItem = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  // Fungsi untuk menghapus item dari backend
  const confirmDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/items/${itemToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Gagal menghapus item');
      }
      setItems(prevItems => prevItems.filter(item => item.id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const openModal = (item = null) => {
    setCurrentItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentItem(null);
  };

  const ItemModal = () => {
    const [title, setTitle] = useState(currentItem?.title || '');
    const [description, setDescription] = useState(currentItem?.description || '');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title.trim()) return;

      if (currentItem) {
        handleUpdateItem(currentItem.id, title, description);
      } else {
        handleAddItem(title, description);
      }
      closeModal();
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 transform transition-all duration-300 scale-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {currentItem ? 'Edit Item' : 'Tambah Item Baru'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="itemTitle" className="block text-gray-700 font-semibold mb-2">Judul</label>
              <input
                type="text"
                id="itemTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tuliskan judul item"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="itemDescription" className="block text-gray-700 font-semibold mb-2">Deskripsi (Opsional)</label>
              <textarea
                id="itemDescription"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tuliskan deskripsi item"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-3 text-gray-600 rounded-lg hover:bg-gray-200 font-semibold"
              >
                Batal
              </button>
              <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Konfirmasi Hapus</h3>
        <p className="text-gray-700 mb-6">Apakah Anda yakin ingin menghapus item ini?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-6 py-3 text-gray-600 rounded-lg hover:bg-gray-200 font-semibold"
          >
            Batal
          </button>
          <button
            onClick={confirmDelete}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen font-inter bg-[#f0f9ff]">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Study Notes</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-500 text-white rounded-full px-6 py-3 font-semibold shadow-lg hover:bg-blue-600 transition"
          >
            <span className="text-xl">+</span> Tambah Item
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6 flex-grow">
        <div className="p-6 rounded-lg shadow-md bg-[#e0f2fe] border-l-4 border-[#38bdf8]">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Daftar Tugas Saya</h3>
          {items.length === 0 ? (
            <p className="text-center text-gray-500 text-lg my-10">Daftar masih kosong. Tambahkan item pertama Anda!</p>
          ) : (
            <ul className="list-none space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between bg-white p-4 rounded-md shadow-sm">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleChecklistToggle(item.id)}
                      className="mt-1 mr-3 form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-400 cursor-pointer"
                    />
                    <div>
                      <h4 className={`text-lg font-medium text-gray-800 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className={`text-sm text-gray-600 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-1">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-7.293 7.293-2.828-2.828 7.293-7.293zM10 6L8 8H4v8h8V12l2-2V6h-4z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                      title="Hapus"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v1H3.5a1 1 0 000 2h.5l.5 11a2 2 0 002 2h6a2 2 0 002-2l.5-11h.5a1 1 0 100-2H12V3a1 1 0 00-1-1H9zM8 3h4v1H8V3zM7 8a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm1 3a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm3 0a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="bg-gray-100 text-center p-4 text-gray-600 mt-auto">
        &copy; 2025 Study Notes.
      </footer>

      {modalOpen && <ItemModal />}
      {showDeleteModal && <DeleteConfirmationModal />}
    </div>
  );
};

export default App;
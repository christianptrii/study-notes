import React, { useState, useEffect } from 'react';

const App = () => {
  // State untuk mengelola daftar checklist tunggal
  const [checklist, setChecklist] = useState({
    title: "Daftar Tugas Saya",
    content: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // Item yang sedang diedit
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Mengambil data dari localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    const storedChecklist = JSON.parse(localStorage.getItem('checklist'));
    if (storedChecklist) {
      setChecklist(storedChecklist);
    }
  }, []);

  // Menyimpan data ke localStorage setiap kali ada perubahan pada checklist
  useEffect(() => {
    localStorage.setItem('checklist', JSON.stringify(checklist));
  }, [checklist]);

  const handleChecklistToggle = (index) => {
    const newContent = [...checklist.content];
    newContent[index] = {
      ...newContent[index],
      checked: !newContent[index].checked
    };
    setChecklist({ ...checklist, content: newContent });
  };

  const handleAddItem = (text) => {
    const newItem = {
      text: text.trim(),
      checked: false,
    };
    setChecklist({ ...checklist, content: [...checklist.content, newItem] });
  };

  const handleUpdateItem = (index, newText) => {
    const newContent = [...checklist.content];
    newContent[index] = {
      ...newContent[index],
      text: newText.trim(),
    };
    setChecklist({ ...checklist, content: newContent });
  };

  const handleDeleteItem = (index) => {
    setItemToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const newContent = checklist.content.filter((_, index) => index !== itemToDelete);
    setChecklist({ ...checklist, content: newContent });
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const openModal = (item = null, index = null) => {
    if (item) {
      setCurrentItem({ item, index });
    } else {
      setCurrentItem(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentItem(null);
  };

  const ItemModal = () => {
    const [text, setText] = useState(currentItem?.item.text || '');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!text.trim()) return;

      if (currentItem) {
        handleUpdateItem(currentItem.index, text);
      } else {
        handleAddItem(text);
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
              <label htmlFor="itemText" className="block text-gray-700 font-semibold mb-2">Isi Item</label>
              <input
                type="text"
                id="itemText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tuliskan item Anda di sini..."
                required
              />
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
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{checklist.title}</h3>
          {checklist.content.length === 0 ? (
            <p className="text-center text-gray-500 text-lg my-10">Daftar masih kosong. Tambahkan item pertama Anda!</p>
          ) : (
            <ul className="list-none space-y-4">
              {checklist.content.map((item, index) => (
                <li key={index} className="flex items-start justify-between bg-white p-4 rounded-md shadow-sm">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleChecklistToggle(index)}
                      className="mr-3 form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-400 cursor-pointer"
                    />
                    <span className={`text-lg text-gray-700 ${item.checked ? 'line-through text-gray-500' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(item, index)}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="bg-gray-100 text-center p-4 text-gray-600 mt-auto">
        &copy; 2024 Aplikasi Checklist Sederhana. Dibuat dengan Gemini.
      </footer>

      {modalOpen && <ItemModal />}
      {showDeleteModal && <DeleteConfirmationModal />}
    </div>
  );
};

export default App;
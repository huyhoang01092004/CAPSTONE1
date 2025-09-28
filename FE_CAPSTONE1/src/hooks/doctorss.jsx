import React, { useState } from "react";

const MedicineSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;

    const cacheKey = `medicine_${searchTerm.toLowerCase()}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      console.log("✅ Lấy kết quả từ session cache");
      setMedicines(JSON.parse(cachedData));
      return;
    }

    console.log("🌐 Gọi API mới...");
    setLoading(true);
    try {
      const res = await fetch(`/api/medicines?search=${searchTerm}`);
      if (!res.ok) throw new Error("Lỗi khi tải dữ liệu thuốc");
      const data = await res.json();
      setMedicines(data);

      // Lưu cache vào sessionStorage
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err) {
      console.error(err);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Tìm kiếm thuốc</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nhập tên thuốc..."
          className="flex-1 border px-3 py-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Tìm
        </button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}

      {medicines.length === 0 && !loading ? (
        <p>Không tìm thấy thuốc nào.</p>
      ) : (
        <ul className="space-y-2">
          {medicines.map((med) => (
            <li key={med.id} className="p-3 bg-white shadow rounded">
              {med.name} — {med.type} ({med.stock} còn lại)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicineSearch;

// src/controllers/slotController.js
import dayjs from "dayjs";
import { getWorkingHours } from "../models/doctorWorkingHourModel.js";
import { getTimeOff } from "../models/doctorTimeOffModel.js";
import { getAppointments } from "../models/slotModel.js";

export const getAvailableSlots = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const date = req.query.date;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctor_id và date là bắt buộc" });
    }

    const slot_minutes = 30;
    const dow = dayjs(date).day();

    // 1. Lấy giờ làm việc trong ngày
    const whs = await getWorkingHours(doctorId, dow);
    if (whs.length === 0) {
      return res.json({ doctor_id: doctorId, date, available_slots: [] });
    }

    // 2. Sinh tất cả slot trong ca làm việc
    const slotSet = new Map();
    for (const wh of whs) {
      let cur = dayjs(`${date} ${wh.start_time}`);
      const end = dayjs(`${date} ${wh.end_time}`);
      while (cur.isBefore(end)) {
        const startStr = cur.format("HH:mm");
        const endStr = cur.add(slot_minutes, "minute").format("HH:mm");
        slotSet.set(startStr, { start: startStr, end: endStr });
        cur = cur.add(slot_minutes, "minute");
      }
    }

    // 3. Slot bị block bởi time off
    const timeOffs = await getTimeOff(doctorId, date);
    const blocked = new Set();
    for (const off of timeOffs) {
      let cur = dayjs(off.start_at);
      const end = dayjs(off.end_at);
      while (cur.isBefore(end)) {
        blocked.add(cur.format("HH:mm"));
        cur = cur.add(slot_minutes, "minute");
      }
    }

    // 4. Slot đã có appointment (pending, confirmed)
    const apps = await getAppointments(doctorId, date);
    const booked = new Set();
    for (const a of apps) {
      let cur = dayjs(a.scheduled_start);
      const end = dayjs(a.scheduled_end);
      while (cur.isBefore(end)) {
        booked.add(cur.format("HH:mm"));
        cur = cur.add(slot_minutes, "minute");
      }
    }

    // 5. Lọc ra slot thực sự còn trống
    const available = Array.from(slotSet.values())
      .filter((slot) => !blocked.has(slot.start) && !booked.has(slot.start))
      .sort((a, b) => a.start.localeCompare(b.start));

    res.json({ doctor_id: doctorId, date, available_slots: available });
  } catch (e) {
    console.error("❌ Lỗi getAvailableSlots:", e.message);
    res.status(500).json({ error: e.message });
  }
};

// scripts/hashPasswords.js
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const hashPasswords = async () => {
  try {
    // Lấy toàn bộ user
    const [users] = await db.execute("SELECT user_id, password FROM users");

    for (let user of users) {
      // Nếu password chưa hash (không bắt đầu bằng $2b$)
      if (!user.password.startsWith("$2b$")) {
        const hash = await bcrypt.hash(user.password, 10);

        await db.execute("UPDATE users SET password=? WHERE user_id=?", [
          hash,
          user.user_id,
        ]);

        console.log(`✅ Đã hash password cho user_id = ${user.user_id}`);
      }
    }

    console.log("🎉 Hoàn tất cập nhật mật khẩu!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi hash:", err);
    process.exit(1);
  }
};

hashPasswords();

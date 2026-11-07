/**
 * Happy Birthday Website — Interactive Master Engine (v2.0)
 * Features:
 * - 6-language full reactive i18n (vi, en, th, zh, ja, es)
 * - Safe URL parameter personalization & shareable link generator (XSS protected)
 * - Interactive tiered 3D cake with realistic candle flame blow & microphone air detection
 * - 3D surprise gift box with unwrapping physics and personalized card reveal
 * - Photo memory booth with frames, interactive stickers, and canvas export
 * - Birthday Wishes Wall / Guestbook with localStorage persistence and like counters
 * - Native Web Audio API polyphonic synthesizer (3 melodies + 5 party sound effects)
 * - Dual visual FX: 60fps canvas confetti + multi-burst fireworks physics simulation
 */

// ============================================================================
// 1. Multilingual i18n Dictionaries (6 Languages)
// ============================================================================
const translations = {
  vi: {
    pageTitle: "🎂 Chúc Mừng Sinh Nhật! 🎂",
    navBrand: "Birthday Magic",
    navMusic: "Nhạc",
    navPersonalize: "Tạo thiệp riêng",
    recipientDefault: "Ngày đặc biệt của bạn",
    heroTitle: "Happy Birthday!",
    heroSubtitle: "Chúc mừng sinh nhật bạn thân yêu!",
    cakeAgeDefault: "Tuổi mới rực rỡ",
    candleInst: "Chạm vào từng ngọn nến để thổi tắt! 🌬️",
    btnBlowAll: "Thổi tất cả nến",
    btnRelight: "Thắp lại nến",
    btnMicBlow: "Thổi bằng Mic",
    btnMicListening: "Đang nghe tiếng thổi... 🌬️",
    revealTitle: "Điều ước đã được gửi đến vũ trụ! 🎉",
    revealText: "Chúc cho mọi ước mơ tươi đẹp nhất của bạn trong tuổi mới đều biến thành hiện thực rực rỡ! 🌟",
    heroScroll: "Mở hộp quà sinh nhật",
    giftBadge: "Món quà bất ngờ",
    giftTitle: "Hộp Quà Kỳ Diệu Dành Cho Bạn",
    giftDesc: "Một điều đặc biệt được gói ghém riêng cho ngày sinh nhật của bạn. Hãy chạm vào hộp quà để mở nhé!",
    giftTapHint: "Chạm vào đây để mở quà!",
    giftCongratsTitle: "Chúc Bạn Tuổi Mới Đại Cát!",
    giftCongratsBody: "Thêm một tuổi mới là thêm vô vàn cơ hội rực rỡ, niềm vui bất tận và những chuyến hành trình phi thường. Luôn tỏa sáng nhé!",
    giftSignature: "💝 Gửi trọn yêu thương",
    giftRewrap: "Gói quà lại",
    wishTitle: "Lời Chúc Sinh Nhật Trọn Vẹn",
    wishText1: "Chúc bạn có một ngày sinh nhật thật rực rỡ, ấm áp và ngập tràn nụ cười hạnh phúc! Hy vọng mọi dự định ấp ủ, mọi ước mơ của bạn trong tuổi mới đều sẽ đơm hoa kết trái ngọt ngào.",
    wishText2: "Cảm ơn bạn vì đã luôn là một người tuyệt vời, mang đến nguồn năng lượng tích cực cho tất cả mọi người xung quanh. Chúc bạn một năm mới an khang, vững bước và chạm đến đỉnh cao mới!",
    wishFromLabel: "Người gửi lời chúc:",
    wishFromDefault: "Những người bạn thân thiết",
    memoryBadge: "Phẩm chất & Kỷ niệm",
    memoryTitle: "Những Phẩm Chất Tuyệt Vời Của Bạn",
    mem1Title: "Luôn Vui Vẻ",
    mem1Text: "Nụ cười rạng rỡ của bạn xua tan mọi mệt mỏi và làm bừng sáng mọi khoảnh khắc.",
    mem2Title: "Bản Lĩnh & Kiên Cường",
    mem2Text: "Bạn luôn vững vàng, dũng cảm vượt qua mọi thử thách trên bước đường cuộc sống.",
    mem3Title: "Trái Tim Ấm Áp",
    mem3Text: "Sự chân thành và lòng tốt của bạn luôn sưởi ấm, lan tỏa tình yêu thương đến mọi người.",
    mem4Title: "Tài Năng & Sáng Tạo",
    mem4Text: "Bạn thông minh, tài hoa và có tiềm năng to lớn hơn cả những gì bạn nghĩ.",
    mem5Title: "Đáng Tin Cậy",
    mem5Text: "Một người bạn chân thành, luôn kề vai sát cánh và sẵn sàng chia sẻ khi cần.",
    mem6Title: "Quyết Tâm & Đam Mê",
    mem6Text: "Ngọn lửa nhiệt huyết luôn dẫn đường để bạn chinh phục những đỉnh cao mới.",
    boothTitle: "Khung Ảnh Kỷ Niệm Sinh Nhật",
    boothDesc: "Tải ảnh của bạn hoặc người thương để tạo khung kỷ niệm lung linh!",
    boothChoosePhoto: "Chọn ảnh kỷ niệm",
    boothFrameStyle: "Chọn kiểu khung:",
    boothStickerLabel: "Dán nhãn vui nhộn (chạm để dán):",
    boothClearStickers: "Xóa nhãn",
    boothSavePhoto: "Tải ảnh về máy",
    guestbookBadge: "Sổ lưu bút online",
    guestbookTitle: "Bức Tường Lời Chúc Sinh Nhật",
    guestbookDesc: "Hãy gửi tặng một lời chúc ngọt ngào để cùng lưu lại dấu ấn cho ngày đặc biệt này nhé!",
    guestFormName: "Tên của bạn:",
    guestFormEmoji: "Biểu tượng cảm xúc:",
    guestFormMsg: "Lời chúc sinh nhật:",
    guestThemeColor: "Màu thiệp:",
    guestSubmitBtn: "Gửi lời chúc ngay",
    musicBadge: "Giai điệu sinh nhật",
    musicTitle: "Studio Âm Nhạc & Tiệc Tùng",
    musicSelectLabel: "Giai điệu biểu diễn:",
    musicTrack1: "🎵 1. Hộp Nhạc & Tiếng Chuông (Classic Music Box)",
    musicTrack2: "🎷 2. Giai Điệu Vui Nhộn Ragtime (Lively Jazz)",
    musicTrack3: "🎺 3. Khúc Hoan Ca Hoàng Gia (Royal Fanfare)",
    btnMusicPlay: "Phát nhạc mừng sinh nhật",
    btnMusicStop: "Dừng phát nhạc",
    sfxHeading: "Bàn Phím Tiếng Động Tiệc Tùng:",
    sfxHorn: "Kèn tiệc",
    sfxPop: "Nổ bóng",
    sfxCheers: "Vỗ tay & reo hò",
    sfxChimes: "Chuông phép thuật",
    footerFireworks: "Bắn pháo hoa rực rỡ!",
    footerText: "Tạo với trọn vẹn 💖 và niềm vui mừng sinh nhật",
    modalTitle: "Tạo Thiệp Sinh Nhật Tặng Bạn Bè",
    modalIntro: "Nhập thông tin người nhận để tạo link thiệp sinh nhật độc quyền và gửi tặng ngay!",
    modalLabelRecipient: "Tên người nhận:",
    modalLabelAge: "Số tuổi (tùy chọn):",
    modalLabelSender: "Tên người gửi (bạn):",
    modalLabelPresets: "Chọn mẫu lời chúc nhanh:",
    modalPresetWarm: "🥰 Ấm áp",
    modalPresetFunny: "😂 Hài hước",
    modalPresetInspire: "🚀 Truyền cảm hứng",
    modalPresetRomantic: "💖 Lãng mạn",
    modalLabelMsg: "Lời chúc riêng biệt:",
    modalLabelShareLink: "Đường dẫn chia sẻ thiệp:",
    modalBtnCopy: "Sao chép",
    modalBtnPreview: "Xem trước ngay",
    modalBtnCopyShare: "Sao chép & Gửi tặng",
    toastLinkCopied: "Đã sao chép liên kết thiệp chúc mừng! 📋",
    toastWishSent: "Lời chúc của bạn đã xuất hiện trên tường! 💌",
    toastCandlesBlown: "Tuyệt vời! Tất cả nến đã được thổi tắt! 🎉",
    toastPhotoSaved: "Đã xuất khung ảnh kỷ niệm thành công! 📸"
  },
  en: {
    pageTitle: "🎂 Happy Birthday! 🎂",
    navBrand: "Birthday Magic",
    navMusic: "Music",
    navPersonalize: "Personalize Card",
    recipientDefault: "Your Special Day",
    heroTitle: "Happy Birthday!",
    heroSubtitle: "Wishing you a wonderful birthday, dear friend!",
    cakeAgeDefault: "Glorious New Age",
    candleInst: "Tap each candle flame to blow it out! 🌬️",
    btnBlowAll: "Blow All Candles",
    btnRelight: "Relight Candles",
    btnMicBlow: "Blow with Mic",
    btnMicListening: "Listening for blow... 🌬️",
    revealTitle: "Your wish has been sent to the stars! 🎉",
    revealText: "May all your brightest dreams and fondest wishes come true in your new year of life! 🌟",
    heroScroll: "Open Birthday Gift",
    giftBadge: "Surprise Gift",
    giftTitle: "A Magical Gift Just For You",
    giftDesc: "Something truly special has been wrapped with care for your birthday. Tap the box to unwrap it!",
    giftTapHint: "Tap here to open gift!",
    giftCongratsTitle: "Wishing You Boundless Joy!",
    giftCongratsBody: "Another year means endless bright opportunities, cheerful moments, and extraordinary adventures. Keep shining bright!",
    giftSignature: "💝 With all my love",
    giftRewrap: "Rewrap Gift",
    wishTitle: "Heartfelt Birthday Wishes",
    wishText1: "Wishing you a vibrant, joyful, and laughter-filled birthday! May every goal you cherish and every dream you dream bear the sweetest fruit in the year ahead.",
    wishText2: "Thank you for always being such an amazing person and spreading warmth and positivity wherever you go. Wishing you health, happiness, and great success!",
    wishFromLabel: "Sent with love from:",
    wishFromDefault: "Your Dearest Friends",
    memoryBadge: "Virtues & Memories",
    memoryTitle: "Wonderful Qualities About You",
    mem1Title: "Always Cheerful",
    mem1Text: "Your glowing smile brightens every day and lifts the spirits of everyone around you.",
    mem2Title: "Brave & Resilient",
    mem2Text: "You stand tall, courageous, and unwavering through every curveball life throws.",
    mem3Title: "Warmhearted",
    mem3Text: "Your kindness and gentle sincerity bring comfort and love to all who know you.",
    mem4Title: "Talented & Creative",
    mem4Text: "You are brilliant, artistic, and capable of achieving far more than you realize.",
    mem5Title: "Dependable",
    mem5Text: "A loyal and steadfast friend who always stands by side when needed most.",
    mem6Title: "Passionate & Driven",
    mem6Text: "Your energetic drive and determination inspire everyone to chase greatness.",
    boothTitle: "Birthday Memory Photo Booth",
    boothDesc: "Upload your favorite photo to create a festive keepsake with custom frames and stickers!",
    boothChoosePhoto: "Choose Photo",
    boothFrameStyle: "Choose Frame Style:",
    boothStickerLabel: "Fun Party Stickers (tap to add):",
    boothClearStickers: "Clear Stickers",
    boothSavePhoto: "Save Photo",
    guestbookBadge: "Online Guestbook",
    guestbookTitle: "Birthday Wishes Wall",
    guestbookDesc: "Leave a warm, funny, or celebratory message to commemorate this special day!",
    guestFormName: "Your Name:",
    guestFormEmoji: "Avatar Emoji:",
    guestFormMsg: "Your Birthday Wish:",
    guestThemeColor: "Card Theme:",
    guestSubmitBtn: "Post Wish Now",
    musicBadge: "Celebration Tunes",
    musicTitle: "Music & Sound Studio",
    musicSelectLabel: "Melody to Perform:",
    musicTrack1: "🎵 1. Classic Music Box & Chimes",
    musicTrack2: "🎷 2. Lively Celebration Ragtime (Jazz)",
    musicTrack3: "🎺 3. Royal Celebration Fanfare",
    btnMusicPlay: "Play Birthday Song",
    btnMusicStop: "Stop Music",
    sfxHeading: "Party Sound Effects Board:",
    sfxHorn: "Party Horn",
    sfxPop: "Balloon Pop",
    sfxCheers: "Applause & Cheers",
    sfxChimes: "Magic Chimes",
    footerFireworks: "Launch Grand Fireworks!",
    footerText: "Crafted with pure 💖 and celebration joy",
    modalTitle: "Create a Personalized Birthday Card",
    modalIntro: "Enter recipient details to generate an exclusive birthday link to share instantly!",
    modalLabelRecipient: "Recipient Name:",
    modalLabelAge: "Age (Optional):",
    modalLabelSender: "Sender Name (You):",
    modalLabelPresets: "Quick Wish Templates:",
    modalPresetWarm: "🥰 Warm",
    modalPresetFunny: "😂 Funny",
    modalPresetInspire: "🚀 Inspiring",
    modalPresetRomantic: "💖 Romantic",
    modalLabelMsg: "Custom Message:",
    modalLabelShareLink: "Shareable Card URL:",
    modalBtnCopy: "Copy",
    modalBtnPreview: "Preview Now",
    modalBtnCopyShare: "Copy & Share Link",
    toastLinkCopied: "Birthday card link copied to clipboard! 📋",
    toastWishSent: "Your wish has been pinned to the wall! 💌",
    toastCandlesBlown: "Hooray! All candles are blown out! 🎉",
    toastPhotoSaved: "Photo keepsake saved successfully! 📸"
  },
  th: {
    pageTitle: "🎂 สุขสันต์วันเกิด! 🎂",
    navBrand: "Birthday Magic",
    navMusic: "เสียงเพลง",
    navPersonalize: "สร้างการ์ดส่วนตัว",
    recipientDefault: "วันพิเศษของเธอ",
    heroTitle: "Happy Birthday!",
    heroSubtitle: "สุขสันต์วันเกิดเพื่อนรัก ขอให้มีความสุขที่สุด!",
    cakeAgeDefault: "ปีใหม่แสนสดใส",
    candleInst: "แตะที่เปลวเทียนแต่ละเล่มเพื่อเป่า! 🌬️",
    btnBlowAll: "เป่าเทียนทั้งหมด",
    btnRelight: "จุดเทียนใหม่",
    btnMicBlow: "เป่าด้วยไมโครโฟน",
    btnMicListening: "กำลังฟังเสียงเป่า... 🌬️",
    revealTitle: "คำอธิษฐานถูกส่งไปยังดวงดาวแล้ว! 🎉",
    revealText: "ขอให้ทุกความฝันและความปรารถนาอันงดงามของเธอเป็นจริงในวัยใหม่นี้! 🌟",
    heroScroll: "เปิดกล่องของขวัญ",
    giftBadge: "ของขวัญเซอร์ไพรส์",
    giftTitle: "กล่องของขวัญมหัศจรรย์สำหรับเธอ",
    giftDesc: "สิ่งพิเศษถูกห่อไว้ด้วยความรักเพื่อวันเกิดของเธอ แตะที่กล่องเพื่อเปิดดูเลย!",
    giftTapHint: "แตะที่นี่เพื่อเปิดของขวัญ!",
    giftCongratsTitle: "ขอให้มีความสุขและโชคดีตลอดไป!",
    giftCongratsBody: "อายุเพิ่มขึ้นอีกหนึ่งปี นำพาโอกาสใหม่ๆ ความสุขที่ไม่มีที่สิ้นสุด และการเดินทางอันแสนวิเศษมาสู่เธอ!",
    giftSignature: "💝 ด้วยรักและปรารถนาดี",
    giftRewrap: "ห่อของขวัญใหม่",
    wishTitle: "คำอวยพรอันแสนอบอุ่น",
    wishText1: "ขอให้เธอมีวันเกิดที่เต็มไปด้วยรอยยิ้ม ความสุข และความสนุกสนาน ขอให้ทุกเป้าหมายที่ตั้งใจไว้ประสบความสำเร็จอย่างงดงาม",
    wishText2: "ขอบคุณที่เป็นเพื่อนที่ยอดเยี่ยมและสร้างพลังบวกให้ทุกคนรอบข้างเสมอ ขอให้มีสุขภาพแข็งแรง มีความสุข และร่ำรวยความรัก!",
    wishFromLabel: "ส่งคำอวยพรจาก:",
    wishFromDefault: "เพื่อนรักของเธอ",
    memoryBadge: "คุณค่าและความทรงจำ",
    memoryTitle: "สิ่งที่ยอดเยี่ยมเกี่ยวกับเธอ",
    mem1Title: "ร่าเริงเสมอ",
    mem1Text: "รอยยิ้มของเธอทำให้ทุกวันสดใสและอบอุ่นหัวใจเสมอ",
    mem2Title: "เข้มแข็งและกล้าหาญ",
    mem2Text: "เธอพร้อมเผชิญหน้าและก้าวผ่านทุกอุปสรรคได้อย่างสง่างาม",
    mem3Title: "ใจดีและอบอุ่น",
    mem3Text: "ความเมตตาและหัวใจอันอบอุ่นของเธอเป็นดั่งแสงสว่างให้คนรอบข้าง",
    mem4Title: "มีพรสวรรค์สูง",
    mem4Text: "เธอฉลาด มีความคิดสร้างสรรค์ และมีความสามารถมากกว่าที่คิด",
    mem5Title: "น่าเชื่อถือ",
    mem5Text: "เป็นเพื่อนแท้ที่อยู่เคียงข้างเสมอเมื่อต้องการกำลังใจ",
    mem6Title: "มุ่งมั่นและตั้งใจ",
    mem6Text: "ความหลงใหลในสิ่งที่ทำจะนำพาเธอไปสู่ความสำเร็จอันยิ่งใหญ่",
    boothTitle: "บูธภาพถ่ายความทรงจำ",
    boothDesc: "อัปโหลดภาพถ่ายของเธอเพื่อสร้างกรอบภาพที่ระลึกพร้อมสติกเกอร์น่ารัก!",
    boothChoosePhoto: "เลือกรูปภาพ",
    boothFrameStyle: "เลือกสไตล์กรอบ:",
    boothStickerLabel: "สติกเกอร์ปาร์ตี้ (แตะเพื่อติด):",
    boothClearStickers: "ลบสติกเกอร์",
    boothSavePhoto: "บันทึกภาพถ่าย",
    guestbookBadge: "สมุดอวยพรออนไลน์",
    guestbookTitle: "กำแพงคำอวยพรวันเกิด",
    guestbookDesc: "เขียนข้อความอวยพรอันอบอุ่นเพื่อร่วมฉลองวันพิเศษนี้!",
    guestFormName: "ชื่อของคุณ:",
    guestFormEmoji: "อีโมจิประจำตัว:",
    guestFormMsg: "คำอวยพรวันเกิด:",
    guestThemeColor: "โทนสีการ์ด:",
    guestSubmitBtn: "ส่งคำอวยพรทันที",
    musicBadge: "บทเพลงเฉลิมฉลอง",
    musicTitle: "สตูดิโอเสียงเพลงและปาร์ตี้",
    musicSelectLabel: "ทำนองเพลงที่ต้องการบรรเลง:",
    musicTrack1: "🎵 1. กล่องดนตรีและกระดิ่งแก้ว (Classic Music Box)",
    musicTrack2: "🎷 2. จังหวะแจ๊สรื่นเริง (Lively Jazz)",
    musicTrack3: "🎺 3. ฟานฟาร์เฉลิมฉลองอันสง่างาม (Royal Fanfare)",
    btnMusicPlay: "เล่นเพลงวันเกิด",
    btnMusicStop: "หยุดเพลง",
    sfxHeading: "แป้นเสียงเอฟเฟกต์ปาร์ตี้:",
    sfxHorn: "แตรปาร์ตี้",
    sfxPop: "ลูกโป่งแตก",
    sfxCheers: "ปรบมือและส่งเสียงเชียร์",
    sfxChimes: "เสียงกระดิ่งเวทมนตร์",
    footerFireworks: "จุดพลุดอกไม้ไฟสุดอลังการ!",
    footerText: "สร้างด้วย 💖 และความสุขในวันเกิด",
    modalTitle: "สร้างการ์ดวันเกิดส่งให้เพื่อน",
    modalIntro: "กรอกข้อมูลเพื่อสร้างลิงก์การ์ดวันเกิดสุดพิเศษและส่งต่อได้ทันที!",
    modalLabelRecipient: "ชื่อผู้รับ:",
    modalLabelAge: "อายุ (ไม่บังคับ):",
    modalLabelSender: "ชื่อผู้ส่ง (คุณ):",
    modalLabelPresets: "ข้อความสำเร็จรูป:",
    modalPresetWarm: "🥰 อบอุ่น",
    modalPresetFunny: "😂 สนุกสนาน",
    modalPresetInspire: "🚀 สร้างแรงบันดาลใจ",
    modalPresetRomantic: "💖 โรแมนติก",
    modalLabelMsg: "คำอวยพรพิเศษ:",
    modalLabelShareLink: "ลิงก์แชร์การ์ดวันเกิด:",
    modalBtnCopy: "คัดลอก",
    modalBtnPreview: "ดูตัวอย่าง",
    modalBtnCopyShare: "คัดลอกและแชร์",
    toastLinkCopied: "คัดลอกลิงก์การ์ดวันเกิดแล้ว! 📋",
    toastWishSent: "ส่งคำอวยพรขึ้นกำแพงเรียบร้อยแล้ว! 💌",
    toastCandlesBlown: "ยอดเยี่ยมมาก! เป่าเทียนดับหมดแล้ว! 🎉",
    toastPhotoSaved: "บันทึกภาพถ่ายที่ระลึกสำเร็จ! 📸"
  },
  zh: {
    pageTitle: "🎂 生日快乐！ 🎂",
    navBrand: "Birthday Magic",
    navMusic: "音乐",
    navPersonalize: "定制贺卡",
    recipientDefault: "属于你的特别日子",
    heroTitle: "Happy Birthday!",
    heroSubtitle: "祝亲爱的朋友生日快乐，愿一切美好与你相伴！",
    cakeAgeDefault: "灿烂新岁",
    candleInst: "点击火焰把蜡烛吹灭吧！ 🌬️",
    btnBlowAll: "吹灭所有蜡烛",
    btnRelight: "重新点亮蜡烛",
    btnMicBlow: "麦克风吹气",
    btnMicListening: "正在聆听吹气声... 🌬️",
    revealTitle: "愿望已传送至星空！ 🎉",
    revealText: "愿你在新的一岁里，所有的梦想和美好期许都能如愿以偿！ 🌟",
    heroScroll: "拆开生日礼物",
    giftBadge: "惊喜礼物",
    giftTitle: "为你准备的神秘礼物盒",
    giftDesc: "一份为你用心包装的专属生日惊喜，轻轻点击礼盒拆开它吧！",
    giftTapHint: "点击此处打开礼物！",
    giftCongratsTitle: "祝你新岁吉祥如意！",
    giftCongratsBody: "增长一岁意味着崭新的机遇、无尽的欢乐和未知的精彩旅程。愿你始终闪闪发光！",
    giftSignature: "💝 献上满满的爱",
    giftRewrap: "重新打包礼物",
    wishTitle: "真挚美好的生日祝福",
    wishText1: "祝你度过一个充满欢笑、温馨而美妙的生日！愿你所有的努力都能开花结果，所有热爱都能如愿奔赴。",
    wishText2: "感谢你一直以来带给身边的温暖与正能量。愿你在新的一年里健康平安、幸福常在、步步生辉！",
    wishFromLabel: "祝福来自：",
    wishFromDefault: "你亲密的好友们",
    memoryBadge: "美好品质与回忆",
    memoryTitle: "关于你的闪光品质",
    mem1Title: "总是明媚开朗",
    mem1Text: "你灿烂的笑容能驱散所有阴霾，温暖身边的每一个人。",
    mem2Title: "坚韧勇敢",
    mem2Text: "无论面对怎样的生活考验，你始终坚强前行、无所畏惧。",
    mem3Title: "善良温暖",
    mem3Text: "你真挚的心灵如春风拂面，传递着爱意与善意。",
    mem4Title: "才华横溢",
    mem4Text: "你聪颖且富有创意，拥有超乎想象的无穷潜力。",
    mem5Title: "忠诚可靠",
    mem5Text: "你是一位值得信赖的挚友，在需要时总会默默陪伴。",
    mem6Title: "热忱执着",
    mem6Text: "对理想的执着追求将引领你跨越山海，到达辉煌彼岸。",
    boothTitle: "生日回忆照相馆",
    boothDesc: "上传你或好友的照片，制作精美的相框纪念卡片并添加趣味贴纸！",
    boothChoosePhoto: "选择照片",
    boothFrameStyle: "相框风格：",
    boothStickerLabel: "派对贴纸（点击添加）：",
    boothClearStickers: "清除贴纸",
    boothSavePhoto: "保存照片",
    guestbookBadge: "在线留言簿",
    guestbookTitle: "生日祝福墙",
    guestbookDesc: "留下你温馨而诚挚的祝福，一同铭记这一刻的欢聚与感动！",
    guestFormName: "你的称呼：",
    guestFormEmoji: "头像表情：",
    guestFormMsg: "生日寄语：",
    guestThemeColor: "卡片主题：",
    guestSubmitBtn: "立即发布祝福",
    musicBadge: "庆典旋律",
    musicTitle: "音乐与欢庆工坊",
    musicSelectLabel: "演奏乐曲：",
    musicTrack1: "🎵 1. 经典八音盒与风铃 (Classic Music Box)",
    musicTrack2: "🎷 2. 欢快拉格泰姆爵士 (Lively Jazz)",
    musicTrack3: "🎺 3. 皇家庆典号角 (Royal Fanfare)",
    btnMusicPlay: "播放生日歌",
    btnMusicStop: "停止播放",
    sfxHeading: "派对氛围音效键盘：",
    sfxHorn: "派对号角",
    sfxPop: "气球爆破",
    sfxCheers: "掌声欢呼",
    sfxChimes: "魔法风铃",
    footerFireworks: "燃放盛大烟花！",
    footerText: "用满满的 💖 和欢喜精心制作",
    modalTitle: "制作专属生日贺卡",
    modalIntro: "输入收件人姓名，一键生成专属生日链接分享给TA！",
    modalLabelRecipient: "寿星姓名：",
    modalLabelAge: "年龄（选填）：",
    modalLabelSender: "送祝福人（你）：",
    modalLabelPresets: "快速祝福模板：",
    modalPresetWarm: "🥰 温馨",
    modalPresetFunny: "😂 幽默",
    modalPresetInspire: "🚀 励志",
    modalPresetRomantic: "💖 浪漫",
    modalLabelMsg: "专属祝福内容：",
    modalLabelShareLink: "专属贺卡链接：",
    modalBtnCopy: "复制链接",
    modalBtnPreview: "立即预览",
    modalBtnCopyShare: "复制并发送",
    toastLinkCopied: "生日贺卡链接已成功复制到剪贴板！ 📋",
    toastWishSent: "你的祝福已成功上墙！ 💌",
    toastCandlesBlown: "太棒了！所有蜡烛都已吹灭！ 🎉",
    toastPhotoSaved: "纪念照片已成功导出保存！ 📸"
  },
  ja: {
    pageTitle: "🎂 お誕生日おめでとう！ 🎂",
    navBrand: "Birthday Magic",
    navMusic: "音楽",
    navPersonalize: "カードを作成",
    recipientDefault: "あなたの特別な日",
    heroTitle: "Happy Birthday!",
    heroSubtitle: "大切なあなたへ、心からお誕生日おめでとうございます！",
    cakeAgeDefault: "輝かしい新しい一年",
    candleInst: "炎をタップしてろうそくを吹き消してね！ 🌬️",
    btnBlowAll: "全部吹き消す",
    btnRelight: "もう一度火をつける",
    btnMicBlow: "マイクで息を吹きかける",
    btnMicListening: "息の音を待機中... 🌬️",
    revealTitle: "願いが星空へと届きました！ 🎉",
    revealText: "あなたの新しい一年が、希望と笑顔と素晴らしい出会いで満ち溢れますように！ 🌟",
    heroScroll: "プレゼントを開ける",
    giftBadge: "サプライズギフト",
    giftTitle: "あなたへ贈る魔法のギフトボックス",
    giftDesc: "あなたのために心を込めて包んだ贈り物です。箱をタップして開けてみましょう！",
    giftTapHint: "ここをタップして開封！",
    giftCongratsTitle: "素晴らしい一年になりますように！",
    giftCongratsBody: "新しい年齢のスタートは、新しい冒険とたくさんの幸福の始まりです。いつでもあなたらしく輝いてください！",
    giftSignature: "💝 愛と感謝を込めて",
    giftRewrap: "もう一度包む",
    wishTitle: "心温まる誕生日のお祝い",
    wishText1: "笑顔と楽しさに満ちた素敵なお誕生日になりますように！思い描くすべての夢が最高の形で実を結びますように。",
    wishText2: "いつも周りを温かく照らし、元気を届けてくれてありがとう。健康で幸運に満ちた一年になりますように！",
    wishFromLabel: "送り主:",
    wishFromDefault: "大切な仲間たちより",
    memoryBadge: "素敵な魅力と思い出",
    memoryTitle: "あなたの素晴らしい魅力",
    mem1Title: "いつも明るい笑顔",
    mem1Text: "あなたの素敵な笑顔はみんなの一日をパッと明るくしてくれます。",
    mem2Title: "芯が強く前向き",
    mem2Text: "どんな壁に直面しても、いつも凛として乗り越えていく強さがあります。",
    mem3Title: "優しく温かい心",
    mem3Text: "思いやりと温もりで周囲の人々を優しく包み込んでくれます。",
    mem4Title: "豊かな才能",
    mem4Text: "あなたが思っている以上に聡明で、無限の可能性を秘めています。",
    mem5Title: "信頼できる存在",
    mem5Text: "困ったときにはいつも温かく寄り添ってくれるかけがえのない友です。",
    mem6Title: "情熱と挑戦心",
    mem6Text: "目標に向かってひたむきに進む姿はみんなに勇気を与えてくれます。",
    boothTitle: "思い出のフォトブース",
    boothDesc: "お気に入りの写真をアップロードして、特製フレームと可愛いシールで飾りましょう！",
    boothChoosePhoto: "写真を選択",
    boothFrameStyle: "フレーム選択:",
    boothStickerLabel: "パーティーステッカー（タップして配置）:",
    boothClearStickers: "シールを消去",
    boothSavePhoto: "写真を保存",
    guestbookBadge: "オンライン寄せ書き",
    guestbookTitle: "バースデーメッセージボード",
    guestbookDesc: "温かいお祝いメッセージを届けて、特別な記念日を一緒に彩りましょう！",
    guestFormName: "お名前:",
    guestFormEmoji: "アイコン:",
    guestFormMsg: "お祝いメッセージ:",
    guestThemeColor: "カード色:",
    guestSubmitBtn: "メッセージを投稿",
    musicBadge: "お祝いのメロディ",
    musicTitle: "音楽とパーティーのスタジオ",
    musicSelectLabel: "演奏するメロディ:",
    musicTrack1: "🎵 1. オルゴールとチャイム (Classic Music Box)",
    musicTrack2: "🎷 2. 陽気なジャズラグタイム (Lively Jazz)",
    musicTrack3: "🎺 3. 壮大なロイヤルファンファーレ (Royal Fanfare)",
    btnMusicPlay: "誕生日ソングを再生",
    btnMusicStop: "再生を停止",
    sfxHeading: "パーティー効果音キーボード:",
    sfxHorn: "パーティーホーン",
    sfxPop: "風船の破裂音",
    sfxCheers: "拍手と歓声",
    sfxChimes: "魔法のチャイム",
    footerFireworks: "豪華な花火を打ち上げる！",
    footerText: "いっぱいの 💖 と喜びを込めて制作",
    modalTitle: "友達に贈るバースデーカードを作成",
    modalIntro: "お相手のお名前を入力して、専用の誕生日リンクを今すぐ作成・送信しましょう！",
    modalLabelRecipient: "主役のお名前:",
    modalLabelAge: "年齢（任意）:",
    modalLabelSender: "送り主（あなた）:",
    modalLabelPresets: "定型メッセージ:",
    modalPresetWarm: "🥰 温かい",
    modalPresetFunny: "😂 楽しい",
    modalPresetInspire: "🚀 前向き",
    modalPresetRomantic: "💖 ロマンチック",
    modalLabelMsg: "オリジナルメッセージ:",
    modalLabelShareLink: "共有用カードリンク:",
    modalBtnCopy: "コピー",
    modalBtnPreview: "プレビュー",
    modalBtnCopyShare: "コピーして送信",
    toastLinkCopied: "バースデーカードのリンクをコピーしました！ 📋",
    toastWishSent: "メッセージが掲示板に投稿されました！ 💌",
    toastCandlesBlown: "お見事！すべてのろうそくが吹き消されました！ 🎉",
    toastPhotoSaved: "記念写真の保存が完了しました！ 📸"
  },
  es: {
    pageTitle: "🎂 ¡Feliz Cumpleaños! 🎂",
    navBrand: "Birthday Magic",
    navMusic: "Música",
    navPersonalize: "Personalizar Tarjeta",
    recipientDefault: "Tu Día Especial",
    heroTitle: "Happy Birthday!",
    heroSubtitle: "¡Deseándote un maravilloso cumpleaños, querido amigo!",
    cakeAgeDefault: "Nueva Edad Brillante",
    candleInst: "¡Toca la llama de cada vela para apagarla! 🌬️",
    btnBlowAll: "Apagar Todas las Velas",
    btnRelight: "Volver a Encender",
    btnMicBlow: "Soplar con Micrófono",
    btnMicListening: "Esperando soplido... 🌬️",
    revealTitle: "¡Tu deseo ha sido enviado a las estrellas! 🎉",
    revealText: "¡Que todos tus hermosos sueños y aspiraciones se hagan realidad en este nuevo año de vida! 🌟",
    heroScroll: "Abrir Regalo",
    giftBadge: "Regalo Sorpresa",
    giftTitle: "Una Caja Mágica Solo Para Ti",
    giftDesc: "Algo muy especial ha sido envuelto con cariño para tu cumpleaños. ¡Toca la caja para abrirla!",
    giftTapHint: "¡Toca aquí para abrir!",
    giftCongratsTitle: "¡Te Deseo Infinita Alegría!",
    giftCongratsBody: "Un año más representa nuevas oportunidades brillantes, felicidad sin límites y aventuras extraordinarias. ¡Sigue brillando!",
    giftSignature: "💝 Con todo mi cariño",
    giftRewrap: "Envolver de Nuevo",
    wishTitle: "Deseos Llenos de Amor",
    wishText1: "¡Te deseo un cumpleaños lleno de alegría, risas y momentos inolvidables! Que cada meta que anhelas florezca con éxito en los días por venir.",
    wishText2: "Gracias por ser una persona tan maravillosa y por iluminar la vida de quienes te rodean. ¡Te deseo mucha salud, amor y prosperidad!",
    wishFromLabel: "Con cariño de:",
    wishFromDefault: "Tus Queridos Amigos",
    memoryBadge: "Virtudes y Recuerdos",
    memoryTitle: "Tus Cualidades Extraordinarias",
    mem1Title: "Siempre Alegre",
    mem1Text: "Tu radiante sonrisa alegra cada instante y llena de energía positiva a todos.",
    mem2Title: "Valiente y Resiliente",
    mem2Text: "Siempre te mantienes firme y superas cada desafío con gran coraje.",
    mem3Title: "Corazón Bondadoso",
    mem3Text: "Tu ternura y sinceridad esparcen calidez y amor dondequiera que vas.",
    mem4Title: "Talentoso y Creativo",
    mem4Text: "Eres una persona brillante, ingeniosa y con un potencial mucho mayor de lo que imaginas.",
    mem5Title: "Digno de Confianza",
    mem5Text: "Un amigo leal que siempre está presente cuando más se le necesita.",
    mem6Title: "Apasionado y Decidido",
    mem6Text: "Tu entusiasmo constante te llevará a conquistar las cimas más altas.",
    boothTitle: "Cabina de Fotos y Recuerdos",
    boothDesc: "¡Sube tu foto favorita para crear una postal con marcos festivos y calcomanías divertidas!",
    boothChoosePhoto: "Elegir Foto",
    boothFrameStyle: "Estilo de Marco:",
    boothStickerLabel: "Calcomanías de Fiesta (toca para colocar):",
    boothClearStickers: "Limpiar Calcomanías",
    boothSavePhoto: "Guardar Foto",
    guestbookBadge: "Libro de Visitas",
    guestbookTitle: "Muro de Felicitaciones",
    guestbookDesc: "¡Escribe un mensaje cariñoso para conmemorar este día tan especial!",
    guestFormName: "Tu Nombre:",
    guestFormEmoji: "Avatar Emoji:",
    guestFormMsg: "Mensaje de Cumpleaños:",
    guestThemeColor: "Color de Tarjeta:",
    guestSubmitBtn: "Publicar Felicitación",
    musicBadge: "Melodías Festivas",
    musicTitle: "Estudio de Música y Fiesta",
    musicSelectLabel: "Melodía a interpretar:",
    musicTrack1: "🎵 1. Caja de Música y Campanadas (Classic Music Box)",
    musicTrack2: "🎷 2. Ragtime Festivo Animado (Lively Jazz)",
    musicTrack3: "🎺 3. Fanfarria Real de Gala (Royal Fanfare)",
    btnMusicPlay: "Reproducir Canción",
    btnMusicStop: "Detener Música",
    sfxHeading: "Teclado de Efectos de Sonido:",
    sfxHorn: "Corneta de fiesta",
    sfxPop: "Explosión de globo",
    sfxCheers: "Aplausos y vítores",
    sfxChimes: "Campanadas mágicas",
    footerFireworks: "¡Lanzar Gran Espectáculo de Fuegos Artificiales!",
    footerText: "Creado con puro 💖 y alegría de celebración",
    modalTitle: "Crear Tarjeta de Cumpleaños Personalizada",
    modalIntro: "¡Ingresa los datos del cumpleañero para generar un enlace único y enviárselo al instante!",
    modalLabelRecipient: "Nombre del Festejado:",
    modalLabelAge: "Edad (Opcional):",
    modalLabelSender: "De parte de (Tú):",
    modalLabelPresets: "Plantillas de Deseos:",
    modalPresetWarm: "🥰 Afectuoso",
    modalPresetFunny: "😂 Gracioso",
    modalPresetInspire: "🚀 Inspirador",
    modalPresetRomantic: "💖 Romántico",
    modalLabelMsg: "Mensaje Personalizado:",
    modalLabelShareLink: "Enlace para Compartir:",
    modalBtnCopy: "Copiar",
    modalBtnPreview: "Vista Previa",
    modalBtnCopyShare: "Copiar y Compartir",
    toastLinkCopied: "¡Enlace copiado al portapapeles! 📋",
    toastWishSent: "¡Tu mensaje ha sido fijado en el muro! 💌",
    toastCandlesBlown: "¡Genial! ¡Todas las velas han sido apagadas! 🎉",
    toastPhotoSaved: "¡Foto de recuerdo guardada con éxito! 📸"
  }
};

// ============================================================================
// 2. Global State & Safe Sanitization Utility
// ============================================================================
const state = {
  currentLang: 'vi',
  recipientName: '',
  senderName: '',
  age: null,
  customMessage: '',
  candlesCount: 5,
  candlesBlown: 0,
  isMusicPlaying: false,
  currentTrack: 'classic',
  soundFxEnabled: true,
  giftOpened: false,
  isListeningMic: false
};

/**
 * Escapes HTML characters to prevent Cross-Site Scripting (XSS)
 * Adheres to OWASP CWE-79 and SKILL_CUSTOM_1305 §7.1
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Non-intrusive floating toast notification system
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>✨</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// ============================================================================
// 3. Reactive Language Switching Engine
// ============================================================================
function updateLanguage(lang) {
  if (!translations[lang]) lang = 'vi';
  state.currentLang = lang;
  const t = translations[lang];

  document.documentElement.lang = lang;
  document.title = t.pageTitle;

  // Navigation
  const brandText = document.querySelector('.nav-brand .brand-text');
  if (brandText) brandText.textContent = t.navBrand;
  const musicLabel = document.querySelector('.nav-music-label');
  if (musicLabel) musicLabel.textContent = t.navMusic;
  const ctaText = document.querySelector('.nav-cta-text');
  if (ctaText) ctaText.textContent = t.navPersonalize;

  // Hero Section
  const recipientNameDisplay = document.getElementById('recipient-name-display');
  if (recipientNameDisplay) {
    recipientNameDisplay.textContent = state.recipientName 
      ? (lang === 'vi' ? `✨ Dành riêng cho ${state.recipientName} ✨` : `✨ Special Day for ${state.recipientName} ✨`)
      : t.recipientDefault;
  }
  const heroSubtitle = document.getElementById('main-hero-subtitle');
  if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;

  const cakeAgeDisplay = document.getElementById('cake-age-display');
  if (cakeAgeDisplay) {
    cakeAgeDisplay.textContent = state.age 
      ? `${state.age} ${lang === 'vi' ? 'Tuổi' : (lang === 'th' ? 'ปี' : (lang === 'zh' ? '岁' : (lang === 'ja' ? '歳' : 'Years')))}`
      : t.cakeAgeDefault;
  }

  const candleInstruction = document.getElementById('candle-instruction');
  if (candleInstruction) candleInstruction.textContent = t.candleInst;

  const blowAllText = document.querySelector('#blow-all-candles-btn .btn-text');
  if (blowAllText) blowAllText.textContent = t.btnBlowAll;
  const relightText = document.querySelector('#relight-candles-btn .btn-text');
  if (relightText) relightText.textContent = t.btnRelight;
  const micBlowText = document.querySelector('#mic-blow-btn .btn-text');
  if (micBlowText) micBlowText.textContent = state.isListeningMic ? t.btnMicListening : t.btnMicBlow;

  const revealTitle = document.getElementById('reveal-title');
  if (revealTitle) revealTitle.textContent = t.revealTitle;
  const revealText = document.getElementById('reveal-text');
  if (revealText) revealText.textContent = t.revealText;

  const heroScrollLabel = document.getElementById('hero-scroll-label');
  if (heroScrollLabel) heroScrollLabel.textContent = t.heroScroll;

  // Gift Section
  const giftBadgeTitle = document.getElementById('gift-badge-title');
  if (giftBadgeTitle) giftBadgeTitle.textContent = t.giftBadge;
  const giftSectionTitle = document.getElementById('gift-section-title');
  if (giftSectionTitle) giftSectionTitle.textContent = t.giftTitle;
  const giftSectionDesc = document.getElementById('gift-section-desc');
  if (giftSectionDesc) giftSectionDesc.textContent = t.giftDesc;
  const giftHintText = document.getElementById('gift-hint-text');
  if (giftHintText) giftHintText.textContent = t.giftTapHint;
  const polaroidCongratsTitle = document.getElementById('polaroid-congrats-title');
  if (polaroidCongratsTitle) polaroidCongratsTitle.textContent = t.giftCongratsTitle;
  const polaroidCongratsBody = document.getElementById('polaroid-congrats-body');
  if (polaroidCongratsBody) polaroidCongratsBody.textContent = t.giftCongratsBody;
  const polaroidFromDisplay = document.getElementById('polaroid-from-display');
  if (polaroidFromDisplay) {
    polaroidFromDisplay.textContent = state.senderName 
      ? `💝 ${t.wishFromLabel} ${state.senderName}` 
      : t.giftSignature;
  }
  const rewrapGiftLabel = document.getElementById('rewrap-gift-label');
  if (rewrapGiftLabel) rewrapGiftLabel.textContent = t.giftRewrap;

  // Wish Card
  const wishCardTitle = document.getElementById('wish-card-title');
  if (wishCardTitle) wishCardTitle.textContent = t.wishTitle;
  const wishBody1 = document.getElementById('wish-body-text-1');
  if (wishBody1) wishBody1.textContent = state.customMessage || t.wishText1;
  const wishBody2 = document.getElementById('wish-body-text-2');
  if (wishBody2) wishBody2.textContent = t.wishText2;
  const signFromLabel = document.getElementById('sign-from-label');
  if (signFromLabel) signFromLabel.textContent = t.wishFromLabel;
  const signNameDisplay = document.getElementById('sign-name-display');
  if (signNameDisplay) signNameDisplay.textContent = state.senderName || t.wishFromDefault;

  // Memory Qualities
  const memoryBadgeLabel = document.getElementById('memory-badge-label');
  if (memoryBadgeLabel) memoryBadgeLabel.textContent = t.memoryBadge;
  const memorySectionTitle = document.getElementById('memory-section-title');
  if (memorySectionTitle) memorySectionTitle.textContent = t.memoryTitle;

  const memKeys = ['mem1', 'mem2', 'mem3', 'mem4', 'mem5', 'mem6'];
  memKeys.forEach(k => {
    const elTitle = document.getElementById(`${k}-title`);
    const elText = document.getElementById(`${k}-text`);
    if (elTitle) elTitle.textContent = t[`${k}Title`];
    if (elText) elText.textContent = t[`${k}Text`];
  });

  // Photo Booth
  const boothTitle = document.getElementById('booth-title');
  if (boothTitle) boothTitle.textContent = t.boothTitle;
  const boothDesc = document.getElementById('booth-desc');
  if (boothDesc) boothDesc.textContent = t.boothDesc;
  const choosePhotoText = document.getElementById('choose-photo-btn-text');
  if (choosePhotoText) choosePhotoText.textContent = t.boothChoosePhoto;
  const frameStyleLabel = document.getElementById('frame-style-label');
  if (frameStyleLabel) frameStyleLabel.textContent = t.boothFrameStyle;
  const stickerPaletteLabel = document.getElementById('sticker-palette-label');
  if (stickerPaletteLabel) stickerPaletteLabel.textContent = t.boothStickerLabel;
  const clearStickersText = document.getElementById('clear-stickers-text');
  if (clearStickersText) clearStickersText.textContent = t.boothClearStickers;
  const savePhotoText = document.getElementById('save-photo-text');
  if (savePhotoText) savePhotoText.textContent = t.boothSavePhoto;

  // Guestbook
  const guestBadgeLabel = document.getElementById('guestbook-badge-label');
  if (guestBadgeLabel) guestBadgeLabel.textContent = t.guestbookBadge;
  const guestbookTitle = document.getElementById('guestbook-title');
  if (guestbookTitle) guestbookTitle.textContent = t.guestbookTitle;
  const guestbookDesc = document.getElementById('guestbook-desc');
  if (guestbookDesc) guestbookDesc.textContent = t.guestbookDesc;
  const formNameLabel = document.getElementById('form-name-label');
  if (formNameLabel) formNameLabel.textContent = t.guestFormName;
  const formEmojiLabel = document.getElementById('form-emoji-label');
  if (formEmojiLabel) formEmojiLabel.textContent = t.guestFormEmoji;
  const formMsgLabel = document.getElementById('form-msg-label');
  if (formMsgLabel) formMsgLabel.textContent = t.guestFormMsg;
  const themeColorLabel = document.getElementById('theme-color-label');
  if (themeColorLabel) themeColorLabel.textContent = t.guestThemeColor;
  const submitWishText = document.getElementById('submit-wish-text');
  if (submitWishText) submitWishText.textContent = t.guestSubmitBtn;

  // Music Studio
  const musicBadgeLabel = document.getElementById('music-badge-label');
  if (musicBadgeLabel) musicBadgeLabel.textContent = t.musicBadge;
  const musicTitle = document.getElementById('music-title');
  if (musicTitle) musicTitle.textContent = t.musicTitle;
  const trackSelectLabel = document.getElementById('track-select-label');
  if (trackSelectLabel) trackSelectLabel.textContent = t.musicSelectLabel;

  const trackSelect = document.getElementById('track-select');
  if (trackSelect && trackSelect.options.length >= 3) {
    trackSelect.options[0].textContent = t.musicTrack1;
    trackSelect.options[1].textContent = t.musicTrack2;
    trackSelect.options[2].textContent = t.musicTrack3;
  }

  const musicBtnText = document.getElementById('music-btn-text');
  if (musicBtnText) {
    musicBtnText.textContent = state.isMusicPlaying ? t.btnMusicStop : t.btnMusicPlay;
  }

  const sfxHeading = document.getElementById('sfx-board-heading');
  if (sfxHeading) sfxHeading.textContent = t.sfxHeading;
  const sfxLabelHorn = document.getElementById('sfx-label-horn');
  if (sfxLabelHorn) sfxLabelHorn.textContent = t.sfxHorn;
  const sfxLabelPop = document.getElementById('sfx-label-pop');
  if (sfxLabelPop) sfxLabelPop.textContent = t.sfxPop;
  const sfxLabelCheers = document.getElementById('sfx-label-cheers');
  if (sfxLabelCheers) sfxLabelCheers.textContent = t.sfxCheers;
  const sfxLabelChimes = document.getElementById('sfx-label-chimes');
  if (sfxLabelChimes) sfxLabelChimes.textContent = t.sfxChimes;

  // Footer
  const footerFireworksBtn = document.getElementById('footer-fireworks-btn-label');
  if (footerFireworksBtn) footerFireworksBtn.textContent = t.footerFireworks;
  const footerText = document.getElementById('footer-text');
  if (footerText) footerText.textContent = t.footerText;

  // Personalizer Modal
  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) modalTitle.textContent = t.modalTitle;
  const modalIntro = document.getElementById('modal-intro');
  if (modalIntro) modalIntro.textContent = t.modalIntro;
  const labelRecipient = document.getElementById('label-recipient-name');
  if (labelRecipient) labelRecipient.textContent = t.modalLabelRecipient;
  const labelAge = document.getElementById('label-custom-age');
  if (labelAge) labelAge.textContent = t.modalLabelAge;
  const labelSender = document.getElementById('label-sender-name');
  if (labelSender) labelSender.textContent = t.modalLabelSender;
  const labelPresets = document.getElementById('label-presets');
  if (labelPresets) labelPresets.textContent = t.modalLabelPresets;

  const btnWarm = document.getElementById('preset-btn-warm');
  if (btnWarm) btnWarm.textContent = t.modalPresetWarm;
  const btnFunny = document.getElementById('preset-btn-funny');
  if (btnFunny) btnFunny.textContent = t.modalPresetFunny;
  const btnInspire = document.getElementById('preset-btn-inspire');
  if (btnInspire) btnInspire.textContent = t.modalPresetInspire;
  const btnRomantic = document.getElementById('preset-btn-romantic');
  if (btnRomantic) btnRomantic.textContent = t.modalPresetRomantic;

  const labelMsg = document.getElementById('label-custom-message');
  if (labelMsg) labelMsg.textContent = t.modalLabelMsg;
  const labelShareLink = document.getElementById('label-share-link');
  if (labelShareLink) labelShareLink.textContent = t.modalLabelShareLink;
  const copyBtnText = document.getElementById('copy-btn-text');
  if (copyBtnText) copyBtnText.textContent = t.modalBtnCopy;
  const previewBtnText = document.getElementById('preview-btn-text');
  if (previewBtnText) previewBtnText.textContent = t.modalBtnPreview;
  const copyShareBtnText = document.getElementById('copy-share-btn-text');
  if (copyShareBtnText) copyShareBtnText.textContent = t.modalBtnCopyShare;

  // Re-render guestbook so pre-seeded items adapt if empty
  renderGuestbook();
}

// ============================================================================
// 4. Personalizer & Shareable Link Engine (XSS Protected)
// ============================================================================
function loadUrlPersonalization() {
  try {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const from = params.get('from');
    const age = params.get('age');
    const msg = params.get('msg');
    const lang = params.get('lang');

    if (lang && translations[lang]) {
      state.currentLang = lang;
      const langSelect = document.getElementById('lang-select');
      if (langSelect) langSelect.value = lang;
    }

    if (name) state.recipientName = name.trim().slice(0, 40);
    if (from) state.senderName = from.trim().slice(0, 40);
    if (age) {
      const parsedAge = parseInt(age, 10);
      if (!isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 120) {
        state.age = parsedAge;
      }
    }
    if (msg) state.customMessage = msg.trim().slice(0, 500);

    // Sync input fields in modal
    const inputRecipient = document.getElementById('custom-recipient-name');
    if (inputRecipient && state.recipientName) inputRecipient.value = state.recipientName;
    const inputAge = document.getElementById('custom-age');
    if (inputAge && state.age) inputAge.value = state.age;
    const inputSender = document.getElementById('custom-sender-name');
    if (inputSender && state.senderName) inputSender.value = state.senderName;
    const inputMsg = document.getElementById('custom-wish-message');
    if (inputMsg && state.customMessage) inputMsg.value = state.customMessage;

    updateGeneratedLink();
    updateLanguage(state.currentLang);

    if (name || msg) {
      setTimeout(() => {
        burstConfetti(100);
        launchFireworks(3);
      }, 700);
    }
  } catch (err) {
    console.warn('URL parsing notice:', err);
  }
}

function updateGeneratedLink() {
  const shareInput = document.getElementById('generated-share-link');
  if (!shareInput) return;

  const url = new URL(window.location.href);
  url.search = '';

  const recipient = document.getElementById('custom-recipient-name')?.value.trim();
  const age = document.getElementById('custom-age')?.value.trim();
  const sender = document.getElementById('custom-sender-name')?.value.trim();
  const msg = document.getElementById('custom-wish-message')?.value.trim();

  if (recipient) url.searchParams.set('name', recipient);
  if (age) url.searchParams.set('age', age);
  if (sender) url.searchParams.set('from', sender);
  if (msg) url.searchParams.set('msg', msg);
  if (state.currentLang !== 'vi') url.searchParams.set('lang', state.currentLang);

  shareInput.value = url.toString();
}

function applyPersonalization() {
  const recipient = document.getElementById('custom-recipient-name')?.value.trim() || '';
  const ageVal = parseInt(document.getElementById('custom-age')?.value, 10);
  const sender = document.getElementById('custom-sender-name')?.value.trim() || '';
  const msg = document.getElementById('custom-wish-message')?.value.trim() || '';

  state.recipientName = recipient.slice(0, 40);
  state.age = (!isNaN(ageVal) && ageVal > 0 && ageVal <= 120) ? ageVal : null;
  state.senderName = sender.slice(0, 40);
  state.customMessage = msg.slice(0, 500);

  updateLanguage(state.currentLang);
  updateGeneratedLink();

  // Close modal
  const modal = document.getElementById('personalizer-modal');
  if (modal) modal.style.display = 'none';

  burstConfetti(120);
  showToast(state.currentLang === 'vi' ? 'Đã áp dụng thiệp sinh nhật của bạn!' : 'Personalized birthday card applied!', 'success');
}

// ============================================================================
// 5. Interactive 3D Cake & Candle Blowing Experience
// ============================================================================
function setupCakeAndCandles() {
  const candles = document.querySelectorAll('.candle');
  state.candlesCount = candles.length;
  state.candlesBlown = 0;

  candles.forEach((candle, idx) => {
    candle.addEventListener('click', () => blowCandle(candle, idx));
  });

  const blowAllBtn = document.getElementById('blow-all-candles-btn');
  if (blowAllBtn) {
    blowAllBtn.addEventListener('click', blowAllCandles);
  }

  const relightBtn = document.getElementById('relight-candles-btn');
  if (relightBtn) {
    relightBtn.addEventListener('click', relightAllCandles);
  }

  const micBtn = document.getElementById('mic-blow-btn');
  if (micBtn) {
    micBtn.addEventListener('click', toggleMicDetection);
  }
}

function blowCandle(candle, idx) {
  const flame = candle.querySelector('.flame');
  if (flame && !flame.classList.contains('blown')) {
    flame.classList.add('blown');
    candle.classList.add('blown');
    state.candlesBlown++;

    playSfx('blow');

    if (state.candlesBlown >= state.candlesCount) {
      onAllCandlesBlown();
    }
  }
}

function blowAllCandles() {
  const candles = document.querySelectorAll('.candle');
  let delay = 0;
  candles.forEach((candle, idx) => {
    setTimeout(() => {
      blowCandle(candle, idx);
    }, delay);
    delay += 120;
  });
}

function relightAllCandles() {
  const candles = document.querySelectorAll('.candle');
  candles.forEach(candle => {
    const flame = candle.querySelector('.flame');
    if (flame) flame.classList.remove('blown');
    candle.classList.remove('blown');
  });
  state.candlesBlown = 0;

  const popup = document.getElementById('wish-reveal-popup');
  if (popup) popup.style.display = 'none';

  playSfx('chimes');
  showToast(state.currentLang === 'vi' ? 'Nến đã được thắp sáng lại! ✨' : 'Candles relit! ✨', 'gold');
}

function onAllCandlesBlown() {
  setTimeout(() => {
    const popup = document.getElementById('wish-reveal-popup');
    if (popup) {
      popup.style.display = 'block';
      popup.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    burstConfetti(160);
    launchFireworks(5);
    playSfx('cheers');
    showToast(translations[state.currentLang].toastCandlesBlown, 'success');
  }, 400);
}

/**
 * Microphone Audio Detection to blow out candles with real breath
 */
let micStream = null;
let micAudioCtx = null;
let micAnalyser = null;
let micAnimationId = null;

async function toggleMicDetection() {
  const micBtnText = document.querySelector('#mic-blow-btn .btn-text');
  const t = translations[state.currentLang];

  if (state.isListeningMic) {
    // Stop listening
    state.isListeningMic = false;
    if (micStream) micStream.getTracks().forEach(tr => tr.stop());
    if (micAudioCtx) micAudioCtx.close();
    cancelAnimationFrame(micAnimationId);
    if (micBtnText) micBtnText.textContent = t.btnMicBlow;
    return;
  }

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    micAnalyser = micAudioCtx.createAnalyser();
    micAnalyser.fftSize = 256;

    const source = micAudioCtx.createMediaStreamSource(micStream);
    source.connect(micAnalyser);

    state.isListeningMic = true;
    if (micBtnText) micBtnText.textContent = t.btnMicListening;
    showToast(state.currentLang === 'vi' ? 'Micro đã sẵn sàng! Hãy thổi vào micro thiết bị! 🌬️' : 'Microphone ready! Blow into the mic! 🌬️', 'info');

    const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);

    function checkBlow() {
      if (!state.isListeningMic) return;
      micAnalyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;

      // Blow breath threshold (typically triggers energetic white noise > 65)
      if (avg > 68) {
        blowAllCandles();
        // Pause briefly to avoid repeated triggers
        setTimeout(() => {
          if (state.isListeningMic) requestAnimationFrame(checkBlow);
        }, 1200);
        return;
      }

      micAnimationId = requestAnimationFrame(checkBlow);
    }

    checkBlow();
  } catch (err) {
    console.warn('Microphone permission or error:', err);
    showToast(state.currentLang === 'vi' ? 'Không thể truy cập micro. Bạn có thể nhấn nút để thổi nến!' : 'Microphone access denied. You can tap candles to blow!', 'gold');
    state.isListeningMic = false;
    if (micBtnText) micBtnText.textContent = t.btnMicBlow;
  }
}

// ============================================================================
// 6. Interactive 3D Surprise Gift Box
// ============================================================================
function setupGiftBox() {
  const giftBox = document.getElementById('gift-box');
  const revealedCard = document.getElementById('gift-revealed-card');
  const rewrapBtn = document.getElementById('rewrap-gift-btn');

  if (giftBox) {
    giftBox.addEventListener('click', () => {
      if (!state.giftOpened) {
        state.giftOpened = true;
        giftBox.classList.add('opened');

        playSfx('horn');
        burstConfetti(100);

        setTimeout(() => {
          if (revealedCard) {
            revealedCard.style.display = 'block';
            revealedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 600);
      }
    });

    // Keyboard accessibility
    giftBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        giftBox.click();
      }
    });
  }

  if (rewrapBtn) {
    rewrapBtn.addEventListener('click', () => {
      state.giftOpened = false;
      if (giftBox) giftBox.classList.remove('opened');
      if (revealedCard) revealedCard.style.display = 'none';
      playSfx('pop');
    });
  }
}

// ============================================================================
// 7. Interactive Photo Booth & Keepsake Export
// ============================================================================
function setupPhotoBooth() {
  const photoInput = document.getElementById('photo-file-input');
  const photoPreview = document.getElementById('user-photo-preview');
  const photoFrame = document.getElementById('photo-frame');
  const frameBtns = document.querySelectorAll('.frame-btn');
  const stickerBtns = document.querySelectorAll('.sticker-btn');
  const stickersLayer = document.getElementById('stickers-layer');
  const clearStickersBtn = document.getElementById('clear-stickers-btn');
  const savePhotoBtn = document.getElementById('save-photo-btn');

  // Photo Upload
  if (photoInput && photoPreview) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          photoPreview.src = evt.target.result;
          playSfx('pop');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Frame Styles
  frameBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      frameBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const styleClass = btn.getAttribute('data-frame');
      if (photoFrame) {
        photoFrame.className = `photo-frame ${styleClass}`;
      }
      playSfx('pop');
    });
  });

  // Stickers Palette
  stickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-sticker');
      if (stickersLayer && emoji) {
        const sticker = document.createElement('div');
        sticker.className = 'placed-sticker';
        sticker.textContent = emoji;
        sticker.style.left = `${Math.random() * 65 + 15}%`;
        sticker.style.top = `${Math.random() * 65 + 15}%`;

        // Click on placed sticker to remove
        sticker.addEventListener('click', () => {
          sticker.remove();
          playSfx('pop');
        });

        stickersLayer.appendChild(sticker);
        playSfx('pop');
      }
    });
  });

  if (clearStickersBtn && stickersLayer) {
    clearStickersBtn.addEventListener('click', () => {
      stickersLayer.innerHTML = '';
      playSfx('pop');
    });
  }

  // Save Keepsake Photo (Canvas Render)
  if (savePhotoBtn && photoPreview) {
    savePhotoBtn.addEventListener('click', () => {
      exportPhotoKeepsake();
    });
  }
}

function exportPhotoKeepsake() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');

  // Background card
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = document.getElementById('user-photo-preview');
  if (img && img.complete) {
    try {
      // Draw image in frame
      ctx.drawImage(img, 40, 40, 720, 520);
    } catch {
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(40, 40, 720, 520);
    }
  }

  // Draw Caption
  ctx.fillStyle = '#1a102f';
  ctx.font = 'bold 36px "Dancing Script", cursive, sans-serif';
  ctx.textAlign = 'center';
  const name = state.recipientName || 'Best Friend';
  ctx.fillText(`Happy Birthday ${name}! 🎉`, canvas.width / 2, 620);

  // Download
  try {
    const link = document.createElement('a');
    link.download = `Birthday-Keepsake-${name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(translations[state.currentLang].toastPhotoSaved, 'success');
  } catch {
    showToast('Snapshot ready! Long-press image to save.', 'info');
  }
}

// ============================================================================
// 8. Birthday Wishes Wall / Guestbook Engine
// ============================================================================
const GUESTBOOK_STORAGE_KEY = 'birthday_guestbook_wishes_v2';

const defaultWishes = {
  vi: [
    { id: 1, author: 'Bảo Trâm', emoji: '🎂', text: 'Chúc mừng sinh nhật bạn hiền! Tuổi mới luôn rạng ngời, may mắn ngập tràn và thành công rực rỡ nha!', theme: 'rose', likes: 12 },
    { id: 2, author: 'Hoàng Long', emoji: '🌟', text: 'Thêm tuổi mới thêm nhiều kỷ niệm đẹp và những chuyến đi thú vị nhé! Luôn kiên cường tỏa sáng!', theme: 'violet', likes: 9 },
    { id: 3, author: 'Tuấn Anh', emoji: '🚀', text: 'Chúc bạn tuổi mới bứt phá mọi mục tiêu, tiền tài danh vọng đều thăng hoa rực rỡ!', theme: 'sunset', likes: 15 }
  ],
  en: [
    { id: 1, author: 'Emma Watson', emoji: '🎂', text: 'Happiest birthday to one of the most wonderful souls! May your year ahead be pure magic!', theme: 'rose', likes: 14 },
    { id: 2, author: 'Lucas Miller', emoji: '🌟', text: 'Wishing you health, endless laughter, and boundless adventures in this new chapter!', theme: 'violet', likes: 8 },
    { id: 3, author: 'Sophia Chen', emoji: '💖', text: 'Keep inspiring everyone with your beautiful energy. Happy Birthday!', theme: 'emerald', likes: 19 }
  ]
};

function getStoredWishes() {
  try {
    const raw = localStorage.getItem(GUESTBOOK_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage notice:', e);
  }
  const langKey = (state.currentLang === 'vi') ? 'vi' : 'en';
  return defaultWishes[langKey] || defaultWishes.en;
}

function saveWishes(wishes) {
  try {
    localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(wishes));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

function renderGuestbook() {
  const grid = document.getElementById('wishes-wall-grid');
  if (!grid) return;

  const wishes = getStoredWishes();
  grid.innerHTML = '';

  wishes.forEach(item => {
    const tile = document.createElement('div');
    tile.className = `wish-tile theme-${item.theme || 'rose'}`;
    tile.innerHTML = `
      <div class="tile-header">
        <div class="tile-avatar">${item.emoji || '🎂'}</div>
        <div class="tile-meta">
          <div class="tile-author">${escapeHtml(item.author)}</div>
          <div class="tile-time">${state.currentLang === 'vi' ? 'Lời chúc sinh nhật' : 'Birthday Wish'}</div>
        </div>
      </div>
      <div class="tile-body">${escapeHtml(item.text)}</div>
      <div class="tile-footer">
        <button class="like-btn" data-id="${item.id}" aria-label="Thả tim lời chúc">
          <span class="heart-icon">💖</span>
          <span class="like-count">${item.likes || 0}</span>
        </button>
      </div>
    `;

    const likeBtn = tile.querySelector('.like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        item.likes = (item.likes || 0) + 1;
        likeBtn.classList.add('liked');
        likeBtn.querySelector('.like-count').textContent = item.likes;
        saveWishes(wishes);
        playSfx('pop');
      });
    }

    grid.appendChild(tile);
  });
}

function setupGuestbook() {
  renderGuestbook();

  const form = document.getElementById('new-wish-form');
  const msgInput = document.getElementById('guest-msg');
  const charDisplay = document.getElementById('current-char');
  const emojiBtns = document.querySelectorAll('.avatar-emoji-btn');
  const colorDots = document.querySelectorAll('.color-dot');

  let selectedEmoji = '🎂';
  let selectedTheme = 'rose';

  if (msgInput && charDisplay) {
    msgInput.addEventListener('input', () => {
      charDisplay.textContent = msgInput.value.length;
    });
  }

  emojiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      emojiBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedEmoji = btn.getAttribute('data-emoji') || '🎂';
      playSfx('pop');
    });
  });

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      selectedTheme = dot.getAttribute('data-color') || 'rose';
      playSfx('pop');
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('guest-name')?.value.trim();
      const text = msgInput?.value.trim();

      if (!author || !text) return;

      const wishes = getStoredWishes();
      const newWish = {
        id: Date.now(),
        author: author.slice(0, 40),
        emoji: selectedEmoji,
        text: text.slice(0, 300),
        theme: selectedTheme,
        likes: 1
      };

      wishes.unshift(newWish);
      saveWishes(wishes);
      renderGuestbook();

      form.reset();
      if (charDisplay) charDisplay.textContent = '0';

      burstConfetti(80);
      playSfx('chimes');
      showToast(translations[state.currentLang].toastWishSent, 'success');
    });
  }
}

// ============================================================================
// 9. Polyphonic Web Audio Synthesizer & Soundboard Engine (Zero Dependencies)
// ============================================================================
let audioCtx = null;
let currentOscillators = [];
let musicStopTimeout = null;

// Melodies Frequencies & Timings (Hz, Duration in seconds)
const MELODIES = {
  // 1. Classic Happy Birthday
  classic: [
    { freq: 261.63, dur: 0.35, chord: 130.81 }, // C4
    { freq: 261.63, dur: 0.2, chord: 130.81 },
    { freq: 293.66, dur: 0.55, chord: 146.83 }, // D4
    { freq: 261.63, dur: 0.55, chord: 130.81 }, // C4
    { freq: 349.23, dur: 0.55, chord: 174.61 }, // F4
    { freq: 329.63, dur: 0.95, chord: 164.81 }, // E4

    { freq: 261.63, dur: 0.35, chord: 130.81 },
    { freq: 261.63, dur: 0.2, chord: 130.81 },
    { freq: 293.66, dur: 0.55, chord: 146.83 },
    { freq: 261.63, dur: 0.55, chord: 130.81 },
    { freq: 392.00, dur: 0.55, chord: 196.00 }, // G4
    { freq: 349.23, dur: 0.95, chord: 174.61 }, // F4

    { freq: 261.63, dur: 0.35, chord: 130.81 },
    { freq: 261.63, dur: 0.2, chord: 130.81 },
    { freq: 523.25, dur: 0.55, chord: 261.63 }, // C5
    { freq: 440.00, dur: 0.55, chord: 220.00 }, // A4
    { freq: 349.23, dur: 0.55, chord: 174.61 }, // F4
    { freq: 329.63, dur: 0.55, chord: 164.81 }, // E4
    { freq: 293.66, dur: 0.75, chord: 146.83 }, // D4

    { freq: 466.16, dur: 0.35, chord: 233.08 }, // Bb4
    { freq: 466.16, dur: 0.2, chord: 233.08 },
    { freq: 440.00, dur: 0.55, chord: 220.00 }, // A4
    { freq: 349.23, dur: 0.55, chord: 174.61 }, // F4
    { freq: 392.00, dur: 0.55, chord: 196.00 }, // G4
    { freq: 349.23, dur: 1.15, chord: 174.61 }  // F4
  ],
  // 2. Upbeat Ragtime / Jazz Celebration
  jazz: [
    { freq: 392.00, dur: 0.25, chord: 196.00 },
    { freq: 440.00, dur: 0.25, chord: 220.00 },
    { freq: 493.88, dur: 0.25, chord: 246.94 },
    { freq: 523.25, dur: 0.45, chord: 261.63 },
    { freq: 392.00, dur: 0.25, chord: 196.00 },
    { freq: 523.25, dur: 0.45, chord: 261.63 },
    { freq: 587.33, dur: 0.35, chord: 293.66 },
    { freq: 523.25, dur: 0.35, chord: 261.63 },
    { freq: 493.88, dur: 0.35, chord: 246.94 },
    { freq: 440.00, dur: 0.55, chord: 220.00 },
    { freq: 523.25, dur: 0.75, chord: 261.63 }
  ],
  // 3. Royal Celebration Fanfare
  fanfare: [
    { freq: 261.63, dur: 0.2, chord: 130.81 },
    { freq: 329.63, dur: 0.2, chord: 164.81 },
    { freq: 392.00, dur: 0.45, chord: 196.00 },
    { freq: 392.00, dur: 0.2, chord: 196.00 },
    { freq: 523.25, dur: 0.8, chord: 261.63 },
    { freq: 392.00, dur: 0.25, chord: 196.00 },
    { freq: 523.25, dur: 1.1, chord: 261.63 }
  ]
};

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playPolyNote(ctx, freq, chordFreq, startTime, duration) {
  // Main Lead Melody Oscillator
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, startTime);

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);

  // ADSR Envelope
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.28, startTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration - 0.02);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
  currentOscillators.push(osc);

  // Harmonizing Sub-chord Oscillator
  if (chordFreq) {
    const chordOsc = ctx.createOscillator();
    const chordGain = ctx.createGain();

    chordOsc.type = 'sine';
    chordOsc.frequency.setValueAtTime(chordFreq, startTime);

    chordGain.gain.setValueAtTime(0, startTime);
    chordGain.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
    chordGain.gain.exponentialRampToValueAtTime(0.005, startTime + duration - 0.02);

    chordOsc.connect(chordGain);
    chordGain.connect(ctx.destination);

    chordOsc.start(startTime);
    chordOsc.stop(startTime + duration);
    currentOscillators.push(chordOsc);
  }
}

function playMelody() {
  const ctx = getAudioContext();
  const trackKey = state.currentTrack || 'classic';
  const notes = MELODIES[trackKey] || MELODIES.classic;

  stopMelody();

  state.isMusicPlaying = true;
  updateMusicUi(true);

  let currentTime = ctx.currentTime + 0.1;
  const loopCount = trackKey === 'classic' ? 2 : 3;

  for (let r = 0; r < loopCount; r++) {
    notes.forEach(n => {
      playPolyNote(ctx, n.freq, n.chord, currentTime, n.dur);
      currentTime += n.dur + 0.04;
    });
    currentTime += 0.4;
  }

  const totalSeconds = currentTime - ctx.currentTime;
  musicStopTimeout = setTimeout(() => {
    stopMelody();
  }, totalSeconds * 1000);
}

function stopMelody() {
  state.isMusicPlaying = false;
  updateMusicUi(false);

  if (musicStopTimeout) {
    clearTimeout(musicStopTimeout);
    musicStopTimeout = null;
  }

  currentOscillators.forEach(osc => {
    try { osc.stop(); } catch (e) { /* ignore already stopped */ }
  });
  currentOscillators = [];
}

function updateMusicUi(isPlaying) {
  const musicVisualizer = document.getElementById('musicVisualizer');
  const navMusicBtn = document.getElementById('nav-music-btn');
  const musicBtnText = document.getElementById('music-btn-text');
  const playIcon = document.getElementById('music-play-icon');

  if (isPlaying) {
    if (musicVisualizer) musicVisualizer.classList.add('playing');
    if (navMusicBtn) navMusicBtn.classList.add('playing');
    if (playIcon) playIcon.textContent = '⏸️';
    if (musicBtnText) musicBtnText.textContent = translations[state.currentLang].btnMusicStop;
  } else {
    if (musicVisualizer) musicVisualizer.classList.remove('playing');
    if (navMusicBtn) navMusicBtn.classList.remove('playing');
    if (playIcon) playIcon.textContent = '▶️';
    if (musicBtnText) musicBtnText.textContent = translations[state.currentLang].btnMusicPlay;
  }
}

/**
 * Procedural Party SFX Soundboard
 */
function playSfx(type) {
  if (!state.soundFxEnabled) return;
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  switch (type) {
    case 'blow': {
      // Filtered white noise breath puff
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(2.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      break;
    }
    case 'horn': {
      // Party Horn Pitch Sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.35);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
      break;
    }
    case 'pop': {
      // Balloon Pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
      break;
    }
    case 'cheers': {
      // Crowd Cheer simulation with noise burst + chord
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.05);

        gain.gain.setValueAtTime(0.15, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + 0.65);
      });
      break;
    }
    case 'chimes': {
      // Magic sparkle pentatonic chime arpeggio
      const chimes = [523.25, 659.25, 783.99, 1046.50];
      chimes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.55);
      });
      break;
    }
  }
}

function setupAudioEngine() {
  const musicBtn = document.getElementById('musicBtn');
  const navMusicBtn = document.getElementById('nav-music-btn');
  const trackSelect = document.getElementById('track-select');
  const sfxToggle = document.getElementById('sfx-toggle');

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (state.isMusicPlaying) {
        stopMelody();
      } else {
        playMelody();
      }
    });
  }

  if (navMusicBtn) {
    navMusicBtn.addEventListener('click', () => {
      if (state.isMusicPlaying) {
        stopMelody();
      } else {
        playMelody();
      }
    });
  }

  if (trackSelect) {
    trackSelect.addEventListener('change', (e) => {
      state.currentTrack = e.target.value;
      if (state.isMusicPlaying) {
        playMelody(); // Restart with new track
      }
    });
  }

  if (sfxToggle) {
    sfxToggle.addEventListener('click', () => {
      state.soundFxEnabled = !state.soundFxEnabled;
      const icon = document.getElementById('sfx-icon');
      if (icon) icon.textContent = state.soundFxEnabled ? '🔊' : '🔇';
      showToast(state.soundFxEnabled ? 'Âm thanh đã bật! 🔊' : 'Đã tắt âm thanh! 🔇', 'info');
    });
  }

  // SFX Pad Buttons
  document.getElementById('sfx-btn-horn')?.addEventListener('click', () => playSfx('horn'));
  document.getElementById('sfx-btn-pop')?.addEventListener('click', () => playSfx('pop'));
  document.getElementById('sfx-btn-cheers')?.addEventListener('click', () => playSfx('cheers'));
  document.getElementById('sfx-btn-chimes')?.addEventListener('click', () => playSfx('chimes'));
}

// ============================================================================
// 10. Visual FX Engines: Canvas Confetti & Grand Fireworks
// ============================================================================

// --- Confetti Engine ---
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas?.getContext('2d');
const confettiColors = ['#ff6b9d', '#ffd166', '#a29bfe', '#00f0ff', '#06d6a0', '#ff758c', '#ffffff'];

class ConfettiPiece {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.reset();
  }
  reset() {
    this.x = Math.random() * this.w;
    this.y = -20;
    this.size = Math.random() * 8 + 5;
    this.speedY = Math.random() * 2.2 + 1.2;
    this.speedX = Math.random() * 2 - 1;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 5 - 2.5;
    this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
    this.opacity = Math.random() * 0.6 + 0.4;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.015) * 0.4;
    this.rotation += this.rotationSpeed;
    if (this.y > this.h + 20) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

let confettiPieces = [];
let burstPieces = [];

function initConfetti() {
  if (!confettiCanvas || !confettiCtx) return;
  function resize() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  confettiPieces = [];
  for (let i = 0; i < 50; i++) {
    const piece = new ConfettiPiece(confettiCanvas.width, confettiCanvas.height);
    piece.y = Math.random() * confettiCanvas.height;
    confettiPieces.push(piece);
  }

  function loop() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces.forEach(p => {
      p.update();
      p.draw(confettiCtx);
    });

    for (let i = burstPieces.length - 1; i >= 0; i--) {
      const b = burstPieces[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.15; // gravity
      b.opacity -= 0.012;
      b.rotation += b.rotSpeed;

      if (b.opacity <= 0) {
        burstPieces.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.translate(b.x, b.y);
      confettiCtx.rotate((b.rotation * Math.PI) / 180);
      confettiCtx.globalAlpha = Math.max(0, b.opacity);
      confettiCtx.fillStyle = b.color;
      confettiCtx.fillRect(-b.size / 2, -b.size / 4, b.size, b.size / 2);
      confettiCtx.restore();
    }

    requestAnimationFrame(loop);
  }
  loop();
}

function burstConfetti(count = 90) {
  if (!confettiCanvas) return;
  const centerX = confettiCanvas.width / 2;
  const centerY = confettiCanvas.height * 0.45;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const velocity = Math.random() * 9 + 4;
    burstPieces.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * velocity + (Math.random() * 2 - 1),
      vy: Math.sin(angle) * velocity - 4,
      size: Math.random() * 11 + 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 12 - 6,
      opacity: 1
    });
  }
}

// --- Multi-burst Fireworks Physics Engine ---
const fireworksCanvas = document.getElementById('fireworks-canvas');
const fireworksCtx = fireworksCanvas?.getContext('2d');
let fireworksParticles = [];

class FireworkParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    this.gravity = 0.08;
    this.trail = [];
  }
  update() {
    this.trail.push({ x: this.x, y: this.y, a: this.alpha });
    if (this.trail.length > 4) this.trail.shift();

    this.vx *= 0.96;
    this.vy *= 0.96;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }
  draw(ctx) {
    // Draw trail
    this.trail.forEach(t => {
      ctx.beginPath();
      ctx.arc(t.x, t.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = t.a * 0.4;
      ctx.fill();
    });

    // Draw particle head
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function initFireworks() {
  if (!fireworksCanvas || !fireworksCtx) return;
  function resize() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function loop() {
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    for (let i = fireworksParticles.length - 1; i >= 0; i--) {
      const p = fireworksParticles[i];
      p.update();
      p.draw(fireworksCtx);
      if (p.alpha <= 0) {
        fireworksParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(loop);
  }
  loop();
}

function launchFireworks(bursts = 3) {
  if (!fireworksCanvas) return;
  const colors = ['#ff6b9d', '#ffd166', '#00f0ff', '#06d6a0', '#a29bfe', '#ff477e'];

  for (let b = 0; b < bursts; b++) {
    setTimeout(() => {
      const x = Math.random() * (fireworksCanvas.width * 0.8) + (fireworksCanvas.width * 0.1);
      const y = Math.random() * (fireworksCanvas.height * 0.5) + (fireworksCanvas.height * 0.1);
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < 65; i++) {
        fireworksParticles.push(new FireworkParticle(x, y, color));
      }
      playSfx('pop');
    }, b * 320);
  }
}

// --- Floating Balloon Emojis Generator ---
const balloonEmojis = ['🎈', '🎈', '🎈', '🎀', '⭐', '💫', '🌟', '💖', '🎉'];

function createFloatingBalloon() {
  const container = document.getElementById('balloons');
  if (!container) return;

  const b = document.createElement('div');
  b.className = 'balloon';
  b.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
  b.style.left = `${Math.random() * 95}%`;
  b.style.animationDuration = `${Math.random() * 5 + 9}s`;
  b.style.fontSize = `${Math.random() * 1.5 + 2.2}rem`;
  container.appendChild(b);

  setTimeout(() => b.remove(), 15000);
}

function initBalloons() {
  for (let i = 0; i < 4; i++) {
    setTimeout(createFloatingBalloon, i * 1800);
  }
  setInterval(createFloatingBalloon, 4000);
}

// ============================================================================
// 11. Scroll Animations & Intersection Observer
// ============================================================================
function initScrollObserver() {
  const targets = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

// ============================================================================
// 12. Modal & Event Listeners Initialization
// ============================================================================
function setupModal() {
  const modal = document.getElementById('personalizer-modal');
  const openBtn = document.getElementById('open-personalizer-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const previewBtn = document.getElementById('preview-card-btn');
  const copyShareBtn = document.getElementById('copy-and-share-btn');
  const copyLinkBtn = document.getElementById('copy-link-btn');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      updateGeneratedLink();
      modal.style.display = 'flex';
      playSfx('pop');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // Close on outside click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // Preset Buttons
  const presetPills = document.querySelectorAll('.preset-pill');
  const customWishMsg = document.getElementById('custom-wish-message');
  const presetsMap = {
    warm: {
      vi: "Chúc bạn tuổi mới luôn an yên, mạnh khỏe và được bao bọc trong tình yêu thương ấm áp của gia đình và bạn bè!",
      en: "Wishing you peace, radiant health, and boundless warmth surrounded by the ones who cherish you most!",
      th: "ขอให้เธอมีสุขภาพที่แข็งแรง มีความสุขและอบอุ่นหัวใจในทุกๆ วันของชีวิต!",
      zh: "愿你新的一岁健康平安，被爱包围，岁岁常欢愉，万事皆顺意！",
      ja: "新しい一年が温かい愛とたくさんの笑顔で満たされますように！",
      es: "¡Te deseo paz, salud radiante y mucho amor rodeado de las personas que más te quieren!"
    },
    funny: {
      vi: "Chúc mừng sinh nhật! Thêm một tuổi chỉ là thêm chút kinh nghiệm ngầu hơn thôi, không hề già đi nhé!",
      en: "Happy Birthday! You are not getting older, you are just leveling up into a legendary vintage masterpiece!",
      th: "สุขสันต์วันเกิด! อายุเพิ่มขึ้นก็แค่เก่งขึ้นและเท่ขึ้นอีกระดับ ไม่ได้แก่ลงเลย!",
      zh: "生日快乐！年龄不过是个数字，今天起你就是限量珍藏版传奇大师！",
      ja: "お誕生日おめでとう！年を取ったんじゃない、伝説のマスターピースにレベルアップしただけだよ！",
      es: "¡Feliz cumpleaños! No te estás haciendo mayor, solo estás subiendo de nivel como una obra maestra!"
    },
    inspirational: {
      vi: "Chúc bạn luôn giữ vững ngọn lửa nhiệt huyết, tự tin vượt qua mọi sóng gió để chạm đến những đỉnh cao rực rỡ!",
      en: "May your fiery passion light the way to conquering every bold peak and turning every dream into triumphant reality!",
      th: "ขอให้เปลวไฟแห่งความมุ่งมั่นนำพาเธอไปสู่ความสำเร็จอันยิ่งใหญ่ในทุกย่างก้าว!",
      zh: "愿你胸怀壮志，乘风破浪，在新的一岁里书写属于自己的辉煌篇章！",
      ja: "情熱の炎を胸に、どんな困難も乗り越えて栄光の頂点を掴み取ってください！",
      es: "¡Que tu pasión indomable te guíe para conquistar cada cima y convertir cada sueño en realidad!"
    },
    romantic: {
      vi: "Cảm ơn vì đã xuất hiện và làm thế giới này trở nên dịu dàng, rực rỡ hơn. Chúc mừng sinh nhật người đặc biệt!",
      en: "Thank you for existing and making this world a infinitely brighter, softer place. Happy birthday, special one!",
      th: "ขอบคุณที่เข้ามาทำให้โลกนี้น่าอยู่และสดใสขึ้น สุขสันต์วันเกิดคนพิเศษ!",
      zh: "感谢你的出现，让世界变得更加温柔而明媚。亲爱的，生日快乐！",
      ja: "あなたがいてくれるだけで世界はこんなにも優しい。特別なお誕生日おめでとう！",
      es: "¡Gracias por existir y hacer que este mundo sea infinitamente más brillante! ¡Feliz cumpleaños, persona especial!"
    }
  };

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const type = pill.getAttribute('data-preset');
      const lang = state.currentLang;
      if (customWishMsg && presetsMap[type]) {
        customWishMsg.value = presetsMap[type][lang] || presetsMap[type].en;
        updateGeneratedLink();
        playSfx('pop');
      }
    });
  });

  // Modal input listeners for real-time link update
  ['custom-recipient-name', 'custom-age', 'custom-sender-name', 'custom-wish-message'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateGeneratedLink);
  });

  if (previewBtn) {
    previewBtn.addEventListener('click', applyPersonalization);
  }

  function copyShareLink() {
    const input = document.getElementById('generated-share-link');
    if (input) {
      input.select();
      navigator.clipboard.writeText(input.value).then(() => {
        showToast(translations[state.currentLang].toastLinkCopied, 'success');
        playSfx('chimes');
      }).catch(() => {
        showToast('Link ready! Please copy manually.', 'info');
      });
    }
  }

  if (copyLinkBtn) copyLinkBtn.addEventListener('click', copyShareLink);
  if (copyShareBtn) {
    copyShareBtn.addEventListener('click', () => {
      applyPersonalization();
      copyShareLink();
    });
  }

  // Footer Fireworks button
  document.getElementById('celebrate-footer-btn')?.addEventListener('click', () => {
    launchFireworks(6);
    burstConfetti(140);
  });
}

// ============================================================================
// 13. DOM Ready Initialization
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  // 1. Language selector setup
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      updateLanguage(e.target.value);
      try { localStorage.setItem('birthday_lang_pref', e.target.value); } catch (_) {}
    });

    const savedLang = localStorage.getItem('birthday_lang_pref') || 'vi';
    langSelect.value = savedLang;
    state.currentLang = savedLang;
  }

  // 2. Initialize visual FX
  initConfetti();
  initFireworks();
  initBalloons();
  initScrollObserver();

  // 3. Setup core interactive components
  setupCakeAndCandles();
  setupGiftBox();
  setupPhotoBooth();
  setupGuestbook();
  setupAudioEngine();
  setupModal();

  // 4. Parse URL params and apply localization
  loadUrlPersonalization();
});

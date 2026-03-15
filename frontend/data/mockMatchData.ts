import { MatchBill, MatchComment } from "../types";

// A representative list of 10 bills reflecting diverse categories to test party alignment
export const mockBills: MatchBill[] = [
    {
        id: "b1",
        title: "ร่าง พ.ร.บ. สมรสเท่าเทียม",
        description: "ให้สิทธิบุคคลทุกเพศสามารถสมรสกันได้อย่างเท่าเทียมตามกฎหมาย พร้อมสวัสดิการคู่สมรส",
        category: "สังคม",
        userAgreementPct: 82,
        partyStances: {
            "ประชาชน": "yes",
            "เพื่อไทย": "yes",
            "ภูมิใจไทย": "yes",
            "ประชาธิปัตย์": "yes",
            "รวมไทยสร้างชาติ": "yes",
            "พลังประชารัฐ": "yes",
            "ประชาชาติ": "no", // Assuming some diversity in stances for calculation testing
        }
    },
    {
        id: "b2",
        title: "ร่าง พ.ร.บ. อากาศสะอาด",
        description: "มาตรการจัดการฝุ่น PM2.5 คุมเข้มมลพิษข้ามพรมแดนและโรงงานอุตสาหกรรม",
        category: "สิ่งแวดล้อม",
        userAgreementPct: 95,
        partyStances: {
            "ประชาชน": "yes",
            "เพื่อไทย": "yes",
            "ภูมิใจไทย": "yes",
            "ประชาธิปัตย์": "yes",
            "รวมไทยสร้างชาติ": "yes",
            "พลังประชารัฐ": "yes",
            "ประชาชาติ": "yes",
        }
    },
    {
        id: "b3",
        title: "ร่าง พ.ร.บ. สุราก้าวหน้า",
        description: "ปลดล็อกทุนผูกขาด เปิดเสรีให้รายย่อยสามารถผลิตและจำหน่ายเครื่องดื่มแอลกอฮอล์ได้",
        category: "เศรษฐกิจ",
        userAgreementPct: 75,
        partyStances: {
            "ประชาชน": "yes",
            "เพื่อไทย": "yes",
            "ภูมิใจไทย": "no",
            "ประชาธิปัตย์": "no",
            "รวมไทยสร้างชาติ": "no",
            "พลังประชารัฐ": "no",
            "ประชาชาติ": "no",
        }
    },
    {
        id: "b4",
        title: "ร่าง พ.ร.บ. จัดระเบียบกระทรวงกลาโหม",
        description: "ปรับโครงสร้างกองทัพ ป้องกันการรัฐประหาร ตัดอำนาจศาลทหารในเวลาปกติ",
        category: "การเมือง",
        userAgreementPct: 68,
        partyStances: {
            "ประชาชน": "yes",
            "เพื่อไทย": "no", // Mock stances
            "ภูมิใจไทย": "no",
            "ประชาธิปัตย์": "no",
            "รวมไทยสร้างชาติ": "no",
            "พลังประชารัฐ": "no",
            "ประชาชาติ": "yes",
        }
    },
    {
        id: "b5",
        title: "ร่าง พ.ร.บ. เงินอุดหนุนเด็กเล็กถ้วนหน้า",
        description: "ให้สวัสดิการเด็กแรกเกิดถึง 6 ปี แบบถ้วนหน้า 3,000 บาท/เดือน",
        category: "สวัสดิการ",
        userAgreementPct: 89,
        partyStances: {
            "ประชาชน": "yes",
            "เพื่อไทย": "yes",
            "ภูมิใจไทย": "yes",
            "ประชาธิปัตย์": "yes",
            "รวมไทยสร้างชาติ": "yes",
            "พลังประชารัฐ": "yes",
            "ประชาชาติ": "yes",
        }
    },
    {
        id: "b6",
        title: "ร่าง พ.ร.บ. ยกเลิกเกณฑ์ทหาร",
        description: "เปลี่ยนระบบเกณฑ์ทหารเป็นการสมัครใจ 100% พร้อมปรับสวัสดิการพลทหาร",
        category: "การเมือง",
        userAgreementPct: 72,
        partyStances: {
            "ประชาชน": "yes",
            "เพื่อไทย": "no",
            "ภูมิใจไทย": "no",
            "ประชาธิปัตย์": "no",
            "รวมไทยสร้างชาติ": "no",
            "พลังประชารัฐ": "no",
            "ประชาชาติ": "yes",
        }
    },
    {
        id: "b7",
        title: "ร่าง พ.ร.บ. กระจายอำนาจสู่ท้องถิ่น",
        description: "เลือกตั้งผู้ว่าราชการจังหวัดทั่วประเทศ ปลดล็อกงบประมาณให้จัดสรรในพื้นที่",
        category: "การเมือง",
        userAgreementPct: 65,
        partyStances: {
            "ประชาชน": "yes",
            "เพื่อไทย": "yes",
            "ภูมิใจไทย": "yes",
            "ประชาธิปัตย์": "yes",
            "รวมไทยสร้างชาติ": "no",
            "พลังประชารัฐ": "no",
            "ประชาชาติ": "yes",
        }
    },
    {
        id: "b8",
        title: "ร่าง พ.ร.บ. คุ้มครองแรงงาน",
        description: "ทำงานไม่เกิน 40 ชม./สัปดาห์ ปรับค่าขึ้นและเพิ่มวันหยุดพักผ่อน",
        category: "แรงงาน",
        userAgreementPct: 88,
        partyStances: {
            "ก้าวไกล": "yes",
            "เพื่อไทย": "yes",
            "ภูมิใจไทย": "no",
            "ประชาธิปัตย์": "yes",
            "รวมไทยสร้างชาติ": "yes",
            "พลังประชารัฐ": "yes",
            "ประชาชาติ": "yes",
        }
    },
    {
        id: "b9",
        title: "ร่าง พ.ร.บ. ค่าแรงขั้นต่ำตามเงินเฟ้อ",
        description: "ปรับขึ้นค่าแรงอัตโนมัติอิงค่าครองชีพรายปี",
        category: "เศรษฐกิจ",
        userAgreementPct: 91,
        partyStances: {
            "ก้าวไกล": "yes",
            "เพื่อไทย": "yes",
            "ภูมิใจไทย": "yes",
            "ประชาธิปัตย์": "yes",
            "รวมไทยสร้างชาติ": "yes",
            "พลังประชารัฐ": "yes",
            "ประชาชาติ": "yes",
        }
    },
    {
        id: "b10",
        title: "ร่าง พ.ร.บ. นิรโทษกรรมทางการเมือง",
        description: "นิรโทษกรรมคดีที่เกิดจากแรงจูงใจทางการเมือง เพื่อสร้างความปรองดอง",
        category: "การเมือง",
        userAgreementPct: 54,
        partyStances: {
            "ก้าวไกล": "yes",
            "เพื่อไทย": "yes",
            "ภูมิใจไทย": "no",
            "ประชาธิปัตย์": "no",
            "รวมไทยสร้างชาติ": "no",
            "พลังประชารัฐ": "no",
            "ประชาชาติ": "yes",
        }
    }
];

// Mock community comments bound to the bill IDs
export const mockComments: Record<string, MatchComment[]> = {
    "b1": [
        { id: "c1", author: "User123", text: "เห็นด้วยมากๆ เป็นสิทธิมนุษยชนพื้นฐานที่ควรมีมาตั้งนานแล้ว", timestamp: "2 ชั่วโมงที่แล้ว", likeCount: 145 },
        { id: "c2", author: "CitizenB", text: "ดีใจที่หลายพรรคสนับสนุน รอดูการบังคับใช้จริง", timestamp: "5 ชั่วโมงที่แล้ว", likeCount: 89 }
    ],
    "b2": [
        { id: "c3", author: "EcoFighter", text: "รอมานานมาก ฝุ่นเยอะจนทนไม่ไหวแล้ว ต้องคุมโรงงานให้เด็ดขาด", timestamp: "1 วันที่แล้ว", likeCount: 302 }
    ],
    "b3": [
        { id: "c4", author: "LocalBrewer", text: "ถ้าผ่านจะช่วยเกษตรกรท้องถิ่นได้เยอะมากเลย ไม่ต้องให้ทุนใหญ่ผูกขาด", timestamp: "3 ชม.ที่แล้ว", likeCount: 211 },
        { id: "c5", author: "SaveHealth", text: "กังวลเรื่องการควบคุมคุณภาพแฮะ", timestamp: "4 ชม.ที่แล้ว", likeCount: 45 }
    ]
    // Other bills will default to an empty array if not defined here
};

// // app/admin/page.tsx
// "use client";

// import { useState, useEffect, useCallback } from "react";

// interface HomeRecord {
//   id: string;
//   name: string;
//   area1: string;
//   number1: number;
//   area2: string;
//   number2: number;
//   sattaname: string;
//   from: number;
//   to: number;
//   createdAt: string;
// }

// const EMPTY_FORM = {
//   name: "",
//   area1: "",
//   number1: "",
//   area2: "",
//   number2: "",
//   sattaname: "",
//   from: "",
//   to: "",
// };

// export default function AdminPage() {
//   const [records, setRecords] = useState<HomeRecord[]>([]);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

//   const toast = (text: string, ok = true) => {
//     setMsg({ text, ok });
//     setTimeout(() => setMsg(null), 3000);
//   };

//   const fetchAll = useCallback(async () => {
//     const res = await fetch("/api/home?all=true");
//     const json = await res.json();
//     setRecords(json.data ?? []);
//   }, []);

//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const payload = {
//         ...form,
//         number1: Number(form.number1),
//         number2: Number(form.number2),
//         from: Number(form.from),
//         to: Number(form.to),
//       };

//       const method = editId ? "PUT" : "POST";
//       const body = editId ? { id: editId, ...payload } : payload;

//       const res = await fetch("/api/home", {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) throw new Error("Failed");
//       toast(editId ? "Updated successfully!" : "Created successfully!");
//       setForm(EMPTY_FORM);
//       setEditId(null);
//       fetchAll();
//     } catch {
//       toast("Something went wrong", false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (r: HomeRecord) => {
//     setEditId(r.id);
//     setForm({
//       name: r.name,
//       area1: r.area1,
//       number1: String(r.number1),
//       area2: r.area2,
//       number2: String(r.number2),
//       sattaname: r.sattaname,
//       from: String(r.from),
//       to: String(r.to),
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this record?")) return;
//     const res = await fetch("/api/home", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });
//     if (res.ok) {
//       toast("Deleted");
//       fetchAll();
//     } else {
//       toast("Delete failed", false);
//     }
//   };

//   const field = (
//     key: keyof typeof EMPTY_FORM,
//     label: string,
//     placeholder: string,
//     type = "text"
//   ) => (
//     <div style={s.fieldWrap}>
//       <label style={s.label}>{label}</label>
//       <input
//         type={type}
//         placeholder={placeholder}
//         value={form[key]}
//         onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
//         style={s.input}
//         required
//       />
//     </div>
//   );

//   return (
//     <div style={s.page}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Roboto+Condensed:wght@400;700&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { font-family: 'Roboto Condensed', sans-serif; background: #111; }
//         input:focus { outline: none; border-color: #f97316 !important; }
//         button:hover { opacity: 0.88; }
//       `}</style>

//       {/* Header */}
//       <div style={s.header}>
//         <div style={s.topBar} />
//         <div style={s.headerContent}>
//           <h1 style={s.headerTitle}>🔐 Admin Panel</h1>
//           <a href="/" style={s.viewLink}>← View Live Page</a>
//         </div>
//       </div>

//       {/* Toast */}
//       {msg && (
//         <div style={{ ...s.toast, background: msg.ok ? "#16a34a" : "#dc2626" }}>
//           {msg.text}
//         </div>
//       )}

//       {/* Form */}
//       <div style={s.card}>
//         <h2 style={s.cardTitle}>
//           {editId ? "✏️ Edit Record" : "➕ Add New Record"}
//         </h2>
//         <form onSubmit={handleSubmit} style={s.form}>
//           <div style={s.grid2}>
//             {field("name", "Site Name", "e.g. B1 SATTA")}
//             {field("sattaname", "Satta Name (bottom block)", "e.g. DISAWAR")}
//           </div>
//           <div style={s.divider}>Area 1 Result</div>
//           <div style={s.grid2}>
//             {field("area1", "Area 1 Name", "e.g. SHRI GANESH")}
//             {field("number1", "Number 1", "e.g. 03", "number")}
//           </div>
//           <div style={s.divider}>Area 2 Result</div>
//           <div style={s.grid2}>
//             {field("area2", "Area 2 Name", "e.g. DELHI MATKA")}
//             {field("number2", "Number 2", "e.g. 23", "number")}
//           </div>
//           <div style={s.divider}>Time (HHMM format)</div>
//           <div style={s.grid2}>
//             {field("from", "From Time (HHMM)", "e.g. 510 = 05:10 AM", "number")}
//             {field("to", "To Time (HHMM)", "e.g. 1730 = 05:30 PM", "number")}
//           </div>
//           <div style={s.btnRow}>
//             {editId && (
//               <button
//                 type="button"
//                 style={s.cancelBtn}
//                 onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}
//               >
//                 Cancel
//               </button>
//             )}
//             <button type="submit" style={s.submitBtn} disabled={loading}>
//               {loading ? "Saving…" : editId ? "Update Record" : "Create Record"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Records list */}
//       <div style={s.card}>
//         <h2 style={s.cardTitle}>📋 All Records ({records.length})</h2>
//         {records.length === 0 ? (
//           <p style={{ color: "#9ca3af", textAlign: "center", padding: 24 }}>No records yet.</p>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//             {records.map((r) => (
//               <div key={r.id} style={s.row}>
//                 <div style={s.rowInfo}>
//                   <span style={s.rowTitle}>{r.sattaname}</span>
//                   <span style={s.rowSub}>
//                     {r.area1}: <b style={{ color: "#fbbf24" }}>{r.number1}</b>
//                     &nbsp;|&nbsp;
//                     {r.area2}: <b style={{ color: "#fbbf24" }}>{r.number2}</b>
//                   </span>
//                   <span style={s.rowDate}>
//                     {new Date(r.createdAt).toLocaleString()}
//                   </span>
//                 </div>
//                 <div style={s.rowBtns}>
//                   <button style={s.editBtn} onClick={() => handleEdit(r)}>Edit</button>
//                   <button style={s.deleteBtn} onClick={() => handleDelete(r.id)}>Delete</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const s: Record<string, React.CSSProperties> = {
//   page: {
//     maxWidth: 800,
//     margin: "0 auto",
//     minHeight: "100vh",
//     background: "#1a1a1a",
//     paddingBottom: 60,
//   },
//   topBar: {
//     height: 8,
//     background: "linear-gradient(90deg,#f97316,#fbbf24,#f97316)",
//   },
//   header: { background: "#111", marginBottom: 24 },
//   headerContent: {
//     padding: "16px 24px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontFamily: "'Oswald', sans-serif",
//     fontSize: 26,
//     color: "#fbbf24",
//     fontWeight: 700,
//   },
//   viewLink: {
//     color: "#f97316",
//     textDecoration: "none",
//     fontWeight: 700,
//     fontSize: 15,
//   },
//   toast: {
//     position: "fixed",
//     top: 20,
//     left: "50%",
//     transform: "translateX(-50%)",
//     padding: "12px 28px",
//     borderRadius: 8,
//     color: "#fff",
//     fontWeight: 700,
//     fontSize: 16,
//     zIndex: 9999,
//     fontFamily: "'Roboto Condensed', sans-serif",
//   },
//   card: {
//     margin: "0 16px 24px",
//     background: "#262626",
//     borderRadius: 12,
//     padding: 24,
//     border: "1px solid #333",
//   },
//   cardTitle: {
//     fontFamily: "'Oswald', sans-serif",
//     fontSize: 20,
//     color: "#fbbf24",
//     marginBottom: 20,
//     fontWeight: 700,
//   },
//   form: { display: "flex", flexDirection: "column", gap: 16 },
//   grid2: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 16,
//   },
//   divider: {
//     color: "#f97316",
//     fontWeight: 700,
//     fontSize: 13,
//     textTransform: "uppercase",
//     letterSpacing: "1px",
//     borderTop: "1px solid #333",
//     paddingTop: 12,
//     marginTop: 4,
//   },
//   fieldWrap: { display: "flex", flexDirection: "column", gap: 6 },
//   label: { color: "#d1d5db", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" },
//   input: {
//     padding: "10px 14px",
//     background: "#1a1a1a",
//     border: "1.5px solid #444",
//     borderRadius: 8,
//     color: "#fff",
//     fontSize: 16,
//     fontFamily: "'Roboto Condensed', sans-serif",
//     transition: "border-color 0.2s",
//   },
//   btnRow: { display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 },
//   submitBtn: {
//     padding: "12px 32px",
//     background: "linear-gradient(135deg,#f97316,#fbbf24)",
//     color: "#111",
//     border: "none",
//     borderRadius: 8,
//     fontFamily: "'Oswald', sans-serif",
//     fontSize: 18,
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   cancelBtn: {
//     padding: "12px 24px",
//     background: "#444",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     fontFamily: "'Oswald', sans-serif",
//     fontSize: 17,
//     fontWeight: 600,
//     cursor: "pointer",
//   },
//   row: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     background: "#1a1a1a",
//     border: "1px solid #333",
//     borderRadius: 10,
//     padding: "14px 16px",
//     gap: 12,
//   },
//   rowInfo: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
//   rowTitle: {
//     fontFamily: "'Oswald', sans-serif",
//     fontSize: 20,
//     fontWeight: 700,
//     color: "#fbbf24",
//     textTransform: "uppercase",
//   },
//   rowSub: { color: "#d1d5db", fontSize: 14 },
//   rowDate: { color: "#6b7280", fontSize: 12 },
//   rowBtns: { display: "flex", gap: 8, flexShrink: 0 },
//   editBtn: {
//     padding: "8px 18px",
//     background: "#2563eb",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     fontWeight: 700,
//     cursor: "pointer",
//     fontSize: 14,
//   },
//   deleteBtn: {
//     padding: "8px 18px",
//     background: "#dc2626",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     fontWeight: 700,
//     cursor: "pointer",
//     fontSize: 14,
//   },
// };

// app/admin/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";

interface HomeRecord {
  id: string;
  name: string;
  area1: string;
  number1: number;
  area2: string;
  number2: number;
  sattaname: string;
  from: number;
  to: number;
  createdAt: string;
}

const EMPTY_FORM = {
  name: "",
  area1: "",
  number1: "",
  area2: "",
  number2: "",
  sattaname: "",
  from: "",
  to: "",
};

export default function AdminPage() {
  const [records, setRecords] = useState<HomeRecord[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const toast = (text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch("/api/home?all=true");
      const json = await res.json();
      setRecords(json.data ?? []);
    } catch {
      toast("Failed to load records", false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        number1: Number(form.number1) || 0,
        number2: Number(form.number2) || 0,
        from: Number(form.from) || 0,
        to: Number(form.to) || 0,
      };

      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...payload } : payload;

      const res = await fetch("/api/home", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed");

      toast(editId ? "Record Updated Successfully!" : "Record Created Successfully!");
      
      setForm(EMPTY_FORM);
      setEditId(null);
      fetchAll();
    } catch {
      toast("Something went wrong. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (r: HomeRecord) => {
    setEditId(r.id);
    setForm({
      name: r.name,
      area1: r.area1,
      number1: String(r.number1),
      area2: r.area2,
      number2: String(r.number2),
      sattaname: r.sattaname,
      from: String(r.from),
      to: String(r.to),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch("/api/home", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast("Record Deleted Successfully");
        fetchAll();
      } else {
        toast("Failed to delete record", false);
      }
    } catch {
      toast("Something went wrong", false);
    }
  };

  const field = (
    key: keyof typeof EMPTY_FORM,
    label: string,
    placeholder: string,
    type: "text" | "number" = "text"
  ) => (
    <div style={s.fieldWrap}>
      <label style={s.label}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        style={s.input}
      />
    </div>
  );

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Roboto+Condensed:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Roboto Condensed', sans-serif; background: #111; }
        input:focus { outline: none; border-color: #f97316 !important; }
        button:hover { opacity: 0.9; }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div style={s.topBar} />
        <div style={s.headerContent}>
          <h1 style={s.headerTitle}>🔐 Admin Panel</h1>
          <a href="/" style={s.viewLink}>← View Live Page</a>
        </div>
      </div>

      {/* Toast Notification */}
      {msg && (
        <div style={{ ...s.toast, background: msg.ok ? "#16a34a" : "#dc2626" }}>
          {msg.text}
        </div>
      )}

      {/* Form */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>
          {editId ? "✏️ Edit Record" : "➕ Add New Record"}
        </h2>

        <form onSubmit={handleSubmit} style={s.form}>
   

          <div style={s.divider}>Area 1 Result</div>
          <div style={s.grid2}>
            {field("area1", "Area 1 Name", "e.g. SHRI GANESH")}
            {field("number1", "Number 1", "e.g. 03", "number")}
          </div>

          <div style={s.divider}>Area 2 Result</div>
          <div style={s.grid2}>
            {field("area2", "Area 2 Name", "e.g. DELHI MATKA")}
            {field("number2", "Number 2", "e.g. 23", "number")}
          </div>

          <div style={s.divider}>Time (HHMM format)</div>
          <div style={s.grid2}>
            {field("from", "From Time (HHMM)", "e.g. 510", "number")}
            {field("to", "To Time (HHMM)", "e.g. 1730", "number")}
          </div>

          <div style={s.btnRow}>
            {editId && (
              <button
                type="button"
                style={s.cancelBtn}
                onClick={() => {
                  setEditId(null);
                  setForm(EMPTY_FORM);
                }}
              >
                Cancel
              </button>
            )}
            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? "Saving..." : editId ? "Update Record" : "Create Record"}
            </button>
          </div>
        </form>
      </div>

      {/* Records List */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>📋 All Records ({records.length})</h2>

        {records.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center", padding: "40px 20px" }}>
            No records found. Add your first record above.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {records.map((r) => (
              <div key={r.id} style={s.row}>
                <div style={s.rowInfo}>
                  <span style={s.rowTitle}>{r.sattaname}</span>
                  <span style={s.rowSub}>
                    {r.area1}: <b style={{ color: "#fbbf24" }}>{r.number1}</b> | 
                    {r.area2}: <b style={{ color: "#fbbf24" }}>{r.number2}</b>
                  </span>
                  <span style={s.rowDate}>
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </div>

                <div style={s.rowBtns}>
                  <button style={s.editBtn} onClick={() => handleEdit(r)}>
                    Edit
                  </button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(r.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 820,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#1a1a1a",
    paddingBottom: 80,
  },
  topBar: {
    height: 8,
    background: "linear-gradient(90deg,#f97316,#fbbf24,#f97316)",
  },
  header: { background: "#111", marginBottom: 24 },
  headerContent: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: 28,
    color: "#fbbf24",
    fontWeight: 700,
  },
  viewLink: {
    color: "#f97316",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 15,
  },
  toast: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "14px 32px",
    borderRadius: 8,
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    zIndex: 9999,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
  },
  card: {
    margin: "0 16px 24px",
    background: "#262626",
    borderRadius: 12,
    padding: 28,
    border: "1px solid #333",
  },
  cardTitle: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: 22,
    color: "#fbbf24",
    marginBottom: 24,
    fontWeight: 700,
  },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  divider: {
    color: "#f97316",
    fontWeight: 700,
    fontSize: 13.5,
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderTop: "1px solid #444",
    paddingTop: 16,
    marginTop: 8,
  },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    color: "#d1d5db",
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px 14px",
    background: "#1a1a1a",
    border: "1.5px solid #444",
    borderRadius: 8,
    color: "#fff",
    fontSize: 16,
    fontFamily: "'Roboto Condensed', sans-serif",
  },
  btnRow: { display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 12 },
  submitBtn: {
    padding: "13px 36px",
    background: "linear-gradient(135deg,#f97316,#fbbf24)",
    color: "#111",
    border: "none",
    borderRadius: 8,
    fontFamily: "'Oswald', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "13px 28px",
    background: "#444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontFamily: "'Oswald', sans-serif",
    fontSize: 17,
    fontWeight: 600,
    cursor: "pointer",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: 10,
    padding: "16px 18px",
    gap: 12,
  },
  rowInfo: { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  rowTitle: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: 21,
    fontWeight: 700,
    color: "#fbbf24",
    textTransform: "uppercase",
  },
  rowSub: { color: "#d1d5db", fontSize: 14.5, lineHeight: 1.4 },
  rowDate: { color: "#6b7280", fontSize: 12.5 },
  rowBtns: { display: "flex", gap: 10 },
  editBtn: {
    padding: "8px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
  deleteBtn: {
    padding: "8px 20px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
};
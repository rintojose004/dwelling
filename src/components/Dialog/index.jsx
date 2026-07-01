import React, { useEffect, useRef, useState } from "react";
import { HiOutlineX, HiOutlineCalendar, HiCheckCircle } from "react-icons/hi";

const LABEL = "text-xs font-semibold text-dwelling-primary mb-2 inline-block";
const ERROR_TEXT = "text-xs text-red-600 mt-1";
const INPUT_BASE = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none transition focus:border-dwelling-accent focus:ring-2 focus:ring-dwelling-accent/20";
const INPUT_ERROR = "border-red-500 focus:border-red-500 focus:ring-red-100";

const TIMES = ["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

export default function BookVisitDialog({ open, onClose }) {

  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successRefId, setSuccessRefId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      setTimeout(() => firstInputRef.current?.focus?.(), 20);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setDate("");
      setTime("");
      setName("");
      setPhone("");
      setEmail("");
      setNotes("");
      setSubmitting(false);
      setErrors({});
      setSuccessRefId(null);
    }
  }, [open]);

  const validate = () => {
    const errs = {};
    if (!date) errs.date = "Choose a date.";
    if (!time) errs.time = "Select a time slot.";
    if (!name || name.trim().length < 2) errs.name = "Enter your name.";
    if (!phone || !/^[\d()+\-\s]{7,15}$/.test(phone)) errs.phone = "Enter a valid phone.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    return errs;
  };

  const makeRefId = () => `ENQ-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (submitting) return;

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 850));
      const ref = makeRefId();
      setSuccessRefId(ref);
      setTimeout(() => onClose?.(), 1400);
    } catch (err) {
      setErrors({ form: "Unable to send request. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div ref={dialogRef} onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full sm:w-[90%] max-w-md sm:max-w-lg md:max-w-3xl rounded-2xl overflow-hidden" >
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl ring-1 ring-black/5 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <button  onClick={onClose}  aria-label="Close" 
            className="absolute top-4 right-4 text-dwelling-muted hover:text-dwelling-primary transition">
            <HiOutlineX className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-dwelling-accent-light">
              <HiOutlineCalendar className="text-dwelling-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-serif font-bold text-dwelling-dark">Schedule a Visit</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className={LABEL}>Date</label>
              <input ref={firstInputRef} type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className={`${INPUT_BASE} ${errors.date ? INPUT_ERROR : ""}`}
                min={new Date().toISOString().split("T")[0]} />
              {errors.date && <div className={ERROR_TEXT}>{errors.date}</div>}
            </div>

            <div>
              <label className={LABEL}>Time</label>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((t) => {
                  const active = time === t;
                  return (
                    <button key={t} type="button" onClick={() => setTime(t)}
                      className={`px-3 py-2 rounded-lg text-sm border border-gray-200 transition ${
                        active ? "bg-dwelling-accent text-white border-dwelling-accent" 
                        : "bg-white text-dwelling-primary hover:bg-gray-50"}`}>{t}</button>);
                })}
              </div>
              {errors.time && <div className={ERROR_TEXT}>{errors.time}</div>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Full name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className={`${INPUT_BASE} ${errors.name ? INPUT_ERROR : ""}`} placeholder="Your name" />
                {errors.name && <div className={ERROR_TEXT}>{errors.name}</div>}
              </div>

              <div>
                <label className={LABEL}>Mobile</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className={`${INPUT_BASE} ${errors.phone ? INPUT_ERROR : ""}`} placeholder="+91 98765 43210" />
                {errors.phone && <div className={ERROR_TEXT}>{errors.phone}</div>}
              </div>
            </div>

            <div>
              <label className={LABEL}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className={`${INPUT_BASE} ${errors.email ? INPUT_ERROR : ""}`} placeholder="you@example.com" />
              {errors.email && <div className={ERROR_TEXT}>{errors.email}</div>}
            </div>

            <div>
              <label className={LABEL}>Notes (optional)</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
                className={INPUT_BASE} placeholder="Any notes for the agent (optional)" />
            </div>

            <div>
              <button type="submit" disabled={submitting} className="w-full rounded-lg py-3 text-sm  font-semibold transition 
                disabled:opacity-70 disabled:cursor-not-allowed bg-dwelling-accent text-dwelling-light hover:opacity-90">
                {submitting ? "Confirming..." : "Confirm Visit"}
              </button>
            </div>

            {successRefId && (
              <div className="mt-3 flex items-center gap-3 text-sm text-emerald-700" role="status" aria-live="polite">
                <HiCheckCircle className="text-emerald-600 shrink-0 w-5 h-5" />
                <span>Thanks — your request (Ref {successRefId}) has been received.</span>
              </div>)}
          </form>
        </div>
      </div>
    </div>
  );
}
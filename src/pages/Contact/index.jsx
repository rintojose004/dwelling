import React, { useState, useRef } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";

const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).toLowerCase());
const isValidPhone = (s) => /^[\d()+\-\s]{7,15}$/.test(String(s).trim());

const LABEL = "block text-sm font-medium text-[var(--color-dwelling-primary)] mb-1";
const INPUT_CLASSES = `w-full px-3 py-3 rounded-lg text-base border border-gray-200 outline-none transition-all duration-200 focus:border-dwelling-accent focus:ring-2 focus:ring-dwelling-accent/10`;
const ERROR_INPUT_CLASSES = "border-red-500 focus:border-red-500 focus:ring-red-100";
const ERROR_TEXT = "mt-1 text-xs text-red-600";
const CHECK_ITEM = "flex items-center text-sm font-medium text-dwelling-primary";
const CHECK_ICON = "text-xl text-dwelling-accent mr-3";

const IMAGE_SRC = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3";

export default function Contact() {

  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const confirmationRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!form.phone || !isValidPhone(form.phone)) errs.phone = "Enter a valid phone number.";
    if (!form.email || !isValidEmail(form.email)) errs.email = "Enter a valid email address.";
    if (!form.message || form.message.trim().length < 6) errs.message = "Please enter a short message (min 6 chars).";
    return errs;
  };

  const makeRefId = () => `ENQ-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      const ref = makeRefId();
      setConfirmation({ ref });
      setForm({ name: "", phone: "", email: "", message: "" });
      setErrors({});
      setTimeout(() => confirmationRef.current?.focus?.(), 50);
    } catch (err) {
      setErrors({ form: "Something went wrong — please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`bg-dwelling-surface min-h-screen pt-20 lg:pt-24 pb-12 flex justify-center items-center`}>
      <div className="max-w-7xl mx-auto w-full px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          {/* Left: Contact Form */}
          <div className="w-full lg:w-1/2 p-5 lg:p-6">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-dwelling-primary mb-1">Contact Us</h1>
            <p className="text-base text-dwelling-muted mb-4">Send your enquiry and we'll get back to you shortly.</p>

            {errors.form && <div role="alert" className="mb-3 text-sm text-red-600">{errors.form}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className={LABEL}>Your Name</label>
                  <input id="name" name="name" type="text" placeholder="Full name" value={form.name} onChange={handleChange}
                    aria-invalid={!!errors.name} className={`${INPUT_CLASSES} ${errors.name ? ERROR_INPUT_CLASSES : ""}`} />
                  {errors.name && <div className={ERROR_TEXT}>{errors.name}</div>}
                </div>

                <div>
                  <label htmlFor="phone" className={LABEL}>Mobile Number</label>
                  <input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange}
                    aria-invalid={!!errors.phone} className={`${INPUT_CLASSES} ${errors.phone ? ERROR_INPUT_CLASSES : ""}`} />
                  {errors.phone && <div className={ERROR_TEXT}>{errors.phone}</div>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className={LABEL}>Email Address</label>
                  <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
                    aria-invalid={!!errors.email} className={`${INPUT_CLASSES} ${errors.email ? ERROR_INPUT_CLASSES : ""}`} />
                  {errors.email && <div className={ERROR_TEXT}>{errors.email}</div>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="message" className={LABEL}>Message</label>
                  <textarea id="message" name="message" rows="1" placeholder="Tell us about your enquiry..." value={form.message}
                    onChange={handleChange} aria-invalid={!!errors.message} className={`${INPUT_CLASSES} resize-none`}
                    style={{ height: "48px", lineHeight: "1.2" }} />
                  {errors.message && <div className={ERROR_TEXT}>{errors.message}</div>}
                </div>
              </div>

              <div className="mt-3">
                <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-lg font-semibold text-base transition-all
                 duration-300 hover:shadow-lg active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "var(--color-dwelling-accent)", color: "var(--color-dwelling-light)" }}>
                  {submitting ? "Sending..." : "Send Enquiry"}</button>
              </div>

              {confirmation && (
                <div ref={confirmationRef} tabIndex={-1} role="status" aria-live="polite"
                  className="mt-4 p-3 rounded-md border flex items-center justify-between"
                  style={{ borderColor: "rgba(0,0,0,0.06)", background: "var(--color-dwelling-light)" }}>
                  <div className="flex items-center gap-3">
                    <HiOutlineCheckCircle className="text-2xl text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-700">
                      Thank you, your enquiry ({confirmation.ref}) has been received.</p>
                  </div>
                  <button onClick={() => setConfirmation(null)} aria-label="Dismiss confirmation"
                    className="ml-4 text-sm text-dwelling-muted hover:text-dwelling-primary">Close</button>
                </div>)}
            </form>
          </div>

          {/* Right: image panel */}
          <div className="w-full lg:w-1/2 bg-dwelling-surface relative hidden lg:block">
            <img src={IMAGE_SRC} alt="Interior"
              className="absolute inset-0 w-full h-1/2 object-cover" style={{ objectPosition: "center" }} />

            <div className="absolute bottom-0 left-0 right-0 h-1/2 p-10 flex flex-col justify-center">
              <h3 className="text-xl font-serif font-bold text-dwelling-primary mb-4">Why reach out?</h3>

              <ul className="space-y-3">
                <li className={CHECK_ITEM}>
                  <HiOutlineCheckCircle className={CHECK_ICON} /> Expert property guidance
                </li>
                <li className={CHECK_ITEM}>
                  <HiOutlineCheckCircle className={CHECK_ICON} /> Quick responses
                </li>
                <li className={CHECK_ITEM}>
                  <HiOutlineCheckCircle className={CHECK_ICON} /> Verified listings
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
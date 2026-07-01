import React from "react";
import { HiOutlinePhone, HiOutlineMail } from "react-icons/hi";

const AgentCard = ({ agent }) => {
  if (!agent) return null;

  const details = [
    { label: "Phone", value: agent.phone, icon: HiOutlinePhone },
    { label: "Email", value: agent.email, icon: HiOutlineMail },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row items-center gap-5 bg-gray-50 p-6 text-center sm:text-left">
        <img src={agent.image} alt={agent.name} loading="lazy"
          className="h-20 w-20 rounded-2xl object-cover border border-gray-200 shadow-sm shrink-0" />

        <div className="min-w-0 flex-1">
          <h3 title={agent.name} className="truncate text-xl font-semibold text-dwelling-dark">{agent.name}</h3>
          <p className="mt-1 text-sm text-dwelling-muted">{agent.designation}</p>
          {agent.experience && (
            <span className="mt-3 inline-flex rounded-full bg-dwelling-accent/10 px-3 py-1 text-xs 
             font-semibold text-dwelling-accent">{agent.experience} Experience</span>)}
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        {details.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dwelling-accent/10 
            text-dwelling-accent shrink-0"><Icon size={18} /></div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-dwelling-muted">{label}</p>
              <p title={value} className="mt-1 break-all text-sm font-medium text-dwelling-dark">{value}</p>
            </div>
          </div>))}
      </div>
    </div>
  );
};

export default AgentCard;

"use client";

import { useState } from "react";
import { ProfileForm } from "@/components/ProfileForm";

type ProfilePanelProps = { userId: string; initialName: string; initialEmail: string };

export function ProfilePanel({ userId, initialName, initialEmail }: ProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  return <div className="profile-panel"><div className="profile-info-card"><div><span className="eyebrow">Profile information</span><h2>{displayName || "Your information"}</h2><dl className="profile-details"><div><dt>Name</dt><dd>{displayName || "Not provided"}</dd></div><div><dt>Email</dt><dd>{email}</dd></div></dl></div><button className="table-action" type="button" onClick={() => setIsEditing((current) => !current)}>{isEditing ? "Close" : "Edit profile"}</button></div>{isEditing && <ProfileForm userId={userId} initialName={displayName} initialEmail={email} onSaved={(name, updatedEmail) => { setDisplayName(name); setEmail(updatedEmail); }} onCancel={() => setIsEditing(false)} />}</div>;
}
